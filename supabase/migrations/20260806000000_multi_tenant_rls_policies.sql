-- =====================================================================
-- LOGISTRACK V2 - SUPABASE MULTI-TENANT RLS MIGRATION SCRIPT
-- File: supabase/migrations/20260806000000_multi_tenant_rls_policies.sql
-- Enforces Row-Level Security (RLS) across Master Admin, Logistics Providers & B2B Clients
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ---------------------------------------------------------------------
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_of_delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_assignments ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 2. SECURITY DEFINER HELPER FUNCTIONS FOR ROLE & TENANT CONTEXT
-- ---------------------------------------------------------------------

-- Returns the authenticated user's system role from the profiles table
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Returns the authenticated user's organization UUID (Logistics Tenant)
CREATE OR REPLACE FUNCTION public.current_user_org_id()
RETURNS UUID AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Returns the authenticated user's client UUID (B2B Corporate Client)
CREATE OR REPLACE FUNCTION public.current_user_client_id()
RETURNS UUID AS $$
    SELECT client_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 3. DROP EXISTING POLICIES TO ENSURE CLEAN MIGRATION
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS master_admin_all_organizations ON organizations;
DROP POLICY IF EXISTS master_admin_all_subscriptions ON subscriptions;
DROP POLICY IF EXISTS org_members_view_own_organization ON organizations;
DROP POLICY IF EXISTS org_members_subscriptions ON subscriptions;
DROP POLICY IF EXISTS org_members_clients ON clients;
DROP POLICY IF EXISTS org_members_zones ON zones;
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

-- ---------------------------------------------------------------------
-- 4. LEVEL 1: MASTER ADMIN POLICIES (SUPER ADMIN UNRESTRICTED)
-- ---------------------------------------------------------------------
CREATE POLICY master_admin_all_organizations ON organizations
    FOR ALL USING (public.current_user_role() = 'super_admin');

CREATE POLICY master_admin_all_subscriptions ON subscriptions
    FOR ALL USING (public.current_user_role() = 'super_admin');

CREATE POLICY master_admin_all_profiles ON profiles
    FOR ALL USING (public.current_user_role() = 'super_admin');

-- ---------------------------------------------------------------------
-- 5. LEVEL 2: LOGISTICS PROVIDERS / DISPATCHERS TENANT POLICIES (organization_id)
-- ---------------------------------------------------------------------

-- Organizations: Users can view their own logistics provider organization
CREATE POLICY org_members_view_own_organization ON organizations
    FOR SELECT USING (id = public.current_user_org_id());

-- Subscriptions: Dispatchers & Admins can read their subscription status & quota limits
CREATE POLICY org_members_subscriptions ON subscriptions
    FOR SELECT USING (organization_id = public.current_user_org_id());

-- Clients: Logistics staff can manage clients belonging to their organization
CREATE POLICY org_members_clients ON clients
    FOR ALL USING (organization_id = public.current_user_org_id());

-- Zones & Districts: Managed by organization admins & dispatchers
CREATE POLICY org_members_zones ON zones
    FOR ALL USING (organization_id = public.current_user_org_id());

CREATE POLICY org_members_districts ON districts
    FOR ALL USING (
        zone_id IN (SELECT id FROM zones WHERE organization_id = public.current_user_org_id())
    );

-- Profiles: Members can view profiles within their organization
CREATE POLICY org_members_profiles ON profiles
    FOR SELECT USING (organization_id = public.current_user_org_id());

-- Distribution Campaigns: Organization staff can manage all campaigns in their organization
CREATE POLICY org_members_campaigns ON distribution_campaigns
    FOR ALL USING (organization_id = public.current_user_org_id());

-- Batches: Organization staff can manage distribution batches
CREATE POLICY org_members_batches ON batches
    FOR ALL USING (organization_id = public.current_user_org_id());

-- Items: Full operational management for organization items
CREATE POLICY org_members_items ON items
    FOR ALL USING (organization_id = public.current_user_org_id());

-- Proof of Delivery: Logistics dispatchers and agents can view and verify proofs
CREATE POLICY org_members_pod ON proof_of_delivery
    FOR ALL USING (organization_id = public.current_user_org_id());

-- Billing Invoices: Finance & Dispatchers can manage issued invoices
CREATE POLICY org_members_billing ON billing_invoices
    FOR ALL USING (organization_id = public.current_user_org_id());

-- ---------------------------------------------------------------------
-- 6. LEVEL 3: B2B CORPORATE CLIENTS ISOLATION POLICIES (client_id)
-- ---------------------------------------------------------------------

-- B2B Clients can view ONLY their own campaigns
CREATE POLICY b2b_client_view_own_campaigns ON distribution_campaigns
    FOR SELECT USING (client_id = public.current_user_client_id());

-- B2B Clients can create new campaigns for their own client_id
CREATE POLICY b2b_client_insert_own_campaigns ON distribution_campaigns
    FOR INSERT WITH CHECK (
        client_id = public.current_user_client_id() AND
        organization_id = public.current_user_org_id()
    );

-- B2B Clients can view ONLY items belonging to their campaigns
CREATE POLICY b2b_client_view_own_items ON items
    FOR SELECT USING (client_id = public.current_user_client_id());

-- B2B Clients can view ONLY certified PoD proofs for their items
CREATE POLICY b2b_client_view_own_pod ON proof_of_delivery
    FOR SELECT USING (client_id = public.current_user_client_id());

-- B2B Clients can view ONLY billing invoices issued to them
CREATE POLICY b2b_client_view_own_invoices ON billing_invoices
    FOR SELECT USING (client_id = public.current_user_client_id());

-- ---------------------------------------------------------------------
-- 7. SUPABASE REALTIME PUBLICATION CONFIGURATION
-- ---------------------------------------------------------------------
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
    distribution_campaigns,
    items,
    proof_of_delivery,
    billing_invoices;

COMMIT;
