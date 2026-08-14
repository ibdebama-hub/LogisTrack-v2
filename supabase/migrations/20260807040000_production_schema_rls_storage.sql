-- =====================================================================
-- LOGISTRACK V2 - FULL PRODUCTION ENTERPRISE SCHEMA, RLS & STORAGE MIGRATION
-- Database: Supabase PostgreSQL (Multi-Tenant Architecture)
-- Target Environment: Production
-- Author: LogisTrack V2 Platform Engineering
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('super_admin', 'client_admin', 'dispatcher', 'field_agent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mission_status_enum AS ENUM ('CREATED', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CORE MULTI-TENANT TABLES

-- ORGANISATIONS (TENANTS)
CREATE TABLE IF NOT EXISTS public.organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'STANDARD',
    max_dispatchers INT DEFAULT 5,
    max_agents INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organisations(id) ON DELETE CASCADE,
    client_id VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    role user_role_enum NOT NULL DEFAULT 'dispatcher',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    client_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    total_items INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MISSIONS (PLIS & LIVRAISONS)
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    address_raw TEXT NOT NULL,
    landmark_description TEXT,
    zone_code VARCHAR(50) DEFAULT 'UNASSIGNED',
    item_type VARCHAR(50) DEFAULT 'INVOICE',
    cod_amount NUMERIC(12,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'NO_PAYMENT_REQUIRED',
    status mission_status_enum DEFAULT 'CREATED',
    assigned_agent_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POD VERIFICATIONS (PREUVES DE LIVRAISON)
CREATE TABLE IF NOT EXISTS public.pod_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    signature_url TEXT NOT NULL,
    signature_hash VARCHAR(255) NOT NULL,
    signer_name VARCHAR(255) NOT NULL,
    gps_lat NUMERIC(10,8),
    gps_lng NUMERIC(11,8),
    photo_urls TEXT[],
    conformance_status VARCHAR(50) DEFAULT 'CONFORME',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COD COLLECTIONS (ENCAISSEMENTS)
CREATE TABLE IF NOT EXISTS public.cod_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES public.profiles(id),
    amount_collected NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'CASH',
    reconciliation_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUPABASE STORAGE BUCKETS INITIALIZATION
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('pod-signatures', 'pod-signatures', true),
    ('pod-photos', 'pod-photos', true),
    ('proposals-pdf', 'proposals-pdf', false),
    ('invoice-documents', 'invoice-documents', false)
ON CONFLICT (id) DO NOTHING;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pod_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cod_collections ENABLE ROW LEVEL SECURITY;

-- Helper function to extract user organization_id
CREATE OR REPLACE FUNCTION public.get_auth_user_org_id()
RETURNS UUID AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'super_admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- POLICIES FOR ORGANISATIONS
CREATE POLICY "Super admins full access to organisations"
    ON public.organisations FOR ALL
    USING (public.is_super_admin());

CREATE POLICY "Users can view own organisation"
    ON public.organisations FOR SELECT
    USING (id = public.get_auth_user_org_id());

-- POLICIES FOR MISSIONS
CREATE POLICY "Super admins full access to missions"
    ON public.missions FOR ALL
    USING (public.is_super_admin());

CREATE POLICY "Tenant isolation for missions"
    ON public.missions FOR ALL
    USING (organization_id = public.get_auth_user_org_id());

-- STORAGE POLICIES
CREATE POLICY "Public read for pod signatures"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'pod-signatures');

CREATE POLICY "Authenticated upload for pod signatures"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'pod-signatures' AND auth.role() = 'authenticated');

CREATE POLICY "Public read for pod photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'pod-photos');

CREATE POLICY "Authenticated upload for pod photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'pod-photos' AND auth.role() = 'authenticated');

-- 6. AUTOMATIC AUTH USER TO PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, organization_id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'organization_id')::uuid, '00000000-0000-0000-0000-000000000000'::uuid),
    COALESCE(new.raw_user_meta_data->>'full_name', 'Agent Logistrack'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'dispatcher')::text::public.user_role
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Fallback if user_role enum name varies
  INSERT INTO public.profiles (id, organization_id, full_name, email)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'organization_id')::uuid, '00000000-0000-0000-0000-000000000000'::uuid),
    COALESCE(new.raw_user_meta_data->>'full_name', 'Agent Logistrack'),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. INITIAL MASTER TENANT & SUPER ADMIN SEED DATA
INSERT INTO public.organisations (id, code, name, slug, plan_tier)
VALUES ('00000000-0000-0000-0000-000000000000', 'MASTER', 'LogisTrack SaaS Master System', 'master-system', 'ENTERPRISE_UNLIMITED')
ON CONFLICT (id) DO NOTHING;
