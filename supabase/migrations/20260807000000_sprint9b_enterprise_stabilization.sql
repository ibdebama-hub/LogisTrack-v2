-- =====================================================================
-- LOGISTRACK V2 - SPRINT 9B ENTERPRISE STABILIZATION & OPTIMIZATION MIGRATION
-- Audit Logs, High-Performance Database Indexes & Consolidated RPCs
-- =====================================================================

-- 1. AUDIT LOGS TABLE FOR CRITICAL COMPLIANCE & SECURITY TRACKING
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enable & Policies for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view all audit logs"
    ON public.audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Org admins can view their organization audit logs"
    ON public.audit_logs FOR SELECT
    USING (
        tenant_id IN (
            SELECT organization_id FROM public.profiles
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 2. HIGH-PERFORMANCE DATABASE INDEXES FOR LARGE SCALE BATCH & ITEM OPERATIONS
CREATE INDEX IF NOT EXISTS idx_items_tracking_number ON public.items(tracking_number);
CREATE INDEX IF NOT EXISTS idx_items_status_agent ON public.items(status, assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_items_campaign_status ON public.items(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_items_organization ON public.items(organization_id);

CREATE INDEX IF NOT EXISTS idx_campaigns_client_status ON public.campaigns(client_id, status);
CREATE INDEX IF NOT EXISTS idx_batches_agent_status ON public.batches(assigned_agent_id, status);

CREATE INDEX IF NOT EXISTS idx_pod_item_status ON public.pod_verifications(item_id, verification_status);
CREATE INDEX IF NOT EXISTS idx_cod_item_status ON public.cod_transactions(item_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_action ON public.audit_logs(tenant_id, action_type, created_at DESC);

-- 3. OPTIMIZED ENTERPRISE RPC FOR INSTANT KPI AGGREGATION
CREATE OR REPLACE FUNCTION get_enterprise_kpi_summary(p_org_id UUID)
RETURNS TABLE (
    total_campaigns BIGINT,
    total_items BIGINT,
    delivered_items BIGINT,
    failed_items BIGINT,
    pending_items BIGINT,
    total_cod_collected NUMERIC,
    sla_compliance_rate NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT c.id) AS total_campaigns,
        COUNT(i.id) AS total_items,
        COUNT(i.id) FILTER (WHERE i.status = 'delivered') AS delivered_items,
        COUNT(i.id) FILTER (WHERE i.status = 'failed') AS failed_items,
        COUNT(i.id) FILTER (WHERE i.status IN ('pending', 'batched', 'assigned', 'in_transit')) AS pending_items,
        COALESCE(SUM(ct.amount_collected) FILTER (WHERE ct.status = 'reconciled_with_finance'), 0) AS total_cod_collected,
        CASE 
            WHEN COUNT(i.id) FILTER (WHERE i.status = 'delivered') > 0 THEN
                ROUND(
                    (COUNT(i.id) FILTER (WHERE i.status = 'delivered')::NUMERIC / 
                     NULLIF(COUNT(i.id) FILTER (WHERE i.status IN ('delivered', 'failed')), 0)::NUMERIC) * 100, 
                    2
                )
            ELSE 100.00
        END AS sla_compliance_rate
    FROM public.organizations o
    LEFT JOIN public.campaigns c ON c.organization_id = o.id
    LEFT JOIN public.items i ON i.campaign_id = c.id
    LEFT JOIN public.cod_transactions ct ON ct.item_id = i.id
    WHERE o.id = p_org_id
    GROUP BY o.id;
END;
$$;
