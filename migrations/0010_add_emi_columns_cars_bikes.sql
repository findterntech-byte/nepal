ALTER TABLE cars_bikes ADD COLUMN IF NOT EXISTS emi_available BOOLEAN DEFAULT false;
ALTER TABLE cars_bikes ADD COLUMN IF NOT EXISTS emi_starting_from DECIMAL(10, 2);
ALTER TABLE cars_bikes ADD COLUMN IF NOT EXISTS emi_months INTEGER;

ALTER TABLE phones_tablets_accessories ADD COLUMN IF NOT EXISTS emi_available BOOLEAN DEFAULT false;
ALTER TABLE phones_tablets_accessories ADD COLUMN IF NOT EXISTS emi_starting_from DECIMAL(10, 2);
ALTER TABLE phones_tablets_accessories ADD COLUMN IF NOT EXISTS emi_months INTEGER;

ALTER TABLE electronics_gadgets ADD COLUMN IF NOT EXISTS emi_available BOOLEAN DEFAULT false;
ALTER TABLE electronics_gadgets ADD COLUMN IF NOT EXISTS emi_starting_from DECIMAL(10, 2);
ALTER TABLE electronics_gadgets ADD COLUMN IF NOT EXISTS emi_months INTEGER;

ALTER TABLE heavy_equipment ADD COLUMN IF NOT EXISTS emi_available BOOLEAN DEFAULT false;
ALTER TABLE heavy_equipment ADD COLUMN IF NOT EXISTS emi_starting_from DECIMAL(10, 2);
ALTER TABLE heavy_equipment ADD COLUMN IF NOT EXISTS emi_months INTEGER;

ALTER TABLE second_hand_cars_bikes ADD COLUMN IF NOT EXISTS emi_available BOOLEAN DEFAULT false;
ALTER TABLE second_hand_cars_bikes ADD COLUMN IF NOT EXISTS emi_starting_from DECIMAL(10, 2);
ALTER TABLE second_hand_cars_bikes ADD COLUMN IF NOT EXISTS emi_months INTEGER;

ALTER TABLE showrooms ADD COLUMN IF NOT EXISTS emi_available BOOLEAN DEFAULT false;
ALTER TABLE showrooms ADD COLUMN IF NOT EXISTS emi_starting_from DECIMAL(10, 2);
ALTER TABLE showrooms ADD COLUMN IF NOT EXISTS emi_months INTEGER;
