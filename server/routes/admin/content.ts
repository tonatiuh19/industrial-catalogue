import { Request, Response } from "express";

export async function getContentPages(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/content/index");
    const vercelReq = { ...req, query: { ...req.query, ...req.params } };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Admin content error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getContentPage(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/content/[slug]");
    const vercelReq = {
      ...req,
      query: { ...req.query, slug: req.params.slug },
    };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Admin content page error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateContentPage(req: Request, res: Response) {
  try {
    const handler = await import("../../../api/admin/content/[slug]");
    const vercelReq = {
      ...req,
      query: { ...req.query, slug: req.params.slug },
    };
    return handler.default(vercelReq as any, res as any);
  } catch (error) {
    console.error("Update content page error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
