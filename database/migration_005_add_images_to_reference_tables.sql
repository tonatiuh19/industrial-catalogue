-- Migration 005: Add image columns to categories, manufacturers, and brands tables
-- Date: 2026-01-15
-- Description: Adds main_image and extra_images columns to categories, manufacturers, and brands
-- similar to the products table structure

-- Add image columns to categories table
ALTER TABLE `categories` 
ADD COLUMN `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `slug`,
ADD COLUMN `extra_images` text COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `main_image`;

-- Add image columns to manufacturers table  
ALTER TABLE `manufacturers`
ADD COLUMN `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `description`,
ADD COLUMN `extra_images` text COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `main_image`;

-- Add image columns to brands table
ALTER TABLE `brands`
ADD COLUMN `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `description`,
ADD COLUMN `extra_images` text COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `main_image`;

-- Note: logo_url columns remain for backwards compatibility and can be used as alternative
-- main_image is the new standard field for primary image
-- extra_images stores a JSON array of additional image URLs
