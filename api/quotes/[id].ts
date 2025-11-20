import { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "../../server/lib/db";
import { Quote, QuoteItem, ApiResponse } from "../../shared/api";

// GET /api/quotes/[id] - Get single quote with items
async function getQuote(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const quoteId = parseInt(id);

    // Get quote
    const quote = await queryOne<Quote>(
      `SELECT q.* 
       FROM quotes q 
       WHERE q.id = ?`,
      [quoteId],
    );

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: "Quote not found",
      });
    }

    // Get quote items
    const items = await query<QuoteItem[]>(
      `SELECT qi.*, p.name as product_name, p.sku as product_sku
       FROM quote_items qi
       LEFT JOIN products p ON qi.product_id = p.id
       WHERE qi.quote_id = ?`,
      [quoteId],
    );

    quote.items = items;

    const response: ApiResponse<Quote> = {
      success: true,
      data: quote,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get quote error:", error);
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
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Extract ID from query
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ success: false, error: "Invalid quote ID" });
  }

  if (req.method === "GET") {
    return getQuote(req, res, id);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
