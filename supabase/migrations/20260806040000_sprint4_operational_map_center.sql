-- =====================================================================
-- LOGISTRACK V2 - SPRINT 4 OPERATIONAL MAP CENTER & GEOFENCING MIGRATION
-- File: supabase/migrations/20260806040000_sprint4_operational_map_center.sql
-- Creates tables and RPCs for Geofencing, Heatmap aggregations & Replay Trails
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. GEOFENCE ZONES & EVENTS TABLES
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.geofence_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    color VARCHAR(20) DEFAULT '#6366f1',
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    radius_meters INT DEFAULT 2000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.geofence_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES public.geofence_zones(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type VARCHAR(20) NOT NULL, -- 'ENTER' or 'EXIT'
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.geofence_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_members_geofence_zones ON public.geofence_zones
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

CREATE POLICY org_members_geofence_events ON public.geofence_events
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

-- ---------------------------------------------------------------------
-- 2. STORED PROCEDURES (RPC)
-- ---------------------------------------------------------------------

-- 2.1 Get Single Payload for Operational Map Supervision Center
CREATE OR REPLACE FUNCTION public.get_map_supervision_data(p_org_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'agents_count', (SELECT COUNT(*) FROM profiles WHERE organization_id = p_org_id AND role = 'field_agent'),
        'online_agents', (SELECT COUNT(*) FROM profiles WHERE organization_id = p_org_id AND role = 'field_agent' AND is_active = TRUE),
        'active_missions', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status IN ('assigned', 'in_transit')),
        'incidents_count', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'failed')
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2.2 Get Agent Replay Trail Points for a Specific Date
CREATE OR REPLACE FUNCTION public.get_agent_replay_trail(
    p_agent_id UUID,
    p_date DATE
)
RETURNS JSONB AS $$
DECLARE
    v_trail JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', id,
            'lat', latitude,
            'lng', longitude,
            'speed', speed_kmh,
            'battery', battery_level,
            'timestamp', to_char(recorded_at, 'HH24:MI:SS')
        ) ORDER BY recorded_at ASC
    )
    INTO v_trail
    FROM agent_locations
    WHERE agent_id = p_agent_id 
      AND recorded_at::DATE = p_date;

    RETURN COALESCE(v_trail, '[]'::jsonb);
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
    geofence_events;
COMMIT;

COMMIT;
