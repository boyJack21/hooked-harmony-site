import pg from "pg";
import { randomUUID } from "node:crypto";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const yocoSecretKey = process.env.YOCO_SECRET_KEY;

const pool = new Pool({
  connectionString,
  ssl: isLocalDatabase(connectionString) ? false : { rejectUnauthorized: false },
});

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (!connectionString || !yocoSecretKey) {
    response.status(500).json({ message: "Payment configuration is incomplete" });
    return;
  }

  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    const checkout = await createYocoCheckout(body, request.headers.origin);
    response.status(200).json(checkout);
  } catch (error) {
    console.error("Yoco checkout error:", error);
    response.status(error.statusCode ?? 500).json({
      message: error.publicMessage ?? "Could not start checkout",
    });
  }
}

async function createYocoCheckout(body, origin) {
  const customer = normalizeCustomer(body?.customer);
  const cart = normalizeCart(body?.cart);
  const client = await pool.connect();

  try {
    const { items, amountInCents } = await resolveCart(client, cart);

    if (amountInCents < 200) {
      throw userError("Yoco payments must be at least R2.00.");
    }

    await client.query("BEGIN");

    const orderResult = await client.query(
      `
        INSERT INTO orders (
          customer_name,
          customer_email,
          customer_phone,
          delivery_address,
          cart_data,
          total_amount,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'pending_payment')
        RETURNING id
      `,
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.deliveryAddress,
        JSON.stringify(items),
        amountInCents,
      ],
    );

    const orderId = orderResult.rows[0].id;
    const idempotencyKey = randomUUID();
    const siteUrl = getSiteUrl(origin);
    const yocoResponse = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${yocoSecretKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: "ZAR",
        successUrl: `${siteUrl}/cart?payment=success`,
        cancelUrl: `${siteUrl}/cart?payment=cancelled`,
        failureUrl: `${siteUrl}/cart?payment=failed`,
        metadata: {
          orderId,
        },
        externalId: orderId,
        clientReferenceId: orderId,
      }),
    });

    const yocoCheckout = await yocoResponse.json().catch(() => null);

    if (!yocoResponse.ok || !yocoCheckout?.redirectUrl) {
      throw userError(yocoCheckout?.message ?? "Yoco rejected the checkout request.");
    }

    await client.query(
      `
        UPDATE orders
        SET yoco_checkout_id = $1, updated_at = now()
        WHERE id = $2
      `,
      [yocoCheckout.id, orderId],
    );

    await client.query("COMMIT");

    return {
      orderId,
      checkoutId: yocoCheckout.id,
      redirectUrl: yocoCheckout.redirectUrl,
    };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

async function resolveCart(client, cart) {
  const slugs = [...new Set(cart.map((item) => item.slug))];
  const result = await client.query(
    `
      SELECT
        p.slug,
        p.name,
        p.image,
        p.base_price,
        ps.size,
        ps.price AS size_price
      FROM products p
      LEFT JOIN product_sizes ps ON ps.product_id = p.id
      WHERE p.slug = ANY($1::text[])
    `,
    [slugs],
  );

  const products = new Map();
  for (const row of result.rows) {
    const product = products.get(row.slug) ?? {
      slug: row.slug,
      name: row.name,
      image: row.image,
      basePrice: row.base_price,
      sizes: new Map(),
    };

    if (row.size) product.sizes.set(row.size, row.size_price);
    products.set(row.slug, product);
  }

  const items = cart.map((item) => {
    const product = products.get(item.slug);
    if (!product) throw userError(`Product is no longer available: ${item.name}`);

    const price = product.sizes.get(item.size) ?? product.basePrice;
    return {
      slug: product.slug,
      name: product.name,
      image: product.image,
      size: item.size,
      color: item.color,
      qty: item.qty,
      unitAmount: price * 100,
      totalAmount: price * item.qty * 100,
    };
  });

  return {
    items,
    amountInCents: items.reduce((total, item) => total + item.totalAmount, 0),
  };
}

function normalizeCustomer(customer = {}) {
  const name = String(customer.name ?? "").trim();
  const email = String(customer.email ?? "").trim();
  const phone = String(customer.phone ?? "").trim();
  const deliveryAddress = String(customer.deliveryAddress ?? "").trim();

  if (!name || !email || !deliveryAddress) {
    throw userError("Name, email, and delivery address are required.");
  }

  return { name, email, phone, deliveryAddress };
}

function normalizeCart(cart = []) {
  if (!Array.isArray(cart) || !cart.length) throw userError("Your cart is empty.");

  return cart.map((item) => ({
    slug: String(item.slug ?? ""),
    name: String(item.name ?? ""),
    size: String(item.size ?? "One size"),
    color: String(item.color ?? ""),
    qty: Math.max(1, Math.min(99, Number(item.qty) || 1)),
  }));
}

function userError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.publicMessage = message;
  return error;
}

function getSiteUrl(origin) {
  return (process.env.SITE_URL || origin || "http://localhost:8080").replace(/\/$/, "");
}

function isLocalDatabase(value = "") {
  return value.includes("localhost") || value.includes("127.0.0.1");
}
