-- =====================================================================
-- LOGISTRACK V2 - SUPER ADMINISTRATOR (PLATFORM OWNER) INITIALIZATION & SEED
-- Safe, idempotent script to initialize or update the primary Super Admin
-- =====================================================================

DO $$
DECLARE
    super_admin_email TEXT := 'master.admin@logistrack.online';
    super_admin_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN
    -- 1. Ensure public.organizations contains the Master Tenant
    INSERT INTO public.organizations (id, name, slug, plan_type, status, created_at)
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        'LogisTrack SaaS Master System',
        'logistrack-master-owner',
        'ENTERPRISE',
        'ACTIVE',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET status = 'ACTIVE';

    -- 2. Create or verify User Profile in public.profiles
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        organization_id,
        status,
        created_at
    )
    VALUES (
        super_admin_id,
        super_admin_email,
        'Ibrahima Kassambara (Platform Owner)',
        'super_admin',
        '00000000-0000-0000-0000-000000000000',
        'ACTIVE',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'super_admin',
        status = 'ACTIVE';

    RAISE NOTICE 'Super Administrator account % validated and active.', super_admin_email;
END $$;
