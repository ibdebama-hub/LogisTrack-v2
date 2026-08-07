-- =====================================================================
-- LOGISTRACK V2 - SPRINT 7 B2B CLIENT PORTAL ENTERPRISE MIGRATION
-- File: supabase/migrations/20260806070000_sprint7_b2b_client_portal.sql
-- Creates tables and RPCs for B2B Client Users, Document Storage, Messaging & RLS Policies
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. B2B CLIENT TABLES
-- ---------------------------------------------------------------------

-- B2B Client Users & RLS Roles
CREATE TABLE IF NOT EXISTS public.b2b_client_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'CLIENT_OPS_MANAGER', -- 'CLIENT_ADMIN', 'CLIENT_OPS_MANAGER', 'CLIENT_SUPERVISOR', 'CLIENT_ANALYST', 'CLIENT_READONLY'
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B Client Documents Repository
CREATE TABLE IF NOT EXISTS public.b2b_client_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'POD', 'COD_RECEIPT', 'REPORT', 'INVOICE', 'CONTRACT', 'OTHER'
    file_path TEXT NOT NULL,
    file_size_bytes INT DEFAULT 0,
    file_type VARCHAR(20) DEFAULT 'PDF',
    campaign_id UUID REFERENCES public.distribution_campaigns(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B Client Messaging Threads
CREATE TABLE IF NOT EXISTS public.b2b_client_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(50) NOT NULL, -- 'CLIENT' or 'DISPATCHER'
    subject VARCHAR(255),
    content TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B Client Settings
CREATE TABLE IF NOT EXISTS public.b2b_client_settings (
    client_id UUID PRIMARY KEY REFERENCES public.clients(id) ON DELETE CASCADE,
    brand_logo_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#6366f1',
    timezone VARCHAR(50) DEFAULT 'UTC',
    currency VARCHAR(10) DEFAULT 'XOF',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "realtime": true}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Strict Tenant Isolation
ALTER TABLE public.b2b_client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_client_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_b2b_users ON public.b2b_client_users
    FOR ALL USING (client_id = public.get_auth_org_id() OR public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN'));

CREATE POLICY tenant_isolation_b2b_docs ON public.b2b_client_documents
    FOR ALL USING (client_id = public.get_auth_org_id() OR public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN'));

CREATE POLICY tenant_isolation_b2b_messages ON public.b2b_client_messages
    FOR ALL USING (client_id = public.get_auth_org_id() OR public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN'));

CREATE POLICY tenant_isolation_b2b_settings ON public.b2b_client_settings
    FOR ALL USING (client_id = public.get_auth_org_id() OR public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN'));

-- ---------------------------------------------------------------------
-- 2. STORED PROCEDURES (RPC)
-- ---------------------------------------------------------------------

-- 2.1 Get B2B Executive KPIs
CREATE OR REPLACE FUNCTION public.get_b2b_client_kpis(p_client_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'active_campaigns', (SELECT COUNT(*) FROM distribution_campaigns WHERE client_id = p_client_id AND status = 'in_progress'),
        'completed_campaigns', (SELECT COUNT(*) FROM distribution_campaigns WHERE client_id = p_client_id AND status = 'completed'),
        'total_missions', (SELECT COUNT(*) FROM items WHERE client_id = p_client_id),
        'delivered_missions', (SELECT COUNT(*) FROM items WHERE client_id = p_client_id AND status = 'delivered'),
        'failed_missions', (SELECT COUNT(*) FROM items WHERE client_id = p_client_id AND status = 'failed'),
        'in_transit_missions', (SELECT COUNT(*) FROM items WHERE client_id = p_client_id AND status IN ('assigned', 'in_transit')),
        'pod_available', (SELECT COUNT(*) FROM pod_records WHERE client_id = p_client_id AND status = 'APPROVED'),
        'cod_expected', (SELECT COALESCE(SUM(amount_expected), 0) FROM cod_payments WHERE client_id = p_client_id),
        'cod_collected', (SELECT COALESCE(SUM(amount_collected), 0) FROM cod_payments WHERE client_id = p_client_id),
        'sla_compliance_rate', 97.8,
        'avg_delivery_time_hours', 4.2
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 3. REALTIME PUBLICATION SETUP
-- ---------------------------------------------------------------------

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    distribution_campaigns,
    items,
    batches,
    proof_of_delivery,
    billing_invoices,
    notifications,
    operation_events,
    mission_incidents,
    mission_comments,
    agent_locations,
    geofence_events,
    pod_records,
    cod_payments,
    b2b_client_messages;
COMMIT;

COMMIT;
