-- Migration 011: Brand-Categories many-to-many relationship
-- Creates a brand_categories join table so a brand can belong to N categories.
-- Migrates existing category_id data from the brands table into the new join table.
-- The old category_id column is kept nullable for backward-compatibility but is
-- no longer the source of truth; brand_categories is.

-- 1. Create the join table
CREATE TABLE IF NOT EXISTS `brand_categories` (
  `brand_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`brand_id`, `category_id`),
  KEY `idx_brand_categories_brand_id` (`brand_id`),
  KEY `idx_brand_categories_category_id` (`category_id`),
  CONSTRAINT `fk_bc_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Migrate existing category_id data into the new table
INSERT IGNORE INTO `brand_categories` (`brand_id`, `category_id`)
SELECT `id`, `category_id`
FROM `brands`
WHERE `category_id` IS NOT NULL;
