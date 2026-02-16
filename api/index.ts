import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import type { RequestHandler } from "express";
import nodemailer from "nodemailer";
import type {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  Category,
  CategoryListResponse,
  Quote,
  QuoteListResponse,
  CreateQuoteRequest,
} from "../shared/api";

// ==================== DATABASE CONNECTION ====================
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results as T;
  } finally {
    connection.release();
  }
}

// ==================== HEALTH CHECK ====================
const handleHealth: RequestHandler = async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    const dbConfigured = !!(
      process.env.DB_HOST &&
      process.env.DB_USER &&
      process.env.DB_PASSWORD &&
      process.env.DB_NAME
    );

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: {
        configured: dbConfigured,
        connected: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ==================== CATEGORIES ====================
const getCategories: RequestHandler = async (req, res) => {
  try {
    const { include_inactive } = req.query;

    let whereClause = "";
    if (!include_inactive) {
      whereClause = "WHERE is_active = TRUE";
    }

    const categories = await query<Category[]>(
      `SELECT * FROM categories 
       ${whereClause}
       ORDER BY display_order ASC, name ASC`,
    );

    const response: CategoryListResponse = {
      success: true,
      data: categories,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get categories error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

const validateCategorySlug: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.query;

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({
        success: false,
        message: "Slug parameter is required",
      });
    }

    const categories = await query<any[]>(
      "SELECT id FROM categories WHERE slug = ?",
      [slug],
    );

    return res.status(200).json({
      success: true,
      available: categories.length === 0,
    });
  } catch (error) {
    console.error("Validate slug error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== BRANDS ====================
const getBrands: RequestHandler = async (req, res) => {
  try {
    const { manufacturer_id, include_inactive } = req.query;

    let whereClause = "";
    const params: any[] = [];

    if (!include_inactive) {
      whereClause = "WHERE b.is_active = TRUE";
    }

    if (manufacturer_id) {
      whereClause += whereClause ? " AND " : "WHERE ";
      whereClause += "b.manufacturer_id = ?";
      params.push(parseInt(manufacturer_id as string));
    }

    const brands = await query<any[]>(
      `SELECT b.*, 
              c.name as category_name,
              s.name as subcategory_name
       FROM brands b
       LEFT JOIN categories c ON b.category_id = c.id
       LEFT JOIN subcategories s ON b.subcategory_id = s.id
       ${whereClause}
       ORDER BY b.name ASC`,
      params,
    );

    return res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error("Get brands error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== MANUFACTURERS ====================
const getManufacturers: RequestHandler = async (req, res) => {
  try {
    const { include_inactive } = req.query;

    let whereClause = "";
    if (!include_inactive) {
      whereClause = "WHERE m.is_active = TRUE";
    }

    const manufacturers = await query<any[]>(
      `SELECT m.*, 
              c.name as category_name,
              s.name as subcategory_name
       FROM manufacturers m
       LEFT JOIN categories c ON m.category_id = c.id
       LEFT JOIN subcategories s ON m.subcategory_id = s.id
       ${whereClause}
       ORDER BY m.name ASC`,
    );

    return res.status(200).json({
      success: true,
      data: manufacturers,
    });
  } catch (error) {
    console.error("Get manufacturers error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== MODELS ====================
const getModels: RequestHandler = async (req, res) => {
  try {
    const { brand_id, include_inactive } = req.query;

    let whereClause = "";
    const params: any[] = [];

    if (!include_inactive) {
      whereClause = "WHERE is_active = TRUE";
    }

    if (brand_id) {
      whereClause += whereClause ? " AND " : "WHERE ";
      whereClause += "brand_id = ?";
      params.push(parseInt(brand_id as string));
    }

    const models = await query<any[]>(
      `SELECT * FROM models 
       ${whereClause}
       ORDER BY name ASC`,
      params,
    );

    return res.status(200).json({
      success: true,
      data: models,
    });
  } catch (error) {
    console.error("Get models error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== PRODUCTS ====================
const getProducts: RequestHandler = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "20",
      category_id,
      manufacturer_id,
      brand_id,
      model_id,
      is_featured,
      is_active = "true",
      search,
      min_price,
      max_price,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(Math.max(1, parseInt(limit as string)), 100);
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (is_active !== undefined) {
      conditions.push("p.is_active = ?");
      params.push(is_active === "true" ? 1 : 0);
    }

    if (category_id) {
      conditions.push("p.category_id = ?");
      params.push(parseInt(category_id as string));
    }

    if (manufacturer_id) {
      conditions.push("p.manufacturer_id = ?");
      params.push(parseInt(manufacturer_id as string));
    }

    if (brand_id) {
      conditions.push("p.brand_id = ?");
      params.push(parseInt(brand_id as string));
    }

    if (model_id) {
      conditions.push("p.model_id = ?");
      params.push(parseInt(model_id as string));
    }

    if (is_featured !== undefined) {
      conditions.push("p.is_featured = ?");
      params.push(is_featured === "true" ? 1 : 0);
    }

    if (min_price) {
      conditions.push("p.price >= ?");
      params.push(parseFloat(min_price as string));
    }

    if (max_price) {
      conditions.push("p.price <= ?");
      params.push(parseFloat(max_price as string));
    }

    if (search) {
      conditions.push(
        "(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)",
      );
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total 
       FROM products p
       ${whereClause}`,
      params,
    );
    const total = countResult[0]?.total || 0;

    // Get products
    const products = await query<Product[]>(
      `SELECT 
        p.*,
        c.name as category_name,
        m.name as manufacturer_name,
        b.name as brand_name,
        mo.name as model_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN models mo ON p.model_id = mo.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset],
    );

    // Format images from database fields
    const productsWithImages = products.map((product) => {
      const images: string[] = [];
      if (product.main_image) images.push(product.main_image);
      if (product.extra_images) {
        try {
          const extraImages = JSON.parse(product.extra_images);
          if (Array.isArray(extraImages)) images.push(...extraImages);
        } catch (e) {
          // extra_images might be a string, not JSON
        }
      }
      return { ...product, images };
    });

    const response: ProductListResponse = {
      success: true,
      data: productsWithImages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getProductById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await query<Product[]>(
      `SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        m.name as manufacturer_name,
        b.name as brand_name,
        mo.name as model_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN models mo ON p.model_id = mo.id
       WHERE p.id = ?`,
      [parseInt(id)],
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const product = products[0];

    // Format images from database fields
    const images: string[] = [];
    if (product.main_image) images.push(product.main_image);
    if (product.extra_images) {
      try {
        const extraImages = JSON.parse(product.extra_images);
        if (Array.isArray(extraImages)) images.push(...extraImages);
      } catch (e) {
        // extra_images might be a string, not JSON
      }
    }

    return res.status(200).json({
      success: true,
      data: { ...product, images },
    });
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== EMAIL SERVICE ====================
interface NotificationSettings {
  enable_client_notifications?: string;
  enable_admin_notifications?: string;
}

interface SMTPSettings {
  smtp_host?: string;
  smtp_port?: string;
  smtp_secure?: string;
  smtp_username?: string;
  smtp_password?: string;
  from_email?: string;
  from_name?: string;
  company_name?: string;
  company_website?: string;
  company_logo?: string;
}

interface EmailTemplate {
  id: number;
  template_key: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables?: string[];
  is_active: boolean;
}

// Get notification settings from database
const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const settings = await query<
      Array<{ setting_key: string; setting_value: string }>
    >("SELECT setting_key, setting_value FROM notification_settings");

    const settingsObj: NotificationSettings = {};
    settings.forEach((setting) => {
      settingsObj[setting.setting_key as keyof NotificationSettings] =
        setting.setting_value;
    });

    return settingsObj;
  } catch (error) {
    console.error("Error getting notification settings:", error);
    return {};
  }
};

// Get SMTP settings from environment variables
const getSMTPSettings = (): SMTPSettings => {
  return {
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT || "587",
    smtp_secure: process.env.SMTP_SECURE || "tls",
    smtp_username: process.env.SMTP_USER, // Using SMTP_USER from .env
    smtp_password: process.env.SMTP_PASSWORD,
    from_email: process.env.SMTP_FROM || process.env.SMTP_USER,
    from_name: "Industrial", // Extracted from SMTP_FROM
    company_name: process.env.COMPANY_NAME || "Industrial",
    company_website: process.env.COMPANY_WEBSITE || "https://industrial.com",
    company_logo: process.env.COMPANY_LOGO || "https://industrial.com/logo.png",
  };
};

// Get email template by key
const getEmailTemplate = async (
  templateKey: string,
): Promise<EmailTemplate | null> => {
  try {
    const templates = await query<EmailTemplate[]>(
      "SELECT * FROM email_templates WHERE template_key = ? AND is_active = 1",
      [templateKey],
    );

    if (templates.length === 0) return null;

    const template = templates[0];
    if (template.variables && typeof template.variables === "string") {
      try {
        template.variables = JSON.parse(template.variables);
      } catch (e) {
        template.variables = [];
      }
    }

    return template;
  } catch (error) {
    console.error("Error getting email template:", error);
    return null;
  }
};

// Simple template variable replacement
const renderTemplate = (
  template: string,
  variables: Record<string, any>,
): string => {
  let rendered = template;

  // Replace simple variables {{variable}}
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\{\{${key}\}\}`, "g");
    rendered = rendered.replace(regex, value || "");
  }

  // Handle conditional blocks {{#if variable}}content{{/if}}
  rendered = rendered.replace(
    /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (match, varName, content) => {
      return variables[varName] ? content : "";
    },
  );

  return rendered;
};

// Create email transporter
const createEmailTransporter = () => {
  const settings = getSMTPSettings();

  if (
    !settings.smtp_host ||
    !settings.smtp_username ||
    !settings.smtp_password
  ) {
    console.warn("Email settings not configured in environment variables");
    return null;
  }

  try {
    return nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port || "587"),
      secure: settings.smtp_secure === "true" || settings.smtp_secure === "ssl", // Handle boolean string
      auth: {
        user: settings.smtp_username,
        pass: settings.smtp_password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  } catch (error) {
    console.error("Error creating email transporter:", error);
    return null;
  }
};

// Send email using template
const sendTemplateEmail = async (
  templateKey: string,
  to: string | string[],
  variables: Record<string, any>,
): Promise<boolean> => {
  try {
    const smtpSettings = getSMTPSettings();
    const template = await getEmailTemplate(templateKey);
    const transporter = createEmailTransporter();

    if (!template || !transporter) {
      console.error("Template or transporter not available");
      return false;
    }

    // Merge SMTP settings with template variables for company info
    const templateVariables = {
      ...variables,
      company_name: smtpSettings.company_name,
      company_website: smtpSettings.company_website,
      company_logo: smtpSettings.company_logo,
    };

    const subject = renderTemplate(template.subject, templateVariables);
    const html = renderTemplate(template.html_content, templateVariables);
    const text = template.text_content
      ? renderTemplate(template.text_content, templateVariables)
      : undefined;

    const mailOptions = {
      from: `${smtpSettings.from_name || "Trenor"} <${smtpSettings.from_email}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending template email:", error);
    return false;
  }
};

// Get admin notification recipients
const getAdminNotificationRecipients = async (
  notificationType: string = "quote_requests",
): Promise<string[]> => {
  try {
    const admins = await query<Array<{ email: string }>>(
      `SELECT a.email 
       FROM admins a 
       INNER JOIN admin_notifications an ON a.id = an.admin_id 
       WHERE a.is_active = 1 AND an.notification_type = ? AND an.is_enabled = 1`,
      [notificationType],
    );

    return admins.map((admin) => admin.email);
  } catch (error) {
    console.error("Error getting admin recipients:", error);
    return [];
  }
};

// Send quote notifications
const sendQuoteNotifications = async (quoteData: any) => {
  const settings = await getNotificationSettings();
  const smtpSettings = getSMTPSettings();

  // Prepare template variables
  const templateVars = {
    ...quoteData,
    date: new Date().toLocaleDateString("es-ES"),
    company_name: smtpSettings.company_name || "Industrial",
    company_logo: smtpSettings.company_logo || "",
    company_website: smtpSettings.company_website || "",
    admin_url: process.env.ADMIN_URL || smtpSettings.company_website,
  };

  // Send client confirmation email
  if (
    settings.enable_client_notifications === "1" &&
    quoteData.customer_email
  ) {
    try {
      await sendTemplateEmail(
        "client_quote_confirmation",
        quoteData.customer_email,
        templateVars,
      );
    } catch (error) {
      console.error("Error sending client notification:", error);
    }
  }

  // Send admin notification emails
  if (settings.enable_admin_notifications === "1") {
    try {
      const adminEmails =
        await getAdminNotificationRecipients("quote_requests");
      if (adminEmails.length > 0) {
        await sendTemplateEmail(
          "admin_quote_notification",
          adminEmails,
          templateVars,
        );
      }
    } catch (error) {
      console.error("Error sending admin notifications:", error);
    }
  }
};

// Send contact form notifications
const sendContactNotifications = async (contactData: any) => {
  const settings = await getNotificationSettings();
  const smtpSettings = getSMTPSettings();

  // Prepare template variables
  const templateVars = {
    ...contactData,
    date: new Date().toLocaleDateString("es-ES"),
    company_name: smtpSettings.company_name || "Industrial",
    company_logo: smtpSettings.company_logo || "",
    company_website: smtpSettings.company_website || "",
    admin_url: process.env.ADMIN_URL || smtpSettings.company_website,
  };

  // Send client confirmation email
  if (settings.enable_client_notifications === "1" && contactData.email) {
    try {
      await sendTemplateEmail(
        "contact_confirmation",
        contactData.email,
        templateVars,
      );
    } catch (error) {
      console.error("Error sending contact confirmation:", error);
    }
  }

  // Send admin notification emails
  if (settings.enable_admin_notifications === "1") {
    try {
      const adminEmails = await getAdminNotificationRecipients(
        "contact_submissions",
      );
      if (adminEmails.length > 0) {
        await sendTemplateEmail(
          "admin_contact_notification",
          adminEmails,
          templateVars,
        );
      }
    } catch (error) {
      console.error("Error sending contact admin notifications:", error);
    }
  }
};

// ==================== NOTIFICATION SETTINGS API ====================
const getNotificationSettingsApi: RequestHandler = async (req, res) => {
  try {
    const settings = await getNotificationSettings();
    return res.json({ success: true, data: settings });
  } catch (error) {
    console.error("Get notification settings error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updateNotificationSettings: RequestHandler = async (req, res) => {
  try {
    const updates = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const [key, value] of Object.entries(updates)) {
        await connection.execute(
          "INSERT INTO notification_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
          [key, value],
        );
      }

      await connection.commit();
      return res.json({
        success: true,
        message: "Settings updated successfully",
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update notification settings error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getAdminNotifications: RequestHandler = async (req, res) => {
  try {
    const notifications = await query<Array<any>>(
      `SELECT an.*, a.email, a.first_name, a.last_name 
       FROM admin_notifications an 
       INNER JOIN admins a ON an.admin_id = a.id 
       WHERE a.is_active = 1 
       ORDER BY a.first_name, a.last_name`,
    );

    return res.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Get admin notifications error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updateAdminNotifications: RequestHandler = async (req, res) => {
  try {
    const { admin_id, notification_type, is_enabled } = req.body;

    await query(
      "INSERT INTO admin_notifications (admin_id, notification_type, is_enabled) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE is_enabled = VALUES(is_enabled)",
      [admin_id, notification_type, is_enabled],
    );

    return res.json({
      success: true,
      message: "Notification settings updated successfully",
    });
  } catch (error) {
    console.error("Update admin notifications error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// Get SMTP settings from environment (read-only for admin interface)
const getSMTPSettingsApi: RequestHandler = async (req, res) => {
  try {
    const settings = getSMTPSettings();

    // Return masked password for security
    const maskedSettings = {
      ...settings,
      smtp_password: settings.smtp_password ? "••••••••" : "",
    };

    return res.json({ success: true, data: maskedSettings });
  } catch (error) {
    console.error("Get SMTP settings error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// Test email configuration
const testEmail: RequestHandler = async (req, res) => {
  try {
    const { email, settings: testSettings } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email address is required",
      });
    }

    // Create temporary transporter with test settings
    let transporter;
    if (testSettings) {
      // Use provided test settings
      transporter = nodemailer.createTransport({
        host: testSettings.smtp_host,
        port: parseInt(testSettings.smtp_port || "587"),
        secure: testSettings.smtp_secure === "ssl",
        auth: {
          user: testSettings.smtp_username,
          pass: testSettings.smtp_password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } else {
      // Use environment settings
      transporter = createEmailTransporter();
    }

    if (!transporter) {
      return res.status(400).json({
        success: false,
        error:
          "Email configuration not available. Please check environment variables.",
      });
    }

    const currentSettings = testSettings || getSMTPSettings();

    // Send test email
    const mailOptions = {
      from: `${currentSettings.from_name || "Trenor"} <${currentSettings.from_email}>`,
      to: email,
      subject: "Prueba de Configuración SMTP - Trenor Admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2c5aa0 0%, #1a365d 100%); color: white; padding: 30px; text-align: center;">
            <h1>🧪 Prueba de Email Exitosa</h1>
            <p>Tu configuración SMTP está funcionando correctamente</p>
          </div>
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2>Configuración Verificada</h2>
            <ul>
              <li><strong>Servidor:</strong> ${currentSettings.smtp_host}</li>
              <li><strong>Puerto:</strong> ${currentSettings.smtp_port}</li>
              <li><strong>Seguridad:</strong> ${currentSettings.smtp_secure?.toUpperCase()}</li>
              <li><strong>Usuario:</strong> ${currentSettings.smtp_username}</li>
            </ul>
            <p style="margin-top: 20px; padding: 15px; background-color: #d4edda; border-left: 4px solid #28a745; color: #155724;">
              ✅ La configuración SMTP ha sido verificada exitosamente. Los emails de notificación funcionarán correctamente.
            </p>
          </div>
          <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p>&copy; 2024 ${currentSettings.company_name || "Trenor"}. Sistema de Administración</p>
          </div>
        </div>
      `,
      text: `Prueba de Email SMTP - La configuración está funcionando correctamente.
      
Servidor: ${currentSettings.smtp_host}
Puerto: ${currentSettings.smtp_port}
Seguridad: ${currentSettings.smtp_secure}
Usuario: ${currentSettings.smtp_username}

La configuración SMTP ha sido verificada exitosamente.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Test email error:", error);
    return res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Error sending test email",
    });
  }
};

// ==================== ADMIN CONTACT & SUPPORT ====================
const getContactSubmissions: RequestHandler = async (req, res) => {
  try {
    const { page = "1", limit = "20", status, priority } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(Math.max(1, parseInt(limit as string)), 100);
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status) {
      conditions.push("c.status = ?");
      params.push(status);
    }

    if (priority) {
      conditions.push("c.priority = ?");
      params.push(priority);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total FROM contact_submissions c ${whereClause}`,
      params,
    );
    const total = countResult[0]?.total || 0;

    // Get submissions with assigned admin info
    const submissions = await query<any[]>(
      `SELECT c.*, 
              a.first_name as assigned_first_name, 
              a.last_name as assigned_last_name,
              (SELECT COUNT(*) FROM support_responses sr WHERE sr.contact_submission_id = c.id) as response_count
       FROM contact_submissions c
       LEFT JOIN admins a ON c.assigned_to = a.id
       ${whereClause}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset],
    );

    return res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get contact submissions error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getContactSubmissionById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Get submission with assigned admin info
    const submissions = await query<any[]>(
      `SELECT c.*, 
              a.first_name as assigned_first_name, 
              a.last_name as assigned_last_name
       FROM contact_submissions c
       LEFT JOIN admins a ON c.assigned_to = a.id
       WHERE c.id = ?`,
      [id],
    );

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    // Get responses
    const responses = await query<any[]>(
      `SELECT sr.*, 
              a.first_name as admin_first_name,
              a.last_name as admin_last_name
       FROM support_responses sr
       LEFT JOIN admins a ON sr.admin_id = a.id
       WHERE sr.contact_submission_id = ?
       ORDER BY sr.created_at ASC`,
      [id],
    );

    const submission = {
      ...submissions[0],
      responses,
    };

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Get contact submission error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updateContactSubmission: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assigned_to } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push("status = ?");
      params.push(status);
    }

    if (priority) {
      updates.push("priority = ?");
      params.push(priority);
    }

    if (assigned_to !== undefined) {
      updates.push("assigned_to = ?");
      params.push(assigned_to === "" ? null : assigned_to);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    updates.push("updated_at = NOW()");
    params.push(id);

    await query(
      `UPDATE contact_submissions SET ${updates.join(", ")} WHERE id = ?`,
      params,
    );

    return res.status(200).json({
      success: true,
      message: "Contact submission updated successfully",
    });
  } catch (error) {
    console.error("Update contact submission error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const addSupportResponse: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, is_internal_note = false, admin_id } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO support_responses (contact_submission_id, admin_id, message, is_internal_note) 
       VALUES (?, ?, ?, ?)`,
      [id, admin_id || null, message, is_internal_note],
    );

    // Update submission status to in_progress if it's still new
    await query(
      `UPDATE contact_submissions 
       SET status = CASE WHEN status = 'new' THEN 'in_progress' ELSE status END,
           updated_at = NOW()
       WHERE id = ?`,
      [id],
    );

    return res.status(201).json({
      success: true,
      data: { id: (result as any).insertId },
      message: "Response added successfully",
    });
  } catch (error) {
    console.error("Add support response error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const deleteContactSubmission: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if submission exists
    const submissions = await query<any[]>(
      "SELECT id FROM contact_submissions WHERE id = ?",
      [id],
    );

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    // Delete submission (responses will be cascade deleted)
    await query("DELETE FROM contact_submissions WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Contact submission deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact submission error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== ADMIN FAQ MANAGEMENT ====================
const createFAQCategory: RequestHandler = async (req, res) => {
  try {
    const { name, slug, description, sort_order = 0 } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO faq_categories (name, slug, description, sort_order) 
       VALUES (?, ?, ?, ?)`,
      [name, slug, description || null, sort_order],
    );

    return res.status(201).json({
      success: true,
      data: { id: (result as any).insertId },
      message: "FAQ category created successfully",
    });
  } catch (error: any) {
    console.error("Create FAQ category error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updateFAQCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, sort_order, is_active } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (name) {
      updates.push("name = ?");
      params.push(name);
    }

    if (slug) {
      updates.push("slug = ?");
      params.push(slug);
    }

    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description || null);
    }

    if (sort_order !== undefined) {
      updates.push("sort_order = ?");
      params.push(sort_order);
    }

    if (is_active !== undefined) {
      updates.push("is_active = ?");
      params.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    updates.push("updated_at = NOW()");
    params.push(id);

    await query(
      `UPDATE faq_categories SET ${updates.join(", ")} WHERE id = ?`,
      params,
    );

    return res.status(200).json({
      success: true,
      message: "FAQ category updated successfully",
    });
  } catch (error: any) {
    console.error("Update FAQ category error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const deleteFAQCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has FAQ items
    const items = await query<any[]>(
      "SELECT COUNT(*) as count FROM faq_items WHERE category_id = ?",
      [id],
    );

    if (items[0]?.count > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete category that contains FAQ items. Please delete the items first.",
      });
    }

    await query("DELETE FROM faq_categories WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "FAQ category deleted successfully",
    });
  } catch (error) {
    console.error("Delete FAQ category error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const createFAQItem: RequestHandler = async (req, res) => {
  try {
    const {
      category_id,
      question,
      answer,
      sort_order = 0,
      created_by,
    } = req.body;

    if (!category_id || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Category ID, question, and answer are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO faq_items (category_id, question, answer, sort_order, created_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [category_id, question, answer, sort_order, created_by || null],
    );

    return res.status(201).json({
      success: true,
      data: { id: (result as any).insertId },
      message: "FAQ item created successfully",
    });
  } catch (error) {
    console.error("Create FAQ item error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updateFAQItem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, question, answer, sort_order, is_active } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (category_id) {
      updates.push("category_id = ?");
      params.push(category_id);
    }

    if (question) {
      updates.push("question = ?");
      params.push(question);
    }

    if (answer) {
      updates.push("answer = ?");
      params.push(answer);
    }

    if (sort_order !== undefined) {
      updates.push("sort_order = ?");
      params.push(sort_order);
    }

    if (is_active !== undefined) {
      updates.push("is_active = ?");
      params.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    updates.push("updated_at = NOW()");
    params.push(id);

    await query(
      `UPDATE faq_items SET ${updates.join(", ")} WHERE id = ?`,
      params,
    );

    return res.status(200).json({
      success: true,
      message: "FAQ item updated successfully",
    });
  } catch (error) {
    console.error("Update FAQ item error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const deleteFAQItem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM faq_items WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "FAQ item deleted successfully",
    });
  } catch (error) {
    console.error("Delete FAQ item error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== QUOTES ====================
const getQuotes: RequestHandler = async (req, res) => {
  try {
    const { page = "1", limit = "20", status, email } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(Math.max(1, parseInt(limit as string)), 100);
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status) {
      conditions.push("q.status = ?");
      params.push(status);
    }

    if (email) {
      conditions.push("q.email = ?");
      params.push(email);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total FROM quotes q ${whereClause}`,
      params,
    );
    const total = countResult[0]?.total || 0;

    // Get quotes
    const quotes = await query<Quote[]>(
      `SELECT * FROM quotes q
       ${whereClause}
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset],
    );

    // Get items for each quote
    const quotesWithItems = await Promise.all(
      quotes.map(async (quote) => {
        const items = await query<any[]>(
          `SELECT 
            qi.*,
            p.name as product_name,
            p.sku as product_sku
           FROM quote_items qi
           LEFT JOIN products p ON qi.product_id = p.id
           WHERE qi.quote_id = ?`,
          [quote.id],
        );
        return { ...quote, items };
      }),
    );

    const response: QuoteListResponse = {
      success: true,
      data: quotesWithItems,
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
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getQuoteById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const quotes = await query<Quote[]>("SELECT * FROM quotes WHERE id = ?", [
      parseInt(id),
    ]);

    if (quotes.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Quote not found",
      });
    }

    const quote = quotes[0];

    // Get items
    const items = await query<any[]>(
      `SELECT 
        qi.*,
        p.name as product_name,
        p.sku as product_sku,
        p.price as product_price
       FROM quote_items qi
       LEFT JOIN products p ON qi.product_id = p.id
       WHERE qi.quote_id = ?`,
      [quote.id],
    );

    return res.status(200).json({
      success: true,
      data: { ...quote, items },
    });
  } catch (error) {
    console.error("Get quote error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const createQuote: RequestHandler = async (req, res) => {
  try {
    const quoteData: CreateQuoteRequest = req.body;

    // Validate required fields for new quotation system
    if (
      !quoteData.product_type ||
      !quoteData.customer_name ||
      !quoteData.customer_email ||
      !quoteData.customer_phone ||
      !quoteData.customer_company
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Product type, company name, contact name, email, and phone are required",
      });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Generate quote number
      const quoteNumber = `Q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create quote with new structure
      const [quoteResult] = await connection.execute(
        `INSERT INTO quotes (
          quote_number, customer_name, customer_email, customer_phone, 
          customer_company, customer_message, brand, product_type, 
          part_number, specifications, quantity, city_state, 
          preferred_contact_method, brand_id, manufacturer_id, 
          category_id, subcategory_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          quoteNumber,
          quoteData.customer_name,
          quoteData.customer_email,
          quoteData.customer_phone,
          quoteData.customer_company,
          quoteData.customer_message || null,
          quoteData.brand || null,
          quoteData.product_type,
          quoteData.part_number || null,
          quoteData.specifications || null,
          quoteData.quantity || 1,
          quoteData.city_state || null,
          quoteData.preferred_contact_method || "email",
          quoteData.brand_id || null,
          quoteData.manufacturer_id || null,
          quoteData.category_id || null,
          quoteData.subcategory_id || null,
        ],
      );

      const quoteId = (quoteResult as any).insertId;

      // Legacy support: Create quote items if provided
      if (quoteData.items && quoteData.items.length > 0) {
        for (const item of quoteData.items) {
          await connection.execute(
            `INSERT INTO quote_items (quote_id, product_id, quantity, notes) 
             VALUES (?, ?, ?, ?)`,
            [quoteId, item.product_id, item.quantity, item.notes || null],
          );
        }
      }

      await connection.commit();

      // Send email notifications after successful quote creation
      try {
        const quoteEmailData = {
          quote_id: quoteId,
          quote_number: quoteNumber,
          ...quoteData,
        };

        // Send notifications asynchronously (don't wait for completion)
        sendQuoteNotifications(quoteEmailData).catch((error) => {
          console.error("Error sending quote notifications:", error);
        });
      } catch (emailError) {
        console.error("Error preparing quote notifications:", emailError);
        // Don't fail the quote creation if email fails
      }

      return res.status(201).json({
        success: true,
        data: { id: quoteId, quote_number: quoteNumber },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create quote error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== CONTACT & SUPPORT ====================
const submitContactForm: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required",
      });
    }

    // Insert contact submission
    const [result] = await pool.execute(
      `INSERT INTO contact_submissions (name, email, phone, company, subject, message, status, priority) 
       VALUES (?, ?, ?, ?, ?, ?, 'new', 'medium')`,
      [name, email, phone || null, company || null, subject, message],
    );

    const submissionId = (result as any).insertId;

    // Send email notifications to admins
    try {
      const contactEmailData = {
        submission_id: submissionId,
        name,
        email,
        phone: phone || "Not provided",
        company: company || "Not provided",
        subject,
        message,
      };

      // Send notifications asynchronously
      sendContactNotifications(contactEmailData).catch((error) => {
        console.error("Error sending contact notifications:", error);
      });
    } catch (emailError) {
      console.error("Error preparing contact notifications:", emailError);
    }

    return res.status(201).json({
      success: true,
      data: { id: submissionId },
      message:
        "Your message has been sent successfully. We will get back to you soon.",
    });
  } catch (error) {
    console.error("Submit contact form error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== FAQ ====================
const getFAQCategories: RequestHandler = async (req, res) => {
  try {
    const { include_inactive } = req.query;

    let whereClause = "";
    if (!include_inactive) {
      whereClause = "WHERE is_active = TRUE";
    }

    const categories = await query<any[]>(
      `SELECT id, name, slug, description, sort_order, is_active 
       FROM faq_categories 
       ${whereClause}
       ORDER BY sort_order ASC, name ASC`,
    );

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get FAQ categories error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getFAQItems: RequestHandler = async (req, res) => {
  try {
    const { category_id, include_inactive } = req.query;

    let whereClause = "";
    const params: any[] = [];

    if (!include_inactive) {
      whereClause = "WHERE f.is_active = TRUE";
    }

    if (category_id) {
      whereClause += whereClause ? " AND " : "WHERE ";
      whereClause += "f.category_id = ?";
      params.push(parseInt(category_id as string));
    }

    const items = await query<any[]>(
      `SELECT f.id, f.category_id, f.question, f.answer, f.sort_order, f.is_active,
              c.name as category_name, c.slug as category_slug
       FROM faq_items f
       JOIN faq_categories c ON f.category_id = c.id
       ${whereClause}
       ORDER BY f.category_id, f.sort_order ASC, f.id ASC`,
      params,
    );

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("Get FAQ items error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== ADMIN CATEGORIES ====================
const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name, slug, description, main_image, extra_images } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO categories (name, slug, description, main_image, extra_images, is_active, display_order) 
       VALUES (?, ?, ?, ?, ?, 1, 0)`,
      [
        name,
        slug,
        description || null,
        main_image || null,
        extra_images || null,
      ],
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("Error creating category:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      main_image,
      extra_images,
      is_active,
      display_order,
    } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (slug !== undefined) {
      updates.push("slug = ?");
      values.push(slug);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (main_image !== undefined) {
      updates.push("main_image = ?");
      values.push(main_image);
    }
    if (extra_images !== undefined) {
      updates.push("extra_images = ?");
      values.push(extra_images);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active ? 1 : 0);
    }
    if (display_order !== undefined) {
      updates.push("display_order = ?");
      values.push(display_order);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE categories SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating category:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);

    if (
      error.code === "ER_ROW_IS_REFERENCED_2" ||
      error.code === "ER_ROW_IS_REFERENCED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede eliminar esta categoría porque tiene productos asociados. Elimina los productos primero.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== ADMIN SUBCATEGORIES ====================
const getSubcategories: RequestHandler = async (req, res) => {
  try {
    const { include_inactive, category_id } = req.query;

    let whereClause = "";
    const conditions: string[] = [];

    if (!include_inactive) {
      conditions.push("s.is_active = TRUE");
    }
    if (category_id) {
      conditions.push(`s.category_id = ${parseInt(category_id as string)}`);
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`;
    }

    const subcategories = await query(
      `SELECT s.*, c.name as category_name 
       FROM subcategories s
       LEFT JOIN categories c ON s.category_id = c.id
       ${whereClause}
       ORDER BY s.name ASC`,
    );

    res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    console.error("Get subcategories error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const createSubcategory: RequestHandler = async (req, res) => {
  try {
    console.log(
      "[createSubcategory] Request body:",
      JSON.stringify(req.body, null, 2),
    );

    const { name, slug, description, category_id, main_image, extra_images } =
      req.body;

    console.log("[createSubcategory] Extracted values:", {
      name,
      slug,
      description,
      category_id,
      main_image,
      extra_images,
    });

    if (!name || !slug || !category_id) {
      console.log(
        "[createSubcategory] Validation failed - missing required fields",
      );
      return res.status(400).json({
        success: false,
        message: "Name, slug, and category_id are required",
      });
    }

    const queryParams = [
      name,
      slug,
      description || null,
      category_id || null,
      main_image || null,
      extra_images || null,
    ];

    console.log("[createSubcategory] SQL query params:", queryParams);

    const [result] = await pool.execute(
      `INSERT INTO subcategories (name, slug, description, category_id, main_image, extra_images, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      queryParams,
    );

    console.log("[createSubcategory] SQL result:", result);

    const insertId = (result as any).insertId;

    console.log("[createSubcategory] Success - insertId:", insertId);

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("[createSubcategory] Error occurred:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sql: error.sql,
      sqlMessage: error.sqlMessage,
      stack: error.stack,
    });

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A subcategory with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Include error message for debugging
    });
  }
};

const updateSubcategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("[updateSubcategory] Request params ID:", id);
    console.log(
      "[updateSubcategory] Request body:",
      JSON.stringify(req.body, null, 2),
    );

    const {
      name,
      slug,
      description,
      category_id,
      main_image,
      extra_images,
      is_active,
    } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
      console.log("[updateSubcategory] Adding name:", name);
    }
    if (slug !== undefined) {
      updates.push("slug = ?");
      values.push(slug);
      console.log("[updateSubcategory] Adding slug:", slug);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
      console.log("[updateSubcategory] Adding description:", description);
    }
    if (category_id !== undefined) {
      updates.push("category_id = ?");
      values.push(category_id);
      console.log("[updateSubcategory] Adding category_id:", category_id);
    }
    if (main_image !== undefined) {
      updates.push("main_image = ?");
      values.push(main_image);
      console.log("[updateSubcategory] Adding main_image:", main_image);
    }
    if (extra_images !== undefined) {
      updates.push("extra_images = ?");
      values.push(extra_images);
      console.log("[updateSubcategory] Adding extra_images:", extra_images);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active ? 1 : 0);
      console.log("[updateSubcategory] Adding is_active:", is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      console.log("[updateSubcategory] No fields to update");
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(parseInt(id));

    const sqlQuery = `UPDATE subcategories SET ${updates.join(", ")} WHERE id = ?`;
    console.log("[updateSubcategory] SQL query:", sqlQuery);
    console.log("[updateSubcategory] Query values:", values);

    const [result] = await pool.execute(sqlQuery, values);

    console.log("[updateSubcategory] SQL result:", result);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.json({
      success: true,
      message: "Subcategory updated successfully",
    });
  } catch (error: any) {
    console.error("[updateSubcategory] Error occurred:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sql: error.sql,
      sqlMessage: error.sqlMessage,
      stack: error.stack,
    });

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A subcategory with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Include error message for debugging
    });
  }
};

const deleteSubcategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM subcategories WHERE id = ?",
      [parseInt(id)],
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting subcategory:", error);

    if (
      error.code === "ER_ROW_IS_REFERENCED_2" ||
      error.code === "ER_ROW_IS_REFERENCED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede eliminar esta subcategoría porque tiene datos asociados. Elimina los datos relacionados primero.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== ADMIN MANUFACTURERS ====================
const createManufacturer: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      logo_url,
      main_image,
      extra_images,
      category_id,
      subcategory_id,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO manufacturers (name, description, website, logo_url, main_image, extra_images, category_id, subcategory_id, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        name,
        description || null,
        website || null,
        logo_url || null,
        main_image || null,
        extra_images || null,
        category_id || null,
        subcategory_id || null,
      ],
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("Error creating manufacturer:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A manufacturer with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateManufacturer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      website,
      logo_url,
      main_image,
      extra_images,
      category_id,
      subcategory_id,
      is_active,
    } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (website !== undefined) {
      updates.push("website = ?");
      values.push(website);
    }
    if (logo_url !== undefined) {
      updates.push("logo_url = ?");
      values.push(logo_url);
    }
    if (main_image !== undefined) {
      updates.push("main_image = ?");
      values.push(main_image);
    }
    if (extra_images !== undefined) {
      updates.push("extra_images = ?");
      values.push(extra_images);
    }
    if (category_id !== undefined) {
      updates.push("category_id = ?");
      values.push(category_id);
    }
    if (subcategory_id !== undefined) {
      updates.push("subcategory_id = ?");
      values.push(subcategory_id);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE manufacturers SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Manufacturer not found",
      });
    }

    res.json({
      success: true,
      message: "Manufacturer updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating manufacturer:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A manufacturer with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteManufacturer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM manufacturers WHERE id = ?",
      [parseInt(id)],
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Manufacturer not found",
      });
    }

    res.json({
      success: true,
      message: "Manufacturer deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting manufacturer:", error);

    if (
      error.code === "ER_ROW_IS_REFERENCED_2" ||
      error.code === "ER_ROW_IS_REFERENCED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede eliminar este fabricante porque tiene marcas asociadas. Elimina las marcas primero.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== ADMIN BRANDS ====================
const createBrand: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      manufacturer_id,
      description,
      logo_url,
      main_image,
      extra_images,
      category_id,
      subcategory_id,
    } = req.body;

    if (!name || !manufacturer_id) {
      return res.status(400).json({
        success: false,
        message: "Name and manufacturer_id are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO brands (name, manufacturer_id, description, logo_url, main_image, extra_images, category_id, subcategory_id, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        name,
        manufacturer_id,
        description || null,
        logo_url || null,
        main_image || null,
        extra_images || null,
        category_id || null,
        subcategory_id || null,
      ],
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("Error creating brand:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A brand with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateBrand: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      manufacturer_id,
      description,
      logo_url,
      main_image,
      extra_images,
      category_id,
      subcategory_id,
      is_active,
    } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (manufacturer_id !== undefined) {
      updates.push("manufacturer_id = ?");
      values.push(manufacturer_id);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (logo_url !== undefined) {
      updates.push("logo_url = ?");
      values.push(logo_url);
    }
    if (main_image !== undefined) {
      updates.push("main_image = ?");
      values.push(main_image);
    }
    if (extra_images !== undefined) {
      updates.push("extra_images = ?");
      values.push(extra_images);
    }
    if (category_id !== undefined) {
      updates.push("category_id = ?");
      values.push(category_id);
    }
    if (subcategory_id !== undefined) {
      updates.push("subcategory_id = ?");
      values.push(subcategory_id);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE brands SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      message: "Brand updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating brand:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A brand with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteBrand: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM brands WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting brand:", error);

    if (
      error.code === "ER_ROW_IS_REFERENCED_2" ||
      error.code === "ER_ROW_IS_REFERENCED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede eliminar esta marca porque tiene modelos asociados. Elimina los modelos primero.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== ADMIN MODELS ====================
const createModel: RequestHandler = async (req, res) => {
  try {
    const { name, brand_id, description, specifications } = req.body;

    if (!name || !brand_id) {
      return res.status(400).json({
        success: false,
        message: "Name and brand_id are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO models (name, brand_id, description, specifications, is_active) 
       VALUES (?, ?, ?, ?, 1)`,
      [name, brand_id, description || null, specifications || null],
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      success: true,
      data: { id: insertId },
    });
  } catch (error: any) {
    console.error("Error creating model:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A model with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateModel: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand_id, description, specifications, is_active } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (brand_id !== undefined) {
      updates.push("brand_id = ?");
      values.push(brand_id);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (specifications !== undefined) {
      updates.push("specifications = ?");
      values.push(specifications);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE models SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    res.json({
      success: true,
      message: "Model updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating model:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A model with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteModel: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM models WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    res.json({
      success: true,
      message: "Model deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting model:", error);

    if (
      error.code === "ER_ROW_IS_REFERENCED_2" ||
      error.code === "ER_ROW_IS_REFERENCED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede eliminar este modelo porque tiene productos asociados. Elimina los productos primero.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== ADMIN PRODUCTS ====================
const createProduct: RequestHandler = async (req, res) => {
  try {
    const productData: CreateProductRequest = req.body;

    if (!productData.name || !productData.sku) {
      return res.status(400).json({
        success: false,
        error: "Name and SKU are required",
      });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Handle images - check for main_image and extra_images from request body
      // or fallback to images array for backwards compatibility
      let mainImage = null;
      let extraImages = null;

      if (productData.main_image) {
        // New format: main_image and extra_images sent directly
        mainImage = productData.main_image;

        // extra_images might be a JSON string or already parsed
        if (productData.extra_images) {
          if (typeof productData.extra_images === "string") {
            // It's already a JSON string, use it as-is
            extraImages = productData.extra_images;
          } else if (Array.isArray(productData.extra_images)) {
            // It's an array, stringify it
            extraImages = JSON.stringify(productData.extra_images);
          }
        }
      } else if (productData.images && productData.images.length > 0) {
        // Old format: images array
        mainImage = productData.images[0];
        extraImages =
          productData.images.length > 1
            ? JSON.stringify(productData.images.slice(1))
            : null;
      }

      const [result] = await connection.execute(
        `INSERT INTO products (
          name, sku, description, category_id, manufacturer_id, brand_id, model_id,
          price, stock_quantity, is_active, is_featured, main_image, extra_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.name,
          productData.sku,
          productData.description || null,
          productData.category_id || null,
          productData.manufacturer_id || null,
          productData.brand_id || null,
          productData.model_id || null,
          productData.price || 0,
          productData.stock_quantity || 0,
          productData.is_active !== false ? 1 : 0,
          productData.is_featured ? 1 : 0,
          mainImage,
          extraImages,
        ],
      );

      const productId = (result as any).insertId;

      await connection.commit();

      return res.status(201).json({
        success: true,
        data: { id: productId },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updateProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const productData: UpdateProductRequest = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (productData.name !== undefined) {
      updates.push("name = ?");
      values.push(productData.name);
    }
    if (productData.sku !== undefined) {
      updates.push("sku = ?");
      values.push(productData.sku);
    }
    if (productData.description !== undefined) {
      updates.push("description = ?");
      values.push(productData.description);
    }
    if (productData.category_id !== undefined) {
      updates.push("category_id = ?");
      values.push(productData.category_id);
    }
    if (productData.manufacturer_id !== undefined) {
      updates.push("manufacturer_id = ?");
      values.push(productData.manufacturer_id);
    }
    if (productData.brand_id !== undefined) {
      updates.push("brand_id = ?");
      values.push(productData.brand_id);
    }
    if (productData.model_id !== undefined) {
      updates.push("model_id = ?");
      values.push(productData.model_id);
    }
    if (productData.price !== undefined) {
      updates.push("price = ?");
      values.push(productData.price);
    }
    if (productData.stock_quantity !== undefined) {
      updates.push("stock_quantity = ?");
      values.push(productData.stock_quantity);
    }
    if (productData.is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(productData.is_active ? 1 : 0);
    }
    if (productData.is_featured !== undefined) {
      updates.push("is_featured = ?");
      values.push(productData.is_featured ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No fields to update",
      });
    }

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== ADMIN AUTHENTICATION ====================
const checkAdminUser: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const [rows] = await pool.query<any[]>(
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

const sendAdminCode: RequestHandler = async (req, res) => {
  try {
    console.log("🔵 sendAdminCode endpoint called");
    console.log("   Request body:", req.body);

    const { email, admin_id } = req.body;

    if (!email && !admin_id) {
      console.log("❌ Missing admin_id or email");
      return res.status(400).json({
        success: false,
        message: "Email or admin ID is required",
      });
    }

    console.log("   Admin ID:", admin_id);
    console.log("   Email:", email);

    // Get admin name from DB
    console.log("📊 Querying admin from database...");
    const [adminRows] = await pool.query<any[]>(
      "SELECT first_name, last_name FROM admins WHERE id = ?",
      [admin_id],
    );

    if (adminRows.length === 0) {
      console.log("❌ Admin not found in database");
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const admin_name = `${adminRows[0].first_name} ${adminRows[0].last_name}`;
    console.log("✅ Admin found:", admin_name);

    // Generate session code
    const sessionCode = Math.floor(100000 + Math.random() * 900000);
    console.log("🔢 Generated code:", sessionCode);

    // Store code in admin_sessions table using database time for consistency
    console.log("💾 Inserting session code into database...");
    await pool.query(
      `INSERT INTO admin_sessions (user_id, session_code, is_active, expires_at) 
       VALUES (?, ?, 0, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
       ON DUPLICATE KEY UPDATE session_code = VALUES(session_code), expires_at = VALUES(expires_at)`,
      [admin_id, sessionCode],
    );
    console.log("✅ Session code saved");

    // Get the actual expiration time that was set
    const [sessionInfo] = await pool.query<any[]>(
      `SELECT expires_at, NOW() as db_now FROM admin_sessions WHERE user_id = ? AND session_code = ?`,
      [admin_id, sessionCode],
    );

    if (sessionInfo.length > 0) {
      console.log("📅 Session expires at (DB):", sessionInfo[0].expires_at);
      console.log("📅 Current database time:", sessionInfo[0].db_now);
    }

    // Send email with verification code
    console.log("📧 Calling sendAdminVerificationEmail...");
    const emailSent = await sendAdminVerificationEmail(
      email,
      admin_name,
      sessionCode,
    );

    if (emailSent) {
      console.log("✅ Email sent successfully");
      res.json({
        success: true,
        message: "Verification code sent to your email",
        // In development, include the code
        ...(process.env.NODE_ENV === "development" && { code: sessionCode }),
      });
    } else {
      console.log("❌ Email sending failed");
      res.status(500).json({
        success: false,
        message: "Failed to send email",
      });
    }
  } catch (error) {
    console.error("❌ Error sending admin code:", error);
    if (error instanceof Error) {
      console.error("   Error name:", error.name);
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Helper function to send admin verification email
 */
async function sendAdminVerificationEmail(
  email: string,
  adminName: string,
  code: number,
): Promise<boolean> {
  try {
    console.log("🔍 Checking environment variables:");
    console.log("   SMTP_HOST:", process.env.SMTP_HOST || "NOT SET");
    console.log("   SMTP_PORT:", process.env.SMTP_PORT || "NOT SET");
    console.log("   SMTP_SECURE:", process.env.SMTP_SECURE || "NOT SET");
    console.log("   SMTP_USER:", process.env.SMTP_USER || "NOT SET");
    console.log(
      "   SMTP_PASSWORD:",
      process.env.SMTP_PASSWORD ? "SET (hidden)" : "NOT SET",
    );

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log(
        "⚠️  No SMTP credentials found. Using Ethereal test account...",
      );

      // Create test account on the fly (for development only)
      const testAccount = await nodemailer.createTestAccount();

      const transportConfig = {
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      };

      console.log("📧 Ethereal test account created:");
      console.log("   User:", testAccount.user);
      console.log("   Pass:", testAccount.pass);

      const transporter = nodemailer.createTransport(transportConfig);
      await transporter.verify();
      console.log("✅ SMTP connection verified (test account)!");

      const emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { background-color: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto; }
            .code { font-size: 32px; font-weight: bold; color: #d32f2f; text-align: center; padding: 20px; background-color: #f0f0f0; border-radius: 5px; margin: 20px 0; }
            .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Hola ${adminName},</h1>
            <p>Tu código de acceso administrativo para Industrial Catalogue es:</p>
            <div class="code">${code}</div>
            <p>Este código expirará en 10 minutos.</p>
            <p>Si no solicitaste este código, contacta al administrador del sistema.</p>
            <div class="footer">
              <p>Industrial Catalogue - Panel Administrativo</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          `"Industrial Catalogue Admin" <${testAccount.user}>`,
        to: email,
        subject: `${code} - Código de acceso administrativo Industrial Catalogue`,
        html: emailBody,
      });

      console.log("✅ Email sent successfully!");
      console.log("   Message ID:", info.messageId);
      const previewUrl = nodemailer.getTestMessageUrl(info as any);
      console.log("📬 Preview URL:", previewUrl);
      console.log("🔑 Verification code:", code);

      return true;
    }

    // Use configured SMTP settings
    const transportConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    console.log("📧 Using configured SMTP settings:");
    console.log("   Host:", transportConfig.host);
    console.log("   Port:", transportConfig.port);
    console.log("   Secure:", transportConfig.secure);
    console.log("   User:", transportConfig.auth.user);

    // Configure email transporter
    console.log("🔧 Creating transporter...");
    const transporter = nodemailer.createTransport(transportConfig);

    // Verify SMTP connection
    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!");

    // Admin email template
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Industrial Catalogue - Acceso Administrativo</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 20px; border: 1px solid #ddd;">
              <h1 style="color: #d32f2f; text-align: center; margin-bottom: 20px;">ACCESO ADMINISTRATIVO</h1>
              
              <p>Hola <strong>${adminName}</strong>,</p>
              
              <p>Se ha solicitado acceso al panel administrativo de Industrial Catalogue.</p>
              
              <p><strong>Tu código de verificación es:</strong></p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 20px;">
                    <div style="font-size: 28px; font-weight: bold; color: #d32f2f; background-color: #f5f5f5; padding: 15px; border: 2px solid #d32f2f; display: inline-block;">${code}</div>
                  </td>
                </tr>
              </table>
              
              <p style="color: #d32f2f; font-weight: bold;">IMPORTANTE: Este código expirará en 10 minutos</p>
              
              <p>Si no solicitaste este acceso, contacta inmediatamente al administrador del sistema.</p>
              
              <hr style="border: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #666; text-align: center;">
                Industrial Catalogue - Panel Administrativo<br>
                Este es un mensaje automático del sistema - No responder
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    console.log("📤 Sending admin email to:", email);
    console.log(
      "   From field:",
      process.env.SMTP_FROM ||
        `"Industrial Catalogue Admin" <${process.env.SMTP_USER}>`,
    );
    console.log(
      "   Subject:",
      `${code} - Código de acceso administrativo Industrial Catalogue`,
    );

    // Plain text version for better deliverability
    const textBody = `
ACCESO ADMINISTRATIVO - INDUSTRIAL CATALOGUE

Hola ${adminName},

Se ha solicitado acceso al panel administrativo de Industrial Catalogue.

Tu código de verificación es: ${code}

IMPORTANTE: Este código expirará en 10 minutos

Si no solicitaste este acceso, contacta inmediatamente al administrador del sistema.

---
Industrial Catalogue - Panel Administrativo
Este es un mensaje automático del sistema - No responder
    `;

    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        `"Industrial Catalogue Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${code} - Código de acceso administrativo Industrial Catalogue`,
      text: textBody.trim(),
      html: emailBody,
    });

    console.log("✅ Admin email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   Response:", JSON.stringify(info.response || "No response"));
    console.log("   Envelope:", JSON.stringify(info.envelope || "No envelope"));
    console.log("   Accepted:", JSON.stringify(info.accepted || []));
    console.log("   Rejected:", JSON.stringify(info.rejected || []));

    console.log("🏭 PRODUCTION EMAIL SENT:");
    console.log("   Production SMTP used:", process.env.SMTP_HOST);
    console.log("   Target email:", email);
    console.log("   Admin name:", adminName);
    console.log("   Verification code:", code);
    console.log("   Environment check:");
    console.log("     NODE_ENV:", process.env.NODE_ENV);
    console.log("     SMTP_FROM:", process.env.SMTP_FROM || "NOT SET");

    return true;
  } catch (error) {
    console.error("❌ Error sending admin email:", error);
    if (error instanceof Error) {
      console.error("   Error name:", error.name);
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
    }
    return false;
  }
}

const verifyAdminCode: RequestHandler = async (req, res) => {
  try {
    console.log("🔵 verifyAdminCode endpoint called");
    console.log("   Request body:", req.body);

    const { admin_id, code } = req.body;

    if (!admin_id || !code) {
      console.log("❌ Missing admin_id or code");
      return res.status(400).json({
        success: false,
        message: "Admin ID and code are required",
      });
    }

    console.log("   Admin ID:", admin_id);
    console.log("   Code:", code, typeof code);

    // Ensure code is treated as a number for comparison
    const codeAsNumber = parseInt(code, 10);
    console.log("   Code as number:", codeAsNumber);

    // First, let's see all sessions for this admin
    console.log("📊 Checking all sessions for admin...");
    const [allSessions] = await pool.query<any[]>(
      `SELECT * FROM admin_sessions WHERE user_id = ?`,
      [admin_id],
    );
    console.log("   All sessions:", allSessions);

    // Check code in admin_sessions - try both string and number formats
    console.log("🔍 Looking for matching session...");
    const [rows] = await pool.query<any[]>(
      `SELECT *, expires_at, NOW() as db_now FROM admin_sessions 
       WHERE user_id = ? AND (session_code = ? OR session_code = ?) AND expires_at > NOW()`,
      [admin_id, code, codeAsNumber],
    );

    console.log("   Matching sessions:", rows);

    if (rows.length === 0) {
      console.log("❌ No matching sessions found");

      // Let's check if there's a session with the right code but expired
      const [expiredRows] = await pool.query<any[]>(
        `SELECT *, expires_at, NOW() as db_now FROM admin_sessions 
         WHERE user_id = ? AND (session_code = ? OR session_code = ?)`,
        [admin_id, code, codeAsNumber],
      );

      if (expiredRows.length > 0) {
        console.log("🕐 Found expired session:", expiredRows[0]);
        console.log("   Session expires at:", expiredRows[0].expires_at);
        console.log("   Current database time:", expiredRows[0].db_now);
      }

      return res.status(401).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    console.log("✅ Valid session found");

    // Generate new session code for the active session
    const sessionCode = Math.floor(100000 + Math.random() * 900000);
    const sessionExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log("🔢 Generated new session code:", sessionCode);
    console.log("📅 New session expires at:", sessionExpires);

    // Update session to active with new code and expiration
    console.log("💾 Updating session to active...");
    await pool.query(
      `UPDATE admin_sessions 
       SET is_active = 1, session_code = ?, expires_at = ? 
       WHERE user_id = ? AND (session_code = ? OR session_code = ?)`,
      [sessionCode, sessionExpires, admin_id, code, codeAsNumber],
    );

    // Get admin info
    console.log("👤 Getting admin info...");
    const [admins] = await pool.query<any[]>(
      `SELECT id, email, role, first_name, last_name FROM admins WHERE id = ?`,
      [admin_id],
    );

    console.log("✅ Admin found:", admins[0]);

    res.json({
      success: true,
      admin: admins[0],
      token: sessionCode.toString(),
    });
  } catch (error) {
    console.error("❌ Error verifying admin code:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==================== ADMIN USERS ====================
const getAdminUsers: RequestHandler = async (req, res) => {
  try {
    const [users] = await pool.query<any[]>(
      `SELECT id, email, role, first_name, last_name, phone, is_active, created_at, last_login
       FROM admins
       ORDER BY created_at DESC`,
    );

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAdminUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query<any[]>(
      `SELECT id, email, role, first_name, last_name, phone, is_active, is_email_verified, created_at, last_login
       FROM admins WHERE id = ?`,
      [parseInt(id)],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error("Error fetching admin user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createAdminUser: RequestHandler = async (req, res) => {
  try {
    const { email, first_name, last_name, phone, role = "admin" } = req.body;

    if (!email || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: "Email, first name, and last name are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO admins (email, first_name, last_name, phone, role, is_active) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [email, first_name, last_name, phone || null, role],
    );

    res.status(201).json({
      success: true,
      data: { id: (result as any).insertId },
    });
  } catch (error: any) {
    console.error("Error creating admin user:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An admin with this email already exists",
      });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateAdminUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, role, is_active } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (first_name !== undefined) {
      updates.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push("last_name = ?");
      values.push(last_name);
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (role !== undefined) {
      updates.push("role = ?");
      values.push(role);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(parseInt(id));

    const [result] = await pool.execute(
      `UPDATE admins SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.json({ success: true, message: "Admin user updated successfully" });
  } catch (error) {
    console.error("Error updating admin user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteAdminUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM admins WHERE id = ?", [
      parseInt(id),
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.json({ success: true, message: "Admin user deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==================== ADMIN CONTENT ====================
// Content pages functionality removed - table doesn't exist in schema

// ==================== ADMIN QUOTES ====================
const getAdminQuotes: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = "1=1";
    const queryParams: any[] = [];

    if (status && status !== "all") {
      whereClause += " AND q.status = ?";
      queryParams.push(status);
    }

    // Get total count
    const countResult = await query<any[]>(
      `SELECT COUNT(*) as total FROM quotes q WHERE ${whereClause}`,
      queryParams,
    );

    const total = countResult[0]?.total || 0;

    // Get quotes
    const quotes = await query<any[]>(
      `SELECT q.*
       FROM quotes q
       WHERE ${whereClause}
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, Number(limit), offset],
    );

    // Get items for each quote
    const quotesWithItems = await Promise.all(
      quotes.map(async (quote) => {
        const items = await query<any[]>(
          `SELECT qi.*, p.name as product_name, p.sku
           FROM quote_items qi
           LEFT JOIN products p ON qi.product_id = p.id
           WHERE qi.quote_id = ?`,
          [quote.id],
        );
        return { ...quote, items };
      }),
    );

    res.json({
      success: true,
      data: {
        quotes: quotesWithItems,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin quotes:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateQuoteStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const [result] = await pool.execute(
      `UPDATE quotes SET status = ? WHERE id = ?`,
      [status, parseInt(id)],
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    res.json({ success: true, message: "Quote status updated successfully" });
  } catch (error) {
    console.error("Error updating quote status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==================== HOME SECTIONS ====================
const getRandomSections: RequestHandler = async (req, res) => {
  try {
    const { count = "3", items_per_section = "4" } = req.query;
    const sectionCount = Math.min(parseInt(count as string), 10);
    const itemsPerSection = Math.min(parseInt(items_per_section as string), 10);

    // Fetch more sections than needed to ensure we can find enough with items
    const fetchLimit = Math.max(sectionCount * 3, 20);

    const [categories] = await pool.execute(
      `SELECT id, name, slug, description, main_image, 'category' as type
       FROM categories WHERE is_active = TRUE ORDER BY RAND() LIMIT ?`,
      [fetchLimit],
    );

    const [subcategories] = await pool.execute(
      `SELECT s.id, s.name, s.slug, s.description, s.main_image, 'subcategory' as type,
              s.category_id, c.name as category_name
       FROM subcategories s
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE s.is_active = TRUE ORDER BY RAND() LIMIT ?`,
      [fetchLimit],
    );

    const [brands] = await pool.execute(
      `SELECT b.id, b.name, b.description, b.main_image, 'brand' as type,
              b.manufacturer_id, m.name as manufacturer_name,
              b.category_id, c.name as category_name,
              b.subcategory_id, s.name as subcategory_name
       FROM brands b
       LEFT JOIN manufacturers m ON b.manufacturer_id = m.id
       LEFT JOIN categories c ON b.category_id = c.id
       LEFT JOIN subcategories s ON b.subcategory_id = s.id
       WHERE b.is_active = TRUE ORDER BY RAND() LIMIT ?`,
      [fetchLimit],
    );

    const [manufacturers] = await pool.execute(
      `SELECT m.id, m.name, m.description, m.main_image, 'manufacturer' as type,
              m.category_id, c.name as category_name,
              m.subcategory_id, s.name as subcategory_name
       FROM manufacturers m
       LEFT JOIN categories c ON m.category_id = c.id
       LEFT JOIN subcategories s ON m.subcategory_id = s.id
       WHERE m.is_active = TRUE ORDER BY RAND() LIMIT ?`,
      [fetchLimit],
    );

    // Combine all sections and shuffle
    const allSections: any[] = [
      ...(categories as any[]),
      ...(subcategories as any[]),
      ...(brands as any[]),
      ...(manufacturers as any[]),
    ];

    // Fisher-Yates shuffle
    for (let i = allSections.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSections[i], allSections[j]] = [allSections[j], allSections[i]];
    }

    // Keep checking sections until we have the requested count with items
    const sectionsWithItems: any[] = [];

    for (const section of allSections) {
      let relatedItems: any[] = [];

      switch (section.type) {
        case "category":
          // Get subcategories for this category
          const [catSubcats] = await pool.execute(
            `SELECT id, name, slug, main_image FROM subcategories 
             WHERE category_id = ? AND is_active = TRUE ORDER BY RAND() LIMIT ?`,
            [section.id, itemsPerSection],
          );
          relatedItems = catSubcats as any[];
          break;

        case "subcategory":
          // Get brands for this subcategory
          const [subcatBrands] = await pool.execute(
            `SELECT id, name, main_image FROM brands 
             WHERE subcategory_id = ? AND is_active = TRUE ORDER BY RAND() LIMIT ?`,
            [section.id, itemsPerSection],
          );
          relatedItems = subcatBrands as any[];
          break;

        case "manufacturer":
          // Get brands for this manufacturer
          const [mfgBrands] = await pool.execute(
            `SELECT id, name, main_image FROM brands 
             WHERE manufacturer_id = ? AND is_active = TRUE ORDER BY RAND() LIMIT ?`,
            [section.id, itemsPerSection],
          );
          relatedItems = mfgBrands as any[];
          break;

        case "brand":
          // Get models for this brand or related subcategories
          const [brandModels] = await pool.execute(
            `SELECT id, name, description as main_image FROM models 
             WHERE brand_id = ? AND is_active = TRUE ORDER BY RAND() LIMIT ?`,
            [section.id, itemsPerSection],
          );
          relatedItems = brandModels as any[];
          break;
      }

      // Only include sections that have items
      if (relatedItems.length > 0) {
        section.items = relatedItems;
        sectionsWithItems.push(section);

        // Stop once we have enough sections with items
        if (sectionsWithItems.length >= sectionCount) {
          break;
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: sectionsWithItems,
    });
  } catch (error) {
    console.error("Get random sections error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// Get filtered catalog data with advanced filtering
const getCatalogData: RequestHandler = async (req, res) => {
  try {
    const {
      type, // 'category', 'subcategory', 'brand', 'manufacturer'
      id,
      category_id,
      subcategory_id,
      brand_id,
      manufacturer_id,
    } = req.query;

    const response: any = {
      success: true,
      data: {
        mainItem: null,
        relatedCategories: [],
        relatedSubcategories: [],
        relatedBrands: [],
        relatedManufacturers: [],
      },
    };

    // Fetch main item based on type
    if (type && id) {
      const itemId = parseInt(id as string);

      switch (type) {
        case "category": {
          const [categories] = await pool.execute(
            `SELECT * FROM categories WHERE id = ? AND is_active = TRUE`,
            [itemId],
          );
          response.data.mainItem = (categories as any[])[0] || null;

          // Get subcategories for this category
          const [subcats] = await pool.execute(
            `SELECT * FROM subcategories WHERE category_id = ? AND is_active = TRUE ORDER BY name`,
            [itemId],
          );
          response.data.relatedSubcategories = subcats;

          // Get manufacturers for this category
          const [mfgs] = await pool.execute(
            `SELECT DISTINCT m.* FROM manufacturers m
             WHERE m.category_id = ? AND m.is_active = TRUE ORDER BY m.name`,
            [itemId],
          );
          response.data.relatedManufacturers = mfgs;

          // Get brands for this category
          const [brds] = await pool.execute(
            `SELECT DISTINCT b.*, m.name as manufacturer_name
             FROM brands b
             LEFT JOIN manufacturers m ON b.manufacturer_id = m.id
             WHERE b.category_id = ? AND b.is_active = TRUE ORDER BY b.name`,
            [itemId],
          );
          response.data.relatedBrands = brds;
          break;
        }

        case "subcategory": {
          const [subcategories] = await pool.execute(
            `SELECT s.*, c.name as category_name, c.id as category_id
             FROM subcategories s
             LEFT JOIN categories c ON s.category_id = c.id
             WHERE s.id = ? AND s.is_active = TRUE`,
            [itemId],
          );
          response.data.mainItem = (subcategories as any[])[0] || null;

          if (response.data.mainItem) {
            // Get parent category
            const [cats] = await pool.execute(
              `SELECT * FROM categories WHERE id = ? AND is_active = TRUE`,
              [response.data.mainItem.category_id],
            );
            response.data.relatedCategories = cats;

            // Get manufacturers for this subcategory
            const [mfgs] = await pool.execute(
              `SELECT DISTINCT m.*, c.name as category_name
               FROM manufacturers m
               LEFT JOIN categories c ON m.category_id = c.id
               WHERE m.subcategory_id = ? AND m.is_active = TRUE ORDER BY m.name`,
              [itemId],
            );
            response.data.relatedManufacturers = mfgs;

            // Get brands for this subcategory
            const [brds] = await pool.execute(
              `SELECT DISTINCT b.*, m.name as manufacturer_name, c.name as category_name
               FROM brands b
               LEFT JOIN manufacturers m ON b.manufacturer_id = m.id
               LEFT JOIN categories c ON b.category_id = c.id
               WHERE b.subcategory_id = ? AND b.is_active = TRUE ORDER BY b.name`,
              [itemId],
            );
            response.data.relatedBrands = brds;
          }
          break;
        }

        case "brand": {
          const [brands] = await pool.execute(
            `SELECT b.*, 
                    m.name as manufacturer_name, m.id as manufacturer_id,
                    c.name as category_name, c.id as category_id,
                    s.name as subcategory_name, s.id as subcategory_id
             FROM brands b
             LEFT JOIN manufacturers m ON b.manufacturer_id = m.id
             LEFT JOIN categories c ON b.category_id = c.id
             LEFT JOIN subcategories s ON b.subcategory_id = s.id
             WHERE b.id = ? AND b.is_active = TRUE`,
            [itemId],
          );
          response.data.mainItem = (brands as any[])[0] || null;

          if (response.data.mainItem) {
            // Get related categories
            if (response.data.mainItem.category_id) {
              const [cats] = await pool.execute(
                `SELECT * FROM categories WHERE id = ? AND is_active = TRUE`,
                [response.data.mainItem.category_id],
              );
              response.data.relatedCategories = cats;
            }

            // Get related subcategories
            if (response.data.mainItem.subcategory_id) {
              const [subcats] = await pool.execute(
                `SELECT * FROM subcategories WHERE id = ? AND is_active = TRUE`,
                [response.data.mainItem.subcategory_id],
              );
              response.data.relatedSubcategories = subcats;
            }

            // Get related manufacturer
            if (response.data.mainItem.manufacturer_id) {
              const [mfgs] = await pool.execute(
                `SELECT * FROM manufacturers WHERE id = ? AND is_active = TRUE`,
                [response.data.mainItem.manufacturer_id],
              );
              response.data.relatedManufacturers = mfgs;
            }
          }
          break;
        }

        case "manufacturer": {
          const [manufacturers] = await pool.execute(
            `SELECT m.*, 
                    c.name as category_name, c.id as category_id,
                    s.name as subcategory_name, s.id as subcategory_id
             FROM manufacturers m
             LEFT JOIN categories c ON m.category_id = c.id
             LEFT JOIN subcategories s ON m.subcategory_id = s.id
             WHERE m.id = ? AND m.is_active = TRUE`,
            [itemId],
          );
          response.data.mainItem = (manufacturers as any[])[0] || null;

          if (response.data.mainItem) {
            // Get related categories
            if (response.data.mainItem.category_id) {
              const [cats] = await pool.execute(
                `SELECT * FROM categories WHERE id = ? AND is_active = TRUE`,
                [response.data.mainItem.category_id],
              );
              response.data.relatedCategories = cats;
            }

            // Get related subcategories
            if (response.data.mainItem.subcategory_id) {
              const [subcats] = await pool.execute(
                `SELECT * FROM subcategories WHERE id = ? AND is_active = TRUE`,
                [response.data.mainItem.subcategory_id],
              );
              response.data.relatedSubcategories = subcats;
            }

            // Get brands for this manufacturer
            const [brds] = await pool.execute(
              `SELECT b.*, c.name as category_name, s.name as subcategory_name
               FROM brands b
               LEFT JOIN categories c ON b.category_id = c.id
               LEFT JOIN subcategories s ON b.subcategory_id = s.id
               WHERE b.manufacturer_id = ? AND b.is_active = TRUE ORDER BY b.name`,
              [itemId],
            );
            response.data.relatedBrands = brds;
          }
          break;
        }
      }
    }

    // Additional filtering logic for advanced search
    // If filters are provided without a main item
    if (!type || !id) {
      const conditions: string[] = [];
      const params: any[] = [];

      // If no filters at all, return all categories
      if (!category_id && !subcategory_id && !brand_id && !manufacturer_id) {
        const [allCategories] = await pool.execute(
          `SELECT * FROM categories WHERE is_active = TRUE ORDER BY name`,
        );
        response.data.relatedCategories = allCategories;
      }

      // Build dynamic query based on filters
      if (category_id) {
        const catId = parseInt(category_id as string);

        // Get subcategories
        const [subcats] = await pool.execute(
          `SELECT * FROM subcategories WHERE category_id = ? AND is_active = TRUE ORDER BY name`,
          [catId],
        );
        response.data.relatedSubcategories = subcats;

        // Get manufacturers
        const [mfgs] = await pool.execute(
          `SELECT DISTINCT m.*, c.name as category_name, s.name as subcategory_name
           FROM manufacturers m
           LEFT JOIN categories c ON m.category_id = c.id
           LEFT JOIN subcategories s ON m.subcategory_id = s.id
           WHERE m.category_id = ? AND m.is_active = TRUE ORDER BY m.name`,
          [catId],
        );
        response.data.relatedManufacturers = mfgs;

        // Get brands
        const [brds] = await pool.execute(
          `SELECT DISTINCT b.*, m.name as manufacturer_name, c.name as category_name, s.name as subcategory_name
           FROM brands b
           LEFT JOIN manufacturers m ON b.manufacturer_id = m.id
           LEFT JOIN categories c ON b.category_id = c.id
           LEFT JOIN subcategories s ON b.subcategory_id = s.id
           WHERE b.category_id = ? AND b.is_active = TRUE ORDER BY b.name`,
          [catId],
        );
        response.data.relatedBrands = brds;
      }

      if (subcategory_id) {
        const subcatId = parseInt(subcategory_id as string);

        // Get manufacturers
        const [mfgs] = await pool.execute(
          `SELECT DISTINCT m.*, c.name as category_name, s.name as subcategory_name
           FROM manufacturers m
           LEFT JOIN categories c ON m.category_id = c.id
           LEFT JOIN subcategories s ON m.subcategory_id = s.id
           WHERE m.subcategory_id = ? AND m.is_active = TRUE ORDER BY m.name`,
          [subcatId],
        );
        response.data.relatedManufacturers = mfgs;

        // Get brands
        const [brds] = await pool.execute(
          `SELECT DISTINCT b.*, m.name as manufacturer_name, c.name as category_name, s.name as subcategory_name
           FROM brands b
           LEFT JOIN manufacturers m ON b.manufacturer_id = m.id
           LEFT JOIN categories c ON b.category_id = c.id
           LEFT JOIN subcategories s ON b.subcategory_id = s.id
           WHERE b.subcategory_id = ? AND b.is_active = TRUE ORDER BY b.name`,
          [subcatId],
        );
        response.data.relatedBrands = brds;
      }

      if (manufacturer_id) {
        const mfgId = parseInt(manufacturer_id as string);

        // Get brands for this manufacturer
        const [brds] = await pool.execute(
          `SELECT b.*, c.name as category_name, s.name as subcategory_name
           FROM brands b
           LEFT JOIN categories c ON b.category_id = c.id
           LEFT JOIN subcategories s ON b.subcategory_id = s.id
           WHERE b.manufacturer_id = ? AND b.is_active = TRUE ORDER BY b.name`,
          [mfgId],
        );
        response.data.relatedBrands = brds;
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get catalog data error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

// ==================== EXPRESS SERVER SETUP ====================
let app: express.Application | null = null;

function createServer() {
  console.log("Creating Express server for Vercel...");

  const expressApp = express();

  // Middleware
  expressApp.use(cors());
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  // Log requests
  expressApp.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // ==================== CONFIGURE PUBLIC ROUTES ====================

  // Health check
  expressApp.get("/api/health", handleHealth);

  // Categories
  expressApp.get("/api/categories", getCategories);
  expressApp.get("/api/categories/validate-slug", validateCategorySlug);

  // Brands
  expressApp.get("/api/brands", getBrands);

  // Manufacturers
  expressApp.get("/api/manufacturers", getManufacturers);

  // Models
  expressApp.get("/api/models", getModels);

  // Products
  expressApp.get("/api/products", getProducts);
  expressApp.get("/api/products/:id", getProductById);

  // Home Sections
  expressApp.get("/api/home/sections", getRandomSections);
  expressApp.get("/api/catalog", getCatalogData);

  // Quotes
  expressApp.get("/api/quotes", getQuotes);
  expressApp.get("/api/quotes/:id", getQuoteById);
  expressApp.post("/api/quotes", createQuote);

  // Contact & Support
  expressApp.post("/api/contact", submitContactForm);

  // FAQ
  expressApp.get("/api/faq/categories", getFAQCategories);
  expressApp.get("/api/faq/items", getFAQItems);

  // ==================== CONFIGURE ADMIN ROUTES ====================

  // Admin Authentication (no auth required for these)
  expressApp.post("/api/admin/auth/check-user", checkAdminUser);
  expressApp.post("/api/admin/auth/send-code", sendAdminCode);
  expressApp.post("/api/admin/auth/verify-code", verifyAdminCode);

  // Admin Categories (protected)
  expressApp.get("/api/admin/categories", getCategories);
  expressApp.post("/api/admin/categories", createCategory);
  expressApp.put("/api/admin/categories/:id", updateCategory);
  expressApp.delete("/api/admin/categories/:id", deleteCategory);

  // Admin Subcategories (protected)
  expressApp.get("/api/admin/subcategories", getSubcategories);
  expressApp.post("/api/admin/subcategories", createSubcategory);
  expressApp.put("/api/admin/subcategories/:id", updateSubcategory);
  expressApp.delete("/api/admin/subcategories/:id", deleteSubcategory);

  // Admin Manufacturers (protected)
  expressApp.get("/api/admin/manufacturers", getManufacturers);
  expressApp.post("/api/admin/manufacturers", createManufacturer);
  expressApp.put("/api/admin/manufacturers/:id", updateManufacturer);
  expressApp.delete("/api/admin/manufacturers/:id", deleteManufacturer);

  // Admin Brands (protected)
  expressApp.get("/api/admin/brands", getBrands);
  expressApp.post("/api/admin/brands", createBrand);
  expressApp.put("/api/admin/brands/:id", updateBrand);
  expressApp.delete("/api/admin/brands/:id", deleteBrand);

  // Admin Models (protected)
  expressApp.get("/api/admin/models", getModels);
  expressApp.post("/api/admin/models", createModel);
  expressApp.put("/api/admin/models/:id", updateModel);
  expressApp.delete("/api/admin/models/:id", deleteModel);

  // Admin Products (protected)
  expressApp.get("/api/admin/products", getProducts);
  expressApp.get("/api/admin/products/:id", getProductById);
  expressApp.post("/api/admin/products", createProduct);
  expressApp.put("/api/admin/products/:id", updateProduct);
  expressApp.delete("/api/admin/products/:id", deleteProduct);

  // Admin Users (protected)
  expressApp.get("/api/admin/users", getAdminUsers);
  expressApp.get("/api/admin/users/:id", getAdminUserById);
  expressApp.post("/api/admin/users", createAdminUser);
  expressApp.put("/api/admin/users/:id", updateAdminUser);
  expressApp.delete("/api/admin/users/:id", deleteAdminUser);

  // Admin Quotes (protected)
  expressApp.get("/api/admin/quotes", getAdminQuotes);
  expressApp.get("/api/admin/quotes/:id", getQuoteById);
  expressApp.put("/api/admin/quotes/:id/status", updateQuoteStatus);

  // Admin Notification Settings (protected)
  expressApp.get(
    "/api/admin/notification-settings",
    getNotificationSettingsApi,
  );
  expressApp.put(
    "/api/admin/notification-settings",
    updateNotificationSettings,
  );
  expressApp.get("/api/admin/smtp-settings", getSMTPSettingsApi);
  expressApp.post("/api/admin/test-email", testEmail);

  // Admin Notification Management (protected)
  expressApp.get("/api/admin/notifications", getAdminNotifications);
  expressApp.put("/api/admin/notifications", updateAdminNotifications);

  // Admin Contact & Support (protected)
  expressApp.get("/api/admin/contact-submissions", getContactSubmissions);
  expressApp.get(
    "/api/admin/contact-submissions/:id",
    getContactSubmissionById,
  );
  expressApp.put("/api/admin/contact-submissions/:id", updateContactSubmission);
  expressApp.post(
    "/api/admin/contact-submissions/:id/responses",
    addSupportResponse,
  );
  expressApp.delete(
    "/api/admin/contact-submissions/:id",
    deleteContactSubmission,
  );

  // Admin FAQ Management (protected)
  expressApp.get("/api/admin/faq/categories", getFAQCategories);
  expressApp.post("/api/admin/faq/categories", createFAQCategory);
  expressApp.put("/api/admin/faq/categories/:id", updateFAQCategory);
  expressApp.delete("/api/admin/faq/categories/:id", deleteFAQCategory);

  expressApp.get("/api/admin/faq/items", getFAQItems);
  expressApp.post("/api/admin/faq/items", createFAQItem);
  expressApp.put("/api/admin/faq/items/:id", updateFAQItem);
  expressApp.delete("/api/admin/faq/items/:id", deleteFAQItem);

  // 404 handler
  expressApp.use("/api", (_req, res) => {
    if (!res.headersSent) {
      res.status(404).json({
        success: false,
        message: "API endpoint not found",
      });
    }
  });

  // Error handler
  expressApp.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error("Express error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    },
  );

  return expressApp;
}

function getApp() {
  if (!app) {
    console.log("Initializing Express app for serverless...");
    app = createServer();
  }
  return app;
}

// Export createServer for development use
export { createServer };

// Export handler for Vercel serverless
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const expressApp = getApp();
    expressApp(req as any, res as any);
  } catch (error) {
    console.error("API Handler Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: {
          code: "500",
          message: "A server error has occurred",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
};
