-- =====================================================================
-- LOGISTRACK V2 - MAJOR EVOLUTION: MISSION TEMPLATES MIGRATION
-- File: supabase/migrations/20260806100000_mission_templates.sql
-- Creates tables and RPCs for Configurable Mission Templates & Dynamic Workflows
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. MISSION TEMPLATES & REQUIREMENTS TABLES
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.mission_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE, -- 'INVOICE_DISTRIBUTION', 'ECOM_DELIVERY', 'TECHNICAL_INSPECTION', 'STANDARD_MISSION'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Package',
    color_hex VARCHAR(20) DEFAULT '#6366f1',
    category VARCHAR(50) DEFAULT 'DISTRIBUTION',
    
    -- COD Enablement Flag
    has_cod BOOLEAN DEFAULT FALSE,

    -- Proof Requirements Config (JSONB)
    proof_config JSONB NOT NULL DEFAULT '{
      "recipient_signature": "MANDATORY",
      "agent_signature": "OPTIONAL",
      "single_photo": "DISABLED",
      "multi_photo": "DISABLED",
      "qr_scan": "DISABLED",
      "barcode_scan": "DISABLED",
      "attachment": "DISABLED",
      "comment": "OPTIONAL",
      "gps_coordinates": "MANDATORY",
      "timestamp": "MANDATORY"
    }'::jsonb,

    -- Validation Rules Config (JSONB)
    validation_config JSONB NOT NULL DEFAULT '{
      "requires_pod_validation": true,
      "requires_supervisor_validation": false,
      "requires_client_validation": false,
      "requires_double_validation": false
    }'::jsonb,

    -- Workflow Steps Pipeline (JSONB)
    workflow_steps JSONB NOT NULL DEFAULT '[
      {"id": "step_start", "name": "Prise en charge Mission", "type": "START"},
      {"id": "step_proof", "name": "Capture des Preuves", "type": "PROOF_CAPTURE"},
      {"id": "step_complete", "name": "Clôture Mission", "type": "COMPLETE"}
    ]'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Associate items table with mission_template_id
ALTER TABLE public.items 
ADD COLUMN IF NOT EXISTS mission_template_id UUID REFERENCES public.mission_templates(id) ON DELETE SET NULL;

-- RLS Policies
ALTER TABLE public.mission_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_members_mission_templates ON public.mission_templates
    FOR ALL USING (
        organization_id = public.get_auth_org_id() OR
        public.get_auth_role() IN ('super_admin', 'SUPER_ADMIN')
    );

-- ---------------------------------------------------------------------
-- 2. STORED PROCEDURES (RPC)
-- ---------------------------------------------------------------------

-- 2.1 Get All Active Mission Templates for an Organization
CREATE OR REPLACE FUNCTION public.get_mission_templates(p_org_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_templates JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', id,
            'code', code,
            'name', name,
            'description', description,
            'icon_name', icon_name,
            'color_hex', color_hex,
            'category', category,
            'has_cod', has_cod,
            'proof_config', proof_config,
            'validation_config', validation_config,
            'workflow_steps', workflow_steps,
            'is_active', is_active,
            'is_default', is_default
        )
    ) INTO v_templates
    FROM mission_templates
    WHERE (organization_id = p_org_id OR is_default = TRUE) AND is_active = TRUE;

    RETURN COALESCE(v_templates, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 3. INSERT DEFAULT STANDARD TEMPLATE
-- ---------------------------------------------------------------------

INSERT INTO public.mission_templates (
    organization_id,
    code,
    name,
    description,
    icon_name,
    color_hex,
    category,
    has_cod,
    is_active,
    is_default
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'STANDARD_MISSION',
    'Mission Standard',
    'Modèle de mission par défaut avec signature et géolocalisation.',
    'Package',
    '#6366f1',
    'DISTRIBUTION',
    FALSE,
    TRUE,
    TRUE
) ON CONFLICT (code) DO NOTHING;

COMMIT;
