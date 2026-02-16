-- Add missing columns to products table
ALTER TABLE products 
  ADD COLUMN main_image VARCHAR(500) DEFAULT NULL,
  ADD COLUMN extra_images TEXT DEFAULT NULL,
  ADD COLUMN min_stock_level INT(11) DEFAULT 0;
