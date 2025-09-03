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
