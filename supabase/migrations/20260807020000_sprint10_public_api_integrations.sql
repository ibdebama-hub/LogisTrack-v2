-- =====================================================================
-- LOGISTRACK V2 - SPRINT 10 PUBLIC API & ENTERPRISE INTEGRATIONS MIGRATION
-- Tables, RLS Policies, Webhooks, API Audit Logs & Automation Rules
-- =====================================================================

-- 1. API KEYS TABLE
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    scopes TEXT[] DEFAULT ARRAY['missions:read', 'pod:read'],
    rate_limit_per_minute INT DEFAULT 300,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins and tenant admins manage api keys"
    ON public.api_keys FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'super_admin' OR profiles.organization_id = api_keys.tenant_id)
        )
    );

-- 2. API AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.api_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    status_code INT NOT NULL,
    response_time_ms INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload_size_bytes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins view all api audit logs"
    ON public.api_audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- 3. WEBHOOK SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.webhook_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    subscribed_events TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    retry_count INT DEFAULT 3,
    failure_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.webhook_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage webhooks"
    ON public.webhook_subscriptions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'super_admin' OR profiles.organization_id = webhook_subscriptions.tenant_id)
        )
    );

-- 4. WEBHOOK DELIVERIES TABLE
CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES public.webhook_subscriptions(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    http_status INT,
    response_body TEXT,
    attempt_number INT DEFAULT 1,
    success BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view webhook deliveries"
    ON public.webhook_deliveries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.webhook_subscriptions s
            JOIN public.profiles p ON p.id = auth.uid()
            WHERE s.id = webhook_deliveries.subscription_id
            AND (p.role = 'super_admin' OR p.organization_id = s.tenant_id)
        )
    );

-- 5. INTEGRATION CONNECTORS TABLE
CREATE TABLE IF NOT EXISTS public.integration_connectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    connector_type VARCHAR(50) NOT NULL, -- SAP, ORACLE, ODOO, SALESFORCE, SHOPIFY, CUSTOM_REST
    base_url TEXT,
    auth_config JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'INACTIVE', -- ACTIVE, INACTIVE, ERROR
    sync_frequency_minutes INT DEFAULT 15,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.integration_connectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage connectors"
    ON public.integration_connectors FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'super_admin' OR profiles.organization_id = integration_connectors.tenant_id)
        )
    );

-- 6. AUTOMATION RULES TABLE
CREATE TABLE IF NOT EXISTS public.automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    trigger_event VARCHAR(100) NOT NULL,
    condition_json JSONB DEFAULT '{}'::jsonb,
    action_type VARCHAR(100) NOT NULL,
    action_payload JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    execution_count INT DEFAULT 0,
    last_triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage automation rules"
    ON public.automation_rules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'super_admin' OR profiles.organization_id = automation_rules.tenant_id)
        )
    );

-- Indexes for API & Webhook Performance
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant ON public.api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_audit_tenant_time ON public.api_audit_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_subs_tenant ON public.webhook_subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliv_sub ON public.webhook_deliveries(subscription_id, delivered_at DESC);
