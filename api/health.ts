import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    const dbConfigured = !!(
      process.env.DB_HOST &&
      process.env.DB_USER &&
      process.env.DB_PASSWORD &&
      process.env.DB_NAME
    );

    return res.status(200).json({
      success: true,
      message: "API is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        configured: dbConfigured,
        host: process.env.DB_HOST ? "✓" : "✗",
        user: process.env.DB_USER ? "✓" : "✗",
        password: process.env.DB_PASSWORD ? "✓" : "✗",
        name: process.env.DB_NAME ? "✓" : "✗",
      },
    });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
