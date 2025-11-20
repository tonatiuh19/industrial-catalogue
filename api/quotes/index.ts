import { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "../../server/lib/db";
import {
  Quote,
  QuoteListResponse,
  ApiResponse,
  CreateQuoteRequest,
} from "../../shared/api";

// Generate unique quote number
function generateQuoteNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QT-${timestamp}-${random}`;
}

// GET /api/quotes - List quotes with pagination
async function getQuotes(req: VercelRequest, res: VercelResponse) {
  try {
    const { page = "1", limit = "20", status, customer_email } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(Math.max(1, parseInt(limit as string)), 100);
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    if (status) {
      conditions.push("q.status = ?");
      params.push(status);
    }

    if (customer_email) {
      conditions.push("q.customer_email = ?");
      params.push(customer_email);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total FROM quotes q ${whereClause}`,
      params,
    );
    const total = countResult[0].total;

    // Get quotes
    const quotes = await query<Quote[]>(
      `SELECT q.* 
       FROM quotes q 
       ${whereClause}
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset],
    );

    const response: QuoteListResponse = {
      success: true,
      data: quotes,
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
      error: "Internal server error",
    });
  }
}

// POST /api/quotes - Create new quote
async function createQuote(req: VercelRequest, res: VercelResponse) {
  try {
    const quoteData = req.body as CreateQuoteRequest;

    // Validate required fields
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

    // Generate quote number
    const quoteNumber = generateQuoteNumber();

    // Insert quote
    const quoteResult = await query<any>(
      `INSERT INTO quotes (
        quote_number, customer_name, customer_email, customer_phone,
        customer_company, customer_message, total_items, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        quoteNumber,
        quoteData.customer_name,
        quoteData.customer_email,
        quoteData.customer_phone || null,
        quoteData.customer_company || null,
        quoteData.customer_message || null,
        quoteData.items.length,
      ],
    );

    const quoteId = quoteResult.insertId;

    // Insert quote items
    for (const item of quoteData.items) {
      // Get product price
      const product = await queryOne<any>(
        "SELECT price FROM products WHERE id = ?",
        [item.product_id],
      );

      await query(
        `INSERT INTO quote_items (quote_id, product_id, quantity, unit_price, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [
          quoteId,
          item.product_id,
          item.quantity,
          product?.price || null,
          item.notes || null,
        ],
      );
    }

    const response: ApiResponse<{ id: number; quote_number: string }> = {
      success: true,
      data: { id: quoteId, quote_number: quoteNumber },
      message: "Quote created successfully",
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error("Create quote error:", error);
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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return getQuotes(req, res);
  }

  if (req.method === "POST") {
    return createQuote(req, res);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
