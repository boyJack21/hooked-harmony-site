const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
