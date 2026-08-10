const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { Pool } = require('pg');
require('dotenv').config();

const projectRoot = path.resolve(__dirname, '..');
const productsPath = path.join(projectRoot, 'src/data/products.ts');
const publicDir = path.join(projectRoot, 'public');

function loadCatalog() {
  const typescriptPath = require.resolve('typescript', { paths: [projectRoot] });
  const ts = require(typescriptPath);
  const source = fs.readFileSync(productsPath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    require,
    module,
  };

  vm.runInNewContext(compiled, sandbox, { filename: productsPath });
  return sandbox.module.exports;
}

function imagePathToFile(imagePath) {
  if (!imagePath.startsWith('/')) {
    throw new Error(`Image path must start with "/": ${imagePath}`);
  }

  return path.join(publicDir, imagePath.slice(1));
}

function assertImagesExist(products) {
  const missing = products
    .map((product) => ({ product, file: imagePathToFile(product.image) }))
    .filter(({ file }) => !fs.existsSync(file));

  if (missing.length) {
    const details = missing
      .map(({ product, file }) => `- ${product.slug}: ${product.image} (${file})`)
      .join('\n');
    throw new Error(`Missing product images:\n${details}`);
  }
}

async function seedProducts() {
  const { categories, products } = loadCatalog();
  assertImagesExist(products);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const categoryIds = new Map();

    for (const [index, category] of categories.entries()) {
      const result = await client.query(
        `
          INSERT INTO categories (slug, name, badge, sort_order)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            badge = EXCLUDED.badge,
            sort_order = EXCLUDED.sort_order
          RETURNING id
        `,
        [category.slug, category.name, category.badge ?? null, index]
      );

      categoryIds.set(category.name, result.rows[0].id);
    }

    const productSlugs = products.map((product) => product.slug);
    const categorySlugs = categories.map((category) => category.slug);

    await client.query(
      'DELETE FROM products WHERE NOT (slug = ANY($1::text[]))',
      [productSlugs]
    );

    await client.query(
      'DELETE FROM categories WHERE NOT (slug = ANY($1::text[]))',
      [categorySlugs]
    );

    for (const [index, product] of products.entries()) {
      const categoryId = categoryIds.get(product.category) ?? null;
      const result = await client.query(
        `
          INSERT INTO products (
            slug,
            name,
            category_id,
            image,
            alt,
            description,
            price_label,
            base_price,
            sort_order,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            category_id = EXCLUDED.category_id,
            image = EXCLUDED.image,
            alt = EXCLUDED.alt,
            description = EXCLUDED.description,
            price_label = EXCLUDED.price_label,
            base_price = EXCLUDED.base_price,
            sort_order = EXCLUDED.sort_order,
            updated_at = now()
          RETURNING id
        `,
        [
          product.slug,
          product.name,
          categoryId,
          product.image,
          product.alt,
          product.description,
          product.priceLabel,
          product.basePrice,
          index,
        ]
      );

      const productId = result.rows[0].id;
      await client.query('DELETE FROM product_sizes WHERE product_id = $1', [productId]);

      for (const [sizeIndex, size] of (product.sizes ?? []).entries()) {
        await client.query(
          `
            INSERT INTO product_sizes (product_id, size, price, sort_order)
            VALUES ($1, $2, $3, $4)
          `,
          [productId, size.size, size.price, sizeIndex]
        );
      }
    }

    await client.query('COMMIT');
    console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedProducts().catch((error) => {
  console.error(error);
  process.exit(1);
});
