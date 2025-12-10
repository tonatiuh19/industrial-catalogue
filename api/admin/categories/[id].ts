import { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid category ID" });
  }

  if (req.method === "PUT") {
    return handlePut(req, res, id);
  } else if (req.method === "DELETE") {
    return handleDelete(req, res, id);
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}

async function handlePut(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const { name, slug, description, is_active } = req.body;

    const pool = getPool();

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (slug !== undefined) {
      updates.push("slug = ?");
      values.push(slug);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(id);

    await pool.execute(
      `UPDATE categories SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    res.json({ success: true, message: "Category updated successfully" });
  } catch (error: any) {
    console.error("Error updating category:", error);

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

async function handleDelete(
  req: VercelRequest,
  res: VercelResponse,
  id: string,
) {
  try {
    const pool = getPool();

    await pool.execute("DELETE FROM categories WHERE id = ?", [id]);

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
