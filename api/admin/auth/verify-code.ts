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
 * POST /api/admin/auth/verify-code
 * Verify the admin code and login
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { user_id, code } = req.body;

    if (!user_id || !code) {
      return res.status(400).json({
        success: false,
        message: "User ID and code are required",
      });
    }

    // Check if code is valid
    const sessions = await query<any[]>(
      `SELECT * FROM admin_sessions 
       WHERE user_id = ? AND session_code = ? AND is_active = 1 AND expires_at > NOW()`,
      [user_id, code],
    );

    if (sessions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    // Get admin user info
    const users = await query<any[]>(
      `SELECT id, email, first_name, last_name, phone, role
       FROM admins WHERE id = ?`,
      [user_id],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    const user = users[0];

    // Update last login and clear the session
    await query(`UPDATE admins SET last_login = NOW() WHERE id = ?`, [user_id]);
    await query(`UPDATE admin_sessions SET is_active = 0 WHERE user_id = ?`, [
      user_id,
    ]);

    res.json({
      success: true,
      message: "Login successful",
      admin: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error verifying admin code:", error);
    res.status(500).json({ success: false, message: "Failed to verify code" });
  }
}
