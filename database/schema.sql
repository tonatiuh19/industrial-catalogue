-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 03, 2026 at 04:40 PM
-- Server version: 5.7.23-23
-- PHP Version: 8.1.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alanchat_industrial-catalogue`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','super_admin') COLLATE utf8mb4_unicode_ci DEFAULT 'admin',
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_email_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password_hash`, `role`, `first_name`, `last_name`, `phone`, `is_active`, `is_email_verified`, `created_at`, `updated_at`, `last_login`) VALUES
(1, 'axgoomez@gmail.com', '', 'super_admin', 'Felix', 'Gomez', NULL, 1, 1, '2025-12-07 04:43:17', '2025-12-17 20:55:35', '2025-12-17 20:55:35'),
(3, 'ing.bryanpadilla@gmail.com', '', 'super_admin', 'Bryan', 'Padilla', NULL, 1, 1, '2025-12-07 04:43:17', '2025-12-17 17:05:19', '2025-12-17 17:05:19'),
(5, 'mosquedajulian97@gmail.com', NULL, 'super_admin', 'Julian', 'Mosqueda', NULL, 1, 0, '2026-01-09 00:23:04', '2026-01-09 00:23:04', NULL),
(6, 'rrrf2096@gmail.com', NULL, 'super_admin', 'Ricardo', 'Ruiz', NULL, 1, 0, '2026-01-09 01:07:23', '2026-01-09 01:07:23', NULL),
(7, 'srz.josemaria@gmail.com', NULL, 'super_admin', 'Josemaria', 'Suarez', NULL, 1, 0, '2026-01-09 01:10:51', '2026-01-09 01:10:51', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `notification_type` enum('quote_requests','general','system') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'quote_requests',
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_notifications`
--

INSERT INTO `admin_notifications` (`id`, `admin_id`, `notification_type`, `is_enabled`, `created_at`, `updated_at`) VALUES
(1, 1, 'quote_requests', 1, '2026-02-03 22:35:07', '2026-02-03 22:35:07'),
(2, 3, 'quote_requests', 1, '2026-02-03 22:35:07', '2026-02-03 22:35:07'),
(3, 5, 'quote_requests', 1, '2026-02-03 22:35:07', '2026-02-03 22:35:07'),
(4, 6, 'quote_requests', 1, '2026-02-03 22:35:07', '2026-02-03 22:35:07'),
(5, 7, 'quote_requests', 1, '2026-02-03 22:35:07', '2026-02-03 22:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `admin_sessions`
--

CREATE TABLE `admin_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_code` int(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `expires_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_sessions`
--

INSERT INTO `admin_sessions` (`id`, `user_id`, `session_code`, `is_active`, `expires_at`, `created_at`) VALUES
(1, 1, 245236, 0, '2025-12-09 03:05:56', '2025-12-09 00:41:41'),
(2, 1, 896314, 0, '2025-12-09 03:05:56', '2025-12-09 02:59:51'),
(3, 1, 655360, 0, '2025-12-09 03:05:56', '2025-12-09 03:02:30'),
(4, 1, 646494, 0, '2025-12-09 03:05:56', '2025-12-09 03:05:40'),
(5, 1, 587223, 0, '2025-12-09 03:06:33', '2025-12-09 03:06:22'),
(6, 1, 274501, 0, '2025-12-09 03:09:12', '2025-12-09 03:08:59'),
(7, 1, 237411, 0, '2025-12-09 03:23:36', '2025-12-09 03:23:19'),
(8, 1, 769229, 0, '2025-12-09 03:28:58', '2025-12-09 03:28:46'),
(9, 1, 666477, 0, '2025-12-09 03:36:15', '2025-12-09 03:36:03'),
(10, 1, 121863, 0, '2025-12-10 15:48:12', '2025-12-10 15:48:00'),
(12, 3, 411331, 0, '2025-12-17 17:05:19', '2025-12-17 17:05:00'),
(13, 1, 302596, 0, '2025-12-17 20:55:35', '2025-12-17 20:55:22'),
(14, 1, 110156, 0, '2026-01-07 05:31:47', '2026-01-07 05:21:47'),
(15, 1, 570137, 1, '2026-01-08 05:27:58', '2026-01-07 05:27:46'),
(16, 1, 219340, 1, '2026-01-08 11:46:05', '2026-01-07 05:45:54'),
(18, 1, 155085, 1, '2026-01-08 11:47:30', '2026-01-07 05:47:20'),
(19, 3, 756147, 1, '2026-01-08 22:06:02', '2026-01-07 16:05:45'),
(20, 3, 949139, 1, '2026-01-09 04:39:39', '2026-01-07 22:39:05'),
(21, 1, 753639, 1, '2026-01-09 03:39:53', '2026-01-08 03:39:29'),
(22, 3, 443327, 1, '2026-01-09 21:51:05', '2026-01-08 15:50:41'),
(23, 3, 864473, 1, '2026-01-10 07:06:45', '2026-01-09 01:06:28'),
(24, 1, 803127, 1, '2026-01-16 23:44:36', '2026-01-15 23:44:21'),
(25, 5, 834581, 1, '2026-01-18 22:08:20', '2026-01-17 16:08:00'),
(26, 1, 499689, 1, '2026-01-22 22:02:29', '2026-01-21 22:02:16'),
(27, 1, 177173, 1, '2026-01-25 01:06:01', '2026-01-24 01:05:43'),
(28, 3, 656652, 1, '2026-01-27 05:49:16', '2026-01-25 23:48:52');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `manufacturer_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extra_images` text COLLATE utf8mb4_unicode_ci,
  `logo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `manufacturer_id`, `category_id`, `subcategory_id`, `description`, `main_image`, `extra_images`, `logo_url`, `is_active`, `created_at`, `updated_at`) VALUES
