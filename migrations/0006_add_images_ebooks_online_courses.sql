ALTER TABLE ebooks_online_courses ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
