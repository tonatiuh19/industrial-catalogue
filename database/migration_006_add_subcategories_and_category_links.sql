-- Migration 006: Add subcategories table and category links to manufacturers and brands
-- This enables advanced filtering by category/subcategory
--
-- IMPORTANT NOTES:
-- ⚠️ Existing manufacturers and brands data will have NULL values for category_id and subcategory_id
-- ⚠️ This won't break the application, but you'll need to update these records via the admin UI
-- ⚠️ The foreign keys use ON DELETE SET NULL, so deleting a category/subcategory won't break references
-- ⚠️ After running this migration, use the admin interface to assign categories/subcategories to existing data

-- Create subcategories table
CREATE TABLE IF NOT EXISTS `subcategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category_id` int(11) NOT NULL,
  `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extra_images` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  KEY `is_active` (`is_active`),
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add category and subcategory links to manufacturers table
ALTER TABLE `manufacturers` 
  ADD COLUMN `category_id` int(11) DEFAULT NULL AFTER `description`,
  ADD COLUMN `subcategory_id` int(11) DEFAULT NULL AFTER `category_id`,
  ADD KEY `category_id` (`category_id`),
  ADD KEY `subcategory_id` (`subcategory_id`);

-- Add foreign key constraints for manufacturers
ALTER TABLE `manufacturers`
  ADD CONSTRAINT `manufacturers_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `manufacturers_subcategory_fk` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL;

-- Add category and subcategory links to brands table
ALTER TABLE `brands`
  ADD COLUMN `category_id` int(11) DEFAULT NULL AFTER `manufacturer_id`,
  ADD COLUMN `subcategory_id` int(11) DEFAULT NULL AFTER `category_id`,
  ADD KEY `category_id` (`category_id`),
  ADD KEY `subcategory_id` (`subcategory_id`);

-- Add foreign key constraints for brands
ALTER TABLE `brands`
  ADD CONSTRAINT `brands_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `brands_subcategory_fk` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL;

-- Insert sample subcategories based on existing categories
INSERT INTO `subcategories` (`name`, `slug`, `description`, `category_id`, `is_active`) VALUES
-- Transmisión de potencia (id: 7)
('Rodamientos', 'rodamientos', 'Rodamientos de bolas, rodillos y chumaceras para aplicaciones industriales', 7, 1),
('Bandas y Poleas', 'bandas-y-poleas', 'Bandas en V, sincrónicas, planas y poleas de transmisión', 7, 1),
('Cadenas y Sprockets', 'cadenas-y-sprockets', 'Cadenas de rodillos, cadenas de transmisión y sprockets industriales', 7, 1),
('Acoplamientos', 'acoplamientos', 'Acoplamientos flexibles, rígidos y de engrane para transmisión de potencia', 7, 1),
('Reductores de Velocidad', 'reductores-de-velocidad', 'Reductores de velocidad tipo corona, helicoidales y sin-fin', 7, 1),

-- Automatización y Control (id: 8)
('Sensores Industriales', 'sensores-industriales', 'Sensores inductivos, capacitivos, fotoeléctricos y ultrasónicos', 8, 1),
('Variadores de Frecuencia', 'variadores-de-frecuencia', 'Drives y variadores para control de velocidad de motores', 8, 1),
('PLC y Controladores', 'plc-y-controladores', 'Controladores lógicos programables y sistemas de control', 8, 1),
('HMI y Pantallas', 'hmi-y-pantallas', 'Interfaces hombre-máquina y pantallas táctiles industriales', 8, 1),

-- Neumática e Hidráulica (id: 9)
('Válvulas Neumáticas', 'valvulas-neumaticas', 'Válvulas direccionales, reguladoras de presión y caudal', 9, 1),
('Cilindros Neumáticos', 'cilindros-neumaticos', 'Cilindros de simple y doble efecto para automatización', 9, 1),
('Mangueras y Conexiones', 'mangueras-y-conexiones', 'Mangueras hidráulicas, neumáticas y accesorios de conexión', 9, 1),
('Bombas Hidráulicas', 'bombas-hidraulicas', 'Bombas de engranajes, pistones y paletas para sistemas hidráulicos', 9, 1),

-- Herramientas y Equipo de Mantenimiento (id: 10)
('Herramientas Manuales', 'herramientas-manuales', 'Llaves, desarmadores, pinzas y herramientas de mano', 10, 1),
('Herramientas Eléctricas', 'herramientas-electricas', 'Taladros, esmeriles, pulidoras y equipos eléctricos portátiles', 10, 1),
('Equipos de Medición', 'equipos-de-medicion', 'Multímetros, calibradores, termómetros y equipos de diagnóstico', 10, 1),
('Equipos de Soldadura', 'equipos-de-soldadura', 'Equipos de soldadura eléctrica, MIG, TIG y accesorios', 10, 1),