(9, 'SKF', 10, 7, 1, '', '/data/industrial_catalogue/9/main_image/6976aebdc793e_1769385661.png', NULL, NULL, 1, '2026-01-08 04:02:33', '2026-01-26 00:01:02'),
(10, 'NSK', 11, 7, 1, '', '/data/industrial_catalogue/10/main_image/6976af648c4db_1769385828.png', NULL, NULL, 1, '2026-01-08 16:12:37', '2026-01-26 00:03:48'),
(11, 'ABB', 12, 8, NULL, '', '/data/industrial_catalogue/11/main_image/6976afe6b3589_1769385958.png', NULL, NULL, 1, '2026-01-08 16:40:29', '2026-01-26 00:05:58'),
(12, 'WEG', 15, 13, 31, '', '/data/industrial_catalogue/12/main_image/6976b0f292137_1769386226.png', NULL, NULL, 1, '2026-01-08 16:40:37', '2026-01-26 00:10:26'),
(13, 'Siemens', 14, 8, NULL, '', '/data/industrial_catalogue/13/main_image/6976ace8ca07c_1769385192.jpg', NULL, NULL, 1, '2026-01-08 16:40:48', '2026-01-25 23:53:13'),
(14, 'Baldor-Reliance', 13, 13, 31, '', '/data/industrial_catalogue/14/main_image/6976b12738311_1769386279.png', NULL, NULL, 1, '2026-01-08 16:40:55', '2026-01-26 00:11:19'),
(15, 'Timken', 16, 13, 31, '', '/data/industrial_catalogue/15/main_image/6976b4528ebd2_1769387090.png', NULL, NULL, 1, '2026-01-08 16:41:02', '2026-01-26 00:24:50');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extra_images` text COLLATE utf8mb4_unicode_ci,
  `parent_id` int(11) DEFAULT NULL,
  `display_order` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `slug`, `main_image`, `extra_images`, `parent_id`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Industrial Tools', 'Professional industrial tools and equipment', 'industrial-tools', NULL, NULL, NULL, 1, 1, '2025-11-20 00:53:28', '2025-11-20 00:53:28'),
(7, 'Transmisión de potencia', 'Componentes industriales para la transmisión eficiente de movimiento y potencia mecánica, incluyendo rodamientos, bandas, cadenas, poleas, acoplamientos y soluciones relacionadas.', 'transmision-de-potencia', '/data/industrial_catalogue/7/main_image/6976b4ac5a136_1769387180.jpeg', NULL, NULL, 0, 1, '2026-01-07 21:57:42', '2026-01-26 00:26:20'),
(8, 'Automatización y Control', '', 'automatizaci-n-y-control', '/data/industrial_catalogue/8/main_image/69697fd69aab8_1768521686.jpeg', NULL, NULL, 0, 1, '2026-01-07 21:58:37', '2026-01-26 02:33:59'),
(9, 'Neumática e Hidráulica', 'Equipos y componentes neumáticos e hidráulicos para sistemas industriales, incluyendo válvulas, cilindros, mangueras, conexiones, bombas y accesorios.', 'neumatica-e-hidraulica', NULL, NULL, NULL, 0, 1, '2026-01-07 21:59:16', '2026-01-07 21:59:16'),
(10, 'Herramientas y Equipo de Mantenimiento', 'Herramientas manuales, eléctricas y equipos especializados para mantenimiento industrial, diagnóstico, reparación y operación de maquinaria.', 'herramientas-y-mantenimiento', '/data/industrial_catalogue/10/main_image/69714d2e5f7a0_1769033006.png', NULL, NULL, 0, 1, '2026-01-07 22:00:03', '2026-01-21 22:03:26'),
(11, 'Suministros Industriales', 'Insumos esenciales para la operación industrial, como tornillería, abrasivos, lubricantes, adhesivos, selladores y materiales de uso general en planta.', 'suministros-industriales', NULL, NULL, NULL, 0, 1, '2026-01-07 22:00:32', '2026-01-07 22:00:32'),
(12, 'Seguridad Industrial (EPP)', 'Equipos de protección personal y soluciones de seguridad para la prevención de riesgos laborales y el cumplimiento de normativas industriales.', 'seguridad-industrial', NULL, NULL, NULL, 0, 1, '2026-01-07 22:01:06', '2026-01-07 22:01:06'),
(13, 'Maquinaria y Equipos', 'Maquinaria y equipos industriales para procesos productivos, incluyendo motores eléctricos, bombas, reductores, compresores y equipos especiales bajo proyecto.', 'maquinaria-y-equipos', NULL, NULL, NULL, 0, 1, '2026-01-07 22:01:43', '2026-01-07 22:01:43'),
(14, 'Servicios Industriales', 'Servicios técnicos industriales que incluyen mantenimiento, reparación, integración de soluciones, consultoría técnica y desarrollo de proyectos especiales.', 'servicios-industriales', NULL, NULL, NULL, 0, 1, '2026-01-07 22:02:10', '2026-01-07 22:02:10'),
(15, 'Marcas', 'Catálogo de marcas industriales reconocidas, seleccionadas por su calidad, confiabilidad y compatibilidad con soluciones industriales profesionales.', 'marcas', NULL, NULL, NULL, 0, 1, '2026-01-07 22:02:38', '2026-01-07 22:02:38');

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` int(11) NOT NULL,
  `template_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `html_content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `text_content` text COLLATE utf8mb4_unicode_ci,
  `variables` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_templates`
--

INSERT INTO `email_templates` (`id`, `template_key`, `name`, `subject`, `html_content`, `text_content`, `variables`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'client_quote_confirmation', 'Client Quote Confirmation', 'Confirmación de Solicitud de Cotización - {{quote_number}}', '<!DOCTYPE html>\r\n<html lang=\"es\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Confirmación de Cotización</title>\r\n    <style>\r\n        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }\r\n        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }\r\n        .header { background: linear-gradient(135deg, #2c5aa0 0%, #1a365d 100%); color: white; padding: 30px; text-align: center; }\r\n        .header img { max-height: 50px; margin-bottom: 15px; }\r\n        .content { padding: 30px; }\r\n        .quote-box { background-color: #f8f9fa; border-left: 4px solid #c03818; padding: 20px; margin: 20px 0; }\r\n        .product-details { background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }\r\n        .footer { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; font-size: 14px; }\r\n        .button { display: inline-block; background-color: #c03818; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }\r\n        .contact-info { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; }\r\n    </style>\r\n</head>\r\n<body>\r\n    <div class=\"container\">\r\n        <div class=\"header\">\r\n            <img src=\"{{company_logo}}\" alt=\"{{company_name}}\">\r\n            <h1>¡Gracias por tu solicitud!</h1>\r\n            <p>Tu cotización ha sido recibida exitosamente</p>\r\n        </div>\r\n        \r\n        <div class=\"content\">\r\n            <h2>Hola {{customer_name}},</h2>\r\n            \r\n            <p>Hemos recibido tu solicitud de cotización y nuestro equipo la está revisando. Te responderemos dentro de las próximas horas.</p>\r\n            \r\n            <div class=\"quote-box\">\r\n                <h3>📋 Detalles de tu Solicitud</h3>\r\n                <p><strong>Número de Cotización:</strong> {{quote_number}}</p>\r\n                <p><strong>Fecha:</strong> {{date}}</p>\r\n            </div>\r\n            \r\n            <div class=\"product-details\">\r\n                <h3>🔧 Información del Producto</h3>\r\n                {{#if brand}}<p><strong>Marca:</strong> {{brand}}</p>{{/if}}\r\n                {{#if product_type}}<p><strong>Tipo de Producto:</strong> {{product_type}}</p>{{/if}}\r\n                {{#if part_number}}<p><strong>Número de Parte:</strong> {{part_number}}</p>{{/if}}\r\n                {{#if specifications}}<p><strong>Especificaciones:</strong> {{specifications}}</p>{{/if}}\r\n            </div>\r\n            \r\n            <div class=\"contact-info\">\r\n                <p><strong>📞 Información de Contacto Registrada:</strong></p>\r\n                <p>Email: {{customer_email}}</p>\r\n                {{#if customer_phone}}<p>Teléfono: {{customer_phone}}</p>{{/if}}\r\n                {{#if customer_company}}<p>Empresa: {{customer_company}}</p>{{/if}}\r\n                <p>Método de contacto preferido: {{preferred_contact_method}}</p>\r\n            </div>\r\n            \r\n            <p>Un asesor de <strong>{{company_name}}</strong> se pondrá en contacto contigo a la brevedad para brindarte la información que necesitas.</p>\r\n            \r\n            <center>\r\n                <a href=\"{{company_website}}\" class=\"button\">Visitar nuestro sitio web</a>\r\n            </center>\r\n        </div>\r\n        \r\n        <div class=\"footer\">\r\n            <p>&copy; 2024 {{company_name}}. Todos los derechos reservados.</p>\r\n            <p>Herramientas profesionales, equipamiento industrial y componentes de precisión</p>\r\n        </div>\r\n    </div>\r\n</body>\r\n</html>', 'Hola {{customer_name}},\r\n\r\nHemos recibido tu solicitud de cotización y nuestro equipo la está revisando.\r\n\r\nDetalles de tu Solicitud:\r\n- Número de Cotización: {{quote_number}}\r\n- Fecha: {{date}}\r\n\r\nInformación del Producto:\r\n{{#if brand}}- Marca: {{brand}}{{/if}}\r\n{{#if product_type}}- Tipo de Producto: {{product_type}}{{/if}}\r\n{{#if part_number}}- Número de Parte: {{part_number}}{{/if}}\r\n{{#if specifications}}- Especificaciones: {{specifications}}{{/if}}\r\n\r\nUn asesor de {{company_name}} se pondrá en contacto contigo a la brevedad.\r\n\r\nSaludos,\r\nEquipo {{company_name}}', '[\"quote_number\", \"customer_name\", \"customer_email\", \"customer_phone\", \"customer_company\", \"brand\", \"product_type\", \"part_number\", \"specifications\", \"preferred_contact_method\", \"date\", \"company_name\", \"company_logo\", \"company_website\"]', 1, '2026-02-03 22:35:07', '2026-02-03 22:35:07'),
(2, 'admin_quote_notification', 'Admin Quote Notification', 'Nueva Solicitud de Cotización - {{quote_number}}', '<!DOCTYPE html>\r\n<html lang=\"es\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Nueva Cotización</title>\r\n    <style>\r\n        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }\r\n        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }\r\n        .header { background: linear-gradient(135deg, #c03818 0%, #d94520 100%); color: white; padding: 30px; text-align: center; }\r\n        .header img { max-height: 50px; margin-bottom: 15px; }\r\n        .content { padding: 30px; }\r\n        .alert-box { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0; }\r\n        .client-info { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }\r\n        .product-info { background-color: #e8f4fd; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 20px 0; }\r\n        .footer { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; font-size: 14px; }\r\n        .button { display: inline-block; background-color: #c03818; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }\r\n        .urgent { color: #c03818; font-weight: bold; }\r\n    </style>\r\n</head>\r\n<body>\r\n    <div class=\"container\">\r\n        <div class=\"header\">\r\n            <img src=\"{{company_logo}}\" alt=\"{{company_name}} Admin\">\r\n            <h1>🚨 Nueva Solicitud de Cotización</h1>\r\n            <p>Requiere atención inmediata</p>\r\n        </div>\r\n        \r\n        <div class=\"content\">\r\n            <div class=\"alert-box\">\r\n                <p class=\"urgent\">⚡ Solicitud recibida: {{date}}</p>\r\n                <p><strong>Número de Cotización:</strong> {{quote_number}}</p>\r\n            </div>\r\n            \r\n            <div class=\"client-info\">\r\n                <h3>👤 Información del Cliente</h3>\r\n                <p><strong>Nombre:</strong> {{customer_name}}</p>\r\n                <p><strong>Email:</strong> {{customer_email}}</p>\r\n                {{#if customer_phone}}<p><strong>Teléfono:</strong> {{customer_phone}}</p>{{/if}}\r\n                {{#if customer_company}}<p><strong>Empresa:</strong> {{customer_company}}</p>{{/if}}\r\n                {{#if city_state}}<p><strong>Ubicación:</strong> {{city_state}}</p>{{/if}}\r\n                <p><strong>Método de contacto preferido:</strong> {{preferred_contact_method}}</p>\r\n            </div>\r\n            \r\n            <div class=\"product-info\">\r\n                <h3>🔧 Detalles del Producto Solicitado</h3>\r\n                {{#if brand}}<p><strong>Marca:</strong> {{brand}}</p>{{/if}}\r\n                {{#if product_type}}<p><strong>Tipo de Producto:</strong> {{product_type}}</p>{{/if}}\r\n                {{#if part_number}}<p><strong>Número de Parte:</strong> {{part_number}}</p>{{/if}}\r\n                {{#if specifications}}<p><strong>Especificaciones:</strong> {{specifications}}</p>{{/if}}\r\n                {{#if quantity}}<p><strong>Cantidad:</strong> {{quantity}}</p>{{/if}}\r\n                {{#if customer_message}}<p><strong>Mensaje adicional:</strong> {{customer_message}}</p>{{/if}}\r\n            </div>\r\n            \r\n            <p><strong>Siguiente paso:</strong> Contactar al cliente para proporcionar la cotización solicitada.</p>\r\n            \r\n            <center>\r\n                <a href=\"{{admin_url}}/quotes/{{quote_id}}\" class=\"button\">Ver en Panel Admin</a>\r\n                <a href=\"mailto:{{customer_email}}\" class=\"button\">Responder al Cliente</a>\r\n            </center>\r\n        </div>\r\n        \r\n        <div class=\"footer\">\r\n            <p>Panel de Administración {{company_name}}</p>\r\n            <p>Este email fue generado automáticamente por el sistema de cotizaciones</p>\r\n        </div>\r\n    </div>\r\n</body>\r\n</html>', 'Nueva Solicitud de Cotización - {{quote_number}}\r\n\r\nSolicitud recibida: {{date}}\r\n\r\nINFORMACIÓN DEL CLIENTE:\r\n- Nombre: {{customer_name}}\r\n- Email: {{customer_email}}\r\n{{#if customer_phone}}- Teléfono: {{customer_phone}}{{/if}}\r\n{{#if customer_company}}- Empresa: {{customer_company}}{{/if}}\r\n{{#if city_state}}- Ubicación: {{city_state}}{{/if}}\r\n- Método de contacto preferido: {{preferred_contact_method}}\r\n\r\nPRODUCTO SOLICITADO:\r\n{{#if brand}}- Marca: {{brand}}{{/if}}\r\n{{#if product_type}}- Tipo de Producto: {{product_type}}{{/if}}\r\n{{#if part_number}}- Número de Parte: {{part_number}}{{/if}}\r\n{{#if specifications}}- Especificaciones: {{specifications}}{{/if}}\r\n{{#if quantity}}- Cantidad: {{quantity}}{{/if}}\r\n{{#if customer_message}}- Mensaje: {{customer_message}}{{/if}}\r\n\r\nAccede al panel admin para gestionar esta cotización.\r\n\r\nSistema {{company_name}}', '[\"quote_number\", \"quote_id\", \"customer_name\", \"customer_email\", \"customer_phone\", \"customer_company\", \"city_state\", \"brand\", \"product_type\", \"part_number\", \"specifications\", \"quantity\", \"customer_message\", \"preferred_contact_method\", \"date\", \"company_name\", \"company_logo\", \"admin_url\"]', 1, '2026-02-03 22:35:07', '2026-02-03 22:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `manufacturers`
--

CREATE TABLE `manufacturers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category_id` int(11) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extra_images` text COLLATE utf8mb4_unicode_ci,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `manufacturers`
--

