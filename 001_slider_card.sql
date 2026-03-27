--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: get_admin_category_hierarchy(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_admin_category_hierarchy() RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', category_id,
            'name', category_name,
            'slug', category_slug,
            'description', category_description,
            'icon', category_icon,
            'color', category_color,
            'sortOrder', category_sort_order,
            'subcategories', subcategories
        )
    )
    INTO result
    FROM (
        SELECT 
            c.id as category_id,
            c.name as category_name,
            c.slug as category_slug,
            c.description as category_description,
            c.icon as category_icon,
            c.color as category_color,
            c.sort_order as category_sort_order,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', s.id,
                        'name', s.name,
                        'slug', s.slug,
                        'description', s.description,
                        'icon', s.icon,
                        'color', s.color,
                        'sortOrder', s.sort_order,
                        'parentCategoryId', s.parent_category_id
                    )
                ) FILTER (WHERE s.id IS NOT NULL),
                '[]'::json
            ) as subcategories
        FROM admin_categories c
        LEFT JOIN admin_subcategories s ON c.id = s.parent_category_id AND s.is_active = true
        WHERE c.is_active = true
        GROUP BY c.id, c.name, c.slug, c.description, c.icon, c.color, c.sort_order
        ORDER BY c.sort_order, c.name
    ) cat_with_subs;
    
    RETURN result;
END;
$$;


ALTER FUNCTION public.get_admin_category_hierarchy() OWNER TO postgres;

--
-- Name: update_car_bike_rentals_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_car_bike_rentals_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_car_bike_rentals_updated_at() OWNER TO postgres;

--
-- Name: update_cars_bikes_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_cars_bikes_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_cars_bikes_updated_at() OWNER TO postgres;

--
-- Name: update_commercial_properties_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_commercial_properties_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_commercial_properties_updated_at() OWNER TO postgres;

--
-- Name: update_construction_materials_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_construction_materials_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_construction_materials_updated_at() OWNER TO postgres;

--
-- Name: update_ebooks_online_courses_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_ebooks_online_courses_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_ebooks_online_courses_updated_at() OWNER TO postgres;

--
-- Name: update_electronics_gadgets_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_electronics_gadgets_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_electronics_gadgets_updated_at() OWNER TO postgres;

--
-- Name: update_furniture_interior_decor_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_furniture_interior_decor_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_furniture_interior_decor_updated_at() OWNER TO postgres;

--
-- Name: update_heavy_equipment_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_heavy_equipment_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_heavy_equipment_updated_at() OWNER TO postgres;

--
-- Name: update_industrial_properties_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_industrial_properties_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_industrial_properties_updated_at() OWNER TO postgres;

--
-- Name: update_office_spaces_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_office_spaces_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_office_spaces_updated_at() OWNER TO postgres;

--
-- Name: update_pharmacy_medical_stores_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_pharmacy_medical_stores_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_pharmacy_medical_stores_updated_at() OWNER TO postgres;

--
-- Name: update_phones_tablets_accessories_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_phones_tablets_accessories_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_phones_tablets_accessories_updated_at() OWNER TO postgres;

--
-- Name: update_property_deals_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_property_deals_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_property_deals_updated_at() OWNER TO postgres;

--
-- Name: update_rental_listings_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_rental_listings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_rental_listings_updated_at() OWNER TO postgres;

--
-- Name: update_second_hand_cars_bikes_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_second_hand_cars_bikes_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_second_hand_cars_bikes_updated_at() OWNER TO postgres;

--
-- Name: update_second_hand_phones_tablets_accessories_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_second_hand_phones_tablets_accessories_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_second_hand_phones_tablets_accessories_updated_at() OWNER TO postgres;

--
-- Name: update_showrooms_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_showrooms_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_showrooms_updated_at() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: update_vehicle_license_classes_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_vehicle_license_classes_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_vehicle_license_classes_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academies_music_arts_sports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academies_music_arts_sports (
    id character varying DEFAULT (gen_random_uuid())::text NOT NULL,
    title text NOT NULL,
    description text,
    academy_category text NOT NULL,
    specialization text,
    established_year integer,
    courses_offered jsonb DEFAULT '[]'::jsonb,
    class_type text,
    age_group text,
    course_duration_months integer,
    fee_per_month numeric(10,2) NOT NULL,
    admission_fee numeric(10,2),
    instrument_rental_fee numeric(10,2),
    certification_offered boolean DEFAULT false,
    free_trial_class boolean DEFAULT false,
    facilities jsonb DEFAULT '[]'::jsonb,
    air_conditioned boolean DEFAULT false,
    parking_available boolean DEFAULT false,
    changing_rooms boolean DEFAULT false,
    equipment_provided boolean DEFAULT false,
    head_instructor text,
    total_instructors integer,
    instructor_qualification text,
    awards_achievements text,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    website text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text,
    images jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.academies_music_arts_sports OWNER TO postgres;

--
-- Name: admin_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_categories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    icon text,
    color text DEFAULT '#1e40af'::text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admin_categories OWNER TO postgres;

--
-- Name: admin_subcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_subcategories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    icon text,
    color text,
    parent_category_id character varying NOT NULL,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admin_subcategories OWNER TO postgres;

--
-- Name: article_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.article_categories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text
);


ALTER TABLE public.article_categories OWNER TO postgres;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text,
    type text,
    author_id character varying,
    author_name text,
    category_id character varying,
    category_name text,
    pages integer,
    downloads text DEFAULT '0'::text,
    likes integer DEFAULT 0,
    thumbnail_url text,
    is_premium boolean DEFAULT false,
    is_published boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    seo_title text,
    seo_description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text
);


ALTER TABLE public.articles OWNER TO postgres;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_posts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text,
    author_id character varying,
    author_name text,
    category text,
    tags jsonb DEFAULT '[]'::jsonb,
    cover_image_url text,
    published_at timestamp without time zone,
    is_published boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    seo_title text,
    seo_description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text
);


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- Name: car_bike_rentals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.car_bike_rentals (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    rental_type text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    year integer,
    rental_price_per_day numeric(10,2) NOT NULL,
    rental_price_per_hour numeric(10,2),
    rental_price_per_week numeric(10,2),
    rental_price_per_month numeric(10,2),
    security_deposit numeric(10,2),
    fuel_type text,
    transmission text,
    seating_capacity integer,
    mileage_limit_per_day integer,
    extra_km_charge numeric(8,2),
    color text,
    registration_number text,
    insurance_included boolean DEFAULT true,
    fuel_policy text,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    features jsonb DEFAULT '[]'::jsonb,
    condition text,
    minimum_rental_duration integer DEFAULT 1,
    minimum_rental_duration_unit text DEFAULT 'day'::text,
    maximum_rental_duration integer,
    driver_available boolean DEFAULT false,
    driver_charges_per_day numeric(8,2),
    age_requirement integer DEFAULT 21,
    license_required boolean DEFAULT true,
    pickup_delivery_available boolean DEFAULT false,
    pickup_delivery_charges numeric(8,2),
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    pickup_location text,
    location_id character varying,
    owner_id character varying,
    rental_company_name text,
    rental_company_contact text,
    rental_company_email text,
    terms_and_conditions text,
    cancellation_policy text,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_verified boolean DEFAULT false,
    view_count integer DEFAULT 0,
    booking_count integer DEFAULT 0,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT car_bike_rentals_availability_status_check CHECK ((availability_status = ANY (ARRAY['available'::text, 'rented'::text, 'maintenance'::text, 'unavailable'::text]))),
    CONSTRAINT car_bike_rentals_condition_check CHECK ((condition = ANY (ARRAY['excellent'::text, 'good'::text, 'fair'::text]))),
    CONSTRAINT car_bike_rentals_fuel_policy_check CHECK ((fuel_policy = ANY (ARRAY['full_to_full'::text, 'same_to_same'::text, 'prepaid'::text, 'not_included'::text]))),
    CONSTRAINT car_bike_rentals_fuel_type_check CHECK ((fuel_type = ANY (ARRAY['petrol'::text, 'diesel'::text, 'electric'::text, 'hybrid'::text, 'cng'::text]))),
    CONSTRAINT car_bike_rentals_minimum_rental_duration_unit_check CHECK ((minimum_rental_duration_unit = ANY (ARRAY['hour'::text, 'day'::text, 'week'::text, 'month'::text]))),
    CONSTRAINT car_bike_rentals_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric))),
    CONSTRAINT car_bike_rentals_rental_price_per_day_check CHECK ((rental_price_per_day >= (0)::numeric)),
    CONSTRAINT car_bike_rentals_rental_price_per_hour_check CHECK ((rental_price_per_hour >= (0)::numeric)),
    CONSTRAINT car_bike_rentals_rental_price_per_month_check CHECK ((rental_price_per_month >= (0)::numeric)),
    CONSTRAINT car_bike_rentals_rental_price_per_week_check CHECK ((rental_price_per_week >= (0)::numeric)),
    CONSTRAINT car_bike_rentals_rental_type_check CHECK ((rental_type = ANY (ARRAY['car'::text, 'bike'::text, 'scooter'::text, 'luxury_car'::text, 'suv'::text, 'sedan'::text, 'sports_bike'::text]))),
    CONSTRAINT car_bike_rentals_seating_capacity_check CHECK (((seating_capacity >= 1) AND (seating_capacity <= 50))),
    CONSTRAINT car_bike_rentals_security_deposit_check CHECK ((security_deposit >= (0)::numeric)),
    CONSTRAINT car_bike_rentals_transmission_check CHECK ((transmission = ANY (ARRAY['manual'::text, 'automatic'::text, 'semi-automatic'::text]))),
    CONSTRAINT car_bike_rentals_year_check CHECK (((year >= 1900) AND ((year)::numeric <= (EXTRACT(year FROM CURRENT_DATE) + (1)::numeric))))
);


ALTER TABLE public.car_bike_rentals OWNER TO postgres;

--
-- Name: cars_bikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cars_bikes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    vehicle_type text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    price numeric(12,2) NOT NULL,
    kilometers_driven integer,
    fuel_type text,
    transmission text,
    owner_number integer,
    registration_number text,
    registration_state text,
    insurance_valid_until date,
    color text,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    features jsonb DEFAULT '[]'::jsonb,
    condition text,
    is_negotiable boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    seller_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT cars_bikes_condition_check CHECK ((condition = ANY (ARRAY['excellent'::text, 'good'::text, 'fair'::text, 'needs_work'::text]))),
    CONSTRAINT cars_bikes_fuel_type_check CHECK ((fuel_type = ANY (ARRAY['petrol'::text, 'diesel'::text, 'electric'::text, 'hybrid'::text, 'cng'::text]))),
    CONSTRAINT cars_bikes_listing_type_check CHECK ((listing_type = ANY (ARRAY['buy'::text, 'sell'::text, 'rent'::text]))),
    CONSTRAINT cars_bikes_owner_number_check CHECK (((owner_number >= 1) AND (owner_number <= 5))),
    CONSTRAINT cars_bikes_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT cars_bikes_transmission_check CHECK ((transmission = ANY (ARRAY['manual'::text, 'automatic'::text, 'semi-automatic'::text]))),
    CONSTRAINT cars_bikes_vehicle_type_check CHECK ((vehicle_type = ANY (ARRAY['car'::text, 'bike'::text, 'scooter'::text, 'commercial'::text])))
);


ALTER TABLE public.cars_bikes OWNER TO postgres;

--
-- Name: commercial_properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commercial_properties (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    locations character varying,
    description text,
    commercial_type text NOT NULL,
    listing_type text NOT NULL,
    price numeric(12,2) NOT NULL,
    price_type text,
    area_sqft numeric(10,2),
    floors integer,
    parking_spaces integer,
    footfall text,
    amenities jsonb DEFAULT '[]'::jsonb,
    suitable_for jsonb DEFAULT '[]'::jsonb,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text NOT NULL,
    city text NOT NULL,
    area_name text,
    full_address text,
    location_id character varying,
    agency_id character varying,
    owner_id character varying,
    view_count integer DEFAULT 0,
    images jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    area text,
    user_id character varying,
    role text,
    CONSTRAINT commercial_properties_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.commercial_properties OWNER TO postgres;

--
-- Name: computer_mobile_laptop_repair_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.computer_mobile_laptop_repair_services (
    id character varying NOT NULL,
    title text NOT NULL,
    description text,
    service_type text NOT NULL,
    repair_categories jsonb DEFAULT '[]'::jsonb,
    devices_supported jsonb DEFAULT '[]'::jsonb,
    brands_supported jsonb DEFAULT '[]'::jsonb,
    base_service_charge numeric(10,2) NOT NULL,
    inspection_charge numeric(8,2),
    minimum_charge numeric(10,2),
    hourly_rate numeric(8,2),
    pricing_type text DEFAULT 'fixed'::text,
    free_inspection boolean DEFAULT false,
    services_offered jsonb DEFAULT '[]'::jsonb,
    hardware_repair boolean DEFAULT true,
    software_repair boolean DEFAULT true,
    data_recovery boolean DEFAULT false,
    virus_removal boolean DEFAULT true,
    screen_replacement boolean DEFAULT true,
    battery_replacement boolean DEFAULT true,
    motherboard_repair boolean DEFAULT false,
    warranty_provided boolean DEFAULT false,
    warranty_period text,
    genuine_parts_used boolean DEFAULT true,
    onsite_service boolean DEFAULT false,
    pickup_delivery_service boolean DEFAULT false,
    same_day_service boolean DEFAULT false,
    emergency_service boolean DEFAULT false,
    business_name text NOT NULL,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    whatsapp_available boolean DEFAULT false,
    country text DEFAULT 'India'::text,
    state text,
    city text,
    full_address text NOT NULL,
    pincode text,
    landmark text,
    google_maps_link text,
    working_hours text,
    available_24_7 boolean DEFAULT false,
    free_diagnostic boolean DEFAULT false,
    experience_years integer,
    certified_technician boolean DEFAULT false,
    technicians_count integer,
    service_area_radius integer,
    average_repair_time text,
    customer_rating numeric(3,2),
    total_reviews integer DEFAULT 0,
    years_in_business integer,
    licenses_certifications jsonb DEFAULT '[]'::jsonb,
    insurance_coverage boolean DEFAULT false,
    payment_methods jsonb DEFAULT '[]'::jsonb,
    accepts_card boolean DEFAULT false,
    accepts_upi boolean DEFAULT false,
    accepts_cash boolean DEFAULT true,
    website_url text,
    facebook_url text,
    instagram_url text,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    featured_until timestamp without time zone,
    views_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id character varying,
    role text,
    keyboard_replacement text,
    charging_port_repair text,
    water_damage_repair boolean DEFAULT false,
    warranty_details text,
    pickup_delivery_charges numeric(8,2),
    emergency_charges numeric(8,2),
    owner_name text,
    registration_number text,
    certification_details text,
    authorized_service_center boolean DEFAULT false,
    authorized_brands jsonb DEFAULT '[]'::jsonb,
    alternate_phone text,
    whatsapp_number text,
    state_province text,
    area_name text,
    location_id character varying,
    service_areas jsonb DEFAULT '[]'::jsonb,
    working_days text,
    holiday_service boolean DEFAULT false,
    advance_booking_required boolean DEFAULT false,
    free_estimate boolean DEFAULT true,
    home_visit_available boolean DEFAULT false,
    home_visit_charges numeric(8,2),
    bulk_service_discount boolean DEFAULT false,
    corporate_service boolean DEFAULT false,
    student_discount boolean DEFAULT false,
    senior_citizen_discount boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    certifications jsonb DEFAULT '[]'::jsonb,
    advance_payment_required boolean DEFAULT false,
    advance_payment_percentage numeric(5,2),
    terms_and_conditions text,
    cancellation_policy text,
    refund_policy text,
    customer_support_number text,
    complaint_number text,
    support_email text,
    response_time text,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_repairs integer DEFAULT 0,
    total_customers integer DEFAULT 0,
    availability_status text DEFAULT 'available'::text,
    owner_id character varying,
    view_count integer DEFAULT 0
);


ALTER TABLE public.computer_mobile_laptop_repair_services OWNER TO postgres;

--
-- Name: construction_materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.construction_materials (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    unit text NOT NULL,
    brand text,
    specifications jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    supplier_id character varying,
    supplier_name text,
    supplier_contact text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area text,
    full_address text,
    location_id character varying,
    stock_status text DEFAULT 'in_stock'::text,
    minimum_order integer,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT construction_materials_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.construction_materials OWNER TO postgres;

--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    subject text,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- Name: cricket_sports_training; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cricket_sports_training (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    training_category text NOT NULL,
    academy_name text,
    coach_name text NOT NULL,
    coach_experience_years integer,
    coach_certifications text,
    coach_achievements text,
    price_per_session real,
    price_per_month real,
    price_per_quarter real,
    currency text DEFAULT 'INR'::text,
    discount_percentage real,
    training_level text,
    age_group text,
    min_age integer,
    max_age integer,
    batch_size integer,
    session_duration_minutes integer,
    sessions_per_week integer,
    indoor_facility boolean DEFAULT false,
    outdoor_facility boolean DEFAULT false,
    net_practice_available boolean DEFAULT false,
    pitch_available boolean DEFAULT false,
    equipment_provided boolean DEFAULT false,
    facilities text,
    equipment_list text,
    training_modules text,
    specializations text,
    tournament_preparation boolean DEFAULT false,
    match_practice boolean DEFAULT false,
    video_analysis boolean DEFAULT false,
    fitness_training boolean DEFAULT false,
    mental_conditioning boolean DEFAULT false,
    training_days text,
    morning_batch boolean DEFAULT false,
    evening_batch boolean DEFAULT false,
    weekend_batch boolean DEFAULT false,
    flexible_timing boolean DEFAULT false,
    certificate_provided boolean DEFAULT false,
    success_stories text,
    students_trained integer,
    professional_players_produced integer,
    free_trial_available boolean DEFAULT false,
    trial_sessions integer,
    registration_fee real,
    admission_process text,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    whatsapp_number text,
    website_url text,
    city text,
    state_province text,
    area_name text,
    full_address text,
    country text DEFAULT 'India'::text,
    images text,
    videos text,
    brochure_url text,
    hostel_facility boolean DEFAULT false,
    transport_facility boolean DEFAULT false,
    diet_plan_included boolean DEFAULT false,
    scholarship_available boolean DEFAULT false,
    international_exposure boolean DEFAULT false,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id character varying,
    role text,
    CONSTRAINT cricket_sports_training_listing_type_check CHECK ((listing_type = ANY (ARRAY['individual'::text, 'group'::text, 'academy'::text, 'coaching_camp'::text]))),
    CONSTRAINT cricket_sports_training_training_category_check CHECK ((training_category = ANY (ARRAY['batting'::text, 'bowling'::text, 'wicket_keeping'::text, 'fielding'::text, 'all_rounder'::text, 'fitness'::text]))),
    CONSTRAINT cricket_sports_training_training_level_check CHECK ((training_level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text, 'professional'::text, 'all_levels'::text])))
);


ALTER TABLE public.cricket_sports_training OWNER TO postgres;

--
-- Name: cyber_cafe_internet_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cyber_cafe_internet_services (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    cafe_name text NOT NULL,
    service_type text NOT NULL,
    services_offered jsonb DEFAULT '[]'::jsonb,
    internet_browsing boolean DEFAULT true,
    printing_service boolean DEFAULT true,
    scanning_service boolean DEFAULT true,
    photocopying_service boolean DEFAULT true,
    lamination_service boolean DEFAULT false,
    binding_service boolean DEFAULT false,
    gaming_available boolean DEFAULT false,
    video_conferencing boolean DEFAULT false,
    online_classes_support boolean DEFAULT false,
    internet_price_per_hour numeric(8,2) NOT NULL,
    internet_price_per_day numeric(8,2),
    printing_price_bw numeric(6,2),
    printing_price_color numeric(6,2),
    scanning_price numeric(6,2),
    photocopying_price numeric(6,2),
    gaming_price_per_hour numeric(8,2),
    minimum_charge numeric(8,2),
    membership_available boolean DEFAULT false,
    membership_plans jsonb DEFAULT '[]'::jsonb,
    total_computers integer,
    available_computers integer,
    computer_specifications text,
    internet_speed text,
    wifi_available boolean DEFAULT false,
    printer_types jsonb DEFAULT '[]'::jsonb,
    scanner_type text,
    private_cabins boolean DEFAULT false,
    number_of_cabins integer,
    ac_available boolean DEFAULT false,
    parking_available boolean DEFAULT false,
    software_available jsonb DEFAULT '[]'::jsonb,
    operating_systems jsonb DEFAULT '[]'::jsonb,
    gaming_setup boolean DEFAULT false,
    gaming_titles jsonb DEFAULT '[]'::jsonb,
    owner_name text,
    license_number text,
    established_year integer,
    experience_years integer,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    whatsapp_number text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    location_id character varying,
    nearby_landmarks text,
    working_hours text,
    open_24_7 boolean DEFAULT false,
    working_days text,
    holiday_list text,
    student_discount boolean DEFAULT false,
    student_discount_percentage numeric(5,2),
    bulk_printing_discount boolean DEFAULT false,
    home_delivery boolean DEFAULT false,
    pickup_service boolean DEFAULT false,
    online_booking boolean DEFAULT false,
    prepaid_packages boolean DEFAULT false,
    cctv_surveillance boolean DEFAULT false,
    data_privacy_ensured boolean DEFAULT true,
    antivirus_installed boolean DEFAULT true,
    firewall_protection boolean DEFAULT true,
    payment_methods jsonb DEFAULT '[]'::jsonb,
    advance_payment_required boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    terms_and_conditions text,
    cancellation_policy text,
    refund_policy text,
    usage_policy text,
    food_beverages_available boolean DEFAULT false,
    stationary_available boolean DEFAULT false,
    charging_points boolean DEFAULT false,
    rest_area boolean DEFAULT false,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_customers integer DEFAULT 0,
    exam_form_filling boolean DEFAULT false,
    resume_making boolean DEFAULT false,
    document_typing boolean DEFAULT false,
    translation_service boolean DEFAULT false,
    passport_photo boolean DEFAULT false,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    owner_id character varying,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT cyber_cafe_internet_services_availability_status_check CHECK ((availability_status = ANY (ARRAY['available'::text, 'busy'::text, 'closed'::text]))),
    CONSTRAINT cyber_cafe_internet_services_internet_price_per_hour_check CHECK ((internet_price_per_hour >= (0)::numeric)),
    CONSTRAINT cyber_cafe_internet_services_service_type_check CHECK ((service_type = ANY (ARRAY['cyber_cafe'::text, 'internet_cafe'::text, 'gaming_cafe'::text, 'business_center'::text, 'coworking_with_internet'::text])))
);


ALTER TABLE public.cyber_cafe_internet_services OWNER TO postgres;

--
-- Name: dance_karate_gym_yoga; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dance_karate_gym_yoga (
    id character varying DEFAULT (gen_random_uuid())::text NOT NULL,
    title text NOT NULL,
    description text,
    class_category text NOT NULL,
    class_type text NOT NULL,
    instructor_name text NOT NULL,
    instructor_qualification text,
    instructor_experience_years integer,
    fee_per_month numeric(10,2) NOT NULL,
    fee_per_session numeric(10,2),
    registration_fee numeric(10,2),
    session_duration_minutes integer,
    sessions_per_week integer,
    batch_size integer,
    trial_class_available boolean DEFAULT false,
    certification_provided boolean DEFAULT false,
    equipment_provided boolean DEFAULT false,
    weekend_batches boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text,
    images jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.dance_karate_gym_yoga OWNER TO postgres;

--
-- Name: dance_karate_gym_yoga_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dance_karate_gym_yoga_classes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    class_category text NOT NULL,
    class_type text NOT NULL,
    instructor_name text NOT NULL,
    instructor_qualification text,
    instructor_experience_years integer,
    fee_per_month numeric(10,2) NOT NULL,
    fee_per_session numeric(10,2),
    registration_fee numeric(10,2),
    age_group text,
    min_age integer,
    max_age integer,
    skill_level text,
    batch_size integer,
    session_duration_minutes integer,
    sessions_per_week integer,
    flexible_timings boolean DEFAULT false,
    weekend_batches boolean DEFAULT false,
    trial_class_available boolean DEFAULT false,
    certification_provided boolean DEFAULT false,
    equipment_provided boolean DEFAULT false,
    changing_room_available boolean DEFAULT false,
    parking_available boolean DEFAULT false,
    ac_facility boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    images jsonb DEFAULT '[]'::jsonb,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text
);


ALTER TABLE public.dance_karate_gym_yoga_classes OWNER TO postgres;

