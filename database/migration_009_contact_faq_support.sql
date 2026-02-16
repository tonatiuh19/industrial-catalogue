-- Migration 009: Add Contact Forms, FAQ, and Support Tickets
-- Create tables for contact system and FAQ management

-- Contact submissions table
CREATE TABLE `contact_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_created_at` (`created_at`),
  KEY `fk_contact_assigned_to` (`assigned_to`),
  CONSTRAINT `fk_contact_assigned_to` FOREIGN KEY (`assigned_to`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Support ticket responses table
CREATE TABLE `support_responses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_submission_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_internal_note` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_submission_id` (`contact_submission_id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_support_response_contact` FOREIGN KEY (`contact_submission_id`) REFERENCES `contact_submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_support_response_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQ categories table
CREATE TABLE `faq_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQ items table
CREATE TABLE `faq_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `question` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_is_active` (`is_active`),
  KEY `fk_faq_created_by` (`created_by`),
  CONSTRAINT `fk_faq_category` FOREIGN KEY (`category_id`) REFERENCES `faq_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_faq_created_by` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default FAQ categories
INSERT INTO `faq_categories` (`name`, `slug`, `description`, `sort_order`) VALUES
('Preguntas Generales', 'general', 'Preguntas comunes sobre nuestros servicios y empresa', 1),
('Productos', 'productos', 'Preguntas sobre nuestro catálogo de productos y especificaciones', 2),
('Pedidos y Cotizaciones', 'pedidos-cotizaciones', 'Información sobre cómo realizar pedidos y solicitar cotizaciones', 3),
('Envío y Entrega', 'envio-entrega', 'Preguntas sobre envíos, tiempos de entrega y costos', 4),
('Soporte Técnico', 'soporte-tecnico', 'Preguntas técnicas y resolución de problemas', 5);

-- Insert sample FAQ items
INSERT INTO `faq_items` (`category_id`, `question`, `answer`, `sort_order`) VALUES
(1, '¿Qué tipos de productos industriales ofrecen?', 'Ofrecemos un catálogo completo de productos industriales incluyendo partes de maquinaria, herramientas, equipo de seguridad y componentes especializados para diversas industrias.', 1),
(1, '¿Cómo puedo contactar al soporte al cliente?', 'Puedes contactar a nuestro equipo de soporte al cliente a través de nuestro formulario de contacto, correo electrónico o teléfono. Normalmente respondemos dentro de 24 horas en días laborables.', 2),
(2, '¿Cómo encuentro las especificaciones del producto?', 'Cada página de producto incluye especificaciones detalladas, dibujos técnicos e información de compatibilidad. También puedes descargar catálogos de productos o contactar a nuestro equipo técnico para detalles adicionales.', 1),
(2, '¿Ofrecen productos personalizados o modificaciones?', 'Sí, trabajamos con fabricantes para proporcionar soluciones personalizadas basadas en tus requisitos específicos. Contacta a nuestro equipo de ventas para discutir tus necesidades.', 2),
(3, '¿Cómo solicito una cotización?', 'Puedes solicitar una cotización haciendo clic en el botón "Cotizar" en cualquier página de producto o llenando nuestro formulario de cotización. Responderemos con precios y disponibilidad dentro de 24-48 horas.', 1),
(3, '¿Qué información necesito proporcionar para una cotización?', 'Por favor proporciona detalles del producto, cantidades necesarias, ubicación de entrega y requisitos de tiempo. Entre más información específica proporciones, más precisa será nuestra cotización.', 2),
(4, '¿Cuáles son sus opciones de envío?', 'Ofrecemos envío terrestre estándar, entrega acelerada y envío de carga para pedidos grandes. Los costos de envío y tiempos de entrega varían según la ubicación y el tamaño del pedido.', 1),
(4, '¿Envían internacionalmente?', 'Sí, enviamos a muchos destinos internacionales. Contáctanos para tarifas de envío específicas y tiempos de entrega a tu ubicación.', 2),
(5, '¿Cómo soluciono problemas con productos?', 'Nuestro equipo de soporte técnico puede ayudarte a solucionar problemas. Por favor ten a la mano tu número de modelo del producto e información de compra al contactar al soporte.', 1);

-- Add notification settings for contact submissions
ALTER TABLE `admin_notifications` 
MODIFY COLUMN `notification_type` enum('quote_requests','general','system','contact_submissions','support_tickets') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'quote_requests';

-- Insert contact notification settings for existing admins
INSERT INTO `admin_notifications` (`admin_id`, `notification_type`, `is_enabled`)
SELECT `id`, 'contact_submissions', 1 FROM `admins` WHERE `is_active` = 1;

INSERT INTO `admin_notifications` (`admin_id`, `notification_type`, `is_enabled`)
SELECT `id`, 'support_tickets', 1 FROM `admins` WHERE `is_active` = 1;