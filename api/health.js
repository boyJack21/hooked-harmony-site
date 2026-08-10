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
    response.status(500).json({
      status: "error",
      message: "DATABASE_URL is not configured",
    });
    return;
  }

  try {
    const result = await pool.query("SELECT NOW()");
    response.status(200).json({
      status: "ok",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Health error:", error);
    response.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
}

function isLocalDatabase(value = "") {
  return value.includes("localhost") || value.includes("127.0.0.1");
}
