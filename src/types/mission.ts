import { ItemType, OperationType, PaymentStatus } from './logistrack';
import { LotPriority } from './missionControl';

export type MissionStatus =
  | 'BROUILLON'
  | 'CREEE'
  | 'AFFECTEE'
  | 'ACCEPTEE'
  | 'EN_COURS'
  | 'SUSPENDUE'
  | 'TERMINEE'
  | 'ECHOUEE'
  | 'ANNULEE'
  | 'VALIDEE';

export type IncidentType =
  | 'ADDRESS_NOT_FOUND'
  | 'RECIPIENT_ABSENT'
  | 'REFUSED_COD'
  | 'PHONE_UNREACHABLE'
  | 'BAD_ADDRESS'
  | 'TECHNICAL_ISSUE'
  | 'OTHER';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type DocumentType =
  | 'INVOICE'
  | 'MAIL'
  | 'DELIVERY_NOTE'
  | 'CONTRACT'
  | 'PHOTO'
  | 'JUSTIFICATIF';

export interface MissionHistoryEntry {
  id: string;
  mission_id: string;
  previous_status?: MissionStatus;
  new_status?: MissionStatus;
  user_id?: string;
  user_name: string;
  action_title: string;
  comment?: string;
  created_at: string;
}

export interface MissionIncident {
  id: string;
  mission_id: string;
  incident_type: IncidentType;
  severity: IncidentSeverity;
  reported_by_name: string;
  description: string;
  status: 'OPEN' | 'RESOLVED' | 'CLOSED';
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface MissionDocument {
  id: string;
  mission_id: string;
  file_name: string;
  file_type: DocumentType;
  file_size_bytes: number;
  storage_path: string;
  public_url: string;
  uploaded_by_name: string;
  created_at: string;
}

export interface MissionComment {
  id: string;
  mission_id: string;
  author_role: 'DISPATCHER' | 'SUPERVISOR' | 'AGENT';
  author_name: string;
  comment_text: string;
  created_at: string;
}

export interface Mission {
  id: string;
  mission_number: string;
  organization_id: string;
  client_id: string;
  client_name: string;
  client_code: string;
  campaign_id: string;
  campaign_reference: string;
  campaign_name: string;
  batch_id?: string;
  batch_number?: string;
  
  // Recipient
  recipient_name: string;
  recipient_phone: string;
  recipient_email?: string;
  address_raw: string;
  district_name?: string;
  sector_name?: string;
  city_name: string;
  landmark_description?: string;
  latitude?: number;
  longitude?: number;

  // Object & SLA
  item_type: ItemType;
  operation_type: OperationType;
  description?: string;
  priority: LotPriority;
  sla_hours: number;
  due_date: string;
  cod_amount: number;
  payment_status: PaymentStatus;

  // Assignment
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  assigned_agent_phone?: string;
  team_leader_name?: string;
  supervisor_name?: string;

  // Execution & Closure
  status: MissionStatus;
  start_time?: string;
  end_time?: string;
  execution_duration_min?: number;
  result_summary?: string;
  failure_reason?: string;
  failure_notes?: string;
  pod_id?: string;

  created_at: string;
  updated_at: string;

  // Nested Sub-Entities
  history?: MissionHistoryEntry[];
  incidents?: MissionIncident[];
  documents?: MissionDocument[];
  comments?: MissionComment[];
}

export interface MissionKpis {
  total: number;
  active: number;
  completed: number;
  delayed: number;
  failed: number;
  suspended: number;
}
