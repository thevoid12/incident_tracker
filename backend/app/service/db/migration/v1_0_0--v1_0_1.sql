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

-- creating a new table called audittrail
CREATE TABLE IF NOT exists audit_trail (
id TEXT PRIMARY KEY,
user_action TEXT NOT NULL,
description TEXT,
email TEXT NOT NULL,
created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_by TEXT NOT NULL,
updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_by TEXT NOT NULL,
is_deleted BOOLEAN DEFAULT FALSE
);

-- adding a new column for chat
ALTER TABLE users
ADD COLUMN role_name TEXT;


-- set default Admin role for existing users with all permissions (0x00)
UPDATE users SET role_name = 'Admin', role = '\x00' WHERE role_name IS NULL;