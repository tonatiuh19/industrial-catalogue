import { VercelRequest, VercelResponse } from "@vercel/node";
import mysql from "mysql2/promise";
import { Manufacturer, ManufacturerListResponse } from "../../shared/api";

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "industrial_catalogue",
      port: parseInt(process.env.DB_PORT || "3306"),
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
      connectTimeout: 60000,
    });
  }
  return pool;
}

async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results as T;
  } finally {
    connection.release();
  }
}

// GET /api/manufacturers - List all active manufacturers
async function getManufacturers(req: VercelRequest, res: VercelResponse) {
  try {
    const { include_inactive } = req.query;

    let whereClause = "";
    if (!include_inactive) {
      whereClause = "WHERE is_active = TRUE";
    }

    const manufacturers = await query<Manufacturer[]>(
      `SELECT * FROM manufacturers 
       ${whereClause}
       ORDER BY name ASC`,
    );

    const response: ManufacturerListResponse = {
      success: true,
      data: manufacturers,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get manufacturers error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return getManufacturers(req, res);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
