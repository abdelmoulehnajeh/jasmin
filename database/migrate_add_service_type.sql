-- ========================================
-- MIGRATION SCRIPT: Add Service Type Feature
-- ========================================
-- This script adds the service type feature to an existing database
-- Run this ONLY if you have an existing database to migrate
-- For new installations, use database/init.sql instead

-- ========================================
-- STEP 1: Backup Reminder
-- ========================================
-- IMPORTANT: Before running this script, backup your database!
-- pg_dump -U username dbname > backup_$(date +%Y%m%d_%H%M%S).sql

-- ========================================
-- STEP 2: Create ENUM Type
-- ========================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_type') THEN
        CREATE TYPE service_type AS ENUM ('marriage', 'transfer');
        RAISE NOTICE 'Created service_type ENUM';
    ELSE
        RAISE NOTICE 'service_type ENUM already exists, skipping...';
    END IF;
END $$;

-- ========================================
-- STEP 3: Add service_type to users table
-- ========================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='service_type'
    ) THEN
        ALTER TABLE users ADD COLUMN service_type service_type DEFAULT 'marriage';
        RAISE NOTICE 'Added service_type column to users table';
    ELSE
        RAISE NOTICE 'service_type column already exists in users table, skipping...';
    END IF;
END $$;

-- ========================================
-- STEP 4: Add service_type to cars table
-- ========================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='cars' AND column_name='service_type'
    ) THEN
        ALTER TABLE cars ADD COLUMN service_type service_type DEFAULT 'marriage';
        RAISE NOTICE 'Added service_type column to cars table';
    ELSE
        RAISE NOTICE 'service_type column already exists in cars table, skipping...';
    END IF;
END $$;

-- ========================================
-- STEP 5: Create indexes for performance
-- ========================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename='users' AND indexname='idx_users_service_type'
    ) THEN
        CREATE INDEX idx_users_service_type ON users(service_type);
        RAISE NOTICE 'Created index idx_users_service_type';
    ELSE
        RAISE NOTICE 'Index idx_users_service_type already exists, skipping...';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename='cars' AND indexname='idx_cars_service_type'
    ) THEN
        CREATE INDEX idx_cars_service_type ON cars(service_type);
        RAISE NOTICE 'Created index idx_cars_service_type';
    ELSE
        RAISE NOTICE 'Index idx_cars_service_type already exists, skipping...';
    END IF;
END $$;

-- ========================================
-- STEP 6: Update existing data (OPTIONAL)
-- ========================================
-- This categorizes existing cars based on typical use cases
-- Modify these rules based on your business needs

-- Set SUVs and large vehicles to 'transfer'
UPDATE cars 
SET service_type = 'transfer' 
WHERE (
    LOWER(model) LIKE '%x5%' OR 
    LOWER(model) LIKE '%x7%' OR 
    LOWER(model) LIKE '%range rover%' OR
    LOWER(model) LIKE '%suburban%' OR
    LOWER(model) LIKE '%escalade%' OR
    LOWER(brand) LIKE '%tesla%'
) AND service_type = 'marriage';

-- Set luxury sedans to 'marriage'
UPDATE cars 
SET service_type = 'marriage' 
WHERE (
    LOWER(model) LIKE '%s-class%' OR 
    LOWER(model) LIKE '%a8%' OR 
    LOWER(model) LIKE '%7 series%' OR
    LOWER(model) LIKE '%cayenne%' OR
    LOWER(brand) LIKE '%rolls%' OR
    LOWER(brand) LIKE '%bentley%'
) AND service_type = 'transfer';

-- ========================================
-- STEP 7: Verify Migration
-- ========================================
-- Check counts
DO $$
DECLARE
    user_count INT;
    car_count INT;
    marriage_cars INT;
    transfer_cars INT;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO car_count FROM cars;
    SELECT COUNT(*) INTO marriage_cars FROM cars WHERE service_type = 'marriage';
    SELECT COUNT(*) INTO transfer_cars FROM cars WHERE service_type = 'transfer';
    
    RAISE NOTICE 'Migration Complete!';
    RAISE NOTICE '==================';
    RAISE NOTICE 'Total Users: %', user_count;
    RAISE NOTICE 'Total Cars: %', car_count;
    RAISE NOTICE 'Marriage Cars: %', marriage_cars;
    RAISE NOTICE 'Transfer Cars: %', transfer_cars;
    RAISE NOTICE '==================';
END $$;

-- Display sample data
SELECT 'Sample Cars by Service Type' as info;
SELECT service_type, brand, model, COUNT(*) as count
FROM cars
GROUP BY service_type, brand, model
ORDER BY service_type, brand, model;

-- ========================================
-- STEP 8: Test Queries
-- ========================================
-- These queries should work after migration

-- Get all marriage cars
-- SELECT * FROM cars WHERE service_type = 'marriage' AND status = 'AVAILABLE';

-- Get all transfer cars
-- SELECT * FROM cars WHERE service_type = 'transfer' AND status = 'AVAILABLE';

-- Get user with service preference
-- SELECT email, full_name, service_type FROM users;

-- ========================================
-- ROLLBACK SCRIPT (Keep this for safety)
-- ========================================
-- If you need to rollback this migration, run:
/*
-- Remove indexes
DROP INDEX IF EXISTS idx_users_service_type;
DROP INDEX IF EXISTS idx_cars_service_type;

-- Remove columns
ALTER TABLE users DROP COLUMN IF EXISTS service_type;
ALTER TABLE cars DROP COLUMN IF EXISTS service_type;

-- Remove ENUM type (only if not used elsewhere)
DROP TYPE IF EXISTS service_type;

-- Restore from backup
-- psql -U username -d dbname < backup_YYYYMMDD_HHMMSS.sql
*/

-- ========================================
-- MIGRATION COMPLETE
-- ========================================
-- Next Steps:
-- 1. Verify data looks correct
-- 2. Test the application
-- 3. Update frontend code (already done in this package)
-- 4. Deploy changes

RAISE NOTICE 'Migration script completed successfully!';
RAISE NOTICE 'Please verify the data and test your application.';
