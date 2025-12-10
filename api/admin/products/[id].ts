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
 * GET /api/admin/products/[id] - Get product by ID
 * PUT /api/admin/products/[id] - Update product
 * DELETE /api/admin/products/[id] - Delete product
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  if (req.method === "GET") {
    return handleGet(req, res, id);
  } else if (req.method === "PUT") {
    return handlePut(req, res, id);
  } else if (req.method === "DELETE") {
    return handleDelete(req, res, id);
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const products = await query<any[]>(
      `SELECT 
        p.*,
        c.name as category,
        b.name as brand,
        m.name as manufacturer,
        md.name as model_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       LEFT JOIN \`models\` md ON p.model_id = md.id
       WHERE p.id = ?`,
      [id],
    );

    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const product = {
      ...products[0],
      model: products[0].model_name || products[0].model, // Use model_name from join, fallback to old model column
      images: products[0].images ? JSON.parse(products[0].images) : [],
      extra_images: products[0].extra_images || null,
      specifications: products[0].specifications
        ? JSON.parse(products[0].specifications)
        : {},
      is_active: Boolean(products[0].is_active),
    };

    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function handlePut(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const {
      name,
      description,
      model,
      price,
      stock_quantity,
      category_id,
      brand_id,
      manufacturer_id,
      images,
      main_image,
      extra_images,
      specifications,
      is_active,
    } = req.body;

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
    if (model !== undefined) {
      updates.push("model = ?");
      values.push(model);
    }
    if (price !== undefined) {
      updates.push("price = ?");
      values.push(price);
    }
    if (stock_quantity !== undefined) {
      updates.push("stock_quantity = ?");
      values.push(stock_quantity);
    }
    if (category_id !== undefined) {
      updates.push("category_id = ?");
      values.push(category_id);
    }
    if (brand_id !== undefined) {
      updates.push("brand_id = ?");
      values.push(brand_id);
    }
    if (manufacturer_id !== undefined) {
      updates.push("manufacturer_id = ?");
      values.push(manufacturer_id);
    }
    if (images !== undefined) {
      updates.push("images = ?");
      values.push(JSON.stringify(images));
    }
    if (main_image !== undefined) {
      updates.push("main_image = ?");
      values.push(main_image);
    }
    if (extra_images !== undefined) {
      updates.push("extra_images = ?");
      values.push(extra_images);
    }
    if (specifications !== undefined) {
      updates.push("specifications = ?");
      values.push(JSON.stringify(specifications));
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await query(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function handleDelete(
  req: VercelRequest,
  res: VercelResponse,
  id: string,
) {
  try {
    // Soft delete by setting is_active to 0
    await query(
      "UPDATE products SET is_active = 0, updated_at = NOW() WHERE id = ?",
      [id],
    );

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
