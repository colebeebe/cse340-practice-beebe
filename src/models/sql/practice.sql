-- Practice database tables for assignments
-- This file accumulates changes from multiple assignments
-- Add new tables and modifications here as you work through the course

-- Contact form tables
CREATE TABLE IF NOT EXISTS contact_form (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  message TEXT NOT NULL,
  submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
