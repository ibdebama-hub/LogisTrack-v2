import { MissionStatus } from './mission';

export type AgentStatusColor =
  | 'ONLINE_AVAILABLE'
  | 'ON_MISSION'
  | 'ON_BREAK'
  | 'OFFLINE'
  | 'INCIDENT'
  | 'OFF_DUTY';

export interface SupervisionAgent {
  id: string;
  name: string;
  phone: string;
  avatar_initials: string;
  zone_code: string;
  zone_name: string;
  current_lat: number;
  current_lng: number;
  speed_kmh: number;
  battery_level: number;
  status: AgentStatusColor;
  active_mission_number?: string;
  active_mission_recipient?: string;
  delivered_today: number;
  total_assigned_today: number;
  last_sync_time: string;
}

export interface SupervisionMission {
  id: string;
  mission_number: string;
  recipient_name: string;
  recipient_phone: string;
  address_raw: string;
  landmark_description?: string;
  lat: number;
  lng: number;
  status: MissionStatus;
  priority: 'BASSE' | 'NORMALE' | 'HAUTE' | 'URGENTE';
  cod_amount: number;
  assigned_agent_id?: string;
  assigned_agent_name?: string;
}

export interface SupervisionZone {
  id: string;
  code: string;
  name: string;
  city_name: string;
  center_lat: number;
  center_lng: number;
  radius_meters: number;
  total_missions: number;
  delivered_missions: number;
  success_rate: number;
  assigned_agents_count: number;
}

export interface SupervisionIncident {
  id: string;
  mission_id: string;
  mission_number: string;
  incident_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lat: number;
  lng: number;
  reported_by_name: string;
  description: string;
  created_at: string;
}

export interface GpsTrailPoint {
  id: string;
  lat: number;
  lng: number;
  speed: number;
  battery: number;
  timestamp: string;
}

export interface LayerToggles {
  agents: boolean;
  missions: boolean;
  zones: boolean;
  heatmap: boolean;
  incidents: boolean;
  routes: boolean;
  replay: boolean;
}
