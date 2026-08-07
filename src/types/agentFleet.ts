import { UserRole, PoDType } from '@/types/logistrack';

export type AgentStatus = 'EN_TOURNÉE' | 'EN_PAUSE' | 'DISPONIBLE' | 'HORS_LIGNE';

export type NetworkMode = '4G' | 'Wi-Fi' | 'Offline';

export type GpsStatus = 'EXCELLENT' | 'FAIBLE' | 'DÉSACTIVÉ';

export type VehicleType = 'MOTO' | 'TRICYCLE' | 'À PIED' | 'VOITURE';

export interface AgentTelemetry {
  battery_level: number; // 0 to 100
  gps_status: GpsStatus;
  gps_lat: number;
  gps_lng: number;
  network_mode: NetworkMode;
  last_ping_at: string; // ISO date string or relative formatted
  pwa_version: string;
  is_signal_critical?: boolean; // True if last ping > 45 minutes with active workload/COD
}

export interface AgentWorkload {
  total_assigned: number;
  delivered: number;
  remaining: number;
  failed: number;
}

export interface AgentCodBalance {
  collected_today: number; // In local currency (e.g. GNF, XOF)
  pending_discharge: number;
}

export interface AgentPerformanceHistory {
  success_rate: number; // e.g. 96.5%
  avg_time_per_delivery: string; // e.g. "11 min"
  npai_rate: number; // e.g. 2.1%
  reconciliation_score: string; // e.g. "100% sans écart (28/28 clôtures)"
}

export interface AgentRoutePoint {
  id: string;
  timestamp: string;
  location_name: string;
  status: 'start' | 'delivered' | 'failed' | 'current';
  recipient_name?: string;
  item_tracking?: string;
  cod_amount?: number;
  pod_type?: PoDType;
  lat: number;
  lng: number;
}

export interface AgentVehicle {
  type: VehicleType;
  license_plate?: string;
  equipment_id: string;
  brand_model?: string;
}

export interface FleetAgentFull {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole; // 'field_agent' | 'team_leader'
  avatar_url?: string;
  status: AgentStatus;
  primary_zone_id: string;
  primary_zone_name: string;
  primary_zone_code: string;
  district_names: string[];
  vehicle: AgentVehicle;
  telemetry: AgentTelemetry;
  workload: AgentWorkload;
  cod: AgentCodBalance;
  performance: AgentPerformanceHistory;
  route_history: AgentRoutePoint[];
  
  // Advanced Administration & Assignment Extensions
  assigned_zone_names?: string[];
  assigned_district_names?: string[];
  allowed_client_names?: string[]; // e.g. ['Tous (Polyvalent)'] or ['Orange Guinée', 'EDG SA']
  allowed_operation_types?: string[]; // e.g. ['MASS_INVOICE_DISTRIBUTION', 'CONFIDENTIAL_MAIL', 'PARCEL_DELIVERY_COD']
  max_cod_cash_ceiling?: number; // Maximum cash allowed in hand (e.g. 500000 FCFA / GNF)
  account_status?: 'ACTIF' | 'SUSPENDU' | 'INACTIF';
  pwa_pin?: string;
}
