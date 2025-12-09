import { Request, Response } from "express";

export async function getAdminQuotes(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/quotes/index");
    const vercelReq = { ...req, query: { ...req.query, ...req.params } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Admin quotes error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getAdminQuote(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/quotes/[id]");
    const vercelReq = { ...req, query: { ...req.query, id: req.params.id } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Admin quote error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateAdminQuote(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/quotes/[id]");
    const vercelReq = { ...req, query: { ...req.query, id: req.params.id } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Update admin quote error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
