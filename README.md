# Hooked Harmony Site

A full-stack e-commerce storefront for a handmade crochet brand. The project combines a React/TypeScript frontend with server-side API routes, PostgreSQL persistence, Yoco checkout integration, verified payment webhooks, and transactional order-confirmation email.

## What the application does

Customers can browse products, manage a cart and wishlist, submit custom-order requests, and complete checkout through Yoco. Product and order data are stored in PostgreSQL. Payment success is confirmed server-side through a signed webhook before an order is marked as paid and a confirmation email is sent.

## Architecture

```text
React + TypeScript storefront
          |
          | same-origin API calls
          v
Vercel / Node API routes
          |
          +----> PostgreSQL
          |
          +----> Yoco Checkout API
          |          |
          |          v
          |     Signed webhook
          |
          +----> Resend email API
```

## Key engineering features

- React + TypeScript storefront
- PostgreSQL-backed product and order data
- Server-side price resolution so checkout totals are not trusted from the browser
- Yoco checkout integration
- HMAC webhook signature verification with timestamp validation
- Order status persistence and payment identifiers
- Transactional order-confirmation emails through Resend
- Environment-based secret management
- Strict server-side product/variant price validation
- Checkout origin validation and best-effort request throttling
- Security headers for the production deployment
- Vercel serverless API routes
- Responsive product, cart, wishlist, and custom-order flows

## Security decisions

- Payment and email credentials are read from environment variables and are never exposed to the browser.
- Product prices and valid size variants are resolved from PostgreSQL on the server before checkout; invalid variants are rejected rather than falling back to another price.
- Customer and cart inputs are length/type validated before persistence.
- Checkout requests are restricted to configured storefront origins and use a small in-process abuse throttle. Production infrastructure should still provide edge-level rate limiting.
- Webhook signatures are verified using the configured Yoco webhook secret before payment state is accepted.
- Production responses include CSP, clickjacking, MIME-sniffing, referrer, permissions, and HSTS headers.
- Hosted PostgreSQL can use `DB_CA_CERT` to enable certificate-verified TLS.
- `.env` files are excluded from source control.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. Create a PostgreSQL database and update `DATABASE_URL`.

4. Run the schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

5. Seed the product catalog if required:

```bash
cd server
npm install
npm run seed:products
cd ..
```

6. Start the storefront:

```bash
npm run dev
```

## Environment variables

The project expects the variables documented in `.env.example`, including:

- `DATABASE_URL`
- `SITE_URL`
- `ALLOWED_CHECKOUT_ORIGINS`
- `DB_CA_CERT` (recommended for verified TLS with hosted PostgreSQL)
- `EMAIL_ASSET_BASE_URL`
- `YOCO_SECRET_KEY`
- `YOCO_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `ORDER_EMAIL_FROM`
- `ORDER_EMAIL_REPLY_TO`

For production, configure them in the hosting platform rather than committing them to Git.

## What I focused on

This project demonstrates end-to-end ownership across frontend development, relational data modelling, backend API design, payment integration, webhook verification, transactional email, and deployment-oriented configuration.


## Production notes

The production storefront is deployed at [www.everythinghooked.online](https://www.everythinghooked.online).

For production, set `SITE_URL` to the canonical HTTPS storefront URL and set
`ALLOWED_CHECKOUT_ORIGINS` to the exact storefront origin(s), separated by commas
if both apex and `www` domains are accepted.

The application contains a small in-process checkout throttle as a second line of
defence. Because serverless instances are distributed and short-lived, production
rate limiting should also be configured at the hosting/edge layer.

The `server/` directory provides a local Express development API. Production on
Vercel uses the serverless handlers under `api/`.

The public health endpoint intentionally returns only `{"status":"ok"}` when the
database check succeeds; it does not expose database metadata or server time.