--
-- Name: ebooks_online_courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ebooks_online_courses (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    category text NOT NULL,
    subcategory text,
    book_title text,
    author text,
    publisher text,
    isbn text,
    publication_year integer,
    edition text,
    language text,
    page_count integer,
    file_format text,
    file_size_mb numeric(8,2),
    course_title text,
    instructor_name text,
    instructor_credentials text,
    course_platform text,
    course_duration_hours numeric(6,2),
    total_lectures integer,
    course_level text,
    course_language text,
    subtitles_available jsonb DEFAULT '[]'::jsonb,
    topics_covered jsonb DEFAULT '[]'::jsonb,
    learning_outcomes jsonb DEFAULT '[]'::jsonb,
    prerequisites jsonb DEFAULT '[]'::jsonb,
    target_audience text,
    content_type text,
    price numeric(12,2) NOT NULL,
    original_price numeric(12,2),
    discount_percentage numeric(5,2),
    is_free boolean DEFAULT false,
    lifetime_access boolean DEFAULT true,
    subscription_based boolean DEFAULT false,
    subscription_price_monthly numeric(10,2),
    subscription_price_yearly numeric(10,2),
    video_quality text,
    downloadable_resources boolean DEFAULT false,
    assignments_included boolean DEFAULT false,
    quizzes_included boolean DEFAULT false,
    certificate_provided boolean DEFAULT false,
    certificate_type text,
    live_sessions boolean DEFAULT false,
    recorded_sessions boolean DEFAULT true,
    one_on_one_support boolean DEFAULT false,
    group_discussions boolean DEFAULT false,
    instant_access boolean DEFAULT true,
    access_duration_days integer,
    download_allowed boolean DEFAULT true,
    download_limit integer,
    streaming_allowed boolean DEFAULT true,
    offline_access boolean DEFAULT false,
    mobile_app_access boolean DEFAULT false,
    total_students integer DEFAULT 0,
    total_readers integer DEFAULT 0,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    completion_rate numeric(5,2),
    includes_ebook boolean DEFAULT false,
    includes_worksheets boolean DEFAULT false,
    includes_templates boolean DEFAULT false,
    includes_code_samples boolean DEFAULT false,
    bonus_content jsonb DEFAULT '[]'::jsonb,
    cover_image text,
    preview_images jsonb DEFAULT '[]'::jsonb,
    preview_video_url text,
    sample_chapters jsonb DEFAULT '[]'::jsonb,
    demo_lecture_url text,
    instructor_bio text,
    instructor_rating numeric(3,2),
    instructor_students_count integer,
    instructor_courses_count integer,
    author_bio text,
    author_website text,
    author_social_links jsonb DEFAULT '[]'::jsonb,
    system_requirements text,
    software_needed jsonb DEFAULT '[]'::jsonb,
    hardware_requirements text,
    internet_required boolean DEFAULT true,
    minimum_bandwidth text,
    last_updated timestamp without time zone,
    content_updates boolean DEFAULT true,
    support_available boolean DEFAULT false,
    support_type text,
    response_time text,
    money_back_guarantee boolean DEFAULT false,
    guarantee_days integer,
    seller_id character varying,
    seller_type text,
    institution_name text,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    whatsapp_number text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    delivery_method text,
    payment_methods jsonb DEFAULT '[]'::jsonb,
    installment_available boolean DEFAULT false,
    installment_plans jsonb DEFAULT '[]'::jsonb,
    refund_policy text,
    refund_period_days integer,
    keywords jsonb DEFAULT '[]'::jsonb,
    meta_description text,
    promotional_video_url text,
    testimonials jsonb DEFAULT '[]'::jsonb,
    copyright_notice text,
    terms_of_use text,
    privacy_policy text,
    drm_protected boolean DEFAULT false,
    plagiarism_free boolean DEFAULT true,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    is_bestseller boolean DEFAULT false,
    is_trending boolean DEFAULT false,
    is_new_release boolean DEFAULT false,
    view_count integer DEFAULT 0,
    inquiry_count integer DEFAULT 0,
    enrollment_count integer DEFAULT 0,
    download_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text,
    images jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.ebooks_online_courses OWNER TO postgres;

--
-- Name: educational_consultancy_study_abroad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.educational_consultancy_study_abroad (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    company_name text NOT NULL,
    company_type text,
    registration_number text,
    license_number text,
    established_year integer,
    accreditation text,
    affiliated_universities text,
    partner_institutions text,
    services_offered text,
    admission_assistance boolean DEFAULT true,
    visa_assistance boolean DEFAULT true,
    document_preparation boolean DEFAULT true,
    application_processing boolean DEFAULT true,
    scholarship_guidance boolean DEFAULT true,
    loan_assistance boolean DEFAULT true,
    pre_departure_orientation boolean DEFAULT true,
    accommodation_assistance boolean DEFAULT true,
    career_counseling boolean DEFAULT true,
    language_training boolean DEFAULT false,
    test_preparation boolean DEFAULT false,
    interview_preparation boolean DEFAULT true,
    countries_covered text,
    popular_destinations text,
    university_partnerships integer,
    programs_offered text,
    undergraduate_programs boolean DEFAULT true,
    postgraduate_programs boolean DEFAULT true,
    doctoral_programs boolean DEFAULT false,
    diploma_courses boolean DEFAULT true,
    certificate_courses boolean DEFAULT true,
    professional_courses boolean DEFAULT true,
    foundation_programs boolean DEFAULT true,
    pathway_programs boolean DEFAULT true,
    engineering boolean DEFAULT false,
    medicine boolean DEFAULT false,
    business_management boolean DEFAULT false,
    computer_science boolean DEFAULT false,
    arts_humanities boolean DEFAULT false,
    sciences boolean DEFAULT false,
    law boolean DEFAULT false,
    architecture boolean DEFAULT false,
    design boolean DEFAULT false,
    hospitality boolean DEFAULT false,
    consultation_fee real,
    service_charge real,
    application_fee real,
    visa_processing_fee real,
    package_price real,
    currency text DEFAULT 'INR'::text,
    free_consultation boolean DEFAULT false,
    refundable_deposit real,
    success_rate_percentage real,
    students_placed integer,
    universities_tied_up integer,
    countries_served integer,
    years_of_experience integer,
    visa_success_rate real,
    minimum_qualification text,
    age_criteria text,
    language_requirements text,
    test_scores_required text,
    minimum_score_requirements text,
    work_experience_required boolean DEFAULT false,
    processing_time text,
    application_deadline_assistance boolean DEFAULT true,
    intake_seasons text,
    average_processing_days integer,
    counselor_name text,
    counselor_qualification text,
    counselor_experience_years integer,
    dedicated_counselor boolean DEFAULT true,
    group_counseling boolean DEFAULT false,
    online_counseling boolean DEFAULT true,
    in_person_counseling boolean DEFAULT true,
    phone_support boolean DEFAULT true,
    email_support boolean DEFAULT true,
    whatsapp_support boolean DEFAULT true,
    mock_interviews boolean DEFAULT false,
    sop_writing boolean DEFAULT true,
    lor_assistance boolean DEFAULT true,
    resume_building boolean DEFAULT true,
    portfolio_development boolean DEFAULT false,
    english_proficiency_training boolean DEFAULT false,
    aptitude_test_coaching boolean DEFAULT false,
    documents_required text,
    document_verification boolean DEFAULT true,
    document_translation boolean DEFAULT false,
    attestation_services boolean DEFAULT false,
    scholarship_database_access boolean DEFAULT false,
    education_loan_tie_ups text,
    financial_planning boolean DEFAULT false,
    part_time_job_guidance boolean DEFAULT false,
    airport_pickup boolean DEFAULT false,
    temporary_accommodation boolean DEFAULT false,
    bank_account_opening_help boolean DEFAULT false,
    sim_card_assistance boolean DEFAULT false,
    university_orientation boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_number text,
    website_url text,
    social_media_links text,
    branch_locations text,
    head_office_address text,
    consultation_mode text,
    appointment_required boolean DEFAULT true,
    walk_in_allowed boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id text,
    working_hours text,
    working_days text,
    available_24_7 boolean DEFAULT false,
    emergency_support boolean DEFAULT false,
    images text,
    videos text,
    brochures text,
    testimonials text,
    case_studies text,
    certifications text,
    professional_memberships text,
    awards_recognition text,
    payment_methods text,
    installment_available boolean DEFAULT false,
    refund_policy text,
    terms_and_conditions text,
    cancellation_policy text,
    rating real,
    review_count integer DEFAULT 0,
    total_consultations integer DEFAULT 0,
    free_seminar boolean DEFAULT false,
    webinar_available boolean DEFAULT false,
    study_material_provided boolean DEFAULT false,
    mobile_app_available boolean DEFAULT false,
    virtual_tour boolean DEFAULT false,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    verification_date timestamp without time zone,
    owner_id text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id character varying,
    role text,
    CONSTRAINT educational_consultancy_study_abroad_company_type_check CHECK ((company_type = ANY (ARRAY['consultancy'::text, 'education_agent'::text, 'visa_consultant'::text, 'university_representative'::text]))),
    CONSTRAINT educational_consultancy_study_abroad_listing_type_check CHECK ((listing_type = ANY (ARRAY['consultancy'::text, 'admission_service'::text, 'visa_assistance'::text, 'complete_package'::text])))
);


ALTER TABLE public.educational_consultancy_study_abroad OWNER TO postgres;

--
-- Name: electronics_gadgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.electronics_gadgets (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    category text NOT NULL,
    subcategory text,
    brand text NOT NULL,
    model text NOT NULL,
    product_name text,
    color text,
    storage_capacity text,
    ram text,
    processor text,
    screen_size text,
    battery_capacity text,
    camera_specs text,
    operating_system text,
    connectivity jsonb DEFAULT '[]'::jsonb,
    condition text NOT NULL,
    usage_duration text,
    purchase_date text,
    price numeric(12,2) NOT NULL,
    original_price numeric(12,2),
    rental_price_per_day numeric(10,2),
    rental_price_per_month numeric(10,2),
    is_negotiable boolean DEFAULT false,
    warranty_available boolean DEFAULT false,
    warranty_period text,
    warranty_type text,
    bill_available boolean DEFAULT false,
    box_available boolean DEFAULT false,
    accessories_included jsonb DEFAULT '[]'::jsonb,
    charger_included boolean DEFAULT true,
    original_accessories boolean DEFAULT false,
    screen_condition text,
    body_condition text,
    functional_issues jsonb DEFAULT '[]'::jsonb,
    repairs_done text,
    water_damage boolean DEFAULT false,
    exchange_accepted boolean DEFAULT false,
    exchange_preferences text,
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    seller_id character varying,
    seller_type text,
    shop_name text,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    delivery_available boolean DEFAULT false,
    delivery_charges numeric(8,2),
    pickup_available boolean DEFAULT true,
    shipping_options jsonb DEFAULT '[]'::jsonb,
    reason_for_selling text,
    purchased_from text,
    imei_number text,
    serial_number text,
    features jsonb DEFAULT '[]'::jsonb,
    additional_info text,
    return_policy text,
    refund_available boolean DEFAULT false,
    testing_allowed boolean DEFAULT true,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    is_urgent boolean DEFAULT false,
    view_count integer DEFAULT 0,
    inquiry_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT electronics_gadgets_availability_status_check CHECK ((availability_status = ANY (ARRAY['available'::text, 'sold'::text, 'reserved'::text, 'rented'::text]))),
    CONSTRAINT electronics_gadgets_category_check CHECK ((category = ANY (ARRAY['mobile'::text, 'laptop'::text, 'tablet'::text, 'camera'::text, 'gaming'::text, 'tv'::text, 'audio'::text, 'smartwatch'::text, 'accessories'::text, 'other'::text]))),
    CONSTRAINT electronics_gadgets_condition_check CHECK ((condition = ANY (ARRAY['new'::text, 'like_new'::text, 'good'::text, 'fair'::text, 'poor'::text]))),
    CONSTRAINT electronics_gadgets_listing_type_check CHECK ((listing_type = ANY (ARRAY['sell'::text, 'rent'::text, 'exchange'::text]))),
    CONSTRAINT electronics_gadgets_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT electronics_gadgets_seller_type_check CHECK ((seller_type = ANY (ARRAY['individual'::text, 'dealer'::text, 'retailer'::text])))
);


ALTER TABLE public.electronics_gadgets OWNER TO postgres;

--
-- Name: event_decoration_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_decoration_services (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    service_type text NOT NULL,
    service_category text,
    venue_name text,
    venue_type text,
    capacity integer,
    capacity_seating integer,
    capacity_standing integer,
    hall_area numeric(10,2),
    area_unit text DEFAULT 'sq.ft'::text,
    base_price numeric(12,2) NOT NULL,
    price_type text DEFAULT 'per_event'::text,
    price_per_hour numeric(10,2),
    price_per_day numeric(10,2),
    minimum_booking_hours integer,
    minimum_charge numeric(10,2),
    security_deposit numeric(10,2),
    catering_available boolean DEFAULT false,
    catering_included boolean DEFAULT false,
    catering_price_per_plate numeric(8,2),
    decoration_included boolean DEFAULT false,
    decoration_charges numeric(10,2),
    dj_sound_available boolean DEFAULT false,
    dj_sound_charges numeric(8,2),
    lighting_available boolean DEFAULT false,
    lighting_lighting_charges numeric(8,2),
    parking_available boolean DEFAULT false,
    parking_capacity integer,
    parking_charges numeric(8,2),
    valet_parking_available boolean DEFAULT false,
    ac_available boolean DEFAULT false,
    power_backup boolean DEFAULT false,
    green_rooms integer,
    washrooms integer,
    kitchen_facility boolean DEFAULT false,
    bar_available boolean DEFAULT false,
    photography_allowed boolean DEFAULT true,
    outside_catering_allowed boolean DEFAULT false,
    outside_decorator_allowed boolean DEFAULT false,
    amenities jsonb DEFAULT '[]'::jsonb,
    services_offered jsonb DEFAULT '[]'::jsonb,
    decoration_types jsonb DEFAULT '[]'::jsonb,
    event_types_supported jsonb DEFAULT '[]'::jsonb,
    material_types jsonb DEFAULT '[]'::jsonb,
    themes jsonb DEFAULT '[]'::jsonb,
    available_equipment jsonb DEFAULT '[]'::jsonb,
    floor_type text,
    ceiling_height text,
    stage_available boolean DEFAULT false,
    stage_dimensions text,
    projector_available boolean DEFAULT false,
    audio_system_available boolean DEFAULT false,
    wifi_available boolean DEFAULT false,
    live_streaming_support boolean DEFAULT false,
    brand_name text,
    product_name text,
    material text,
    color text,
    dimensions text,
    weight text,
    quantity integer,
    minimum_order_quantity integer,
    stock_available boolean DEFAULT true,
    rental_available boolean DEFAULT false,
    rental_price_per_day numeric(10,2),
    business_name text,
    owner_name text,
    registration_number text,
    experience_years integer,
    team_size integer,
    events_planner_available boolean DEFAULT false,
    planner_charges numeric(10,2),
    setup_included boolean DEFAULT false,
    setup_charges numeric(10,2),
    teardown_included boolean DEFAULT false,
    coordinator_provided boolean DEFAULT false,
    customization_available boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_number text,
    whatsapp_available boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    location_id character varying,
    nearby_landmarks text,
    accessibility_features jsonb DEFAULT '[]'::jsonb,
    working_hours text,
    working_days text,
    available_24_7 boolean DEFAULT false,
    advance_booking_required boolean DEFAULT true,
    minimum_advance_booking_days integer DEFAULT 7,
    peak_season_charges numeric(10,2),
    off_season_discount numeric(5,2),
    package_deals jsonb DEFAULT '[]'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    portfolio_images jsonb DEFAULT '[]'::jsonb,
    virtual_tour_url text,
    website_url text,
    payment_methods jsonb DEFAULT '[]'::jsonb,
    advance_payment_required boolean DEFAULT true,
    advance_payment_percentage numeric(5,2),
    cancellation_policy text,
    refund_policy text,
    terms_and_conditions text,
    insurance_available boolean DEFAULT false,
    license_verified boolean DEFAULT false,
    covid_safety_measures jsonb DEFAULT '[]'::jsonb,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_events_hosted integer DEFAULT 0,
    total_bookings integer DEFAULT 0,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    is_premium boolean DEFAULT false NOT NULL,
    owner_id character varying,
    view_count integer DEFAULT 0,
    inquiry_count integer DEFAULT 0,
    booking_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT event_decoration_services_base_price_check CHECK ((base_price >= (0)::numeric)),
    CONSTRAINT event_decoration_services_price_type_check CHECK ((price_type = ANY (ARRAY['per_event'::text, 'per_day'::text, 'per_hour'::text, 'per_item'::text]))),
    CONSTRAINT event_decoration_services_service_type_check CHECK ((service_type = ANY (ARRAY['marriage_hall'::text, 'party_venue'::text, 'cafe_setup'::text, 'decoration_materials'::text, 'decoration_service'::text, 'event_planning'::text]))),
    CONSTRAINT event_decoration_services_venue_type_check CHECK ((venue_type = ANY (ARRAY['indoor'::text, 'outdoor'::text, 'both'::text])))
);


ALTER TABLE public.event_decoration_services OWNER TO postgres;

--
-- Name: fashion_beauty_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fashion_beauty_products (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    category text NOT NULL,
    subcategory text,
    product_type text,
    brand text,
    product_name text,
    color text,
    size text,
    material text,
    pattern text,
    style text,
    occasion text,
    gender text,
    age_group text,
    fit_type text,
    sleeve_type text,
    neck_type text,
    length text,
    waist_size text,
    inseam text,
    product_volume text,
    skin_type text,
    hair_type text,
    fragrance_type text,
    ingredients jsonb DEFAULT '[]'::jsonb,
    expiry_date text,
    manufacturing_date text,
    shelf_life text,
    price numeric(12,2) NOT NULL,
    mrp numeric(12,2),
    discount_percentage numeric(5,2),
    rental_price_per_day numeric(10,2),
    rental_price_per_week numeric(10,2),
    rental_price_per_month numeric(10,2),
    minimum_rental_period integer,
    rental_period_unit text,
    security_deposit numeric(10,2),
    condition text,
    usage_duration text,
    purchase_date text,
    age_in_months integer,
    quality_grade text,
    is_original boolean DEFAULT true,
    brand_authorized boolean DEFAULT false,
    certificate_available boolean DEFAULT false,
    authentication_proof jsonb DEFAULT '[]'::jsonb,
    care_instructions text,
    washing_instructions text,
    dry_clean_only boolean DEFAULT false,
    iron_safe boolean DEFAULT true,
    fabric_care jsonb DEFAULT '[]'::jsonb,
    dermatologically_tested boolean DEFAULT false,
    cruelty_free boolean DEFAULT false,
    vegan boolean DEFAULT false,
    organic boolean DEFAULT false,
    paraben_free boolean DEFAULT false,
    sulfate_free boolean DEFAULT false,
    allergen_info text,
    in_stock boolean DEFAULT true,
    stock_quantity integer,
    sizes_available jsonb DEFAULT '[]'::jsonb,
    colors_available jsonb DEFAULT '[]'::jsonb,
    variant_options jsonb DEFAULT '[]'::jsonb,
    customization_available boolean DEFAULT false,
    custom_sizing boolean DEFAULT false,
    personalization_options jsonb DEFAULT '[]'::jsonb,
    tailoring_included boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    size_chart text,
    product_brochure text,
    key_features jsonb DEFAULT '[]'::jsonb,
    fabric_features jsonb DEFAULT '[]'::jsonb,
    special_features jsonb DEFAULT '[]'::jsonb,
    included_items jsonb DEFAULT '[]'::jsonb,
    box_contents jsonb DEFAULT '[]'::jsonb,
    is_on_sale boolean DEFAULT false,
    sale_end_date timestamp with time zone,
    bank_offers jsonb DEFAULT '[]'::jsonb,
    combo_offers jsonb DEFAULT '[]'::jsonb,
    bulk_discount_available boolean DEFAULT false,
    return_policy text,
    return_period_days integer,
    replacement_policy text,
    exchange_available boolean DEFAULT true,
    refund_available boolean DEFAULT true,
    warranty_available boolean DEFAULT false,
    warranty_period text,
    seller_id character varying,
    seller_type text,
    shop_name text,
    boutique_name text,
    designer_name text,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    whatsapp_number text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    delivery_available boolean DEFAULT false,
    delivery_charges numeric(8,2),
    free_delivery boolean DEFAULT false,
    free_delivery_above numeric(10,2),
    same_day_delivery boolean DEFAULT false,
    express_delivery boolean DEFAULT false,
    delivery_areas jsonb DEFAULT '[]'::jsonb,
    shipping_options jsonb DEFAULT '[]'::jsonb,
    cod_available boolean DEFAULT true,
    occasion_suitable jsonb DEFAULT '[]'::jsonb,
    season text,
    collection_name text,
    launch_year integer,
    limited_edition boolean DEFAULT false,
    handcrafted boolean DEFAULT false,
    made_in text,
    eco_friendly boolean DEFAULT false,
    sustainable_fashion boolean DEFAULT false,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_sales integer DEFAULT 0,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_verified boolean DEFAULT false,
    availability_status text DEFAULT 'available'::text,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT fashion_beauty_products_condition_check CHECK ((condition = ANY (ARRAY['new'::text, 'like_new'::text, 'gently_used'::text, 'used'::text, 'refurbished'::text]))),
    CONSTRAINT fashion_beauty_products_gender_check CHECK ((gender = ANY (ARRAY['men'::text, 'women'::text, 'unisex'::text, 'kids'::text, 'boys'::text, 'girls'::text]))),
    CONSTRAINT fashion_beauty_products_listing_type_check CHECK ((listing_type = ANY (ARRAY['sale'::text, 'rent'::text, 'exchange'::text]))),
    CONSTRAINT fashion_beauty_products_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.fashion_beauty_products OWNER TO postgres;

--
-- Name: furniture_interior_decor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.furniture_interior_decor (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    category text NOT NULL,
    subcategory text,
    item_type text,
    brand text,
    material text,
    color text,
    dimensions text,
    weight text,
    condition text,
    age_in_months integer,
    price numeric(12,2) NOT NULL,
    original_price numeric(12,2),
    rental_price_per_day numeric(10,2),
    rental_price_per_week numeric(10,2),
    rental_price_per_month numeric(10,2),
    minimum_rental_period integer,
    rental_period_unit text,
    is_negotiable boolean DEFAULT false,
    assembly_required boolean DEFAULT false,
    assembly_service_available boolean DEFAULT false,
    assembly_charges numeric(8,2),
    custom_made boolean DEFAULT false,
    customization_available boolean DEFAULT false,
    style text,
    room_type text,
    seating_capacity integer,
    warranty_available boolean DEFAULT false,
    warranty_period text,
    warranty_type text,
    bill_available boolean DEFAULT false,
    set_items integer,
    is_set boolean DEFAULT false,
    service_type text,
    services_offered jsonb DEFAULT '[]'::jsonb,
    interior_design boolean DEFAULT false,
    consultation_available boolean DEFAULT false,
    consultation_charges numeric(8,2),
    installation_service boolean DEFAULT false,
    installation_charges numeric(8,2),
    repair_service boolean DEFAULT false,
    restoration_service boolean DEFAULT false,
    upholstery_service boolean DEFAULT false,
    features jsonb DEFAULT '[]'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    delivery_available boolean DEFAULT false,
    delivery_charges numeric(8,2),
    free_delivery boolean DEFAULT false,
    pickup_available boolean DEFAULT true,
    shipping_options jsonb DEFAULT '[]'::jsonb,
    exchange_accepted boolean DEFAULT false,
    exchange_preferences text,
    return_policy text,
    return_period_days integer,
    refund_available boolean DEFAULT false,
    seller_id character varying,
    seller_type text,
    shop_name text,
    showroom_name text,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    whatsapp_number text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    reason_for_selling text,
    purchased_from text,
    purchase_date text,
    care_instructions text,
    additional_info text,
    business_name text,
    registration_number text,
    experience_years integer,
    certifications jsonb DEFAULT '[]'::jsonb,
    portfolio_url text,
    working_hours text,
    working_days text,
    available_24_7 boolean DEFAULT false,
    advance_booking_required boolean DEFAULT false,
    base_service_charge numeric(10,2),
    price_per_sqft numeric(8,2),
    minimum_order_value numeric(10,2),
    bulk_discount_available boolean DEFAULT false,
    payment_methods jsonb DEFAULT '[]'::jsonb,
    advance_payment_required boolean DEFAULT false,
    advance_payment_percentage numeric(5,2),
    emi_available boolean DEFAULT false,
    terms_and_conditions text,
    cancellation_policy text,
    in_stock boolean DEFAULT true,
    stock_quantity integer,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    is_urgent boolean DEFAULT false,
    view_count integer DEFAULT 0,
    inquiry_count integer DEFAULT 0,
    favorite_count integer DEFAULT 0,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT furniture_interior_decor_category_check CHECK ((category = ANY (ARRAY['furniture'::text, 'decor'::text, 'furnishing'::text, 'lighting'::text, 'storage'::text, 'outdoor'::text, 'custom'::text]))),
    CONSTRAINT furniture_interior_decor_condition_check CHECK ((condition = ANY (ARRAY['new'::text, 'like new'::text, 'good'::text, 'fair'::text, 'needs repair'::text]))),
    CONSTRAINT furniture_interior_decor_listing_type_check CHECK ((listing_type = ANY (ARRAY['sale'::text, 'rent'::text, 'service'::text]))),
    CONSTRAINT furniture_interior_decor_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT furniture_interior_decor_rental_period_unit_check CHECK ((rental_period_unit = ANY (ARRAY['day'::text, 'week'::text, 'month'::text])))
);


ALTER TABLE public.furniture_interior_decor OWNER TO postgres;

--
-- Name: health_wellness_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.health_wellness_services (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    service_type text NOT NULL,
    specialization text,
    consultation_type text,
    consultation_fee numeric(10,2),
    doctor_name text,
    qualifications text,
    experience_years integer,
    registration_number text,
    timings text,
    appointment_required boolean DEFAULT true,
    emergency_service boolean DEFAULT false,
    home_visit boolean DEFAULT false,
    online_consultation boolean DEFAULT false,
    insurance_accepted boolean DEFAULT false,
    services_offered jsonb DEFAULT '[]'::jsonb,
    facilities jsonb DEFAULT '[]'::jsonb,
    languages jsonb DEFAULT '[]'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_number text,
    website text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    location_id character varying,
    working_hours text,
    working_days text,
    available_24_7 boolean DEFAULT false,
    wheelchair_accessible boolean DEFAULT false,
    parking_available boolean DEFAULT false,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_patients integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text
);


ALTER TABLE public.health_wellness_services OWNER TO postgres;

--
-- Name: heavy_equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.heavy_equipment (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    equipment_type text NOT NULL,
    category text NOT NULL,
    brand text,
    model text,
    year integer,
    price numeric(12,2) NOT NULL,
    price_type text DEFAULT 'total'::text,
    condition text,
    hours_used integer,
    serial_number text,
    specifications jsonb DEFAULT '{}'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    features jsonb DEFAULT '[]'::jsonb,
    maintenance_history text,
    warranty_info text,
    is_negotiable boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    seller_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT heavy_equipment_condition_check CHECK ((condition = ANY (ARRAY['new'::text, 'used'::text, 'refurbished'::text]))),
    CONSTRAINT heavy_equipment_listing_type_check CHECK ((listing_type = ANY (ARRAY['sale'::text, 'rent'::text, 'lease'::text]))),
    CONSTRAINT heavy_equipment_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT heavy_equipment_price_type_check CHECK ((price_type = ANY (ARRAY['hourly'::text, 'daily'::text, 'monthly'::text, 'total'::text])))
);


ALTER TABLE public.heavy_equipment OWNER TO postgres;

--
-- Name: hostel_listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hostel_listings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    price_per_month numeric(10,2) NOT NULL,
    hostel_type text NOT NULL,
    room_type text NOT NULL,
    total_beds integer NOT NULL,
    available_beds integer NOT NULL,
    country text NOT NULL,
    state_province text,
    city text NOT NULL,
    area text,
    full_address text NOT NULL,
    contact_person text,
    contact_phone text,
    rules text,
    facilities jsonb DEFAULT '[]'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    food_included boolean DEFAULT false,
    featured boolean DEFAULT false,
    active boolean DEFAULT true,
    owner_id character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text
);


ALTER TABLE public.hostel_listings OWNER TO postgres;

--
-- Name: household_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.household_services (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    service_type text NOT NULL,
    service_category text,
    services_offered jsonb DEFAULT '[]'::jsonb,
    base_service_charge numeric(10,2) NOT NULL,
    hourly_rate numeric(8,2),
    minimum_charge numeric(8,2),
    pricing_type text DEFAULT 'fixed'::text,
    free_inspection boolean DEFAULT false,
    free_estimate boolean DEFAULT true,
    emergency_service boolean DEFAULT false,
    emergency_charges numeric(8,2),
    same_day_service boolean DEFAULT false,
    warranty_provided boolean DEFAULT false,
    warranty_period text,
    warranty_details text,
    available_24_7 boolean DEFAULT false,
    working_hours text,
    working_days text,
    advance_booking_required boolean DEFAULT false,
    minimum_booking_hours integer DEFAULT 2,
    business_name text,
    owner_name text,
    registration_number text,
    experience_years integer,
    team_size integer,
    certified_professional boolean DEFAULT false,
    certification_details text,
    residential_service boolean DEFAULT true,
    commercial_service boolean DEFAULT false,
    industrial_service boolean DEFAULT false,
    specializations jsonb DEFAULT '[]'::jsonb,
    equipment_provided boolean DEFAULT true,
    materials_included boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_number text,
    whatsapp_available boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    location_id character varying,
    service_areas jsonb DEFAULT '[]'::jsonb,
    service_radius_km integer,
    travel_charges numeric(8,2),
    home_visit_available boolean DEFAULT true,
    pickup_service boolean DEFAULT false,
    onsite_repair boolean DEFAULT true,
    offsite_repair boolean DEFAULT false,
    consultation_available boolean DEFAULT false,
    consultation_charges numeric(8,2),
    senior_citizen_discount boolean DEFAULT false,
    first_time_discount boolean DEFAULT false,
    bulk_service_discount boolean DEFAULT false,
    contract_available boolean DEFAULT false,
    amc_available boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    certifications jsonb DEFAULT '[]'::jsonb,
    portfolio_images jsonb DEFAULT '[]'::jsonb,
    payment_methods jsonb DEFAULT '[]'::jsonb,
    advance_payment_required boolean DEFAULT false,
    advance_payment_percentage numeric(5,2),
    cash_on_delivery boolean DEFAULT true,
    digital_payment boolean DEFAULT true,
    terms_and_conditions text,
    cancellation_policy text,
    refund_policy text,
    privacy_policy text,
    customer_support_number text,
    support_email text,
    response_time text,
    complaint_number text,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_jobs_completed integer DEFAULT 0,
    total_customers integer DEFAULT 0,
    repeat_customer_percentage numeric(5,2),
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    is_background_verified boolean DEFAULT false,
    owner_id character varying,
    view_count integer DEFAULT 0,
    inquiry_count integer DEFAULT 0,
    booking_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT household_services_availability_status_check CHECK ((availability_status = ANY (ARRAY['available'::text, 'busy'::text, 'unavailable'::text]))),
    CONSTRAINT household_services_base_service_charge_check CHECK ((base_service_charge >= (0)::numeric)),
    CONSTRAINT household_services_pricing_type_check CHECK ((pricing_type = ANY (ARRAY['fixed'::text, 'hourly'::text, 'per_visit'::text, 'contract'::text]))),
    CONSTRAINT household_services_service_category_check CHECK ((service_category = ANY (ARRAY['repair'::text, 'installation'::text, 'maintenance'::text, 'cleaning'::text, 'renovation'::text, 'emergency'::text]))),
    CONSTRAINT household_services_service_type_check CHECK ((service_type = ANY (ARRAY['plumbing'::text, 'cleaning'::text, 'electrical'::text, 'carpentry'::text, 'painting'::text, 'pest_control'::text, 'appliance_repair'::text, 'gardening'::text, 'ac_repair'::text, 'home_maintenance'::text, 'other'::text])))
);


ALTER TABLE public.household_services OWNER TO postgres;

--
-- Name: industrial_land; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.industrial_land (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    price numeric(12,2) NOT NULL,
    area numeric(10,2) NOT NULL,
    area_unit text DEFAULT 'ropani'::text,
    land_type text,
    zoning text,
    road_access text,
    electricity_available boolean DEFAULT false,
    water_supply boolean DEFAULT false,
    sewerage_available boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    suitable_for jsonb DEFAULT '[]'::jsonb,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    agency_id character varying,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text
);


ALTER TABLE public.industrial_land OWNER TO postgres;

--
-- Name: industrial_properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.industrial_properties (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    industrial_type text NOT NULL,
    listing_type text NOT NULL,
    price numeric(12,2) NOT NULL,
    price_type text,
    land_area numeric(12,2),
    built_up_area numeric(12,2),
    area_unit text DEFAULT 'sq.ft'::text,
    floors integer,
    power_supply text,
    water_facility boolean DEFAULT false,
    road_access text,
    loading_docks integer,
    parking_spaces integer,
    crane_facility boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    amenities jsonb DEFAULT '[]'::jsonb,
    suitable_for jsonb DEFAULT '[]'::jsonb,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    agency_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT industrial_properties_industrial_type_check CHECK ((industrial_type = ANY (ARRAY['factory'::text, 'warehouse'::text, 'industrial land'::text, 'logistics hub'::text, 'manufacturing unit'::text]))),
    CONSTRAINT industrial_properties_listing_type_check CHECK ((listing_type = ANY (ARRAY['rent'::text, 'sale'::text, 'lease'::text]))),
    CONSTRAINT industrial_properties_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT industrial_properties_price_type_check CHECK ((price_type = ANY (ARRAY['monthly'::text, 'yearly'::text, 'total'::text])))
);


ALTER TABLE public.industrial_properties OWNER TO postgres;

--
-- Name: jewelry_accessories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jewelry_accessories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    category text NOT NULL,
    subcategory text,
    item_type text,
    material text,
    metal_purity text,
    gemstones jsonb DEFAULT '[]'::jsonb,
    weight text,
    dimensions text,
    brand text,
    design text,
    occasion text,
    gender text,
    condition text,
    price numeric(12,2) NOT NULL,
    original_price numeric(12,2),
    discount_percentage numeric(5,2),
    is_negotiable boolean DEFAULT false,
    customization_available boolean DEFAULT false,
    hallmark_certified boolean DEFAULT false,
    certificate_available boolean DEFAULT false,
    warranty_available boolean DEFAULT false,
    warranty_period text,
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    features jsonb DEFAULT '[]'::jsonb,
    in_stock boolean DEFAULT true,
    stock_quantity integer,
    seller_id character varying,
    seller_type text,
    shop_name text,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    whatsapp_available boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    delivery_available boolean DEFAULT false,
    delivery_charges numeric(8,2),
    return_policy text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text,
    CONSTRAINT jewelry_accessories_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.jewelry_accessories OWNER TO postgres;

--
-- Name: language_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.language_classes (
    id character varying NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    language_name text NOT NULL,
    proficiency_level text NOT NULL,
    course_duration_months integer NOT NULL,
    classes_per_week integer,
    class_duration_hours numeric(4,2),
    teaching_mode text,
    class_type text,
    batch_size integer,
    instructor_name text,
    instructor_qualification text,
    instructor_experience integer,
    native_speaker boolean DEFAULT false NOT NULL,
    fee_per_month numeric(10,2) NOT NULL,
    registration_fee numeric(10,2),
    total_course_fee numeric(10,2),
    study_materials_provided jsonb DEFAULT '[]'::jsonb,
    certification_provided boolean DEFAULT false NOT NULL,
    free_demo_class boolean DEFAULT false NOT NULL,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text,
    images jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.language_classes OWNER TO postgres;

--
-- Name: music_arts_sports_academies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.music_arts_sports_academies (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    academy_name text NOT NULL,
    academy_category text NOT NULL,
    specialization text,
    programs_offered jsonb DEFAULT '[]'::jsonb,
    fee_structure text,
    monthly_fee numeric(10,2),
    admission_fee numeric(10,2),
    instructor_qualifications text,
    certification_provided boolean DEFAULT false,
    performance_opportunities boolean DEFAULT false,
    instrument_provided boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    images jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text
);


ALTER TABLE public.music_arts_sports_academies OWNER TO postgres;

--
-- Name: office_spaces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.office_spaces (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    price numeric(12,2) NOT NULL,
    price_type text DEFAULT 'monthly'::text,
    area numeric(10,2),
    office_type text,
    capacity integer,
    cabins integer,
    workstations integer,
    meeting_rooms integer,
    furnishing_status text,
    images jsonb DEFAULT '[]'::jsonb,
    amenities jsonb DEFAULT '[]'::jsonb,
    parking_spaces integer,
    floor integer,
    total_floors integer,
    available_from timestamp with time zone,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    agency_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT office_spaces_listing_type_check CHECK ((listing_type = ANY (ARRAY['rent'::text, 'sale'::text, 'lease'::text]))),
    CONSTRAINT office_spaces_office_type_check CHECK ((office_type = ANY (ARRAY['private'::text, 'shared'::text, 'coworking'::text, 'virtual'::text]))),
    CONSTRAINT office_spaces_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT office_spaces_price_type_check CHECK ((price_type = ANY (ARRAY['monthly'::text, 'yearly'::text, 'total'::text])))
);


ALTER TABLE public.office_spaces OWNER TO postgres;

--
-- Name: pharmacy_medical_stores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_medical_stores (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text DEFAULT 'pharmacy'::text NOT NULL,
    store_name text NOT NULL,
    pharmacy_name text,
    license_number text,
    establishment_year integer,
    owner_name text,
    pharmacist_name text,
    pharmacist_qualification text,
    pharmacist_registration_number text,
    medicine_types jsonb DEFAULT '[]'::jsonb,
    prescription_medicines boolean DEFAULT true,
    otc_medicines boolean DEFAULT true,
    ayurvedic_products boolean DEFAULT false,
    homeopathic_medicines boolean DEFAULT false,
    surgical_items boolean DEFAULT false,
    medical_devices boolean DEFAULT false,
    healthcare_products boolean DEFAULT true,
    baby_care_products boolean DEFAULT false,
    home_delivery boolean DEFAULT false,
    free_home_delivery boolean DEFAULT false,
    minimum_order_for_free_delivery numeric(10,2),
    delivery_charges numeric(8,2),
    same_day_delivery boolean DEFAULT false,
    emergency_delivery boolean DEFAULT false,
    prescription_upload boolean DEFAULT false,
    online_consultation boolean DEFAULT false,
    medicine_reminder_service boolean DEFAULT false,
    chronic_disease_medicines boolean DEFAULT false,
    cancer_medicines boolean DEFAULT false,
    diabetic_care boolean DEFAULT false,
    cardiac_care boolean DEFAULT false,
    pediatric_medicines boolean DEFAULT false,
    geriatric_care boolean DEFAULT false,
    discount_available boolean DEFAULT false,
    discount_percentage numeric(5,2),
    senior_citizen_discount boolean DEFAULT false,
    senior_citizen_discount_percentage numeric(5,2),
    loyalty_program boolean DEFAULT false,
    subscription_available boolean DEFAULT false,
    generic_medicines_available boolean DEFAULT true,
    cold_storage_available boolean DEFAULT false,
    refrigerated_medicines boolean DEFAULT false,
    vaccine_storage boolean DEFAULT false,
    drug_license_number text,
    fssai_license text,
    iso_certified boolean DEFAULT false,
    authentic_medicines_guaranteed boolean DEFAULT true,
    open_24_7 boolean DEFAULT false,
    working_hours text,
    working_days text,
    emergency_services boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_number text,
    whatsapp_available boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    landmark text,
    pincode text,
    location_id character varying,
    parking_available boolean DEFAULT false,
    wheelchair_accessible boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    certificates_images jsonb DEFAULT '[]'::jsonb,
    payment_methods jsonb DEFAULT '[]'::jsonb,
    upi_payment boolean DEFAULT false,
    card_payment boolean DEFAULT false,
    cash_payment boolean DEFAULT true,
    insurance_accepted jsonb DEFAULT '[]'::jsonb,
    terms_and_conditions text,
    return_policy text,
    refund_policy text,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_orders integer DEFAULT 0,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_id character varying,
    role text,
    CONSTRAINT pharmacy_medical_stores_listing_type_check CHECK ((listing_type = ANY (ARRAY['pharmacy'::text, 'medical_store'::text, 'medicine_shop'::text, 'online_pharmacy'::text, 'veterinary_pharmacy'::text])))
);


ALTER TABLE public.pharmacy_medical_stores OWNER TO postgres;

--
-- Name: phones_tablets_accessories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phones_tablets_accessories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    category text NOT NULL,
    subcategory text,
    product_type text,
    brand text NOT NULL,
    model text NOT NULL,
    product_name text,
    color text,
    storage_capacity text,
    ram text,
    processor text,
    screen_size text,
    battery_capacity text,
    camera_specs text,
    operating_system text,
    connectivity jsonb DEFAULT '[]'::jsonb,
    display_type text,
    refresh_rate text,
    price numeric(12,2) NOT NULL,
    mrp numeric(12,2),
    discount_percentage numeric(5,2),
    rental_price_per_day numeric(10,2),
    rental_price_per_month numeric(10,2),
    emi_available boolean DEFAULT false,
    emi_starting_from numeric(10,2),
    warranty_period text,
    warranty_type text,
    manufacturer_warranty boolean DEFAULT true,
    extended_warranty_available boolean DEFAULT false,
    in_stock boolean DEFAULT true,
    stock_quantity integer,
    expected_delivery_days integer,
    key_features jsonb DEFAULT '[]'::jsonb,
    accessories_included jsonb DEFAULT '[]'::jsonb,
    box_contents jsonb DEFAULT '[]'::jsonb,
    compatible_devices jsonb DEFAULT '[]'::jsonb,
    accessory_type text,
    material text,
    is_on_sale boolean DEFAULT false,
    sale_end_date timestamp without time zone,
    bank_offers jsonb DEFAULT '[]'::jsonb,
    exchange_offer boolean DEFAULT false,
    exchange_discount_up_to numeric(10,2),
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    product_brochure text,
    seller_id character varying,
    seller_type text,
    shop_name text,
    brand_authorized boolean DEFAULT false,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    free_delivery boolean DEFAULT false,
    delivery_charges numeric(8,2),
    same_day_delivery boolean DEFAULT false,
    cod_available boolean DEFAULT true,
    shipping_options jsonb DEFAULT '[]'::jsonb,
    delivery_areas jsonb DEFAULT '[]'::jsonb,
    bis_certified boolean DEFAULT false,
    certification_details text,
    original_product boolean DEFAULT true,
    made_in text,
    launch_date text,
    specifications jsonb DEFAULT '{}'::jsonb,
    technical_details text,
    return_policy text,
    return_period_days integer,
    replacement_policy text,
    refund_available boolean DEFAULT true,
    customer_care_number text,
    service_center_available boolean DEFAULT false,
    installation_support boolean DEFAULT false,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    is_trending boolean DEFAULT false,
    is_new_arrival boolean DEFAULT false,
    is_best_seller boolean DEFAULT false,
    view_count integer DEFAULT 0,
    inquiry_count integer DEFAULT 0,
    purchase_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT phones_tablets_accessories_availability_status_check CHECK ((availability_status = ANY (ARRAY['available'::text, 'out_of_stock'::text, 'pre_order'::text, 'discontinued'::text]))),
    CONSTRAINT phones_tablets_accessories_category_check CHECK ((category = ANY (ARRAY['phone'::text, 'tablet'::text, 'accessory'::text]))),
    CONSTRAINT phones_tablets_accessories_listing_type_check CHECK ((listing_type = ANY (ARRAY['sell'::text, 'rent'::text]))),
    CONSTRAINT phones_tablets_accessories_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT phones_tablets_accessories_seller_type_check CHECK ((seller_type = ANY (ARRAY['brand'::text, 'authorized_dealer'::text, 'retailer'::text])))
);


ALTER TABLE public.phones_tablets_accessories OWNER TO postgres;

--
-- Name: pro_profile_fields; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pro_profile_fields (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    profile_type_id character varying NOT NULL,
    key text NOT NULL,
    label text NOT NULL,
    field_type text NOT NULL,
    is_required boolean DEFAULT false,
    placeholder text,
    help_text text,
    sort_order integer DEFAULT 0,
    options jsonb DEFAULT '[]'::jsonb,
    config jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pro_profile_fields OWNER TO postgres;

--
-- Name: pro_profile_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pro_profile_types (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    icon text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pro_profile_types OWNER TO postgres;

--
-- Name: pro_profile_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pro_profile_values (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    profile_id character varying NOT NULL,
    field_id character varying NOT NULL,
    value jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pro_profile_values OWNER TO postgres;

--
-- Name: pro_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pro_profiles (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    profile_type_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pro_profiles OWNER TO postgres;

--
-- Name: property_deals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_deals (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    deal_type text NOT NULL,
    property_type text NOT NULL,
    price numeric(12,2) NOT NULL,
    area numeric(10,2),
    area_unit text DEFAULT 'sq.ft'::text,
    bedrooms integer,
    bathrooms integer,
    floors integer,
    road_access text,
    facing_direction text,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    features jsonb DEFAULT '[]'::jsonb,
    is_negotiable boolean DEFAULT false,
    ownership_type text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    agency_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT property_deals_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.property_deals OWNER TO postgres;

--
-- Name: rental_listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rental_listings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    rental_type text NOT NULL,
    bedrooms integer,
    bathrooms integer,
    area numeric(8,2),
    furnishing_status text,
    images jsonb DEFAULT '[]'::jsonb,
    amenities jsonb DEFAULT '[]'::jsonb,
    available_from timestamp with time zone,
    deposit_amount numeric(10,2),
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    agency_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT rental_listings_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT rental_listings_rental_type_check CHECK ((rental_type = ANY (ARRAY['room'::text, 'flat'::text, 'apartment'::text, 'house'::text])))
);


ALTER TABLE public.rental_listings OWNER TO postgres;

--
-- Name: saree_clothing_shopping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saree_clothing_shopping (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    category text NOT NULL,
    subcategory text,
    product_type text,
    brand text,
    product_name text,
    color text,
    size text,
    material text,
    fabric_type text,
    pattern text,
    style text,
    occasion text,
    saree_type text,
    saree_length text,
    blouse_piece_included boolean DEFAULT false,
    blouse_piece_length text,
    border_type text,
    pallu_design text,
    work_type text,
    weave_type text,
    transparency text,
    fall_pico_done boolean DEFAULT false,
    gender text,
    age_group text,
    fit_type text,
    sleeve_type text,
    neck_type text,
    length text,
    waist_size text,
    chest_size text,
    shoulder_width text,
    inseam text,
    rise text,
    clothing_type text,
    is_set boolean DEFAULT false,
    set_includes jsonb DEFAULT '[]'::jsonb,
    combo_pieces integer,
    dupatta_included boolean DEFAULT false,
    dupatta_length text,
    dupatta_material text,
    price numeric(12,2) NOT NULL,
    mrp numeric(12,2),
    discount_percentage numeric(5,2),
    rental_price_per_day numeric(10,2),
    rental_price_per_week numeric(10,2),
    rental_price_per_month numeric(10,2),
    minimum_rental_period integer,
    rental_period_unit text,
    security_deposit numeric(10,2),
    condition text,
    usage_duration text,
    purchase_date text,
    age_in_months integer,
    quality_grade text,
    wear_count integer,
    is_original boolean DEFAULT true,
    handloom_certified boolean DEFAULT false,
    brand_authorized boolean DEFAULT false,
    certificate_available boolean DEFAULT false,
    authentication_proof jsonb DEFAULT '[]'::jsonb,
    care_instructions text,
    washing_instructions text,
    dry_clean_only boolean DEFAULT false,
    iron_safe boolean DEFAULT true,
    machine_washable boolean DEFAULT false,
    hand_wash_only boolean DEFAULT false,
    fabric_care jsonb DEFAULT '[]'::jsonb,
    in_stock boolean DEFAULT true,
    stock_quantity integer,
    sizes_available jsonb DEFAULT '[]'::jsonb,
    colors_available jsonb DEFAULT '[]'::jsonb,
    variant_options jsonb DEFAULT '[]'::jsonb,
    ready_to_ship boolean DEFAULT true,
    made_to_order boolean DEFAULT false,
    customization_available boolean DEFAULT false,
    custom_sizing boolean DEFAULT false,
    personalization_options jsonb DEFAULT '[]'::jsonb,
    tailoring_included boolean DEFAULT false,
    stitching_service_available boolean DEFAULT false,
    stitching_charges numeric(10,2),
    alteration_charges numeric(10,2),
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    size_chart text,
    product_brochure text,
    model_images jsonb DEFAULT '[]'::jsonb,
    draping_video text,
    key_features jsonb DEFAULT '[]'::jsonb,
    fabric_features jsonb DEFAULT '[]'::jsonb,
    special_features jsonb DEFAULT '[]'::jsonb,
    included_items jsonb DEFAULT '[]'::jsonb,
    box_contents jsonb DEFAULT '[]'::jsonb,
    is_on_sale boolean DEFAULT false,
    sale_end_date timestamp with time zone,
    bank_offers jsonb DEFAULT '[]'::jsonb,
    combo_offers jsonb DEFAULT '[]'::jsonb,
    bulk_discount_available boolean DEFAULT false,
    minimum_order_quantity integer DEFAULT 1,
    wholesale_available boolean DEFAULT false,
    wholesale_price numeric(12,2),
    return_policy text,
    return_period_days integer,
    replacement_policy text,
    exchange_available boolean DEFAULT true,
    refund_available boolean DEFAULT true,
    warranty_available boolean DEFAULT false,
    warranty_period text,
    seller_id character varying,
    seller_type text,
    shop_name text,
    boutique_name text,
    designer_name text,
    showroom_name text,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    whatsapp_number text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    delivery_available boolean DEFAULT false,
    delivery_charges numeric(8,2),
    free_delivery boolean DEFAULT false,
    free_delivery_above numeric(10,2),
    same_day_delivery boolean DEFAULT false,
    express_delivery boolean DEFAULT false,
    delivery_areas jsonb DEFAULT '[]'::jsonb,
    shipping_options jsonb DEFAULT '[]'::jsonb,
    cod_available boolean DEFAULT true,
    estimated_delivery_days integer,
    occasion_suitable jsonb DEFAULT '[]'::jsonb,
    season text,
    collection_name text,
    launch_year integer,
    limited_edition boolean DEFAULT false,
    handcrafted boolean DEFAULT false,
    handloom boolean DEFAULT false,
    made_in text,
    origin_state text,
    eco_friendly boolean DEFAULT false,
    sustainable_fashion boolean DEFAULT false,
    traditional_wear boolean DEFAULT false,
    fusion_wear boolean DEFAULT false,
    bridal_wear boolean DEFAULT false,
    party_wear boolean DEFAULT false,
    casual_wear boolean DEFAULT false,
    formal_wear boolean DEFAULT false,
    ethnic_wear boolean DEFAULT false,
    western_wear boolean DEFAULT false,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_sales integer DEFAULT 0,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_verified boolean DEFAULT false,
    availability_status text DEFAULT 'available'::text,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT saree_clothing_shopping_condition_check CHECK ((condition = ANY (ARRAY['new'::text, 'like_new'::text, 'gently_used'::text, 'used'::text, 'refurbished'::text]))),
    CONSTRAINT saree_clothing_shopping_gender_check CHECK ((gender = ANY (ARRAY['men'::text, 'women'::text, 'unisex'::text, 'kids'::text, 'boys'::text, 'girls'::text]))),
    CONSTRAINT saree_clothing_shopping_listing_type_check CHECK ((listing_type = ANY (ARRAY['sale'::text, 'rent'::text, 'exchange'::text]))),
    CONSTRAINT saree_clothing_shopping_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.saree_clothing_shopping OWNER TO postgres;

--
-- Name: schools_colleges_coaching; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schools_colleges_coaching (
    id character varying DEFAULT (gen_random_uuid())::text NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    institution_category text NOT NULL,
    institution_name text NOT NULL,
    institution_type text,
    affiliation text,
    accreditation text,
    establishment_year integer,
    board_affiliation text,
    university_affiliation text,
    courses_offered jsonb DEFAULT '[]'::jsonb,
    exam_preparation_for jsonb DEFAULT '[]'::jsonb,
    annual_tuition_fee numeric(12,2),
    total_fee_per_year numeric(12,2),
    scholarship_available boolean DEFAULT false,
    hostel_facility boolean DEFAULT false,
    transport_facility boolean DEFAULT false,
    library_available boolean DEFAULT false,
    computer_lab boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text,
    images jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.schools_colleges_coaching OWNER TO postgres;

--
-- Name: schools_colleges_coaching_institutes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schools_colleges_coaching_institutes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    institution_category text NOT NULL,
    institution_name text NOT NULL,
    institution_type text,
    affiliation text,
    accreditation text,
    establishment_year integer,
    recognition_details text,
    courses_offered jsonb DEFAULT '[]'::jsonb,
    streams_available jsonb DEFAULT '[]'::jsonb,
    specializations jsonb DEFAULT '[]'::jsonb,
    medium_of_instruction jsonb DEFAULT '[]'::jsonb,
    board_affiliation text,
    university_affiliation text,
    admission_process text,
    admission_criteria text,
    entrance_exam_required boolean DEFAULT false,
    entrance_exam_name text,
    minimum_percentage_required numeric(5,2),
    age_criteria text,
    eligibility_criteria text,
    admission_fee numeric(12,2),
    annual_tuition_fee numeric(12,2),
    course_fee numeric(12,2),
    registration_fee numeric(12,2),
    examination_fee numeric(12,2),
    development_fee numeric(12,2),
    other_fees numeric(12,2),
    total_fee_per_year numeric(12,2),
    fee_payment_mode text,
    scholarship_available boolean DEFAULT false,
    scholarship_details text,
    fee_concession_available boolean DEFAULT false,
    installment_facility boolean DEFAULT false,
    total_area numeric(10,2),
    area_unit text DEFAULT 'acres'::text,
    number_of_classrooms integer,
    classroom_capacity integer,
    laboratory_facilities jsonb DEFAULT '[]'::jsonb,
    library_available boolean DEFAULT false,
    library_books_count integer,
    computer_lab boolean DEFAULT false,
    number_of_computers integer,
    sports_facilities jsonb DEFAULT '[]'::jsonb,
    playground_available boolean DEFAULT false,
    auditorium_available boolean DEFAULT false,
    auditorium_capacity integer,
    cafeteria_available boolean DEFAULT false,
    hostel_facility boolean DEFAULT false,
    hostel_capacity integer,
    transport_facility boolean DEFAULT false,
    medical_facility boolean DEFAULT false,
    wi_fi_available boolean DEFAULT false,
    smart_classrooms boolean DEFAULT false,
    total_faculty integer,
    phd_faculty integer,
    postgraduate_faculty integer,
    experienced_faculty integer,
    student_teacher_ratio text,
    faculty_qualifications text,
    guest_faculty_available boolean DEFAULT false,
    total_students integer,
    current_batch_strength integer,
    batch_size integer,
    student_capacity integer,
    co_education boolean DEFAULT true,
    pass_percentage numeric(5,2),
    board_exam_results text,
    university_exam_results text,
    placement_percentage numeric(5,2),
    average_package numeric(12,2),
    highest_package numeric(12,2),
    top_recruiters jsonb DEFAULT '[]'::jsonb,
    awards_achievements text,
    notable_alumni text,
    coaching_subjects jsonb DEFAULT '[]'::jsonb,
    exam_preparation_for jsonb DEFAULT '[]'::jsonb,
    batch_timings text,
    weekend_batches boolean DEFAULT false,
    online_classes_available boolean DEFAULT false,
    offline_classes_available boolean DEFAULT true,
    hybrid_mode boolean DEFAULT false,
    study_material_provided boolean DEFAULT false,
    mock_tests_provided boolean DEFAULT false,
    doubt_clearing_sessions boolean DEFAULT false,
    personal_mentoring boolean DEFAULT false,
    course_duration text,
    ac_classrooms boolean DEFAULT false,
    cctv_surveillance boolean DEFAULT false,
    security_guard boolean DEFAULT false,
    biometric_attendance boolean DEFAULT false,
    parent_teacher_meetings boolean DEFAULT false,
    extra_curricular_activities jsonb DEFAULT '[]'::jsonb,
    counseling_services boolean DEFAULT false,
    career_guidance boolean DEFAULT false,
    placement_assistance boolean DEFAULT false,
    internship_opportunities boolean DEFAULT false,
    working_hours text,
    working_days text,
    holiday_list text,
    academic_calendar text,
    principal_name text,
    director_name text,
    head_of_institution text,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    whatsapp_number text,
    website_url text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    landmark text,
    pincode text,
    location_id character varying,
    prospectus_url text,
    brochure_url text,
    virtual_tour_url text,
    video_url text,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    certifications jsonb DEFAULT '[]'::jsonb,
    admission_policy text,
    refund_policy text,
    cancellation_policy text,
    terms_and_conditions text,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_enrollments integer DEFAULT 0,
    availability_status text DEFAULT 'accepting_admissions'::text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    is_premium boolean DEFAULT false,
    owner_id character varying,
    view_count integer DEFAULT 0,
    inquiry_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text
);


ALTER TABLE public.schools_colleges_coaching_institutes OWNER TO postgres;

--
-- Name: second_hand_cars_bikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.second_hand_cars_bikes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    vehicle_type text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    variant text,
    year integer NOT NULL,
    price numeric(12,2) NOT NULL,
    kilometers_driven integer,
    fuel_type text,
    transmission text,
    owner_number integer,
    registration_number text,
    registration_state text,
    registration_year integer,
    insurance_type text,
    insurance_valid_until date,
    tax_validity date,
    color text,
    body_type text,
    seating_capacity integer,
    engine_capacity integer,
    mileage_kmpl numeric(5,2),
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    features jsonb DEFAULT '[]'::jsonb,
    condition text,
    accident_history boolean DEFAULT false,
    flood_affected boolean DEFAULT false,
    service_records_available boolean DEFAULT false,
    noc_available boolean DEFAULT false,
    is_negotiable boolean DEFAULT false,
    exchange_accepted boolean DEFAULT false,
    test_drive_available boolean DEFAULT true,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    seller_id character varying,
    seller_type text,
    contact_person text,
    contact_phone text,
    contact_email text,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_verified boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT second_hand_cars_bikes_condition_check CHECK ((condition = ANY (ARRAY['excellent'::text, 'good'::text, 'fair'::text, 'needs_work'::text]))),
    CONSTRAINT second_hand_cars_bikes_fuel_type_check CHECK ((fuel_type = ANY (ARRAY['petrol'::text, 'diesel'::text, 'electric'::text, 'hybrid'::text, 'cng'::text, 'lpg'::text]))),
    CONSTRAINT second_hand_cars_bikes_insurance_type_check CHECK ((insurance_type = ANY (ARRAY['comprehensive'::text, 'third_party'::text, 'expired'::text, 'zero_dep'::text]))),
    CONSTRAINT second_hand_cars_bikes_kilometers_driven_check CHECK ((kilometers_driven >= 0)),
    CONSTRAINT second_hand_cars_bikes_listing_type_check CHECK ((listing_type = ANY (ARRAY['buy'::text, 'sell'::text]))),
    CONSTRAINT second_hand_cars_bikes_owner_number_check CHECK (((owner_number >= 1) AND (owner_number <= 10))),
    CONSTRAINT second_hand_cars_bikes_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT second_hand_cars_bikes_seller_type_check CHECK ((seller_type = ANY (ARRAY['individual'::text, 'dealer'::text, 'showroom'::text]))),
    CONSTRAINT second_hand_cars_bikes_transmission_check CHECK ((transmission = ANY (ARRAY['manual'::text, 'automatic'::text, 'semi-automatic'::text]))),
    CONSTRAINT second_hand_cars_bikes_vehicle_type_check CHECK ((vehicle_type = ANY (ARRAY['car'::text, 'bike'::text, 'scooter'::text, 'commercial'::text]))),
    CONSTRAINT second_hand_cars_bikes_year_check CHECK (((year >= 1900) AND ((year)::numeric <= (EXTRACT(year FROM CURRENT_DATE) + (1)::numeric))))
);


ALTER TABLE public.second_hand_cars_bikes OWNER TO postgres;

--
-- Name: second_hand_phones_tablets_accessories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.second_hand_phones_tablets_accessories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    category text NOT NULL,
    subcategory text,
    product_type text,
    brand text NOT NULL,
    model text NOT NULL,
    variant text,
    color text,
    storage_capacity text,
    ram text,
    processor text,
    screen_size text,
    battery_capacity text,
    camera_specs text,
    operating_system text,
    connectivity jsonb DEFAULT '[]'::jsonb,
    display_type text,
    refresh_rate text,
    condition text NOT NULL,
    usage_duration text,
    purchase_date text,
    purchase_year integer,
    age_in_months integer,
    price numeric(12,2) NOT NULL,
    original_price numeric(12,2),
    negotiable boolean DEFAULT false,
    rental_price_per_day numeric(10,2),
    rental_price_per_month numeric(10,2),
    exchange_accepted boolean DEFAULT false,
    exchange_preferences text,
    exchange_value_up_to numeric(10,2),
    warranty_available boolean DEFAULT false,
    warranty_period text,
    warranty_type text,
    warranty_valid_until text,
    bill_available boolean DEFAULT false,
    box_available boolean DEFAULT false,
    original_accessories boolean DEFAULT false,
    accessories_included jsonb DEFAULT '[]'::jsonb,
    charger_included boolean DEFAULT true,
    screen_condition text,
    body_condition text,
    scratches_present boolean DEFAULT false,
    screen_guard boolean DEFAULT false,
    back_cover boolean DEFAULT false,
    functional_issues jsonb DEFAULT '[]'::jsonb,
    repairs_done text,
    battery_health text,
    water_damage boolean DEFAULT false,
    imei_number text,
    serial_number text,
    fingerprint_sensor boolean DEFAULT false,
    face_unlock boolean DEFAULT false,
    dual_sim boolean DEFAULT false,
    expandable_memory boolean DEFAULT false,
    key_features jsonb DEFAULT '[]'::jsonb,
    specifications jsonb DEFAULT '{}'::jsonb,
    compatible_devices jsonb DEFAULT '[]'::jsonb,
    accessory_type text,
    material text,
    accessory_condition text,
    reason_for_selling text,
    purchased_from text,
    upgrade_purchase boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    videos jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    seller_id character varying,
    seller_type text,
    shop_name text,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_available boolean DEFAULT false,
    whatsapp_number text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    location_id character varying,
    delivery_available boolean DEFAULT false,
    delivery_charges numeric(8,2),
    pickup_available boolean DEFAULT true,
    shipping_options jsonb DEFAULT '[]'::jsonb,
    cod_available boolean DEFAULT false,
    testing_allowed boolean DEFAULT true,
    testing_location text,
    return_policy text,
    return_period_days integer,
    refund_available boolean DEFAULT false,
    urgent_sale boolean DEFAULT false,
    price_drop boolean DEFAULT false,
    previous_owners integer DEFAULT 1,
    additional_info text,
    seller_rating numeric(3,2),
    seller_review_count integer DEFAULT 0,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    is_urgent boolean DEFAULT false,
    view_count integer DEFAULT 0,
    inquiry_count integer DEFAULT 0,
    favorite_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    sold_at timestamp without time zone,
    user_id character varying,
    role text,
    CONSTRAINT second_hand_phones_tablets_accessorie_availability_status_check CHECK ((availability_status = ANY (ARRAY['available'::text, 'sold'::text, 'reserved'::text, 'exchange_in_progress'::text]))),
    CONSTRAINT second_hand_phones_tablets_accessories_category_check CHECK ((category = ANY (ARRAY['phone'::text, 'tablet'::text, 'accessory'::text]))),
    CONSTRAINT second_hand_phones_tablets_accessories_condition_check CHECK ((condition = ANY (ARRAY['like_new'::text, 'excellent'::text, 'good'::text, 'fair'::text, 'poor'::text]))),
    CONSTRAINT second_hand_phones_tablets_accessories_listing_type_check CHECK ((listing_type = ANY (ARRAY['sell'::text, 'rent'::text, 'exchange'::text]))),
    CONSTRAINT second_hand_phones_tablets_accessories_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT second_hand_phones_tablets_accessories_seller_type_check CHECK ((seller_type = ANY (ARRAY['individual'::text, 'dealer'::text, 'shop'::text])))
);


ALTER TABLE public.second_hand_phones_tablets_accessories OWNER TO postgres;

--
-- Name: service_centre_warranty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_centre_warranty (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    service_type text NOT NULL,
    centre_name text NOT NULL,
    centre_type text,
    authorized_brands jsonb DEFAULT '[]'::jsonb,
    services_offered jsonb DEFAULT '[]'::jsonb,
    product_categories jsonb DEFAULT '[]'::jsonb,
    warranty_repair boolean DEFAULT true,
    out_of_warranty_repair boolean DEFAULT true,
    free_inspection boolean DEFAULT true,
    home_service boolean DEFAULT false,
    pickup_drop_service boolean DEFAULT false,
    same_day_service boolean DEFAULT false,
    emergency_service boolean DEFAULT false,
    genuine_parts_used boolean DEFAULT true,
    certified_technicians boolean DEFAULT true,
    warranty_period text,
    inspection_charge numeric(10,2),
    minimum_service_charge numeric(10,2),
    home_service_charge numeric(10,2),
    pickup_drop_charge numeric(10,2),
    estimated_turnaround_time text,
    spares_available boolean DEFAULT true,
    installation_service boolean DEFAULT true,
    annual_maintenance_contract boolean DEFAULT false,
    amc_price numeric(10,2),
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_number text,
    website_url text,
    working_hours text,
    working_days text,
    available_24_7 boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text,
    images jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.service_centre_warranty OWNER TO postgres;

--
-- Name: showrooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.showrooms (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    showroom_name text NOT NULL,
    authorized_brand text,
    vehicle_type text NOT NULL,
    vehicle_details jsonb DEFAULT '{}'::jsonb,
    year integer,
    price numeric(12,2) NOT NULL,
    price_type text DEFAULT 'fixed'::text,
    mileage integer,
    fuel_type text,
    transmission text,
    color text,
    registration_number text,
    registration_year integer,
    owner_count integer,
    warranty_available boolean DEFAULT false,
    warranty_details text,
    service_history boolean DEFAULT false,
    certification_details text,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    features jsonb DEFAULT '[]'::jsonb,
    is_certified boolean DEFAULT true,
    inspection_report text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    showroom_contact text,
    showroom_email text,
    location_id character varying,
    seller_id character varying,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT showrooms_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT showrooms_price_type_check CHECK ((price_type = ANY (ARRAY['fixed'::text, 'negotiable'::text]))),
    CONSTRAINT showrooms_vehicle_type_check CHECK ((vehicle_type = ANY (ARRAY['car'::text, 'bike'::text, 'both'::text])))
);


ALTER TABLE public.showrooms OWNER TO postgres;

--
-- Name: skill_training_certification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill_training_certification (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    training_category text,
    skill_name text,
    certification_type text,
    training_provider text,
    course_duration text,
    course_fee numeric(12,2),
    certification_fee numeric(10,2),
    training_mode text,
    placement_assistance boolean DEFAULT false,
    job_oriented boolean DEFAULT false,
    hands_on_training boolean DEFAULT false,
    industry_recognized boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    images jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    skill_category text,
    training_type text,
    skills_taught text,
    institute_name text,
    certification_body text,
    certification_name text,
    government_recognized text,
    internationally_recognized text,
    course_duration_days integer,
    course_duration_months integer,
    total_class_hours integer,
    online_mode boolean DEFAULT false,
    offline_mode boolean DEFAULT false,
    weekend_batches boolean DEFAULT false,
    practical_training boolean DEFAULT false,
    study_material_provided boolean DEFAULT false,
    internship_included boolean DEFAULT false,
    total_fee numeric(10,2) NOT NULL,
    registration_fee numeric(10,2),
    exam_fee numeric(10,2),
    installment_available boolean DEFAULT false,
    scholarship_available boolean DEFAULT false,
    placement_rate numeric(5,2),
    career_opportunities jsonb DEFAULT '[]'::jsonb,
    average_salary_package numeric(12,2),
    view_count integer DEFAULT 0
);


ALTER TABLE public.skill_training_certification OWNER TO postgres;

--
-- Name: slider_card; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.slider_card (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    image_url text NOT NULL,
    status character varying(32) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.slider_card OWNER TO postgres;

--
-- Name: slider_card_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.slider_card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.slider_card_id_seq OWNER TO postgres;

--
-- Name: slider_card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.slider_card_id_seq OWNED BY public.slider_card.id;


--
-- Name: sliders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sliders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    link_url text,
    button_text text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    page_type character varying,
    category_id character varying
);


ALTER TABLE public.sliders OWNER TO postgres;

--
-- Name: telecommunication_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telecommunication_services (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    service_type text NOT NULL,
    company_name text NOT NULL,
    provider_type text,
    service_category text,
    plan_name text,
    monthly_price numeric(10,2),
    yearly_price numeric(10,2),
    installation_charges numeric(10,2),
    security_deposit numeric(10,2),
    broadband_speed text,
    data_limit text,
    unlimited_data boolean DEFAULT false,
    fiber_optic boolean DEFAULT false,
    dth_channels integer,
    hd_channels integer,
    ott_apps_included jsonb DEFAULT '[]'::jsonb,
    mobile_network text,
    calls_unlimited boolean DEFAULT false,
    sms_unlimited boolean DEFAULT false,
    roaming_available boolean DEFAULT false,
    validity text,
    contract_period text,
    free_installation boolean DEFAULT false,
    router_provided boolean DEFAULT false,
    static_ip boolean DEFAULT false,
    customer_support_24_7 boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_number text,
    website_url text,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    service_areas jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id character varying,
    role text,
    images jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.telecommunication_services OWNER TO postgres;

--
-- Name: transportation_moving_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transportation_moving_services (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    service_type text NOT NULL,
    company_name text NOT NULL,
    vehicle_type text,
    vehicle_capacity text,
    price_type text DEFAULT 'per_trip'::text,
    base_price numeric(10,2) NOT NULL,
    price_per_km numeric(8,2),
    price_per_hour numeric(8,2),
    minimum_charge numeric(10,2),
    available_vehicles jsonb DEFAULT '[]'::jsonb,
    crew_size integer,
    insurance_included boolean DEFAULT false,
    insurance_coverage text,
    packing_service_available boolean DEFAULT false,
    packing_charges numeric(10,2),
    loading_unloading_included boolean DEFAULT true,
    storage_available boolean DEFAULT false,
    storage_price_per_day numeric(8,2),
    service_areas jsonb DEFAULT '[]'::jsonb,
    operating_hours text,
    advance_booking_required boolean DEFAULT true,
    minimum_booking_hours integer,
    same_day_service boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    service_radius_km integer,
    contact_person text,
    contact_phone text NOT NULL,
    contact_email text,
    whatsapp_number text,
    services_offered jsonb DEFAULT '[]'::jsonb,
    special_items_handled jsonb DEFAULT '[]'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    terms_and_conditions text,
    cancellation_policy text,
    payment_methods jsonb DEFAULT '[]'::jsonb,
    advance_payment_percentage integer,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    completed_jobs integer DEFAULT 0,
    view_count integer DEFAULT 0,
    location_id character varying,
    owner_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    number_of_vehicles integer,
    vehicle_details text,
    available_routes jsonb,
    packing_material_included boolean DEFAULT false,
    insurance_available boolean DEFAULT false,
    insurance_coverage_amount numeric(10,2),
    available_24_7 boolean DEFAULT false,
    working_hours text,
    owner_name character varying(255),
    license_number character varying(255),
    registration_number character varying(255),
    experience_years integer,
    alternate_phone character varying(20),
    operating_cities text,
    payment_terms text,
    refund_policy text,
    gps_tracking boolean DEFAULT false,
    helpers_available boolean DEFAULT false,
    number_of_helpers integer DEFAULT 0,
    helper_charges numeric(10,2) DEFAULT 0,
    total_bookings integer DEFAULT 0,
    availability_status character varying(50) DEFAULT 'available'::character varying,
    user_id character varying,
    role text,
    CONSTRAINT transportation_moving_services_price_type_check CHECK ((price_type = ANY (ARRAY['per_trip'::text, 'per_hour'::text, 'per_km'::text, 'flat_rate'::text, 'custom'::text]))),
    CONSTRAINT transportation_moving_services_service_type_check CHECK ((service_type = ANY (ARRAY['local_moving'::text, 'interstate_moving'::text, 'international_moving'::text, 'vehicle_transport'::text, 'office_relocation'::text, 'storage'::text, 'packing'::text, 'specialized_moving'::text])))
);


ALTER TABLE public.transportation_moving_services OWNER TO postgres;

--
-- Name: tuition_private_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tuition_private_classes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    listing_type text NOT NULL,
    subject_category text NOT NULL,
    subjects_offered jsonb DEFAULT '[]'::jsonb,
    tutor_name text NOT NULL,
    tutor_qualification text,
    tutor_experience_years integer,
    teaching_mode text NOT NULL,
    class_type text NOT NULL,
    grade_level text,
    min_grade integer,
    max_grade integer,
    board text,
    fee_per_hour numeric(10,2),
    fee_per_month numeric(10,2),
    fee_per_subject numeric(10,2),
    demo_class_available boolean DEFAULT false,
    study_material_provided boolean DEFAULT false,
    test_series_included boolean DEFAULT false,
    doubt_clearing_sessions boolean DEFAULT false,
    batch_size integer,
    individual_attention boolean DEFAULT false,
    flexible_timings boolean DEFAULT false,
    weekend_classes boolean DEFAULT false,
    home_tuition_available boolean DEFAULT false,
    online_classes_available boolean DEFAULT false,
    offline_classes_available boolean DEFAULT false,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    whatsapp_available boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text,
    images jsonb DEFAULT '[]'::jsonb,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    image_urls text[]
);


ALTER TABLE public.tuition_private_classes OWNER TO postgres;

--
-- Name: user_category_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_category_preferences (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    category_slug text NOT NULL,
    subcategory_slugs jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_category_preferences OWNER TO postgres;

--
-- Name: user_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_documents (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    document_name text NOT NULL,
    document_url text NOT NULL,
    document_type text,
    file_size integer,
    uploaded_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_documents OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    role text DEFAULT 'user'::text,
    account_type text,
    is_active boolean DEFAULT true,
    avatar text,
    country text,
    state text,
    city text,
    area text,
    address text,
    postal_code text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    selected_services jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vehicle_license_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_license_classes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    license_class text NOT NULL,
    vehicle_type text NOT NULL,
    license_type text NOT NULL,
    training_provider_name text NOT NULL,
    is_rto_approved boolean DEFAULT false,
    rto_approval_number text,
    instructor_name text,
    instructor_experience_years integer,
    instructor_license_number text,
    course_duration_days integer NOT NULL,
    course_duration_hours integer,
    training_mode text,
    course_includes jsonb DEFAULT '[]'::jsonb,
    syllabus_covered jsonb DEFAULT '[]'::jsonb,
    course_fee numeric(10,2) NOT NULL,
    registration_fee numeric(10,2),
    test_fee numeric(10,2),
    total_fee numeric(10,2),
    installment_available boolean DEFAULT false,
    discount_available boolean DEFAULT false,
    discount_percentage numeric(5,2),
    minimum_age integer DEFAULT 18,
    educational_qualification text,
    medical_certificate_required boolean DEFAULT true,
    documents_required jsonb DEFAULT '[]'::jsonb,
    practical_training_hours integer,
    theory_classes_hours integer,
    simulation_training boolean DEFAULT false,
    driving_track_available boolean DEFAULT false,
    pickup_drop_facility boolean DEFAULT false,
    study_material_provided boolean DEFAULT false,
    online_test_practice boolean DEFAULT false,
    rto_test_assistance boolean DEFAULT true,
    training_vehicles jsonb DEFAULT '[]'::jsonb,
    vehicle_condition text,
    dual_control_vehicles boolean DEFAULT true,
    batch_size integer,
    current_batch_seats integer,
    next_batch_start_date date,
    class_timings text,
    weekend_batches boolean DEFAULT false,
    success_rate_percentage numeric(5,2),
    total_students_trained integer DEFAULT 0,
    certification_provided boolean DEFAULT true,
    government_certified boolean DEFAULT false,
    country text DEFAULT 'India'::text NOT NULL,
    state_province text,
    city text,
    area_name text,
    full_address text NOT NULL,
    training_center_address text,
    multiple_locations boolean DEFAULT false,
    location_id character varying,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    contact_email text,
    alternate_phone text,
    whatsapp_number text,
    website_url text,
    images jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    video_url text,
    virtual_tour_url text,
    job_placement_assistance boolean DEFAULT false,
    refresher_course_available boolean DEFAULT false,
    international_license_training boolean DEFAULT false,
    female_instructor_available boolean DEFAULT false,
    language_options jsonb DEFAULT '[]'::jsonb,
    terms_and_conditions text,
    cancellation_policy text,
    refund_policy text,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    total_enrollments integer DEFAULT 0,
    availability_status text DEFAULT 'available'::text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    owner_id character varying,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id character varying,
    role text,
    CONSTRAINT vehicle_license_classes_availability_status_check CHECK ((availability_status = ANY (ARRAY['available'::text, 'full'::text, 'unavailable'::text]))),
    CONSTRAINT vehicle_license_classes_batch_size_check CHECK ((batch_size > 0)),
    CONSTRAINT vehicle_license_classes_course_duration_days_check CHECK ((course_duration_days > 0)),
    CONSTRAINT vehicle_license_classes_course_duration_hours_check CHECK ((course_duration_hours > 0)),
    CONSTRAINT vehicle_license_classes_course_fee_check CHECK ((course_fee >= (0)::numeric)),
    CONSTRAINT vehicle_license_classes_current_batch_seats_check CHECK ((current_batch_seats >= 0)),
    CONSTRAINT vehicle_license_classes_discount_percentage_check CHECK (((discount_percentage >= (0)::numeric) AND (discount_percentage <= (100)::numeric))),
    CONSTRAINT vehicle_license_classes_instructor_experience_years_check CHECK ((instructor_experience_years >= 0)),
    CONSTRAINT vehicle_license_classes_license_class_check CHECK ((license_class = ANY (ARRAY['two_wheeler'::text, 'light_motor_vehicle'::text, 'heavy_motor_vehicle'::text, 'transport_vehicle'::text, 'commercial_vehicle'::text, 'hazardous_goods'::text, 'passenger_vehicle'::text, 'motorcycle'::text, 'scooter'::text, 'car'::text, 'truck'::text, 'bus'::text]))),
    CONSTRAINT vehicle_license_classes_license_type_check CHECK ((license_type = ANY (ARRAY['learner'::text, 'permanent'::text, 'commercial'::text, 'international'::text]))),
    CONSTRAINT vehicle_license_classes_minimum_age_check CHECK ((minimum_age >= 16)),
    CONSTRAINT vehicle_license_classes_practical_training_hours_check CHECK ((practical_training_hours >= 0)),
    CONSTRAINT vehicle_license_classes_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric))),
    CONSTRAINT vehicle_license_classes_registration_fee_check CHECK ((registration_fee >= (0)::numeric)),
    CONSTRAINT vehicle_license_classes_success_rate_percentage_check CHECK (((success_rate_percentage >= (0)::numeric) AND (success_rate_percentage <= (100)::numeric))),
    CONSTRAINT vehicle_license_classes_test_fee_check CHECK ((test_fee >= (0)::numeric)),
    CONSTRAINT vehicle_license_classes_theory_classes_hours_check CHECK ((theory_classes_hours >= 0)),
    CONSTRAINT vehicle_license_classes_total_fee_check CHECK ((total_fee >= (0)::numeric)),
    CONSTRAINT vehicle_license_classes_training_mode_check CHECK ((training_mode = ANY (ARRAY['offline'::text, 'online'::text, 'hybrid'::text]))),
    CONSTRAINT vehicle_license_classes_vehicle_condition_check CHECK ((vehicle_condition = ANY (ARRAY['excellent'::text, 'good'::text, 'fair'::text]))),
    CONSTRAINT vehicle_license_classes_vehicle_type_check CHECK ((vehicle_type = ANY (ARRAY['bike'::text, 'scooter'::text, 'car'::text, 'suv'::text, 'truck'::text, 'bus'::text, 'trailer'::text, 'tanker'::text])))
);


ALTER TABLE public.vehicle_license_classes OWNER TO postgres;

--
-- Name: videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.videos (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    video_url text NOT NULL,
    thumbnail_url text,
    duration_minutes integer,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id character varying
);


ALTER TABLE public.videos OWNER TO postgres;

--
-- Name: slider_card id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slider_card ALTER COLUMN id SET DEFAULT nextval('public.slider_card_id_seq'::regclass);


--
-- Data for Name: academies_music_arts_sports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academies_music_arts_sports (id, title, description, academy_category, specialization, established_year, courses_offered, class_type, age_group, course_duration_months, fee_per_month, admission_fee, instrument_rental_fee, certification_offered, free_trial_class, facilities, air_conditioned, parking_available, changing_rooms, equipment_provided, head_instructor, total_instructors, instructor_qualification, awards_achievements, contact_person, contact_phone, contact_email, website, country, state_province, city, area_name, full_address, is_active, is_featured, view_count, created_at, updated_at, user_id, role, images) FROM stdin;
\.


--
-- Data for Name: admin_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_categories (id, name, slug, description, icon, color, is_active, sort_order, created_at, updated_at) FROM stdin;
9ff1f62b-39dd-4810-b59d-e291f0f90df8	Vehicles & Transportation	Vehicles & Transportation	Vehicles & Transportation		#1e40af	t	0	2025-10-05 00:05:39.176621	2025-10-05 00:05:39.176621
3ccf1cb9-3f45-4830-956b-b903eef65dd2	Real Estate & Property	Real Estate & Property	. Real Estate & Property		#1e40af	t	0	2025-10-04 23:57:17.387578	2025-10-05 17:55:56.470322
8512127c-1c3f-4e53-9509-7c926a45aaf7	Electronics & Technology	Electronics & Technology	Electronics & Technology		#1e40af	t	0	2025-10-08 00:45:59.594947	2025-10-08 00:45:59.594947
c7d8cfb8-26e0-4ec0-9fb4-3ac1925401ec	Furniture & Home Decor	Furniture & Home Decor	Furniture & Home Decor		#1e40af	t	0	2025-10-09 22:12:30.852381	2025-10-09 22:12:30.852381
a1fb3aa7-b88b-43cf-9d53-c68553a2d923	Fashion & Lifestyle	Fashion & Lifestyle	Fashion & Lifestyle		#1e40af	t	0	2025-10-10 21:47:59.398652	2025-10-10 21:47:59.398652
bb83c044-6de4-460d-847c-5ddaab5ee230	Education & Learning	Education & Learning			#1e40af	t	0	2025-10-28 17:02:42.405908	2025-10-30 16:29:52.220521
\.


--
-- Data for Name: admin_subcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_subcategories (id, name, slug, description, icon, color, parent_category_id, is_active, sort_order, created_at, updated_at) FROM stdin;
2f54d8d3-3d6a-4132-9e96-5eb809cfe6b8	Household Services	Household Services	Household Services (Plumbing, Cleaning, etc.)			c7d8cfb8-26e0-4ec0-9fb4-3ac1925401ec	t	0	2025-10-09 22:17:10.745766	2025-10-10 14:16:48.542815
64b788ad-98fc-47a9-964a-4fe0525a2ddb	Fashion & Beauty Products	Fashion & Beauty Products	Fashion & Beauty Products			a1fb3aa7-b88b-43cf-9d53-c68553a2d923	t	0	2025-10-10 21:48:24.571072	2025-10-10 21:48:24.571072
2abc08b3-4c60-446e-b79a-81195ec758af	Construction & Building Materials	Construction & Building Materials	Construction & Building Materials			3ccf1cb9-3f45-4830-956b-b903eef65dd2	t	0	2025-10-04 23:59:50.838387	2025-10-04 23:59:50.838387
dace0be2-c1d7-4a6e-9673-57021b7f7de8	Cars & Bikes	Cars & Bikes	Cars & Bikes			9ff1f62b-39dd-4810-b59d-e291f0f90df8	t	0	2025-10-05 00:06:09.488969	2025-10-05 00:06:09.488969
7bf9def7-10ab-4350-8525-6f6942322607	Local Market/Commercial Property	Local Market Commercial Property	Local Market/Commercial Property			3ccf1cb9-3f45-4830-956b-b903eef65dd2	t	0	2025-10-05 00:00:20.803418	2025-10-05 01:06:07.511366
2ebd9a8c-57d2-4482-854a-95b2054c0124	Factory/Industrial Land	Factory Industrial Land	Factory/Industrial Land			3ccf1cb9-3f45-4830-956b-b903eef65dd2	t	0	2025-10-05 00:01:37.033084	2025-10-05 01:07:39.47984
2f1259f5-bb61-47b5-9763-80fb3fd5e164	Company/Office Space	Company Office Space	Company/Office Space			3ccf1cb9-3f45-4830-956b-b903eef65dd2	t	0	2025-10-05 00:03:23.597482	2025-10-05 01:07:45.852565
cc508255-2edf-4ee4-86cf-6c5099dd7353	Rental – Rooms, Flats, Apartments	Rental – Rooms, Flats, Apartments	Rental – Rooms, Flats, Apartments			3ccf1cb9-3f45-4830-956b-b903eef65dd2	t	0	2025-10-04 23:58:23.172229	2025-10-05 17:55:18.440255
18d9d05d-b24c-4c3f-9834-4838cb773fb8	Jewelry & Accessories	Jewelry & Accessories	Jewelry & Accessories			a1fb3aa7-b88b-43cf-9d53-c68553a2d923	t	0	2025-10-10 21:49:16.215218	2025-10-10 21:49:16.215218
f65fd475-0a78-4cb6-8ad0-d699f4d7c444	Hostels & PG	Hostels & PG	Hostels & PG			3ccf1cb9-3f45-4830-956b-b903eef65dd2	t	0	2025-10-04 23:59:18.497205	2025-10-06 16:03:16.209971
fc04566e-d3d9-474b-b6bf-bcad94ae9c33	Heavy Equipment for Sale	Heavy Equipment for Sale	Heavy Equipment for Sale			9ff1f62b-39dd-4810-b59d-e291f0f90df8	t	0	2025-10-07 15:42:24.821271	2025-10-07 15:42:24.821271
cb644039-6491-433a-975e-26fb96185df1	Showrooms (Authorized/Second-hand)	Showrooms (Authorized-Second-hand)	Showrooms (Authorized-Second-hand)			9ff1f62b-39dd-4810-b59d-e291f0f90df8	t	0	2025-10-07 15:43:02.212717	2025-10-07 15:43:02.212717
b5b164e6-d98f-40ab-b5d9-6e360be41b02	Second-Hand Cars & Bikes	Second-Hand Cars & Bikes	Second-Hand Cars & Bikes			9ff1f62b-39dd-4810-b59d-e291f0f90df8	t	0	2025-10-07 15:43:38.863147	2025-10-07 15:43:38.863147
5c86f7e7-0fff-495c-a74e-153476b5e87d	Car & Bike Rentals	Car & Bike Rentals	Car & Bike Rentals			9ff1f62b-39dd-4810-b59d-e291f0f90df8	t	0	2025-10-07 15:44:08.282337	2025-10-07 15:44:08.282337
51cd9f5a-ed58-45d0-87c3-027d5e6d5e66	Vehicle License Classes	Vehicle License Classes				9ff1f62b-39dd-4810-b59d-e291f0f90df8	t	0	2025-10-07 15:44:58.239079	2025-10-07 15:44:58.239079
7c2b7595-2cfa-4949-b0e8-72731716c26d	Electronics & Gadgets	Electronics & Gadgets	Electronics & Gadgets			8512127c-1c3f-4e53-9509-7c926a45aaf7	t	0	2025-10-08 00:46:26.327276	2025-10-08 00:46:26.327276
1368d041-729d-4867-b077-5c429bf52c0c	New Phones & Tablets & Accessories	New Phones & Tablets & Accessories	New Phones & Tablets & Accessories			8512127c-1c3f-4e53-9509-7c926a45aaf7	t	0	2025-10-08 00:46:48.078692	2025-10-08 00:46:48.078692
335b8036-aaa2-44e1-b704-a3c0a173eeef	Second-Hand Phones & Tablets & Accessories	Second-Hand Phones & Tablets & Accessories				8512127c-1c3f-4e53-9509-7c926a45aaf7	t	0	2025-10-08 00:47:06.204645	2025-10-08 00:47:06.204645
3c56fef8-a733-4755-8540-05ce67a2c495	Computer, Mobile & Laptop Repair Services	Computer, Mobile & Laptop Repair Services	Computer, Mobile & Laptop Repair Services			8512127c-1c3f-4e53-9509-7c926a45aaf7	t	0	2025-10-08 00:47:26.39297	2025-10-08 00:47:26.39297
1088a84d-e65e-4731-9505-3dbed834671a	Cyber Café / Internet Services	Cyber Café / Internet Services	Cyber Café / Internet Services			8512127c-1c3f-4e53-9509-7c926a45aaf7	t	0	2025-10-08 00:47:46.541301	2025-10-08 00:47:46.541301
8575669c-4b48-4fa5-b693-670726e7bea2	Telecommunication Services	Telecommunication Services	Telecommunication Services			8512127c-1c3f-4e53-9509-7c926a45aaf7	t	0	2025-10-08 00:48:07.096821	2025-10-08 00:48:07.096821
33468c8f-4bb3-4d17-b384-6767a3f0a71e	Service Centre / Warranty	Service Centre / Warranty	Service Centre / Warranty			8512127c-1c3f-4e53-9509-7c926a45aaf7	t	0	2025-10-08 00:48:27.047052	2025-10-08 00:48:27.047052
5abee3b0-797a-4adc-b7fe-cf6eef269305	Furniture & Interior Decor	Furniture & Interior Decor	Furniture & Interior Decor			c7d8cfb8-26e0-4ec0-9fb4-3ac1925401ec	t	0	2025-10-09 22:16:34.915109	2025-10-09 22:16:34.915109
6cf9b5e1-72cb-4175-8b49-ccf928af1dbb	Event & Decoration Services (Marriage Halls, Parties, Café Setup, Decoration Materials)	Event & Decoration Services (Marriage Halls, Parties, Café Setup, Decoration Materials)				c7d8cfb8-26e0-4ec0-9fb4-3ac1925401ec	t	0	2025-10-09 22:17:47.500544	2025-10-09 22:17:47.500544
397bf211-4a24-45eb-b95d-313891af5bff	Health & Wellness Services	Health & Wellness Services	Health & Wellness Services			a1fb3aa7-b88b-43cf-9d53-c68553a2d923	t	0	2025-10-10 21:49:34.373025	2025-10-10 21:49:34.373025
44d9f2cc-089e-4058-9620-d94a573e5158	Pharmacy & Medical Stores	Pharmacy & Medical Stores	Pharmacy & Medical Stores			a1fb3aa7-b88b-43cf-9d53-c68553a2d923	t	0	2025-10-10 21:49:54.931395	2025-10-10 21:49:54.931395
c02a97a8-aeb1-48a3-ba8b-13d8905d645a	Saree Shopping Clothing	Saree Shopping Clothing	Saree Shopping Clothing			a1fb3aa7-b88b-43cf-9d53-c68553a2d923	t	0	2025-10-10 21:48:51.280372	2025-10-11 18:03:07.390045
1cb720c6-286a-475b-a3d8-da34f9983855	Tuition & Private Classes	TuitionPrivatClasses				bb83c044-6de4-460d-847c-5ddaab5ee230	t	0	2025-10-28 17:07:51.65758	2025-10-28 17:07:51.65758
77f4f13a-698b-4b30-b003-e868186e4506	Dance, Karate, Gym, Yoga Classes	DanceKarateGymYoga Classes	Dance, Karate, Gym, Yoga Classes			bb83c044-6de4-460d-847c-5ddaab5ee230	t	0	2025-10-28 17:09:16.796816	2025-10-28 17:09:16.796816
0344594c-7120-4a58-8ace-4bef52e3a289	Language Classes	LanguageClasses	Language Classes			bb83c044-6de4-460d-847c-5ddaab5ee230	t	0	2025-10-28 17:09:48.703851	2025-10-28 17:09:48.703851
412e725f-52a2-4cdf-8c67-b9eff9236d46	Academies (Music, Arts, Sports)	Academies-Music-Arts-Sports	Academies (Music, Arts, Sports)			bb83c044-6de4-460d-847c-5ddaab5ee230	t	0	2025-10-30 16:02:42.385824	2025-10-30 16:02:42.385824
baf04970-33b2-4717-ae2b-864b8830f089	Skill Training & Certification	Skill-Training -Certification	Skill Training & Certification			bb83c044-6de4-460d-847c-5ddaab5ee230	t	0	2025-10-30 16:03:19.664496	2025-10-30 16:03:19.664496
fb5246da-dabc-40dd-8f2a-9940c1e45f5f	Schools, Colleges, Coaching Institutes	Schools, Colleges, Coaching Institutes	Schools, Colleges, Coaching Institutes			bb83c044-6de4-460d-847c-5ddaab5ee230	t	0	2025-10-28 17:05:31.303408	2025-10-30 17:51:21.296185
4492220d-cd80-4b11-a08d-01a0071a9789	Transportation-Moving Services	Transportation Moving Services				9ff1f62b-39dd-4810-b59d-e291f0f90df8	t	0	2025-10-07 15:44:36.690385	2025-10-31 11:14:56.732683
467747d6-b8b9-42b0-8273-1e5be971cdbd	Property Deals	Property Deals	Property Deals			3ccf1cb9-3f45-4830-956b-b903eef65dd2	t	0	2025-10-04 23:57:50.176898	2025-10-31 11:40:05.017219
1a0584a9-ecd3-4d41-8a51-e39afb99c1a7	Cricket & Sports Training	Cricket-Sports Training	Cricket & Sports Training			bb83c044-6de4-460d-847c-5ddaab5ee230	t	0	2025-10-30 16:04:42.425894	2025-10-30 16:04:42.425894
39d2a9d0-7b03-4bac-9fc6-c56fc82e96e0	E-Books & Online Courses	E-Books & Online Courses	E-Books & Online Courses			bb83c044-6de4-460d-847c-5ddaab5ee230	t	0	2025-10-28 17:03:21.527052	2025-10-30 16:30:22.870462
6c1503d7-5390-4570-9ce8-9c8f2efd0002	Educational Consultancy (Study Abroad/Admissions)	educational-consultancy-study-abroad	educational-consultancy-study-abroad			bb83c044-6de4-460d-847c-5ddaab5ee230	t	0	2025-10-30 16:04:11.755033	2025-10-30 17:12:48.336227
\.


--
-- Data for Name: article_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.article_categories (id, name, slug, description, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.articles (id, title, slug, excerpt, content, type, author_id, author_name, category_id, category_name, pages, downloads, likes, thumbnail_url, is_premium, is_published, is_featured, view_count, seo_title, seo_description, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_posts (id, title, slug, excerpt, content, author_id, author_name, category, tags, cover_image_url, published_at, is_published, is_featured, view_count, seo_title, seo_description, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: car_bike_rentals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.car_bike_rentals (id, title, description, rental_type, brand, model, year, rental_price_per_day, rental_price_per_hour, rental_price_per_week, rental_price_per_month, security_deposit, fuel_type, transmission, seating_capacity, mileage_limit_per_day, extra_km_charge, color, registration_number, insurance_included, fuel_policy, images, documents, features, condition, minimum_rental_duration, minimum_rental_duration_unit, maximum_rental_duration, driver_available, driver_charges_per_day, age_requirement, license_required, pickup_delivery_available, pickup_delivery_charges, country, state_province, city, area_name, full_address, pickup_location, location_id, owner_id, rental_company_name, rental_company_contact, rental_company_email, terms_and_conditions, cancellation_policy, availability_status, is_active, is_featured, is_verified, view_count, booking_count, rating, review_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: cars_bikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cars_bikes (id, title, description, listing_type, vehicle_type, brand, model, year, price, kilometers_driven, fuel_type, transmission, owner_number, registration_number, registration_state, insurance_valid_until, color, images, documents, features, condition, is_negotiable, country, state_province, city, area_name, full_address, location_id, seller_id, is_active, is_featured, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: commercial_properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commercial_properties (id, title, locations, description, commercial_type, listing_type, price, price_type, area_sqft, floors, parking_spaces, footfall, amenities, suitable_for, country, state_province, city, area_name, full_address, location_id, agency_id, owner_id, view_count, images, is_active, is_featured, created_at, updated_at, area, user_id, role) FROM stdin;
\.


--
-- Data for Name: computer_mobile_laptop_repair_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.computer_mobile_laptop_repair_services (id, title, description, service_type, repair_categories, devices_supported, brands_supported, base_service_charge, inspection_charge, minimum_charge, hourly_rate, pricing_type, free_inspection, services_offered, hardware_repair, software_repair, data_recovery, virus_removal, screen_replacement, battery_replacement, motherboard_repair, warranty_provided, warranty_period, genuine_parts_used, onsite_service, pickup_delivery_service, same_day_service, emergency_service, business_name, contact_person, contact_phone, contact_email, whatsapp_available, country, state, city, full_address, pincode, landmark, google_maps_link, working_hours, available_24_7, free_diagnostic, experience_years, certified_technician, technicians_count, service_area_radius, average_repair_time, customer_rating, total_reviews, years_in_business, licenses_certifications, insurance_coverage, payment_methods, accepts_card, accepts_upi, accepts_cash, website_url, facebook_url, instagram_url, is_active, is_verified, is_featured, featured_until, views_count, created_at, updated_at, user_id, role, keyboard_replacement, charging_port_repair, water_damage_repair, warranty_details, pickup_delivery_charges, emergency_charges, owner_name, registration_number, certification_details, authorized_service_center, authorized_brands, alternate_phone, whatsapp_number, state_province, area_name, location_id, service_areas, working_days, holiday_service, advance_booking_required, free_estimate, home_visit_available, home_visit_charges, bulk_service_discount, corporate_service, student_discount, senior_citizen_discount, images, videos, documents, certifications, advance_payment_required, advance_payment_percentage, terms_and_conditions, cancellation_policy, refund_policy, customer_support_number, complaint_number, support_email, response_time, rating, review_count, total_repairs, total_customers, availability_status, owner_id, view_count) FROM stdin;
\.


--
-- Data for Name: construction_materials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.construction_materials (id, name, category, description, price, unit, brand, specifications, images, supplier_id, supplier_name, supplier_contact, country, state_province, city, area, full_address, location_id, stock_status, minimum_order, is_active, is_featured, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, name, email, phone, subject, message, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: cricket_sports_training; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cricket_sports_training (id, title, description, listing_type, training_category, academy_name, coach_name, coach_experience_years, coach_certifications, coach_achievements, price_per_session, price_per_month, price_per_quarter, currency, discount_percentage, training_level, age_group, min_age, max_age, batch_size, session_duration_minutes, sessions_per_week, indoor_facility, outdoor_facility, net_practice_available, pitch_available, equipment_provided, facilities, equipment_list, training_modules, specializations, tournament_preparation, match_practice, video_analysis, fitness_training, mental_conditioning, training_days, morning_batch, evening_batch, weekend_batch, flexible_timing, certificate_provided, success_stories, students_trained, professional_players_produced, free_trial_available, trial_sessions, registration_fee, admission_process, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, whatsapp_number, website_url, city, state_province, area_name, full_address, country, images, videos, brochure_url, hostel_facility, transport_facility, diet_plan_included, scholarship_available, international_exposure, is_active, is_featured, is_verified, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: cyber_cafe_internet_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cyber_cafe_internet_services (id, title, description, cafe_name, service_type, services_offered, internet_browsing, printing_service, scanning_service, photocopying_service, lamination_service, binding_service, gaming_available, video_conferencing, online_classes_support, internet_price_per_hour, internet_price_per_day, printing_price_bw, printing_price_color, scanning_price, photocopying_price, gaming_price_per_hour, minimum_charge, membership_available, membership_plans, total_computers, available_computers, computer_specifications, internet_speed, wifi_available, printer_types, scanner_type, private_cabins, number_of_cabins, ac_available, parking_available, software_available, operating_systems, gaming_setup, gaming_titles, owner_name, license_number, established_year, experience_years, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, whatsapp_number, country, state_province, city, area_name, full_address, location_id, nearby_landmarks, working_hours, open_24_7, working_days, holiday_list, student_discount, student_discount_percentage, bulk_printing_discount, home_delivery, pickup_service, online_booking, prepaid_packages, cctv_surveillance, data_privacy_ensured, antivirus_installed, firewall_protection, payment_methods, advance_payment_required, images, videos, terms_and_conditions, cancellation_policy, refund_policy, usage_policy, food_beverages_available, stationary_available, charging_points, rest_area, rating, review_count, total_customers, exam_form_filling, resume_making, document_typing, translation_service, passport_photo, availability_status, is_active, is_featured, is_verified, owner_id, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: dance_karate_gym_yoga; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dance_karate_gym_yoga (id, title, description, class_category, class_type, instructor_name, instructor_qualification, instructor_experience_years, fee_per_month, fee_per_session, registration_fee, session_duration_minutes, sessions_per_week, batch_size, trial_class_available, certification_provided, equipment_provided, weekend_batches, contact_person, contact_phone, contact_email, country, state_province, city, area_name, full_address, is_active, is_featured, view_count, created_at, updated_at, user_id, role, images) FROM stdin;
\.


--
-- Data for Name: dance_karate_gym_yoga_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dance_karate_gym_yoga_classes (id, title, description, class_category, class_type, instructor_name, instructor_qualification, instructor_experience_years, fee_per_month, fee_per_session, registration_fee, age_group, min_age, max_age, skill_level, batch_size, session_duration_minutes, sessions_per_week, flexible_timings, weekend_batches, trial_class_available, certification_provided, equipment_provided, changing_room_available, parking_available, ac_facility, contact_person, contact_phone, contact_email, country, state_province, city, area_name, full_address, images, rating, review_count, is_active, is_featured, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: ebooks_online_courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ebooks_online_courses (id, title, description, listing_type, category, subcategory, book_title, author, publisher, isbn, publication_year, edition, language, page_count, file_format, file_size_mb, course_title, instructor_name, instructor_credentials, course_platform, course_duration_hours, total_lectures, course_level, course_language, subtitles_available, topics_covered, learning_outcomes, prerequisites, target_audience, content_type, price, original_price, discount_percentage, is_free, lifetime_access, subscription_based, subscription_price_monthly, subscription_price_yearly, video_quality, downloadable_resources, assignments_included, quizzes_included, certificate_provided, certificate_type, live_sessions, recorded_sessions, one_on_one_support, group_discussions, instant_access, access_duration_days, download_allowed, download_limit, streaming_allowed, offline_access, mobile_app_access, total_students, total_readers, rating, review_count, completion_rate, includes_ebook, includes_worksheets, includes_templates, includes_code_samples, bonus_content, cover_image, preview_images, preview_video_url, sample_chapters, demo_lecture_url, instructor_bio, instructor_rating, instructor_students_count, instructor_courses_count, author_bio, author_website, author_social_links, system_requirements, software_needed, hardware_requirements, internet_required, minimum_bandwidth, last_updated, content_updates, support_available, support_type, response_time, money_back_guarantee, guarantee_days, seller_id, seller_type, institution_name, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, whatsapp_number, country, state_province, city, area_name, full_address, location_id, delivery_method, payment_methods, installment_available, installment_plans, refund_policy, refund_period_days, keywords, meta_description, promotional_video_url, testimonials, copyright_notice, terms_of_use, privacy_policy, drm_protected, plagiarism_free, availability_status, is_active, is_featured, is_verified, is_bestseller, is_trending, is_new_release, view_count, inquiry_count, enrollment_count, download_count, created_at, updated_at, user_id, role, images) FROM stdin;
fb98eb1a-e288-44e2-b2f1-4dc5a39bb3dd	zzz		ebook	professional						\N	\N	\N	\N	\N	\N			\N	\N	\N	\N	\N		[]	[]	[]	[]	\N	\N	900.00	\N	\N	f	t	f	\N	\N	\N	f	f	f	f	\N	f	t	f	f	t	\N	t	\N	t	f	f	0	0	\N	0	\N	f	f	f	f	[]	\N	[]	\N	[]	\N	\N	\N	\N	\N	\N	\N	[]	\N	[]	\N	t	\N	\N	t	f	\N	\N	f	\N	\N	\N	\N	\N	07726070558	navin@gmail.com	\N	f	\N	India	Rajasthan	Jaipur	\N	\N	\N	\N	[]	f	[]	\N	\N	[]	\N	\N	[]	\N	\N	\N	f	t	available	t	f	f	f	f	f	0	0	0	0	2025-12-31 16:00:07.298903	2025-12-31 16:14:38.227594	c032e0a9-a4be-4f1d-bbe1-e63457f17787	admin	["/uploads/media/media-1767177876366-818492897.jpg"]
\.


--
-- Data for Name: educational_consultancy_study_abroad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.educational_consultancy_study_abroad (id, title, description, listing_type, company_name, company_type, registration_number, license_number, established_year, accreditation, affiliated_universities, partner_institutions, services_offered, admission_assistance, visa_assistance, document_preparation, application_processing, scholarship_guidance, loan_assistance, pre_departure_orientation, accommodation_assistance, career_counseling, language_training, test_preparation, interview_preparation, countries_covered, popular_destinations, university_partnerships, programs_offered, undergraduate_programs, postgraduate_programs, doctoral_programs, diploma_courses, certificate_courses, professional_courses, foundation_programs, pathway_programs, engineering, medicine, business_management, computer_science, arts_humanities, sciences, law, architecture, design, hospitality, consultation_fee, service_charge, application_fee, visa_processing_fee, package_price, currency, free_consultation, refundable_deposit, success_rate_percentage, students_placed, universities_tied_up, countries_served, years_of_experience, visa_success_rate, minimum_qualification, age_criteria, language_requirements, test_scores_required, minimum_score_requirements, work_experience_required, processing_time, application_deadline_assistance, intake_seasons, average_processing_days, counselor_name, counselor_qualification, counselor_experience_years, dedicated_counselor, group_counseling, online_counseling, in_person_counseling, phone_support, email_support, whatsapp_support, mock_interviews, sop_writing, lor_assistance, resume_building, portfolio_development, english_proficiency_training, aptitude_test_coaching, documents_required, document_verification, document_translation, attestation_services, scholarship_database_access, education_loan_tie_ups, financial_planning, part_time_job_guidance, airport_pickup, temporary_accommodation, bank_account_opening_help, sim_card_assistance, university_orientation, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_number, website_url, social_media_links, branch_locations, head_office_address, consultation_mode, appointment_required, walk_in_allowed, country, state_province, city, area_name, full_address, location_id, working_hours, working_days, available_24_7, emergency_support, images, videos, brochures, testimonials, case_studies, certifications, professional_memberships, awards_recognition, payment_methods, installment_available, refund_policy, terms_and_conditions, cancellation_policy, rating, review_count, total_consultations, free_seminar, webinar_available, study_material_provided, mobile_app_available, virtual_tour, is_active, is_featured, is_verified, verification_date, owner_id, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: electronics_gadgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.electronics_gadgets (id, title, description, listing_type, category, subcategory, brand, model, product_name, color, storage_capacity, ram, processor, screen_size, battery_capacity, camera_specs, operating_system, connectivity, condition, usage_duration, purchase_date, price, original_price, rental_price_per_day, rental_price_per_month, is_negotiable, warranty_available, warranty_period, warranty_type, bill_available, box_available, accessories_included, charger_included, original_accessories, screen_condition, body_condition, functional_issues, repairs_done, water_damage, exchange_accepted, exchange_preferences, images, videos, documents, seller_id, seller_type, shop_name, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, country, state_province, city, area_name, full_address, location_id, delivery_available, delivery_charges, pickup_available, shipping_options, reason_for_selling, purchased_from, imei_number, serial_number, features, additional_info, return_policy, refund_available, testing_allowed, availability_status, is_active, is_featured, is_verified, is_urgent, view_count, inquiry_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: event_decoration_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_decoration_services (id, title, description, service_type, service_category, venue_name, venue_type, capacity, capacity_seating, capacity_standing, hall_area, area_unit, base_price, price_type, price_per_hour, price_per_day, minimum_booking_hours, minimum_charge, security_deposit, catering_available, catering_included, catering_price_per_plate, decoration_included, decoration_charges, dj_sound_available, dj_sound_charges, lighting_available, lighting_lighting_charges, parking_available, parking_capacity, parking_charges, valet_parking_available, ac_available, power_backup, green_rooms, washrooms, kitchen_facility, bar_available, photography_allowed, outside_catering_allowed, outside_decorator_allowed, amenities, services_offered, decoration_types, event_types_supported, material_types, themes, available_equipment, floor_type, ceiling_height, stage_available, stage_dimensions, projector_available, audio_system_available, wifi_available, live_streaming_support, brand_name, product_name, material, color, dimensions, weight, quantity, minimum_order_quantity, stock_available, rental_available, rental_price_per_day, business_name, owner_name, registration_number, experience_years, team_size, events_planner_available, planner_charges, setup_included, setup_charges, teardown_included, coordinator_provided, customization_available, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_number, whatsapp_available, country, state_province, city, area_name, full_address, location_id, nearby_landmarks, accessibility_features, working_hours, working_days, available_24_7, advance_booking_required, minimum_advance_booking_days, peak_season_charges, off_season_discount, package_deals, images, videos, documents, portfolio_images, virtual_tour_url, website_url, payment_methods, advance_payment_required, advance_payment_percentage, cancellation_policy, refund_policy, terms_and_conditions, insurance_available, license_verified, covid_safety_measures, rating, review_count, total_events_hosted, total_bookings, availability_status, is_active, is_featured, is_verified, is_premium, owner_id, view_count, inquiry_count, booking_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: fashion_beauty_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fashion_beauty_products (id, title, description, listing_type, category, subcategory, product_type, brand, product_name, color, size, material, pattern, style, occasion, gender, age_group, fit_type, sleeve_type, neck_type, length, waist_size, inseam, product_volume, skin_type, hair_type, fragrance_type, ingredients, expiry_date, manufacturing_date, shelf_life, price, mrp, discount_percentage, rental_price_per_day, rental_price_per_week, rental_price_per_month, minimum_rental_period, rental_period_unit, security_deposit, condition, usage_duration, purchase_date, age_in_months, quality_grade, is_original, brand_authorized, certificate_available, authentication_proof, care_instructions, washing_instructions, dry_clean_only, iron_safe, fabric_care, dermatologically_tested, cruelty_free, vegan, organic, paraben_free, sulfate_free, allergen_info, in_stock, stock_quantity, sizes_available, colors_available, variant_options, customization_available, custom_sizing, personalization_options, tailoring_included, images, videos, size_chart, product_brochure, key_features, fabric_features, special_features, included_items, box_contents, is_on_sale, sale_end_date, bank_offers, combo_offers, bulk_discount_available, return_policy, return_period_days, replacement_policy, exchange_available, refund_available, warranty_available, warranty_period, seller_id, seller_type, shop_name, boutique_name, designer_name, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, whatsapp_number, country, state_province, city, area_name, full_address, location_id, delivery_available, delivery_charges, free_delivery, free_delivery_above, same_day_delivery, express_delivery, delivery_areas, shipping_options, cod_available, occasion_suitable, season, collection_name, launch_year, limited_edition, handcrafted, made_in, eco_friendly, sustainable_fashion, rating, review_count, total_sales, is_active, is_featured, is_verified, availability_status, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: furniture_interior_decor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.furniture_interior_decor (id, title, description, listing_type, category, subcategory, item_type, brand, material, color, dimensions, weight, condition, age_in_months, price, original_price, rental_price_per_day, rental_price_per_week, rental_price_per_month, minimum_rental_period, rental_period_unit, is_negotiable, assembly_required, assembly_service_available, assembly_charges, custom_made, customization_available, style, room_type, seating_capacity, warranty_available, warranty_period, warranty_type, bill_available, set_items, is_set, service_type, services_offered, interior_design, consultation_available, consultation_charges, installation_service, installation_charges, repair_service, restoration_service, upholstery_service, features, images, videos, documents, delivery_available, delivery_charges, free_delivery, pickup_available, shipping_options, exchange_accepted, exchange_preferences, return_policy, return_period_days, refund_available, seller_id, seller_type, shop_name, showroom_name, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, whatsapp_number, country, state_province, city, area_name, full_address, location_id, reason_for_selling, purchased_from, purchase_date, care_instructions, additional_info, business_name, registration_number, experience_years, certifications, portfolio_url, working_hours, working_days, available_24_7, advance_booking_required, base_service_charge, price_per_sqft, minimum_order_value, bulk_discount_available, payment_methods, advance_payment_required, advance_payment_percentage, emi_available, terms_and_conditions, cancellation_policy, in_stock, stock_quantity, availability_status, is_active, is_featured, is_verified, is_urgent, view_count, inquiry_count, favorite_count, rating, review_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: health_wellness_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.health_wellness_services (id, title, description, service_type, specialization, consultation_type, consultation_fee, doctor_name, qualifications, experience_years, registration_number, timings, appointment_required, emergency_service, home_visit, online_consultation, insurance_accepted, services_offered, facilities, languages, images, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_number, website, country, state_province, city, area_name, full_address, location_id, working_hours, working_days, available_24_7, wheelchair_accessible, parking_available, rating, review_count, total_patients, is_active, is_featured, is_verified, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: heavy_equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.heavy_equipment (id, title, description, listing_type, equipment_type, category, brand, model, year, price, price_type, condition, hours_used, serial_number, specifications, images, documents, features, maintenance_history, warranty_info, is_negotiable, country, state_province, city, area_name, full_address, location_id, seller_id, is_active, is_featured, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: hostel_listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hostel_listings (id, name, description, price_per_month, hostel_type, room_type, total_beds, available_beds, country, state_province, city, area, full_address, contact_person, contact_phone, rules, facilities, images, food_included, featured, active, owner_id, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: household_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.household_services (id, title, description, service_type, service_category, services_offered, base_service_charge, hourly_rate, minimum_charge, pricing_type, free_inspection, free_estimate, emergency_service, emergency_charges, same_day_service, warranty_provided, warranty_period, warranty_details, available_24_7, working_hours, working_days, advance_booking_required, minimum_booking_hours, business_name, owner_name, registration_number, experience_years, team_size, certified_professional, certification_details, residential_service, commercial_service, industrial_service, specializations, equipment_provided, materials_included, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_number, whatsapp_available, country, state_province, city, area_name, full_address, location_id, service_areas, service_radius_km, travel_charges, home_visit_available, pickup_service, onsite_repair, offsite_repair, consultation_available, consultation_charges, senior_citizen_discount, first_time_discount, bulk_service_discount, contract_available, amc_available, images, videos, documents, certifications, portfolio_images, payment_methods, advance_payment_required, advance_payment_percentage, cash_on_delivery, digital_payment, terms_and_conditions, cancellation_policy, refund_policy, privacy_policy, customer_support_number, support_email, response_time, complaint_number, rating, review_count, total_jobs_completed, total_customers, repeat_customer_percentage, availability_status, is_active, is_featured, is_verified, is_background_verified, owner_id, view_count, inquiry_count, booking_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: industrial_land; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.industrial_land (id, title, description, listing_type, price, area, area_unit, land_type, zoning, road_access, electricity_available, water_supply, sewerage_available, images, documents, suitable_for, country, state_province, city, area_name, full_address, location_id, agency_id, is_active, is_featured, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: industrial_properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.industrial_properties (id, title, description, industrial_type, listing_type, price, price_type, land_area, built_up_area, area_unit, floors, power_supply, water_facility, road_access, loading_docks, parking_spaces, crane_facility, images, documents, amenities, suitable_for, country, state_province, city, area_name, full_address, location_id, agency_id, is_active, is_featured, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: jewelry_accessories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jewelry_accessories (id, title, description, listing_type, category, subcategory, item_type, material, metal_purity, gemstones, weight, dimensions, brand, design, occasion, gender, condition, price, original_price, discount_percentage, is_negotiable, customization_available, hallmark_certified, certificate_available, warranty_available, warranty_period, images, videos, features, in_stock, stock_quantity, seller_id, seller_type, shop_name, contact_person, contact_phone, contact_email, whatsapp_available, country, state_province, city, area_name, full_address, location_id, delivery_available, delivery_charges, return_policy, is_active, is_featured, is_verified, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: language_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.language_classes (id, title, description, listing_type, language_name, proficiency_level, course_duration_months, classes_per_week, class_duration_hours, teaching_mode, class_type, batch_size, instructor_name, instructor_qualification, instructor_experience, native_speaker, fee_per_month, registration_fee, total_course_fee, study_materials_provided, certification_provided, free_demo_class, contact_person, contact_phone, contact_email, country, state_province, city, area_name, full_address, is_active, is_featured, view_count, created_at, updated_at, user_id, role, images) FROM stdin;
\.


--
-- Data for Name: music_arts_sports_academies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.music_arts_sports_academies (id, title, description, academy_name, academy_category, specialization, programs_offered, fee_structure, monthly_fee, admission_fee, instructor_qualifications, certification_provided, performance_opportunities, instrument_provided, contact_person, contact_phone, contact_email, country, state_province, city, area_name, full_address, images, is_active, is_featured, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: office_spaces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.office_spaces (id, title, description, listing_type, price, price_type, area, office_type, capacity, cabins, workstations, meeting_rooms, furnishing_status, images, amenities, parking_spaces, floor, total_floors, available_from, country, state_province, city, area_name, full_address, location_id, agency_id, is_active, is_featured, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: pharmacy_medical_stores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_medical_stores (id, title, description, listing_type, store_name, pharmacy_name, license_number, establishment_year, owner_name, pharmacist_name, pharmacist_qualification, pharmacist_registration_number, medicine_types, prescription_medicines, otc_medicines, ayurvedic_products, homeopathic_medicines, surgical_items, medical_devices, healthcare_products, baby_care_products, home_delivery, free_home_delivery, minimum_order_for_free_delivery, delivery_charges, same_day_delivery, emergency_delivery, prescription_upload, online_consultation, medicine_reminder_service, chronic_disease_medicines, cancer_medicines, diabetic_care, cardiac_care, pediatric_medicines, geriatric_care, discount_available, discount_percentage, senior_citizen_discount, senior_citizen_discount_percentage, loyalty_program, subscription_available, generic_medicines_available, cold_storage_available, refrigerated_medicines, vaccine_storage, drug_license_number, fssai_license, iso_certified, authentic_medicines_guaranteed, open_24_7, working_hours, working_days, emergency_services, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_number, whatsapp_available, country, state_province, city, area_name, full_address, landmark, pincode, location_id, parking_available, wheelchair_accessible, images, documents, certificates_images, payment_methods, upi_payment, card_payment, cash_payment, insurance_accepted, terms_and_conditions, return_policy, refund_policy, rating, review_count, total_orders, availability_status, is_active, is_featured, is_verified, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: phones_tablets_accessories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phones_tablets_accessories (id, title, description, listing_type, category, subcategory, product_type, brand, model, product_name, color, storage_capacity, ram, processor, screen_size, battery_capacity, camera_specs, operating_system, connectivity, display_type, refresh_rate, price, mrp, discount_percentage, rental_price_per_day, rental_price_per_month, emi_available, emi_starting_from, warranty_period, warranty_type, manufacturer_warranty, extended_warranty_available, in_stock, stock_quantity, expected_delivery_days, key_features, accessories_included, box_contents, compatible_devices, accessory_type, material, is_on_sale, sale_end_date, bank_offers, exchange_offer, exchange_discount_up_to, images, videos, product_brochure, seller_id, seller_type, shop_name, brand_authorized, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, country, state_province, city, area_name, full_address, location_id, free_delivery, delivery_charges, same_day_delivery, cod_available, shipping_options, delivery_areas, bis_certified, certification_details, original_product, made_in, launch_date, specifications, technical_details, return_policy, return_period_days, replacement_policy, refund_available, customer_care_number, service_center_available, installation_support, rating, review_count, availability_status, is_active, is_featured, is_verified, is_trending, is_new_arrival, is_best_seller, view_count, inquiry_count, purchase_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: pro_profile_fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pro_profile_fields (id, profile_type_id, key, label, field_type, is_required, placeholder, help_text, sort_order, options, config, created_at, updated_at) FROM stdin;
7154ee12-0794-4314-b6b4-e74366063b3b	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	fullName	Full Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
2a083e1f-b594-4b04-a82c-4b3d96aa1800	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	profilePhoto	Profile Photo	image	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e42ee7ae-28ca-4380-8951-024e4ce5277b	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	about	About / Description	textarea	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
b5e99baa-21b7-440c-98f1-c75e47d3225f	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	skills	Skills / Services	tags	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
63ba6840-61d2-4046-8093-82c490faae91	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	experience	Experience	text	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
73a1d240-0f51-4662-b503-949afbf0d383	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	location	Location	text	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
06624b2d-ced7-4a54-8e6a-e57da3a8375a	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	contactDetails	Contact Details	textarea	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
a994f0cd-71b1-42c4-a9dd-63c457850a1d	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	designation	Designation / Job Title	text	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
38bd9b8b-b7b4-4482-90ae-fa0284bc6711	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	professionalSummary	Professional Summary	textarea	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
3ce32d8a-b90a-4ed0-8551-31aed596a4ae	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	totalExperience	Total Experience	text	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
4a468cd2-8540-4a1a-a0b9-ff2cedffc1ad	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	workExperience	Work Experience	textarea	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
749fbb24-d1b8-4d44-8998-377e7d1a6ad8	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	companyName	Company Name	text	f	\N	\N	12	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
db9d8057-561b-46ee-8696-b372dce94e88	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	role	Role	text	f	\N	\N	13	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
1fdf20d6-5434-4ea1-9e02-f6c47aad2402	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	department	Department	text	f	\N	\N	14	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
aeed5c85-a88b-4876-a095-f52e60c3ce71	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	duration	Duration	text	f	\N	\N	15	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
c7ed6511-801d-4298-a670-33e70bdaf024	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	responsibilities	Responsibilities	textarea	f	\N	\N	16	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
152d724a-abb1-4a04-9439-c2824270997b	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	education	Education	textarea	f	\N	\N	17	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
5e019af2-17cb-41be-9709-ec9e1600fb32	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	certifications	Certifications	textarea	f	\N	\N	18	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
c6fb3e5d-3b41-472f-9355-006818519f0f	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	projects	Projects	textarea	f	\N	\N	19	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
66f50b58-42b1-4d01-ba43-8054e11a8b33	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	achievements	Achievements	textarea	f	\N	\N	20	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
f166476d-37fd-47a5-aede-18fcdfcae7e0	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	languages	Languages	tags	f	\N	\N	21	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
7e273ab2-9b9b-48bd-b00d-ade5cdce7abe	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	currentSalary	Current Salary	text	f	\N	\N	22	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
93e50714-e06b-462f-92bb-4d910259aac3	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	expectedSalary	Expected Salary	text	f	\N	\N	23	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
7a05b2c0-41ec-42b3-8786-44c8ed8a8dd0	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	jobTypePreference	Job Type Preference	select	f	\N	\N	24	[{"label": "Government", "value": "government"}, {"label": "Private", "value": "private"}, {"label": "Freelance", "value": "freelance"}, {"label": "Remote", "value": "remote"}]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
1188a7c2-126e-4d46-873a-ad52eb559c08	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	locationPreference	Location Preference	text	f	\N	\N	25	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
894ed75f-5693-433a-aa89-30cf276b2177	7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	noticePeriod	Notice Period	text	f	\N	\N	26	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
7a6dfa39-de18-445d-a0ab-d2eb82b1a647	4fa9f354-c4d6-404a-ad27-5cf362439439	businessName	Business Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
6374d8a5-d2c1-49fc-ac55-5afaec4adea9	4fa9f354-c4d6-404a-ad27-5cf362439439	ownerFounderName	Owner / Founder Name	text	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
7a5d14f4-4cc4-4ebe-8547-f734124a1cd3	4fa9f354-c4d6-404a-ad27-5cf362439439	logo	Logo	image	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
de1b25ba-8617-41eb-b4b3-6e4a1257c9db	4fa9f354-c4d6-404a-ad27-5cf362439439	businessCategory	Business Category	text	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
0a5c3c2b-667b-4bcb-a072-275459982b16	4fa9f354-c4d6-404a-ad27-5cf362439439	aboutBusiness	About Business	textarea	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
89af7a1a-9648-4d53-a2a4-b91354edd5f7	4fa9f354-c4d6-404a-ad27-5cf362439439	productsServices	Products / Services	textarea	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
5cdbf8a1-1a59-470b-955e-9b6f7b546e4c	4fa9f354-c4d6-404a-ad27-5cf362439439	experienceYears	Experience (Years)	number	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
89e3823c-cd59-457d-bbfa-ed9689a79357	4fa9f354-c4d6-404a-ad27-5cf362439439	address	Address	textarea	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
ffbba4b0-5fa0-4871-b3b4-612af0512bd6	4fa9f354-c4d6-404a-ad27-5cf362439439	workingHours	Working Hours	text	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
1708ce94-9ed3-4e52-924c-e4a986226bec	4fa9f354-c4d6-404a-ad27-5cf362439439	contactDetails	Contact Details	textarea	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
850b9b01-217c-4f0f-a731-bbf2f94bb6b3	4fa9f354-c4d6-404a-ad27-5cf362439439	website	Website	text	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
9e4a1a43-7168-4059-8302-57437e2bd40d	4fa9f354-c4d6-404a-ad27-5cf362439439	socialMediaLinks	Social Media Links	textarea	f	\N	\N	12	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
b7976011-9157-40ec-b656-8c1e63a6b4de	4fa9f354-c4d6-404a-ad27-5cf362439439	gstRegistrationNo	GST / Registration No.	text	f	\N	\N	13	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
a4c90c13-3e7d-4cd8-999b-312c9416b533	4fa9f354-c4d6-404a-ad27-5cf362439439	teamSize	Team Size	number	f	\N	\N	14	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
cc07dac2-3a84-4267-802b-9cc43747d880	4fa9f354-c4d6-404a-ad27-5cf362439439	clients	Clients	textarea	f	\N	\N	15	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
1deb9e97-0053-4b37-985f-1532f08e9caa	4fa9f354-c4d6-404a-ad27-5cf362439439	awards	Awards	textarea	f	\N	\N	16	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
ba8bbdaa-490b-4f50-84f8-0fd7552917b3	54cd1691-7071-479c-92d4-ac722f44e12f	brandName	Name / Brand Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
2ef461ec-4e1e-407c-8bc7-9d4a5c97ad07	54cd1691-7071-479c-92d4-ac722f44e12f	profilePhoto	Profile Photo	image	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
413d6e47-bc9b-419e-8c1c-27ad376f6fda	54cd1691-7071-479c-92d4-ac722f44e12f	headline	Headline	text	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
7093be05-2c50-4ae9-a756-988f62c5ac97	54cd1691-7071-479c-92d4-ac722f44e12f	aboutMe	About Me	textarea	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
44409cfb-ac5e-4834-a2de-ba17523a35c3	54cd1691-7071-479c-92d4-ac722f44e12f	servicesOffered	Services Offered	textarea	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
81e02fed-8756-4053-8846-a6edeb20363d	54cd1691-7071-479c-92d4-ac722f44e12f	skills	Skills	tags	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
6c6f87d7-604d-46f0-941d-c5fd6ba8b6f9	54cd1691-7071-479c-92d4-ac722f44e12f	toolsUsed	Tools Used	tags	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e2e510bb-609c-47c4-b187-34ede915c823	54cd1691-7071-479c-92d4-ac722f44e12f	experience	Experience	text	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
04463980-5780-47f8-a51d-e19e33fcfd39	54cd1691-7071-479c-92d4-ac722f44e12f	portfolio	Portfolio	textarea	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
57b5894c-2f74-44d9-b033-238f52644eed	54cd1691-7071-479c-92d4-ac722f44e12f	pastClients	Past Clients	textarea	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
1f7c2006-2448-4191-9dcc-96e828244949	54cd1691-7071-479c-92d4-ac722f44e12f	ratingsReviews	Ratings & Reviews	textarea	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
de92381d-4d25-49ba-a6a0-1ee9e3b01210	54cd1691-7071-479c-92d4-ac722f44e12f	hourlyProjectRate	Hourly / Project Rate	text	f	\N	\N	12	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
3a24737f-109d-4d56-bd60-6f3f9a59e3d9	54cd1691-7071-479c-92d4-ac722f44e12f	availability	Availability	text	f	\N	\N	13	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e8683dee-c398-4fad-9599-04e363782509	54cd1691-7071-479c-92d4-ac722f44e12f	communicationLanguage	Communication Language	text	f	\N	\N	14	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
913f35cf-51d9-4f75-9dfe-4a60febc898a	54cd1691-7071-479c-92d4-ac722f44e12f	contactMethod	Contact Method	text	f	\N	\N	15	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e357eea7-9770-43f3-8e99-8d31f35ea819	5cfccef8-e217-4fb5-94b0-247f633edc0d	fullName	Full Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
d838c529-eca6-46f1-87a1-15eaf2b69033	5cfccef8-e217-4fb5-94b0-247f633edc0d	photos	Photo(s)	images	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
2918ee56-fe85-43b1-976c-702a1ba9578f	5cfccef8-e217-4fb5-94b0-247f633edc0d	dobAge	Date of Birth / Age	text	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e9f55f1f-6dcd-44c7-8142-9f72b603b82b	5cfccef8-e217-4fb5-94b0-247f633edc0d	gender	Gender	select	f	\N	\N	4	[{"label": "Male", "value": "male"}, {"label": "Female", "value": "female"}, {"label": "Other", "value": "other"}]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
f76ad98b-4052-4879-9ad9-41a80d2c52a0	5cfccef8-e217-4fb5-94b0-247f633edc0d	heightWeight	Height / Weight	text	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
0dfacef2-5805-4557-a1f7-14ebac1f1d8c	5cfccef8-e217-4fb5-94b0-247f633edc0d	religionCaste	Religion / Caste	text	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
30cfa1f0-f8b9-4ec8-9b59-eab5b6ecbec2	5cfccef8-e217-4fb5-94b0-247f633edc0d	education	Education	text	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
0cb32891-d57e-4e0c-afd7-a07138e8cd55	5cfccef8-e217-4fb5-94b0-247f633edc0d	profession	Profession	text	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e0b2c0be-d97b-49df-bf11-d0b5491ba300	5cfccef8-e217-4fb5-94b0-247f633edc0d	income	Income	text	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
224eb212-466d-4b54-95ce-e1fdd372122b	5cfccef8-e217-4fb5-94b0-247f633edc0d	familyDetails	Family Details	textarea	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
5ea73d88-69bc-4a84-a0d6-9482a314b7c8	5cfccef8-e217-4fb5-94b0-247f633edc0d	maritalStatus	Marital Status	text	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
81ed277a-d2d9-4368-90c1-f7b0a60b23e5	5cfccef8-e217-4fb5-94b0-247f633edc0d	location	Location	text	f	\N	\N	12	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
187a91d3-fdb5-424b-bd84-f59abcb48844	5cfccef8-e217-4fb5-94b0-247f633edc0d	lifestyle	Lifestyle (Food, Habits)	textarea	f	\N	\N	13	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
2740f62d-9f1e-4fd2-aaa0-393d7f01c6a6	5cfccef8-e217-4fb5-94b0-247f633edc0d	partnerPreferences	Partner Preferences	textarea	f	\N	\N	14	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
93dc8506-d658-4b8c-b701-827b0be3773c	5cfccef8-e217-4fb5-94b0-247f633edc0d	horoscope	Horoscope (optional)	text	f	\N	\N	15	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
003fd2b8-54d7-499d-906c-1faa8f55a6e4	5cfccef8-e217-4fb5-94b0-247f633edc0d	contactOptional	Contact (optional)	text	f	\N	\N	16	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
c5eaa090-090b-4333-b3a9-e782e28958cc	331f1df2-750a-463c-8f5e-c6d96b6a82f0	username	Name / Username	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
b2a1cc0c-29f1-4f98-a20f-752f73e6aad5	331f1df2-750a-463c-8f5e-c6d96b6a82f0	profilePicture	Profile Picture	image	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
521b9cb7-87dc-4b55-9230-7ebccdf96b85	331f1df2-750a-463c-8f5e-c6d96b6a82f0	bio	Bio	textarea	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
9ab9f860-8ea1-4fab-ab7b-8e230fd2698f	331f1df2-750a-463c-8f5e-c6d96b6a82f0	contentCategory	Content Category	text	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
03127093-5018-4d10-8b4d-00cde75ac79f	331f1df2-750a-463c-8f5e-c6d96b6a82f0	platformName	Platform Name	text	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
603622a9-0fb5-41e4-b70b-37930d313e88	331f1df2-750a-463c-8f5e-c6d96b6a82f0	followersCount	Followers Count	text	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
edc315f1-0722-43be-a5ff-d9fdd7267a65	331f1df2-750a-463c-8f5e-c6d96b6a82f0	engagementRate	Engagement Rate	text	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
55addc61-d979-4c90-b897-c0b587f62e33	331f1df2-750a-463c-8f5e-c6d96b6a82f0	collaborationInterest	Collaboration Interest	text	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
1065f959-c2aa-4fd4-9d94-b421ccd9073f	331f1df2-750a-463c-8f5e-c6d96b6a82f0	brandDeals	Brand Deals	textarea	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
1d2eab92-ac17-4174-bf24-485a52c92d7a	331f1df2-750a-463c-8f5e-c6d96b6a82f0	contactEmail	Contact Email	text	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
f3af7de2-0e21-48d7-a401-f264bba0abcf	331f1df2-750a-463c-8f5e-c6d96b6a82f0	location	Location	text	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
2fc4f810-8bc4-4788-be95-a92b24a47ce9	331f1df2-750a-463c-8f5e-c6d96b6a82f0	mediaKitLink	Media Kit Link	text	f	\N	\N	12	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
201d1e04-d93c-4c77-9ec0-f9bf17fe74b1	142f8de7-7b4e-4ce9-b5a3-3256d6989873	companyName	Company Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
a6379c98-fbb2-46ce-b042-e73ebb0cba88	142f8de7-7b4e-4ce9-b5a3-3256d6989873	logo	Logo	image	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
ae266da3-39c8-497d-aa38-e646377a56da	142f8de7-7b4e-4ce9-b5a3-3256d6989873	companyType	Company Type	text	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
662620c6-37cd-4485-a418-5895fcbbc46f	142f8de7-7b4e-4ce9-b5a3-3256d6989873	industry	Industry	text	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
cca66ca1-0a99-461c-9f32-f2a949125605	142f8de7-7b4e-4ce9-b5a3-3256d6989873	foundedYear	Founded Year	text	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
eac0eb3d-21db-487d-982f-a2f728d7afa5	142f8de7-7b4e-4ce9-b5a3-3256d6989873	aboutCompany	About Company	textarea	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
c541ffdc-86d0-496f-b51f-57e65ff5236a	142f8de7-7b4e-4ce9-b5a3-3256d6989873	visionMission	Vision & Mission	textarea	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
392c7e9b-fc70-4dc1-87f0-433f9574fc72	142f8de7-7b4e-4ce9-b5a3-3256d6989873	productsServices	Products / Services	textarea	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
6ea726b3-ff83-49e9-822a-e4441da04d53	142f8de7-7b4e-4ce9-b5a3-3256d6989873	directorManagement	Director / Management	textarea	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
d35e91c8-28d4-4fb8-8245-bf9746fc7a59	142f8de7-7b4e-4ce9-b5a3-3256d6989873	employeesCount	Employees Count	text	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
7bcd7d95-2bb8-46ff-92d5-a047e6371952	142f8de7-7b4e-4ce9-b5a3-3256d6989873	officeAddress	Office Address	textarea	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
8f40cd83-c376-46ea-ab5e-f679f7660fba	142f8de7-7b4e-4ce9-b5a3-3256d6989873	contactDetails	Contact Details	textarea	f	\N	\N	12	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
b4a06e69-0f44-416b-9089-a399cbb6def6	142f8de7-7b4e-4ce9-b5a3-3256d6989873	website	Website	text	f	\N	\N	13	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
621bb6bc-ed67-4069-ab28-77c5f192ef20	142f8de7-7b4e-4ce9-b5a3-3256d6989873	certifications	Certifications	textarea	f	\N	\N	14	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
ff282812-09b4-4b1b-b689-8c6cf4e10666	142f8de7-7b4e-4ce9-b5a3-3256d6989873	clients	Clients	textarea	f	\N	\N	15	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
28a0cc1d-19ac-408f-a54c-bdd93050c32f	142f8de7-7b4e-4ce9-b5a3-3256d6989873	awards	Awards	textarea	f	\N	\N	16	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
d6a699cd-ca3f-4871-8b43-140cd3caec2e	a9b82e45-a61d-413b-b5bd-fa0df62525db	name	Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
221dafda-42b4-4ade-bab1-0f3219b79710	a9b82e45-a61d-413b-b5bd-fa0df62525db	photo	Photo	image	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
95e18a3c-c0c5-4984-b7b6-e631d8f6f7a9	a9b82e45-a61d-413b-b5bd-fa0df62525db	courseClass	Course / Class	text	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
4bd49000-6b26-455c-98c7-c1d631b7abb9	a9b82e45-a61d-413b-b5bd-fa0df62525db	stream	Stream	text	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
97cf3e70-3a92-4866-82cb-508bb5e43fbe	a9b82e45-a61d-413b-b5bd-fa0df62525db	collegeSchool	College / School	text	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
b0f6b1e3-5d21-4f00-967d-ec3271bd1a71	a9b82e45-a61d-413b-b5bd-fa0df62525db	universityBoard	University / Board	text	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
5d69d5b1-1ecd-4508-88ce-794514bfd458	a9b82e45-a61d-413b-b5bd-fa0df62525db	yearSemester	Year / Semester	text	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
77834847-3168-4d01-b4c7-6aaa7411fb9a	a9b82e45-a61d-413b-b5bd-fa0df62525db	academicPerformance	Academic Performance	text	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
838b0443-3410-4986-b64b-7ca3aca4263f	a9b82e45-a61d-413b-b5bd-fa0df62525db	skills	Skills	tags	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
a26091ad-e39c-4c80-8fab-c7fda2588ea4	a9b82e45-a61d-413b-b5bd-fa0df62525db	projects	Projects	textarea	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
28f1be05-ffc0-4745-ae28-4a7c6d0464ff	a9b82e45-a61d-413b-b5bd-fa0df62525db	internships	Internships	textarea	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
8856dc3c-e6aa-4c05-8f7b-1ca6f4e89f56	a9b82e45-a61d-413b-b5bd-fa0df62525db	certifications	Certifications	textarea	f	\N	\N	12	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
cf2100b4-3ee3-46a1-aeee-00f95b85a65a	a9b82e45-a61d-413b-b5bd-fa0df62525db	achievements	Achievements	textarea	f	\N	\N	13	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
7663bdb2-c493-49df-b9ab-d9830878bfee	a9b82e45-a61d-413b-b5bd-fa0df62525db	careerObjective	Career Objective	textarea	f	\N	\N	14	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e27dc3d0-05e6-4262-aeff-1c93febf0719	a9b82e45-a61d-413b-b5bd-fa0df62525db	contactDetails	Contact Details	textarea	f	\N	\N	15	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
4e653ce7-c3b7-438d-b5c9-a8db3ae05c88	91de98d1-ffef-4454-aebb-cc468fcd2e07	name	Name (Dr.)	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
87c6bb82-4f1a-4ace-9f54-5c14b0ee41e1	91de98d1-ffef-4454-aebb-cc468fcd2e07	photo	Photo	image	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
f19577bf-a5c6-4fd6-aeb4-60847ce71053	91de98d1-ffef-4454-aebb-cc468fcd2e07	specialty	Specialty	text	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
6c6759c7-f16d-4185-b774-5b72fcaee292	91de98d1-ffef-4454-aebb-cc468fcd2e07	qualification	Qualification	text	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
236ffe6f-2076-4bd2-869a-faf9a3823e8d	91de98d1-ffef-4454-aebb-cc468fcd2e07	registrationNumber	Registration Number	text	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
065c7cc9-04fc-46fa-96b1-84a0c594f50e	91de98d1-ffef-4454-aebb-cc468fcd2e07	experience	Experience	text	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
987eb4d9-cd08-4172-824e-345624e9644f	91de98d1-ffef-4454-aebb-cc468fcd2e07	hospitalClinicName	Hospital / Clinic Name	text	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e9299829-6660-4a3b-8acc-54c9d5b3d9dc	91de98d1-ffef-4454-aebb-cc468fcd2e07	diseasesTreated	Diseases Treated	textarea	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e42093a9-a723-4813-bd5c-5c732c5af491	91de98d1-ffef-4454-aebb-cc468fcd2e07	procedures	Procedures	textarea	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
300b26d8-e16d-4ea0-8712-dc0d2915450c	91de98d1-ffef-4454-aebb-cc468fcd2e07	opdTiming	OPD Timing	text	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
c502f7d4-5c06-4e8e-937b-6afa1c9018e6	91de98d1-ffef-4454-aebb-cc468fcd2e07	consultationFees	Consultation Fees	text	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
31e516b9-aa25-42b8-8a90-4746f9f56606	91de98d1-ffef-4454-aebb-cc468fcd2e07	onlineConsultation	Online Consultation	text	f	\N	\N	12	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
92767a42-3887-4a71-a661-ba3990d799e4	91de98d1-ffef-4454-aebb-cc468fcd2e07	contactDetails	Contact Details	textarea	f	\N	\N	13	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
4eeaedee-1655-47f1-89f4-358aae831fda	eea302ab-53b8-4359-8926-cefc97334c18	name	Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
46057a2b-ae61-4035-adaf-2b9199ae3681	eea302ab-53b8-4359-8926-cefc97334c18	photo	Photo	image	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
01df4efd-0e37-4ad9-8213-ff6e525fee10	eea302ab-53b8-4359-8926-cefc97334c18	subjectExpertise	Subject / Expertise	text	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
2382e562-844a-43e7-99f4-0c949a6f974a	eea302ab-53b8-4359-8926-cefc97334c18	qualification	Qualification	text	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
aac13718-d33d-40c8-aff0-56932d3cbb2d	eea302ab-53b8-4359-8926-cefc97334c18	teachingExperience	Teaching Experience	text	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
5804746f-6ecf-4cb9-b305-cec887a45fae	eea302ab-53b8-4359-8926-cefc97334c18	instituteName	Institute Name	text	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
518ea529-6143-419f-a36f-540a1038de12	eea302ab-53b8-4359-8926-cefc97334c18	coursesOffered	Courses Offered	textarea	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
01df1335-e432-42ad-92d0-19e847a866a9	eea302ab-53b8-4359-8926-cefc97334c18	mode	Mode (Online/Offline)	select	f	\N	\N	8	[{"label": "Online", "value": "online"}, {"label": "Offline", "value": "offline"}, {"label": "Hybrid", "value": "hybrid"}]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
a407b171-3935-40c3-8ce4-5d3422cd05cb	eea302ab-53b8-4359-8926-cefc97334c18	achievements	Achievements	textarea	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
4ee955e9-c0dc-480c-ae8a-958a90a0b375	eea302ab-53b8-4359-8926-cefc97334c18	certifications	Certifications	textarea	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
ab3422f2-3f94-4bbd-8c7b-c843582f335e	eea302ab-53b8-4359-8926-cefc97334c18	languages	Languages	tags	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
3245dc49-a381-401d-87b5-b8459dc2bd9c	eea302ab-53b8-4359-8926-cefc97334c18	contactDetails	Contact Details	textarea	f	\N	\N	12	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
c5b77385-a3e4-423a-9ca6-9c4ff10bc71c	4dac30c7-b2d5-4525-9368-d5a51ce464e0	name	Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
663fef56-fd03-43f3-9ca7-10e29ae4ef42	4dac30c7-b2d5-4525-9368-d5a51ce464e0	photo	Photo	image	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
b9ae6de7-3681-45d7-9a6e-db0e0b2d66f9	4dac30c7-b2d5-4525-9368-d5a51ce464e0	aboutMe	About Me	textarea	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
5f684a65-d889-41f9-9182-6675eb954757	4dac30c7-b2d5-4525-9368-d5a51ce464e0	interests	Interests	tags	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
72a7baa4-2c95-4dc1-a8a6-04ecd83d74dc	4dac30c7-b2d5-4525-9368-d5a51ce464e0	hobbies	Hobbies	tags	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
b5464df8-4fe5-4c0c-8961-986947cb1364	4dac30c7-b2d5-4525-9368-d5a51ce464e0	skills	Skills	tags	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
926e062d-3db5-443d-a8d5-89bb76af9746	4dac30c7-b2d5-4525-9368-d5a51ce464e0	experienceAny	Experience (if any)	text	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
7c8f95c6-7bc9-42b4-a3ee-ee6f1cf2b0b5	4dac30c7-b2d5-4525-9368-d5a51ce464e0	socialLinks	Social Links	textarea	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
70fa99cd-04a9-4f11-a7d3-9ce48114a57d	4dac30c7-b2d5-4525-9368-d5a51ce464e0	contactInfo	Contact Info	textarea	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
8a87e0f1-ef80-4a35-811a-bccbeb455153	b78589e0-415a-496e-ad86-05c908eb3c24	nameStageName	Name / Stage Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
4669dbd3-321f-4189-afec-85cf67687fdb	b78589e0-415a-496e-ad86-05c908eb3c24	artType	Art Type	text	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
6a7523de-330d-4a0e-82a5-59839c2b6ab0	b78589e0-415a-496e-ad86-05c908eb3c24	portfolio	Portfolio	textarea	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
002b8241-b0f0-4a2d-aff2-e9950d03d550	b78589e0-415a-496e-ad86-05c908eb3c24	experience	Experience	text	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
52bb876d-a79c-4188-97c4-9ca11d5947e9	b78589e0-415a-496e-ad86-05c908eb3c24	performancesWork	Performances / Work	textarea	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
35599daf-7867-429b-846f-af31a5fbbcc6	b78589e0-415a-496e-ad86-05c908eb3c24	awards	Awards	textarea	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
c6965cd0-fbc2-4013-9071-6c9f91dd4938	b78589e0-415a-496e-ad86-05c908eb3c24	socialMedia	Social Media	textarea	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
d798c162-dc06-49fb-b487-51c53a00dc1a	b78589e0-415a-496e-ad86-05c908eb3c24	contactInfo	Contact Info	textarea	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
4b0737e4-2507-4a59-954d-128b2fb95bfb	653893c6-d8f2-4540-bf39-83d4b2c73065	organizationName	Organization Name	text	t	\N	\N	1	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
55a1a9eb-8afb-45c6-a0a4-09994aa21e1e	653893c6-d8f2-4540-bf39-83d4b2c73065	logo	Logo	image	f	\N	\N	2	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
b74f066f-ddce-49e3-8d89-cc9a7b66ee10	653893c6-d8f2-4540-bf39-83d4b2c73065	registrationNumber	Registration Number	text	f	\N	\N	3	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
cdcca645-b80d-4b99-9fcb-2d270f73e895	653893c6-d8f2-4540-bf39-83d4b2c73065	aboutNgo	About NGO	textarea	f	\N	\N	4	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
6db54c02-e731-4eab-b472-07db888b5b7f	653893c6-d8f2-4540-bf39-83d4b2c73065	cause	Cause	text	f	\N	\N	5	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
d423f0ab-5463-45ae-bbdf-5f90b67c5dc6	653893c6-d8f2-4540-bf39-83d4b2c73065	founder	Founder	text	f	\N	\N	6	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
3526266a-e833-4489-8ac6-b4aa8da4349c	653893c6-d8f2-4540-bf39-83d4b2c73065	activities	Activities	textarea	f	\N	\N	7	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
57f54b01-cf1e-4e08-8360-183ccfbbdfbb	653893c6-d8f2-4540-bf39-83d4b2c73065	location	Location	text	f	\N	\N	8	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
937f7da3-eb5a-4b84-91fa-47937efc9036	653893c6-d8f2-4540-bf39-83d4b2c73065	contactDetails	Contact Details	textarea	f	\N	\N	9	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
e24debe1-43bd-4464-aece-fd086ab3fff8	653893c6-d8f2-4540-bf39-83d4b2c73065	website	Website	text	f	\N	\N	10	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
023be6ec-6200-4fbb-bd2b-a6ea9ab3cc66	653893c6-d8f2-4540-bf39-83d4b2c73065	socialMedia	Social Media	textarea	f	\N	\N	11	[]	{}	2025-12-31 16:14:16.360964	2025-12-31 16:14:16.360964
\.


--
-- Data for Name: pro_profile_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pro_profile_types (id, name, slug, description, icon, is_active, sort_order, created_at, updated_at) FROM stdin;
7e3f715c-af1f-42f0-9d9c-a517c06b6bd9	Job / Professional Profile	job-professional	Job & professional profile	briefcase	t	1	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
4fa9f354-c4d6-404a-ad27-5cf362439439	Business Profile	business	Business / shop / startup profile	building	t	2	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
54cd1691-7071-479c-92d4-ac722f44e12f	Freelancing Profile	freelancing	Freelance profile	laptop	t	3	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
5cfccef8-e217-4fb5-94b0-247f633edc0d	Matrimony Profile	matrimony	Matrimony profile	heart	t	4	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
331f1df2-750a-463c-8f5e-c6d96b6a82f0	Social Media / Influencer Profile	influencer	Influencer profile	instagram	t	5	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
142f8de7-7b4e-4ce9-b5a3-3256d6989873	Company / Organization Profile	company	Company or organization profile	office	t	6	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
a9b82e45-a61d-413b-b5bd-fa0df62525db	Student Profile	student	Student profile	graduation-cap	t	7	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
91de98d1-ffef-4454-aebb-cc468fcd2e07	Doctor / Medical Profile	doctor	Doctor / medical profile	stethoscope	t	8	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
eea302ab-53b8-4359-8926-cefc97334c18	Teacher / Trainer Profile	teacher	Teacher / trainer profile	chalkboard	t	9	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
4dac30c7-b2d5-4525-9368-d5a51ce464e0	Personal / General Profile	personal	Personal / general profile	user	t	10	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
b78589e0-415a-496e-ad86-05c908eb3c24	Artist / Creator Profile	artist	Artist / creator profile	palette	t	11	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
653893c6-d8f2-4540-bf39-83d4b2c73065	NGO / Trust Profile	ngo	NGO / trust profile	hand-heart	t	12	2025-12-27 17:44:32.243512	2025-12-27 17:44:32.243512
\.


--
-- Data for Name: pro_profile_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pro_profile_values (id, profile_id, field_id, value, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pro_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pro_profiles (id, user_id, profile_type_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: property_deals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_deals (id, title, description, deal_type, property_type, price, area, area_unit, bedrooms, bathrooms, floors, road_access, facing_direction, images, documents, features, is_negotiable, ownership_type, country, state_province, city, area_name, full_address, location_id, agency_id, is_active, is_featured, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: rental_listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rental_listings (id, title, description, price, rental_type, bedrooms, bathrooms, area, furnishing_status, images, amenities, available_from, deposit_amount, country, state_province, city, area_name, full_address, location_id, agency_id, is_active, is_featured, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: saree_clothing_shopping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saree_clothing_shopping (id, title, description, listing_type, category, subcategory, product_type, brand, product_name, color, size, material, fabric_type, pattern, style, occasion, saree_type, saree_length, blouse_piece_included, blouse_piece_length, border_type, pallu_design, work_type, weave_type, transparency, fall_pico_done, gender, age_group, fit_type, sleeve_type, neck_type, length, waist_size, chest_size, shoulder_width, inseam, rise, clothing_type, is_set, set_includes, combo_pieces, dupatta_included, dupatta_length, dupatta_material, price, mrp, discount_percentage, rental_price_per_day, rental_price_per_week, rental_price_per_month, minimum_rental_period, rental_period_unit, security_deposit, condition, usage_duration, purchase_date, age_in_months, quality_grade, wear_count, is_original, handloom_certified, brand_authorized, certificate_available, authentication_proof, care_instructions, washing_instructions, dry_clean_only, iron_safe, machine_washable, hand_wash_only, fabric_care, in_stock, stock_quantity, sizes_available, colors_available, variant_options, ready_to_ship, made_to_order, customization_available, custom_sizing, personalization_options, tailoring_included, stitching_service_available, stitching_charges, alteration_charges, images, videos, size_chart, product_brochure, model_images, draping_video, key_features, fabric_features, special_features, included_items, box_contents, is_on_sale, sale_end_date, bank_offers, combo_offers, bulk_discount_available, minimum_order_quantity, wholesale_available, wholesale_price, return_policy, return_period_days, replacement_policy, exchange_available, refund_available, warranty_available, warranty_period, seller_id, seller_type, shop_name, boutique_name, designer_name, showroom_name, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, whatsapp_number, country, state_province, city, area_name, full_address, location_id, delivery_available, delivery_charges, free_delivery, free_delivery_above, same_day_delivery, express_delivery, delivery_areas, shipping_options, cod_available, estimated_delivery_days, occasion_suitable, season, collection_name, launch_year, limited_edition, handcrafted, handloom, made_in, origin_state, eco_friendly, sustainable_fashion, traditional_wear, fusion_wear, bridal_wear, party_wear, casual_wear, formal_wear, ethnic_wear, western_wear, rating, review_count, total_sales, is_active, is_featured, is_verified, availability_status, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: schools_colleges_coaching; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schools_colleges_coaching (id, title, description, listing_type, institution_category, institution_name, institution_type, affiliation, accreditation, establishment_year, board_affiliation, university_affiliation, courses_offered, exam_preparation_for, annual_tuition_fee, total_fee_per_year, scholarship_available, hostel_facility, transport_facility, library_available, computer_lab, contact_person, contact_phone, contact_email, country, state_province, city, area_name, full_address, is_active, is_featured, view_count, created_at, updated_at, user_id, role, images) FROM stdin;
\.


--
-- Data for Name: schools_colleges_coaching_institutes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schools_colleges_coaching_institutes (id, title, description, listing_type, institution_category, institution_name, institution_type, affiliation, accreditation, establishment_year, recognition_details, courses_offered, streams_available, specializations, medium_of_instruction, board_affiliation, university_affiliation, admission_process, admission_criteria, entrance_exam_required, entrance_exam_name, minimum_percentage_required, age_criteria, eligibility_criteria, admission_fee, annual_tuition_fee, course_fee, registration_fee, examination_fee, development_fee, other_fees, total_fee_per_year, fee_payment_mode, scholarship_available, scholarship_details, fee_concession_available, installment_facility, total_area, area_unit, number_of_classrooms, classroom_capacity, laboratory_facilities, library_available, library_books_count, computer_lab, number_of_computers, sports_facilities, playground_available, auditorium_available, auditorium_capacity, cafeteria_available, hostel_facility, hostel_capacity, transport_facility, medical_facility, wi_fi_available, smart_classrooms, total_faculty, phd_faculty, postgraduate_faculty, experienced_faculty, student_teacher_ratio, faculty_qualifications, guest_faculty_available, total_students, current_batch_strength, batch_size, student_capacity, co_education, pass_percentage, board_exam_results, university_exam_results, placement_percentage, average_package, highest_package, top_recruiters, awards_achievements, notable_alumni, coaching_subjects, exam_preparation_for, batch_timings, weekend_batches, online_classes_available, offline_classes_available, hybrid_mode, study_material_provided, mock_tests_provided, doubt_clearing_sessions, personal_mentoring, course_duration, ac_classrooms, cctv_surveillance, security_guard, biometric_attendance, parent_teacher_meetings, extra_curricular_activities, counseling_services, career_guidance, placement_assistance, internship_opportunities, working_hours, working_days, holiday_list, academic_calendar, principal_name, director_name, head_of_institution, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, whatsapp_number, website_url, country, state_province, city, area_name, full_address, landmark, pincode, location_id, prospectus_url, brochure_url, virtual_tour_url, video_url, images, documents, certifications, admission_policy, refund_policy, cancellation_policy, terms_and_conditions, rating, review_count, total_enrollments, availability_status, is_active, is_featured, is_verified, is_premium, owner_id, view_count, inquiry_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: second_hand_cars_bikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.second_hand_cars_bikes (id, title, description, listing_type, vehicle_type, brand, model, variant, year, price, kilometers_driven, fuel_type, transmission, owner_number, registration_number, registration_state, registration_year, insurance_type, insurance_valid_until, tax_validity, color, body_type, seating_capacity, engine_capacity, mileage_kmpl, images, documents, features, condition, accident_history, flood_affected, service_records_available, noc_available, is_negotiable, exchange_accepted, test_drive_available, country, state_province, city, area_name, full_address, location_id, seller_id, seller_type, contact_person, contact_phone, contact_email, is_active, is_featured, is_verified, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: second_hand_phones_tablets_accessories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.second_hand_phones_tablets_accessories (id, title, description, listing_type, category, subcategory, product_type, brand, model, variant, color, storage_capacity, ram, processor, screen_size, battery_capacity, camera_specs, operating_system, connectivity, display_type, refresh_rate, condition, usage_duration, purchase_date, purchase_year, age_in_months, price, original_price, negotiable, rental_price_per_day, rental_price_per_month, exchange_accepted, exchange_preferences, exchange_value_up_to, warranty_available, warranty_period, warranty_type, warranty_valid_until, bill_available, box_available, original_accessories, accessories_included, charger_included, screen_condition, body_condition, scratches_present, screen_guard, back_cover, functional_issues, repairs_done, battery_health, water_damage, imei_number, serial_number, fingerprint_sensor, face_unlock, dual_sim, expandable_memory, key_features, specifications, compatible_devices, accessory_type, material, accessory_condition, reason_for_selling, purchased_from, upgrade_purchase, images, videos, documents, seller_id, seller_type, shop_name, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_available, whatsapp_number, country, state_province, city, area_name, full_address, location_id, delivery_available, delivery_charges, pickup_available, shipping_options, cod_available, testing_allowed, testing_location, return_policy, return_period_days, refund_available, urgent_sale, price_drop, previous_owners, additional_info, seller_rating, seller_review_count, availability_status, is_active, is_featured, is_verified, is_urgent, view_count, inquiry_count, favorite_count, created_at, updated_at, sold_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: service_centre_warranty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_centre_warranty (id, title, description, service_type, centre_name, centre_type, authorized_brands, services_offered, product_categories, warranty_repair, out_of_warranty_repair, free_inspection, home_service, pickup_drop_service, same_day_service, emergency_service, genuine_parts_used, certified_technicians, warranty_period, inspection_charge, minimum_service_charge, home_service_charge, pickup_drop_charge, estimated_turnaround_time, spares_available, installation_service, annual_maintenance_contract, amc_price, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_number, website_url, working_hours, working_days, available_24_7, country, state_province, city, area_name, full_address, is_active, is_featured, view_count, created_at, updated_at, user_id, role, images) FROM stdin;
\.


--
-- Data for Name: showrooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.showrooms (id, title, description, showroom_name, authorized_brand, vehicle_type, vehicle_details, year, price, price_type, mileage, fuel_type, transmission, color, registration_number, registration_year, owner_count, warranty_available, warranty_details, service_history, certification_details, images, documents, features, is_certified, inspection_report, country, state_province, city, area_name, full_address, showroom_contact, showroom_email, location_id, seller_id, is_active, is_featured, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: skill_training_certification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skill_training_certification (id, title, description, training_category, skill_name, certification_type, training_provider, course_duration, course_fee, certification_fee, training_mode, placement_assistance, job_oriented, hands_on_training, industry_recognized, contact_person, contact_phone, contact_email, country, state_province, city, area_name, full_address, images, is_active, is_featured, created_at, updated_at, user_id, role, skill_category, training_type, skills_taught, institute_name, certification_body, certification_name, government_recognized, internationally_recognized, course_duration_days, course_duration_months, total_class_hours, online_mode, offline_mode, weekend_batches, practical_training, study_material_provided, internship_included, total_fee, registration_fee, exam_fee, installment_available, scholarship_available, placement_rate, career_opportunities, average_salary_package, view_count) FROM stdin;
\.


--
-- Data for Name: slider_card; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.slider_card (id, title, image_url, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sliders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sliders (id, title, description, image_url, link_url, button_text, sort_order, is_active, created_at, updated_at, page_type, category_id) FROM stdin;
\.


--
-- Data for Name: telecommunication_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telecommunication_services (id, title, description, service_type, company_name, provider_type, service_category, plan_name, monthly_price, yearly_price, installation_charges, security_deposit, broadband_speed, data_limit, unlimited_data, fiber_optic, dth_channels, hd_channels, ott_apps_included, mobile_network, calls_unlimited, sms_unlimited, roaming_available, validity, contract_period, free_installation, router_provided, static_ip, customer_support_24_7, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_number, website_url, country, state_province, city, area_name, full_address, service_areas, is_active, is_featured, view_count, created_at, updated_at, user_id, role, images) FROM stdin;
\.


--
-- Data for Name: transportation_moving_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transportation_moving_services (id, title, description, service_type, company_name, vehicle_type, vehicle_capacity, price_type, base_price, price_per_km, price_per_hour, minimum_charge, available_vehicles, crew_size, insurance_included, insurance_coverage, packing_service_available, packing_charges, loading_unloading_included, storage_available, storage_price_per_day, service_areas, operating_hours, advance_booking_required, minimum_booking_hours, same_day_service, country, state_province, city, area_name, full_address, service_radius_km, contact_person, contact_phone, contact_email, whatsapp_number, services_offered, special_items_handled, images, documents, terms_and_conditions, cancellation_policy, payment_methods, advance_payment_percentage, is_verified, is_active, is_featured, rating, review_count, completed_jobs, view_count, location_id, owner_id, created_at, updated_at, number_of_vehicles, vehicle_details, available_routes, packing_material_included, insurance_available, insurance_coverage_amount, available_24_7, working_hours, owner_name, license_number, registration_number, experience_years, alternate_phone, operating_cities, payment_terms, refund_policy, gps_tracking, helpers_available, number_of_helpers, helper_charges, total_bookings, availability_status, user_id, role) FROM stdin;
\.


--
-- Data for Name: tuition_private_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tuition_private_classes (id, title, description, listing_type, subject_category, subjects_offered, tutor_name, tutor_qualification, tutor_experience_years, teaching_mode, class_type, grade_level, min_grade, max_grade, board, fee_per_hour, fee_per_month, fee_per_subject, demo_class_available, study_material_provided, test_series_included, doubt_clearing_sessions, batch_size, individual_attention, flexible_timings, weekend_classes, home_tuition_available, online_classes_available, offline_classes_available, contact_person, contact_phone, contact_email, whatsapp_available, country, state_province, city, area_name, full_address, images, rating, review_count, is_active, is_featured, is_verified, view_count, created_at, updated_at, user_id, role, image_urls) FROM stdin;
\.


--
-- Data for Name: user_category_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_category_preferences (id, user_id, category_slug, subcategory_slugs, created_at) FROM stdin;
\.


--
-- Data for Name: user_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_documents (id, user_id, document_name, document_url, document_type, file_size, uploaded_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, first_name, last_name, phone, role, account_type, is_active, avatar, country, state, city, area, address, postal_code, created_at, updated_at, selected_services) FROM stdin;
c032e0a9-a4be-4f1d-bbe1-e63457f17787	admin	admin@gmail.com	123456	System	Administrator	\N	admin	super_admin	t	\N	\N	\N	\N	\N	\N	\N	2025-10-05 15:57:39.0097	2025-10-05 15:57:39.0097	[]
\.


--
-- Data for Name: vehicle_license_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_license_classes (id, title, description, license_class, vehicle_type, license_type, training_provider_name, is_rto_approved, rto_approval_number, instructor_name, instructor_experience_years, instructor_license_number, course_duration_days, course_duration_hours, training_mode, course_includes, syllabus_covered, course_fee, registration_fee, test_fee, total_fee, installment_available, discount_available, discount_percentage, minimum_age, educational_qualification, medical_certificate_required, documents_required, practical_training_hours, theory_classes_hours, simulation_training, driving_track_available, pickup_drop_facility, study_material_provided, online_test_practice, rto_test_assistance, training_vehicles, vehicle_condition, dual_control_vehicles, batch_size, current_batch_seats, next_batch_start_date, class_timings, weekend_batches, success_rate_percentage, total_students_trained, certification_provided, government_certified, country, state_province, city, area_name, full_address, training_center_address, multiple_locations, location_id, contact_person, contact_phone, contact_email, alternate_phone, whatsapp_number, website_url, images, documents, video_url, virtual_tour_url, job_placement_assistance, refresher_course_available, international_license_training, female_instructor_available, language_options, terms_and_conditions, cancellation_policy, refund_policy, rating, review_count, total_enrollments, availability_status, is_active, is_featured, is_verified, owner_id, view_count, created_at, updated_at, user_id, role) FROM stdin;
\.


--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.videos (id, title, description, video_url, thumbnail_url, duration_minutes, is_active, is_featured, created_at, updated_at, user_id) FROM stdin;
\.


--
-- Name: slider_card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.slider_card_id_seq', 5, true);


--
-- Name: academies_music_arts_sports academies_music_arts_sports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academies_music_arts_sports
    ADD CONSTRAINT academies_music_arts_sports_pkey PRIMARY KEY (id);


--
-- Name: admin_categories admin_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_categories
    ADD CONSTRAINT admin_categories_pkey PRIMARY KEY (id);


--
-- Name: admin_categories admin_categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_categories
    ADD CONSTRAINT admin_categories_slug_unique UNIQUE (slug);


--
-- Name: admin_subcategories admin_subcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_subcategories
    ADD CONSTRAINT admin_subcategories_pkey PRIMARY KEY (id);


--
-- Name: admin_subcategories admin_subcategories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_subcategories
    ADD CONSTRAINT admin_subcategories_slug_unique UNIQUE (slug);


--
-- Name: article_categories article_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_categories
    ADD CONSTRAINT article_categories_pkey PRIMARY KEY (id);


--
-- Name: article_categories article_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_categories
    ADD CONSTRAINT article_categories_slug_key UNIQUE (slug);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_slug_key UNIQUE (slug);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: car_bike_rentals car_bike_rentals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_bike_rentals
    ADD CONSTRAINT car_bike_rentals_pkey PRIMARY KEY (id);


--
-- Name: cars_bikes cars_bikes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars_bikes
    ADD CONSTRAINT cars_bikes_pkey PRIMARY KEY (id);


--
-- Name: commercial_properties commercial_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commercial_properties
    ADD CONSTRAINT commercial_properties_pkey PRIMARY KEY (id);


--
-- Name: computer_mobile_laptop_repair_services computer_mobile_laptop_repair_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.computer_mobile_laptop_repair_services
    ADD CONSTRAINT computer_mobile_laptop_repair_services_pkey PRIMARY KEY (id);


--
-- Name: construction_materials construction_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.construction_materials
    ADD CONSTRAINT construction_materials_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: cricket_sports_training cricket_sports_training_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cricket_sports_training
    ADD CONSTRAINT cricket_sports_training_pkey PRIMARY KEY (id);


--
-- Name: cyber_cafe_internet_services cyber_cafe_internet_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cyber_cafe_internet_services
    ADD CONSTRAINT cyber_cafe_internet_services_pkey PRIMARY KEY (id);


--
-- Name: dance_karate_gym_yoga_classes dance_karate_gym_yoga_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dance_karate_gym_yoga_classes
    ADD CONSTRAINT dance_karate_gym_yoga_classes_pkey PRIMARY KEY (id);


--
-- Name: dance_karate_gym_yoga dance_karate_gym_yoga_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dance_karate_gym_yoga
    ADD CONSTRAINT dance_karate_gym_yoga_pkey PRIMARY KEY (id);


--
-- Name: ebooks_online_courses ebooks_online_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ebooks_online_courses
    ADD CONSTRAINT ebooks_online_courses_pkey PRIMARY KEY (id);


--
-- Name: educational_consultancy_study_abroad educational_consultancy_study_abroad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educational_consultancy_study_abroad
    ADD CONSTRAINT educational_consultancy_study_abroad_pkey PRIMARY KEY (id);


--
-- Name: electronics_gadgets electronics_gadgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.electronics_gadgets
    ADD CONSTRAINT electronics_gadgets_pkey PRIMARY KEY (id);


--
-- Name: event_decoration_services event_decoration_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_decoration_services
    ADD CONSTRAINT event_decoration_services_pkey PRIMARY KEY (id);


--
-- Name: fashion_beauty_products fashion_beauty_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fashion_beauty_products
    ADD CONSTRAINT fashion_beauty_products_pkey PRIMARY KEY (id);


--
-- Name: furniture_interior_decor furniture_interior_decor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.furniture_interior_decor
    ADD CONSTRAINT furniture_interior_decor_pkey PRIMARY KEY (id);


--
-- Name: health_wellness_services health_wellness_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_wellness_services
    ADD CONSTRAINT health_wellness_services_pkey PRIMARY KEY (id);


--
-- Name: heavy_equipment heavy_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heavy_equipment
    ADD CONSTRAINT heavy_equipment_pkey PRIMARY KEY (id);


--
-- Name: hostel_listings hostel_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hostel_listings
    ADD CONSTRAINT hostel_listings_pkey PRIMARY KEY (id);


--
-- Name: household_services household_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household_services
    ADD CONSTRAINT household_services_pkey PRIMARY KEY (id);


--
-- Name: industrial_land industrial_land_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industrial_land
    ADD CONSTRAINT industrial_land_pkey PRIMARY KEY (id);


--
-- Name: industrial_properties industrial_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industrial_properties
    ADD CONSTRAINT industrial_properties_pkey PRIMARY KEY (id);


--
-- Name: jewelry_accessories jewelry_accessories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jewelry_accessories
    ADD CONSTRAINT jewelry_accessories_pkey PRIMARY KEY (id);


--
-- Name: language_classes language_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language_classes
    ADD CONSTRAINT language_classes_pkey PRIMARY KEY (id);


--
-- Name: music_arts_sports_academies music_arts_sports_academies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.music_arts_sports_academies
    ADD CONSTRAINT music_arts_sports_academies_pkey PRIMARY KEY (id);


--
-- Name: office_spaces office_spaces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.office_spaces
    ADD CONSTRAINT office_spaces_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_medical_stores pharmacy_medical_stores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_medical_stores
    ADD CONSTRAINT pharmacy_medical_stores_pkey PRIMARY KEY (id);


--
-- Name: phones_tablets_accessories phones_tablets_accessories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phones_tablets_accessories
    ADD CONSTRAINT phones_tablets_accessories_pkey PRIMARY KEY (id);


--
-- Name: pro_profile_fields pro_profile_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profile_fields
    ADD CONSTRAINT pro_profile_fields_pkey PRIMARY KEY (id);


--
-- Name: pro_profile_types pro_profile_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profile_types
    ADD CONSTRAINT pro_profile_types_pkey PRIMARY KEY (id);


--
-- Name: pro_profile_types pro_profile_types_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profile_types
    ADD CONSTRAINT pro_profile_types_slug_key UNIQUE (slug);


--
-- Name: pro_profile_values pro_profile_values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profile_values
    ADD CONSTRAINT pro_profile_values_pkey PRIMARY KEY (id);


--
-- Name: pro_profiles pro_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profiles
    ADD CONSTRAINT pro_profiles_pkey PRIMARY KEY (id);


--
-- Name: pro_profiles pro_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profiles
    ADD CONSTRAINT pro_profiles_user_id_key UNIQUE (user_id);


--
-- Name: property_deals property_deals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_deals
    ADD CONSTRAINT property_deals_pkey PRIMARY KEY (id);


--
-- Name: rental_listings rental_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_listings
    ADD CONSTRAINT rental_listings_pkey PRIMARY KEY (id);


--
-- Name: saree_clothing_shopping saree_clothing_shopping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saree_clothing_shopping
    ADD CONSTRAINT saree_clothing_shopping_pkey PRIMARY KEY (id);


--
-- Name: schools_colleges_coaching_institutes schools_colleges_coaching_institutes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools_colleges_coaching_institutes
    ADD CONSTRAINT schools_colleges_coaching_institutes_pkey PRIMARY KEY (id);


--
-- Name: schools_colleges_coaching schools_colleges_coaching_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools_colleges_coaching
    ADD CONSTRAINT schools_colleges_coaching_pkey PRIMARY KEY (id);


--
-- Name: second_hand_cars_bikes second_hand_cars_bikes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.second_hand_cars_bikes
    ADD CONSTRAINT second_hand_cars_bikes_pkey PRIMARY KEY (id);


--
-- Name: second_hand_phones_tablets_accessories second_hand_phones_tablets_accessories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.second_hand_phones_tablets_accessories
    ADD CONSTRAINT second_hand_phones_tablets_accessories_pkey PRIMARY KEY (id);


--
-- Name: service_centre_warranty service_centre_warranty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_centre_warranty
    ADD CONSTRAINT service_centre_warranty_pkey PRIMARY KEY (id);


--
-- Name: showrooms showrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showrooms
    ADD CONSTRAINT showrooms_pkey PRIMARY KEY (id);


--
-- Name: skill_training_certification skill_training_certification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_training_certification
    ADD CONSTRAINT skill_training_certification_pkey PRIMARY KEY (id);


--
-- Name: slider_card slider_card_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slider_card
    ADD CONSTRAINT slider_card_pkey PRIMARY KEY (id);


--
-- Name: sliders sliders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sliders
    ADD CONSTRAINT sliders_pkey PRIMARY KEY (id);


--
-- Name: telecommunication_services telecommunication_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telecommunication_services
    ADD CONSTRAINT telecommunication_services_pkey PRIMARY KEY (id);


--
-- Name: transportation_moving_services transportation_moving_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_moving_services
    ADD CONSTRAINT transportation_moving_services_pkey PRIMARY KEY (id);


--
-- Name: tuition_private_classes tuition_private_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tuition_private_classes
    ADD CONSTRAINT tuition_private_classes_pkey PRIMARY KEY (id);


--
-- Name: user_category_preferences user_category_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_category_preferences
    ADD CONSTRAINT user_category_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_documents user_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_documents
    ADD CONSTRAINT user_documents_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: vehicle_license_classes vehicle_license_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_license_classes
    ADD CONSTRAINT vehicle_license_classes_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: idx_academies_music_arts_sports_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_academies_music_arts_sports_city ON public.academies_music_arts_sports USING btree (city);


--
-- Name: idx_academies_music_arts_sports_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_academies_music_arts_sports_is_active ON public.academies_music_arts_sports USING btree (is_active);


--
-- Name: idx_academies_music_arts_sports_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_academies_music_arts_sports_is_featured ON public.academies_music_arts_sports USING btree (is_featured);


--
-- Name: idx_admin_categories_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_categories_active ON public.admin_categories USING btree (is_active);


--
-- Name: idx_admin_categories_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_categories_slug ON public.admin_categories USING btree (slug);


--
-- Name: idx_admin_subcategories_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_subcategories_active ON public.admin_subcategories USING btree (is_active);


--
-- Name: idx_admin_subcategories_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_subcategories_parent ON public.admin_subcategories USING btree (parent_category_id);


--
-- Name: idx_admin_subcategories_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_subcategories_slug ON public.admin_subcategories USING btree (slug);


--
-- Name: idx_car_bike_rentals_availability_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_availability_status ON public.car_bike_rentals USING btree (availability_status);


--
-- Name: idx_car_bike_rentals_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_brand ON public.car_bike_rentals USING btree (brand);


--
-- Name: idx_car_bike_rentals_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_city ON public.car_bike_rentals USING btree (city);


--
-- Name: idx_car_bike_rentals_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_created_at ON public.car_bike_rentals USING btree (created_at DESC);


--
-- Name: idx_car_bike_rentals_driver_available; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_driver_available ON public.car_bike_rentals USING btree (driver_available);


--
-- Name: idx_car_bike_rentals_fuel_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_fuel_type ON public.car_bike_rentals USING btree (fuel_type);


--
-- Name: idx_car_bike_rentals_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_is_active ON public.car_bike_rentals USING btree (is_active);


--
-- Name: idx_car_bike_rentals_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_is_featured ON public.car_bike_rentals USING btree (is_featured);


--
-- Name: idx_car_bike_rentals_model; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_model ON public.car_bike_rentals USING btree (model);


--
-- Name: idx_car_bike_rentals_pickup_delivery_available; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_pickup_delivery_available ON public.car_bike_rentals USING btree (pickup_delivery_available);


--
-- Name: idx_car_bike_rentals_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_rating ON public.car_bike_rentals USING btree (rating DESC);


--
-- Name: idx_car_bike_rentals_rental_price_per_day; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_rental_price_per_day ON public.car_bike_rentals USING btree (rental_price_per_day);


--
-- Name: idx_car_bike_rentals_rental_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_rental_type ON public.car_bike_rentals USING btree (rental_type);


--
-- Name: idx_car_bike_rentals_transmission; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_car_bike_rentals_transmission ON public.car_bike_rentals USING btree (transmission);


--
-- Name: idx_cars_bikes_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cars_bikes_brand ON public.cars_bikes USING btree (brand);


--
-- Name: idx_cars_bikes_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cars_bikes_city ON public.cars_bikes USING btree (city);


--
-- Name: idx_cars_bikes_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cars_bikes_created_at ON public.cars_bikes USING btree (created_at DESC);


--
-- Name: idx_cars_bikes_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cars_bikes_is_active ON public.cars_bikes USING btree (is_active);


--
-- Name: idx_cars_bikes_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cars_bikes_is_featured ON public.cars_bikes USING btree (is_featured);


--
-- Name: idx_cars_bikes_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cars_bikes_listing_type ON public.cars_bikes USING btree (listing_type);


--
-- Name: idx_cars_bikes_vehicle_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cars_bikes_vehicle_type ON public.cars_bikes USING btree (vehicle_type);


--
-- Name: idx_construction_materials_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_construction_materials_category ON public.construction_materials USING btree (category);


--
-- Name: idx_construction_materials_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_construction_materials_city ON public.construction_materials USING btree (city);


--
-- Name: idx_construction_materials_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_construction_materials_created_at ON public.construction_materials USING btree (created_at DESC);


--
-- Name: idx_construction_materials_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_construction_materials_is_active ON public.construction_materials USING btree (is_active);


--
-- Name: idx_construction_materials_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_construction_materials_is_featured ON public.construction_materials USING btree (is_featured);


--
-- Name: idx_construction_materials_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_construction_materials_location_id ON public.construction_materials USING btree (location_id);


--
-- Name: idx_construction_materials_stock_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_construction_materials_stock_status ON public.construction_materials USING btree (stock_status);


--
-- Name: idx_cricket_training_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cricket_training_category ON public.cricket_sports_training USING btree (training_category);


--
-- Name: idx_cricket_training_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cricket_training_city ON public.cricket_sports_training USING btree (city);


--
-- Name: idx_cricket_training_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cricket_training_is_active ON public.cricket_sports_training USING btree (is_active);


--
-- Name: idx_cricket_training_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cricket_training_is_featured ON public.cricket_sports_training USING btree (is_featured);


--
-- Name: idx_cricket_training_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cricket_training_level ON public.cricket_sports_training USING btree (training_level);


--
-- Name: idx_cricket_training_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cricket_training_listing_type ON public.cricket_sports_training USING btree (listing_type);


--
-- Name: idx_cyber_cafe_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cyber_cafe_city ON public.cyber_cafe_internet_services USING btree (city);


--
-- Name: idx_cyber_cafe_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cyber_cafe_is_active ON public.cyber_cafe_internet_services USING btree (is_active);


--
-- Name: idx_cyber_cafe_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cyber_cafe_is_featured ON public.cyber_cafe_internet_services USING btree (is_featured);


--
-- Name: idx_cyber_cafe_open_24_7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cyber_cafe_open_24_7 ON public.cyber_cafe_internet_services USING btree (open_24_7);


--
-- Name: idx_cyber_cafe_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cyber_cafe_owner_id ON public.cyber_cafe_internet_services USING btree (owner_id);


--
-- Name: idx_cyber_cafe_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cyber_cafe_rating ON public.cyber_cafe_internet_services USING btree (rating);


--
-- Name: idx_cyber_cafe_service_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cyber_cafe_service_type ON public.cyber_cafe_internet_services USING btree (service_type);


--
-- Name: idx_dance_karate_gym_yoga_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_dance_karate_gym_yoga_city ON public.dance_karate_gym_yoga USING btree (city);


--
-- Name: idx_dance_karate_gym_yoga_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_dance_karate_gym_yoga_is_active ON public.dance_karate_gym_yoga USING btree (is_active);


--
-- Name: idx_dance_karate_gym_yoga_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_dance_karate_gym_yoga_is_featured ON public.dance_karate_gym_yoga USING btree (is_featured);


--
-- Name: idx_ebooks_online_courses_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ebooks_online_courses_category ON public.ebooks_online_courses USING btree (category);


--
-- Name: idx_ebooks_online_courses_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ebooks_online_courses_city ON public.ebooks_online_courses USING btree (city);


--
-- Name: idx_ebooks_online_courses_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ebooks_online_courses_is_active ON public.ebooks_online_courses USING btree (is_active);


--
-- Name: idx_ebooks_online_courses_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ebooks_online_courses_is_featured ON public.ebooks_online_courses USING btree (is_featured);


--
-- Name: idx_ebooks_online_courses_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ebooks_online_courses_listing_type ON public.ebooks_online_courses USING btree (listing_type);


--
-- Name: idx_ebooks_online_courses_seller_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ebooks_online_courses_seller_id ON public.ebooks_online_courses USING btree (seller_id);


--
-- Name: idx_edu_consultancy_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_edu_consultancy_city ON public.educational_consultancy_study_abroad USING btree (city);


--
-- Name: idx_edu_consultancy_company_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_edu_consultancy_company_type ON public.educational_consultancy_study_abroad USING btree (company_type);


--
-- Name: idx_edu_consultancy_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_edu_consultancy_is_active ON public.educational_consultancy_study_abroad USING btree (is_active);


--
-- Name: idx_edu_consultancy_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_edu_consultancy_is_featured ON public.educational_consultancy_study_abroad USING btree (is_featured);


--
-- Name: idx_edu_consultancy_is_verified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_edu_consultancy_is_verified ON public.educational_consultancy_study_abroad USING btree (is_verified);


--
-- Name: idx_edu_consultancy_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_edu_consultancy_listing_type ON public.educational_consultancy_study_abroad USING btree (listing_type);


--
-- Name: idx_educational_consultancy_study_abroad_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_educational_consultancy_study_abroad_city ON public.educational_consultancy_study_abroad USING btree (city);


--
-- Name: idx_educational_consultancy_study_abroad_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_educational_consultancy_study_abroad_is_active ON public.educational_consultancy_study_abroad USING btree (is_active);


--
-- Name: idx_educational_consultancy_study_abroad_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_educational_consultancy_study_abroad_is_featured ON public.educational_consultancy_study_abroad USING btree (is_featured);


--
-- Name: idx_electronics_gadgets_availability_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_availability_status ON public.electronics_gadgets USING btree (availability_status);


--
-- Name: idx_electronics_gadgets_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_brand ON public.electronics_gadgets USING btree (brand);


--
-- Name: idx_electronics_gadgets_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_category ON public.electronics_gadgets USING btree (category);


--
-- Name: idx_electronics_gadgets_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_city ON public.electronics_gadgets USING btree (city);


--
-- Name: idx_electronics_gadgets_condition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_condition ON public.electronics_gadgets USING btree (condition);


--
-- Name: idx_electronics_gadgets_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_created_at ON public.electronics_gadgets USING btree (created_at DESC);


--
-- Name: idx_electronics_gadgets_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_is_active ON public.electronics_gadgets USING btree (is_active);


--
-- Name: idx_electronics_gadgets_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_is_featured ON public.electronics_gadgets USING btree (is_featured);


--
-- Name: idx_electronics_gadgets_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_listing_type ON public.electronics_gadgets USING btree (listing_type);


--
-- Name: idx_electronics_gadgets_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_electronics_gadgets_price ON public.electronics_gadgets USING btree (price);


--
-- Name: idx_event_decoration_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_decoration_city ON public.event_decoration_services USING btree (city);


--
-- Name: idx_event_decoration_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_decoration_created_at ON public.event_decoration_services USING btree (created_at DESC);


--
-- Name: idx_event_decoration_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_decoration_is_active ON public.event_decoration_services USING btree (is_active);


--
-- Name: idx_event_decoration_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_decoration_is_featured ON public.event_decoration_services USING btree (is_featured);


--
-- Name: idx_event_decoration_is_verified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_decoration_is_verified ON public.event_decoration_services USING btree (is_verified);


--
-- Name: idx_event_decoration_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_decoration_location_id ON public.event_decoration_services USING btree (location_id);


--
-- Name: idx_event_decoration_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_decoration_rating ON public.event_decoration_services USING btree (rating DESC);


--
-- Name: idx_event_decoration_service_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_decoration_service_type ON public.event_decoration_services USING btree (service_type);


--
-- Name: idx_event_decoration_venue_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_decoration_venue_type ON public.event_decoration_services USING btree (venue_type);


--
-- Name: idx_fashion_beauty_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_brand ON public.fashion_beauty_products USING btree (brand);


--
-- Name: idx_fashion_beauty_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_category ON public.fashion_beauty_products USING btree (category);


--
-- Name: idx_fashion_beauty_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_city ON public.fashion_beauty_products USING btree (city);


--
-- Name: idx_fashion_beauty_condition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_condition ON public.fashion_beauty_products USING btree (condition);


--
-- Name: idx_fashion_beauty_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_created_at ON public.fashion_beauty_products USING btree (created_at DESC);


--
-- Name: idx_fashion_beauty_gender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_gender ON public.fashion_beauty_products USING btree (gender);


--
-- Name: idx_fashion_beauty_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_is_active ON public.fashion_beauty_products USING btree (is_active);


--
-- Name: idx_fashion_beauty_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_is_featured ON public.fashion_beauty_products USING btree (is_featured);


--
-- Name: idx_fashion_beauty_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_listing_type ON public.fashion_beauty_products USING btree (listing_type);


--
-- Name: idx_fashion_beauty_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_price ON public.fashion_beauty_products USING btree (price);


--
-- Name: idx_fashion_beauty_seller_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_seller_id ON public.fashion_beauty_products USING btree (seller_id);


--
-- Name: idx_fashion_beauty_subcategory; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fashion_beauty_subcategory ON public.fashion_beauty_products USING btree (subcategory);


--
-- Name: idx_furniture_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_category ON public.furniture_interior_decor USING btree (category);


--
-- Name: idx_furniture_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_city ON public.furniture_interior_decor USING btree (city);


--
-- Name: idx_furniture_condition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_condition ON public.furniture_interior_decor USING btree (condition);


--
-- Name: idx_furniture_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_created_at ON public.furniture_interior_decor USING btree (created_at DESC);


--
-- Name: idx_furniture_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_is_active ON public.furniture_interior_decor USING btree (is_active);


--
-- Name: idx_furniture_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_is_featured ON public.furniture_interior_decor USING btree (is_featured);


--
-- Name: idx_furniture_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_listing_type ON public.furniture_interior_decor USING btree (listing_type);


--
-- Name: idx_furniture_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_location_id ON public.furniture_interior_decor USING btree (location_id);


--
-- Name: idx_furniture_seller_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_seller_id ON public.furniture_interior_decor USING btree (seller_id);


--
-- Name: idx_furniture_subcategory; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_furniture_subcategory ON public.furniture_interior_decor USING btree (subcategory);


--
-- Name: idx_heavy_equipment_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_heavy_equipment_category ON public.heavy_equipment USING btree (category);


--
-- Name: idx_heavy_equipment_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_heavy_equipment_city ON public.heavy_equipment USING btree (city);


--
-- Name: idx_heavy_equipment_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_heavy_equipment_created_at ON public.heavy_equipment USING btree (created_at DESC);


--
-- Name: idx_heavy_equipment_equipment_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_heavy_equipment_equipment_type ON public.heavy_equipment USING btree (equipment_type);


--
-- Name: idx_heavy_equipment_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_heavy_equipment_is_active ON public.heavy_equipment USING btree (is_active);


--
-- Name: idx_heavy_equipment_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_heavy_equipment_is_featured ON public.heavy_equipment USING btree (is_featured);


--
-- Name: idx_heavy_equipment_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_heavy_equipment_listing_type ON public.heavy_equipment USING btree (listing_type);


--
-- Name: idx_household_services_24_7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_services_24_7 ON public.household_services USING btree (available_24_7) WHERE (available_24_7 = true);


--
-- Name: idx_household_services_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_services_city ON public.household_services USING btree (city);


--
-- Name: idx_household_services_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_services_created_at ON public.household_services USING btree (created_at DESC);


--
-- Name: idx_household_services_emergency; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_services_emergency ON public.household_services USING btree (emergency_service) WHERE (emergency_service = true);


--
-- Name: idx_household_services_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_services_is_active ON public.household_services USING btree (is_active);


--
-- Name: idx_household_services_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_services_is_featured ON public.household_services USING btree (is_featured);


--
-- Name: idx_household_services_is_verified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_services_is_verified ON public.household_services USING btree (is_verified);


--
-- Name: idx_household_services_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_services_owner_id ON public.household_services USING btree (owner_id);


--
-- Name: idx_household_services_service_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_household_services_service_type ON public.household_services USING btree (service_type);


--
-- Name: idx_industrial_land_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industrial_land_city ON public.industrial_land USING btree (city);


--
-- Name: idx_industrial_land_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industrial_land_is_active ON public.industrial_land USING btree (is_active);


--
-- Name: idx_industrial_land_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industrial_land_is_featured ON public.industrial_land USING btree (is_featured);


--
-- Name: idx_industrial_properties_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industrial_properties_city ON public.industrial_properties USING btree (city);


--
-- Name: idx_industrial_properties_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industrial_properties_created_at ON public.industrial_properties USING btree (created_at DESC);


--
-- Name: idx_industrial_properties_industrial_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industrial_properties_industrial_type ON public.industrial_properties USING btree (industrial_type);


--
-- Name: idx_industrial_properties_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industrial_properties_is_active ON public.industrial_properties USING btree (is_active);


--
-- Name: idx_industrial_properties_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industrial_properties_is_featured ON public.industrial_properties USING btree (is_featured);


--
-- Name: idx_industrial_properties_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_industrial_properties_listing_type ON public.industrial_properties USING btree (listing_type);


--
-- Name: idx_jewelry_accessories_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jewelry_accessories_category ON public.jewelry_accessories USING btree (category);


--
-- Name: idx_jewelry_accessories_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jewelry_accessories_city ON public.jewelry_accessories USING btree (city);


--
-- Name: idx_jewelry_accessories_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jewelry_accessories_is_active ON public.jewelry_accessories USING btree (is_active);


--
-- Name: idx_jewelry_accessories_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jewelry_accessories_is_featured ON public.jewelry_accessories USING btree (is_featured);


--
-- Name: idx_jewelry_accessories_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jewelry_accessories_listing_type ON public.jewelry_accessories USING btree (listing_type);


--
-- Name: idx_language_classes_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_language_classes_city ON public.language_classes USING btree (city);


--
-- Name: idx_language_classes_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_language_classes_is_active ON public.language_classes USING btree (is_active);


--
-- Name: idx_language_classes_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_language_classes_is_featured ON public.language_classes USING btree (is_featured);


--
-- Name: idx_office_spaces_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_office_spaces_city ON public.office_spaces USING btree (city);


--
-- Name: idx_office_spaces_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_office_spaces_created_at ON public.office_spaces USING btree (created_at DESC);


--
-- Name: idx_office_spaces_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_office_spaces_is_active ON public.office_spaces USING btree (is_active);


--
-- Name: idx_office_spaces_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_office_spaces_is_featured ON public.office_spaces USING btree (is_featured);


--
-- Name: idx_office_spaces_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_office_spaces_listing_type ON public.office_spaces USING btree (listing_type);


--
-- Name: idx_office_spaces_office_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_office_spaces_office_type ON public.office_spaces USING btree (office_type);


--
-- Name: idx_phones_tablets_availability_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_availability_status ON public.phones_tablets_accessories USING btree (availability_status);


--
-- Name: idx_phones_tablets_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_brand ON public.phones_tablets_accessories USING btree (brand);


--
-- Name: idx_phones_tablets_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_category ON public.phones_tablets_accessories USING btree (category);


--
-- Name: idx_phones_tablets_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_city ON public.phones_tablets_accessories USING btree (city);


--
-- Name: idx_phones_tablets_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_created_at ON public.phones_tablets_accessories USING btree (created_at DESC);


--
-- Name: idx_phones_tablets_in_stock; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_in_stock ON public.phones_tablets_accessories USING btree (in_stock);


--
-- Name: idx_phones_tablets_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_is_active ON public.phones_tablets_accessories USING btree (is_active);


--
-- Name: idx_phones_tablets_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_is_featured ON public.phones_tablets_accessories USING btree (is_featured);


--
-- Name: idx_phones_tablets_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_listing_type ON public.phones_tablets_accessories USING btree (listing_type);


--
-- Name: idx_phones_tablets_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_phones_tablets_price ON public.phones_tablets_accessories USING btree (price);


--
-- Name: idx_pro_profile_fields_profile_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pro_profile_fields_profile_type ON public.pro_profile_fields USING btree (profile_type_id);


--
-- Name: idx_pro_profile_fields_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_pro_profile_fields_type_key ON public.pro_profile_fields USING btree (profile_type_id, key);


--
-- Name: idx_pro_profile_types_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pro_profile_types_active ON public.pro_profile_types USING btree (is_active);


--
-- Name: idx_pro_profile_types_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pro_profile_types_slug ON public.pro_profile_types USING btree (slug);


--
-- Name: idx_pro_profile_values_field; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pro_profile_values_field ON public.pro_profile_values USING btree (field_id);


--
-- Name: idx_pro_profile_values_profile; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pro_profile_values_profile ON public.pro_profile_values USING btree (profile_id);


--
-- Name: idx_pro_profile_values_profile_field; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_pro_profile_values_profile_field ON public.pro_profile_values USING btree (profile_id, field_id);


--
-- Name: idx_pro_profiles_profile_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pro_profiles_profile_type ON public.pro_profiles USING btree (profile_type_id);


--
-- Name: idx_pro_profiles_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pro_profiles_user ON public.pro_profiles USING btree (user_id);


--
-- Name: idx_property_deals_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_deals_city ON public.property_deals USING btree (city);


--
-- Name: idx_property_deals_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_deals_created_at ON public.property_deals USING btree (created_at DESC);


--
-- Name: idx_property_deals_deal_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_deals_deal_type ON public.property_deals USING btree (deal_type);


--
-- Name: idx_property_deals_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_deals_is_active ON public.property_deals USING btree (is_active);


--
-- Name: idx_property_deals_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_deals_is_featured ON public.property_deals USING btree (is_featured);


--
-- Name: idx_property_deals_property_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_deals_property_type ON public.property_deals USING btree (property_type);


--
-- Name: idx_rental_listings_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rental_listings_city ON public.rental_listings USING btree (city);


--
-- Name: idx_rental_listings_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rental_listings_created_at ON public.rental_listings USING btree (created_at DESC);


--
-- Name: idx_rental_listings_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rental_listings_is_active ON public.rental_listings USING btree (is_active);


--
-- Name: idx_rental_listings_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rental_listings_is_featured ON public.rental_listings USING btree (is_featured);


--
-- Name: idx_rental_listings_rental_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rental_listings_rental_type ON public.rental_listings USING btree (rental_type);


--
-- Name: idx_repair_services_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_repair_services_city ON public.computer_mobile_laptop_repair_services USING btree (city);


--
-- Name: idx_repair_services_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_repair_services_created_at ON public.computer_mobile_laptop_repair_services USING btree (created_at);


--
-- Name: idx_repair_services_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_repair_services_is_active ON public.computer_mobile_laptop_repair_services USING btree (is_active);


--
-- Name: idx_repair_services_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_repair_services_is_featured ON public.computer_mobile_laptop_repair_services USING btree (is_featured);


--
-- Name: idx_repair_services_service_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_repair_services_service_type ON public.computer_mobile_laptop_repair_services USING btree (service_type);


--
-- Name: idx_saree_clothing_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_brand ON public.saree_clothing_shopping USING btree (brand);


--
-- Name: idx_saree_clothing_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_category ON public.saree_clothing_shopping USING btree (category);


--
-- Name: idx_saree_clothing_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_city ON public.saree_clothing_shopping USING btree (city);


--
-- Name: idx_saree_clothing_condition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_condition ON public.saree_clothing_shopping USING btree (condition);


--
-- Name: idx_saree_clothing_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_created_at ON public.saree_clothing_shopping USING btree (created_at DESC);


--
-- Name: idx_saree_clothing_gender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_gender ON public.saree_clothing_shopping USING btree (gender);


--
-- Name: idx_saree_clothing_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_is_active ON public.saree_clothing_shopping USING btree (is_active);


--
-- Name: idx_saree_clothing_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_is_featured ON public.saree_clothing_shopping USING btree (is_featured);


--
-- Name: idx_saree_clothing_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_listing_type ON public.saree_clothing_shopping USING btree (listing_type);


--
-- Name: idx_saree_clothing_material; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_material ON public.saree_clothing_shopping USING btree (material);


--
-- Name: idx_saree_clothing_occasion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_occasion ON public.saree_clothing_shopping USING btree (occasion);


--
-- Name: idx_saree_clothing_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_price ON public.saree_clothing_shopping USING btree (price);


--
-- Name: idx_saree_clothing_saree_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_saree_type ON public.saree_clothing_shopping USING btree (saree_type);


--
-- Name: idx_saree_clothing_seller_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_seller_id ON public.saree_clothing_shopping USING btree (seller_id);


--
-- Name: idx_saree_clothing_subcategory; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_saree_clothing_subcategory ON public.saree_clothing_shopping USING btree (subcategory);


--
-- Name: idx_schools_colleges_coaching_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_colleges_coaching_city ON public.schools_colleges_coaching USING btree (city);


--
-- Name: idx_schools_colleges_coaching_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_colleges_coaching_is_active ON public.schools_colleges_coaching USING btree (is_active);


--
-- Name: idx_schools_colleges_coaching_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_colleges_coaching_is_featured ON public.schools_colleges_coaching USING btree (is_featured);


--
-- Name: idx_second_hand_cars_bikes_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_brand ON public.second_hand_cars_bikes USING btree (brand);


--
-- Name: idx_second_hand_cars_bikes_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_city ON public.second_hand_cars_bikes USING btree (city);


--
-- Name: idx_second_hand_cars_bikes_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_created_at ON public.second_hand_cars_bikes USING btree (created_at DESC);


--
-- Name: idx_second_hand_cars_bikes_fuel_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_fuel_type ON public.second_hand_cars_bikes USING btree (fuel_type);


--
-- Name: idx_second_hand_cars_bikes_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_is_active ON public.second_hand_cars_bikes USING btree (is_active);


--
-- Name: idx_second_hand_cars_bikes_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_is_featured ON public.second_hand_cars_bikes USING btree (is_featured);


--
-- Name: idx_second_hand_cars_bikes_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_listing_type ON public.second_hand_cars_bikes USING btree (listing_type);


--
-- Name: idx_second_hand_cars_bikes_model; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_model ON public.second_hand_cars_bikes USING btree (model);


--
-- Name: idx_second_hand_cars_bikes_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_price ON public.second_hand_cars_bikes USING btree (price);


--
-- Name: idx_second_hand_cars_bikes_seller_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_seller_type ON public.second_hand_cars_bikes USING btree (seller_type);


--
-- Name: idx_second_hand_cars_bikes_transmission; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_transmission ON public.second_hand_cars_bikes USING btree (transmission);


--
-- Name: idx_second_hand_cars_bikes_vehicle_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_vehicle_type ON public.second_hand_cars_bikes USING btree (vehicle_type);


--
-- Name: idx_second_hand_cars_bikes_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_cars_bikes_year ON public.second_hand_cars_bikes USING btree (year DESC);


--
-- Name: idx_second_hand_phones_availability_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_availability_status ON public.second_hand_phones_tablets_accessories USING btree (availability_status);


--
-- Name: idx_second_hand_phones_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_brand ON public.second_hand_phones_tablets_accessories USING btree (brand);


--
-- Name: idx_second_hand_phones_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_category ON public.second_hand_phones_tablets_accessories USING btree (category);


--
-- Name: idx_second_hand_phones_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_city ON public.second_hand_phones_tablets_accessories USING btree (city);


--
-- Name: idx_second_hand_phones_condition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_condition ON public.second_hand_phones_tablets_accessories USING btree (condition);


--
-- Name: idx_second_hand_phones_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_created_at ON public.second_hand_phones_tablets_accessories USING btree (created_at DESC);


--
-- Name: idx_second_hand_phones_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_is_active ON public.second_hand_phones_tablets_accessories USING btree (is_active);


--
-- Name: idx_second_hand_phones_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_is_featured ON public.second_hand_phones_tablets_accessories USING btree (is_featured);


--
-- Name: idx_second_hand_phones_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_listing_type ON public.second_hand_phones_tablets_accessories USING btree (listing_type);


--
-- Name: idx_second_hand_phones_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_second_hand_phones_price ON public.second_hand_phones_tablets_accessories USING btree (price);


--
-- Name: idx_showrooms_authorized_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_showrooms_authorized_brand ON public.showrooms USING btree (authorized_brand);


--
-- Name: idx_showrooms_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_showrooms_city ON public.showrooms USING btree (city);


--
-- Name: idx_showrooms_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_showrooms_created_at ON public.showrooms USING btree (created_at DESC);


--
-- Name: idx_showrooms_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_showrooms_is_active ON public.showrooms USING btree (is_active);


--
-- Name: idx_showrooms_is_certified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_showrooms_is_certified ON public.showrooms USING btree (is_certified);


--
-- Name: idx_showrooms_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_showrooms_is_featured ON public.showrooms USING btree (is_featured);


--
-- Name: idx_showrooms_showroom_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_showrooms_showroom_name ON public.showrooms USING btree (showroom_name);


--
-- Name: idx_showrooms_vehicle_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_showrooms_vehicle_type ON public.showrooms USING btree (vehicle_type);


--
-- Name: idx_skill_training_certification_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_skill_training_certification_city ON public.skill_training_certification USING btree (city);


--
-- Name: idx_skill_training_certification_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_skill_training_certification_is_active ON public.skill_training_certification USING btree (is_active);


--
-- Name: idx_skill_training_certification_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_skill_training_certification_is_featured ON public.skill_training_certification USING btree (is_featured);


--
-- Name: idx_transportation_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transportation_city ON public.transportation_moving_services USING btree (city);


--
-- Name: idx_transportation_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transportation_is_active ON public.transportation_moving_services USING btree (is_active);


--
-- Name: idx_transportation_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transportation_is_featured ON public.transportation_moving_services USING btree (is_featured);


--
-- Name: idx_transportation_is_verified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transportation_is_verified ON public.transportation_moving_services USING btree (is_verified);


--
-- Name: idx_transportation_service_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transportation_service_type ON public.transportation_moving_services USING btree (service_type);


--
-- Name: idx_tuition_private_classes_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tuition_private_classes_city ON public.tuition_private_classes USING btree (city);


--
-- Name: idx_tuition_private_classes_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tuition_private_classes_is_active ON public.tuition_private_classes USING btree (is_active);


--
-- Name: idx_tuition_private_classes_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tuition_private_classes_is_featured ON public.tuition_private_classes USING btree (is_featured);


--
-- Name: idx_user_category_preferences_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_category_preferences_user ON public.user_category_preferences USING btree (user_id);


--
-- Name: idx_user_documents_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_documents_user ON public.user_documents USING btree (user_id);


--
-- Name: idx_vehicle_license_classes_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_city ON public.vehicle_license_classes USING btree (city);


--
-- Name: idx_vehicle_license_classes_course_fee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_course_fee ON public.vehicle_license_classes USING btree (course_fee);


--
-- Name: idx_vehicle_license_classes_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_created_at ON public.vehicle_license_classes USING btree (created_at DESC);


--
-- Name: idx_vehicle_license_classes_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_is_active ON public.vehicle_license_classes USING btree (is_active);


--
-- Name: idx_vehicle_license_classes_is_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_is_featured ON public.vehicle_license_classes USING btree (is_featured);


--
-- Name: idx_vehicle_license_classes_is_rto_approved; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_is_rto_approved ON public.vehicle_license_classes USING btree (is_rto_approved);


--
-- Name: idx_vehicle_license_classes_license_class; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_license_class ON public.vehicle_license_classes USING btree (license_class);


--
-- Name: idx_vehicle_license_classes_license_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_license_type ON public.vehicle_license_classes USING btree (license_type);


--
-- Name: idx_vehicle_license_classes_owner; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_owner ON public.vehicle_license_classes USING btree (owner_id);


--
-- Name: idx_vehicle_license_classes_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_rating ON public.vehicle_license_classes USING btree (rating DESC);


--
-- Name: idx_vehicle_license_classes_training_mode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_training_mode ON public.vehicle_license_classes USING btree (training_mode);


--
-- Name: idx_vehicle_license_classes_vehicle_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_license_classes_vehicle_type ON public.vehicle_license_classes USING btree (vehicle_type);


--
-- Name: car_bike_rentals trigger_update_car_bike_rentals_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_car_bike_rentals_updated_at BEFORE UPDATE ON public.car_bike_rentals FOR EACH ROW EXECUTE FUNCTION public.update_car_bike_rentals_updated_at();


--
-- Name: cars_bikes trigger_update_cars_bikes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_cars_bikes_updated_at BEFORE UPDATE ON public.cars_bikes FOR EACH ROW EXECUTE FUNCTION public.update_cars_bikes_updated_at();


--
-- Name: commercial_properties trigger_update_commercial_properties_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_commercial_properties_updated_at BEFORE UPDATE ON public.commercial_properties FOR EACH ROW EXECUTE FUNCTION public.update_commercial_properties_updated_at();


--
-- Name: construction_materials trigger_update_construction_materials_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_construction_materials_updated_at BEFORE UPDATE ON public.construction_materials FOR EACH ROW EXECUTE FUNCTION public.update_construction_materials_updated_at();


--
-- Name: electronics_gadgets trigger_update_electronics_gadgets_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_electronics_gadgets_updated_at BEFORE UPDATE ON public.electronics_gadgets FOR EACH ROW EXECUTE FUNCTION public.update_electronics_gadgets_updated_at();


--
-- Name: furniture_interior_decor trigger_update_furniture_interior_decor_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_furniture_interior_decor_updated_at BEFORE UPDATE ON public.furniture_interior_decor FOR EACH ROW EXECUTE FUNCTION public.update_furniture_interior_decor_updated_at();


--
-- Name: heavy_equipment trigger_update_heavy_equipment_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_heavy_equipment_updated_at BEFORE UPDATE ON public.heavy_equipment FOR EACH ROW EXECUTE FUNCTION public.update_heavy_equipment_updated_at();


--
-- Name: industrial_properties trigger_update_industrial_properties_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_industrial_properties_updated_at BEFORE UPDATE ON public.industrial_properties FOR EACH ROW EXECUTE FUNCTION public.update_industrial_properties_updated_at();


--
-- Name: office_spaces trigger_update_office_spaces_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_office_spaces_updated_at BEFORE UPDATE ON public.office_spaces FOR EACH ROW EXECUTE FUNCTION public.update_office_spaces_updated_at();


--
-- Name: phones_tablets_accessories trigger_update_phones_tablets_accessories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_phones_tablets_accessories_updated_at BEFORE UPDATE ON public.phones_tablets_accessories FOR EACH ROW EXECUTE FUNCTION public.update_phones_tablets_accessories_updated_at();


--
-- Name: property_deals trigger_update_property_deals_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_property_deals_updated_at BEFORE UPDATE ON public.property_deals FOR EACH ROW EXECUTE FUNCTION public.update_property_deals_updated_at();


--
-- Name: rental_listings trigger_update_rental_listings_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_rental_listings_updated_at BEFORE UPDATE ON public.rental_listings FOR EACH ROW EXECUTE FUNCTION public.update_rental_listings_updated_at();


--
-- Name: second_hand_cars_bikes trigger_update_second_hand_cars_bikes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_second_hand_cars_bikes_updated_at BEFORE UPDATE ON public.second_hand_cars_bikes FOR EACH ROW EXECUTE FUNCTION public.update_second_hand_cars_bikes_updated_at();


--
-- Name: second_hand_phones_tablets_accessories trigger_update_second_hand_phones_tablets_accessories_updated_a; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_second_hand_phones_tablets_accessories_updated_a BEFORE UPDATE ON public.second_hand_phones_tablets_accessories FOR EACH ROW EXECUTE FUNCTION public.update_second_hand_phones_tablets_accessories_updated_at();


--
-- Name: showrooms trigger_update_showrooms_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_showrooms_updated_at BEFORE UPDATE ON public.showrooms FOR EACH ROW EXECUTE FUNCTION public.update_showrooms_updated_at();


--
-- Name: vehicle_license_classes trigger_update_vehicle_license_classes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_vehicle_license_classes_updated_at BEFORE UPDATE ON public.vehicle_license_classes FOR EACH ROW EXECUTE FUNCTION public.update_vehicle_license_classes_updated_at();


--
-- Name: academies_music_arts_sports update_academies_music_arts_sports_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_academies_music_arts_sports_updated_at BEFORE UPDATE ON public.academies_music_arts_sports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: admin_categories update_admin_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_admin_categories_updated_at BEFORE UPDATE ON public.admin_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: admin_subcategories update_admin_subcategories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_admin_subcategories_updated_at BEFORE UPDATE ON public.admin_subcategories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cars_bikes update_cars_bikes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_cars_bikes_updated_at BEFORE UPDATE ON public.cars_bikes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: dance_karate_gym_yoga update_dance_karate_gym_yoga_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_dance_karate_gym_yoga_updated_at BEFORE UPDATE ON public.dance_karate_gym_yoga FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ebooks_online_courses update_ebooks_online_courses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_ebooks_online_courses_updated_at BEFORE UPDATE ON public.ebooks_online_courses FOR EACH ROW EXECUTE FUNCTION public.update_ebooks_online_courses_updated_at();


--
-- Name: educational_consultancy_study_abroad update_educational_consultancy_study_abroad_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_educational_consultancy_study_abroad_updated_at BEFORE UPDATE ON public.educational_consultancy_study_abroad FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: industrial_land update_industrial_land_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_industrial_land_updated_at BEFORE UPDATE ON public.industrial_land FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: jewelry_accessories update_jewelry_accessories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_jewelry_accessories_updated_at BEFORE UPDATE ON public.jewelry_accessories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: language_classes update_language_classes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_language_classes_updated_at BEFORE UPDATE ON public.language_classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pro_profile_fields update_pro_profile_fields_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_pro_profile_fields_updated_at BEFORE UPDATE ON public.pro_profile_fields FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pro_profile_types update_pro_profile_types_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_pro_profile_types_updated_at BEFORE UPDATE ON public.pro_profile_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pro_profile_values update_pro_profile_values_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_pro_profile_values_updated_at BEFORE UPDATE ON public.pro_profile_values FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pro_profiles update_pro_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_pro_profiles_updated_at BEFORE UPDATE ON public.pro_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: schools_colleges_coaching update_schools_colleges_coaching_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_schools_colleges_coaching_updated_at BEFORE UPDATE ON public.schools_colleges_coaching FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: skill_training_certification update_skill_training_certification_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_skill_training_certification_updated_at BEFORE UPDATE ON public.skill_training_certification FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: transportation_moving_services update_transportation_moving_services_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_transportation_moving_services_updated_at BEFORE UPDATE ON public.transportation_moving_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tuition_private_classes update_tuition_private_classes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_tuition_private_classes_updated_at BEFORE UPDATE ON public.tuition_private_classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: academies_music_arts_sports academies_music_arts_sports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academies_music_arts_sports
    ADD CONSTRAINT academies_music_arts_sports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: admin_subcategories admin_subcategories_parent_category_id_admin_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_subcategories
    ADD CONSTRAINT admin_subcategories_parent_category_id_admin_categories_id_fk FOREIGN KEY (parent_category_id) REFERENCES public.admin_categories(id) ON DELETE CASCADE;


--
-- Name: article_categories article_categories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_categories
    ADD CONSTRAINT article_categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: articles articles_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: articles articles_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.article_categories(id) ON DELETE SET NULL;


--
-- Name: articles articles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: blog_posts blog_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: blog_posts blog_posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: car_bike_rentals car_bike_rentals_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_bike_rentals
    ADD CONSTRAINT car_bike_rentals_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: cars_bikes cars_bikes_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars_bikes
    ADD CONSTRAINT cars_bikes_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: cyber_cafe_internet_services cyber_cafe_internet_services_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cyber_cafe_internet_services
    ADD CONSTRAINT cyber_cafe_internet_services_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: dance_karate_gym_yoga dance_karate_gym_yoga_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dance_karate_gym_yoga
    ADD CONSTRAINT dance_karate_gym_yoga_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: ebooks_online_courses ebooks_online_courses_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ebooks_online_courses
    ADD CONSTRAINT ebooks_online_courses_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: educational_consultancy_study_abroad educational_consultancy_study_abroad_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educational_consultancy_study_abroad
    ADD CONSTRAINT educational_consultancy_study_abroad_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: electronics_gadgets electronics_gadgets_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.electronics_gadgets
    ADD CONSTRAINT electronics_gadgets_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: event_decoration_services event_decoration_services_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_decoration_services
    ADD CONSTRAINT event_decoration_services_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: fashion_beauty_products fashion_beauty_products_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fashion_beauty_products
    ADD CONSTRAINT fashion_beauty_products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: commercial_properties fk_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commercial_properties
    ADD CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: furniture_interior_decor furniture_interior_decor_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.furniture_interior_decor
    ADD CONSTRAINT furniture_interior_decor_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: health_wellness_services health_wellness_services_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_wellness_services
    ADD CONSTRAINT health_wellness_services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: heavy_equipment heavy_equipment_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heavy_equipment
    ADD CONSTRAINT heavy_equipment_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: hostel_listings hostel_listings_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hostel_listings
    ADD CONSTRAINT hostel_listings_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: household_services household_services_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.household_services
    ADD CONSTRAINT household_services_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: jewelry_accessories jewelry_accessories_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jewelry_accessories
    ADD CONSTRAINT jewelry_accessories_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: jewelry_accessories jewelry_accessories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jewelry_accessories
    ADD CONSTRAINT jewelry_accessories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: phones_tablets_accessories phones_tablets_accessories_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phones_tablets_accessories
    ADD CONSTRAINT phones_tablets_accessories_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: pro_profile_fields pro_profile_fields_profile_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profile_fields
    ADD CONSTRAINT pro_profile_fields_profile_type_id_fkey FOREIGN KEY (profile_type_id) REFERENCES public.pro_profile_types(id) ON DELETE CASCADE;


--
-- Name: pro_profile_values pro_profile_values_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profile_values
    ADD CONSTRAINT pro_profile_values_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.pro_profile_fields(id) ON DELETE CASCADE;


--
-- Name: pro_profile_values pro_profile_values_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profile_values
    ADD CONSTRAINT pro_profile_values_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.pro_profiles(id) ON DELETE CASCADE;


--
-- Name: pro_profiles pro_profiles_profile_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profiles
    ADD CONSTRAINT pro_profiles_profile_type_id_fkey FOREIGN KEY (profile_type_id) REFERENCES public.pro_profile_types(id) ON DELETE RESTRICT;


--
-- Name: pro_profiles pro_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pro_profiles
    ADD CONSTRAINT pro_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: saree_clothing_shopping saree_clothing_shopping_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saree_clothing_shopping
    ADD CONSTRAINT saree_clothing_shopping_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: schools_colleges_coaching_institutes schools_colleges_coaching_institutes_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools_colleges_coaching_institutes
    ADD CONSTRAINT schools_colleges_coaching_institutes_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: schools_colleges_coaching schools_colleges_coaching_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools_colleges_coaching
    ADD CONSTRAINT schools_colleges_coaching_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: second_hand_cars_bikes second_hand_cars_bikes_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.second_hand_cars_bikes
    ADD CONSTRAINT second_hand_cars_bikes_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: second_hand_phones_tablets_accessories second_hand_phones_tablets_accessories_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.second_hand_phones_tablets_accessories
    ADD CONSTRAINT second_hand_phones_tablets_accessories_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: service_centre_warranty service_centre_warranty_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_centre_warranty
    ADD CONSTRAINT service_centre_warranty_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: showrooms showrooms_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showrooms
    ADD CONSTRAINT showrooms_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sliders sliders_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sliders
    ADD CONSTRAINT sliders_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.admin_categories(id) ON DELETE SET NULL;


--
-- Name: telecommunication_services telecommunication_services_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telecommunication_services
    ADD CONSTRAINT telecommunication_services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_category_preferences user_category_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_category_preferences
    ADD CONSTRAINT user_category_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_documents user_documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_documents
    ADD CONSTRAINT user_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: vehicle_license_classes vehicle_license_classes_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_license_classes
    ADD CONSTRAINT vehicle_license_classes_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: videos videos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

