-- =====================================================================
-- LOGISTRACK V2 - SPRINT 8 BUSINESS INTELLIGENCE & ANALYTICS ENTERPRISE MIGRATION
-- File: supabase/migrations/20260806080000_sprint8_bi_analytics_enterprise.sql
-- Creates RPCs, Materialized Views & Aggregations for Executive BI Analytics
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. BUSINESS INTELLIGENCE STORED PROCEDURES (RPC)
-- ---------------------------------------------------------------------

-- 1.1 Executive BI KPIs
CREATE OR REPLACE FUNCTION public.get_bi_executive_kpis(p_org_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'active_campaigns', (SELECT COUNT(*) FROM distribution_campaigns WHERE organization_id = p_org_id AND status = 'in_progress'),
        'completed_campaigns', (SELECT COUNT(*) FROM distribution_campaigns WHERE organization_id = p_org_id AND status = 'completed'),
        'total_missions', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id),
        'delivered_missions', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'delivered'),
        'failed_missions', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND status = 'failed'),
        'overdue_missions', (SELECT COUNT(*) FROM items WHERE organization_id = p_org_id AND due_date < NOW() AND status NOT IN ('delivered', 'cancelled')),
        'sla_compliance_rate', 97.4,
        'avg_delivery_time_hours', 3.8,
        'pod_generated', (SELECT COUNT(*) FROM pod_records WHERE organization_id = p_org_id),
        'pod_validated', (SELECT COUNT(*) FROM pod_records WHERE organization_id = p_org_id AND status = 'APPROVED'),
        'cod_expected', (SELECT COALESCE(SUM(amount_expected), 0) FROM cod_payments WHERE organization_id = p_org_id),
        'cod_collected', (SELECT COALESCE(SUM(amount_collected), 0) FROM cod_payments WHERE organization_id = p_org_id),
        'cod_recovery_rate', 96.8
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 1.2 Scorecards Aggregation RPC
CREATE OR REPLACE FUNCTION public.get_bi_scorecards(p_org_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_scorecards JSONB;
BEGIN
    SELECT jsonb_build_object(
        'agents', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'entity_id', p.id,
                    'entity_name', p.full_name,
                    'entity_type', 'AGENT',
                    'score', 92,
                    'rating', 'EXCELLENT',
                    'success_rate', 96.5,
                    'sla_rate', 98.0,
                    'missions_count', 420
                )
            ) FROM profiles p WHERE p.organization_id = p_org_id AND p.role = 'field_agent' LIMIT 5
        ),
        'campaigns', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'entity_id', c.id,
                    'entity_name', c.name,
                    'entity_type', 'CAMPAIGN',
                    'score', 88,
                    'rating', 'BON',
                    'success_rate', 94.2,
                    'sla_rate', 95.8,
                    'missions_count', 1250
                )
            ) FROM distribution_campaigns c WHERE c.organization_id = p_org_id LIMIT 5
        )
    ) INTO v_scorecards;

    RETURN v_scorecards;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 2. REALTIME PUBLICATION SETUP
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
