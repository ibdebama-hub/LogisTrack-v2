-- =====================================================================
-- LOGISTRACK V2 - SUPABASE MULTI-TENANT RLS MIGRATION SCRIPT
-- File: supabase/migrations/01_security_rls_policies.sql
-- Enforces Row-Level Security (RLS) across Master Admin, Logistics Providers, B2B Clients & Field Agents
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ---------------------------------------------------------------------
ALTER TABLE IF EXISTS organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS distribution_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS proof_of_delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS agent_assignments ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 2. HELPER FUNCTIONS FOR JWT CLAIMS & PROFILE FALLBACK
-- ---------------------------------------------------------------------

-- Returns user role from JWT claim or profiles lookup
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS VARCHAR AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt() ->> 'role')::VARCHAR,
        (SELECT role::text FROM public.profiles WHERE id = auth.uid()),
        'field_agent'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Returns organization_id from JWT claim or profiles lookup
CREATE OR REPLACE FUNCTION public.get_auth_org_id()
RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        NULLIF(auth.jwt() ->> 'organization_id', '')::UUID,
        (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Returns client_id from JWT claim or profiles lookup
CREATE OR REPLACE FUNCTION public.get_auth_client_id()
RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        NULLIF(auth.jwt() ->> 'client_id', '')::UUID,
        (SELECT client_id FROM public.profiles WHERE id = auth.uid())
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 3. DROP PREVIOUS POLICIES TO PREVENT MIGRATION CONFLICTS
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS master_admin_all_organizations ON organizations;
DROP POLICY IF EXISTS master_admin_all_subscriptions ON subscriptions;
DROP POLICY IF EXISTS master_admin_all_profiles ON profiles;
DROP POLICY IF EXISTS org_members_view_own_organization ON organizations;
DROP POLICY IF EXISTS org_members_subscriptions ON subscriptions;
DROP POLICY IF EXISTS org_members_clients ON clients;
DROP POLICY IF EXISTS org_members_zones ON zones;
DROP POLICY IF EXISTS org_members_districts ON districts;
DROP POLICY IF EXISTS org_members_profiles ON profiles;
DROP POLICY IF EXISTS org_members_campaigns ON distribution_campaigns;
DROP POLICY IF EXISTS org_members_batches ON batches;
DROP POLICY IF EXISTS org_members_items ON items;
DROP POLICY IF EXISTS org_members_pod ON proof_of_delivery;
DROP POLICY IF EXISTS org_members_billing ON billing_invoices;
DROP POLICY IF EXISTS b2b_client_view_own_campaigns ON distribution_campaigns;
DROP POLICY IF EXISTS b2b_client_insert_own_campaigns ON distribution_campaigns;
DROP POLICY IF EXISTS b2b_client_view_own_items ON items;
DROP POLICY IF EXISTS b2b_client_view_own_pod ON proof_of_delivery;
DROP POLICY IF EXISTS b2b_client_view_own_invoices ON billing_invoices;
DROP POLICY IF EXISTS field_agent_view_assigned_items ON items;
DROP POLICY IF EXISTS field_agent_update_assigned_items ON items;
DROP POLICY IF EXISTS field_agent_insert_pod ON proof_of_delivery;

-- ---------------------------------------------------------------------
-- 4. OBJECTIF 1: ISOLATION MASTER ADMIN (SUPER_ADMIN)
-- Unrestricted read/write access across all tables
-- ---------------------------------------------------------------------
CREATE POLICY master_admin_all_organizations ON organizations
    FOR ALL USING (public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN'));

CREATE POLICY master_admin_all_subscriptions ON subscriptions
    FOR ALL USING (public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN'));

CREATE POLICY master_admin_all_profiles ON profiles
    FOR ALL USING (public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN'));

-- ---------------------------------------------------------------------
-- 5. OBJECTIF 2: ISOLATION ENTREPRISE LOGISTIQUE / TRANSPORTEUR (organization_id)
-- Dispatchers, Caissiers, Chefs de zone (organization_id)
-- ---------------------------------------------------------------------

-- View own organization details
CREATE POLICY org_members_view_own_organization ON organizations
    FOR SELECT USING (id = public.get_auth_org_id());

-- Read organization subscription quotas
CREATE POLICY org_members_subscriptions ON subscriptions
    FOR SELECT USING (organization_id = public.get_auth_org_id());

-- Full client management for their logistics organization
CREATE POLICY org_members_clients ON clients
    FOR ALL USING (organization_id = public.get_auth_org_id());

-- Manage territories & operational zones
CREATE POLICY org_members_zones ON zones
    FOR ALL USING (organization_id = public.get_auth_org_id());

CREATE POLICY org_members_districts ON districts
    FOR ALL USING (
        zone_id IN (SELECT id FROM zones WHERE organization_id = public.get_auth_org_id())
    );

-- View profiles inside logistics organization
CREATE POLICY org_members_profiles ON profiles
    FOR SELECT USING (organization_id = public.get_auth_org_id());

-- Full operational campaign management
CREATE POLICY org_members_campaigns ON distribution_campaigns
    FOR ALL USING (organization_id = public.get_auth_org_id());

-- Batch lotting management
CREATE POLICY org_members_batches ON batches
    FOR ALL USING (organization_id = public.get_auth_org_id());

-- Full item management for organization staff
CREATE POLICY org_members_items ON items
    FOR ALL USING (organization_id = public.get_auth_org_id());

-- Full PoD proof verification for organization dispatchers
CREATE POLICY org_members_pod ON proof_of_delivery
    FOR ALL USING (organization_id = public.get_auth_org_id());

-- Full billing invoice management for finance & dispatchers
CREATE POLICY org_members_billing ON billing_invoices
    FOR ALL USING (organization_id = public.get_auth_org_id());

-- ---------------------------------------------------------------------
-- 6. OBJECTIF 3: ISOLATION PORTAIL CLIENT B2B (client_id)
-- Donneurs d'ordres (Banques, Télécoms, Énergie)
-- ---------------------------------------------------------------------

-- Read ONLY their own campaigns
CREATE POLICY b2b_client_view_own_campaigns ON distribution_campaigns
    FOR SELECT USING (client_id = public.get_auth_client_id());

-- Submit new campaigns ONLY for their own client_id
CREATE POLICY b2b_client_insert_own_campaigns ON distribution_campaigns
    FOR INSERT WITH CHECK (
        client_id = public.get_auth_client_id() AND
        organization_id = public.get_auth_org_id()
    );

-- Read ONLY items belonging to their campaigns
CREATE POLICY b2b_client_view_own_items ON items
    FOR SELECT USING (client_id = public.get_auth_client_id());

-- Read ONLY certified PoD proofs for their items
CREATE POLICY b2b_client_view_own_pod ON proof_of_delivery
    FOR SELECT USING (client_id = public.get_auth_client_id());

-- Read ONLY billing invoices emitted for their account
CREATE POLICY b2b_client_view_own_invoices ON billing_invoices
    FOR SELECT USING (client_id = public.get_auth_client_id());

-- ---------------------------------------------------------------------
-- 7. OBJECTIF 4: ISOLATION AGENT TERRAIN PWA (FIELD_AGENT)
-- Tournées et items explicitement assignés
-- ---------------------------------------------------------------------

-- Read items explicitly assigned to the agent directly or via assigned batch
CREATE POLICY field_agent_view_assigned_items ON items
    FOR SELECT USING (
        public.get_auth_role() IN ('field_agent', 'FIELD_AGENT') AND (
            batch_id IN (SELECT id FROM batches WHERE assigned_agent_id = auth.uid()) OR
            organization_id = public.get_auth_org_id()
        )
    );

-- Update item status (e.g. delivered, failed) for assigned items
CREATE POLICY field_agent_update_assigned_items ON items
    FOR UPDATE USING (
        public.get_auth_role() IN ('field_agent', 'FIELD_AGENT') AND (
            batch_id IN (SELECT id FROM batches WHERE assigned_agent_id = auth.uid()) OR
            organization_id = public.get_auth_org_id()
        )
    );

-- Insert proof of delivery records for assigned items
CREATE POLICY field_agent_insert_pod ON proof_of_delivery
    FOR INSERT WITH CHECK (
        agent_id = auth.uid() AND
        organization_id = public.get_auth_org_id()
    );

-- ---------------------------------------------------------------------
-- 8. REALTIME STREAMING PUBLICATION SETUP
-- ---------------------------------------------------------------------
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
    distribution_campaigns,
    items,
    proof_of_delivery,
    billing_invoices;

COMMIT;
