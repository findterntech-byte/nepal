-- Add user_id and role columns for seller-owned records

ALTER TABLE clinics_hospitals
  ADD COLUMN IF NOT EXISTS user_id VARCHAR,
  ADD COLUMN IF NOT EXISTS role TEXT;

ALTER TABLE diagnostic_labs
  ADD COLUMN IF NOT EXISTS user_id VARCHAR,
  ADD COLUMN IF NOT EXISTS role TEXT;

ALTER TABLE fitness_trainers
  ADD COLUMN IF NOT EXISTS user_id VARCHAR,
  ADD COLUMN IF NOT EXISTS role TEXT;
