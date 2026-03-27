-- Add pageType and categoryId columns to sliders table
ALTER TABLE sliders ADD COLUMN page_type VARCHAR;
ALTER TABLE sliders ADD COLUMN category_id VARCHAR REFERENCES admin_categories(id) ON DELETE SET NULL;