INSERT INTO `manufacturers` (`id`, `name`, `description`, `category_id`, `subcategory_id`, `main_image`, `extra_images`, `website`, `logo_url`, `is_active`, `created_at`, `updated_at`) VALUES
(10, 'SKF', '', 7, 1, '/data/industrial_catalogue/10/main_image/6976b0635cb3d_1769386083.png', NULL, '', NULL, 1, '2026-01-08 04:00:19', '2026-01-26 00:08:03'),
(11, 'NSK', '', 7, 1, '/data/industrial_catalogue/11/main_image/6976b04f706b0_1769386063.png', NULL, '', NULL, 1, '2026-01-08 16:11:58', '2026-01-26 00:07:43'),
(12, 'ABB', '', 8, NULL, '/data/industrial_catalogue/12/main_image/6976b03cb7ae4_1769386044.png', NULL, '', NULL, 1, '2026-01-08 16:38:47', '2026-01-26 00:07:24'),
(13, 'Baldor-Reliance', '', 13, 31, '/data/industrial_catalogue/13/main_image/6976b2fecfb33_1769386750.png', NULL, '', NULL, 1, '2026-01-08 16:39:03', '2026-01-26 00:19:11'),
(14, 'Siemens', '', 8, NULL, '/data/industrial_catalogue/14/main_image/6976b058f1e81_1769386072.jpg', NULL, '', NULL, 1, '2026-01-08 16:39:20', '2026-01-26 00:07:53'),
(15, 'WEG', '', 13, 31, '/data/industrial_catalogue/15/main_image/6976b3422e22c_1769386818.png', NULL, '', NULL, 1, '2026-01-08 16:39:50', '2026-01-26 00:20:18'),
(16, 'Timken', '', 13, 31, '/data/industrial_catalogue/16/main_image/6976b44532547_1769387077.png', NULL, '', NULL, 1, '2026-01-08 16:40:04', '2026-01-26 00:24:37');

