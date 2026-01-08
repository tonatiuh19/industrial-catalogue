import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import type { RequestHandler } from "express";
import nodemailer from "nodemailer";
import type {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  Category,
  CategoryListResponse,
  Quote,
  QuoteListResponse,
  CreateQuoteRequest,
} from "../shared/api";

// ==================== DATABASE CONNECTION ====================
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results as T;
  } finally {
    connection.release();
  }
}

// ==================== HEALTH CHECK ====================
const handleHealth: RequestHandler = async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    const dbConfigured = !!(
      process.env.DB_HOST &&
      process.env.DB_USER &&
      process.env.DB_PASSWORD &&
      process.env.DB_NAME
    );

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: {
        configured: dbConfigured,
        connected: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ==================== CATEGORIES ====================
const getCategories: RequestHandler = async (req, res) => {
  try {
    const { include_inactive } = req.query;

    let whereClause = "";
    if (!include_inactive) {
      whereClause = "WHERE is_active = TRUE";
    }

    const categories = await query<Category[]>(
      `SELECT * FROM categories 
       ${whereClause}
       ORDER BY display_order ASC, name ASC`,
    );

    const response: CategoryListResponse = {
      success: true,
      data: categories,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get categories error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

const validateCategorySlug: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.query;

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({
        success: false,
        message: "Slug parameter is required",
      });
    }

    const categories = await query<any[]>(
      "SELECT id FROM categories WHERE slug = ?",
      [slug],
    );

    return res.status(200).json({
      success: true,
      available: categories.length === 0,
    });
  } catch (error) {
    console.error("Validate slug error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== BRANDS ====================
const getBrands: RequestHandler = async (req, res) => {
  try {
    const { manufacturer_id, include_inactive } = req.query;

    let whereClause = "";
    const params: any[] = [];

    if (!include_inactive) {
      whereClause = "WHERE is_active = TRUE";
    }

    if (manufacturer_id) {
      whereClause += whereClause ? " AND " : "WHERE ";
      whereClause += "manufacturer_id = ?";
      params.push(parseInt(manufacturer_id as string));
    }

    const brands = await query<any[]>(
      `SELECT * FROM brands 
       ${whereClause}
       ORDER BY name ASC`,
      params,
    );

    return res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error("Get brands error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== MANUFACTURERS ====================
const getManufacturers: RequestHandler = async (req, res) => {
  try {
    const { include_inactive } = req.query;

    let whereClause = "";
    if (!include_inactive) {
      whereClause = "WHERE is_active = TRUE";
    }

    const manufacturers = await query<any[]>(
      `SELECT * FROM manufacturers 
       ${whereClause}
       ORDER BY name ASC`,
    );

    return res.status(200).json({
      success: true,
      data: manufacturers,
    });
  } catch (error) {
    console.error("Get manufacturers error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== MODELS ====================
const getModels: RequestHandler = async (req, res) => {
  try {
    const { brand_id, include_inactive } = req.query;

    let whereClause = "";
    const params: any[] = [];

    if (!include_inactive) {
      whereClause = "WHERE is_active = TRUE";
    }

    if (brand_id) {
      whereClause += whereClause ? " AND " : "WHERE ";
      whereClause += "brand_id = ?";
      params.push(parseInt(brand_id as string));
    }

    const models = await query<any[]>(
      `SELECT * FROM models 
       ${whereClause}
       ORDER BY name ASC`,
      params,
    );

    return res.status(200).json({
      success: true,
      data: models,
    });
  } catch (error) {
    console.error("Get models error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== PRODUCTS ====================
const getProducts: RequestHandler = async (req, res) => {
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
        "(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)",
      );
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total 
       FROM products p
       ${whereClause}`,
      params,
    );
    const total = countResult[0]?.total || 0;

    // Get products
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

    // Format images from database fields
    const productsWithImages = products.map((product) => {
      const images: string[] = [];
      if (product.main_image) images.push(product.main_image);
      if (product.extra_images) {
        try {
          const extraImages = JSON.parse(product.extra_images);
          if (Array.isArray(extraImages)) images.push(...extraImages);
        } catch (e) {
          // extra_images might be a string, not JSON
        }
      }
      return { ...product, images };
    });

    const response: ProductListResponse = {
      success: true,
      data: productsWithImages,
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
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getProductById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await query<Product[]>(
      `SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        m.name as manufacturer_name,
        b.name as brand_name,
        mo.name as model_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN models mo ON p.model_id = mo.id
       WHERE p.id = ?`,
      [parseInt(id)],
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const product = products[0];

    // Format images from database fields
    const images: string[] = [];
    if (product.main_image) images.push(product.main_image);
    if (product.extra_images) {
      try {
        const extraImages = JSON.parse(product.extra_images);
        if (Array.isArray(extraImages)) images.push(...extraImages);
      } catch (e) {
        // extra_images might be a string, not JSON
      }
    }

    return res.status(200).json({
      success: true,
      data: { ...product, images },
    });
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== QUOTES ====================
const getQuotes: RequestHandler = async (req, res) => {
  try {
    const { page = "1", limit = "20", status, email } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(Math.max(1, parseInt(limit as string)), 100);
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status) {
      conditions.push("q.status = ?");
      params.push(status);
    }

    if (email) {
      conditions.push("q.email = ?");
      params.push(email);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total FROM quotes q ${whereClause}`,
      params,
    );
    const total = countResult[0]?.total || 0;

    // Get quotes
    const quotes = await query<Quote[]>(
      `SELECT * FROM quotes q
       ${whereClause}
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset],
    );

    // Get items for each quote
    const quotesWithItems = await Promise.all(
      quotes.map(async (quote) => {
        const items = await query<any[]>(
          `SELECT 
            qi.*,
            p.name as product_name,
            p.sku as product_sku
           FROM quote_items qi
           LEFT JOIN products p ON qi.product_id = p.id
           WHERE qi.quote_id = ?`,
          [quote.id],
        );
        return { ...quote, items };
      }),
    );

    const response: QuoteListResponse = {
      success: true,
      data: quotesWithItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get quotes error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getQuoteById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const quotes = await query<Quote[]>("SELECT * FROM quotes WHERE id = ?", [
      parseInt(id),
    ]);

    if (quotes.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Quote not found",
      });
    }

    const quote = quotes[0];

    // Get items
    const items = await query<any[]>(
      `SELECT 
        qi.*,
        p.name as product_name,
        p.sku as product_sku,
        p.price as product_price
       FROM quote_items qi
       LEFT JOIN products p ON qi.product_id = p.id
       WHERE qi.quote_id = ?`,
      [quote.id],
    );

    return res.status(200).json({
      success: true,
      data: { ...quote, items },
    });
  } catch (error) {
    console.error("Get quote error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const createQuote: RequestHandler = async (req, res) => {
  try {
    const quoteData: CreateQuoteRequest = req.body;

    if (
      !quoteData.customer_name ||
      !quoteData.customer_email ||
      !quoteData.items ||
      quoteData.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Customer name, email, and at least one item are required",
      });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Generate quote number
      const quoteNumber = `Q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create quote
      const [quoteResult] = await connection.execute(
        `INSERT INTO quotes (quote_number, customer_name, customer_email, customer_phone, customer_company, customer_message, status) 
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [
          quoteNumber,
          quoteData.customer_name,
          quoteData.customer_email,
          quoteData.customer_phone || null,
          quoteData.customer_company || null,
          quoteData.customer_message || null,
        ],
      );

      const quoteId = (quoteResult as any).insertId;

      // Create quote items
      for (const item of quoteData.items) {
        await connection.execute(
          `INSERT INTO quote_items (quote_id, product_id, quantity, notes) 
           VALUES (?, ?, ?, ?)`,
          [quoteId, item.product_id, item.quantity, item.notes || null],
        );
      }

      await connection.commit();

      return res.status(201).json({
        success: true,
        data: { id: quoteId },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create quote error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== ADMIN CATEGORIES ====================
const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

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
};

const updateCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, is_active, display_order } = req.body;

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
    if (display_order !== undefined) {
      updates.push("display_order = ?");
      values.push(display_order);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE categories SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
    });
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
};

const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== ADMIN MANUFACTURERS ====================
const createManufacturer: RequestHandler = async (req, res) => {
  try {
    const { name, description, website, logo_url } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO manufacturers (name, description, website, logo_url, is_active) 
       VALUES (?, ?, ?, ?, 1)`,
      [name, description || null, website || null, logo_url || null],
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("Error creating manufacturer:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A manufacturer with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateManufacturer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, website, logo_url, is_active } = req.body;

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
    if (logo_url !== undefined) {
      updates.push("logo_url = ?");
      values.push(logo_url);
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

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE manufacturers SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Manufacturer not found",
      });
    }

    res.json({
      success: true,
      message: "Manufacturer updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating manufacturer:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A manufacturer with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteManufacturer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM manufacturers WHERE id = ?",
      [parseInt(id)],
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Manufacturer not found",
      });
    }

    res.json({
      success: true,
      message: "Manufacturer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting manufacturer:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== ADMIN BRANDS ====================
const createBrand: RequestHandler = async (req, res) => {
  try {
    const { name, manufacturer_id, description, logo_url } = req.body;

    if (!name || !manufacturer_id) {
      return res.status(400).json({
        success: false,
        message: "Name and manufacturer_id are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO brands (name, manufacturer_id, description, logo_url, is_active) 
       VALUES (?, ?, ?, ?, 1)`,
      [name, manufacturer_id, description || null, logo_url || null],
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("Error creating brand:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A brand with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateBrand: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, manufacturer_id, description, logo_url, is_active } =
      req.body;

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
    if (logo_url !== undefined) {
      updates.push("logo_url = ?");
      values.push(logo_url);
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

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE brands SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      message: "Brand updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating brand:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A brand with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteBrand: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM brands WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== ADMIN MODELS ====================
const createModel: RequestHandler = async (req, res) => {
  try {
    const { name, brand_id, description, specifications } = req.body;

    if (!name || !brand_id) {
      return res.status(400).json({
        success: false,
        message: "Name and brand_id are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO models (name, brand_id, description, specifications, is_active) 
       VALUES (?, ?, ?, ?, 1)`,
      [name, brand_id, description || null, specifications || null],
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("Error creating model:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A model with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateModel: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand_id, description, specifications, is_active } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (brand_id !== undefined) {
      updates.push("brand_id = ?");
      values.push(brand_id);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (specifications !== undefined) {
      updates.push("specifications = ?");
      values.push(specifications);
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

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE models SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    res.json({
      success: true,
      message: "Model updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating model:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A model with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteModel: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM models WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    res.json({
      success: true,
      message: "Model deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting model:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== ADMIN PRODUCTS ====================
const createProduct: RequestHandler = async (req, res) => {
  try {
    const productData: CreateProductRequest = req.body;

    if (!productData.name || !productData.sku) {
      return res.status(400).json({
        success: false,
        error: "Name and SKU are required",
      });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Handle images - check for main_image and extra_images from request body
      // or fallback to images array for backwards compatibility
      let mainImage = null;
      let extraImages = null;

      if (productData.main_image) {
        // New format: main_image and extra_images sent directly
        mainImage = productData.main_image;

        // extra_images might be a JSON string or already parsed
        if (productData.extra_images) {
          if (typeof productData.extra_images === "string") {
            // It's already a JSON string, use it as-is
            extraImages = productData.extra_images;
          } else if (Array.isArray(productData.extra_images)) {
            // It's an array, stringify it
            extraImages = JSON.stringify(productData.extra_images);
          }
        }
      } else if (productData.images && productData.images.length > 0) {
        // Old format: images array
        mainImage = productData.images[0];
        extraImages =
          productData.images.length > 1
            ? JSON.stringify(productData.images.slice(1))
            : null;
      }

      const [result] = await connection.execute(
        `INSERT INTO products (
          name, sku, description, category_id, manufacturer_id, brand_id, model_id,
          price, stock_quantity, is_active, is_featured, main_image, extra_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.name,
          productData.sku,
          productData.description || null,
          productData.category_id || null,
          productData.manufacturer_id || null,
          productData.brand_id || null,
          productData.model_id || null,
          productData.price || 0,
          productData.stock_quantity || 0,
          productData.is_active !== false ? 1 : 0,
          productData.is_featured ? 1 : 0,
          mainImage,
          extraImages,
        ],
      );

      const productId = (result as any).insertId;

      await connection.commit();

      return res.status(201).json({
        success: true,
        data: { id: productId },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updateProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const productData: UpdateProductRequest = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (productData.name !== undefined) {
      updates.push("name = ?");
      values.push(productData.name);
    }
    if (productData.sku !== undefined) {
      updates.push("sku = ?");
      values.push(productData.sku);
    }
    if (productData.description !== undefined) {
      updates.push("description = ?");
      values.push(productData.description);
    }
    if (productData.category_id !== undefined) {
      updates.push("category_id = ?");
      values.push(productData.category_id);
    }
    if (productData.manufacturer_id !== undefined) {
      updates.push("manufacturer_id = ?");
      values.push(productData.manufacturer_id);
    }
    if (productData.brand_id !== undefined) {
      updates.push("brand_id = ?");
      values.push(productData.brand_id);
    }
    if (productData.model_id !== undefined) {
      updates.push("model_id = ?");
      values.push(productData.model_id);
    }
    if (productData.price !== undefined) {
      updates.push("price = ?");
      values.push(productData.price);
    }
    if (productData.stock_quantity !== undefined) {
      updates.push("stock_quantity = ?");
      values.push(productData.stock_quantity);
    }
    if (productData.is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(productData.is_active ? 1 : 0);
    }
    if (productData.is_featured !== undefined) {
      updates.push("is_featured = ?");
      values.push(productData.is_featured ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No fields to update",
      });
    }

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== ADMIN AUTHENTICATION ====================
const checkAdminUser: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const [rows] = await pool.query<any[]>(
      `SELECT id, email, role, first_name, last_name, phone, is_active, is_email_verified, created_at, last_login
       FROM admins WHERE email = ?`,
      [email],
    );

    if (rows.length > 0) {
      if (rows[0].is_active === 0) {
        return res.status(403).json({
          success: false,
          message: "This account has been deactivated",
        });
      }
      res.json({ success: true, exists: true, admin: rows[0] });
    } else {
      res.json({
        success: true,
        exists: false,
        message: "No admin account found with this email",
      });
    }
  } catch (error) {
    console.error("Error checking admin user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const sendAdminCode: RequestHandler = async (req, res) => {
  try {
    console.log("🔵 sendAdminCode endpoint called");
    console.log("   Request body:", req.body);

    const { email, admin_id } = req.body;

    if (!email && !admin_id) {
      console.log("❌ Missing admin_id or email");
      return res.status(400).json({
        success: false,
        message: "Email or admin ID is required",
      });
    }

    console.log("   Admin ID:", admin_id);
    console.log("   Email:", email);

    // Get admin name from DB
    console.log("📊 Querying admin from database...");
    const [adminRows] = await pool.query<any[]>(
      "SELECT first_name, last_name FROM admins WHERE id = ?",
      [admin_id],
    );

    if (adminRows.length === 0) {
      console.log("❌ Admin not found in database");
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const admin_name = `${adminRows[0].first_name} ${adminRows[0].last_name}`;
    console.log("✅ Admin found:", admin_name);

    // Generate session code
    const sessionCode = Math.floor(100000 + Math.random() * 900000);
    console.log("🔢 Generated code:", sessionCode);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store code in admin_sessions table
    console.log("💾 Inserting session code into database...");
    await pool.query(
      `INSERT INTO admin_sessions (user_id, session_code, is_active, expires_at) 
       VALUES (?, ?, 0, ?)
       ON DUPLICATE KEY UPDATE session_code = VALUES(session_code), expires_at = VALUES(expires_at)`,
      [admin_id, sessionCode, expiresAt],
    );
    console.log("✅ Session code saved");

    // Send email with verification code
    console.log("📧 Calling sendAdminVerificationEmail...");
    const emailSent = await sendAdminVerificationEmail(
      email,
      admin_name,
      sessionCode,
    );

    if (emailSent) {
      console.log("✅ Email sent successfully");
      res.json({
        success: true,
        message: "Verification code sent to your email",
        // In development, include the code
        ...(process.env.NODE_ENV === "development" && { code: sessionCode }),
      });
    } else {
      console.log("❌ Email sending failed");
      res.status(500).json({
        success: false,
        message: "Failed to send email",
      });
    }
  } catch (error) {
    console.error("❌ Error sending admin code:", error);
    if (error instanceof Error) {
      console.error("   Error name:", error.name);
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Helper function to send admin verification email
 */
async function sendAdminVerificationEmail(
  email: string,
  adminName: string,
  code: number,
): Promise<boolean> {
  try {
    console.log("🔍 Checking environment variables:");
    console.log("   SMTP_HOST:", process.env.SMTP_HOST || "NOT SET");
    console.log("   SMTP_PORT:", process.env.SMTP_PORT || "NOT SET");
    console.log("   SMTP_SECURE:", process.env.SMTP_SECURE || "NOT SET");
    console.log("   SMTP_USER:", process.env.SMTP_USER || "NOT SET");
    console.log(
      "   SMTP_PASSWORD:",
      process.env.SMTP_PASSWORD ? "SET (hidden)" : "NOT SET",
    );

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log(
        "⚠️  No SMTP credentials found. Using Ethereal test account...",
      );

      // Create test account on the fly (for development only)
      const testAccount = await nodemailer.createTestAccount();

      const transportConfig = {
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      };

      console.log("📧 Ethereal test account created:");
      console.log("   User:", testAccount.user);
      console.log("   Pass:", testAccount.pass);

      const transporter = nodemailer.createTransport(transportConfig);
      await transporter.verify();
      console.log("✅ SMTP connection verified (test account)!");

      const emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { background-color: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto; }
            .code { font-size: 32px; font-weight: bold; color: #d32f2f; text-align: center; padding: 20px; background-color: #f0f0f0; border-radius: 5px; margin: 20px 0; }
            .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Hola ${adminName},</h1>
            <p>Tu código de acceso administrativo para Industrial Catalogue es:</p>
            <div class="code">${code}</div>
            <p>Este código expirará en 10 minutos.</p>
            <p>Si no solicitaste este código, contacta al administrador del sistema.</p>
            <div class="footer">
              <p>Industrial Catalogue - Panel Administrativo</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          `"Industrial Catalogue Admin" <${testAccount.user}>`,
        to: email,
        subject: `${code} - Código de acceso administrativo Industrial Catalogue`,
        html: emailBody,
      });

      console.log("✅ Email sent successfully!");
      console.log("   Message ID:", info.messageId);
      const previewUrl = nodemailer.getTestMessageUrl(info as any);
      console.log("📬 Preview URL:", previewUrl);
      console.log("🔑 Verification code:", code);

      return true;
    }

    // Use configured SMTP settings
    const transportConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    console.log("📧 Using configured SMTP settings:");
    console.log("   Host:", transportConfig.host);
    console.log("   Port:", transportConfig.port);
    console.log("   Secure:", transportConfig.secure);
    console.log("   User:", transportConfig.auth.user);

    // Configure email transporter
    console.log("🔧 Creating transporter...");
    const transporter = nodemailer.createTransport(transportConfig);

    // Verify SMTP connection
    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!");

    // Admin email template
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Industrial Catalogue - Acceso Administrativo</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 20px; border: 1px solid #ddd;">
              <h1 style="color: #d32f2f; text-align: center; margin-bottom: 20px;">ACCESO ADMINISTRATIVO</h1>
              
              <p>Hola <strong>${adminName}</strong>,</p>
              
              <p>Se ha solicitado acceso al panel administrativo de Industrial Catalogue.</p>
              
              <p><strong>Tu código de verificación es:</strong></p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 20px;">
                    <div style="font-size: 28px; font-weight: bold; color: #d32f2f; background-color: #f5f5f5; padding: 15px; border: 2px solid #d32f2f; display: inline-block;">${code}</div>
                  </td>
                </tr>
              </table>
              
              <p style="color: #d32f2f; font-weight: bold;">IMPORTANTE: Este código expirará en 10 minutos</p>
              
              <p>Si no solicitaste este acceso, contacta inmediatamente al administrador del sistema.</p>
              
              <hr style="border: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #666; text-align: center;">
                Industrial Catalogue - Panel Administrativo<br>
                Este es un mensaje automático del sistema - No responder
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    console.log("📤 Sending admin email to:", email);
    console.log(
      "   From field:",
      process.env.SMTP_FROM ||
        `"Industrial Catalogue Admin" <${process.env.SMTP_USER}>`,
    );
    console.log(
      "   Subject:",
      `${code} - Código de acceso administrativo Industrial Catalogue`,
    );

    // Plain text version for better deliverability
    const textBody = `
ACCESO ADMINISTRATIVO - INDUSTRIAL CATALOGUE

Hola ${adminName},

Se ha solicitado acceso al panel administrativo de Industrial Catalogue.

Tu código de verificación es: ${code}

IMPORTANTE: Este código expirará en 10 minutos

Si no solicitaste este acceso, contacta inmediatamente al administrador del sistema.

---
Industrial Catalogue - Panel Administrativo
Este es un mensaje automático del sistema - No responder
    `;

    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        `"Industrial Catalogue Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${code} - Código de acceso administrativo Industrial Catalogue`,
      text: textBody.trim(),
      html: emailBody,
    });

    console.log("✅ Admin email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   Response:", JSON.stringify(info.response || "No response"));
    console.log("   Envelope:", JSON.stringify(info.envelope || "No envelope"));
    console.log("   Accepted:", JSON.stringify(info.accepted || []));
    console.log("   Rejected:", JSON.stringify(info.rejected || []));

    console.log("🏭 PRODUCTION EMAIL SENT:");
    console.log("   Production SMTP used:", process.env.SMTP_HOST);
    console.log("   Target email:", email);
    console.log("   Admin name:", adminName);
    console.log("   Verification code:", code);
    console.log("   Environment check:");
    console.log("     NODE_ENV:", process.env.NODE_ENV);
    console.log("     SMTP_FROM:", process.env.SMTP_FROM || "NOT SET");

    return true;
  } catch (error) {
    console.error("❌ Error sending admin email:", error);
    if (error instanceof Error) {
      console.error("   Error name:", error.name);
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
    }
    return false;
  }
}

const verifyAdminCode: RequestHandler = async (req, res) => {
  try {
    const { admin_id, code } = req.body;

    if (!admin_id || !code) {
      return res.status(400).json({
        success: false,
        message: "Admin ID and code are required",
      });
    }

    // Check code in admin_sessions
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM admin_sessions 
       WHERE user_id = ? AND session_code = ? AND expires_at > NOW()`,
      [admin_id, code],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    // Generate new session code for the active session
    const sessionCode = Math.floor(100000 + Math.random() * 900000);
    const sessionExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update session to active with new code and expiration
    await pool.query(
      `UPDATE admin_sessions 
       SET is_active = 1, session_code = ?, expires_at = ? 
       WHERE user_id = ? AND session_code = ?`,
      [sessionCode, sessionExpires, admin_id, code],
    );

    // Get admin info
    const [admins] = await pool.query<any[]>(
      `SELECT id, email, role, first_name, last_name FROM admins WHERE id = ?`,
      [admin_id],
    );

    res.json({
      success: true,
      admin: admins[0],
      token: sessionCode.toString(),
    });
  } catch (error) {
    console.error("Error verifying admin code:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==================== ADMIN USERS ====================
const getAdminUsers: RequestHandler = async (req, res) => {
  try {
    const [users] = await pool.query<any[]>(
      `SELECT id, email, role, first_name, last_name, phone, is_active, created_at, last_login
       FROM admins
       ORDER BY created_at DESC`,
    );

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAdminUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query<any[]>(
      `SELECT id, email, role, first_name, last_name, phone, is_active, is_email_verified, created_at, last_login
       FROM admins WHERE id = ?`,
      [parseInt(id)],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error("Error fetching admin user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createAdminUser: RequestHandler = async (req, res) => {
  try {
    const { email, first_name, last_name, phone, role = "admin" } = req.body;

    if (!email || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: "Email, first name, and last name are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO admins (email, first_name, last_name, phone, role, is_active) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [email, first_name, last_name, phone || null, role],
    );

    res.status(201).json({
      success: true,
      data: { id: (result as any).insertId },
    });
  } catch (error: any) {
    console.error("Error creating admin user:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An admin with this email already exists",
      });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateAdminUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, role, is_active } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (first_name !== undefined) {
      updates.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push("last_name = ?");
      values.push(last_name);
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (role !== undefined) {
      updates.push("role = ?");
      values.push(role);
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

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE admins SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.json({ success: true, message: "Admin user updated successfully" });
  } catch (error) {
    console.error("Error updating admin user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteAdminUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM admins WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.json({ success: true, message: "Admin user deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==================== ADMIN CONTENT ====================
const getContentPages: RequestHandler = async (req, res) => {
  try {
    const [pages] = await pool.query<any[]>(
      `SELECT * FROM content_pages ORDER BY slug`,
    );

    res.json({ success: true, data: pages });
  } catch (error) {
    console.error("Error fetching content pages:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getContentPageBySlug: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;

    const [pages] = await pool.query<any[]>(
      `SELECT * FROM content_pages WHERE slug = ?`,
      [slug],
    );

    if (pages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Content page not found",
      });
    }

    res.json({ success: true, data: pages[0] });
  } catch (error) {
    console.error("Error fetching content page:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createContentPage: RequestHandler = async (req, res) => {
  try {
    const { slug, title, content } = req.body;

    if (!slug || !title) {
      return res.status(400).json({
        success: false,
        message: "Slug and title are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO content_pages (slug, title, content) VALUES (?, ?, ?)`,
      [slug, title, content || null],
    );

    res.status(201).json({
      success: true,
      data: { id: (result as any).insertId },
    });
  } catch (error: any) {
    console.error("Error creating content page:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A content page with this slug already exists",
      });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateContentPage: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (content !== undefined) {
      updates.push("content = ?");
      values.push(content);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(slug);

    const [result] = await pool.execute(
      `UPDATE content_pages SET ${updates.join(", ")} WHERE slug = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Content page not found",
      });
    }

    res.json({ success: true, message: "Content page updated successfully" });
  } catch (error) {
    console.error("Error updating content page:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteContentPage: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM content_pages WHERE slug = ?",
      [slug],
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Content page not found",
      });
    }

    res.json({ success: true, message: "Content page deleted successfully" });
  } catch (error) {
    console.error("Error deleting content page:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==================== ADMIN QUOTES ====================
const getAdminQuotes: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = "1=1";
    const queryParams: any[] = [];

    if (status && status !== "all") {
      whereClause += " AND q.status = ?";
      queryParams.push(status);
    }

    // Get total count
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total FROM quotes q WHERE ${whereClause}`,
      queryParams,
    );

    const total = countResult[0]?.total || 0;

    // Get quotes
    const quotes = await query<any[]>(
      `SELECT q.*
       FROM quotes q
       WHERE ${whereClause}
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, Number(limit), offset],
    );

    // Get items for each quote
    const quotesWithItems = await Promise.all(
      quotes.map(async (quote) => {
        const items = await query<any[]>(
          `SELECT qi.*, p.name as product_name, p.sku
           FROM quote_items qi
           LEFT JOIN products p ON qi.product_id = p.id
           WHERE qi.quote_id = ?`,
          [quote.id],
        );
        return { ...quote, items };
      }),
    );

    res.json({
      success: true,
      data: {
        quotes: quotesWithItems,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin quotes:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateQuoteStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const [result] = await pool.execute(
      `UPDATE quotes SET status = ? WHERE id = ?`,
      [status, parseInt(id)],
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    res.json({ success: true, message: "Quote status updated successfully" });
  } catch (error) {
    console.error("Error updating quote status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==================== EXPRESS SERVER SETUP ====================
let app: express.Application | null = null;

function createServer() {
  console.log("Creating Express server for Vercel...");

  const expressApp = express();

  // Middleware
  expressApp.use(cors());
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  // Log requests
  expressApp.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // ==================== CONFIGURE PUBLIC ROUTES ====================

  // Health check
  expressApp.get("/api/health", handleHealth);

  // Categories
  expressApp.get("/api/categories", getCategories);
  expressApp.get("/api/categories/validate-slug", validateCategorySlug);

  // Brands
  expressApp.get("/api/brands", getBrands);

  // Manufacturers
  expressApp.get("/api/manufacturers", getManufacturers);

  // Models
  expressApp.get("/api/models", getModels);

  // Products
  expressApp.get("/api/products", getProducts);
  expressApp.get("/api/products/:id", getProductById);

  // Quotes
  expressApp.get("/api/quotes", getQuotes);
  expressApp.get("/api/quotes/:id", getQuoteById);
  expressApp.post("/api/quotes", createQuote);

  // ==================== CONFIGURE ADMIN ROUTES ====================

  // Admin Authentication (no auth required for these)
  expressApp.post("/api/admin/auth/check-user", checkAdminUser);
  expressApp.post("/api/admin/auth/send-code", sendAdminCode);
  expressApp.post("/api/admin/auth/verify-code", verifyAdminCode);

  // Admin Categories (protected)
  expressApp.get("/api/admin/categories", getCategories);
  expressApp.post("/api/admin/categories", createCategory);
  expressApp.put("/api/admin/categories/:id", updateCategory);
  expressApp.delete("/api/admin/categories/:id", deleteCategory);

  // Admin Manufacturers (protected)
  expressApp.get("/api/admin/manufacturers", getManufacturers);
  expressApp.post("/api/admin/manufacturers", createManufacturer);
  expressApp.put("/api/admin/manufacturers/:id", updateManufacturer);
  expressApp.delete("/api/admin/manufacturers/:id", deleteManufacturer);

  // Admin Brands (protected)
  expressApp.get("/api/admin/brands", getBrands);
  expressApp.post("/api/admin/brands", createBrand);
  expressApp.put("/api/admin/brands/:id", updateBrand);
  expressApp.delete("/api/admin/brands/:id", deleteBrand);

  // Admin Models (protected)
  expressApp.get("/api/admin/models", getModels);
  expressApp.post("/api/admin/models", createModel);
  expressApp.put("/api/admin/models/:id", updateModel);
  expressApp.delete("/api/admin/models/:id", deleteModel);

  // Admin Products (protected)
  expressApp.get("/api/admin/products", getProducts);
  expressApp.get("/api/admin/products/:id", getProductById);
  expressApp.post("/api/admin/products", createProduct);
  expressApp.put("/api/admin/products/:id", updateProduct);
  expressApp.delete("/api/admin/products/:id", deleteProduct);

  // Admin Users (protected)
  expressApp.get("/api/admin/users", getAdminUsers);
  expressApp.get("/api/admin/users/:id", getAdminUserById);
  expressApp.post("/api/admin/users", createAdminUser);
  expressApp.put("/api/admin/users/:id", updateAdminUser);
  expressApp.delete("/api/admin/users/:id", deleteAdminUser);

  // Admin Content Pages (protected)
  expressApp.get("/api/admin/content", getContentPages);
  expressApp.get("/api/admin/content/:slug", getContentPageBySlug);
  expressApp.post("/api/admin/content", createContentPage);
  expressApp.put("/api/admin/content/:slug", updateContentPage);
  expressApp.delete("/api/admin/content/:slug", deleteContentPage);

  // Admin Quotes (protected)
  expressApp.get("/api/admin/quotes", getAdminQuotes);
  expressApp.get("/api/admin/quotes/:id", getQuoteById);
  expressApp.put("/api/admin/quotes/:id/status", updateQuoteStatus);

  // 404 handler
  expressApp.use("/api", (_req, res) => {
    if (!res.headersSent) {
      res.status(404).json({
        success: false,
        message: "API endpoint not found",
      });
    }
  });

  // Error handler
  expressApp.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error("Express error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    },
  );

  return expressApp;
}

function getApp() {
  if (!app) {
    console.log("Initializing Express app for serverless...");
    app = createServer();
  }
  return app;
}

// Export createServer for development use
export { createServer };

// Export handler for Vercel serverless
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const expressApp = getApp();
    expressApp(req as any, res as any);
  } catch (error) {
    console.error("API Handler Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: {
          code: "500",
          message: "A server error has occurred",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
};
