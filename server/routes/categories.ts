import { Request, Response } from "express";
import { query } from "../lib/db";
import { Category, CategoryListResponse } from "../../shared/api";

export async function getCategories(_req: Request, res: Response) {
  try {
    const categories = await query<Category[]>(
      `SELECT 
         c.*,
         parent.name as parent_name
       FROM categories c
       LEFT JOIN categories parent ON c.parent_id = parent.id
       ORDER BY c.name ASC`,
    );

    const response: CategoryListResponse = {
      success: true,
      data: categories,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
