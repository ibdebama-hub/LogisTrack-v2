export type UserRole =
  | 'super_admin'
  | 'company_admin'
  | 'dispatcher'
  | 'cashier'
  | 'team_leader'
  | 'field_agent'
  | 'client_viewer';

export type ItemType = 'invoice' | 'package' | 'simple_mail' | 'registered_mail';

export type OperationType =
  | 'MASS_INVOICE_DISTRIBUTION'
  | 'CONFIDENTIAL_MAIL'
  | 'PARCEL_DELIVERY_COD'
  | 'EXPRESS_COURIER';

export type PaymentStatus =
  | 'NO_PAYMENT_REQUIRED'
  | 'PENDING_COD'
  | 'PAID_ONLINE'
  | 'COLLECTED_COD';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export type BatchStatus = 'created' | 'assigned' | 'in_progress' | 'reconciled' | 'closed';

export type ItemStatus =
  | 'pending'
  | 'batched'
  | 'assigned'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'returned';

export type FailureReason =
  | 'client_moved'
  | 'address_not_found'
  | 'recipient_absent'
  | 'cod_payment_refused'
  | 'phone_unreachable'
  | 'mailbox_full'
  | 'access_denied';

export type PoDType =
  | 'signature'
  | 'photo_door'
  | 'proxy_receiver'
  | 'mailbox_drop'
  | 'otp_code';

export interface Client {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  logo_url?: string;
  contact_email: string;
  contact_phone: string;
  contract_type: 'corporate_key_account' | 'sme' | 'ecommerce_merchant';
  color: string;
  active_campaigns_count: number;
}

export interface District {
  id: string;
  zone_id: string;
  name: string;
  postal_code?: string;
  active_item_count?: number;
  assigned_agents_count?: number;
}

export interface ZoneTerritory {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  region_name?: string;
  city_name?: string;
  sector_name?: string;
  description?: string;
  color?: string;
  districts?: District[];
  assigned_agents_count?: number;
  created_at?: string;
}

export type Zone = ZoneTerritory;

export interface AgentAssignment {
  id: string;
  user_id: string;
  agent_name: string;
  agent_phone: string;
  zone_id: string;
  zone_code: string;
  zone_name: string;
  district_ids: string[];
  district_names: string[];
  is_primary: boolean;
  active_workload: number;
}

export interface FieldAgent {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  primary_zone_id?: string;
  primary_zone_code?: string;
  assigned_zone_codes: string[];
  active_workload_count: number;
  avatar_url?: string;
}

export interface ImportedRow {
  id: string;
  tracking_number: string;
  client_id?: string;
  client_code?: string;
  client_name?: string;
  operation_type?: OperationType;
  item_type: ItemType;
  payment_status: PaymentStatus;
  recipient_name: string;
  recipient_phone: string;
  address_raw: string;
  landmark_description?: string;
  city?: string;
  district?: string;
  zone_code: string;
  matched_zone_id?: string;
  cod_amount: number;
  due_date: string;
  status: 'valid' | 'warning' | 'error';
  validation_errors: string[];
  auto_assigned_agent_id?: string;
  suggested_agent_id?: string;
}

export interface BatchAssignmentSummary {
  zone_code: string;
  zone_name: string;
  total_items: number;
  total_cod: number;
  assigned_agent?: FieldAgent;
  item_ids: string[];
}
