import type { RequestHandler } from "express";
import { getPool } from "../../lib/db";
import nodemailer from "nodemailer";

/**
 * POST /api/admin/auth/check-user
 * Check if an admin user exists by email
 */
export const checkUser: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const [rows] = await getPool().query<any[]>(
      `SELECT id, email, role, first_name, last_name, phone, is_active, is_email_verified, created_at, last_login
       FROM admins WHERE email = ?`,
      [email],
    );

    if (rows.length > 0) {
      if (rows[0].is_active === 0) {
        return res.status(403).json({
          success: false,
          message: "This account has been deactivated",
        });
      }
      res.json({ success: true, exists: true, admin: rows[0] });
    } else {
      res.json({
        success: true,
        exists: false,
        message: "No admin account found with this email",
      });
    }
  } catch (error) {
    console.error("Error checking admin user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Helper function to send admin verification email
 */
async function sendAdminVerificationEmail(
  email: string,
  adminName: string,
  code: string,
): Promise<void> {
  console.log("🔍 Sending admin verification email to:", email);
  console.log("📧 Verification Code:", code);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Admin email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1b3148 0%, #9e4629 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .code-box { background: #f5f5f5; border: 2px solid #1b3148; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #1b3148; letter-spacing: 8px; font-family: monospace; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: linear-gradient(135deg, #1b3148, #9e4629); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verificación de Inicio de Sesión Administrador</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${adminName}</strong>,</p>
              <p>Solicitaste iniciar sesión en el Panel de Administración. Por favor usa el siguiente código de verificación:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p><strong>Este código expirará en 10 minutos.</strong></p>
              
              <p>Si no solicitaste este código, por favor ignora este correo.</p>
              
              <p>Saludos,<br>El equipo de Catálogo Industrial</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        '"Panel de Administración" <noreply@industrial-catalogue.com>',
      to: email,
      subject: "Código de Verificación - Panel Administrador",
      text: `Hola ${adminName},\n\nTu código de verificación es: ${code}\n\nEste código expirará en 10 minutos.\n\nSi no solicitaste este código, por favor ignora este correo.`,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending admin verification email:", error);
    console.log("⚠️  Continuing without email (code logged above)");
  }
}

/**
 * POST /api/admin/auth/send-code
 * Send verification code to admin user's email
 */
export const sendCode: RequestHandler = async (req, res) => {
  try {
    const { user_id, email } = req.body;

    console.log("🔵 sendAdminCode endpoint called");
    console.log("Received:", { user_id, email });

    if (!user_id || !email) {
      return res.status(400).json({
        success: false,
        message: "User ID and email are required",
      });
    }

    // Get admin user name from DB
    console.log("📊 Querying admin user from database...");
    const [userRows] = await getPool().query<any[]>(
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

    // Generate 6-digit session code
    const session_code = Math.floor(100000 + Math.random() * 900000);
    console.log("🔑 Generated session code:", session_code);

    // Store code in admin_sessions table with expiration (10 minutes)
    console.log("💾 Storing session code in admin_sessions...");
    await getPool().query(
      `INSERT INTO admin_sessions (user_id, session_code, is_active, expires_at) 
       VALUES (?, ?, 1, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
       ON DUPLICATE KEY UPDATE 
       session_code = VALUES(session_code), 
       is_active = 1,
       expires_at = VALUES(expires_at)`,
      [user_id, session_code],
    );

    // Send email with code
    console.log("📧 Attempting to send verification email...");
    await sendAdminVerificationEmail(
      email,
      admin_name,
      session_code.toString(),
    );

    console.log("✅ Verification code sent successfully");

    res.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("❌ Error in sendCode:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * POST /api/admin/auth/verify-code
 * Verify the code and return admin session
 */
export const verifyCode: RequestHandler = async (req, res) => {
  try {
    const { user_id, code } = req.body;

    if (!user_id || !code) {
      return res.status(400).json({
        success: false,
        message: "User ID and code are required",
      });
    }

    // Check if code is valid and not expired
    const [sessionRows] = await getPool().query<any[]>(
      `SELECT * FROM admin_sessions 
       WHERE user_id = ? AND session_code = ? AND is_active = 1 AND expires_at > NOW()`,
      [user_id, code],
    );

    if (sessionRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Get admin user details
    const [adminRows] = await getPool().query<any[]>(
      `SELECT id, email, role, first_name, last_name, phone, is_active, is_email_verified, created_at, last_login
       FROM admins WHERE id = ?`,
      [user_id],
    );

    if (adminRows.length === 0 || adminRows[0].is_active === 0) {
      return res.status(403).json({
        success: false,
        message: "Account not found or inactive",
      });
    }

    // Update last login
    await getPool().query("UPDATE admins SET last_login = NOW() WHERE id = ?", [
      user_id,
    ]);

    // Update email verification status if not verified
    if (adminRows[0].is_email_verified === 0) {
      await getPool().query(
        "UPDATE admins SET is_email_verified = 1 WHERE id = ?",
        [user_id],
      );
    }

    // Deactivate used session
    await getPool().query(
      "UPDATE admin_sessions SET is_active = 0 WHERE user_id = ?",
      [user_id],
    );

    res.json({
      success: true,
      message: "Login successful",
      admin: adminRows[0],
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
