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
