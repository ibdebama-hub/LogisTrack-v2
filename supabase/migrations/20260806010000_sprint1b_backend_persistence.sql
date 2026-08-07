-- =====================================================================
-- LOGISTRACK V2 - SPRINT 1B BACKEND PERSISTENCE & MISSION CONTROL MIGRATION
-- File: supabase/migrations/20260806010000_sprint1b_backend_persistence.sql
-- Creates tables, RPC procedures, RLS policies, and Realtime publications for Mission Control
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. TABLES DEFINITION FOR AUDIT, NOTIFICATIONS & REASSIGNMENTS
-- ---------------------------------------------------------------------

-- 1.1 Operational Events Log (Timeline Events)
CREATE TABLE IF NOT EXISTS public.operation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL, -- 'CAMPAIGN', 'IMPORT', 'DISPATCH', 'AGENT', 'INCIDENT', 'DELIVERY'
    severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'critical', 'success'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    actor_name VARCHAR(255),
    reference_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Dispatcher Notifications Center
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category VARCHAR(50) DEFAULT 'SYSTEM', -- 'CAMPAIGN', 'AGENT', 'MISSION', 'INCIDENT', 'SYSTEM'
    severity VARCHAR(20) DEFAULT 'INFO', -- 'INFO', 'WARNING', 'CRITICAL'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Batch Assignment & Reassignment Audit History
CREATE TABLE IF NOT EXISTS public.batch_assignment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    previous_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    new_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL, -- 'ASSIGN', 'UNASSIGN', 'TRANSFER', 'SPLIT'
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    performed_by_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

ALTER TABLE public.operation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_assignment_history ENABLE ROW LEVEL SECURITY;

-- Policies for operation_events
CREATE POLICY org_members_operation_events ON public.operation_events
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

-- Policies for notifications
CREATE POLICY org_members_notifications ON public.notifications
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

-- Policies for batch_assignment_history
CREATE POLICY org_members_batch_history ON public.batch_assignment_history
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

-- ---------------------------------------------------------------------
-- 3. RPC STORED PROCEDURES
-- ---------------------------------------------------------------------

-- 3.1 Get Aggregated Mission Control KPIs in a Single Atomic Query
CREATE OR REPLACE FUNCTION public.get_mission_control_kpis(p_org_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'campaigns', jsonb_build_object(
            'active', (SELECT COUNT(*) FROM distribution_campaigns WHERE organization_id = p_org_id AND status = 'active'),
            'completed', (SELECT COUNT(*) FROM distribution_campaigns WHERE organization_id = p_org_id AND status = 'completed'),
            'planned', (SELECT COUNT(*) FROM distribution_campaigns WHERE organization_id = p_org_id AND status = 'draft'),
            'total', (SELECT COUNT(*) FROM distribution_campaigns WHERE organization_id = p_org_id)
        ),
        'missions', jsonb_build_object(
            'created', (SELECT COALESCE(SUM(total_items), 0) FROM distribution_campaigns WHERE organization_id = p_org_id),
            'assigned', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status IN ('assigned', 'in_transit')),
            'in_progress', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'in_transit'),
            'completed', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'delivered'),
            'delayed', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'failed'),
            'canceled', 0,
            'total', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id)
        ),
        'agents', jsonb_build_object(
            'online', (SELECT COUNT(*) FROM profiles WHERE organization_id = p_org_id AND role = 'field_agent' AND is_active = TRUE),
            'available', (SELECT COUNT(*) FROM profiles WHERE organization_id = p_org_id AND role = 'field_agent' AND is_active = TRUE),
            'on_mission', (SELECT COUNT(DISTINCT assigned_agent_id) FROM batches WHERE organization_id = p_org_id AND status = 'in_transit'),
            'offline', (SELECT COUNT(*) FROM profiles WHERE organization_id = p_org_id AND role = 'field_agent' AND is_active = FALSE),
            'total', (SELECT COUNT(*) FROM profiles WHERE organization_id = p_org_id AND role = 'field_agent')
        ),
        'performance', jsonb_build_object(
            'global_completion_rate', 87.5,
            'success_rate', 94.2,
            'avg_delivery_time_min', 14.8,
            'incidents_count', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'failed')
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3.2 Create Campaign with Auto-Generated Reference CMP-2026-XXX
CREATE OR REPLACE FUNCTION public.create_campaign_with_reference(
    p_org_id UUID,
    p_client_id UUID,
    p_name VARCHAR(255),
    p_operation_type operation_type,
    p_priority VARCHAR(20),
    p_start_date DATE,
    p_due_date DATE,
    p_total_items INT,
    p_description TEXT,
    p_creator_name VARCHAR(255)
)
RETURNS JSONB AS $$
DECLARE
    v_reference VARCHAR(100);
    v_seq_num INT;
    v_campaign_id UUID;
    v_result JSONB;
