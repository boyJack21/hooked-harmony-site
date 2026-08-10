import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: isLocalDatabase(connectionString) ? false : { rejectUnauthorized: false },
});

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (!connectionString) {
    response.status(500).json({ message: "DATABASE_URL is not configured" });
    return;
  }

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

    response.status(200).json(
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
      })),
    );
  } catch (error) {
    console.error("Products error:", error);
    response.status(500).json({ message: "Failed to load products" });
  }
}

function isLocalDatabase(value = "") {
  return value.includes("localhost") || value.includes("127.0.0.1");
}
