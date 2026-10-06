const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');
const { randomUUID } = crypto;
const { sendOrderConfirmationEmail } = require('./order-email');
require('dotenv').config();

const app = express();

const allowedOrigins = (process.env.ALLOWED_CHECKOUT_ORIGINS || process.env.SITE_URL || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  },
}));
app.use(express.json({
  verify: (req, _res, buffer) => {
    req.rawBody = buffer.toString('utf8');
  },
}));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({ status: 'ok' });
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

app.post('/api/yoco/webhook', async (req, res) => {
  if (!process.env.YOCO_WEBHOOK_SECRET) {
    res.status(500).json({ message: 'Webhook configuration is incomplete' });
    return;
  }

  const rawBody = req.rawBody ?? JSON.stringify(req.body ?? {});

  if (!verifyWebhook(req.headers, rawBody)) {
    res.status(403).json({ message: 'Invalid webhook signature' });
    return;
  }

  const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const checkoutId = event?.payload?.metadata?.checkoutId;
  const orderId = event?.payload?.metadata?.orderId;
  const paymentId = event?.payload?.id;
  const paymentStatus = event?.payload?.status;

  try {
    if (
      (event?.type === 'payment.succeeded' || paymentStatus === 'succeeded') &&
      (checkoutId || orderId)
    ) {
      const orderResult = await pool.query(
        `
          UPDATE orders
          SET
            status = 'paid',
            yoco_payment_id = $1,
            paid_at = now(),
            updated_at = now()
          WHERE yoco_checkout_id = $2 OR id = $3
          RETURNING *
        `,
        [paymentId, checkoutId, orderId],
      );

      const order = orderResult.rows[0];

      if (order && !order.confirmation_email_sent_at) {
        const emailResult = await sendOrderConfirmationEmail(order);

        if (!emailResult.skipped) {
          await pool.query(
            `
              UPDATE orders
              SET confirmation_email_sent_at = now(), updated_at = now()
              WHERE id = $1
            `,
            [order.id],
          );
        }
      }
    } else if ((checkoutId || orderId) && paymentStatus) {
      await pool.query(
        `
          UPDATE orders
          SET status = $1, updated_at = now()
          WHERE yoco_checkout_id = $2 OR id = $3
        `,
        [paymentStatus, checkoutId, orderId],
      );
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Yoco webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
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

    let price;

    if (product.sizes.size > 0) {
      if (!product.sizes.has(item.size)) {
        throw userError(`Invalid size selected for ${product.name}.`);
      }
      price = product.sizes.get(item.size);
    } else {
      if (item.size !== 'One size') {
        throw userError(`Invalid size selected for ${product.name}.`);
      }
      price = product.basePrice;
    }

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

  if (name.length > 120 || email.length > 254 || phone.length > 40 || deliveryAddress.length > 500) {
    throw userError('Customer details are too long.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw userError('Enter a valid email address.');
  }

  return { name, email, phone, deliveryAddress };
}

function normalizeCart(cart = []) {
  if (!Array.isArray(cart) || !cart.length) throw userError('Your cart is empty.');

  if (cart.length > 50) throw userError('Too many items in one checkout.');

  return cart.map((item) => {
    const slug = String(item.slug ?? '').trim();
    const size = String(item.size ?? 'One size').trim();
    const color = String(item.color ?? '').trim();
    const qty = Number(item.qty);

    if (!slug || slug.length > 120 || size.length > 80 || color.length > 80) {
      throw userError('Invalid cart item.');
    }

    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      throw userError('Item quantity must be between 1 and 20.');
    }

    return {
      slug,
      name: String(item.name ?? '').slice(0, 160),
      size,
      color,
      qty,
    };
  });
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

function verifyWebhook(headers, rawBody) {
  const id = headers['webhook-id'];
  const timestamp = headers['webhook-timestamp'];
  const signatureHeader = headers['webhook-signature'];

  if (!id || !timestamp || !signatureHeader) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 180) return false;

  const signedContent = `${id}.${timestamp}.${rawBody}`;
  const secretBytes = Buffer.from((process.env.YOCO_WEBHOOK_SECRET || '').split('_')[1] ?? '', 'base64');
  const expectedSignature = crypto
    .createHmac('sha256', secretBytes)
    .update(signedContent)
    .digest('base64');

  return signatureHeader.split(' ').some((signaturePart) => {
    const signature = signaturePart.split(',')[1];
    if (!signature) return false;

    const expected = Buffer.from(expectedSignature);
    const actual = Buffer.from(signature);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  });
}
