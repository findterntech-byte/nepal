ALTER TABLE computer_mobile_laptop_repair_services ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
