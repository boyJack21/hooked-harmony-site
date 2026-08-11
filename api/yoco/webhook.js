import crypto from "node:crypto";
import pg from "pg";
import { sendOrderConfirmationEmail } from "../_lib/order-email.js";

const { Pool } = pg;

export const config = {
  api: {
    bodyParser: false,
  },
};

const connectionString = process.env.DATABASE_URL;
const webhookSecret = process.env.YOCO_WEBHOOK_SECRET;

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

  if (!connectionString || !webhookSecret) {
    response.status(500).json({ message: "Webhook configuration is incomplete" });
    return;
  }

  const rawBody = await readBody(request);

  if (!verifyWebhook(request.headers, rawBody)) {
    response.status(403).json({ message: "Invalid webhook signature" });
    return;
  }

  const event = JSON.parse(rawBody);
  const checkoutId = event?.payload?.metadata?.checkoutId;
  const orderId = event?.payload?.metadata?.orderId;
  const paymentId = event?.payload?.id;
  const paymentStatus = event?.payload?.status;

  if (
    (event?.type === "payment.succeeded" || paymentStatus === "succeeded") &&
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

  response.status(200).json({ received: true });
}

function verifyWebhook(headers, rawBody) {
  const id = headers["webhook-id"];
  const timestamp = headers["webhook-timestamp"];
  const signatureHeader = headers["webhook-signature"];

  if (!id || !timestamp || !signatureHeader) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 180) return false;

  const signedContent = `${id}.${timestamp}.${rawBody}`;
  const secretBytes = Buffer.from(webhookSecret.split("_")[1] ?? "", "base64");
  const expectedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  return signatureHeader.split(" ").some((signaturePart) => {
    const signature = signaturePart.split(",")[1];
    if (!signature) return false;

    const expected = Buffer.from(expectedSignature);
    const actual = Buffer.from(signature);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function isLocalDatabase(value = "") {
  return value.includes("localhost") || value.includes("127.0.0.1");
}
