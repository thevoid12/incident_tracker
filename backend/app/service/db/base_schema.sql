CREATE TABLE if not exists users (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role BYTEA,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL, 
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT NOT NULL, 
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE if not exists incident_tracker(
id SERIAL PRIMARY KEY,
title VARCHAR(200) NOT NULL,
description TEXT,
status VARCHAR(50) CHECK (status IN ('Open', 'In Progress', 'Resolved')) DEFAULT 'Open',
priority VARCHAR(50) CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_by TEXT NOT NULL,
updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_by TEXT NOT NULL, 
is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX if not exists idx_incident_tracker_status ON incident_tracker(status);

CREATE INDEX if not exists idx_incident_tracker_created_on ON incident_tracker(created_on);