export type BiRoleView =
  | 'EXECUTIVE'
  | 'OPERATIONS'
  | 'SUPERVISOR'
  | 'FINANCE'
  | 'QUALITY';

export type BiRating = 'EXCELLENT' | 'BON' | 'MOYEN' | 'A_AMELIORER';

export interface BiExecutiveKpis {
  active_campaigns: number;
  completed_campaigns: number;
  total_missions: number;
  delivered_missions: number;
  failed_missions: number;
  overdue_missions: number;
  sla_compliance_rate: number;
  avg_delivery_time_hours: number;
  pod_generated: number;
  pod_validated: number;
  cod_expected: number;
  cod_collected: number;
  cod_recovery_rate: number;
}

export interface BiDimensionPoint {
  dimension_key: string;
  dimension_label: string;
  missions_count: number;
  delivered_count: number;
  success_rate: number;
  sla_rate: number;
  cod_collected: number;
  incidents_count: number;
}

export interface BiComparisonResult {
  entity1_label: string;
  entity2_label: string;
  success_rate_1: number;
  success_rate_2: number;
  success_rate_delta: number;
  cod_1: number;
  cod_2: number;
  cod_delta: number;
  sla_1: number;
  sla_2: number;
  sla_delta: number;
}

export interface BiScorecardItem {
  id: string;
  entity_name: string;
  entity_type: 'CAMPAIGN' | 'AGENT' | 'SUPERVISOR' | 'ZONE';
  score: number;
  rating: BiRating;
  success_rate: number;
  sla_rate: number;
  missions_count: number;
}

export interface BiAlertRule {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metric: string;
  threshold_value: string;
  triggered_at: string;
  is_active: boolean;
}

export interface PredictiveFeatureVector {
  mission_id: string;
  distance_km: number;
  historical_traffic_index: number;
  weather_condition_score: number;
  agent_experience_score: number;
  predicted_delay_probability: number;
  recommended_action: string;
}
