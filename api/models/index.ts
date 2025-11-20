import { VercelRequest, VercelResponse } from "@vercel/node";
import mysql from "mysql2/promise";
import { Model, ModelListResponse } from "../../shared/api";

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

// GET /api/models - List all active models
async function getModels(req: VercelRequest, res: VercelResponse) {
  try {
    const { brand_id, include_inactive } = req.query;

    const conditions: string[] = [];
    const params: any[] = [];

    if (!include_inactive) {
      conditions.push("mo.is_active = TRUE");
    }

    if (brand_id) {
      conditions.push("mo.brand_id = ?");
      params.push(parseInt(brand_id as string));
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const models = await query<Model[]>(
      `SELECT mo.*, b.name as brand_name
       FROM models mo
       LEFT JOIN brands b ON mo.brand_id = b.id
       ${whereClause}
       ORDER BY mo.name ASC`,
      params,
    );

    const response: ModelListResponse = {
      success: true,
      data: models,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get models error:", error);
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
    return getModels(req, res);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
