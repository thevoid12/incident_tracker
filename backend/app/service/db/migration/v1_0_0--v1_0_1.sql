-- migration script from version 1.0.0 ->1.0.1

-- adding assigned to column
-- Step 1: Add column as nullable first
ALTER TABLE incident_tracker 
ADD COLUMN assigned_to TEXT;
-- Step 2: Copying values from created_by into assigned_to
UPDATE incident_tracker
SET assigned_to = created_by;

-- Step 3: Set NOT NULL constraint
ALTER TABLE incident_tracker
ALTER COLUMN assigned_to SET NOT NULL;

-- adding a new column for chat
ALTER TABLE incident_tracker
ADD COLUMN chat JSONB DEFAULT '[]'::jsonb;