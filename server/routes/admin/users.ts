import { Request, Response } from "express";

export async function getAdminUsers(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/users/index");
    const vercelReq = { ...req, query: { ...req.query, ...req.params } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getAdminUser(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/users/[id]");
    const vercelReq = { ...req, query: { ...req.query, id: req.params.id } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Admin user error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function createAdminUser(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/users/index");
    const vercelReq = { ...req, query: { ...req.query, ...req.params } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Create admin user error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateAdminUser(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/users/[id]");
    const vercelReq = { ...req, query: { ...req.query, id: req.params.id } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Update admin user error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteAdminUser(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/users/[id]");
    const vercelReq = { ...req, query: { ...req.query, id: req.params.id } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Delete admin user error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