-- Suministros Industriales (id: 11)
('Tornillería', 'tornilleria', 'Tornillos, tuercas, arandelas y elementos de fijación', 11, 1),
('Lubricantes', 'lubricantes', 'Aceites, grasas y lubricantes industriales', 11, 1),
('Adhesivos y Selladores', 'adhesivos-y-selladores', 'Pegamentos industriales, selladores y cintas adhesivas', 11, 1),
('Abrasivos', 'abrasivos', 'Discos de corte, lijas, piedras de esmeril y abrasivos', 11, 1),

-- Seguridad Industrial (EPP) (id: 12)
('Protección Respiratoria', 'proteccion-respiratoria', 'Mascarillas, respiradores y equipos de protección respiratoria', 12, 1),
('Protección Auditiva', 'proteccion-auditiva', 'Tapones, orejeras y protectores auditivos', 12, 1),
('Protección Visual', 'proteccion-visual', 'Gafas de seguridad, caretas y protectores faciales', 12, 1),
('Guantes de Seguridad', 'guantes-de-seguridad', 'Guantes industriales para protección contra riesgos mecánicos y químicos', 12, 1),

-- Maquinaria y Equipos (id: 13)
('Motores Eléctricos', 'motores-electricos', 'Motores trifásicos, monofásicos y especiales para aplicaciones industriales', 13, 1),
('Compresores', 'compresores', 'Compresores de aire de pistón, tornillo y equipos de compresión', 13, 1),
('Bombas Industriales', 'bombas-industriales', 'Bombas centrífugas, sumergibles y de proceso industrial', 13, 1),

-- Servicios Industriales (id: 14)
('Mantenimiento Preventivo', 'mantenimiento-preventivo', 'Servicios programados de mantenimiento para equipos industriales', 14, 1),
('Consultoría Técnica', 'consultoria-tecnica', 'Asesoría técnica especializada para proyectos industriales', 14, 1),
('Proyectos Especiales', 'proyectos-especiales', 'Desarrollo e integración de soluciones industriales a medida', 14, 1);

-- Update existing manufacturers with appropriate categories and subcategories
-- SKF (id: 10) - Transmission/Bearings
UPDATE `manufacturers` SET category_id = 7, subcategory_id = 1 WHERE id = 10;

-- NSK (id: 11) - Transmission/Bearings  
UPDATE `manufacturers` SET category_id = 7, subcategory_id = 1 WHERE id = 11;

-- ABB (id: 12) - Automation & Control / Automation (generic - they make many products)
UPDATE `manufacturers` SET category_id = 8, subcategory_id = NULL WHERE id = 12;

-- Baldor-Reliance (id: 13) - Machinery / Electric Motors
UPDATE `manufacturers` SET category_id = 13, subcategory_id = 31 WHERE id = 13;

-- Siemens (id: 14) - Automation & Control (generic - they make many products)
UPDATE `manufacturers` SET category_id = 8, subcategory_id = NULL WHERE id = 14;

-- WEG (id: 15) - Machinery / Electric Motors
UPDATE `manufacturers` SET category_id = 13, subcategory_id = 31 WHERE id = 15;

-- Marathon (id: 16) - Machinery / Electric Motors
UPDATE `manufacturers` SET category_id = 13, subcategory_id = 31 WHERE id = 16;

-- Update existing brands with appropriate categories and subcategories
-- SKF brand (id: 9) - Transmission/Bearings
UPDATE `brands` SET category_id = 7, subcategory_id = 1 WHERE id = 9;

-- NSK brand (id: 10) - Transmission/Bearings
UPDATE `brands` SET category_id = 7, subcategory_id = 1 WHERE id = 10;

-- ABB brand (id: 11) - Automation & Control
UPDATE `brands` SET category_id = 8, subcategory_id = NULL WHERE id = 11;

-- WEG brand (id: 12) - Machinery / Electric Motors
UPDATE `brands` SET category_id = 13, subcategory_id = 31 WHERE id = 12;

-- Siemens brand (id: 13) - Automation & Control
UPDATE `brands` SET category_id = 8, subcategory_id = NULL WHERE id = 13;

-- Baldor-Reliance brand (id: 14) - Machinery / Electric Motors
UPDATE `brands` SET category_id = 13, subcategory_id = 31 WHERE id = 14;

-- Marathon brand (id: 15) - Machinery / Electric Motors
UPDATE `brands` SET category_id = 13, subcategory_id = 31 WHERE id = 15;


