# hooked-harmony-site

## Database

This project is set up for plain PostgreSQL instead of Supabase.

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Run the schema in `db/schema.sql` against the database.
4. Seed the product catalog:

```bash
cd server
npm run seed:products
```

The current Vite storefront keeps products in `src/data/products.ts`, cart and
wishlist state in `localStorage`, and order/contact forms as email links. Use a
server-side API route for any future reads or writes to PostgreSQL so the
database URL is never exposed to the browser.

## Vercel

Set these variables in Vercel under Project Settings -> Environment Variables:

```text
DATABASE_URL
SITE_URL
YOCO_SECRET_KEY
YOCO_WEBHOOK_SECRET
```

Do not set `VITE_API_URL` in Vercel unless the API is hosted on a different
domain; production uses the same-origin `/api/products` serverless function.
Use your Yoco test secret key while testing. Switch to the live secret key only
after your production domain is verified in Yoco.

The Vercel build uses:

```bash
npm run build
```

with `dist` as the output directory. API routes live in `api/`.

Register this webhook URL in Yoco:

```text
https://your-domain.vercel.app/api/yoco/webhook
```
