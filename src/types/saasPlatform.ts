export interface SaaSPlan {
  id: string;
  code: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'CUSTOM';
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  max_users: number;
  max_agents: number;
  storage_limit_gb: number;
  is_active: boolean;
}

export interface SaaSTenant {
  id: string;
  name: string;
  domain?: string;
  country: string;
  currency: string;
  timezone: string;
  plan_code: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED';
  created_at: string;
}

export interface SaaSLicense {
  id: string;
  tenant_id: string;
  tenant_name: string;
  license_key: string;
  status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  start_date: string;
  expires_at: string;
  auto_renew: boolean;
}

export interface SaaSInvoice {
  id: string;
  invoice_number: string;
  tenant_id: string;
  tenant_name: string;
  amount: number;
  currency: string;
  billing_period: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paid_at?: string;
  created_at: string;
}

export interface FeatureFlagItem {
  id: string;
  feature_key: string;
  feature_label: string;
  tenant_id?: string;
  tenant_name?: string;
  is_enabled: boolean;
}

export interface PlatformMonitoringKpis {
  total_tenants: number;
  active_tenants: number;
  total_users: number;
  active_agents: number;
  total_missions: number;
  storage_consumed_gb: number;
  api_requests_24h: number;
  system_health_status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
}

export interface PlatformAuditLog {
  id: string;
  action_type: string;
  performed_by: string;
  target_tenant_name?: string;
  details: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  tenant_id: string;
  tenant_name: string;
  subject: string;
  category: 'BILLING' | 'TECHNICAL' | 'FEATURE_REQUEST' | 'BUG';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  created_at: string;
}

export interface ApiKeyItem {
  id: string;
  tenant_id: string;
  tenant_name: string;
  key_name: string;
  masked_key: string;
  rate_limit_per_min: number;
  is_active: boolean;
  last_used_at?: string;
  created_at: string;
}
