export type SubscriptionPlanType = 'TRIAL' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';

export type BillingCycle = 'MONTHLY' | 'ANNUAL';

export interface TenantCompany {
  id: string;
  company_name: string;
  country: string;
  city: string;
  logo_url?: string;
  created_at: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  plan_type: SubscriptionPlanType;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;
  monthly_price: number;
  per_item_rate: number;
  active_agents_count: number;
  max_agents_allowed: number;
  monthly_items_processed: number;
  max_items_allowed: number;
  sms_quota_used: number;
  sms_quota_max: number;
  is_pay_as_you_go: boolean;
}

export interface MasterFinancialKPIs {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  active_tenants_count: number;
  total_items_processed_month: number;
  trial_conversion_rate: number;
  churn_rate: number;
  plan_distribution: { plan: SubscriptionPlanType; count: number; percentage: number }[];
}
