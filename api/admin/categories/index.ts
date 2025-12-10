import { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    return handlePost(req, res);
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const pool = getPool();

    const [result] = await pool.execute(
      `INSERT INTO categories (name, slug, description, is_active, display_order) 
       VALUES (?, ?, ?, 1, 0)`,
      [name, slug, description || null],
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("Error creating category:", error);

    // Check for duplicate slug error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
