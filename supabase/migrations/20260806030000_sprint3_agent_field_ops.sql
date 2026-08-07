-- =====================================================================
-- LOGISTRACK V2 - SPRINT 3 FIELD AGENT OPERATIONS & OFFLINE SYNC MIGRATION
-- File: supabase/migrations/20260806030000_sprint3_agent_field_ops.sql
-- Creates tables and RPCs for Agent GPS tracking, offline mutations & proof storage
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. AGENT LIVE GPS LOCATIONS TABLE
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.agent_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    speed_kmh DOUBLE PRECISION,
    battery_level INT,
    is_active BOOLEAN DEFAULT TRUE,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast spatial query
CREATE INDEX IF NOT EXISTS idx_agent_locations_agent_time 
ON public.agent_locations(agent_id, recorded_at DESC);

-- ---------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------

ALTER TABLE public.agent_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_members_agent_locations ON public.agent_locations
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

-- ---------------------------------------------------------------------
-- 3. STORED PROCEDURES (RPC)
-- ---------------------------------------------------------------------

-- 3.1 Update Agent Realtime GPS Location
CREATE OR REPLACE FUNCTION public.update_agent_gps_location(
    p_agent_id UUID,
    p_org_id UUID,
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION,
    p_speed DOUBLE PRECISION,
    p_battery INT
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO agent_locations (
        organization_id,
        agent_id,
        latitude,
        longitude,
        speed_kmh,
        battery_level,
        recorded_at
    ) VALUES (
        p_org_id,
        p_agent_id,
        p_lat,
        p_lng,
        p_speed,
        p_battery,
        NOW()
    );

    -- Update last position on agent profile if metadata column exists
    UPDATE profiles
    SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
        'last_lat', p_lat,
        'last_lng', p_lng,
        'last_gps_time', NOW()
    )
    WHERE id = p_agent_id AND organization_id = p_org_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- 3.2 Sync Offline Agent Mutation Payload
CREATE OR REPLACE FUNCTION public.sync_offline_agent_action(
    p_agent_id UUID,
    p_org_id UUID,
    p_action_type VARCHAR(50),
    p_payload JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_mission_id UUID;
    v_status VARCHAR(50);
BEGIN
    v_mission_id := (p_payload->>'mission_id')::UUID;
    v_status := p_payload->>'status';

    IF p_action_type = 'UPDATE_MISSION_STATUS' AND v_mission_id IS NOT NULL THEN
        UPDATE items
        SET status = v_status::item_status, updated_at = NOW()
        WHERE id = v_mission_id AND organization_id = p_org_id;

        INSERT INTO mission_history (
            mission_id,
            previous_status,
            new_status,
            user_name,
            action_title,
            comment
        ) VALUES (
            v_mission_id,
            'EN_COURS',
            v_status,
            COALESCE(p_payload->>'agent_name', 'Agent Terrain Mobile'),
            'Synchronisation Hors-Ligne (' || v_status || ')',
            'Action exécutée hors-ligne et synchronisée.'
        );
    END IF;

    RETURN jsonb_build_object('success', true, 'synced_at', NOW());
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
    mission_comments,
    agent_locations;
COMMIT;

COMMIT;