-- --------------------------------------------------------

--
-- Table structure for table `models`
--

CREATE TABLE `models` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand_id` int(11) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `specifications` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `models`
--

INSERT INTO `models` (`id`, `name`, `brand_id`, `description`, `specifications`, `is_active`, `created_at`, `updated_at`) VALUES
(17, 'SKF-7205-BEGC-2RZP', 9, NULL, NULL, 1, '2026-01-08 04:04:57', '2026-01-08 04:04:57');

-- --------------------------------------------------------

--
-- Table structure for table `notification_settings`
--

CREATE TABLE `notification_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification_settings`
--

INSERT INTO `notification_settings` (`id`, `setting_key`, `setting_value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'enable_client_notifications', '1', 'Send confirmation emails to clients (1 = enabled, 0 = disabled)', '2026-02-03 22:35:07', '2026-02-03 22:35:07'),
(2, 'enable_admin_notifications', '1', 'Send notification emails to admins (1 = enabled, 0 = disabled)', '2026-02-03 22:35:07', '2026-02-03 22:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `long_description` text COLLATE utf8mb4_unicode_ci,
  `category_id` int(11) NOT NULL,
  `manufacturer_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `model_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'USD',
  `stock_quantity` int(11) DEFAULT '0',
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'unit',
  `manufacturer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specifications` json DEFAULT NULL,
  `images` json DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extra_images` text COLLATE utf8mb4_unicode_ci,
  `min_stock_level` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `sku`, `name`, `description`, `long_description`, `category_id`, `manufacturer_id`, `brand_id`, `model_id`, `price`, `currency`, `stock_quantity`, `unit`, `manufacturer`, `brand`, `model`, `specifications`, `images`, `is_featured`, `is_active`, `meta_title`, `meta_description`, `created_at`, `updated_at`, `main_image`, `extra_images`, `min_stock_level`) VALUES
(1, 'TOOL-001', 'Industrial Drill Press', 'Heavy-duty drill press for industrial applications', 'Professional grade drill press with variable speed control, 1HP motor, and precision depth adjustment. Ideal for metalworking and woodworking shops.', 1, NULL, NULL, NULL, 1299.99, 'USD', 15, 'unit', 'ProTech Industries', 'ProTech', 'DP-1000', NULL, NULL, 1, 0, NULL, NULL, '2025-11-20 00:53:28', '2025-12-09 04:33:07', NULL, NULL, 0),
(22, 'TRN-0140-1017', 'Rodamientos de Rodillos Esféricos', 'Rodamientos diseñados para soportar altas cargas radiales y axiales, con capacidad de autoalineación para compensar desalineaciones del eje y la carcasa, ideales para aplicaciones industriales de servicio pesado.', NULL, 7, 11, 10, NULL, 15.00, 'USD', 100, 'unit', NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, NULL, '2026-01-08 16:19:12', '2026-01-08 16:19:12', '/data/industrial_catalogue/temp_1767888369544_iom0dy8h1/main_image/695fd8ffb9052_1767889151.png', '[\"/data/industrial_catalogue/temp_1767888369544_iom0dy8h1/images/695fd8ffb96b9_1767889151.png\"]', 0),
(23, 'TRN-1745-2820', 'Soportes y rodamientos montados', 'Conjuntos de rodamientos montados en soportes, diseñados para facilitar la instalación y el alineamiento del eje, ofreciendo alta confiabilidad y resistencia en aplicaciones industriales.', NULL, 7, 10, 9, NULL, 25.00, 'USD', 100, 'unit', NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, NULL, '2026-01-08 16:27:16', '2026-01-08 16:27:16', '/data/industrial_catalogue/temp_1767888369544_iom0dy8h1/main_image/695fdae4a92eb_1767889636.png', NULL, 0),
(24, 'TRN-2009-3786', 'Motor Eléctrico Industrial', 'Motor eléctrico industrial diseñado para operación continua en aplicaciones de maquinaria y equipos industriales. Disponible en múltiples configuraciones de potencia, voltaje, velocidad y montaje, según requerimientos del cliente.', NULL, 13, 12, 11, NULL, 30.00, 'USD', 200, 'unit', NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, NULL, '2026-01-08 16:44:12', '2026-01-08 16:44:12', '/data/industrial_catalogue/temp_1767888369544_iom0dy8h1/main_image/695fdedc124e9_1767890652.png', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `id` int(11) NOT NULL,
  `quote_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_company` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_message` text COLLATE utf8mb4_unicode_ci,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `part_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specifications` text COLLATE utf8mb4_unicode_ci,
  `quantity` int(11) DEFAULT '1',
  `city_state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_contact_method` enum('email','phone','whatsapp') COLLATE utf8mb4_unicode_ci DEFAULT 'email',
  `brand_id` int(11) DEFAULT NULL,
  `manufacturer_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `status` enum('pending','processing','sent','accepted','rejected','expired') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `total_items` int(11) DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quote_items`
--

CREATE TABLE `quote_items` (
  `id` int(11) NOT NULL,
  `quote_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category_id` int(11) NOT NULL,
  `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extra_images` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`id`, `name`, `slug`, `description`, `category_id`, `main_image`, `extra_images`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Rodamientos', 'rodamientos', 'Rodamientos de bolas, rodillos y chumaceras para aplicaciones industriales', 7, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(2, 'Bandas y Poleas', 'bandas-y-poleas', 'Bandas en V, sincrónicas, planas y poleas de transmisión', 7, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(3, 'Cadenas y Sprockets', 'cadenas-y-sprockets', 'Cadenas de rodillos, cadenas de transmisión y sprockets industriales', 7, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(4, 'Acoplamientos', 'acoplamientos', 'Acoplamientos flexibles, rígidos y de engrane para transmisión de potencia', 7, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(5, 'Reductores de Velocidad', 'reductores-de-velocidad', 'Reductores de velocidad tipo corona, helicoidales y sin-fin', 7, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(6, 'Sensores Industriales', 'sensores-industriales', 'Sensores inductivos, capacitivos, fotoeléctricos y ultrasónicos', 8, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(7, 'Variadores de Frecuencia', 'variadores-de-frecuencia', 'Drives y variadores para control de velocidad de motores', 8, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(8, 'PLC y Controladores', 'plc-y-controladores', 'Controladores lógicos programables y sistemas de control', 8, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(9, 'HMI y Pantallas', 'hmi-y-pantallas', 'Interfaces hombre-máquina y pantallas táctiles industriales', 8, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(10, 'Válvulas Neumáticas', 'valvulas-neumaticas', 'Válvulas direccionales, reguladoras de presión y caudal', 9, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(11, 'Cilindros Neumáticos', 'cilindros-neumaticos', 'Cilindros de simple y doble efecto para automatización', 9, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(12, 'Mangueras y Conexiones', 'mangueras-y-conexiones', 'Mangueras hidráulicas, neumáticas y accesorios de conexión', 9, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(13, 'Bombas Hidráulicas', 'bombas-hidraulicas', 'Bombas de engranajes, pistones y paletas para sistemas hidráulicos', 9, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(14, 'Herramientas Manuales', 'herramientas-manuales', 'Llaves, desarmadores, pinzas y herramientas de mano', 10, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(15, 'Herramientas Eléctricas', 'herramientas-electricas', 'Taladros, esmeriles, pulidoras y equipos eléctricos portátiles', 10, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(16, 'Equipos de Medición', 'equipos-de-medicion', 'Multímetros, calibradores, termómetros y equipos de diagnóstico', 10, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(17, 'Equipos de Soldadura', 'equipos-de-soldadura', 'Equipos de soldadura eléctrica, MIG, TIG y accesorios', 10, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(18, 'Tornillería', 'tornilleria', 'Tornillos, tuercas, arandelas y elementos de fijación', 11, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(19, 'Lubricantes', 'lubricantes', 'Aceites, grasas y lubricantes industriales', 11, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(20, 'Adhesivos y Selladores', 'adhesivos-y-selladores', 'Pegamentos industriales, selladores y cintas adhesivas', 11, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(21, 'Abrasivos', 'abrasivos', 'Discos de corte, lijas, piedras de esmeril y abrasivos', 11, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(22, 'Protección Respiratoria', 'proteccion-respiratoria', 'Mascarillas, respiradores y equipos de protección respiratoria', 12, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(23, 'Protección Auditiva', 'proteccion-auditiva', 'Tapones, orejeras y protectores auditivos', 12, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(24, 'Protección Visual', 'proteccion-visual', 'Gafas de seguridad, caretas y protectores faciales', 12, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(25, 'Guantes de Seguridad', 'guantes-de-seguridad', 'Guantes industriales para protección contra riesgos mecánicos y químicos', 12, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(26, 'Motores Eléctricos', 'motores-electricos', 'Motores trifásicos, monofásicos y especiales para aplicaciones industriales', 13, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(27, 'Compresores', 'compresores', 'Compresores de aire de pistón, tornillo y equipos de compresión', 13, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(28, 'Bombas Industriales', 'bombas-industriales', 'Bombas centrífugas, sumergibles y de proceso industrial', 13, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(29, 'Mantenimiento Preventivo', 'mantenimiento-preventivo', 'Servicios programados de mantenimiento para equipos industriales', 14, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(30, 'Consultoría Técnica', 'consultoria-tecnica', 'Asesoría técnica especializada para proyectos industriales', 14, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07'),
(31, 'Proyectos Especiales', 'proyectos-especiales', 'Desarrollo e integración de soluciones industriales a medida', 14, NULL, NULL, 1, '2026-01-16 00:31:07', '2026-01-16 00:31:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_admin_notification` (`admin_id`,`notification_type`),
  ADD KEY `idx_admin_notification_type` (`admin_id`,`notification_type`);

--
-- Indexes for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_session_code` (`session_code`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_manufacturer` (`manufacturer_id`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `subcategory_id` (`subcategory_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_parent` (`parent_id`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_key` (`template_key`),
  ADD UNIQUE KEY `unique_template_key` (`template_key`),
  ADD KEY `idx_template_key` (`template_key`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `manufacturers`
--
ALTER TABLE `manufacturers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `subcategory_id` (`subcategory_id`);

--
-- Indexes for table `models`
--
ALTER TABLE `models`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_brand_model` (`brand_id`,`name`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_brand` (`brand_id`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `notification_settings`
--
ALTER TABLE `notification_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD UNIQUE KEY `unique_setting_key` (`setting_key`),
  ADD KEY `idx_setting_key` (`setting_key`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_sku` (`sku`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_featured` (`is_featured`),
  ADD KEY `idx_manufacturer_id` (`manufacturer_id`),
  ADD KEY `idx_brand_id` (`brand_id`),
  ADD KEY `idx_model_id` (`model_id`);
ALTER TABLE `products` ADD FULLTEXT KEY `idx_search` (`name`,`description`,`manufacturer`,`brand`,`model`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `quote_number` (`quote_number`),
  ADD KEY `idx_quote_number` (`quote_number`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_customer_email` (`customer_email`),
  ADD KEY `idx_created` (`created_at`),
  ADD KEY `idx_brand_id` (`brand_id`),
  ADD KEY `idx_manufacturer_id` (`manufacturer_id`),
  ADD KEY `idx_category_id` (`category_id`),
  ADD KEY `idx_subcategory_id` (`subcategory_id`);

--
-- Indexes for table `quote_items`
--
ALTER TABLE `quote_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_quote` (`quote_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `is_active` (`is_active`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `manufacturers`
--
ALTER TABLE `manufacturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `models`
--
ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `notification_settings`
--
ALTER TABLE `notification_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quote_items`
--
ALTER TABLE `quote_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD CONSTRAINT `fk_admin_notifications_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD CONSTRAINT `fk_admin_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `brands`
--
ALTER TABLE `brands`
  ADD CONSTRAINT `brands_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `brands_ibfk_1` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `brands_subcategory_fk` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `manufacturers`
--
ALTER TABLE `manufacturers`
  ADD CONSTRAINT `manufacturers_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `manufacturers_subcategory_fk` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `models`
--
ALTER TABLE `models`
  ADD CONSTRAINT `models_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_products_manufacturer` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_products_model` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `quote_items`
--
ALTER TABLE `quote_items`
  ADD CONSTRAINT `quote_items_ibfk_1` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quote_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
