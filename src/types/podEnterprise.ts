export type PoDPhotoCategory =
  | 'FACADE'
  | 'MAILBOX'
  | 'DOCUMENT'
  | 'PACKAGE'
  | 'SIGNATURE'
  | 'OTHER';

export type GpsConformanceStatus = 'CONFORME' | 'A_VERIFIER' | 'ANORMAL';

export type PoDStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PoDPhoto {
  id: string;
  category: PoDPhotoCategory;
  url: string;
  timestamp: string;
  lat?: number;
  lng?: number;
}

export interface PoDAuditEntry {
  id: string;
  pod_id: string;
  action_type: 'CAPTURE' | 'APPROVE' | 'REJECT' | 'PDF_GENERATE';
  performed_by: string;
  notes?: string;
  created_at: string;
}

export interface PoDRecordEnterprise {
  id: string;
  pod_number: string;
  mission_id: string;
  mission_number: string;
  organization_id: string;
  client_id: string;
  client_name: string;
  campaign_name: string;
  recipient_name: string;
  recipient_phone: string;
  address_raw: string;
  agent_id: string;
  agent_name: string;
  delivered_at: string;
  
  // GPS Conformance
  gps_lat: number;
  gps_lng: number;
  gps_distance_diff_meters: number;
  conformance_status: GpsConformanceStatus;

  // Proofs & Hash
  signature_url: string;
  signature_hash: string;
  signer_name: string;
  signer_role: 'RECIPIENT' | 'PROXY_FAMILY' | 'PROXY_COLLEAGUE' | 'AGENT';
  photos: PoDPhoto[];

  // Dispatcher Audit
  status: PoDStatus;
  audited_by?: string;
  audited_at?: string;
  audit_notes?: string;

  created_at: string;
  audit_trail?: PoDAuditEntry[];
}

export interface PoDKpisEnterprise {
  total_generated: number;
  approved: number;
  pending: number;
  rejected: number;
  gps_conformance_rate: number;
  avg_validation_time_min: number;
}
