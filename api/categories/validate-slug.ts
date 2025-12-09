import { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Slug is required" });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as count FROM categories WHERE slug = ?",
      [slug],
    );

    const count = (rows as any)[0].count;
    const available = count === 0;

    res.json({ success: true, available });
  } catch (error) {
    console.error("Error validating slug:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
