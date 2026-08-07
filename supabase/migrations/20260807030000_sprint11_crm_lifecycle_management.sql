-- =====================================================================
-- LOGISTRACK V2 - SPRINT 11 INTEGRATED COMMERCIAL CRM & LIFECYCLE MIGRATION
-- Tables, RLS Policies, Sales Pipeline & Contract Conversion Triggers
-- =====================================================================

-- 1. CRM LEADS TABLE
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    industry_sector VARCHAR(100) DEFAULT 'DISTRIBUTION_COURRIER',
    country VARCHAR(100) DEFAULT 'Côte d''Ivoire',
    city VARCHAR(100) DEFAULT 'Abidjan',
    address TEXT,
    website VARCHAR(255),
    company_size VARCHAR(50) DEFAULT 'MEDIUM', -- SMALL, MEDIUM, ENTERPRISE
    estimated_agents INT DEFAULT 10,
    estimated_monthly_missions INT DEFAULT 2000,
    estimated_annual_revenue NUMERIC(15, 2) DEFAULT 0,
    contact_name VARCHAR(255) NOT NULL,
    contact_job_title VARCHAR(100) DEFAULT 'Directeur Logistique',
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255) NOT NULL,
    acquisition_channel VARCHAR(50) DEFAULT 'WEBSITE_DEMO',
    stage VARCHAR(50) DEFAULT 'NEW',
    qualification_score INT DEFAULT 50,
    assigned_sales_rep VARCHAR(255) DEFAULT 'Yves (Directeur Commercial)',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins and sales reps manage crm leads"
    ON public.crm_leads FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'sales_director', 'sales_rep')
        )
    );

-- 2. CRM DEMOS TABLE
CREATE TABLE IF NOT EXISTS public.crm_demos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    mode VARCHAR(50) DEFAULT 'VIRTUAL', -- VIRTUAL, IN_PERSON
    sales_rep VARCHAR(255) NOT NULL,
    participants TEXT[],
    summary TEXT,
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crm_demos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sales team manages crm demos"
    ON public.crm_demos FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'sales_director', 'sales_rep')
        )
    );

-- 3. CRM PROPOSALS & QUOTES TABLE
CREATE TABLE IF NOT EXISTS public.crm_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    proposal_number VARCHAR(100) UNIQUE NOT NULL,
    plan_code VARCHAR(50) NOT NULL, -- STARTER, PROFESSIONAL, ENTERPRISE
    billing_cycle VARCHAR(50) DEFAULT 'MONTHLY',
    monthly_amount NUMERIC(15, 2) NOT NULL,
    annual_discount_pct INT DEFAULT 10,
    terms_conditions TEXT,
    status VARCHAR(50) DEFAULT 'SENT', -- DRAFT, SENT, ACCEPTED, REJECTED
    valid_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crm_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sales team manages proposals"
    ON public.crm_proposals FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'sales_director', 'sales_rep')
        )
    );

-- 4. CRM CONTRACTS TABLE
CREATE TABLE IF NOT EXISTS public.crm_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    plan_code VARCHAR(50) NOT NULL,
    annual_value NUMERIC(15, 2) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'SIGNED', -- DRAFT, SENT, SIGNED, EXPIRED, RENEWED
    auto_onboarded BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crm_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sales team manages contracts"
    ON public.crm_contracts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'sales_director', 'sales_rep')
        )
    );

-- 5. CRM INTERACTIONS LOG TABLE
CREATE TABLE IF NOT EXISTS public.crm_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- EMAIL, CALL, MEETING, WHATSAPP, SMS, NOTE
    summary TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sales team manages interactions"
    ON public.crm_interactions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'sales_director', 'sales_rep')
        )
    );

-- Indexes for Sales Pipeline Performance
CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON public.crm_leads(stage);
CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON public.crm_leads(contact_email);
CREATE INDEX IF NOT EXISTS idx_crm_demos_lead ON public.crm_demos(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_contracts_tenant ON public.crm_contracts(tenant_id);
