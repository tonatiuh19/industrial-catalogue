-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 10, 2026 at 08:15 PM
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
(7, 'srz.josemaria@gmail.com', NULL, 'super_admin', 'Josemaria', 'Suarez', NULL, 1, 0, '2026-01-09 01:10:51', '2026-01-09 01:10:51', NULL),
(8, 'ventas@grupotrenor.com', NULL, 'super_admin', 'GRUPO', 'TRENOR', '4775990905', 1, 0, '2026-03-10 17:29:00', '2026-03-10 17:29:00', NULL);

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
(1, 1, 'quote_requests', 0, '2026-02-03 22:35:07', '2026-03-10 17:27:25'),
(2, 3, 'quote_requests', 1, '2026-02-03 22:35:07', '2026-03-10 17:27:17'),
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
(48, 1, 422890, 1, '2026-02-26 22:43:23', '2026-02-25 22:43:07'),
(49, 3, 423577, 1, '2026-02-27 05:50:43', '2026-02-25 23:50:29'),
(50, 8, 607851, 1, '2026-03-11 23:30:23', '2026-03-10 17:29:32'),
(51, 8, 256442, 0, '2026-03-10 17:40:05', '2026-03-10 17:30:05');

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
(9, 'SKF', 10, 7, NULL, '', '/data/industrial_catalogue/brand_9/main_image/69a077d4ea8c0_1772124116.jpg', NULL, NULL, 1, '2026-01-08 04:02:33', '2026-02-26 16:41:57'),
(15, 'Timken', 16, 7, NULL, '', '/data/industrial_catalogue/15/main_image/6976b4528ebd2_1769387090.png', NULL, NULL, 1, '2026-01-08 16:41:02', '2026-02-26 15:37:23'),
(17, '3M', 17, 12, NULL, '', '/data/industrial_catalogue/brand_17/main_image/69aaf456e1c4a_1772811350.png', NULL, NULL, 1, '2026-02-16 02:39:51', '2026-03-06 15:46:56'),
(19, 'SMC', NULL, 18, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772491381773_kqig56m9l/main_image/69a612f1b230e_1772491505.png', NULL, NULL, 1, '2026-03-02 22:45:07', '2026-03-02 22:45:07'),
(20, 'Festo', NULL, 18, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772491667352_9t749dxn1/main_image/69a613c19158a_1772491713.png', NULL, NULL, 1, '2026-03-02 22:48:33', '2026-03-02 22:48:33'),
(21, 'Parker Hannifin', NULL, 18, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772491800442_6itxokoly/main_image/69a61439629ac_1772491833.png', NULL, NULL, 1, '2026-03-02 22:50:33', '2026-03-02 22:50:33'),
(23, 'IMI Norgren', NULL, 18, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772492056133_ti56ag2ko/main_image/69a6152926d51_1772492073.png', NULL, NULL, 1, '2026-03-02 22:54:33', '2026-03-02 22:54:33'),
(24, 'Emerson aventics', NULL, 18, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772492243200_nexci8hsm/main_image/69a615e4b43e7_1772492260.png', NULL, NULL, 1, '2026-03-02 22:57:40', '2026-03-02 22:57:40'),
(26, 'Danfoss', NULL, 9, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772492590325_8ldmbirii/main_image/69a6173f155cf_1772492607.png', NULL, NULL, 1, '2026-03-02 23:03:27', '2026-03-02 23:03:27'),
(27, 'Hydac', NULL, 9, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772492658839_8lk58nip5/main_image/69a617b97543f_1772492729.png', NULL, NULL, 1, '2026-03-02 23:05:29', '2026-03-02 23:05:29'),
(28, 'Kawasaki', NULL, 9, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772492830791_brpy7jlmx/main_image/69a6183c2dfc7_1772492860.png', NULL, NULL, 1, '2026-03-02 23:07:40', '2026-03-02 23:07:40'),
(29, 'Enerpac', NULL, 9, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772492903206_3gnrjo1cp/main_image/69a618749e366_1772492916.png', NULL, NULL, 1, '2026-03-02 23:08:36', '2026-03-02 23:08:36'),
(30, 'Vickers', NULL, 9, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772492960362_spjgzyt9y/main_image/69a618b634d07_1772492982.png', NULL, NULL, 1, '2026-03-02 23:09:42', '2026-03-02 23:09:42'),
(31, 'Danfoss charlyn', NULL, 9, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772493129415_vaxdtylj8/main_image/69a6196415986_1772493156.png', NULL, NULL, 1, '2026-03-02 23:12:36', '2026-03-02 23:12:36'),
(32, 'Wika', NULL, 9, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772493191172_svgwjpdoe/main_image/69a619af917cd_1772493231.png', NULL, NULL, 1, '2026-03-02 23:13:51', '2026-03-02 23:13:51'),
(33, 'SPX', NULL, 9, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772493313737_cjy60xcwn/main_image/69a61a1c324fa_1772493340.png', NULL, NULL, 1, '2026-03-02 23:15:40', '2026-03-02 23:15:40'),
(34, 'Gates', NULL, 14, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772493429579_2q9i0xyiw/main_image/69a61af887fce_1772493560.png', NULL, NULL, 1, '2026-03-02 23:19:20', '2026-03-02 23:19:20'),
(35, 'Tsubaki', NULL, 14, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772493602054_75es406s5/main_image/69a61b35694ee_1772493621.png', NULL, NULL, 1, '2026-03-02 23:20:21', '2026-03-02 23:20:21'),
(37, 'Martin Sprocket', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772493838228_k125umdfo/main_image/69a61c47a6e3a_1772493895.png', NULL, NULL, 1, '2026-03-02 23:24:55', '2026-03-02 23:24:55'),
(38, 'Falk', NULL, 14, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772493930675_mwql09bvb/main_image/69a61c79e1126_1772493945.png', NULL, NULL, 1, '2026-03-02 23:25:46', '2026-03-02 23:25:46'),
(39, 'Boston regal', NULL, 14, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772493975526_ax47gmu8p/main_image/69a61ca9175be_1772493993.png', NULL, NULL, 1, '2026-03-02 23:26:33', '2026-03-02 23:26:33'),
(41, 'TB woods', NULL, 14, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772494110780_8wnk8bywt/main_image/69a61d2e022ab_1772494126.png', NULL, NULL, 1, '2026-03-02 23:28:46', '2026-03-02 23:28:46'),
(42, 'Navitek', NULL, 21, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772810792644_q3qmruki3/main_image/69aaf23cd647f_1772810812.png', NULL, NULL, 1, '2026-03-06 15:26:54', '2026-03-06 15:26:54'),
(43, 'Tuk', NULL, 21, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772810863357_7o812wm84/main_image/69aaf2882341a_1772810888.png', NULL, NULL, 1, '2026-03-06 15:28:08', '2026-03-06 15:28:08'),
(44, 'Tesa', NULL, 21, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772810960277_l5uai7lpi/main_image/69aaf2ddeaae2_1772810973.jpg', NULL, NULL, 1, '2026-03-06 15:29:34', '2026-03-06 15:29:34'),
(45, 'Henkel', NULL, 21, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772811007346_lmcieswbc/main_image/69aaf30e81ae5_1772811022.jpg', NULL, NULL, 1, '2026-03-06 15:30:22', '2026-03-06 15:30:22'),
(46, 'Gorilla tape', NULL, 21, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772811111083_vnobi0mxy/main_image/69aaf37607dcc_1772811126.jpg', NULL, NULL, 1, '2026-03-06 15:32:06', '2026-03-06 15:32:06'),
(47, 'DEWALT', NULL, 20, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772811386414_3gwifkowq/main_image/69aaf5011f0ad_1772811521.jpg', NULL, NULL, 1, '2026-03-06 15:38:41', '2026-03-06 15:38:41'),
(49, 'Saint Gobain', NULL, 20, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772811730198_o5o5cnves/main_image/69aaf5e3ae1e9_1772811747.png', NULL, NULL, 1, '2026-03-06 15:42:27', '2026-03-06 15:42:27'),
(50, 'Norton Saint Gobain', NULL, 20, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772811793026_oqoj7swbz/main_image/69aaf6232a186_1772811811.png', NULL, NULL, 1, '2026-03-06 15:43:31', '2026-03-06 15:43:31'),
(51, 'Weiler', NULL, 20, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772811865154_u0fo2e130/main_image/69aaf66901e95_1772811881.png', NULL, NULL, 1, '2026-03-06 15:44:41', '2026-03-06 15:44:41'),
(52, 'Klingspor', NULL, 20, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772811966518_bkoykb5br/main_image/69aaf6de8c08f_1772811998.png', NULL, NULL, 1, '2026-03-06 15:46:38', '2026-03-06 15:46:38'),
(53, 'Fandeli', NULL, 20, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772812124776_9tbnd200s/main_image/69aaf79be03d1_1772812187.png', NULL, NULL, 1, '2026-03-06 15:49:48', '2026-03-06 15:49:48'),
(54, 'Grundfos', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772812528636_2i59siicv/main_image/69aaf901b0bec_1772812545.png', NULL, NULL, 1, '2026-03-06 15:55:46', '2026-03-06 15:55:46'),
(55, 'Goulds Pumps (ITT)', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772812603556_pm7s7tgki/main_image/69aaf94b44a49_1772812619.png', NULL, NULL, 1, '2026-03-06 15:56:59', '2026-03-06 15:56:59'),
(63, 'KSB', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772813190868_qci2cvmo4/main_image/69aafb98710bf_1772813208.png', NULL, NULL, 1, '2026-03-06 16:06:48', '2026-03-06 16:06:48'),
(64, 'Barmesa', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772813262333_bqqpw9hqo/main_image/69aafbdcd8833_1772813276.jpg', NULL, NULL, 1, '2026-03-06 16:07:57', '2026-03-06 16:07:57'),
(65, 'Wilden', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772813303088_2tyd8py3t/main_image/69aafc043f28e_1772813316.png', NULL, NULL, 1, '2026-03-06 16:08:36', '2026-03-06 16:08:36'),
(66, 'Franklin Electric ', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772813397935_1208ydw4b/main_image/69aafc820edfb_1772813442.png', NULL, NULL, 1, '2026-03-06 16:10:42', '2026-03-06 16:10:42'),
(67, 'Wilo', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772813501812_ueuc16u2l/main_image/69aafcce60136_1772813518.png', NULL, NULL, 1, '2026-03-06 16:11:58', '2026-03-06 16:11:58'),
(68, 'Evans', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772813631855_igwds6bo9/main_image/69aafd4d1a53a_1772813645.png', NULL, NULL, 1, '2026-03-06 16:14:05', '2026-03-06 16:14:05'),
(69, 'THK', NULL, 19, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772813710754_7n1wtbrdg/main_image/69aafdb8e576b_1772813752.png', NULL, NULL, 1, '2026-03-06 16:15:53', '2026-03-06 16:15:53'),
(70, 'HIWIN', NULL, 19, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772813817749_w1pztrpa6/main_image/69aafe1dbbf85_1772813853.png', NULL, NULL, 1, '2026-03-06 16:17:33', '2026-03-06 16:17:34'),
(72, 'NSK', NULL, 19, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772814013467_iqn0lrgdm/main_image/69aafece963e5_1772814030.png', NULL, NULL, 1, '2026-03-06 16:20:30', '2026-03-06 16:20:30'),
(73, 'Schaeffler (INA/FAG)', NULL, 19, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772814103045_j8amcmdf5/main_image/69aaff7c178fb_1772814204.png', NULL, NULL, 1, '2026-03-06 16:23:24', '2026-03-06 16:23:24'),
(74, 'Bosch rexroth', NULL, 19, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772814454305_f8n5uj1np/main_image/69ab008769708_1772814471.png', NULL, NULL, 1, '2026-03-06 16:27:51', '2026-03-06 16:27:51'),
(75, 'Thomson', NULL, 19, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772814679126_il1sl93p6/main_image/69ab01c41fb95_1772814788.png', NULL, NULL, 1, '2026-03-06 16:33:08', '2026-03-06 16:33:10'),
(76, 'Ewellix', NULL, 19, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772814857480_y3drb8t72/main_image/69ab0223653db_1772814883.png', NULL, NULL, 1, '2026-03-06 16:34:43', '2026-03-06 16:34:43'),
(77, 'Schneeberger', NULL, 19, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772814989429_es0lc27qx/main_image/69ab029aa2152_1772815002.png', NULL, NULL, 1, '2026-03-06 16:36:43', '2026-03-06 16:36:43'),
(78, 'Milwaukee', NULL, 24, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772816356396_3uoxa1f8e/main_image/69ab0831cdcee_1772816433.png', NULL, NULL, 1, '2026-03-06 17:00:34', '2026-03-06 17:00:35'),
(79, 'Morse cutting tools', NULL, 24, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772816487567_3scyqody7/main_image/69ab087db4188_1772816509.png', NULL, NULL, 1, '2026-03-06 17:01:49', '2026-03-06 17:01:50'),
(80, 'Kyocera', NULL, 24, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772816650264_pfdctif0g/main_image/69ab092115db7_1772816673.png', NULL, NULL, 1, '2026-03-06 17:04:33', '2026-03-06 17:04:33'),
(81, 'OSG', NULL, 24, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772816708541_1blu7dngw/main_image/69ab096d87136_1772816749.png', NULL, NULL, 1, '2026-03-06 17:05:50', '2026-03-06 17:05:50'),
(82, 'Sandvik Coromant', NULL, 24, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772816818062_2csfk7kzh/main_image/69ab09bca440e_1772816828.png', NULL, NULL, 1, '2026-03-06 17:07:08', '2026-03-06 17:07:08'),
(83, 'Kennametal', NULL, 24, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772816964812_v511cxki1/main_image/69ab0a5041af6_1772816976.png', NULL, NULL, 1, '2026-03-06 17:09:36', '2026-03-06 17:09:36'),
(84, 'ISCAR', NULL, 24, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817032911_p7scij3hg/main_image/69ab0a9517756_1772817045.png', NULL, NULL, 1, '2026-03-06 17:10:45', '2026-03-06 17:10:45'),
(85, 'Walter Tools', NULL, 24, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817111872_r4pj3qmmn/main_image/69ab0ae15bdcb_1772817121.png', NULL, NULL, 1, '2026-03-06 17:12:01', '2026-03-06 17:12:01'),
(86, 'Mitsubishi Materials', NULL, 24, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817210285_bzu8t4ma4/main_image/69ab0b44f2172_1772817220.png', NULL, NULL, 1, '2026-03-06 17:13:41', '2026-03-06 17:13:41'),
(87, 'Makita', NULL, 17, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817330450_r8masgtcm/main_image/69ab0c0257e68_1772817410.png', NULL, NULL, 1, '2026-03-06 17:16:50', '2026-03-06 17:16:51'),
(88, 'Bosch Professional', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817467405_00jm1yer5/main_image/69ab0c95bb22d_1772817557.png', NULL, NULL, 1, '2026-03-06 17:19:18', '2026-03-06 17:19:18'),
(89, 'Hilti', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817590637_9vrd3aku4/main_image/69ab0ce96d2d8_1772817641.png', NULL, NULL, 1, '2026-03-06 17:20:41', '2026-03-06 17:20:41'),
(90, 'Truper', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817687845_mrsq4toci/main_image/69ab0d2cd5620_1772817708.png', NULL, NULL, 1, '2026-03-06 17:21:49', '2026-03-06 17:21:49'),
(91, 'Stanley', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817806041_kj68ddpy3/main_image/69ab0d9a58dd1_1772817818.png', NULL, NULL, 1, '2026-03-06 17:23:38', '2026-03-06 17:23:39'),
(92, 'Black+Decker', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817851571_qu8xgmmpu/main_image/69ab0dfdb99e9_1772817917.png', NULL, NULL, 1, '2026-03-06 17:25:17', '2026-03-06 17:25:18'),
(93, 'Ryobi', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772817997791_cyiyvf9uj/main_image/69ab0e5779361_1772818007.png', NULL, NULL, 1, '2026-03-06 17:26:47', '2026-03-06 17:26:47'),
(94, 'Craftsman', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772818054640_udarlxafx/main_image/69ab0e9291bd3_1772818066.png', NULL, NULL, 1, '2026-03-06 17:27:46', '2026-03-06 17:27:46'),
(95, 'Fluke', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772818267504_8s07lqil8/main_image/69ab0f6829117_1772818280.png', NULL, NULL, 1, '2026-03-06 17:31:20', '2026-03-06 17:31:20'),
(97, 'Proto', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772818460945_rfblva27c/main_image/69ab102aaf20e_1772818474.png', NULL, NULL, 1, '2026-03-06 17:34:34', '2026-03-06 17:34:34'),
(99, 'Honeywell', NULL, 9, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772818823719_d055tgu4d/main_image/69ab1193b0a6d_1772818835.png', NULL, NULL, 1, '2026-03-06 17:40:35', '2026-03-06 17:40:36'),
(100, 'Dodge an RBC', NULL, 14, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772818924179_whumsu4yu/main_image/69ab120c69e01_1772818956.png', NULL, NULL, 1, '2026-03-06 17:42:36', '2026-03-06 17:42:36'),
(101, 'Sacar del centro', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772819583229_oh9h3tisp/main_image/69ab14919e0cb_1772819601.png', NULL, NULL, 1, '2026-03-06 17:53:22', '2026-03-06 17:53:22'),
(102, 'Konecranes', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772819685347_85w2ik8pb/main_image/69ab14ef5af99_1772819695.png', NULL, NULL, 1, '2026-03-06 17:54:55', '2026-03-06 17:54:55'),
(103, 'Demag', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772819741226_p0e2cvibr/main_image/69ab153794430_1772819767.png', NULL, NULL, 1, '2026-03-06 17:56:07', '2026-03-06 17:56:07'),
(104, 'Raymond', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772819886487_2uj5xtxgz/main_image/69ab15b9b2589_1772819897.png', NULL, NULL, 1, '2026-03-06 17:58:18', '2026-03-06 17:58:18'),
(105, 'Crown', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772819971123_478n6ocke/main_image/69ab161b21995_1772819995.png', NULL, NULL, 1, '2026-03-06 17:59:55', '2026-03-06 17:59:55'),
(106, 'Dayton', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772820304937_tcuumq5vx/main_image/69ab175e21d3b_1772820318.png', NULL, NULL, 1, '2026-03-06 18:05:18', '2026-03-06 18:05:18'),
(107, 'Urrea', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772820335041_nnerh00dy/main_image/69ab17a9307bf_1772820393.png', NULL, NULL, 1, '2026-03-06 18:06:33', '2026-03-06 18:06:33'),
(108, 'Surtek', NULL, 10, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772820418418_z513kcwy6/main_image/69ab17f375d0f_1772820467.png', NULL, NULL, 1, '2026-03-06 18:07:47', '2026-03-06 18:07:47'),
(109, 'Southworth', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772820573894_2fti1qo4b/main_image/69ab186809fae_1772820584.png', NULL, NULL, 1, '2026-03-06 18:09:44', '2026-03-06 18:09:44'),
(110, 'Bishamon', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772820630812_vv7m9t002/main_image/69ab18a09689d_1772820640.png', NULL, NULL, 1, '2026-03-06 18:10:40', '2026-03-06 18:10:40'),
(111, 'Columbus McKinnon', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772820678612_46wspzuyd/main_image/69ab18d054b6d_1772820688.png', NULL, NULL, 1, '2026-03-06 18:11:28', '2026-03-06 18:11:28'),
(112, 'Harrington Hoists', NULL, 8, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772820791173_woge91eer/main_image/69ab19420a27d_1772820802.png', NULL, NULL, 1, '2026-03-06 18:13:22', '2026-03-06 18:13:22'),
(113, 'WEG', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772820954834_b96l4bjg6/main_image/69ab19e9eabcf_1772820969.png', NULL, NULL, 1, '2026-03-06 18:16:10', '2026-03-06 18:16:10'),
(115, 'Siemens', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772821028698_srymbir8h/main_image/69ab1a2d878ba_1772821037.png', NULL, NULL, 1, '2026-03-06 18:17:17', '2026-03-06 18:17:17'),
(116, 'ABB', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772821048329_jykfzrpc3/main_image/69ab1a7821258_1772821112.png', NULL, NULL, 1, '2026-03-06 18:18:32', '2026-03-06 18:18:32'),
(117, 'Baldor-Reliance (ABB)', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772821597030_ixr1k2eml/main_image/69ab1ccdcfc40_1772821709.png', NULL, NULL, 1, '2026-03-06 18:28:30', '2026-03-06 18:28:30'),
(118, 'US Motors (Nidec)', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772821769168_lkeh8lokl/main_image/69ab1d47ce920_1772821831.png', NULL, NULL, 1, '2026-03-06 18:30:33', '2026-03-06 18:30:33'),
(119, 'Leeson', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772821978941_80egpelpg/main_image/69ab1deb4bfc8_1772821995.png', NULL, NULL, 1, '2026-03-06 18:33:15', '2026-03-06 18:33:15'),
(120, 'Marathon Motors', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772822163299_4ixgc67lo/main_image/69ab1e9e664a5_1772822174.png', NULL, NULL, 1, '2026-03-06 18:36:14', '2026-03-06 18:36:14'),
(121, 'Bodine Electric', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772822215773_jjir84tn7/main_image/69ab1ede98926_1772822238.png', NULL, NULL, 1, '2026-03-06 18:37:18', '2026-03-06 18:37:18'),
(122, 'Bison Gear & Engineering', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772822322067_x61qhiai1/main_image/69ab1f42b5bb7_1772822338.png', NULL, NULL, 1, '2026-03-06 18:38:58', '2026-03-06 18:38:58'),
(123, 'General_Electric', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772822488183_mw8alz77k/main_image/69ab1fe1b7c08_1772822497.png', NULL, NULL, 1, '2026-03-06 18:41:37', '2026-03-06 18:41:38'),
(124, 'SEW-EURODRIVE', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772822542710_utcygtnpb/main_image/69ab20254840e_1772822565.png', NULL, NULL, 1, '2026-03-06 18:42:45', '2026-03-06 18:42:45'),
(125, 'Sumitomo', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772822640042_sjeuvio1z/main_image/69ab207fa205e_1772822655.png', NULL, NULL, 1, '2026-03-06 18:44:15', '2026-03-06 18:44:15'),
(126, 'Nord Drivesystems', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772822698607_49v8da1jf/main_image/69ab20b43c05f_1772822708.png', NULL, NULL, 1, '2026-03-06 18:45:08', '2026-03-06 18:45:08'),
(127, 'Bonfiglioli', NULL, 23, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772822792397_p3mwlaish/main_image/69ab212fc7a0e_1772822831.png', NULL, NULL, 1, '2026-03-06 18:47:12', '2026-03-06 18:47:12'),
(128, 'NTN', NULL, 7, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772822954039_vneq2nmq8/main_image/69ab21cdbcec2_1772822989.png', NULL, NULL, 1, '2026-03-06 18:49:49', '2026-03-06 18:49:50'),
(129, 'Koyo JTEKT', NULL, 7, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772823135761_vizllzf1h/main_image/69ab227bb3e72_1772823163.png', NULL, NULL, 1, '2026-03-06 18:52:43', '2026-03-06 18:52:44'),
(130, 'Regal Rexnord', NULL, 19, NULL, NULL, '/data/industrial_catalogue/brand_temp_1772823263124_76yy1ypn4/main_image/69ab231399f11_1772823315.png', NULL, NULL, 1, '2026-03-06 18:55:15', '2026-03-06 18:55:15'),
(131, 'Miller Electric', NULL, 25, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773090083892_41g0zb3zc/main_image/69af35354ce79_1773090101.png', NULL, NULL, 1, '2026-03-09 21:01:41', '2026-03-09 21:01:42'),
(132, 'Lincoln Electric', NULL, 25, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773090149833_lfhof03gn/main_image/69af3582c4cc0_1773090178.png', NULL, NULL, 1, '2026-03-09 21:02:59', '2026-03-09 21:02:59'),
(133, 'ESAB', NULL, 25, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773090219221_xerp0j1h7/main_image/69af35b65802c_1773090230.png', NULL, NULL, 1, '2026-03-09 21:03:50', '2026-03-09 21:03:50'),
(134, 'Fronius', NULL, 25, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773090286890_f4l30ztzt/main_image/69af361db3a2c_1773090333.png', NULL, NULL, 1, '2026-03-09 21:05:33', '2026-03-09 21:05:34'),
(135, 'Hobart', NULL, 25, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773090436804_pjvnkxcum/main_image/69af369052d30_1773090448.png', NULL, NULL, 1, '2026-03-09 21:07:28', '2026-03-09 21:07:29'),
(136, '3M Speedglas', NULL, 25, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773090515584_ii6ol3h8i/main_image/69af36dd5e6c6_1773090525.png', NULL, NULL, 1, '2026-03-09 21:08:45', '2026-03-09 21:08:45'),
(137, 'Black Stallion', NULL, 25, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773090598829_4fg9ou6l1/main_image/69af3730e0ed8_1773090608.png', NULL, NULL, 1, '2026-03-09 21:10:09', '2026-03-09 21:10:09'),
(138, 'AXT', NULL, 25, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773090704621_ltnx1gtro/main_image/69af37a588d39_1773090725.png', NULL, NULL, 1, '2026-03-09 21:12:05', '2026-03-09 21:12:05'),
(139, 'Waukesha', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773091937024_k0fl0jj3j/main_image/69af3c7dcb650_1773091965.png', NULL, NULL, 1, '2026-03-09 21:32:46', '2026-03-09 21:32:46'),
(140, 'Wacker Neuson', NULL, 22, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773092075442_njy2b17vi/main_image/69af3d044f32d_1773092100.png', NULL, NULL, 1, '2026-03-09 21:35:00', '2026-03-09 21:35:00'),
(141, 'Triumph', NULL, 18, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773092339863_8skdjw6wz/main_image/69af3e09152c8_1773092361.png', NULL, NULL, 1, '2026-03-09 21:39:21', '2026-03-09 21:39:21'),
(142, 'DermaCare', NULL, 12, NULL, NULL, '/data/industrial_catalogue/brand_temp_1773105083205_lyg7g97dy/main_image/69af6fe0bd8c7_1773105120.png', NULL, NULL, 1, '2026-03-10 01:12:02', '2026-03-10 01:12:02');

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
(9, 7, '2026-02-26 16:41:57'),
(15, 7, '2026-02-26 15:37:23'),
(17, 12, '2026-03-06 15:46:56'),
(17, 20, '2026-03-06 15:46:56'),
(17, 21, '2026-03-06 15:46:56'),
(19, 18, '2026-03-02 22:45:07'),
(20, 18, '2026-03-02 22:48:33'),
(21, 9, '2026-03-02 23:01:35'),
(21, 18, '2026-03-02 23:01:35'),
(23, 18, '2026-03-02 22:54:33'),
(24, 18, '2026-03-02 22:57:40'),
(26, 9, '2026-03-02 23:03:27'),
(27, 9, '2026-03-02 23:05:29'),
(28, 9, '2026-03-02 23:07:40'),
(29, 9, '2026-03-02 23:08:36'),
(30, 9, '2026-03-02 23:09:42'),
(31, 9, '2026-03-02 23:12:36'),
(31, 23, '2026-03-02 23:12:36'),
(32, 9, '2026-03-02 23:13:51'),
(33, 9, '2026-03-02 23:15:40'),
(34, 9, '2026-03-02 23:19:20'),
(34, 14, '2026-03-02 23:19:20'),
(35, 14, '2026-03-02 23:20:21'),
(37, 8, '2026-03-02 23:24:55'),
(37, 14, '2026-03-02 23:24:55'),
(38, 14, '2026-03-02 23:25:46'),
(39, 14, '2026-03-02 23:26:33'),
(41, 14, '2026-03-02 23:28:46'),
(42, 21, '2026-03-06 15:26:54'),
(43, 21, '2026-03-06 15:28:08'),
(44, 21, '2026-03-06 15:29:34'),
(45, 21, '2026-03-06 15:30:22'),
(46, 21, '2026-03-06 15:32:06'),
(47, 10, '2026-03-06 15:38:41'),
(47, 12, '2026-03-06 15:38:41'),
(47, 17, '2026-03-06 15:38:41'),
(47, 20, '2026-03-06 15:38:41'),
(47, 24, '2026-03-06 15:38:41'),
(49, 20, '2026-03-06 15:42:27'),
(50, 20, '2026-03-06 15:43:31'),
(51, 20, '2026-03-06 15:44:41'),
(52, 20, '2026-03-06 15:46:38'),
(53, 20, '2026-03-06 15:49:48'),
(53, 21, '2026-03-06 15:49:48'),
(54, 22, '2026-03-06 15:55:46'),
(55, 22, '2026-03-06 15:56:59'),
(63, 22, '2026-03-06 16:06:48'),
(64, 22, '2026-03-06 16:07:57'),
(65, 22, '2026-03-06 16:08:36'),
(66, 22, '2026-03-06 16:10:42'),
(67, 22, '2026-03-06 16:11:58'),
(68, 22, '2026-03-06 16:14:05'),
(69, 19, '2026-03-06 16:15:53'),
(70, 7, '2026-03-06 16:17:34'),
(70, 14, '2026-03-06 16:17:34'),
(70, 19, '2026-03-06 16:17:34'),
(70, 23, '2026-03-06 16:17:34'),
(72, 7, '2026-03-06 16:20:30'),
(72, 19, '2026-03-06 16:20:30'),
(73, 7, '2026-03-06 16:23:24'),
(73, 14, '2026-03-06 16:23:24'),
(73, 19, '2026-03-06 16:23:24'),
(74, 9, '2026-03-06 16:27:51'),
(74, 19, '2026-03-06 16:27:51'),
(75, 7, '2026-03-06 16:33:10'),
(75, 9, '2026-03-06 16:33:10'),
(75, 14, '2026-03-06 16:33:10'),
(75, 19, '2026-03-06 16:33:10'),
(75, 23, '2026-03-06 16:33:10'),
(76, 19, '2026-03-06 16:34:43'),
(77, 19, '2026-03-06 16:36:43'),
(78, 10, '2026-03-06 17:00:34'),
(78, 17, '2026-03-06 17:00:34'),
(78, 24, '2026-03-06 17:00:34'),
(79, 24, '2026-03-06 17:01:49'),
(80, 24, '2026-03-06 17:04:33'),
(81, 24, '2026-03-06 17:05:50'),
(82, 24, '2026-03-06 17:07:08'),
(83, 24, '2026-03-06 17:09:36'),
(84, 24, '2026-03-06 17:10:45'),
(85, 24, '2026-03-06 17:12:01'),
(86, 24, '2026-03-06 17:13:41'),
(87, 10, '2026-03-06 17:16:50'),
(87, 17, '2026-03-06 17:16:50'),
(87, 22, '2026-03-06 17:16:50'),
(88, 10, '2026-03-06 17:19:18'),
(88, 17, '2026-03-06 17:19:18'),
(88, 20, '2026-03-06 17:19:18'),
(88, 24, '2026-03-06 17:19:18'),
(89, 10, '2026-03-06 17:20:41'),
(89, 17, '2026-03-06 17:20:41'),
(90, 10, '2026-03-06 17:21:49'),
(90, 17, '2026-03-06 17:21:49'),
(91, 10, '2026-03-06 17:23:38'),
(91, 17, '2026-03-06 17:23:38'),
(92, 10, '2026-03-06 17:25:17'),
(92, 17, '2026-03-06 17:25:18'),
(93, 10, '2026-03-06 17:26:47'),
(94, 10, '2026-03-06 17:27:46'),
(94, 17, '2026-03-06 17:27:46'),
(95, 10, '2026-03-06 17:31:20'),
(97, 10, '2026-03-06 17:34:34'),
(97, 17, '2026-03-06 17:34:34'),
(99, 9, '2026-03-06 17:40:35'),
(99, 12, '2026-03-06 17:40:36'),
(99, 18, '2026-03-06 17:40:36'),
(100, 7, '2026-03-06 17:42:36'),
(100, 14, '2026-03-06 17:42:36'),
(101, 8, '2026-03-06 17:53:22'),
(102, 8, '2026-03-06 17:54:55'),
(103, 8, '2026-03-06 17:56:07'),
(104, 8, '2026-03-06 17:58:18'),
(105, 8, '2026-03-06 17:59:55'),
(106, 8, '2026-03-06 18:05:18'),
(107, 8, '2026-03-06 18:06:33'),
(107, 10, '2026-03-06 18:06:33'),
(107, 17, '2026-03-06 18:06:33'),
(108, 8, '2026-03-06 18:07:47'),
(108, 10, '2026-03-06 18:07:47'),
(108, 17, '2026-03-06 18:07:47'),
(109, 8, '2026-03-06 18:09:44'),
(110, 8, '2026-03-06 18:10:40'),
(111, 8, '2026-03-06 18:11:28'),
(112, 8, '2026-03-06 18:13:22'),
(113, 23, '2026-03-06 18:16:10'),
(115, 23, '2026-03-06 18:17:17'),
(116, 23, '2026-03-06 18:18:32'),
(117, 22, '2026-03-06 18:28:30'),
(117, 23, '2026-03-06 18:28:30'),
(118, 23, '2026-03-06 18:30:33'),
(119, 23, '2026-03-06 18:33:15'),
(120, 23, '2026-03-06 18:36:14'),
(121, 23, '2026-03-06 18:37:18'),
(122, 23, '2026-03-06 18:38:58'),
(123, 23, '2026-03-06 18:41:38'),
(124, 23, '2026-03-06 18:42:45'),
(125, 23, '2026-03-06 18:44:15'),
(126, 23, '2026-03-06 18:45:08'),
(127, 23, '2026-03-06 18:47:12'),
(128, 7, '2026-03-06 18:49:50'),
(128, 14, '2026-03-06 18:49:50'),
(128, 19, '2026-03-06 18:49:50'),
(129, 7, '2026-03-06 18:52:44'),
(130, 7, '2026-03-06 18:55:15'),
(130, 14, '2026-03-06 18:55:15'),
(130, 19, '2026-03-06 18:55:15'),
(130, 23, '2026-03-06 18:55:15'),
(131, 25, '2026-03-09 21:01:42'),
(132, 25, '2026-03-09 21:02:59'),
(133, 25, '2026-03-09 21:03:50'),
(134, 25, '2026-03-09 21:05:34'),
(135, 25, '2026-03-09 21:07:28'),
(136, 25, '2026-03-09 21:08:45'),
(137, 25, '2026-03-09 21:10:09'),
(138, 25, '2026-03-09 21:12:05'),
(139, 22, '2026-03-09 21:32:46'),
(140, 22, '2026-03-09 21:35:00'),
(141, 18, '2026-03-09 21:39:21'),
(142, 12, '2026-03-10 01:12:02'),
(142, 25, '2026-03-10 01:12:02');

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
(17, 'Herramientas manuales', '', 'herramientas-manuales', '/data/industrial_catalogue/cat_17/main_image/69a1be5e65dd8_1772207710.jpg', NULL, NULL, 0, 1, '2026-02-16 17:56:03', '2026-02-27 15:55:10'),
(18, 'Neumática', NULL, 'neum-tica', '/data/industrial_catalogue/cat_temp_1771871402313_zh817cwlq/main_image/699c9cbe87d25_1771871422.jpg', NULL, NULL, 0, 1, '2026-02-23 18:30:22', '2026-02-23 18:30:22'),
(19, 'Guias lineales', NULL, 'guias-lineales', '/data/industrial_catalogue/cat_temp_1771889961040_gf32gvouw/main_image/699ce561cc2ae_1771890017.jpg', NULL, NULL, 0, 1, '2026-02-23 23:40:18', '2026-02-23 23:40:18'),
(20, 'Abrasivos', NULL, 'abrasivos', '/data/industrial_catalogue/cat_temp_1771890865786_s5jcb7h0p/main_image/699ce8bf1167e_1771890879.jpeg', NULL, NULL, 0, 1, '2026-02-23 23:54:39', '2026-02-23 23:54:39'),
(21, 'Adhesivos', NULL, 'adhesivos', '/data/industrial_catalogue/cat_temp_1771891696479_c83i4u4n1/main_image/699cec07f1942_1771891719.jpg', NULL, NULL, 0, 1, '2026-02-24 00:08:40', '2026-02-24 00:08:40'),
(22, 'Bombas', NULL, 'bombas', '/data/industrial_catalogue/cat_temp_1772210976185_nfgtav2ga/main_image/69a1cb3ac65ee_1772211002.jpg', NULL, NULL, 0, 1, '2026-02-27 16:50:03', '2026-02-27 16:50:03'),
(23, 'Motores', NULL, 'motores', '/data/industrial_catalogue/cat_temp_1772212681899_1l6z5sp89/main_image/69a1d5d469f4c_1772213716.jpg', NULL, NULL, 0, 1, '2026-02-27 17:35:16', '2026-02-27 17:35:16'),
(24, 'Herramientas de corte', NULL, 'herramientas-de-corte', '/data/industrial_catalogue/cat_temp_1772214952578_3pvx8sxst/main_image/69a1dab940194_1772214969.jpg', NULL, NULL, 0, 1, '2026-02-27 17:56:09', '2026-02-27 17:56:09'),
(25, 'Soldadura', NULL, 'soldadura', '/data/industrial_catalogue/cat_temp_1772216903034_atikqja71/main_image/69a1e27ab1b9f_1772216954.jpg', NULL, NULL, 0, 1, '2026-02-27 18:29:14', '2026-02-27 18:29:14');

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
-- Table structure for table `hero_carousel_slides`
--

CREATE TABLE `hero_carousel_slides` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `background_image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cta_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Ver Catálogo',
  `cta_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/catalog',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hero_carousel_slides`
--

INSERT INTO `hero_carousel_slides` (`id`, `title`, `subtitle`, `description`, `background_image`, `cta_text`, `cta_link`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Donde la Calidad', 'Encuentra la Innovación', 'Herramientas profesionales, equipamiento industrial y componentes de precisión para transformar tu negocio', 'https://disruptinglabs.com/data/api/data/industrial_catalogue/images/pexels-vladimirsrajber-18631420.jpg', 'Ver Catálogo', '/catalog', 1, 1, '2026-03-11 02:09:28', '2026-03-11 02:11:43'),
(2, 'Potencia Industrial', 'Sin Límites', 'Sistemas de transmisión de potencia, automatización y control industrial para maximizar la productividad de tu empresa', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Ver Catálogo', '/catalog', 2, 1, '2026-03-11 02:09:28', '2026-03-11 02:11:46'),
(3, 'Precisión Técnica', 'Resultados Excepcionales', 'Sistemas neumáticos, hidráulicos y herramientas especializadas diseñadas para cada aplicación industrial específica', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Ver Catálogo', '/catalog', 3, 1, '2026-03-11 02:09:28', '2026-03-11 02:11:57'),
(4, 'Seguridad Industrial', 'Primera Prioridad', 'Equipos certificados y suministros industriales que garantizan operaciones seguras y cumplimiento normativo', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Ver Catálogo', '/catalog', 4, 1, '2026-03-11 02:09:28', '2026-03-11 02:11:49');

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
(5, 'Q-1771206431169-120', 'Bryan', 'ing.bryanpadilla@gmail.com', '4747299634', 'Stl', NULL, 'ABB', 'Motor electrico', 'S2R', NULL, 1, 'Leon', 'whatsapp', 11, NULL, 8, NULL, 'accepted', 0, NULL, '2026-02-16 01:47:11', '2026-02-27 16:41:27'),
(6, 'Q-1771611813566-953', 'Bryan Padillq', 'bryan.chelo.bp@gmail.com', '4747299634', 'Trenor', NULL, '3M', 'Lentes', NULL, NULL, 1, 'León', 'phone', 17, NULL, 12, NULL, 'accepted', 0, NULL, '2026-02-20 18:23:33', '2026-02-27 16:41:24');

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
(73, 'Pistolas de calor', 'pistolas-de-calor', NULL, 10, '/data/industrial_catalogue/sub_temp_1771985349205_4lvcrxr5r/main_image/699e59dcd1d5c_1771985372.jpg', NULL, 1, '2026-02-25 02:09:33', '2026-02-25 02:09:33'),
(74, 'Pinzas', 'pinzas', NULL, 17, '/data/industrial_catalogue/sub_temp_1772208572791_g10eboo4d/main_image/69a1c1cf076d5_1772208591.jpg', NULL, 1, '2026-02-27 16:09:52', '2026-02-27 16:09:52'),
(75, 'Llaves', 'llaves', '', 17, '/data/industrial_catalogue/sub_75/main_image/69a1c7287f325_1772209960.jpg', NULL, 1, '2026-02-27 16:29:49', '2026-02-27 16:32:40'),
(76, 'Martillos y herramientas de golpeo', 'martillos-y-herramientas-de-golpeo', NULL, 17, '/data/industrial_catalogue/sub_temp_1772210175807_lm9b4j1dr/main_image/69a1c81d93ea7_1772210205.jpg', NULL, 1, '2026-02-27 16:36:45', '2026-02-27 16:36:45'),
(77, 'Almacenamiento de herramientas', 'almacenamiento-de-herramientas', NULL, 17, '/data/industrial_catalogue/sub_temp_1772210413511_v1fhdte3p/main_image/69a1c90439966_1772210436.jpg', NULL, 1, '2026-02-27 16:40:36', '2026-02-27 16:40:36'),
(78, 'Bombas centrifugas', 'bombas-centrifugas', NULL, 22, '/data/industrial_catalogue/sub_temp_1772211213936_istcowl37/main_image/69a1cc25534a4_1772211237.jpg', NULL, 1, '2026-02-27 16:53:57', '2026-02-27 16:53:57'),
(79, 'Bombas de prueba hidrostaticas', 'bombas-de-prueba-hidrostaticas', NULL, 22, '/data/industrial_catalogue/sub_temp_1772211771568_ydoyd4zk9/main_image/69a1ce8eef659_1772211854.jpg', NULL, 1, '2026-02-27 17:04:15', '2026-02-27 17:04:15'),
(80, 'Bombas de diafragma', 'bombas-de-diafragma', NULL, 22, '/data/industrial_catalogue/sub_temp_1772212273553_yj690ltj3/main_image/69a1d05286d9e_1772212306.jpg', NULL, 1, '2026-02-27 17:11:47', '2026-02-27 17:11:47'),
(81, 'Bombas de desplazamiento positivo', 'bombas-de-desplazamiento-positivo', NULL, 22, '/data/industrial_catalogue/sub_temp_1772212475315_60es1k635/main_image/69a1d133769f1_1772212531.jpg', NULL, 1, '2026-02-27 17:15:32', '2026-02-27 17:15:32'),
(82, 'Motores DC', 'motores-dc', NULL, 23, '/data/industrial_catalogue/sub_temp_1772213905676_mcjpqzfdm/main_image/69a1d6a5bde2d_1772213925.jpg', NULL, 1, '2026-02-27 17:38:46', '2026-02-27 17:38:46'),
(83, 'Motores AC', 'motores-ac', NULL, 23, '/data/industrial_catalogue/sub_temp_1772213991150_6wrcaecfn/main_image/69a1d717823b2_1772214039.jpg', NULL, 1, '2026-02-27 17:40:39', '2026-02-27 17:40:39'),
(84, 'Motores de engranajes de CA', 'motores-de-engranajes-de-ca', NULL, 23, '/data/industrial_catalogue/sub_temp_1772214409021_i0dg075iv/main_image/69a1d8ab80e56_1772214443.jpg', NULL, 1, '2026-02-27 17:47:24', '2026-02-27 17:47:24'),
(85, 'Motores de engranajes de DC', 'motores-de-engranajes-de-dc', NULL, 23, '/data/industrial_catalogue/sub_temp_1772214540670_of8e5nbc9/main_image/69a1d9272898f_1772214567.jpg', NULL, 1, '2026-02-27 17:49:27', '2026-02-27 17:49:27'),
(86, 'Fresado', 'fresado', NULL, 24, '/data/industrial_catalogue/sub_temp_1772215311375_cehnjj9jw/main_image/69a1dc21b481c_1772215329.jpg', NULL, 1, '2026-02-27 18:02:10', '2026-02-27 18:02:10'),
(87, 'Taladrado', 'taladrado', NULL, 24, '/data/industrial_catalogue/sub_temp_1772215446520_9wwgeqtj3/main_image/69a1dca816e38_1772215464.jpg', NULL, 1, '2026-02-27 18:04:24', '2026-02-27 18:04:24'),
(88, 'Insertos de torneado de roscas', 'insertos-de-torneado-de-roscas', NULL, 24, '/data/industrial_catalogue/sub_temp_1772215719446_kt5q5ddk3/main_image/69a1ddb547d0d_1772215733.jpg', NULL, 1, '2026-02-27 18:08:53', '2026-02-27 18:08:53'),
(89, 'Hojas de sierra', 'hojas-de-sierra', NULL, 24, '/data/industrial_catalogue/sub_temp_1772216004174_1oi3lslpy/main_image/69a1deea00db2_1772216042.jpg', NULL, 1, '2026-02-27 18:14:02', '2026-02-27 18:14:02'),
(90, 'Soldadoras MIG y accesorios', 'soldadoras-mig-y-accesorios', '', 25, '/data/industrial_catalogue/sub_temp_1772217361408_oei7y2t1p/main_image/69a1e43cd7ce4_1772217404.jpg', NULL, 1, '2026-02-27 18:36:45', '2026-02-27 18:54:17'),
(91, 'Soldadoras TIG y accesorios', 'soldadoras-tig-y-accesorios', '', 25, '/data/industrial_catalogue/sub_temp_1772217447944_l135qznab/main_image/69a1e50f3e1de_1772217615.jpg', NULL, 1, '2026-02-27 18:40:15', '2026-02-27 18:54:27'),
(92, 'Sopletes para soldadura MIG', 'sopletes-para-soldadura-mig', '', 25, '/data/industrial_catalogue/sub_temp_1772217720505_czd6ida30/main_image/69a1e5a11eaf9_1772217761.jpg', NULL, 1, '2026-02-27 18:42:41', '2026-02-27 18:46:50'),
(93, 'Sopletes para soldadura TIG', 'sopletes-para-soldadura-tig', NULL, 25, '/data/industrial_catalogue/sub_temp_1772217851200_3u2jojlpi/main_image/69a1e685edfd1_1772217989.jpg', NULL, 1, '2026-02-27 18:46:30', '2026-02-27 18:46:30'),
(94, 'Soldadoras por arco y accesorios', 'soldadoras-por-arco-y-accesorios', NULL, 25, '/data/industrial_catalogue/sub_temp_1772218360427_6mux8kpjf/main_image/69a1e843d27fb_1772218435.jpg', NULL, 1, '2026-02-27 18:53:56', '2026-02-27 18:53:56'),
(95, 'Caretas para soldar', 'caretas-para-soldar', NULL, 25, '/data/industrial_catalogue/sub_temp_1772218709306_u7escs7mk/main_image/69a1e96c31d7a_1772218732.jpg', NULL, 1, '2026-02-27 18:58:52', '2026-02-27 18:58:52');

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
-- Indexes for table `hero_carousel_slides`
--
ALTER TABLE `hero_carousel_slides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_sort_order` (`sort_order`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
-- AUTO_INCREMENT for table `hero_carousel_slides`
--
ALTER TABLE `hero_carousel_slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

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
