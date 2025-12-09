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
 * GET /api/admin/users - Get all admin users
 * POST /api/admin/users - Create new admin user
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return handleGet(req, res);
  } else if (req.method === "POST") {
    return handlePost(req, res);
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const users = await query<any[]>(
      `SELECT id, email, role, first_name, last_name, phone, is_active, is_email_verified, created_at, last_login
       FROM admins
       ORDER BY created_at DESC`,
    );

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const { email, first_name, last_name, phone, role = "admin" } = req.body;

    if (!email || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: "Email, first name, and last name are required",
      });
    }

    // Check if email already exists
    const existing = await query<any[]>(
      "SELECT id FROM admins WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Admin user with this email already exists",
      });
    }

    // Create new admin user
    const result = await query<any>(
      `INSERT INTO admins (email, role, first_name, last_name, phone, is_active, is_email_verified, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, 0, NOW(), NOW())`,
      [email, role, first_name, last_name, phone || null],
    );

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
