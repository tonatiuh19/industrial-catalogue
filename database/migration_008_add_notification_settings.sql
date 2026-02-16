-- Migration 008: Add notification settings and email configuration
-- Created: 2026-02-03
-- Purpose: Support admin notification settings for quote requests and email templates

-- Table for storing notification settings and email configuration
CREATE TABLE IF NOT EXISTS `notification_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for managing admin notification recipients
CREATE TABLE IF NOT EXISTS `admin_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL,
  `notification_type` enum('quote_requests','general','system') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'quote_requests',
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_admin_notification` (`admin_id`, `notification_type`),
  CONSTRAINT `fk_admin_notifications_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for email templates
CREATE TABLE IF NOT EXISTS `email_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `html_content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `text_content` text COLLATE utf8mb4_unicode_ci,
  `variables` json,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_template_key` (`template_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default notification settings
INSERT INTO `notification_settings` (`setting_key`, `setting_value`, `description`) VALUES
('enable_client_notifications', '1', 'Send confirmation emails to clients (1 = enabled, 0 = disabled)'),
('enable_admin_notifications', '1', 'Send notification emails to admins (1 = enabled, 0 = disabled)');

-- Insert default admin notification settings for existing admins
INSERT INTO `admin_notifications` (`admin_id`, `notification_type`, `is_enabled`)
SELECT `id`, 'quote_requests', 1 FROM `admins` WHERE `is_active` = 1
ON DUPLICATE KEY UPDATE `is_enabled` = VALUES(`is_enabled`);

