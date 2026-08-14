import { PoDType, OperationType } from './logistrack';

export type B2BClientRole =
  | 'CLIENT_ADMIN'
  | 'CLIENT_OPS_MANAGER'
  | 'CLIENT_SUPERVISOR'
  | 'CLIENT_ANALYST'
  | 'CLIENT_READONLY';

export interface B2BExecutiveKpis {
  active_campaigns: number;
  completed_campaigns: number;
  total_missions: number;
  delivered_missions: number;
  failed_missions: number;
  in_transit_missions: number;
  pod_available: number;
  cod_expected: number;
  cod_collected: number;
  sla_compliance_rate: number;
  avg_delivery_time_hours: number;
}

export interface B2BAnalyticsPoint {
  date: string;
  delivered: number;
  failed: number;
  cod_collected: number;
  sla_rate: number;
}

export interface B2BClientUser {
  id: string;
  client_id: string;
  email: string;
  full_name: string;
  role: B2BClientRole;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface B2BDocument {
  id: string;
  client_id: string;
  title: string;
  category: 'POD' | 'COD_RECEIPT' | 'REPORT' | 'INVOICE' | 'CONTRACT' | 'OTHER';
  file_path: string;
  file_size_bytes: number;
  file_type: string;
  campaign_id?: string;
  created_at: string;
}

export interface B2BMessageThread {
  id: string;
  client_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'CLIENT' | 'DISPATCHER';
  subject?: string;
  content: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface B2BClientSettings {
  client_id: string;
  brand_logo_url?: string;
  primary_color: string;
  timezone: string;
  currency: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    realtime: boolean;
  };
}

export interface ClientPortalUser {
  client_id: string;
  client_name: string;
  client_code: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  logo_url?: string;
}

export interface ClientCampaignSummary {
  id: string;
  name: string;
  operation_type: OperationType;
  start_date: string;
  due_date: string;
  total_items: number;
  delivered_items: number;
  failed_items: number;
  pending_items: number;
  status: 'active' | 'completed' | 'paused';
  zone_coverage: { zone_name: string; delivered: number; total: number }[];
}

export interface ClientPoDProof {
  id: string;
  tracking_number: string;
  item_type: string;
  recipient_name: string;
  recipient_address: string;
  delivery_timestamp: string;
  agent_name: string;
  pod_type: PoDType;
  proof_image_url: string;
  gps_lat: number;
  gps_lng: number;
  gps_accuracy_meters: number;
  proxy_info?: { name: string; relation: string; cni_number?: string };
}

export interface ClientInvoiceSummary {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  campaign_name: string;
  total_ttc: number;
  currency: string;
  status: 'ÉMISE' | 'PAYÉE' | 'EN_RETARD';
}
