import { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "../../server/lib/db";
import { Product, ApiResponse, UpdateProductRequest } from "../../shared/api";

// GET /api/products/[id] - Get single product
async function getProduct(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const product = await queryOne<Product>(
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
      [parseInt(id)],
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
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

// PUT /api/products/[id] - Update product
async function updateProduct(
  req: VercelRequest,
  res: VercelResponse,
  id: string,
) {
  try {
    // TODO: Add authentication when ready
    // const authResult = await verifyToken(req);
    // if (!authResult.success) {
    //   return res.status(401).json({ success: false, error: authResult.error });
    // }
    // if (!requireRole(authResult.user!, ['super_admin', 'admin', 'editor'])) {
    //   return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    // }

    const productId = parseInt(id);
    const updates = req.body as UpdateProductRequest;

    // Check if product exists
    const existing = await queryOne<Product>(
      "SELECT id FROM products WHERE id = ?",
      [productId],
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Build update query dynamically
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      "sku",
      "name",
      "description",
      "long_description",
      "category_id",
      "price",
      "currency",
      "stock_quantity",
      "unit",
      "manufacturer",
      "brand",
      "model",
      "specifications",
      "images",
      "thumbnail_url",
      "is_featured",
      "is_active",
      "meta_title",
      "meta_description",
    ];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);

        // Handle JSON fields
        if (key === "specifications" || key === "images") {
          values.push(value ? JSON.stringify(value) : null);
        }
        // Handle boolean fields
        else if (key === "is_featured" || key === "is_active") {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid fields to update",
      });
    }

    // Add product ID to values
    values.push(productId);

    // Execute update
    await query(
      `UPDATE products SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
      values,
    );

    const response: ApiResponse = {
      success: true,
      message: "Product updated successfully",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

// DELETE /api/products/[id] - Delete product
async function deleteProduct(
  req: VercelRequest,
  res: VercelResponse,
  id: string,
) {
  try {
    // TODO: Add authentication when ready
    // const authResult = await verifyToken(req);
    // if (!authResult.success) {
    //   return res.status(401).json({ success: false, error: authResult.error });
    // }
    // if (!requireRole(authResult.user!, ['super_admin', 'admin'])) {
    //   return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    // }

    const productId = parseInt(id);

    // Check if product exists
    const existing = await queryOne<Product>(
      "SELECT id FROM products WHERE id = ?",
      [productId],
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Soft delete by setting is_active to false
    await query(
      "UPDATE products SET is_active = FALSE, updated_at = NOW() WHERE id = ?",
      [productId],
    );

    const response: ApiResponse = {
      success: true,
      message: "Product deleted successfully",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Delete product error:", error);
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
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Extract ID from query
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid product ID" });
  }

  if (req.method === "GET") {
    return getProduct(req, res, id);
  }

  if (req.method === "PUT") {
    return updateProduct(req, res, id);
  }

  if (req.method === "DELETE") {
    return deleteProduct(req, res, id);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
