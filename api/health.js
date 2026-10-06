import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: databaseSslConfig(connectionString),
});

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (!connectionString) {
    response.status(500).json({
      status: "error",
      message: "DATABASE_URL is not configured",
    });
    return;
  }

  try {
    await pool.query("SELECT 1");
    response.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Health error:", error);
    response.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
}

function databaseSslConfig(value = "") {
  if (isLocalDatabase(value)) return false;

  const ca = process.env.DB_CA_CERT?.replace(/\\n/g, "\n");
  if (ca) return { rejectUnauthorized: true, ca };

  return { rejectUnauthorized: false };
}

function isLocalDatabase(value = "") {
  return value.includes("localhost") || value.includes("127.0.0.1");
}
