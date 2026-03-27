BEGIN;





CREATE TABLE IF NOT EXISTS public.slider_card (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    image_url text NOT NULL,
    status character varying(32) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS public.slider_card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.slider_card_id_seq OWNED BY public.slider_card.id;

ALTER TABLE ONLY public.slider_card
    ALTER COLUMN id SET DEFAULT nextval('public.slider_card_id_seq'::regclass);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'slider_card_pkey'
          AND conrelid = 'public.slider_card'::regclass
    ) THEN
        ALTER TABLE ONLY public.slider_card
            ADD CONSTRAINT slider_card_pkey PRIMARY KEY (id);
    END IF;
END $$;

SELECT pg_catalog.setval('public.slider_card_id_seq', 5, true);

COMMIT;
