-- =====================================================================
-- LOGISTRACK V2 - SPRINT 2 MISSION LIFECYCLE & SUB-ENTITIES MIGRATION
-- File: supabase/migrations/20260806020000_sprint2_mission_lifecycle.sql
-- Creates tables for Mission History, Incidents, Documents & Comments
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. ENUM & TABLES DEFINITION
-- ---------------------------------------------------------------------

-- 1.1 Mission Audit History Log
CREATE TABLE IF NOT EXISTS public.mission_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    action_title VARCHAR(255) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Mission Incidents & Anomalies
CREATE TABLE IF NOT EXISTS public.mission_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    incident_type VARCHAR(50) NOT NULL, -- ADDRESS_NOT_FOUND, RECIPIENT_ABSENT, REFUSED_COD, etc.
    severity VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    reported_by_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, RESOLVED, CLOSED
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 1.3 Mission Documents & Attachments (Supabase Storage Metadata)
CREATE TABLE IF NOT EXISTS public.mission_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- INVOICE, MAIL, DELIVERY_NOTE, CONTRACT, PHOTO, JUSTIFICATIF
    file_size_bytes INT DEFAULT 0,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    uploaded_by_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 Mission Timestamped Signed Discussion Comments
CREATE TABLE IF NOT EXISTS public.mission_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    author_role VARCHAR(50) NOT NULL, -- DISPATCHER, SUPERVISOR, AGENT
    author_name VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

ALTER TABLE public.mission_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_members_mission_history ON public.mission_history
    FOR ALL USING (
        mission_id IN (SELECT id FROM items WHERE organization_id = public.get_auth_org_id()) OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

CREATE POLICY org_members_mission_incidents ON public.mission_incidents
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

CREATE POLICY org_members_mission_documents ON public.mission_documents
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

CREATE POLICY org_members_mission_comments ON public.mission_comments
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

-- ---------------------------------------------------------------------
-- 3. RPC STORED PROCEDURES
-- ---------------------------------------------------------------------

-- 3.1 Aggregated Mission KPIs
CREATE OR REPLACE FUNCTION public.get_missions_kpis(p_org_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id),
        'active', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status IN ('assigned', 'in_transit')),
        'completed', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'delivered'),
        'delayed', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND due_date < CURRENT_DATE AND status != 'delivered'),
        'failed', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'failed'),
        'suspended', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'returned')
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3.2 Transition Mission Status with Audit History
CREATE OR REPLACE FUNCTION public.transition_mission_status(
    p_mission_id UUID,
    p_org_id UUID,
    p_new_status VARCHAR(50),
    p_user_name VARCHAR(255),
    p_comment TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_old_status VARCHAR(50);
BEGIN
    SELECT status::text INTO v_old_status
    FROM items WHERE id = p_mission_id AND organization_id = p_org_id;

    IF FOUND THEN
        UPDATE items
        SET status = p_new_status::item_status, updated_at = NOW()
        WHERE id = p_mission_id AND organization_id = p_org_id;

        INSERT INTO mission_history (
            mission_id,
            previous_status,
            new_status,
            user_name,
            action_title,
            comment
        ) VALUES (
            p_mission_id,
            v_old_status,
            p_new_status,
            p_user_name,
            'Changement de Statut (' || p_new_status || ')',
            p_comment
        );

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
            'DISPATCH',
            'info',
            'Mission statut mis à jour : ' || p_new_status,
            COALESCE(p_comment, 'Changement de statut mission'),
            p_user_name,
            p_mission_id::text
        );

        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- 3.3 Report Mission Incident
CREATE OR REPLACE FUNCTION public.report_mission_incident(
    p_mission_id UUID,
    p_org_id UUID,
    p_incident_type VARCHAR(50),
    p_severity VARCHAR(20),
    p_description TEXT,
    p_reported_by VARCHAR(255)
)
RETURNS UUID AS $$
DECLARE
    v_incident_id UUID;
BEGIN
    INSERT INTO mission_incidents (
        mission_id,
        organization_id,
        incident_type,
        severity,
        reported_by_name,
        description,
        status
    ) VALUES (
        p_mission_id,
        p_org_id,
        p_incident_type,
        p_severity,
        p_reported_by,
        p_description,
        'OPEN'
    ) RETURNING id INTO v_incident_id;

    -- Notification event
    INSERT INTO notifications (
        organization_id,
        category,
        severity,
        title,
        message
    ) VALUES (
        p_org_id,
        'INCIDENT',
        CASE WHEN p_severity = 'CRITICAL' THEN 'CRITICAL' ELSE 'WARNING' END,
        'Incident déclaré sur Mission',
        'Incident ' || p_incident_type || ' déclaré par ' || p_reported_by
    );

    RETURN v_incident_id;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- 3.4 Add Mission Discussion Comment
CREATE OR REPLACE FUNCTION public.add_mission_comment(
    p_mission_id UUID,
    p_org_id UUID,
    p_author_role VARCHAR(50),
    p_author_name VARCHAR(255),
    p_comment_text TEXT
)
RETURNS UUID AS $$
DECLARE
    v_comment_id UUID;
BEGIN
    INSERT INTO mission_comments (
        mission_id,
        organization_id,
        author_role,
        author_name,
        comment_text
    ) VALUES (
        p_mission_id,
        p_org_id,
        p_author_role,
        p_author_name,
        p_comment_text
    ) RETURNING id INTO v_comment_id;

    RETURN v_comment_id;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 4. REALTIME PUBLICATION SETUP
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
    mission_comments;
COMMIT;

COMMIT;
