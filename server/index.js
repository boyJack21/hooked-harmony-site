const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { randomUUID } = require('crypto');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'ok',
      database: 'connected',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.slug,
        p.name,
        COALESCE(c.name, 'Uncategorized') AS category,
        p.image,
        p.alt,
        p.description,
        p.price_label,
        p.base_price,
        COALESCE(
          json_agg(
            json_build_object('size', ps.size, 'price', ps.price)
            ORDER BY ps.sort_order, ps.size
          ) FILTER (WHERE ps.id IS NOT NULL),
          '[]'::json
        ) AS sizes
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_sizes ps ON ps.product_id = p.id
      GROUP BY p.id, c.name
      ORDER BY p.sort_order, p.created_at
    `);

    res.json(
      result.rows.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        image: product.image,
        alt: product.alt,
        description: product.description,
        priceLabel: product.price_label,
        basePrice: product.base_price,
        sizes: product.sizes,
      }))
    );
  } catch (error) {
    console.error('Products error:', error);

    res.status(500).json({
      message: 'Failed to load products',
      error: error.message,
    });
  }
});

app.post('/api/yoco/checkout', async (req, res) => {
  if (!process.env.YOCO_SECRET_KEY) {
    res.status(500).json({ message: 'Payment configuration is incomplete' });
    return;
  }

  const client = await pool.connect();

  try {
    const customer = normalizeCustomer(req.body?.customer);
    const cart = normalizeCart(req.body?.cart);
    const { items, amountInCents } = await resolveCart(client, cart);

    if (amountInCents < 200) {
      res.status(400).json({ message: 'Yoco payments must be at least R2.00.' });
      return;
    }

    await client.query('BEGIN');

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
    const siteUrl = getSiteUrl(req.headers.origin);
    const yocoResponse = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': randomUUID(),
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'ZAR',
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
      await client.query('ROLLBACK');
      res.status(400).json({ message: yocoCheckout?.message ?? 'Yoco rejected the checkout request.' });
      return;
    }

    await client.query(
      `
        UPDATE orders
        SET yoco_checkout_id = $1, updated_at = now()
        WHERE id = $2
      `,
      [yocoCheckout.id, orderId],
    );

    await client.query('COMMIT');

    res.json({
      orderId,
      checkoutId: yocoCheckout.id,
      redirectUrl: yocoCheckout.redirectUrl,
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Yoco checkout error:', error);

    res.status(error.statusCode ?? 500).json({
      message: error.publicMessage ?? 'Could not start checkout',
    });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

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
  const name = String(customer.name ?? '').trim();
  const email = String(customer.email ?? '').trim();
  const phone = String(customer.phone ?? '').trim();
  const deliveryAddress = String(customer.deliveryAddress ?? '').trim();

  if (!name || !email || !deliveryAddress) {
    throw userError('Name, email, and delivery address are required.');
  }

  return { name, email, phone, deliveryAddress };
}

function normalizeCart(cart = []) {
  if (!Array.isArray(cart) || !cart.length) throw userError('Your cart is empty.');

  return cart.map((item) => ({
    slug: String(item.slug ?? ''),
    name: String(item.name ?? ''),
    size: String(item.size ?? 'One size'),
    color: String(item.color ?? ''),
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
  return (process.env.SITE_URL || origin || 'http://localhost:8080').replace(/\/$/, '');
}
