import { Request, Response } from "express";
import { query } from "../lib/db";
import { Product, ProductListResponse, ApiResponse } from "../../shared/api";

// GET /api/products - List products with filters and pagination
export async function getProducts(req: Request, res: Response) {
  try {
    const {
      page = "1",
      limit = "20",
      category_id,
      manufacturer_id,
      brand_id,
      model_id,
      is_featured,
      is_active = "true",
      search,
      min_price,
      max_price,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(Math.max(1, parseInt(limit as string)), 100);
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    if (is_active !== undefined) {
      conditions.push("p.is_active = ?");
      params.push(is_active === "true" ? 1 : 0);
    }

    if (category_id) {
      conditions.push("p.category_id = ?");
      params.push(parseInt(category_id as string));
    }

    if (manufacturer_id) {
      conditions.push("p.manufacturer_id = ?");
      params.push(parseInt(manufacturer_id as string));
    }

    if (brand_id) {
      conditions.push("p.brand_id = ?");
      params.push(parseInt(brand_id as string));
    }

    if (model_id) {
      conditions.push("p.model_id = ?");
      params.push(parseInt(model_id as string));
    }

    if (is_featured !== undefined) {
      conditions.push("p.is_featured = ?");
      params.push(is_featured === "true" ? 1 : 0);
    }

    if (min_price) {
      conditions.push("p.price >= ?");
      params.push(parseFloat(min_price as string));
    }

    if (max_price) {
      conditions.push("p.price <= ?");
      params.push(parseFloat(max_price as string));
    }

    if (search) {
      conditions.push(
        "(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)",
      );
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total 
       FROM products p 
       ${whereClause}`,
      params,
    );
    const total = countResult[0].total;

    // Get products with all joined data
    const products = await query<Product[]>(
      `SELECT 
         p.*,
         c.name as category_name,
         m.name as manufacturer_name,
         b.name as brand_name,
         mo.name as model_name
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN models mo ON p.model_id = mo.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset],
    );

    const response: ProductListResponse = {
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// GET /api/products/:id - Get single product
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const products = await query<Product[]>(
      `SELECT 
         p.*,
         c.name as category_name,
         m.name as manufacturer_name,
         b.name as brand_name,
         mo.name as model_name
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN models mo ON p.model_id = mo.id
       WHERE p.id = ?`,
      [id],
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: products[0],
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
