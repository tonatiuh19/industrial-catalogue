-- Migration 003: Remove thumbnail_url column from products table
-- This column is replaced by main_image and extra_images

-- Remove thumbnail_url column (MySQL doesn't support IF EXISTS in DROP COLUMN)
ALTER TABLE products DROP COLUMN thumbnail_url;

-- Add comment to document the change
ALTER TABLE products COMMENT = 'Products table - updated to use main_image and extra_images instead of thumbnail_url';
