-- =====================================================
-- Add gender column to flats table in pg_connect database
-- Run this SQL on your pg_connect database (DB_NAME2)
-- =====================================================

-- Step 1: Add gender column to flats table
ALTER TABLE flats 
ADD COLUMN gender VARCHAR(10) DEFAULT NULL;

-- Step 2: Update existing flats with gender values
-- Modify the IDs and gender values according to your actual flats
-- Example updates (adjust based on your flat IDs):

-- Update specific flats to Male
-- UPDATE flats SET gender = 'Male' WHERE id IN (1, 2, 3);

-- Update specific flats to Female
-- UPDATE flats SET gender = 'Female' WHERE id IN (4, 5, 6);

-- OR update all at once with CASE statement (example):
-- UPDATE flats SET gender = CASE 
--     WHEN id IN (1, 2, 3) THEN 'Male'
--     WHEN id IN (4, 5, 6) THEN 'Female'
--     ELSE NULL
-- END;

-- Step 3: Verify the changes
SELECT id, title, area, gender FROM flats;
