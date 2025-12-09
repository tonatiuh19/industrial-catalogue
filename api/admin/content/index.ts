import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../../lib/db";

/**
 * GET /api/admin/content - Get all content pages
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const [pages] = await getPool().query<any[]>(
      `SELECT * FROM content_pages ORDER BY slug`,
    );

    res.json({ success: true, data: pages });
  } catch (error) {
    console.error("Error fetching content pages:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
