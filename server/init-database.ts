import { db } from "./db";
import { sql } from "drizzle-orm";

export async function initDatabase() {
  try {
    console.log("Initializing database...");

    // Test database connection first
    try {
      await db.execute(sql`SELECT 1`);
      console.log("✅ Database connection successful");
    } catch (connError) {
      console.error("❌ Database connection failed:", connError);
      throw new Error("Cannot connect to database. Please ensure DATABASE_URL is correct and the database is accessible.");
    }

    // Create update trigger function first (if not exists)
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    // Create admin_categories table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_categories (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        color TEXT DEFAULT '#1e40af',
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create admin_subcategories table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_subcategories (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        color TEXT,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        parent_category_id VARCHAR NOT NULL REFERENCES admin_categories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS pro_profile_types (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS pro_profile_fields (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        profile_type_id VARCHAR NOT NULL REFERENCES pro_profile_types(id) ON DELETE CASCADE,
        key TEXT NOT NULL,
        label TEXT NOT NULL,
        field_type TEXT NOT NULL,
        is_required BOOLEAN DEFAULT false,
        placeholder TEXT,
        help_text TEXT,
        sort_order INTEGER DEFAULT 0,
        options JSONB DEFAULT '[]'::jsonb,
        config JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS pro_profiles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        profile_type_id VARCHAR NOT NULL REFERENCES pro_profile_types(id) ON DELETE RESTRICT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      ALTER TABLE pro_profiles
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS pro_profile_values (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        profile_id VARCHAR NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
        field_id VARCHAR NOT NULL REFERENCES pro_profile_fields(id) ON DELETE CASCADE,
        value JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create industrial_land table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS industrial_land (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        listing_type TEXT NOT NULL,
        price NUMERIC(12,2) NOT NULL,
        area NUMERIC(10,2) NOT NULL,
        area_unit TEXT DEFAULT 'ropani',
        land_type TEXT,
        zoning TEXT,
        road_access TEXT,
        electricity_available BOOLEAN DEFAULT FALSE,
        water_supply BOOLEAN DEFAULT FALSE,
        sewerage_available BOOLEAN DEFAULT FALSE,
        images JSONB DEFAULT '[]',
        documents JSONB DEFAULT '[]',
        suitable_for JSONB DEFAULT '[]',
        country TEXT NOT NULL DEFAULT 'India',
        state_province TEXT,
        city TEXT,
        area_name TEXT,
        full_address TEXT,
        location_id VARCHAR,
        agency_id VARCHAR,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create cars_bikes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cars_bikes (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        listing_type TEXT NOT NULL,
        vehicle_type TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        price NUMERIC(12,2) NOT NULL,
        kilometers_driven INTEGER,
        fuel_type TEXT,
        transmission TEXT,
        owner_number INTEGER,
        registration_number TEXT,
        registration_state TEXT,
        insurance_valid_until TIMESTAMP,
        color TEXT,
        images JSONB DEFAULT '[]',
        documents JSONB DEFAULT '[]',
        features JSONB DEFAULT '[]',
        condition TEXT,
        is_negotiable BOOLEAN DEFAULT FALSE,
        country TEXT NOT NULL DEFAULT 'India',
        state_province TEXT,
        city TEXT,
        area_name TEXT,
        full_address TEXT,
        location_id VARCHAR,
        seller_id VARCHAR,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Add educational service tables
    await db.execute(sql`CREATE TABLE IF NOT EXISTS tuition_private_classes (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      description TEXT,
      listing_type TEXT NOT NULL,
      subject_category TEXT NOT NULL,
      subjects_offered JSONB DEFAULT '[]'::jsonb,
      teaching_mode TEXT NOT NULL,
      class_type TEXT NOT NULL,
      tutor_name TEXT NOT NULL,
      tutor_qualification TEXT,
      tutor_experience_years INTEGER,
      grade_level TEXT,
      min_grade INTEGER,
      max_grade INTEGER,
      board TEXT,
      batch_size INTEGER,
      fee_per_hour DECIMAL(10,2),
      fee_per_month DECIMAL(10,2),
      fee_per_subject DECIMAL(10,2),
      demo_class_available BOOLEAN DEFAULT false,
      study_material_provided BOOLEAN DEFAULT false,
      test_series_included BOOLEAN DEFAULT false,
      doubt_clearing_sessions BOOLEAN DEFAULT false,
      flexible_timings BOOLEAN DEFAULT false,
      weekend_classes BOOLEAN DEFAULT false,
      home_tuition_available BOOLEAN DEFAULT false,
      online_classes_available BOOLEAN DEFAULT false,
      contact_person TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_email TEXT,
      country TEXT NOT NULL DEFAULT 'India',
      state_province TEXT,
      city TEXT,
      area_name TEXT,
      full_address TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      user_id VARCHAR REFERENCES users(id),
      role TEXT
    )`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS dance_karate_gym_yoga (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      description TEXT,
      class_category TEXT NOT NULL,
      class_type TEXT NOT NULL,
      instructor_name TEXT NOT NULL,
      instructor_qualification TEXT,
      instructor_experience_years INTEGER,
      fee_per_month DECIMAL(10,2) NOT NULL,
      fee_per_session DECIMAL(10,2),
      registration_fee DECIMAL(10,2),
      session_duration_minutes INTEGER,
      sessions_per_week INTEGER,
      batch_size INTEGER,
      trial_class_available BOOLEAN DEFAULT false,
      certification_provided BOOLEAN DEFAULT false,
      equipment_provided BOOLEAN DEFAULT false,
      weekend_batches BOOLEAN DEFAULT false,
      contact_person TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_email TEXT,
      country TEXT NOT NULL DEFAULT 'India',
      state_province TEXT,
      city TEXT,
      area_name TEXT,
      full_address TEXT NOT NULL,
      images JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      user_id VARCHAR REFERENCES users(id),
      role TEXT
    )`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS language_classes (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      description TEXT,
      listing_type TEXT NOT NULL,
      language_name TEXT NOT NULL,
      proficiency_level TEXT NOT NULL,
      course_duration_months INTEGER NOT NULL,
      classes_per_week INTEGER,
      class_duration_hours DECIMAL(4,2),
      teaching_mode TEXT,
      class_type TEXT,
      batch_size INTEGER,
      instructor_name TEXT,
      instructor_qualification TEXT,
      instructor_experience INTEGER,
      native_speaker BOOLEAN DEFAULT false,
      fee_per_month DECIMAL(10,2) NOT NULL,
      registration_fee DECIMAL(10,2),
      total_course_fee DECIMAL(10,2),
      study_materials_provided JSONB DEFAULT '[]'::jsonb,
      certification_provided BOOLEAN DEFAULT false,
      free_demo_class BOOLEAN DEFAULT false,
      images JSONB DEFAULT '[]'::jsonb,
      contact_person TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_email TEXT,
      country TEXT NOT NULL DEFAULT 'India',
      state_province TEXT,
      city TEXT,
      area_name TEXT,
      full_address TEXT,
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      user_id VARCHAR REFERENCES users(id),
      role TEXT
    )`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS academies_music_arts_sports (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      description TEXT,
      academy_category TEXT NOT NULL,
      specialization TEXT,
      established_year INTEGER,
      courses_offered JSONB DEFAULT '[]'::jsonb,
      class_type TEXT,
      age_group TEXT,
      course_duration_months INTEGER,
      fee_per_month DECIMAL(10,2) NOT NULL,
      admission_fee DECIMAL(10,2),
      instrument_rental_fee DECIMAL(10,2),
      certification_offered BOOLEAN DEFAULT false,
      free_trial_class BOOLEAN DEFAULT false,
      facilities JSONB DEFAULT '[]'::jsonb,
      air_conditioned BOOLEAN DEFAULT false,
      parking_available BOOLEAN DEFAULT false,
      changing_rooms BOOLEAN DEFAULT false,
      equipment_provided BOOLEAN DEFAULT false,
      head_instructor TEXT,
      total_instructors INTEGER,
      instructor_qualification TEXT,
      awards_achievements TEXT,
      contact_person TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_email TEXT,
      website TEXT,
      country TEXT NOT NULL DEFAULT 'India',
      state_province TEXT,
      city TEXT,
      area_name TEXT,
      full_address TEXT NOT NULL,
      images JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      user_id VARCHAR REFERENCES users(id),
      role TEXT
    )`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS skill_training_certification (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      description TEXT,
      skill_category TEXT NOT NULL,
      training_type TEXT NOT NULL,
      skills_taught JSONB DEFAULT '[]'::jsonb,
      institute_name TEXT NOT NULL,
      certification_body TEXT,
      certification_name TEXT,
      government_recognized BOOLEAN DEFAULT false,
      internationally_recognized BOOLEAN DEFAULT false,
      course_duration_days INTEGER,
      course_duration_months INTEGER,
      total_class_hours INTEGER,
      online_mode BOOLEAN DEFAULT false,
      offline_mode BOOLEAN DEFAULT false,
      weekend_batches BOOLEAN DEFAULT false,
      practical_training BOOLEAN DEFAULT false,
      study_material_provided BOOLEAN DEFAULT false,
      internship_included BOOLEAN DEFAULT false,
      total_fee DECIMAL(10,2) NOT NULL,
      registration_fee DECIMAL(10,2),
      exam_fee DECIMAL(10,2),
      installment_available BOOLEAN DEFAULT false,
      scholarship_available BOOLEAN DEFAULT false,
      placement_assistance BOOLEAN DEFAULT false,
      placement_rate DECIMAL(5,2),
      career_opportunities JSONB DEFAULT '[]'::jsonb,
      average_salary_package DECIMAL(12,2),
      contact_person TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_email TEXT,
      country TEXT NOT NULL DEFAULT 'India',
      state_province TEXT,
      city TEXT,
      area_name TEXT,
      full_address TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      user_id VARCHAR REFERENCES users(id),
      role TEXT
    )`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS schools_colleges_coaching (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      description TEXT,
      listing_type TEXT NOT NULL,
      institution_category TEXT NOT NULL,
      institution_name TEXT NOT NULL,
      institution_type TEXT,
      affiliation TEXT,
      accreditation TEXT,
      establishment_year INTEGER,
      board_affiliation TEXT,
      university_affiliation TEXT,
      courses_offered JSONB DEFAULT '[]'::jsonb,
      exam_preparation_for JSONB DEFAULT '[]'::jsonb,
      annual_tuition_fee DECIMAL(12,2),
      total_fee_per_year DECIMAL(12,2),
      scholarship_available BOOLEAN DEFAULT false,
      hostel_facility BOOLEAN DEFAULT false,
      transport_facility BOOLEAN DEFAULT false,
      library_available BOOLEAN DEFAULT false,
      computer_lab BOOLEAN DEFAULT false,
      contact_person TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_email TEXT,
      country TEXT NOT NULL DEFAULT 'India',
      state_province TEXT,
      city TEXT,
      area_name TEXT,
      full_address TEXT NOT NULL,
      images JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      user_id VARCHAR REFERENCES users(id),
      role TEXT
    )`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS educational_consultancy_study_abroad (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      description TEXT,
      listing_type TEXT NOT NULL,
      company_name TEXT NOT NULL,
      company_type TEXT,
      registration_number TEXT,
      license_number TEXT,
      established_year INTEGER,
      accreditation TEXT,
      affiliated_universities JSONB DEFAULT '[]'::jsonb,
      partner_institutions JSONB DEFAULT '[]'::jsonb,
      services_offered JSONB DEFAULT '[]'::jsonb,
      admission_assistance BOOLEAN DEFAULT true,
      visa_assistance BOOLEAN DEFAULT true,
      document_preparation BOOLEAN DEFAULT true,
      application_processing BOOLEAN DEFAULT true,
      scholarship_guidance BOOLEAN DEFAULT true,
      loan_assistance BOOLEAN DEFAULT true,
      pre_departure_orientation BOOLEAN DEFAULT true,
      accommodation_assistance BOOLEAN DEFAULT true,
      career_counseling BOOLEAN DEFAULT true,
      language_training BOOLEAN DEFAULT false,
      test_preparation BOOLEAN DEFAULT false,
      interview_preparation BOOLEAN DEFAULT true,
      countries_covered JSONB DEFAULT '[]'::jsonb,
      popular_destinations JSONB DEFAULT '[]'::jsonb,
      university_partnerships INTEGER,
      programs_offered JSONB DEFAULT '[]'::jsonb,
      undergraduate_programs BOOLEAN DEFAULT true,
      postgraduate_programs BOOLEAN DEFAULT true,
      doctoral_programs BOOLEAN DEFAULT false,
      diploma_courses BOOLEAN DEFAULT true,
      certificate_courses BOOLEAN DEFAULT true,
      professional_courses BOOLEAN DEFAULT true,
      foundation_programs BOOLEAN DEFAULT true,
      pathway_programs BOOLEAN DEFAULT true,
      engineering BOOLEAN DEFAULT false,
      medicine BOOLEAN DEFAULT false,
      business_management BOOLEAN DEFAULT false,
      computer_science BOOLEAN DEFAULT false,
      arts_humanities BOOLEAN DEFAULT false,
      sciences BOOLEAN DEFAULT false,
      law BOOLEAN DEFAULT false,
      architecture BOOLEAN DEFAULT false,
      design BOOLEAN DEFAULT false,
      hospitality BOOLEAN DEFAULT false,
      consultation_fee DECIMAL(10,2),
      service_charge DECIMAL(10,2),
      application_fee DECIMAL(10,2),
      visa_processing_fee DECIMAL(10,2),
      package_price DECIMAL(10,2),
      currency TEXT DEFAULT 'INR',
      free_consultation BOOLEAN DEFAULT false,
      success_rate_percentage DECIMAL(5,2),
      students_placed INTEGER,
      universities_tied_up INTEGER,
      countries_served INTEGER,
      years_of_experience INTEGER,
      visa_success_rate DECIMAL(5,2),
      minimum_qualification TEXT,
      age_criteria TEXT,
      language_requirements TEXT,
      test_scores_required JSONB DEFAULT '[]'::jsonb,
      minimum_score_requirements TEXT,
      processing_time TEXT,
      counselor_name TEXT,
      counselor_qualification TEXT,
      counselor_experience_years INTEGER,
      dedicated_counselor BOOLEAN DEFAULT true,
      group_counseling BOOLEAN DEFAULT false,
      online_counseling BOOLEAN DEFAULT true,
      in_person_counseling BOOLEAN DEFAULT true,
      phone_support BOOLEAN DEFAULT true,
      email_support BOOLEAN DEFAULT true,
      whatsapp_support BOOLEAN DEFAULT true,
      mock_interviews BOOLEAN DEFAULT false,
      sop_writing BOOLEAN DEFAULT true,
      lor_assistance BOOLEAN DEFAULT true,
      resume_building BOOLEAN DEFAULT true,
      contact_person TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_email TEXT,
      alternate_phone TEXT,
      whatsapp_number TEXT,
      website_url TEXT,
      branch_locations JSONB DEFAULT '[]'::jsonb,
      head_office_address TEXT,
      consultation_mode TEXT,
      appointment_required BOOLEAN DEFAULT true,
      walk_in_allowed BOOLEAN DEFAULT false,
      country TEXT NOT NULL DEFAULT 'India',
      state_province TEXT,
      city TEXT,
      area_name TEXT,
      full_address TEXT,
      working_hours TEXT,
      working_days TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      user_id VARCHAR REFERENCES users(id),
      role TEXT
    )`);

    // Create videos table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS videos (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        video_url TEXT NOT NULL,
        thumbnail_url TEXT,
        duration_minutes INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        user_id VARCHAR REFERENCES users(id)
      )
    `);

    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_categories_slug ON admin_categories(slug)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_categories_active ON admin_categories(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_subcategories_slug ON admin_subcategories(slug)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_subcategories_parent ON admin_subcategories(parent_category_id)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_subcategories_active ON admin_subcategories(is_active)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_types_slug ON pro_profile_types(slug)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_types_active ON pro_profile_types(is_active)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_fields_profile_type ON pro_profile_fields(profile_type_id)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profiles_user ON pro_profiles(user_id)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profiles_profile_type ON pro_profiles(profile_type_id)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_values_profile ON pro_profile_values(profile_id)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_values_field ON pro_profile_values(field_id)`);
await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_pro_profile_fields_type_key ON pro_profile_fields(profile_type_id, key)`);
await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_pro_profile_values_profile_field ON pro_profile_values(profile_id, field_id)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_industrial_land_city ON industrial_land(city)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_industrial_land_is_active ON industrial_land(is_active)`);
await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_industrial_land_is_featured ON industrial_land(is_featured)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_subcategories_active ON admin_subcategories(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_types_slug ON pro_profile_types(slug)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_types_active ON pro_profile_types(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_fields_profile_type ON pro_profile_fields(profile_type_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profiles_user ON pro_profiles(user_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profiles_profile_type ON pro_profiles(profile_type_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_values_profile ON pro_profile_values(profile_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_pro_profile_values_field ON pro_profile_values(field_id)`);
    await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_pro_profile_fields_type_key ON pro_profile_fields(profile_type_id, key)`);
    await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_pro_profile_values_profile_field ON pro_profile_values(profile_id, field_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_industrial_land_city ON industrial_land(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_industrial_land_is_active ON industrial_land(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_industrial_land_is_featured ON industrial_land(is_featured)`);

    // Create cars_bikes indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_listing_type ON cars_bikes(listing_type)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_vehicle_type ON cars_bikes(vehicle_type)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_brand ON cars_bikes(brand)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_city ON cars_bikes(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_is_active ON cars_bikes(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cars_bikes_is_featured ON cars_bikes(is_featured)`);

    // Create educational service indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_tuition_private_classes_city ON tuition_private_classes(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_tuition_private_classes_is_active ON tuition_private_classes(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_tuition_private_classes_is_featured ON tuition_private_classes(is_featured)`);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_dance_karate_gym_yoga_city ON dance_karate_gym_yoga(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_dance_karate_gym_yoga_is_active ON dance_karate_gym_yoga(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_dance_karate_gym_yoga_is_featured ON dance_karate_gym_yoga(is_featured)`);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_language_classes_city ON language_classes(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_language_classes_is_active ON language_classes(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_language_classes_is_featured ON language_classes(is_featured)`);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_academies_music_arts_sports_city ON academies_music_arts_sports(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_academies_music_arts_sports_is_active ON academies_music_arts_sports(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_academies_music_arts_sports_is_featured ON academies_music_arts_sports(is_featured)`);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_schools_colleges_coaching_city ON schools_colleges_coaching(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_schools_colleges_coaching_is_active ON schools_colleges_coaching(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_schools_colleges_coaching_is_featured ON schools_colleges_coaching(is_featured)`);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_educational_consultancy_study_abroad_city ON educational_consultancy_study_abroad(city)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_educational_consultancy_study_abroad_is_active ON educational_consultancy_study_abroad(is_active)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_educational_consultancy_study_abroad_is_featured ON educational_consultancy_study_abroad(is_featured)`);

    // Create triggers
    await db.execute(sql`DROP TRIGGER IF EXISTS update_admin_categories_updated_at ON admin_categories`);
    await db.execute(sql`
      CREATE TRIGGER update_admin_categories_updated_at 
      BEFORE UPDATE ON admin_categories 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_admin_subcategories_updated_at ON admin_subcategories`);
    await db.execute(sql`
      CREATE TRIGGER update_admin_subcategories_updated_at 
      BEFORE UPDATE ON admin_subcategories 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_pro_profile_types_updated_at ON pro_profile_types`);
    await db.execute(sql`
      CREATE TRIGGER update_pro_profile_types_updated_at
      BEFORE UPDATE ON pro_profile_types
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_pro_profile_fields_updated_at ON pro_profile_fields`);
    await db.execute(sql`
      CREATE TRIGGER update_pro_profile_fields_updated_at
      BEFORE UPDATE ON pro_profile_fields
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_pro_profiles_updated_at ON pro_profiles`);
    await db.execute(sql`
      CREATE TRIGGER update_pro_profiles_updated_at
      BEFORE UPDATE ON pro_profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_pro_profile_values_updated_at ON pro_profile_values`);
    await db.execute(sql`
      CREATE TRIGGER update_pro_profile_values_updated_at
      BEFORE UPDATE ON pro_profile_values
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_industrial_land_updated_at ON industrial_land`);
    await db.execute(sql`
      CREATE TRIGGER update_industrial_land_updated_at 
      BEFORE UPDATE ON industrial_land 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    // Create cars_bikes trigger
    await db.execute(sql`DROP TRIGGER IF EXISTS update_cars_bikes_updated_at ON cars_bikes`);
    await db.execute(sql`
      CREATE TRIGGER update_cars_bikes_updated_at 
      BEFORE UPDATE ON cars_bikes 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    // Create educational service triggers
    await db.execute(sql`DROP TRIGGER IF EXISTS update_tuition_private_classes_updated_at ON tuition_private_classes`);
    await db.execute(sql`
      CREATE TRIGGER update_tuition_private_classes_updated_at 
      BEFORE UPDATE ON tuition_private_classes 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_dance_karate_gym_yoga_updated_at ON dance_karate_gym_yoga`);
    await db.execute(sql`
      CREATE TRIGGER update_dance_karate_gym_yoga_updated_at 
      BEFORE UPDATE ON dance_karate_gym_yoga 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_language_classes_updated_at ON language_classes`);
    await db.execute(sql`
      CREATE TRIGGER update_language_classes_updated_at 
      BEFORE UPDATE ON language_classes 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_academies_music_arts_sports_updated_at ON academies_music_arts_sports`);
    await db.execute(sql`
      CREATE TRIGGER update_academies_music_arts_sports_updated_at 
      BEFORE UPDATE ON academies_music_arts_sports 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_skill_training_certification_updated_at ON skill_training_certification`);
    await db.execute(sql`
      CREATE TRIGGER update_skill_training_certification_updated_at 
      BEFORE UPDATE ON skill_training_certification 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_schools_colleges_coaching_updated_at ON schools_colleges_coaching`);
    await db.execute(sql`
      CREATE TRIGGER update_schools_colleges_coaching_updated_at 
      BEFORE UPDATE ON schools_colleges_coaching 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await db.execute(sql`DROP TRIGGER IF EXISTS update_educational_consultancy_study_abroad_updated_at ON educational_consultancy_study_abroad`);
    await db.execute(sql`
      CREATE TRIGGER update_educational_consultancy_study_abroad_updated_at 
      BEFORE UPDATE ON educational_consultancy_study_abroad 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);


    console.log("✅ Database tables created successfully!");
    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}