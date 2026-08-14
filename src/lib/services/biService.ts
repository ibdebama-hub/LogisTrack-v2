import { supabase } from '../supabase/queries';
import {
  BiExecutiveKpis,
  BiScorecardItem,
  BiAlertRule,
  BiComparisonResult,
  BiDimensionPoint
} from '../../types/biAnalytics';

export const MOCK_BI_KPIS: BiExecutiveKpis = {
  active_campaigns: 18,
  completed_campaigns: 195,
  total_missions: 18450,
  delivered_missions: 17820,
  failed_missions: 310,
  overdue_missions: 120,
  sla_compliance_rate: 97.4,
  avg_delivery_time_hours: 3.8,
  pod_generated: 17820,
  pod_validated: 17450,
  cod_expected: 65000000,
  cod_collected: 62920000,
  cod_recovery_rate: 96.8
};

export const MOCK_BI_SCORECARDS: BiScorecardItem[] = [
  {
    id: 'sc-1',
    entity_name: 'Kouassi Jean-Marc',
    entity_type: 'AGENT',
    score: 95,
    rating: 'EXCELLENT',
    success_rate: 98.2,
    sla_rate: 99.1,
    missions_count: 620
  },
  {
    id: 'sc-2',
    entity_name: 'Diallo Mamadou',
    entity_type: 'AGENT',
    score: 88,
    rating: 'BON',
    success_rate: 94.5,
    sla_rate: 96.0,
    missions_count: 580
  },
  {
    id: 'sc-3',
    entity_name: 'Campagne Distribution CIE Août',
    entity_type: 'CAMPAIGN',
    score: 91,
    rating: 'EXCELLENT',
    success_rate: 96.8,
    sla_rate: 97.5,
    missions_count: 4500
  },
  {
    id: 'sc-4',
    entity_name: 'Zone Abidjan Cocody',
    entity_type: 'ZONE',
    score: 78,
    rating: 'MOYEN',
    success_rate: 89.2,
    sla_rate: 91.0,
    missions_count: 3200
  }
];

export const MOCK_BI_ALERTS: BiAlertRule[] = [
  {
    id: 'al-1',
    title: 'Baisse du Taux de Respect SLA (Zone Yopougon)',
    severity: 'HIGH',
    metric: 'Respect SLA < 92%',
    threshold_value: '89.4%',
    triggered_at: '09:30',
    is_active: true
  },
  {
    id: 'al-2',
    title: 'Écart de Recouvrement COD Élevé',
    severity: 'MEDIUM',
    metric: 'Écart Encaissement > 5%',
    threshold_value: '6.2%',
    triggered_at: '10:15',
    is_active: true
  }
];

export const MOCK_BI_COMPARISON: BiComparisonResult = {
  entity1_label: 'Campagne CIE Factures (Août)',
  entity2_label: 'Campagne SODECI Eau (Août)',
  success_rate_1: 96.8,
  success_rate_2: 92.4,
  success_rate_delta: 4.4,
  cod_1: 45000000,
  cod_2: 18000000,
  cod_delta: 27000000,
  sla_1: 97.5,
  sla_2: 94.1,
  sla_delta: 3.4
};

export async function fetchBiExecutiveKpis(organizationId: string = 'tenant-101'): Promise<BiExecutiveKpis> {
  try {
    const { data } = await supabase.rpc('get_bi_executive_kpis', { p_org_id: organizationId });
    if (data) return data as BiExecutiveKpis;
  } catch (e) {}
  return MOCK_BI_KPIS;
}

export async function fetchBiScorecards(organizationId: string = 'tenant-101'): Promise<BiScorecardItem[]> {
  try {
    const { data } = await supabase.rpc('get_bi_scorecards', { p_org_id: organizationId });
    if (data && data.agents) {
      return [...data.agents, ...data.campaigns];
    }
  } catch (e) {}
  return MOCK_BI_SCORECARDS;
}
