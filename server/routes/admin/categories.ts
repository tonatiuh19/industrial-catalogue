import { Router, Request, Response } from "express";
import { query } from "../../lib/db";

const router = Router();

// POST /api/admin/categories - Create category
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    // Set a timeout for the query
    const queryPromise = query(
      `INSERT INTO categories (name, slug, description, is_active, display_order) 
       VALUES (?, ?, ?, 1, 0)`,
      [name, slug, description || null],
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), 15000),
    );

    const result = await Promise.race([queryPromise, timeoutPromise]);

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("Error creating category:", error);

    if (error.message === "Query timeout") {
      return res.status(504).json({
        success: false,
        message: "Database query timeout - please try again",
      });
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists",
      });
    }

    if (error.code === "ETIMEDOUT" || error.code === "ECONNRESET") {
      return res.status(503).json({
        success: false,
        message: "Database connection error - please try again",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/admin/categories/:id - Update category
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, is_active } = req.body;

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

    await query(
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
});

// DELETE /api/admin/categories/:id - Delete category
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM categories WHERE id = ?", [id]);

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
