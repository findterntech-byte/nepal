ALTER TABLE schools_colleges_coaching ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
