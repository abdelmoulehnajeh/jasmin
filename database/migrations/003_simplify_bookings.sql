-- Migration: Simplify Bookings Table
-- 1. Remove pickup and dropoff location columns
-- 2. Ensure start_date and end_date are TIMESTAMPs

-- Drop columns
ALTER TABLE bookings DROP COLUMN IF EXISTS pickup_location;
ALTER TABLE bookings DROP COLUMN IF EXISTS dropoff_location;

-- Alter column types to TIMESTAMP (preserving data if possible, though casting DATE to TIMESTAMP is trivial)
ALTER TABLE bookings ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::TIMESTAMP;
ALTER TABLE bookings ALTER COLUMN end_date TYPE TIMESTAMP USING end_date::TIMESTAMP;
