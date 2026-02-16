-- Migration: Add Manufacturers, Brands, and Models tables
-- Run this after the initial schema is deployed

-- ============================================
-- Table: manufacturers
-- ============================================
CREATE TABLE IF NOT EXISTS manufacturers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  website VARCHAR(255),
  logo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: brands
-- ============================================
CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  manufacturer_id INT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_manufacturer (manufacturer_id),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: models
-- ============================================
CREATE TABLE IF NOT EXISTS models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  brand_id INT NOT NULL,
  description TEXT,
  specifications JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE RESTRICT,
  INDEX idx_name (name),
  INDEX idx_brand (brand_id),
  INDEX idx_active (is_active),
  UNIQUE KEY unique_brand_model (brand_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Migrate existing data
-- ============================================

-- Extract unique manufacturers from products
INSERT INTO manufacturers (name)
SELECT DISTINCT p.manufacturer
FROM products p
WHERE p.manufacturer IS NOT NULL AND p.manufacturer != ''
ON DUPLICATE KEY UPDATE manufacturers.name = manufacturers.name;

-- Extract unique brands from products
INSERT INTO brands (name, manufacturer_id)
SELECT DISTINCT 
  p.brand,
  m.id
FROM products p
LEFT JOIN manufacturers m ON p.manufacturer = m.name
WHERE p.brand IS NOT NULL AND p.brand != ''
ON DUPLICATE KEY UPDATE brands.name = brands.name;

-- Extract unique models from products
INSERT INTO models (name, brand_id)
SELECT DISTINCT 
  p.model,
  b.id
FROM products p
LEFT JOIN brands b ON p.brand = b.name
WHERE p.model IS NOT NULL AND p.model != '' AND b.id IS NOT NULL
ON DUPLICATE KEY UPDATE models.name = models.name;

-- ============================================
-- Add new foreign key columns to products
-- ============================================

-- Check if columns exist before adding them
SET @col_exists = (
  SELECT COUNT(*) 
  FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'products' 
  AND COLUMN_NAME = 'manufacturer_id'
);

-- Add new columns only if they don't exist
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE products 
   ADD COLUMN manufacturer_id INT NULL AFTER category_id,
   ADD COLUMN brand_id INT NULL AFTER manufacturer_id,
   ADD COLUMN model_id INT NULL AFTER brand_id',
  'SELECT "Columns already exist" as status'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Populate new foreign key columns (safe to run multiple times)
UPDATE products p
LEFT JOIN manufacturers m ON p.manufacturer = m.name
SET p.manufacturer_id = m.id
WHERE p.manufacturer IS NOT NULL AND (p.manufacturer_id IS NULL OR p.manufacturer_id != m.id);

UPDATE products p
LEFT JOIN brands b ON p.brand = b.name
SET p.brand_id = b.id
WHERE p.brand IS NOT NULL AND (p.brand_id IS NULL OR p.brand_id != b.id);

UPDATE products p
LEFT JOIN models mo ON p.model = mo.name
LEFT JOIN brands b ON p.brand_id = b.id
SET p.model_id = mo.id
WHERE p.model IS NOT NULL 
  AND mo.brand_id = b.id 
  AND (p.model_id IS NULL OR p.model_id != mo.id);

-- Add foreign key constraints only if they don't exist
SET @constraint_exists = (
  SELECT COUNT(*) 
  FROM information_schema.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'products' 
  AND CONSTRAINT_NAME = 'fk_products_manufacturer'
);

SET @sql = IF(@constraint_exists = 0,
  'ALTER TABLE products
   ADD CONSTRAINT fk_products_manufacturer 
     FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id) ON DELETE SET NULL,
   ADD CONSTRAINT fk_products_brand 
     FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
   ADD CONSTRAINT fk_products_model 
     FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE SET NULL',
  'SELECT "Foreign key constraints already exist" as status'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add indexes only if they don't exist
SET @index_exists = (
  SELECT COUNT(*) 
  FROM information_schema.STATISTICS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'products' 
  AND INDEX_NAME = 'idx_manufacturer_id'
);

SET @sql = IF(@index_exists = 0,
  'ALTER TABLE products
   ADD INDEX idx_manufacturer_id (manufacturer_id),
   ADD INDEX idx_brand_id (brand_id),
   ADD INDEX idx_model_id (model_id)',
  'SELECT "Indexes already exist" as status'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- Optional: Remove old text columns (CAREFUL!)
-- Uncomment these lines ONLY after verifying data migration is successful
-- ============================================

-- ALTER TABLE products DROP COLUMN manufacturer;
-- ALTER TABLE products DROP COLUMN brand;
-- ALTER TABLE products DROP COLUMN model;

-- ============================================
-- Verify migration
-- ============================================

-- Check manufacturers
SELECT 'Manufacturers' as 'Table', COUNT(*) as 'Records' FROM manufacturers
UNION ALL
SELECT 'Brands', COUNT(*) FROM brands
UNION ALL
SELECT 'Models', COUNT(*) FROM models
UNION ALL
SELECT 'Products with manufacturer_id', COUNT(*) FROM products WHERE manufacturer_id IS NOT NULL
UNION ALL
SELECT 'Products with brand_id', COUNT(*) FROM products WHERE brand_id IS NOT NULL
UNION ALL
SELECT 'Products with model_id', COUNT(*) FROM products WHERE model_id IS NOT NULL;
