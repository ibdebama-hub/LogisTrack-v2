-- =====================================================================
-- LOGISTRACK V2 - SUPABASE / POSTGRESQL DATABASE SCHEMA
-- Hybrid Delivery & Invoice Distribution Management System (SaaS Multi-Tenant)
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'admin',
    'dispatcher',
    'team_leader',
    'field_agent',
    'client_admin'
);

CREATE TYPE item_type AS ENUM (
    'package',
    'invoice',
    'simple_mail',
    'registered_mail'
);

CREATE TYPE operation_type AS ENUM (
    'MASS_INVOICE_DISTRIBUTION',
    'CONFIDENTIAL_MAIL',
    'PARCEL_DELIVERY_COD',
    'EXPRESS_COURIER'
);

CREATE TYPE payment_status AS ENUM (
    'NO_PAYMENT_REQUIRED',
    'PENDING_COD',
    'PAID_ONLINE',
    'COLLECTED_COD'
);

CREATE TYPE campaign_status AS ENUM (
    'draft',
    'active',
    'paused',
    'completed',
    'archived'
);

CREATE TYPE batch_status AS ENUM (
    'draft',
    'assigned',
    'in_transit',
    'completed',
    'reconciled'
);

CREATE TYPE item_status AS ENUM (
    'pending',
    'batched',
    'assigned',
    'in_transit',
    'delivered',
    'failed',
    'returned'
);

CREATE TYPE failure_reason AS ENUM (
    'moved',
    'unreachable_phone',
    'landmark_not_found',
    'refused_cod',
    'absent',
    'mailbox_inaccessible',
    'access_denied_security',
    'incorrect_address',
    'other'
);

CREATE TYPE pod_type AS ENUM (
    'signature',
    'photo',
    'otp',
    'id_verification',
    'mailbox_drop'
);

CREATE TYPE pod_verification_status AS ENUM (
    'PENDING',
    'CERTIFIED',
    'REJECTED',
    'ANOMALY'
);

CREATE TYPE cod_status AS ENUM (
    'pending',
    'collected_by_agent',
    'reconciled_with_finance',
    'transferred_to_client'
);

CREATE TYPE payment_method AS ENUM (
    'cash',
    'mobile_money',
    'pos_card',
    'check'
);

-- 3. TABLES DEFINITION

-- 3.1 Organizations (Multi-Tenancy)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    org_type VARCHAR(50) DEFAULT 'logistics_provider',
    logo_url TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Subscriptions (SaaS Quotas & Plan Control Managed by Master Admin)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) DEFAULT 'PRO', -- STARTER, PRO, ENTERPRISE
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, PAST_DUE, EXPIRED, CANCELED
    billing_cycle VARCHAR(20) DEFAULT 'MONTHLY',
    monthly_price DECIMAL(10, 2) DEFAULT 299.00,
    per_item_rate DECIMAL(10, 2) DEFAULT 0.15,
    max_agents_allowed INT DEFAULT 20,
    monthly_items_processed INT DEFAULT 0,
    max_items_allowed INT DEFAULT 25000,
    sms_quota_used INT DEFAULT 0,
    sms_quota_max INT DEFAULT 5000,
    renewed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Corporate Clients (Donneurs d'Ordres - Banques, Télécoms, Énergie, E-commerce)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    logo_url TEXT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    contract_type VARCHAR(50) DEFAULT 'corporate_key_account',
    color_code VARCHAR(20) DEFAULT '#4F46E5',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

-- 3.4 Geographic Zones (Hierarchy: Region -> City -> Sector/Zone)
CREATE TABLE IF NOT EXISTS zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    region_name VARCHAR(100) NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    sector_name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    boundary GEOMETRY(Polygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

-- 3.5 User Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL, -- Specified for Client B2B Users
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role user_role NOT NULL DEFAULT 'field_agent',
    primary_zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Distribution Campaigns
CREATE TABLE IF NOT EXISTS distribution_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    reference VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    operation_type operation_type NOT NULL DEFAULT 'MASS_INVOICE_DISTRIBUTION',
    total_items INT DEFAULT 0,
    delivered_items INT DEFAULT 0,
    failed_items INT DEFAULT 0,
    in_progress_items INT DEFAULT 0,
    status campaign_status DEFAULT 'active',
    is_urgent BOOLEAN DEFAULT FALSE,
    start_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, reference)
);

