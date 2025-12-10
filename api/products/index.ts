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
import {
  Product,
  ProductListResponse,
  ApiResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "../../shared/api";

// GET /api/products - List products with filters and pagination
async function getProducts(req: VercelRequest, res: VercelResponse) {
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
        "(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ? OR m.name LIKE ? OR b.name LIKE ? OR mo.name LIKE ?)",
      );
      const searchPattern = `%${search}%`;
      params.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total 
       FROM products p 
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN models mo ON p.model_id = mo.id
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
    });
  }
}

// POST /api/products - Create new product
async function createProduct(req: VercelRequest, res: VercelResponse) {
  try {
    // TODO: Add authentication when ready
    // const authResult = await verifyToken(req);
    // if (!authResult.success) {
    //   return res.status(401).json({ success: false, error: authResult.error });
    // }
    // if (!requireRole(authResult.user!, ['super_admin', 'admin', 'editor'])) {
    //   return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    // }

    const productData = req.body as CreateProductRequest;

    // Validate required fields
    if (!productData.sku || !productData.name || !productData.category_id) {
      return res.status(400).json({
        success: false,
        error: "SKU, name, and category_id are required",
      });
    }

    // Check if SKU already exists
    const existing = await query<any[]>(
      "SELECT id FROM products WHERE sku = ?",
      [productData.sku],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Product with this SKU already exists",
      });
    }

    // Insert product
    const result = await query<any>(
      `INSERT INTO products (
        sku, name, description, long_description, category_id, price, currency,
        stock_quantity, unit, manufacturer, brand, model, specifications,
        images, main_image, extra_images, is_featured, is_active, meta_title, meta_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productData.sku,
        productData.name,
        productData.description || null,
        productData.long_description || null,
        productData.category_id,
        productData.price || 0,
        productData.currency || "USD",
        productData.stock_quantity || 0,
        productData.unit || "unit",
        productData.manufacturer || null,
        productData.brand || null,
        productData.model || null,
        productData.specifications
          ? JSON.stringify(productData.specifications)
          : null,
        productData.images ? JSON.stringify(productData.images) : null,
        productData.main_image || null,
        productData.extra_images || null,
        productData.is_featured ? 1 : 0,
        productData.is_active !== false ? 1 : 0,
        productData.meta_title || null,
        productData.meta_description || null,
      ],
    );

    const response: ApiResponse<{ id: number }> = {
      success: true,
      data: { id: result.insertId },
      message: "Product created successfully",
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return getProducts(req, res);
  }

  if (req.method === "POST") {
    return createProduct(req, res);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
