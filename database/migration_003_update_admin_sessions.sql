-- Migration 003: Update admin_sessions table structure
-- Description: Ensures admin_sessions has correct indexes and constraints for authentication
-- Run date: 2025-12-08

-- Add indexes if they don't exist (MySQL will skip if they already exist)
ALTER TABLE `admin_sessions`
  ADD INDEX IF NOT EXISTS `idx_user_session` (`user_id`, `session_code`),
  ADD INDEX IF NOT EXISTS `idx_expires_at` (`expires_at`),
  ADD INDEX IF NOT EXISTS `idx_is_active` (`is_active`);

-- Add foreign key constraint if it doesn't exist
ALTER TABLE `admin_sessions`
  ADD CONSTRAINT `fk_admin_sessions_user` 
  FOREIGN KEY IF NOT EXISTS (`user_id`) 
  REFERENCES `admins` (`id`) 
  ON DELETE CASCADE;

-- Ensure proper field types
ALTER TABLE `admin_sessions`
  MODIFY COLUMN `session_code` INT(6) NOT NULL,
  MODIFY COLUMN `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  MODIFY COLUMN `expires_at` TIMESTAMP NOT NULL,
  MODIFY COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
