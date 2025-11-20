import { VercelRequest, VercelResponse } from "@vercel/node";
import mysql from "mysql2/promise";
import { Category, CategoryListResponse } from "../../shared/api";

// Database connection pool
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

// GET /api/categories - List all active categories
async function getCategories(req: VercelRequest, res: VercelResponse) {
  try {
    const { include_inactive } = req.query;

    let whereClause = "";
    if (!include_inactive) {
      whereClause = "WHERE is_active = TRUE";
    }

    const categories = await query<Category[]>(
      `SELECT * FROM categories 
       ${whereClause}
       ORDER BY display_order ASC, name ASC`,
    );

    const response: CategoryListResponse = {
      success: true,
      data: categories,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get categories error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === "production" ? undefined : error,
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
    return getCategories(req, res);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
