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
 * GET /api/admin/content/[slug] - Get content page by slug
 * PUT /api/admin/content/[slug] - Update content page
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (!slug || Array.isArray(slug)) {
    return res.status(400).json({ success: false, message: "Invalid slug" });
  }

  if (req.method === "GET") {
    return handleGet(req, res, slug);
  } else if (req.method === "PUT") {
    return handlePut(req, res, slug);
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}

async function handleGet(
  req: VercelRequest,
  res: VercelResponse,
  slug: string,
) {
  try {
    const pages = await query<any[]>(
      `SELECT * FROM content_pages WHERE slug = ?`,
      [slug],
    );

    if (pages.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    res.json({ success: true, data: pages[0] });
  } catch (error) {
    console.error("Error fetching content page:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function handlePut(
  req: VercelRequest,
  res: VercelResponse,
  slug: string,
) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });
    }

    // Check if page exists
    const existing = await query<any[]>(
      `SELECT id FROM content_pages WHERE slug = ?`,
      [slug],
    );

    if (existing.length === 0) {
      // Create new page
      await query(
        `INSERT INTO content_pages (slug, title, content, created_at, updated_at) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        [slug, title, content],
      );
    } else {
      // Update existing page
      await query(
        `UPDATE content_pages SET title = ?, content = ?, updated_at = NOW() WHERE slug = ?`,
        [title, content, slug],
      );
    }

    res.json({ success: true, message: "Content page saved successfully" });
  } catch (error) {
    console.error("Error saving content page:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
