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
 * GET /api/admin/products - Get all products with filters
 * POST /api/admin/products - Create a new product
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
    const {
      search,
      category,
      brand,
      manufacturer,
      is_active,
      page = 1,
      limit = 50,
    } = req.query;

    let whereConditions: string[] = [];
    let params: any[] = [];

    if (search) {
      whereConditions.push(
        "(p.name LIKE ? OR p.description LIKE ? OR p.model LIKE ?)",
      );
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      whereConditions.push("c.name = ?");
      params.push(category);
    }

    if (brand) {
      whereConditions.push("b.name = ?");
      params.push(brand);
    }

    if (manufacturer) {
      whereConditions.push("m.name = ?");
      params.push(manufacturer);
    }

    if (is_active !== undefined) {
      whereConditions.push("p.is_active = ?");
      params.push(is_active === "true" ? 1 : 0);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get total count
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       ${whereClause}`,
      params,
    );

    const total = countResult[0].total;
    const offset = (Number(page) - 1) * Number(limit);

    // Get products
    const products = await query<any[]>(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.model,
        p.price,
        p.stock_quantity,
        p.images,
        p.main_image,
        p.extra_images,
        p.is_active,
        p.created_at,
        p.updated_at,
        c.id as category_id,
        c.name as category,
        b.id as brand_id,
        b.name as brand,
        m.id as manufacturer_id,
        m.name as manufacturer,
        p.model_id,
        mdl.name as model_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       LEFT JOIN \`models\` mdl ON p.model_id = mdl.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset],
    );

    res.json({
      success: true,
      data: {
        products: products.map((p: any) => ({
          ...p,
          model: p.model_name || p.model, // Use model_name from join, fallback to old model column
          images: p.images ? JSON.parse(p.images) : [],
          main_image: p.main_image || null,
          extra_images: p.extra_images || null,
          is_active: Boolean(p.is_active),
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      name,
      sku,
      description,
      long_description,
      model_id,
      price,
      stock_quantity,
      min_stock_level,
      category_id,
      brand_id,
      manufacturer_id,
      main_image,
      extra_images,
      specifications,
      is_active = true,
    } = req.body;

    if (!name || !sku || !category_id) {
      return res.status(400).json({
        success: false,
        message: "Name, SKU, and category are required",
      });
    }

    const result = await query<any>(
      `INSERT INTO products (
        name, sku, description, long_description, model_id, price, stock_quantity, min_stock_level,
        category_id, brand_id, manufacturer_id, main_image, extra_images, specifications, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        sku,
        description || null,
        long_description || null,
        model_id || null,
        price || null,
        stock_quantity || 0,
        min_stock_level || 0,
        category_id,
        brand_id || null,
        manufacturer_id || null,
        main_image || null,
        extra_images || null,
        specifications ? JSON.stringify(specifications) : null,
        is_active ? 1 : 0,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
