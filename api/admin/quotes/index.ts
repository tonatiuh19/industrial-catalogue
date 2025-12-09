import { VercelRequest, VercelResponse } from "@vercel/node";
import mysql from "mysql2/promise";

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

/**
 * GET /api/admin/quotes - Get all quote requests
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = "1=1";
    const queryParams: any[] = [];

    if (status && status !== "all") {
      whereClause += " AND q.status = ?";
      queryParams.push(status);
    }

    // Get total count
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total FROM quotes q WHERE ${whereClause}`,
      queryParams,
    );

    const total = countResult[0]?.total || 0;

    // Get quotes (without product details since quotes can have multiple items)
    const quotes = await query<any[]>(
      `SELECT q.*
       FROM quotes q
       WHERE ${whereClause}
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, Number(limit), offset],
    );

    res.json({
      success: true,
      data: {
        quotes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
