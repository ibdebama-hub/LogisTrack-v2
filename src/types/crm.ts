export type LeadStage =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'DEMO_SCHEDULED'
  | 'DEMO_COMPLETED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'CONTRACT_SIGNED'
  | 'ACTIVATION'
  | 'ACTIVE_CLIENT'
  | 'LOST'
  | 'ON_HOLD';

export type AcquisitionChannel =
  | 'WEBSITE_DEMO'
  | 'SOCIAL_MEDIA'
  | 'RECOMMENDATION'
  | 'EXHIBITION'
  | 'PARTNER'
  | 'OUTBOUND_CALL'
  | 'INBOUND_EMAIL';

export interface LeadQualification {
  need_description: string;
  target_user_count: number;
  monthly_volume: number;
  estimated_budget_xof: number;
  implementation_timeline: 'IMMEDIATE' | 'WITHIN_30_DAYS' | 'WITHIN_90_DAYS';
  interest_score: number; // 1 - 100
  current_solution: string;
  main_pain_points: string[];
}

export interface Lead {
  id: string;
  company_name: string;
  logo_url?: string;
  industry_sector: string;
  country: string;
  city: string;
  address?: string;
  website?: string;
  company_size: 'SMALL' | 'MEDIUM' | 'ENTERPRISE';
  estimated_agents: number;
  estimated_monthly_missions: number;
  estimated_annual_revenue?: number;
  contact_name: string;
  contact_job_title: string;
  contact_phone: string;
  contact_email: string;
  acquisition_channel: AcquisitionChannel;
  stage: LeadStage;
  qualification_score: number;
  assigned_sales_rep: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CommercialDemo {
  id: string;
  lead_id: string;
  lead_company_name?: string;
  scheduled_at: string;
  mode: 'VIRTUAL' | 'IN_PERSON';
  sales_rep: string;
  participants: string[];
  summary?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  created_at: string;
}

export interface CommercialProposal {
  id: string;
  lead_id: string;
  proposal_number: string;
  plan_code: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  billing_cycle: 'MONTHLY' | 'ANNUAL';
  monthly_amount: number;
  annual_discount_pct: number;
  terms_conditions: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  valid_until: string;
  created_at: string;
}

export interface Contract {
  id: string;
  lead_id: string;
  contract_number: string;
  tenant_id?: string;
  plan_code: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  annual_value: number;
  start_date: string;
  end_date: string;
  status: 'DRAFT' | 'SENT' | 'SIGNED' | 'EXPIRED' | 'RENEWED';
  auto_onboarded: boolean;
  created_at: string;
}

export interface TrialTelemetry {
  tenant_id: string;
  company_name: string;
  plan_code: string;
  days_remaining: number;
  logins_count: number;
  campaigns_created: number;
  missions_executed: number;
  feature_usage_score: number; // 0 - 100
  churn_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  alert_level?: 'D-7' | 'D-3' | 'D-0';
}

export interface InteractionLog {
  id: string;
  lead_id: string;
  interaction_type: 'EMAIL' | 'CALL' | 'MEETING' | 'WHATSAPP' | 'SMS' | 'NOTE';
  summary: string;
  author_name: string;
  created_at: string;
}

export interface SalesKpis {
  total_leads: number;
  qualified_leads: number;
  demos_scheduled: number;
  proposals_sent: number;
  contracts_signed: number;
  conversion_rate_pct: number;
  mrr_xof: number;
  arr_xof: number;
  pipeline_value_xof: number;
  avg_sales_cycle_days: number;
}
