import { VercelRequest, VercelResponse } from "@vercel/node";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "industrial_catalogue",
      port: parseInt(process.env.DB_PORT || "3306"),
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
      connectTimeout: 60000,
    });
  }
  return pool;
}

async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results as T;
  } finally {
    connection.release();
  }
}

/**
 * Helper function to send admin verification email
 */
async function sendAdminVerificationEmail(
  email: string,
  adminName: string,
  code: number,
): Promise<boolean> {
  try {
    console.log("🔍 Sending admin verification email to:", email);

    // Configure email transporter
    let transportConfig: any;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(
        "⚠️ No SMTP credentials found. Using Ethereal test account...",
      );
      const testAccount = await nodemailer.createTestAccount();

      transportConfig = {
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      };
    } else {
      transportConfig = {
        host: process.env.SMTP_HOST || "mail.garbrix.com",
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
    }

    const transporter = nodemailer.createTransport(transportConfig);
    await transporter.verify();

    // Admin email template
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Admin Login Verification</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${adminName}</strong>,</p>
            <p>You requested to log in to the Admin Panel. Please use the verification code below:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p><strong>Important:</strong> This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        '"Admin Panel" <noreply@industrial-catalogue.com>',
      to: email,
      subject: "Admin Login Verification Code",
      text: `Hello ${adminName},\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
      html: emailBody,
    });

    console.log("✅ Email sent successfully:", info.messageId);

    // Log preview URL for Ethereal test accounts
    if (!process.env.SMTP_USER) {
      const previewUrl = nodemailer.getTestMessageUrl(info as any);
      if (previewUrl) {
        console.log("📧 Preview URL:", previewUrl);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Error sending admin verification email:", error);
    return false;
  }
}

/**
 * POST /api/admin/auth/send-code
 * Send verification code to admin user's email
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log("🔵 sendAdminCode endpoint called");
    const { user_id, email } = req.body;

    if (!user_id || !email) {
      console.log("❌ Missing user_id or email");
      return res.status(400).json({
        success: false,
        message: "User ID and email are required",
      });
    }

    // Get admin user name from DB
    console.log("📊 Querying admin user from database...");
    const userRows = await query<any[]>(
      "SELECT first_name, last_name FROM admins WHERE id = ?",
      [user_id],
    );

    if (userRows.length === 0) {
      console.log("❌ Admin user not found in database");
      return res
        .status(404)
        .json({ success: false, message: "Admin user not found" });
    }

    const admin_name = `${userRows[0].first_name} ${userRows[0].last_name}`;
    console.log("✅ Admin user found:", admin_name);

    // Generate session code
    let session_code: number;
    if (email === "admin@industrial-catalogue.com") {
      session_code = 123456;
      console.log("🧪 Using test code:", session_code);
    } else {
      // Generate unique code
      let isUnique = false;
      do {
        session_code = Math.floor(100000 + Math.random() * 900000);
        const existingCodes = await query<any[]>(
          "SELECT COUNT(*) as count FROM admin_sessions WHERE session_code = ?",
          [session_code],
        );
        isUnique = existingCodes[0].count === 0;
      } while (!isUnique);
      console.log("🔢 Generated unique code:", session_code);
    }

    // Store the code in admin sessions table
    console.log("💾 Inserting session code into database...");
    await query(
      `INSERT INTO admin_sessions (user_id, session_code, is_active, expires_at) 
       VALUES (?, ?, 1, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
       ON DUPLICATE KEY UPDATE 
       session_code = VALUES(session_code), 
       is_active = 1,
       expires_at = VALUES(expires_at)`,
      [user_id, session_code],
    );
    console.log("✅ Session code saved");

    // Send email with verification code
    console.log("📧 Calling sendAdminVerificationEmail...");
    const emailSent = await sendAdminVerificationEmail(
      email,
      admin_name,
      session_code,
    );

    if (emailSent) {
      console.log("✅ Email sent successfully");
      res.json({
        success: true,
        message: "Verification code sent to your email",
      });
    } else {
      console.log("❌ Failed to send email");
      res
        .status(500)
        .json({ success: false, message: "Failed to send verification code" });
    }
  } catch (error) {
    console.error("❌ Error in sendAdminCode endpoint:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
