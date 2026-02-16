-- Migration: Add product images columns
-- Created: 2025-12-09
-- Description: Adds main_image and extra_images columns to products table

-- Add main_image column for single main product image path
ALTER TABLE products ADD COLUMN main_image VARCHAR(500);

-- Add extra_images column for JSON array of additional image paths  
ALTER TABLE products ADD COLUMN extra_images TEXT;