-- Insert default email templates
INSERT INTO `email_templates` (`template_key`, `name`, `subject`, `html_content`, `text_content`, `variables`) VALUES
('client_quote_confirmation', 'Client Quote Confirmation', 'Confirmación de Solicitud de Cotización - {{quote_number}}', 
'<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Cotización</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #2c5aa0 0%, #1a365d 100%); color: white; padding: 30px; text-align: center; }
        .header img { max-height: 50px; margin-bottom: 15px; }
        .content { padding: 30px; }
        .quote-box { background-color: #f8f9fa; border-left: 4px solid #c03818; padding: 20px; margin: 20px 0; }
        .product-details { background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .footer { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .button { display: inline-block; background-color: #c03818; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
        .contact-info { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{company_logo}}" alt="{{company_name}}">
            <h1>¡Gracias por tu solicitud!</h1>
            <p>Tu cotización ha sido recibida exitosamente</p>
        </div>
        
        <div class="content">
            <h2>Hola {{customer_name}},</h2>
            
            <p>Hemos recibido tu solicitud de cotización y nuestro equipo la está revisando. Te responderemos dentro de las próximas horas.</p>
            
            <div class="quote-box">
                <h3>📋 Detalles de tu Solicitud</h3>
                <p><strong>Número de Cotización:</strong> {{quote_number}}</p>
                <p><strong>Fecha:</strong> {{date}}</p>
            </div>
            
            <div class="product-details">
                <h3>🔧 Información del Producto</h3>
                {{#if brand}}<p><strong>Marca:</strong> {{brand}}</p>{{/if}}
                {{#if product_type}}<p><strong>Tipo de Producto:</strong> {{product_type}}</p>{{/if}}
                {{#if part_number}}<p><strong>Número de Parte:</strong> {{part_number}}</p>{{/if}}
                {{#if specifications}}<p><strong>Especificaciones:</strong> {{specifications}}</p>{{/if}}
            </div>
            
            <div class="contact-info">
                <p><strong>📞 Información de Contacto Registrada:</strong></p>
                <p>Email: {{customer_email}}</p>
                {{#if customer_phone}}<p>Teléfono: {{customer_phone}}</p>{{/if}}
                {{#if customer_company}}<p>Empresa: {{customer_company}}</p>{{/if}}
                <p>Método de contacto preferido: {{preferred_contact_method}}</p>
            </div>
            
            <p>Un asesor de <strong>{{company_name}}</strong> se pondrá en contacto contigo a la brevedad para brindarte la información que necesitas.</p>
            
            <center>
                <a href="{{company_website}}" class="button">Visitar nuestro sitio web</a>
            </center>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 {{company_name}}. Todos los derechos reservados.</p>
            <p>Herramientas profesionales, equipamiento industrial y componentes de precisión</p>
        </div>
    </div>
</body>
</html>',
'Hola {{customer_name}},

Hemos recibido tu solicitud de cotización y nuestro equipo la está revisando.

Detalles de tu Solicitud:
- Número de Cotización: {{quote_number}}
- Fecha: {{date}}

Información del Producto:
{{#if brand}}- Marca: {{brand}}{{/if}}
{{#if product_type}}- Tipo de Producto: {{product_type}}{{/if}}
{{#if part_number}}- Número de Parte: {{part_number}}{{/if}}
{{#if specifications}}- Especificaciones: {{specifications}}{{/if}}

Un asesor de {{company_name}} se pondrá en contacto contigo a la brevedad.

Saludos,
Equipo {{company_name}}',
JSON_ARRAY('quote_number', 'customer_name', 'customer_email', 'customer_phone', 'customer_company', 'brand', 'product_type', 'part_number', 'specifications', 'preferred_contact_method', 'date', 'company_name', 'company_logo', 'company_website')),

('admin_quote_notification', 'Admin Quote Notification', 'Nueva Solicitud de Cotización - {{quote_number}}',
'<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Cotización</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #c03818 0%, #d94520 100%); color: white; padding: 30px; text-align: center; }
        .header img { max-height: 50px; margin-bottom: 15px; }
        .content { padding: 30px; }
        .alert-box { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .client-info { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .product-info { background-color: #e8f4fd; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .footer { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .button { display: inline-block; background-color: #c03818; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
        .urgent { color: #c03818; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{company_logo}}" alt="{{company_name}} Admin">
            <h1>🚨 Nueva Solicitud de Cotización</h1>
            <p>Requiere atención inmediata</p>
        </div>
        
        <div class="content">
            <div class="alert-box">
                <p class="urgent">⚡ Solicitud recibida: {{date}}</p>
                <p><strong>Número de Cotización:</strong> {{quote_number}}</p>
            </div>
            
            <div class="client-info">
                <h3>👤 Información del Cliente</h3>
                <p><strong>Nombre:</strong> {{customer_name}}</p>
                <p><strong>Email:</strong> {{customer_email}}</p>
                {{#if customer_phone}}<p><strong>Teléfono:</strong> {{customer_phone}}</p>{{/if}}
                {{#if customer_company}}<p><strong>Empresa:</strong> {{customer_company}}</p>{{/if}}
                {{#if city_state}}<p><strong>Ubicación:</strong> {{city_state}}</p>{{/if}}
                <p><strong>Método de contacto preferido:</strong> {{preferred_contact_method}}</p>
            </div>
            
            <div class="product-info">
                <h3>🔧 Detalles del Producto Solicitado</h3>
                {{#if brand}}<p><strong>Marca:</strong> {{brand}}</p>{{/if}}
                {{#if product_type}}<p><strong>Tipo de Producto:</strong> {{product_type}}</p>{{/if}}
                {{#if part_number}}<p><strong>Número de Parte:</strong> {{part_number}}</p>{{/if}}
                {{#if specifications}}<p><strong>Especificaciones:</strong> {{specifications}}</p>{{/if}}
                {{#if quantity}}<p><strong>Cantidad:</strong> {{quantity}}</p>{{/if}}
                {{#if customer_message}}<p><strong>Mensaje adicional:</strong> {{customer_message}}</p>{{/if}}
            </div>
            
            <p><strong>Siguiente paso:</strong> Contactar al cliente para proporcionar la cotización solicitada.</p>
            
            <center>
                <a href="{{admin_url}}/quotes/{{quote_id}}" class="button">Ver en Panel Admin</a>
                <a href="mailto:{{customer_email}}" class="button">Responder al Cliente</a>
            </center>
        </div>
        
        <div class="footer">
            <p>Panel de Administración {{company_name}}</p>
            <p>Este email fue generado automáticamente por el sistema de cotizaciones</p>
        </div>
    </div>
</body>
</html>',
'Nueva Solicitud de Cotización - {{quote_number}}

Solicitud recibida: {{date}}

INFORMACIÓN DEL CLIENTE:
- Nombre: {{customer_name}}
- Email: {{customer_email}}
{{#if customer_phone}}- Teléfono: {{customer_phone}}{{/if}}
{{#if customer_company}}- Empresa: {{customer_company}}{{/if}}
{{#if city_state}}- Ubicación: {{city_state}}{{/if}}
- Método de contacto preferido: {{preferred_contact_method}}

PRODUCTO SOLICITADO:
{{#if brand}}- Marca: {{brand}}{{/if}}
{{#if product_type}}- Tipo de Producto: {{product_type}}{{/if}}
{{#if part_number}}- Número de Parte: {{part_number}}{{/if}}
{{#if specifications}}- Especificaciones: {{specifications}}{{/if}}
{{#if quantity}}- Cantidad: {{quantity}}{{/if}}
{{#if customer_message}}- Mensaje: {{customer_message}}{{/if}}

Accede al panel admin para gestionar esta cotización.

Sistema {{company_name}}',
JSON_ARRAY('quote_number', 'quote_id', 'customer_name', 'customer_email', 'customer_phone', 'customer_company', 'city_state', 'brand', 'product_type', 'part_number', 'specifications', 'quantity', 'customer_message', 'preferred_contact_method', 'date', 'company_name', 'company_logo', 'admin_url'));

-- Add indexes for better performance
ALTER TABLE `notification_settings` ADD INDEX `idx_setting_key` (`setting_key`);
ALTER TABLE `admin_notifications` ADD INDEX `idx_admin_notification_type` (`admin_id`, `notification_type`);
ALTER TABLE `email_templates` ADD INDEX `idx_template_key` (`template_key`);
ALTER TABLE `email_templates` ADD INDEX `idx_is_active` (`is_active`);