-- 3.7 Distribution Batches (Lots)
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES distribution_campaigns(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    assigned_agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    batch_number VARCHAR(100) NOT NULL,
    status batch_status DEFAULT 'draft',
    total_items INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 Items (Packages, Invoices, Mails)
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    campaign_id UUID NOT NULL REFERENCES distribution_campaigns(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    item_type item_type NOT NULL DEFAULT 'invoice',
    operation_type operation_type NOT NULL DEFAULT 'MASS_INVOICE_DISTRIBUTION',
    payment_status payment_status NOT NULL DEFAULT 'NO_PAYMENT_REQUIRED',
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255),
    address_raw TEXT NOT NULL,
    landmark_description TEXT,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOMETRY(Point, 4326),
    cod_amount DECIMAL(12, 2) DEFAULT 0.00,
    due_date DATE,
    status item_status DEFAULT 'pending',
    failure_reason failure_reason,
    failure_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9 Proof of Delivery (PoD)
CREATE TABLE IF NOT EXISTS proof_of_delivery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pod_type pod_type NOT NULL DEFAULT 'signature',
    proof_image_url TEXT,
    otp_code VARCHAR(10),
    recipient_proxy_name VARCHAR(255),
    recipient_proxy_relation VARCHAR(100),
    recipient_proxy_cni VARCHAR(100),
    gps_lat DOUBLE PRECISION,
    gps_lng DOUBLE PRECISION,
    gps_accuracy DOUBLE PRECISION,
    status pod_verification_status DEFAULT 'PENDING', -- PENDING, CERTIFIED, REJECTED, ANOMALY
    audit_notes TEXT,
    audited_by UUID REFERENCES profiles(id),
    audited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.10 Billing Invoices (Issued to B2B Clients by Dispatcher/Finance)
CREATE TABLE IF NOT EXISTS billing_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    total_ht DECIMAL(12, 2) NOT NULL,
    vat_amount DECIMAL(12, 2) NOT NULL,
    total_ttc DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    status VARCHAR(50) DEFAULT 'ÉMISE', -- ÉMISE, PAYÉE, EN_RETARD
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.11 Districts / Neighborhoods (Quartiers et Secteurs Opérationnels)
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(zone_id, name)
);

-- 3.12 Agent Territory Assignments
CREATE TABLE IF NOT EXISTS agent_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, zone_id, district_id)
);

-- =====================================================================
-- 4. ROW LEVEL SECURITY (RLS) MULTI-TENANT POLICIES
-- =====================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_of_delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION current_user_role() RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION current_user_org_id() RETURNS UUID AS $$
    SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION current_user_client_id() RETURNS UUID AS $$
    SELECT client_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- 4.1 Master Admin Full Access Policy
CREATE POLICY master_admin_all_organizations ON organizations
    FOR ALL USING (current_user_role() = 'super_admin');

CREATE POLICY master_admin_all_subscriptions ON subscriptions
    FOR ALL USING (current_user_role() = 'super_admin');

-- 4.2 Logistics Provider / Dispatcher Tenant Isolation Policy
CREATE POLICY org_members_view_own_organization ON organizations
    FOR SELECT USING (id = current_user_org_id());

CREATE POLICY org_members_subscriptions ON subscriptions
    FOR SELECT USING (organization_id = current_user_org_id());

CREATE POLICY org_members_clients ON clients
    FOR ALL USING (organization_id = current_user_org_id() OR current_user_role() = 'super_admin');

CREATE POLICY org_members_campaigns ON distribution_campaigns
    FOR ALL USING (organization_id = current_user_org_id() OR current_user_role() = 'super_admin');

CREATE POLICY org_members_items ON items
    FOR ALL USING (organization_id = current_user_org_id() OR current_user_role() = 'super_admin');

CREATE POLICY org_members_pod ON proof_of_delivery
    FOR ALL USING (organization_id = current_user_org_id() OR current_user_role() = 'super_admin');

CREATE POLICY org_members_billing ON billing_invoices
    FOR ALL USING (organization_id = current_user_org_id() OR current_user_role() = 'super_admin');

-- 4.3 B2B Client Portal Strict Isolation Policy
CREATE POLICY b2b_client_view_own_campaigns ON distribution_campaigns
    FOR SELECT USING (client_id = current_user_client_id() OR current_user_role() IN ('super_admin', 'dispatcher', 'admin'));

CREATE POLICY b2b_client_insert_own_campaigns ON distribution_campaigns
    FOR INSERT WITH CHECK (client_id = current_user_client_id() OR current_user_role() IN ('super_admin', 'dispatcher', 'admin'));

CREATE POLICY b2b_client_view_own_items ON items
    FOR SELECT USING (client_id = current_user_client_id() OR current_user_role() IN ('super_admin', 'dispatcher', 'admin'));

CREATE POLICY b2b_client_view_own_pod ON proof_of_delivery
    FOR SELECT USING (client_id = current_user_client_id() OR current_user_role() IN ('super_admin', 'dispatcher', 'admin'));

CREATE POLICY b2b_client_view_own_invoices ON billing_invoices
    FOR SELECT USING (client_id = current_user_client_id() OR current_user_role() IN ('super_admin', 'dispatcher', 'admin'));

-- =====================================================================
-- 5. SUPABASE REALTIME PUBLICATION SETUP
-- =====================================================================

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    distribution_campaigns,
    items,
    proof_of_delivery,
    billing_invoices;
COMMIT;
