import { Router, Request, Response } from "express";
import { query } from "../../lib/db";

const router = Router();

// POST /api/admin/brands - Create brand
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, manufacturer_id, description } = req.body;

    if (!name || !manufacturer_id) {
      return res.status(400).json({
        success: false,
        message: "Name and manufacturer_id are required",
      });
    }

    // Set a timeout for the query
    const queryPromise = query(
      `INSERT INTO brands (name, manufacturer_id, description, is_active) 
       VALUES (?, ?, ?, 1)`,
      [name, manufacturer_id, description || null],
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
    console.error("Error creating brand:", error);

    if (error.message === "Query timeout") {
      return res.status(504).json({
        success: false,
        message: "Database query timeout - please try again",
      });
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A brand with this name already exists",
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "Invalid manufacturer_id",
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

// PUT /api/admin/brands/:id - Update brand
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, manufacturer_id, description, is_active } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (manufacturer_id !== undefined) {
      updates.push("manufacturer_id = ?");
      values.push(manufacturer_id);
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

    const queryPromise = query(
      `UPDATE brands SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), 15000),
    );

    await Promise.race([queryPromise, timeoutPromise]);

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating brand:", error);

    if (error.message === "Query timeout") {
      return res.status(504).json({
        success: false,
        message: "Database query timeout - please try again",
      });
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A brand with this name already exists",
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "Invalid manufacturer_id",
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

// DELETE /api/admin/brands/:id - Delete brand
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const queryPromise = query(`DELETE FROM brands WHERE id = ?`, [id]);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), 15000),
    );

    await Promise.race([queryPromise, timeoutPromise]);

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting brand:", error);

    if (error.message === "Query timeout") {
      return res.status(504).json({
        success: false,
        message: "Database query timeout - please try again",
      });
    }

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "Cannot delete brand: it has associated models",
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

export default router;
