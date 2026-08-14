-- =====================================================================
-- LOGISTRACK V2 - SUPER ADMINISTRATOR (PLATFORM OWNER) INITIALIZATION & SEED
-- Safe, idempotent script to initialize or update the primary Super Admin
-- =====================================================================

DO $$
DECLARE
    super_admin_email TEXT := 'master.admin@logistrack.online';
    super_admin_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    master_org_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
    -- 1. Insert into public.organizations (schema.sql) if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organizations') THEN
        INSERT INTO public.organizations (id, name, slug, org_type, created_at)
        VALUES (
            master_org_id,
            'LogisTrack SaaS Master System',
            'logistrack-master-owner',
            'ENTERPRISE',
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- 2. Insert into public.organisations (production migration) if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organisations') THEN
        INSERT INTO public.organisations (id, code, name, slug, plan_tier, created_at)
        VALUES (
            master_org_id,
            'MASTER',
            'LogisTrack SaaS Master System',
            'logistrack-master-owner',
            'ENTERPRISE',
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- 3. Create entry in auth.users if not present
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        super_admin_id,
        'authenticated',
        'authenticated',
        super_admin_email,
        crypt('LogisTrack2026!MasterOwner#Admin', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Ibrahima Kassambara (Platform Owner)"}'::jsonb,
        true
    )
    ON CONFLICT (id) DO NOTHING;

    -- 4. Create or verify User Profile in public.profiles
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            role,
            organization_id,
            created_at
        )
        VALUES (
            super_admin_id,
            super_admin_email,
            'Ibrahima Kassambara (Platform Owner)',
            'super_admin',
            master_org_id,
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            role = 'super_admin';
    END IF;

    RAISE NOTICE 'Super Administrator account % validated and active.', super_admin_email;
END $$;
