import { Request, Response } from "express";

// Import the serverless function handlers
export async function getAdminProducts(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/products/index");
    const vercelReq = { ...req, query: { ...req.query, ...req.params } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Admin products error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getAdminProduct(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/products/[id]");
    const vercelReq = { ...req, query: { ...req.query, id: req.params.id } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Admin product error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function createAdminProduct(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/products/index");
    const vercelReq = { ...req, query: { ...req.query, ...req.params } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Create admin product error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateAdminProduct(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/products/[id]");
    const vercelReq = { ...req, query: { ...req.query, id: req.params.id } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Update admin product error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteAdminProduct(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/products/[id]");
    const vercelReq = { ...req, query: { ...req.query, id: req.params.id } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Delete admin product error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