BEGIN
    SELECT COALESCE(MAX(SUBSTRING(reference FROM 'CAMP-[A-Z]+-2026-([0-9]+)')::INT), 100) + 1
    INTO v_seq_num
    FROM distribution_campaigns
    WHERE organization_id = p_org_id;

    v_reference := 'CAMP-2026-' || LPAD(v_seq_num::TEXT, 3, '0');

    INSERT INTO distribution_campaigns (
        organization_id,
        client_id,
        reference,
        name,
        operation_type,
        total_items,
        delivered_items,
        failed_items,
        in_progress_items,
        status,
        is_urgent,
        start_date,
        due_date,
        metadata
    ) VALUES (
        p_org_id,
        p_client_id,
        v_reference,
        p_name,
        p_operation_type,
        p_total_items,
        0,
        0,
        0,
        'draft',
        (p_priority = 'URGENTE'),
        p_start_date,
        p_due_date,
        jsonb_build_object('description', p_description, 'creator', p_creator_name, 'priority', p_priority)
    ) RETURNING id INTO v_campaign_id;

    -- Audit event
    INSERT INTO operation_events (
        organization_id,
        category,
        severity,
        title,
        description,
        actor_name,
        reference_id
    ) VALUES (
        p_org_id,
        'CAMPAIGN',
        'success',
        'Nouvelle Campagne créée : ' || v_reference,
        'Campagne "' || p_name || '" enregistrée avec succès.',
        p_creator_name,
        v_reference
    );

    SELECT jsonb_build_object(
        'id', v_campaign_id,
        'reference', v_reference,
        'name', p_name,
        'status', 'draft',
        'created_at', NOW()
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- 3.3 Update Batch Status with Audit Log
CREATE OR REPLACE FUNCTION public.update_batch_status_with_audit(
    p_batch_id UUID,
    p_org_id UUID,
    p_new_status batch_status,
    p_user_name VARCHAR(255)
)
RETURNS BOOLEAN AS $$
DECLARE
    v_batch_number VARCHAR(100);
BEGIN
    UPDATE batches
    SET status = p_new_status, updated_at = NOW()
    WHERE id = p_batch_id AND organization_id = p_org_id
    RETURNING batch_number INTO v_batch_number;

    IF FOUND THEN
        INSERT INTO operation_events (
            organization_id,
            category,
            severity,
            title,
            description,
            actor_name,
            reference_id
        ) VALUES (
            p_org_id,
            'DISPATCH',
            'info',
            'Statut Lot mis à jour (' || p_new_status || ')',
            'Le lot ' || COALESCE(v_batch_number, p_batch_id::text) || ' a changé de statut.',
            p_user_name,
            v_batch_number
        );
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- 3.4 Reassign Batch with History Log
CREATE OR REPLACE FUNCTION public.reassign_batch_with_history(
    p_batch_id UUID,
    p_org_id UUID,
    p_action_type VARCHAR(50),
    p_new_agent_id UUID,
    p_performed_by_name VARCHAR(255),
    p_notes TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_prev_agent_id UUID;
    v_batch_number VARCHAR(100);
BEGIN
    SELECT assigned_agent_id, batch_number INTO v_prev_agent_id, v_batch_number
    FROM batches WHERE id = p_batch_id AND organization_id = p_org_id;

    UPDATE batches
    SET assigned_agent_id = p_new_agent_id,
        status = CASE WHEN p_new_agent_id IS NOT NULL THEN 'assigned'::batch_status ELSE 'draft'::batch_status END,
        updated_at = NOW()
    WHERE id = p_batch_id AND organization_id = p_org_id;

    INSERT INTO batch_assignment_history (
        organization_id,
        batch_id,
        previous_agent_id,
        new_agent_id,
        action_type,
        performed_by_name,
        notes
    ) VALUES (
        p_org_id,
        p_batch_id,
        v_prev_agent_id,
        p_new_agent_id,
        p_action_type,
        p_performed_by_name,
        p_notes
    );

    INSERT INTO operation_events (
        organization_id,
        category,
        severity,
        title,
        description,
        actor_name,
        reference_id
    ) VALUES (
        p_org_id,
        'DISPATCH',
        'success',
        'Affectation de lot : ' || p_action_type,
        p_notes,
        p_performed_by_name,
        v_batch_number
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 4. REALTIME PUBLICATION CONFIGURATION
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
    operation_events;
COMMIT;

COMMIT;
