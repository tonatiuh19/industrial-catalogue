-- Migration 012: Hero Carousel Slides
-- Creates a table to manage dynamic hero carousel slides from the admin panel

CREATE TABLE `hero_carousel_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `background_image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cta_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Ver Catálogo',
  `cta_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/catalog',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed with the current static slides
INSERT INTO `hero_carousel_slides` (`title`, `subtitle`, `description`, `background_image`, `cta_text`, `cta_link`, `sort_order`, `is_active`) VALUES
('Donde la Calidad', 'Encuentra la Innovación', 'Herramientas profesionales, equipamiento industrial y componentes de precisión para transformar tu negocio', 'https://disruptinglabs.com/data/api/data/industrial_catalogue/images/pexels-vladimirsrajber-18631420.jpg', 'Ver Catálogo Completo', '/catalog', 1, 1),
('Potencia Industrial', 'Sin Límites', 'Sistemas de transmisión de potencia, automatización y control industrial para maximizar la productividad de tu empresa', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Explorar Soluciones', '/catalog', 2, 1),
('Precisión Técnica', 'Resultados Excepcionales', 'Sistemas neumáticos, hidráulicos y herramientas especializadas diseñadas para cada aplicación industrial específica', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Descubre Más', '/catalog', 3, 1),
('Seguridad Industrial', 'Primera Prioridad', 'Equipos certificados y suministros industriales que garantizan operaciones seguras y cumplimiento normativo', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Ver Productos', '/catalog', 4, 1);
