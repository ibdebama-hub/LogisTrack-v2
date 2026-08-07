-- =====================================================================
-- LOGISTRACK V2 - SPRINT 9C CLIENT ONBOARDING & IDENTITY MANAGEMENT MIGRATION
-- Tables, RLS Policies, Credentials & Connection Log Triggers
-- =====================================================================

-- 1. TENANT INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS public.tenant_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'dispatcher_admin',
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    temp_password_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, ACCEPTED, EXPIRED, CANCELLED
    expires_at TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ
);

-- RLS Enable & Policies for tenant_invitations
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage all tenant invitations"
    ON public.tenant_invitations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- 2. USER SECURITY PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.user_security_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'FORCE_PASSWORD_CHANGE', -- FORCE_PASSWORD_CHANGE, ACTIVE, LOCKED, DISABLED
    failed_login_attempts INT DEFAULT 0,
    must_change_password BOOLEAN DEFAULT TRUE,
    terms_accepted BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    last_password_change_at TIMESTAMPTZ,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_security_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own security profile"
    ON public.user_security_profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Super admins can manage all security profiles"
    ON public.user_security_profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- 3. USER LOGIN LOGS TABLE
CREATE TABLE IF NOT EXISTS public.user_login_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    tenant_name VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(50),
    country VARCHAR(100),
    status VARCHAR(50) NOT NULL, -- SUCCESS, FAILED_PASSWORD, ACCOUNT_LOCKED, EXPIRED_TEMP_PASSWORD
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view all login logs"
    ON public.user_login_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- 4. SECURITY POLICIES TABLE
CREATE TABLE IF NOT EXISTS public.security_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    min_password_length INT DEFAULT 16,
    require_uppercase BOOLEAN DEFAULT TRUE,
    require_lowercase BOOLEAN DEFAULT TRUE,
    require_numbers BOOLEAN DEFAULT TRUE,
    require_special_chars BOOLEAN DEFAULT TRUE,
    temp_password_validity_hours INT DEFAULT 48,
    max_login_attempts INT DEFAULT 5,
    lockout_duration_minutes INT DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.security_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage security policies"
    ON public.security_policies FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.tenant_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.tenant_invitations(email);
CREATE INDEX IF NOT EXISTS idx_login_logs_user ON public.user_login_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_logs_email ON public.user_login_logs(email, created_at DESC);
