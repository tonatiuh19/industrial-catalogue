-- Migration: Add admin authentication tables
-- Date: 2025-12-17
-- Description: Tables required for admin session management and verification codes

-- Admin sessions table - stores active admin login sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL,
  session_token VARCHAR(64) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  INDEX idx_session_token (session_token),
  INDEX idx_admin_id (admin_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin verification codes table - stores one-time verification codes for login
CREATE TABLE IF NOT EXISTS admin_verification_codes (
  admin_id INT PRIMARY KEY,
  code INT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add content_pages table if it doesn't exist
CREATE TABLE IF NOT EXISTS content_pages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_published BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_is_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensure admins table has all required fields
-- Run this if upgrading from an older schema
ALTER TABLE admins 
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Clean up expired verification codes (scheduled task recommendation)
-- Run this periodically via cron job or Vercel cron
-- DELETE FROM admin_verification_codes WHERE expires_at < NOW();

-- Clean up expired sessions (scheduled task recommendation)
-- UPDATE admin_sessions SET is_active = 0 WHERE expires_at < NOW() AND is_active = 1;
