import { OperationType } from './logistrack';

export type LotStatus =
  | 'A_PREPARER'
  | 'A_AFFECTER'
  | 'AFFECTE'
  | 'EN_COURS'
  | 'TERMINE'
  | 'A_CONTROLER';

export type LotPriority = 'BASSE' | 'NORMALE' | 'HAUTE' | 'URGENTE';

export type NotificationSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface DispatchLot {
  id: string;
  lot_number: string;
  name: string;
  campaign_id: string;
  campaign_reference: string;
  campaign_name: string;
  client_id: string;
  client_name: string;
  zone_code: string;
  zone_name: string;
  city_name: string;
  total_missions: number;
  delivered_missions: number;
  failed_missions: number;
  estimated_hours: number;
  priority: LotPriority;
  status: LotStatus;
  assigned_agents: Array<{
    id: string;
    name: string;
    phone: string;
    avatar_initials?: string;
  }>;
  created_at: string;
  due_date: string;
  total_cod_amount: number;
}

export interface ReassignmentAuditEntry {
  id: string;
  timestamp: string;
  lot_id: string;
  lot_number: string;
  action_type: 'ASSIGNED' | 'UNASSIGNED' | 'TRANSFERRED' | 'SPLIT';
  performed_by: string;
  previous_agents: string[];
  new_agents: string[];
  details: string;
}

export interface OperationalTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'CAMPAIGN' | 'IMPORT' | 'DISPATCH' | 'AGENT' | 'INCIDENT' | 'DELIVERY';
  severity: 'info' | 'warning' | 'critical' | 'success';
  actor?: string;
  reference_id?: string;
}

export interface DispatcherNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  read: boolean;
  category: 'CAMPAIGN' | 'AGENT' | 'MISSION' | 'INCIDENT' | 'SYSTEM';
  action_url?: string;
}

export interface MissionControlKpis {
  campaigns: {
    active: number;
    completed: number;
    planned: number;
    total: number;
  };
  missions: {
    created: number;
    assigned: number;
    in_progress: number;
    completed: number;
    delayed: number;
    canceled: number;
    total: number;
  };
  agents: {
    online: number;
    available: number;
    on_mission: number;
    offline: number;
    total: number;
  };
  performance: {
    global_completion_rate: number;
    success_rate: number;
    avg_delivery_time_min: number;
    incidents_count: number;
  };
}
