import { OperationType } from './logistrack';

export type CampaignStatus = 'EN_COURS' | 'PLANIFIÉE' | 'EN_PAUSE' | 'CLÔTURÉE' | 'ARCHIVÉE';

export interface CampaignZoneProgress {
  zone_name: string;
  total: number;
  delivered: number;
  failed: number;
  in_progress: number;
}

export interface CampaignAgentWorkload {
  agent_id: string;
  agent_name: string;
  agent_phone: string;
  avatar_url?: string;
  total_assigned: number;
  delivered: number;
  failed: number;
  remaining: number;
  success_rate: number;
}

export interface CampaignIncident {
  id: string;
  tracking_ref: string;
  recipient_name: string;
  recipient_address: string;
  reason: string;
  reported_at: string;
  agent_name: string;
  status: 'CRITICAL' | 'RESOLVED' | 'PENDING_ADDRESS';
}

export interface CampaignItem {
  id: string;
  reference: string; // e.g. "CAMP-2026-EDM-07"
  name: string; // e.g. "Factures Électricité EDM - Juillet 2026"
  client_id: string;
  client_name: string;
  client_code: string;
  operation_type: OperationType;
  total_items: number;
  delivered_items: number;
  failed_items: number;
  in_progress_items: number;
  unassigned_items: number;
  start_date: string;
  due_date: string;
  is_urgent: boolean;
  status: CampaignStatus;
  batches_count: number;
  agents_assigned_count: number;
  total_cod_amount?: number;
  zones_progress: CampaignZoneProgress[];
  assigned_agents: CampaignAgentWorkload[];
  incidents: CampaignIncident[];
}
