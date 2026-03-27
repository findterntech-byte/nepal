ALTER TABLE service_centre_warranty ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE telecommunication_services ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
