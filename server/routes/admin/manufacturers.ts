import { Router, Request, Response } from "express";
import { query } from "../../lib/db";

const router = Router();

// POST /api/admin/manufacturers - Create manufacturer
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, website } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Set a timeout for the query
    const queryPromise = query(
      `INSERT INTO manufacturers (name, description, website, is_active) 
       VALUES (?, ?, ?, 1)`,
      [name, description || null, website || null],
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
    console.error("Error creating manufacturer:", error);

    if (error.message === "Query timeout") {
      return res.status(504).json({
        success: false,
        message: "Database query timeout - please try again",
      });
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A manufacturer with this name already exists",
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

// PUT /api/admin/manufacturers/:id - Update manufacturer
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, website, is_active } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (website !== undefined) {
      updates.push("website = ?");
      values.push(website);
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
      `UPDATE manufacturers SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), 15000),
    );

    await Promise.race([queryPromise, timeoutPromise]);

    res.status(200).json({
      success: true,
      message: "Manufacturer updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating manufacturer:", error);

    if (error.message === "Query timeout") {
      return res.status(504).json({
        success: false,
        message: "Database query timeout - please try again",
      });
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A manufacturer with this name already exists",
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

// DELETE /api/admin/manufacturers/:id - Delete manufacturer
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const queryPromise = query(`DELETE FROM manufacturers WHERE id = ?`, [id]);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), 15000),
    );

    await Promise.race([queryPromise, timeoutPromise]);

    res.status(200).json({
      success: true,
      message: "Manufacturer deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting manufacturer:", error);

    if (error.message === "Query timeout") {
      return res.status(504).json({
        success: false,
        message: "Database query timeout - please try again",
      });
    }

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "Cannot delete manufacturer: it has associated brands",
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
