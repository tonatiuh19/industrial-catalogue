-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 25, 2026 at 05:05 PM
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
  `notification_type` enum('quote_requests','general','system','contact_submissions','support_tickets') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'quote_requests',
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_notifications`
--

INSERT INTO `admin_notifications` (`id`, `admin_id`, `notification_type`, `is_enabled`, `created_at`, `updated_at`) VALUES
(1, 1, 'quote_requests', 1, '2026-02-03 22:35:07', '2026-02-20 20:00:32'),
(2, 3, 'quote_requests', 0, '2026-02-03 22:35:07', '2026-02-20 20:00:30'),
(3, 5, 'quote_requests', 0, '2026-02-03 22:35:07', '2026-02-03 22:53:41'),
(4, 6, 'quote_requests', 0, '2026-02-03 22:35:07', '2026-02-03 22:53:43'),
(5, 7, 'quote_requests', 0, '2026-02-03 22:35:07', '2026-02-03 22:53:39'),
(12, 1, 'contact_submissions', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59'),
(13, 3, 'contact_submissions', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59'),
(14, 5, 'contact_submissions', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59'),
(15, 6, 'contact_submissions', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59'),
(16, 7, 'contact_submissions', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59'),
(19, 1, 'support_tickets', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59'),
(20, 3, 'support_tickets', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59'),
(21, 5, 'support_tickets', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59'),
(22, 6, 'support_tickets', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59'),
(23, 7, 'support_tickets', 1, '2026-02-05 19:54:59', '2026-02-05 19:54:59');

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
(28, 3, 656652, 1, '2026-01-27 05:49:16', '2026-01-25 23:48:52'),
(29, 1, 730482, 0, '2026-02-03 20:52:51', '2026-02-03 22:42:51'),
(30, 1, 764910, 0, '2026-02-03 20:57:19', '2026-02-03 22:47:19'),
(31, 1, 323145, 0, '2026-02-03 20:58:49', '2026-02-03 22:48:48'),
(32, 1, 702229, 0, '2026-02-03 20:59:58', '2026-02-03 22:49:58'),
(33, 1, 819602, 1, '2026-02-04 20:51:22', '2026-02-03 22:51:10'),
(34, 1, 235230, 0, '2026-02-05 16:19:03', '2026-02-05 16:09:03'),
(35, 1, 696812, 1, '2026-02-06 14:09:46', '2026-02-05 16:09:36'),
(36, 1, 506901, 1, '2026-02-17 00:13:13', '2026-02-16 00:12:53'),
(37, 1, 106309, 1, '2026-02-17 06:40:31', '2026-02-16 00:40:19'),
(38, 1, 734098, 1, '2026-02-17 07:07:26', '2026-02-16 01:07:12'),
(39, 3, 683523, 1, '2026-02-17 07:48:15', '2026-02-16 01:48:05'),
(40, 3, 784750, 1, '2026-02-17 08:05:09', '2026-02-16 02:04:51'),
(41, 1, 551465, 1, '2026-02-21 02:41:36', '2026-02-20 02:41:24'),
(42, 3, 729435, 1, '2026-02-22 00:14:55', '2026-02-20 18:14:25'),
(43, 1, 386293, 1, '2026-02-21 19:33:18', '2026-02-20 19:33:02'),
(44, 1, 465944, 1, '2026-02-22 02:14:19', '2026-02-20 20:14:00'),
(45, 3, 237733, 1, '2026-02-22 02:18:20', '2026-02-20 20:17:51'),
(46, 1, 263457, 1, '2026-02-22 04:23:51', '2026-02-20 22:23:35'),
(47, 1, 564030, 1, '2026-02-26 21:48:35', '2026-02-25 21:48:22'),
(48, 1, 422890, 1, '2026-02-26 22:43:23', '2026-02-25 22:43:07');

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
(9, 'SKF', 10, 7, NULL, '', '/data/industrial_catalogue/9/main_image/6976aebdc793e_1769385661.png', NULL, NULL, 1, '2026-01-08 04:02:33', '2026-01-26 00:01:02'),
(10, 'NSK', 11, 7, NULL, '', '/data/industrial_catalogue/brand_10/main_image/699267b2ed61f_1771202482.png', NULL, NULL, 1, '2026-01-08 16:12:37', '2026-02-16 00:41:23'),
(11, 'ABB', 12, 8, NULL, '', '/data/industrial_catalogue/brand_11/main_image/69926844a3354_1771202628.png', NULL, NULL, 1, '2026-01-08 16:40:29', '2026-02-16 00:43:48'),
(12, 'WEG', 15, 7, NULL, '', '/data/industrial_catalogue/12/main_image/6976b0f292137_1769386226.png', NULL, NULL, 1, '2026-01-08 16:40:37', '2026-02-25 22:59:49'),
(13, 'Siemens', 14, 8, NULL, '', '/data/industrial_catalogue/brand_13/main_image/69926855e425d_1771202645.png', NULL, NULL, 1, '2026-01-08 16:40:48', '2026-02-16 00:44:06'),
(14, 'Baldor-Reliance', 13, 17, NULL, '', '/data/industrial_catalogue/14/main_image/6976b12738311_1769386279.png', NULL, NULL, 1, '2026-01-08 16:40:55', '2026-02-25 22:59:35'),
(15, 'Timken', 16, 9, NULL, '', '/data/industrial_catalogue/15/main_image/6976b4528ebd2_1769387090.png', NULL, NULL, 1, '2026-01-08 16:41:02', '2026-02-25 22:59:42'),
(17, '3M', 17, 17, NULL, 'Fabricante equipo de proteccion personal', '/data/industrial_catalogue/brand_temp_1771209569270_gphuefox0/main_image/6992837715b70_1771209591.jpg', NULL, NULL, 1, '2026-02-16 02:39:51', '2026-02-25 22:57:24');

-- --------------------------------------------------------

--
-- Table structure for table `brand_categories`
--

CREATE TABLE `brand_categories` (
  `brand_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brand_categories`
--

INSERT INTO `brand_categories` (`brand_id`, `category_id`, `created_at`) VALUES
(9, 7, '2026-02-25 22:54:34'),
(10, 7, '2026-02-25 22:54:34'),
(11, 8, '2026-02-25 22:54:34'),
(12, 7, '2026-02-25 22:59:49'),
(12, 8, '2026-02-25 22:59:49'),
(13, 8, '2026-02-25 22:54:34'),
(14, 17, '2026-02-25 22:59:35'),
(14, 18, '2026-02-25 22:59:35'),
(15, 9, '2026-02-25 22:59:42'),
(15, 10, '2026-02-25 22:59:42'),
(17, 7, '2026-02-25 22:57:24'),
(17, 8, '2026-02-25 22:57:24'),
(17, 17, '2026-02-25 22:57:24');

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
(1, 'Electronica', 'Professional industrial tools and equipment', '', NULL, NULL, NULL, 1, 0, '2025-11-20 00:53:28', '2026-02-25 22:55:57'),
(7, 'Rodamientos', '', 'rodamientos', '/data/industrial_catalogue/cat_7/main_image/699cd1ad9228a_1771884973.jpg', NULL, NULL, 0, 1, '2026-01-07 21:57:42', '2026-02-23 22:16:46'),
(8, 'Manejo de materiales', '', 'manejo-de-materiales', '/data/industrial_catalogue/cat_8/main_image/699e0b2bc7753_1771965227.jpg', NULL, NULL, 0, 1, '2026-01-07 21:58:37', '2026-02-24 20:33:49'),
(9, 'Hidráulica', '', 'hidr-ulica', '/data/industrial_catalogue/cat_9/main_image/699c9b325351e_1771871026.jpg', NULL, NULL, 0, 1, '2026-01-07 21:59:16', '2026-02-23 18:23:46'),
(10, 'Herramientas electricas', '', 'herramientas-electricas', '/data/industrial_catalogue/cat_10/main_image/699e57003483b_1771984640.jpg', NULL, NULL, 0, 1, '2026-01-07 22:00:03', '2026-02-25 01:57:20'),
(12, 'Seguridad Industrial (EPP)', '', 'seguridad-industrial', '/data/industrial_catalogue/cat_12/main_image/699e4f190d33e_1771982617.jpg', NULL, NULL, 0, 1, '2026-01-07 22:01:06', '2026-02-25 01:23:45'),
(14, 'Transmisión de potencia', '', 'transmisi-n-de-potencia', '/data/industrial_catalogue/cat_14/main_image/699cd98f5f6e8_1771886991.jpg', NULL, NULL, 0, 1, '2026-01-07 22:02:10', '2026-02-23 22:49:51'),
(17, 'Herramientas manuales', NULL, 'herramientas-manuales', '/data/industrial_catalogue/cat_temp_1771264430399_nmkcgysuc/main_image/69935a334b938_1771264563.jpg', NULL, NULL, 0, 1, '2026-02-16 17:56:03', '2026-02-16 17:56:03'),
(18, 'Neumática', NULL, 'neum-tica', '/data/industrial_catalogue/cat_temp_1771871402313_zh817cwlq/main_image/699c9cbe87d25_1771871422.jpg', NULL, NULL, 0, 1, '2026-02-23 18:30:22', '2026-02-23 18:30:22'),
(19, 'Guias lineales', NULL, 'guias-lineales', '/data/industrial_catalogue/cat_temp_1771889961040_gf32gvouw/main_image/699ce561cc2ae_1771890017.jpg', NULL, NULL, 0, 1, '2026-02-23 23:40:18', '2026-02-23 23:40:18'),
(20, 'Abrasivos', NULL, 'abrasivos', '/data/industrial_catalogue/cat_temp_1771890865786_s5jcb7h0p/main_image/699ce8bf1167e_1771890879.jpeg', NULL, NULL, 0, 1, '2026-02-23 23:54:39', '2026-02-23 23:54:39'),
(21, 'Adhesivos', NULL, 'adhesivos', '/data/industrial_catalogue/cat_temp_1771891696479_c83i4u4n1/main_image/699cec07f1942_1771891719.jpg', NULL, NULL, 0, 1, '2026-02-24 00:08:40', '2026-02-24 00:08:40');

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

CREATE TABLE `contact_submissions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('new','in_progress','resolved','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 'client_quote_confirmation', 'Client Quote Confirmation', 'Confirmación de Solicitud de Cotización - {{quote_number}}', '<!DOCTYPE html><html lang=\"es\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Confirmación de Cotización</title><style>body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }.header { background: linear-gradient(135deg, #2c5aa0 0%, #1a365d 100%); color: white; padding: 30px; text-align: center; }.header img { max-height: 50px; margin-bottom: 15px; }.content { padding: 30px; }.quote-box { background-color: #f8f9fa; border-left: 4px solid #c03818; padding: 20px; margin: 20px 0; }.product-details { background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }.footer { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; font-size: 14px; }.contact-info { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; }</style></head><body><div class=\"container\"><div class=\"header\"><img src=\"{{company_logo}}\" alt=\"{{company_name}}\"><h1>¡Gracias por tu solicitud!</h1><p>Tu cotización ha sido recibida exitosamente</p></div><div class=\"content\"><h2>Hola {{customer_name}},</h2><p>Hemos recibido tu solicitud de cotización y nuestro equipo la está revisando. Te responderemos dentro de las próximas horas.</p><div class=\"quote-box\"><h3>📋 Detalles de tu Solicitud</h3><p><strong>Número de Cotización:</strong> {{quote_number}}</p><p><strong>Fecha:</strong> {{date}}</p></div><div class=\"product-details\"><h3>🔧 Información del Producto</h3>{{#if brand}}<p><strong>Marca:</strong> {{brand}}</p>{{/if}}{{#if product_type}}<p><strong>Tipo de Producto:</strong> {{product_type}}</p>{{/if}}{{#if part_number}}<p><strong>Número de Parte:</strong> {{part_number}}</p>{{/if}}{{#if specifications}}<p><strong>Especificaciones:</strong> {{specifications}}</p>{{/if}}</div><div class=\"contact-info\"><p><strong>📞 Información de Contacto Registrada:</strong></p><p>Email: {{customer_email}}</p>{{#if customer_phone}}<p>Teléfono: {{customer_phone}}</p>{{/if}}{{#if customer_company}}<p>Empresa: {{customer_company}}</p>{{/if}}<p>Método de contacto preferido: {{preferred_contact_method}}</p></div><p>Un asesor de <strong>{{company_name}}</strong> se pondrá en contacto contigo a la brevedad para brindarte la información que necesitas.</p><p style=\"text-align: center; margin-top: 30px;\"><strong>Visita nuestro sitio web:</strong><br><a href=\"https://www.trenor.com.mx/\" style=\"color: #c03818; text-decoration: none;\">https://www.trenor.com.mx/</a></p></div><div class=\"footer\"><p>&copy; 2024 {{company_name}}. Todos los derechos reservados.</p><p>Herramientas profesionales, equipamiento Trenor y componentes de precisión</p></div></div></body></html>', 'Hola {{customer_name}},\n\nHemos recibido tu solicitud de cotización y nuestro equipo la está revisando.\n\nDetalles de tu Solicitud:\n- Número de Cotización: {{quote_number}}\n- Fecha: {{date}}\n\nInformación del Producto:\n{{#if brand}}- Marca: {{brand}}{{/if}}\n{{#if product_type}}- Tipo de Producto: {{product_type}}{{/if}}\n{{#if part_number}}- Número de Parte: {{part_number}}{{/if}}\n{{#if specifications}}- Especificaciones: {{specifications}}{{/if}}\n\nUn asesor de {{company_name}} se pondrá en contacto contigo a la brevedad.\n\nVisita nuestro sitio web: https://www.trenor.com.mx/\n\nSaludos,\nEquipo {{company_name}}', '[\"quote_number\", \"customer_name\", \"customer_email\", \"customer_phone\", \"customer_company\", \"brand\", \"product_type\", \"part_number\", \"specifications\", \"preferred_contact_method\", \"date\", \"company_name\", \"company_logo\", \"company_website\"]', 1, '2026-02-03 22:35:07', '2026-02-16 01:02:51'),
(2, 'admin_quote_notification', 'Admin Quote Notification', 'Nueva Solicitud de Cotización - {{quote_number}}', '<!DOCTYPE html><html lang=\"es\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Nueva Cotización</title><style>body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }.header { background: linear-gradient(135deg, #c03818 0%, #d94520 100%); color: white; padding: 30px; text-align: center; }.header img { max-height: 50px; margin-bottom: 15px; }.content { padding: 30px; }.alert-box { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0; }.client-info { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }.product-info { background-color: #e8f4fd; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 20px 0; }.footer { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; font-size: 14px; }.urgent { color: #c03818; font-weight: bold; }.contact-links { text-align: center; margin: 30px 0; }.contact-links a { color: #c03818; text-decoration: none; margin: 0 10px; font-weight: bold; }</style></head><body><div class=\"container\"><div class=\"header\"><img src=\"{{company_logo}}\" alt=\"{{company_name}} Admin\"><h1>🚨 Nueva Solicitud de Cotización</h1><p>Requiere atención inmediata</p></div><div class=\"content\"><div class=\"alert-box\"><p class=\"urgent\">⚡ Solicitud recibida: {{date}}</p><p><strong>Número de Cotización:</strong> {{quote_number}}</p></div><div class=\"client-info\"><h3>👤 Información del Cliente</h3><p><strong>Nombre:</strong> {{customer_name}}</p><p><strong>Email:</strong> {{customer_email}}</p>{{#if customer_phone}}<p><strong>Teléfono:</strong> {{customer_phone}}</p>{{/if}}{{#if customer_company}}<p><strong>Empresa:</strong> {{customer_company}}</p>{{/if}}{{#if city_state}}<p><strong>Ubicación:</strong> {{city_state}}</p>{{/if}}<p><strong>Método de contacto preferido:</strong> {{preferred_contact_method}}</p></div><div class=\"product-info\"><h3>🔧 Detalles del Producto Solicitado</h3>{{#if brand}}<p><strong>Marca:</strong> {{brand}}</p>{{/if}}{{#if product_type}}<p><strong>Tipo de Producto:</strong> {{product_type}}</p>{{/if}}{{#if part_number}}<p><strong>Número de Parte:</strong> {{part_number}}</p>{{/if}}{{#if specifications}}<p><strong>Especificaciones:</strong> {{specifications}}</p>{{/if}}{{#if quantity}}<p><strong>Cantidad:</strong> {{quantity}}</p>{{/if}}{{#if customer_message}}<p><strong>Mensaje adicional:</strong> {{customer_message}}</p>{{/if}}</div><p><strong>Siguiente paso:</strong> Contactar al cliente para proporcionar la cotización solicitada.</p></div><div class=\"footer\"><p>Panel de Administración {{company_name}}</p><p>Este email fue generado automáticamente por el sistema de cotizaciones Trenor</p></div></div></body></html>', 'Nueva Solicitud de Cotización - {{quote_number}}\n\nSolicitud recibida: {{date}}\n\nINFORMACIÓN DEL CLIENTE:\n- Nombre: {{customer_name}}\n- Email: {{customer_email}}\n{{#if customer_phone}}- Teléfono: {{customer_phone}}{{/if}}\n{{#if customer_company}}- Empresa: {{customer_company}}{{/if}}\n{{#if city_state}}- Ubicación: {{city_state}}{{/if}}\n- Método de contacto preferido: {{preferred_contact_method}}\n\nPRODUCTO SOLICITADO:\n{{#if brand}}- Marca: {{brand}}{{/if}}\n{{#if product_type}}- Tipo de Producto: {{product_type}}{{/if}}\n{{#if part_number}}- Número de Parte: {{part_number}}{{/if}}\n{{#if specifications}}- Especificaciones: {{specifications}}{{/if}}\n{{#if quantity}}- Cantidad: {{quantity}}{{/if}}\n{{#if customer_message}}- Mensaje: {{customer_message}}{{/if}}\n\nAccede al panel admin para gestionar esta cotización.\nPanel: {{admin_url}}/quotes/{{quote_id}}\n\nSistema {{company_name}}', '[\"quote_number\", \"quote_id\", \"customer_name\", \"customer_email\", \"customer_phone\", \"customer_company\", \"city_state\", \"brand\", \"product_type\", \"part_number\", \"specifications\", \"quantity\", \"customer_message\", \"preferred_contact_method\", \"date\", \"company_name\", \"company_logo\", \"admin_url\"]', 1, '2026-02-03 22:35:07', '2026-02-16 01:08:38'),
(3, 'quote_status_update', 'Quote Status Update Notification', 'Actualización de Cotización {{quote_number}} - {{new_status}}', '<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Actualización de Cotización</title>\n  <style>\n    body { \n      font-family: Arial, sans-serif; \n      line-height: 1.6; \n      color: #333; \n      background-color: #f4f4f4; \n      margin: 0; \n      padding: 0; \n    }\n    .container { \n      max-width: 600px; \n      margin: 0 auto; \n      background-color: #ffffff; \n    }\n    .header { \n      background: linear-gradient(135deg, #2c5aa0 0%, #1a365d 100%); \n      color: white; \n      padding: 30px; \n      text-align: center; \n    }\n    .header img { \n      max-height: 50px; \n      margin-bottom: 15px; \n    }\n    .content { \n      padding: 30px; \n    }\n    .status-update { \n      background-color: #e8f4fd; \n      border: 2px solid #2c5aa0; \n      border-radius: 8px; \n      padding: 20px; \n      margin: 20px 0; \n      text-align: center;\n    }\n    .status-badge { \n      display: inline-block; \n      padding: 8px 16px; \n      border-radius: 20px; \n      font-weight: bold; \n      text-transform: uppercase; \n      margin: 5px;\n    }\n    .status-pending { background-color: #fff3cd; color: #856404; }\n    .status-processing { background-color: #d1ecf1; color: #0c5460; }\n    .status-sent { background-color: #d1ecf1; color: #0c5460; }\n    .status-accepted { background-color: #d4edda; color: #155724; }\n    .status-rejected { background-color: #f8d7da; color: #721c24; }\n    .status-expired { background-color: #e2e3e5; color: #383d41; }\n    .quote-details { \n      background-color: #f8f9fa; \n      border: 1px solid #e9ecef; \n      border-radius: 8px; \n      padding: 20px; \n      margin: 20px 0; \n    }\n    .footer { \n      background-color: #2c5aa0; \n      color: white; \n      padding: 20px; \n      text-align: center; \n      font-size: 14px; \n    }\n    .notes-box {\n      background-color: #fff3cd;\n      border: 1px solid #ffeaa7;\n      border-radius: 8px;\n      padding: 15px;\n      margin: 20px 0;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"header\">\n      <img src=\"{{company_logo}}\" alt=\"{{company_name}}\">\n      <h1>Actualización de tu Cotización</h1>\n      <p>Estado actualizado para {{quote_number}}</p>\n    </div>\n    \n    <div class=\"content\">\n      <h2>Hola {{customer_name}},</h2>\n      <p>Te informamos que el estado de tu cotización ha sido actualizado.</p>\n      \n      <div class=\"status-update\">\n        <h3>🔄 Cambio de Estado</h3>\n        <p>Estado anterior: <span class=\"status-badge status-{{old_status}}\">{{old_status}}</span></p>\n        <p>Estado actual: <span class=\"status-badge status-{{new_status}}\">{{new_status}}</span></p>\n        <p><strong>{{status_message}}</strong></p>\n      </div>\n\n      <div class=\"quote-details\">\n        <h3>📋 Detalles de tu Cotización</h3>\n        <p><strong>Número de Cotización:</strong> {{quote_number}}</p>\n        <p><strong>Fecha de actualización:</strong> {{date}}</p>\n        {{#if brand}}<p><strong>Marca solicitada:</strong> {{brand}}</p>{{/if}}\n        {{#if product_type}}<p><strong>Tipo de producto:</strong> {{product_type}}</p>{{/if}}\n        {{#if part_number}}<p><strong>Número de parte:</strong> {{part_number}}</p>{{/if}}\n      </div>\n\n      {{#if admin_notes}}\n      <div class=\"notes-box\">\n        <h4>💬 Notas del Equipo</h4>\n        <p>{{admin_notes}}</p>\n      </div>\n      {{/if}}\n\n      <p>Si tienes alguna pregunta sobre esta actualización, no dudes en contactarnos.</p>\n    </div>\n    \n    <div class=\"footer\">\n      <p>&copy; 2026 {{company_name}}. Todos los derechos reservados.</p>\n      <p>Sistema automatizado de gestión de cotizaciones</p>\n    </div>\n  </div>\n</body>\n</html>', 'Actualización de Cotización - {{quote_number}}\n\nHola {{customer_name}},\n\nTe informamos que el estado de tu cotización ha sido actualizado:\n\nEstado anterior: {{old_status}}\nEstado actual: {{new_status}}\n\n{{status_message}}\n\nDetalles de tu cotización:\n- Número: {{quote_number}}\n- Fecha de actualización: {{date}}\n{{#if brand}}- Marca: {{brand}}{{/if}}\n{{#if product_type}}- Tipo de producto: {{product_type}}{{/if}}\n{{#if part_number}}- Número de parte: {{part_number}}{{/if}}\n\n{{#if admin_notes}}\nNotas del equipo: {{admin_notes}}\n{{/if}}\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nVisita: {{company_website}}\n\nSaludos,\nEquipo {{company_name}}', '[\"quote_number\", \"customer_name\", \"old_status\", \"new_status\", \"status_message\", \"brand\", \"product_type\", \"part_number\", \"admin_notes\", \"date\", \"company_name\", \"company_logo\", \"company_website\"]', 1, '2026-02-20 20:02:21', '2026-02-20 20:08:53');

-- --------------------------------------------------------

--
-- Table structure for table `faq_categories`
--

CREATE TABLE `faq_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faq_categories`
--

INSERT INTO `faq_categories` (`id`, `name`, `slug`, `description`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Preguntas Generales', 'general', 'Información general sobre Grupo Trenor y nuestros servicios', 1, 1, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(2, 'Productos y Servicios', 'productos', 'Preguntas sobre nuestro catálogo de refacciones y componentes industriales', 2, 1, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(3, 'Cotizaciones y Pedidos', 'pedidos-cotizaciones', 'Información sobre cómo solicitar cotizaciones y realizar pedidos', 3, 1, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(4, 'Soporte Técnico', 'soporte-tecnico', 'Asesoría técnica y resolución de problemas', 4, 1, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(5, 'Entrega y Logística', 'entrega-logistica', 'Preguntas sobre tiempos de entrega y logística', 5, 1, '2026-02-15 23:42:05', '2026-02-15 23:42:05');

-- --------------------------------------------------------

--
-- Table structure for table `faq_items`
--

CREATE TABLE `faq_items` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `question` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faq_items`
--

INSERT INTO `faq_items` (`id`, `category_id`, `question`, `answer`, `sort_order`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, '¿Qué tipo de productos ofrece Trenor?', 'Ofrecemos refacciones, componentes, equipos y soluciones industriales para mantenimiento, producción y operación industrial (MRO). Nos especializamos en la industria manufacturera, automotriz y de mantenimiento.', 1, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(2, 1, '¿Trenor fabrica sus propios productos?', 'No. Trenor es una empresa comercializadora e integradora de soluciones industriales que trabaja con marcas y fabricantes reconocidos a nivel nacional e internacional.', 2, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(3, 1, '¿En qué sectores industriales trabajan?', 'Atendemos principalmente a la industria manufacturera, automotriz y de mantenimiento industrial (MRO), ofreciendo productos y soluciones adaptadas a cada necesidad específica.', 3, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(4, 1, '¿Cuál es el objetivo de Trenor?', 'Trenor nace con el objetivo de convertirse en un aliado estratégico para la industria, ofreciendo soluciones integrales en refacciones, componentes y suministro industrial con un enfoque orientado a la continuidad operativa.', 4, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(5, 2, '¿Qué marcas y proveedores manejan?', 'Trabajamos con proveedores y marcas líderes a nivel nacional e internacional para ofrecer productos de alta calidad respaldados por fabricantes reconocidos en la industria.', 1, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(6, 2, '¿Ofrecen asesoría técnica?', 'Sí, contamos con experiencia en el sector industrial y un enfoque orientado a la atención técnica y comercial. Nuestro equipo brinda asesoría especializada para ayudar a mantener la continuidad operativa de los procesos productivos.', 2, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(7, 2, '¿Qué tipo de soluciones industriales ofrecen?', 'Ofrecemos soluciones integrales que incluyen refacciones, componentes especializados, equipos industriales y servicios de mantenimiento (MRO) adaptados a las necesidades específicas de cada cliente.', 3, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(8, 2, '¿Cómo aseguran la calidad de sus productos?', 'Trabajamos únicamente con fabricantes y marcas reconocidas, y nuestro equipo técnico valida cada producto para garantizar que cumpla con los estándares requeridos para la aplicación industrial específica.', 4, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(9, 3, '¿Realizan cotizaciones personalizadas?', 'Sí. Todas nuestras cotizaciones se elaboran de acuerdo con los requerimientos específicos del cliente, considerando las necesidades técnicas y operativas particulares de cada proyecto.', 1, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(10, 3, '¿Atienden proyectos especiales?', 'Sí, apoyamos proyectos especiales y requerimientos técnicos bajo solicitud. Nuestro enfoque práctico nos permite adaptarnos a necesidades específicas de la industria.', 2, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(11, 3, '¿Cómo puedo solicitar una cotización?', 'Puedes contactarnos a través de nuestro formulario en línea, por correo electrónico a ventas@grupotrenor.com, o llamando al 477 599 0905. Proporciónanos los detalles específicos de tu requerimiento.', 3, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(12, 3, '¿Qué información necesito para solicitar una cotización?', 'Para brindar una cotización precisa, necesitamos conocer las especificaciones técnicas del producto, cantidades requeridas, aplicación específica y tiempos de entrega necesarios.', 4, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(13, 4, '¿Cómo puedo obtener asesoría técnica?', 'Nuestro equipo técnico está disponible para brindar asesoría especializada. Puedes contactarnos por teléfono al 477 599 0905 o por correo electrónico para recibir soporte técnico personalizado.', 1, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(14, 4, '¿Qué tipo de soporte técnico ofrecen?', 'Ofrecemos asesoría en selección de productos, compatibilidad de componentes, especificaciones técnicas y recomendaciones para optimizar el mantenimiento y operación de equipos industriales.', 2, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(15, 4, '¿Ayudan con la selección de productos?', 'Sí, nuestro equipo técnico te ayuda a seleccionar los productos más adecuados para tu aplicación específica, considerando factores como compatibilidad, rendimiento y costo-beneficio.', 3, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(16, 4, '¿Ofrecen capacitación técnica?', 'Proporcionamos orientación técnica y recomendaciones sobre el uso adecuado de nuestros productos. También coordinamos con fabricantes cuando se requiere capacitación especializada.', 4, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(17, 5, '¿Cuál es el tiempo de entrega?', 'El tiempo de entrega depende del producto y disponibilidad en inventario. Se confirma el tiempo específico en cada cotización, siempre buscando cumplir con los plazos operativos del cliente.', 1, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(18, 5, '¿Realizan entregas en toda la República Mexicana?', 'Sí, atendemos clientes en todo México. Los costos y tiempos de envío se calculan según la ubicación de destino y el tipo de producto.', 2, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(19, 5, '¿Cómo rastreo mi pedido?', 'Una vez confirmado tu pedido, te proporcionamos información de seguimiento para que puedas monitorear el estado de tu entrega hasta su llegada a destino.', 3, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05'),
(20, 5, '¿Manejan entregas urgentes?', 'Sí, entendemos las necesidades operativas de la industria y trabajamos para atender requerimientos urgentes cuando la disponibilidad del producto lo permite.', 4, 1, NULL, '2026-02-15 23:42:05', '2026-02-15 23:42:05');

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
(10, 'SKF', '', 7, NULL, '/data/industrial_catalogue/mfg_10/main_image/699268854069e_1771202693.png', NULL, '', NULL, 1, '2026-01-08 04:00:19', '2026-02-16 00:44:53'),
(11, 'NSK', '', 7, NULL, '/data/industrial_catalogue/11/main_image/6976b04f706b0_1769386063.png', NULL, '', NULL, 1, '2026-01-08 16:11:58', '2026-01-26 00:07:43'),
(12, 'ABB', '', 8, NULL, '/data/industrial_catalogue/mfg_12/main_image/69926866c4985_1771202662.png', NULL, '', NULL, 1, '2026-01-08 16:38:47', '2026-02-16 00:44:22'),
(13, 'Baldor-Reliance', '', NULL, NULL, '/data/industrial_catalogue/13/main_image/6976b2fecfb33_1769386750.png', NULL, '', NULL, 1, '2026-01-08 16:39:03', '2026-01-26 00:19:11'),
(14, 'Siemens', '', 8, NULL, '/data/industrial_catalogue/mfg_14/main_image/69926873ec5bd_1771202675.png', NULL, '', NULL, 1, '2026-01-08 16:39:20', '2026-02-16 00:44:36'),
(15, 'WEG', '', NULL, NULL, '/data/industrial_catalogue/mfg_15/main_image/699266e071827_1771202272.png', NULL, '', NULL, 1, '2026-01-08 16:39:50', '2026-02-16 00:37:52'),
(16, 'Timken', '', NULL, NULL, '/data/industrial_catalogue/16/main_image/6976b44532547_1769387077.png', NULL, '', NULL, 1, '2026-01-08 16:40:04', '2026-01-26 00:24:37'),
(17, '3M', 'Fabricante equipo de porteccion personal', NULL, NULL, '/data/industrial_catalogue/mfg_temp_1771209539278_mnm2sk1gc/main_image/6992835b04a58_1771209563.jpg', NULL, NULL, NULL, 1, '2026-02-16 02:39:23', '2026-02-16 02:39:23');

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
(1, 'TOOL-001', 'Industrial Drill Press', 'Heavy-duty drill press for industrial applications', 'Professional grade drill press with variable speed control, 1HP motor, and precision depth adjustment. Ideal for metalworking and woodworking shops.', 1, NULL, NULL, NULL, 1299.99, 'USD', 15, 'unit', 'ProTech Industries', 'ProTech', 'DP-1000', NULL, NULL, 1, 0, NULL, NULL, '2025-11-20 00:53:28', '2025-12-09 04:33:07', NULL, NULL, 0);

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

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`id`, `quote_number`, `customer_name`, `customer_email`, `customer_phone`, `customer_company`, `customer_message`, `brand`, `product_type`, `part_number`, `specifications`, `quantity`, `city_state`, `preferred_contact_method`, `brand_id`, `manufacturer_id`, `category_id`, `subcategory_id`, `status`, `total_items`, `notes`, `created_at`, `updated_at`) VALUES
(5, 'Q-1771206431169-120', 'Bryan', 'ing.bryanpadilla@gmail.com', '4747299634', 'Stl', NULL, 'ABB', 'Motor electrico', 'S2R', NULL, 1, 'Leon', 'whatsapp', 11, NULL, 8, NULL, 'pending', 0, NULL, '2026-02-16 01:47:11', '2026-02-16 01:47:11'),
(6, 'Q-1771611813566-953', 'Bryan Padillq', 'bryan.chelo.bp@gmail.com', '4747299634', 'Trenor', NULL, '3M', 'Lentes', NULL, NULL, 1, 'León', 'phone', 17, NULL, 12, NULL, 'pending', 0, NULL, '2026-02-20 18:23:33', '2026-02-20 18:23:33');

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
(2, 'Bandas', 'bandas', 'Bandas en V, sincrónicas, planas', 14, '/data/industrial_catalogue/sub_2/main_image/699cdfe51181a_1771888613.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-23 23:17:06'),
(3, 'Cadenas y Sprockets', 'cadenas-y-sprockets', 'Cadenas de rodillos, cadenas de transmisión y sprockets industriales', 14, '/data/industrial_catalogue/sub_3/main_image/699cdd84b15e9_1771888004.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-23 23:07:32'),
(4, 'Acoplamientos', 'acoplamientos', 'Acoplamientos flexibles, rígidos y de engrane para transmisión de potencia', 14, '/data/industrial_catalogue/sub_4/main_image/699cdca9637e8_1771887785.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-23 23:07:19'),
(5, 'Reductores de Velocidad', 'reductores-de-velocidad', 'Reductores de velocidad tipo corona, helicoidales y sin-fin', 14, '/data/industrial_catalogue/sub_5/main_image/699ce13c9b203_1771888956.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-23 23:22:36'),
(6, 'Diablito de carga', 'diablito-de-carga', '', 8, '/data/industrial_catalogue/sub_6/main_image/699e0dedbe66f_1771965933.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-24 20:45:34'),
(7, 'Plataforma de acero para tambos', 'plataforma-de-acero-para-tambos', '', 8, '/data/industrial_catalogue/sub_7/main_image/699e0eab5fc86_1771966123.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-24 20:48:43'),
(8, 'Transpalletas', 'transpalletas', '', 8, '/data/industrial_catalogue/sub_8/main_image/699e0bb5935cc_1771965365.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-24 20:36:05'),
(9, 'Mesas de elevacion', 'mesas-de-elevacion', '', 8, '/data/industrial_catalogue/sub_9/main_image/699e0d43028e1_1771965763.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-24 20:42:43'),
(10, 'Válvulas Neumáticas', 'valvulas-neumaticas', 'Válvulas direccionales, reguladoras de presión y caudal', 18, '/data/industrial_catalogue/sub_10/main_image/699cae91c640c_1771875985.jpg', '[\"/data/industrial_catalogue/sub_10/images/699cae6f751f2_1771875951.jpg\",\"/data/industrial_catalogue/sub_10/images/699cae6f75482_1771875951.jpg\"]', 1, '2026-01-16 00:31:07', '2026-02-23 19:46:25'),
(11, 'Cilindros Hidraulicos', 'cilindros-hidraulicos', '', 9, '/data/industrial_catalogue/sub_11/main_image/699cb30f7bd9a_1771877135.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-23 20:05:36'),
(12, 'Mangueras y Conexiones', 'mangueras-y-conexiones', 'Mangueras hidráulicas, neumáticas y accesorios de conexión', 9, '/data/industrial_catalogue/sub_12/main_image/699cb412c6195_1771877394.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-23 20:09:55'),
(13, 'Bombas Hidráulicas', 'bombas-hidraulicas', '', 9, '/data/industrial_catalogue/sub_13/main_image/699cb19b2c1c9_1771876763.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-23 19:59:23'),
(20, 'Cinta adhesiva', 'cinta-adhesiva', '', 21, '/data/industrial_catalogue/sub_20/main_image/69935133781f6_1771262259.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-24 19:50:10'),
(21, 'Cepillos abrasivos', 'cepillos-abrasivos', '', 20, '/data/industrial_catalogue/sub_21/main_image/699ceafe291a8_1771891454.jpg', '[\"/data/industrial_catalogue/21/images/6983a3e542a0a_1770234853.jpeg\"]', 1, '2026-01-16 00:31:07', '2026-02-24 00:04:14'),
(22, 'Protección Respiratoria', 'proteccion-respiratoria', 'Mascarillas, respiradores y equipos de protección respiratoria', 12, '/data/industrial_catalogue/sub_22/main_image/699e52fc403fb_1771983612.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-25 01:40:12'),
(23, 'Protección Auditiva', 'proteccion-auditiva', 'Tapones, orejeras y protectores auditivos', 12, '/data/industrial_catalogue/sub_23/main_image/699e511fb237a_1771983135.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-25 01:32:15'),
(24, 'Protección Visual', 'proteccion-visual', 'Gafas de seguridad, caretas y protectores faciales', 12, '/data/industrial_catalogue/sub_24/main_image/699e520b25a4d_1771983371.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-25 01:36:11'),
(25, 'Guantes de Seguridad', 'guantes-de-seguridad', 'Guantes industriales para protección contra riesgos mecánicos y químicos', 12, '/data/industrial_catalogue/sub_25/main_image/699e50b13b5e4_1771983025.jpg', NULL, 1, '2026-01-16 00:31:07', '2026-02-25 01:30:25'),
(32, 'Compresores de aire y bombas de vacío', 'compresores-de-aire-y-bombas-de-vac-o', '', 18, '/data/industrial_catalogue/sub_temp_1771871819281_oas7l8cvi/main_image/699c9e866ea84_1771871878.png', NULL, 1, '2026-02-23 18:37:58', '2026-02-23 19:02:35'),
(33, 'Cilindros de aire y actuadores rotativos', 'cilindros-de-aire-y-actuadores-rotativos', '', 18, '/data/industrial_catalogue/sub_33/main_image/699ca06bd46ee_1771872363.jpg', NULL, 1, '2026-02-23 18:44:07', '2026-02-23 18:46:04'),
(34, 'Motor de aire', 'motor-de-aire', NULL, 18, '/data/industrial_catalogue/sub_temp_1771872704518_uixvudd9k/main_image/699ca1e549403_1771872741.jpg', NULL, 1, '2026-02-23 18:52:21', '2026-02-23 18:52:21'),
(35, 'Instrumentación neumática', 'instrumentaci-n-neum-tica', NULL, 18, '/data/industrial_catalogue/sub_temp_1771872957741_7xezd02pa/main_image/699ca3256ec2f_1771873061.jpg', NULL, 1, '2026-02-23 18:57:42', '2026-02-23 18:57:42'),
(36, 'Mangueras Neumáticas', 'mangueras-neum-ticas', NULL, 18, '/data/industrial_catalogue/sub_temp_1771873582540_m3fm07f3w/main_image/699ca54d54424_1771873613.jpg', NULL, 1, '2026-02-23 19:06:53', '2026-02-23 19:06:53'),
(37, 'Herramientas neumáticas', 'herramientas-neum-ticas', NULL, 18, '/data/industrial_catalogue/sub_temp_1771874031845_y2qgfy2r5/main_image/699ca749f1b85_1771874121.jpg', NULL, 1, '2026-02-23 19:15:22', '2026-02-23 19:15:22'),
(38, 'Válvulas neumáticas de control de aire', 'v-lvulas-neum-ticas-de-control-de-aire', '', 18, '/data/industrial_catalogue/sub_38/main_image/699caeeea8e48_1771876078.jpg', NULL, 1, '2026-02-23 19:23:59', '2026-02-23 19:47:58'),
(39, 'Reguladores de vacío', 'reguladores-de-vac-o', NULL, 18, '/data/industrial_catalogue/sub_temp_1771875323639_0r3fw6sdw/main_image/699cac1a1c99f_1771875354.jpg', NULL, 1, '2026-02-23 19:35:54', '2026-02-23 19:35:54'),
(40, 'Valvulas hidraulicas', 'valvulas-hidraulicas', NULL, 9, '/data/industrial_catalogue/sub_temp_1771877670479_e816tnjvj/main_image/699cb54246cb0_1771877698.jpg', NULL, 1, '2026-02-23 20:14:58', '2026-02-23 20:14:58'),
(41, 'Rodamiento de bola', 'rodamiento-de-bola', NULL, 7, '/data/industrial_catalogue/sub_temp_1771885179924_wutzs086i/main_image/699cd2ac19300_1771885228.jpg', NULL, 1, '2026-02-23 22:20:28', '2026-02-23 22:20:28'),
(42, 'Rodamientos de Rodillos', 'rodamientos-de-rodillos', NULL, 7, '/data/industrial_catalogue/sub_temp_1771885335845_8hp4nm2w7/main_image/699cd3409ae1e_1771885376.jpg', NULL, 1, '2026-02-23 22:22:56', '2026-02-23 22:22:56'),
(43, 'Chumaceras', 'chumaceras', NULL, 7, '/data/industrial_catalogue/sub_temp_1771885478688_q5gd0tijl/main_image/699cd3b7a18c7_1771885495.jpg', NULL, 1, '2026-02-23 22:24:55', '2026-02-23 22:24:55'),
(44, 'Rodamientos axiales', 'rodamientos-axiales', NULL, 7, '/data/industrial_catalogue/sub_temp_1771885621736_uob8fjh7z/main_image/699cd449e3fd6_1771885641.jpg', NULL, 1, '2026-02-23 22:27:22', '2026-02-23 22:27:22'),
(45, 'Cojinetes', 'cojinetes', '', 7, '/data/industrial_catalogue/sub_45/main_image/699cd92092343_1771886880.jpg', NULL, 1, '2026-02-23 22:31:49', '2026-02-23 22:48:00'),
(46, 'Anillos', 'anillos', NULL, 7, '/data/industrial_catalogue/sub_temp_1771886055786_j3o2vn11j/main_image/699cd7288820c_1771886376.jpg', NULL, 1, '2026-02-23 22:39:37', '2026-02-23 22:39:37'),
(47, 'Rodamientos lisos', 'rodamientos-lisos', NULL, 7, '/data/industrial_catalogue/sub_temp_1771886529329_c66ly90re/main_image/699cd7d356c1b_1771886547.jpg', NULL, 1, '2026-02-23 22:42:27', '2026-02-23 22:42:27'),
(48, 'Inserto de rodamiento', 'inserto-de-rodamiento', NULL, 7, '/data/industrial_catalogue/sub_temp_1771886700343_h5jrzgmgq/main_image/699cd883c0f13_1771886723.jpg', NULL, 1, '2026-02-23 22:45:24', '2026-02-23 22:45:24'),
(49, 'Poleas', 'poleas', NULL, 14, '/data/industrial_catalogue/sub_temp_1771888741493_n3wcg32gs/main_image/699ce0763749f_1771888758.jpg', NULL, 1, '2026-02-23 23:19:18', '2026-02-23 23:19:18'),
(51, 'Motorreductores', 'motorreductores', NULL, 14, '/data/industrial_catalogue/sub_temp_1771889192855_ho7lai1rl/main_image/699ce2396f3b7_1771889209.jpg', NULL, 1, '2026-02-23 23:26:49', '2026-02-23 23:26:49'),
(52, 'Juntas universales', 'juntas-universales', NULL, 14, '/data/industrial_catalogue/sub_temp_1771889459125_unpn194wg/main_image/699ce344b25f5_1771889476.jpg', NULL, 1, '2026-02-23 23:31:16', '2026-02-23 23:31:16'),
(53, 'Clutches y frenos', 'clutches-y-frenos', NULL, 14, '/data/industrial_catalogue/sub_temp_1771889743176_sizef3afu/main_image/699ce470651dd_1771889776.jpg', NULL, 1, '2026-02-23 23:36:16', '2026-02-23 23:36:16'),
(54, 'Bola de tornillo', 'bola-de-tornillo', NULL, 19, '/data/industrial_catalogue/sub_temp_1771890118409_8g940p4lv/main_image/699ce5ec95c47_1771890156.jpg', NULL, 1, '2026-02-23 23:42:36', '2026-02-23 23:42:36'),
(55, 'Guias de bolas', 'guias-de-bolas', NULL, 19, '/data/industrial_catalogue/sub_temp_1771890256010_mali90i3m/main_image/699ce668278ff_1771890280.jpg', NULL, 1, '2026-02-23 23:44:40', '2026-02-23 23:44:40'),
(56, 'Ruedas lijadoras', 'ruedas-lijadoras', NULL, 20, '/data/industrial_catalogue/sub_temp_1771891063050_lekbtyaq4/main_image/699ce989f0e08_1771891081.jpg', NULL, 1, '2026-02-23 23:58:02', '2026-02-23 23:58:02'),
(57, 'Discos de lijado', 'discos-de-lijado', NULL, 20, '/data/industrial_catalogue/sub_temp_1771891239683_2i4a0whjl/main_image/699cea3e73e5a_1771891262.jpg', NULL, 1, '2026-02-24 00:01:02', '2026-02-24 00:01:02'),
(58, 'Puntas abrasivas', 'puntas-abrasivas', NULL, 20, '/data/industrial_catalogue/sub_temp_1771891562579_uqrmynuak/main_image/699ceb7a86e67_1771891578.jpg', NULL, 1, '2026-02-24 00:06:18', '2026-02-24 00:06:18'),
(59, 'Cinta doble cara', 'cinta-doble-cara', NULL, 21, '/data/industrial_catalogue/sub_temp_1771962492555_xnorp6wm2/main_image/699e0093d92f2_1771962515.jpg', NULL, 1, '2026-02-24 19:48:36', '2026-02-24 19:48:36'),
(60, 'Cinta de empaque', 'cinta-de-empaque', NULL, 21, '/data/industrial_catalogue/sub_temp_1771962807630_8rki46bpy/main_image/699e01d7f0c03_1771962839.jpg', NULL, 1, '2026-02-24 19:54:00', '2026-02-24 19:54:00'),
(61, 'Cinta de espuma', 'cinta-de-espuma', NULL, 21, '/data/industrial_catalogue/sub_temp_1771962963790_yrirct6xh/main_image/699e026a769f7_1771962986.jpg', NULL, 1, '2026-02-24 19:56:26', '2026-02-24 19:56:26'),
(62, 'Cinta de tela', 'cinta-de-tela', NULL, 21, '/data/industrial_catalogue/sub_temp_1771963170283_nh72jqko3/main_image/699e033100d19_1771963185.jpg', NULL, 1, '2026-02-24 19:59:45', '2026-02-24 19:59:45'),
(63, 'Cinta eléctrica', 'cinta-el-ctrica', NULL, 21, '/data/industrial_catalogue/sub_temp_1771963299705_4jqocz346/main_image/699e03eab5c8d_1771963370.jpg', NULL, 1, '2026-02-24 20:02:50', '2026-02-24 20:02:50'),
(64, 'Cinta eléctrica conductiva', 'cinta-el-ctrica-conductiva', NULL, 21, '/data/industrial_catalogue/sub_temp_1771963486226_zzpun4wqr/main_image/699e04744058f_1771963508.jpg', NULL, 1, '2026-02-24 20:05:08', '2026-02-24 20:05:08'),
(65, 'Cinta para ductos', 'cinta-para-ductos', NULL, 21, '/data/industrial_catalogue/sub_temp_1771964217039_dgtyj7xnv/main_image/699e07584ceab_1771964248.jpg', NULL, 1, '2026-02-24 20:17:29', '2026-02-24 20:17:29'),
(66, 'Carritos con plataforma', 'carritos-con-plataforma', NULL, 8, '/data/industrial_catalogue/sub_temp_1771965467739_6yst20849/main_image/699e0c339c5f2_1771965491.jpg', NULL, 1, '2026-02-24 20:38:11', '2026-02-24 20:38:11'),
(67, 'Polipastos', 'polipastos', NULL, 8, '/data/industrial_catalogue/sub_temp_1771966362720_l6t3nds6d/main_image/699e0fa92f4b5_1771966377.jpg', NULL, 1, '2026-02-24 20:52:57', '2026-02-24 20:52:57'),
(68, 'Protección para la cabeza', 'protecci-n-para-la-cabeza', NULL, 12, '/data/industrial_catalogue/sub_temp_1771982693044_7jc4bwj76/main_image/699e4f83acf01_1771982723.jpg', NULL, 1, '2026-02-25 01:25:23', '2026-02-25 01:25:23'),
(69, 'Protección para los pies', 'protecci-n-para-los-pies', NULL, 12, '/data/industrial_catalogue/sub_temp_1771983759433_1pfnobrlf/main_image/699e53a7a1f75_1771983783.jpg', NULL, 1, '2026-02-25 01:43:04', '2026-02-25 01:43:04'),
(70, 'Taladros', 'taladros', NULL, 10, '/data/industrial_catalogue/sub_temp_1771984654581_t7sg5v0ta/main_image/699e578908a13_1771984777.jpg', NULL, 1, '2026-02-25 01:59:37', '2026-02-25 01:59:37'),
(71, 'Herramientas para acabados', 'herramientas-para-acabados', NULL, 10, '/data/industrial_catalogue/sub_temp_1771984973105_7t6izy7vn/main_image/699e586856277_1771985000.jpg', NULL, 1, '2026-02-25 02:03:20', '2026-02-25 02:03:20'),
(72, 'Herramientas electricas para cable y alambre', 'herramientas-electricas-para-cable-y-alambre', NULL, 10, '/data/industrial_catalogue/sub_temp_1771985204208_0fihj8vb4/main_image/699e594a6d3d4_1771985226.jpg', NULL, 1, '2026-02-25 02:07:06', '2026-02-25 02:07:06'),
(73, 'Pistolas de calor', 'pistolas-de-calor', NULL, 10, '/data/industrial_catalogue/sub_temp_1771985349205_4lvcrxr5r/main_image/699e59dcd1d5c_1771985372.jpg', NULL, 1, '2026-02-25 02:09:33', '2026-02-25 02:09:33');

-- --------------------------------------------------------

--
-- Table structure for table `support_responses`
--

CREATE TABLE `support_responses` (
  `id` int(11) NOT NULL,
  `contact_submission_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_internal_note` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Indexes for table `brand_categories`
--
ALTER TABLE `brand_categories`
  ADD PRIMARY KEY (`brand_id`,`category_id`),
  ADD KEY `idx_brand_categories_brand_id` (`brand_id`),
  ADD KEY `idx_brand_categories_category_id` (`category_id`);

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
-- Indexes for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_priority` (`priority`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `fk_contact_assigned_to` (`assigned_to`);

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
-- Indexes for table `faq_categories`
--
ALTER TABLE `faq_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_sort_order` (`sort_order`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `faq_items`
--
ALTER TABLE `faq_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category_id` (`category_id`),
  ADD KEY `idx_sort_order` (`sort_order`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `fk_faq_created_by` (`created_by`);

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
-- Indexes for table `support_responses`
--
ALTER TABLE `support_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contact_submission_id` (`contact_submission_id`),
  ADD KEY `idx_admin_id` (`admin_id`),
  ADD KEY `idx_created_at` (`created_at`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `faq_categories`
--
ALTER TABLE `faq_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `faq_items`
--
ALTER TABLE `faq_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `manufacturers`
--
ALTER TABLE `manufacturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `quote_items`
--
ALTER TABLE `quote_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `support_responses`
--
ALTER TABLE `support_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
-- Constraints for table `brand_categories`
--
ALTER TABLE `brand_categories`
  ADD CONSTRAINT `fk_bc_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  ADD CONSTRAINT `fk_contact_assigned_to` FOREIGN KEY (`assigned_to`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `faq_items`
--
ALTER TABLE `faq_items`
  ADD CONSTRAINT `fk_faq_category` FOREIGN KEY (`category_id`) REFERENCES `faq_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_faq_created_by` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

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

--
-- Constraints for table `support_responses`
--
ALTER TABLE `support_responses`
  ADD CONSTRAINT `fk_support_response_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_support_response_contact` FOREIGN KEY (`contact_submission_id`) REFERENCES `contact_submissions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
