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
 * GET /api/admin/quotes/[id] - Get quote by ID
 * PUT /api/admin/quotes/[id] - Update quote status
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid quote ID" });
  }

  if (req.method === "GET") {
    return handleGet(req, res, id);
  } else if (req.method === "PUT") {
    return handlePut(req, res, id);
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    // Get quote details
    const quotes = await query<any[]>(
      `SELECT q.* FROM quotes q WHERE q.id = ?`,
      [id],
    );

    if (quotes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Quote not found" });
    }

    const quote = quotes[0];

    // Get quote items with product details
    const items = await query<any[]>(
      `SELECT 
        qi.*,
        p.name as product_name,
        p.description as product_description,
        p.model as product_model,
        p.price as product_price,
        c.name as category_name,
        b.name as brand_name,
        m.name as manufacturer_name
       FROM quote_items qi
       LEFT JOIN products p ON qi.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       WHERE qi.quote_id = ?`,
      [id],
    );

    res.json({ success: true, data: { ...quote, items } });
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function handlePut(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const { status, admin_notes } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (admin_notes !== undefined) {
      updates.push("admin_notes = ?");
      values.push(admin_notes);
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await query(`UPDATE quotes SET ${updates.join(", ")} WHERE id = ?`, values);

    res.json({ success: true, message: "Quote updated successfully" });
  } catch (error) {
    console.error("Error updating quote:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
