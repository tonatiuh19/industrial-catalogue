-- Migration 007: Update quotes structure for new quotation system
-- Date: 2026-01-15

-- Add new columns to quotes table to match product-like structure
ALTER TABLE `quotes` 
  ADD COLUMN `brand` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `customer_message`,
  ADD COLUMN `product_type` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `brand`,
  ADD COLUMN `part_number` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `product_type`,
  ADD COLUMN `specifications` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `part_number`,
  ADD COLUMN `quantity` INT(11) DEFAULT 1 AFTER `specifications`,
  ADD COLUMN `city_state` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `quantity`,
  ADD COLUMN `preferred_contact_method` ENUM('email', 'phone', 'whatsapp') COLLATE utf8mb4_unicode_ci DEFAULT 'email' AFTER `city_state`,
  ADD COLUMN `brand_id` INT(11) DEFAULT NULL AFTER `preferred_contact_method`,
  ADD COLUMN `manufacturer_id` INT(11) DEFAULT NULL AFTER `brand_id`,
  ADD COLUMN `category_id` INT(11) DEFAULT NULL AFTER `manufacturer_id`,
  ADD COLUMN `subcategory_id` INT(11) DEFAULT NULL AFTER `category_id`;

-- Add indexes for better query performance
ALTER TABLE `quotes` 
  ADD INDEX `idx_brand_id` (`brand_id`),
  ADD INDEX `idx_manufacturer_id` (`manufacturer_id`),
  ADD INDEX `idx_category_id` (`category_id`),
  ADD INDEX `idx_subcategory_id` (`subcategory_id`);

-- Add foreign keys (optional, uncomment if you want referential integrity)
-- ALTER TABLE `quotes` 
--   ADD CONSTRAINT `fk_quotes_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
--   ADD CONSTRAINT `fk_quotes_manufacturer` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL,
--   ADD CONSTRAINT `fk_quotes_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
--   ADD CONSTRAINT `fk_quotes_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL;
