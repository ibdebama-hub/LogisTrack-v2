import { supabase } from '@/lib/supabase/queries';
import {
  SaaSTenant,
  SaaSPlan,
  SaaSLicense,
  SaaSInvoice,
  PlatformMonitoringKpis,
  PlatformAuditLog,
  SupportTicket
} from '@/types/saasPlatform';

export const MOCK_SAAS_MONITORING: PlatformMonitoringKpis = {
  total_tenants: 24,
  active_tenants: 22,
  total_users: 340,
  active_agents: 185,
  total_missions: 124500,
  storage_consumed_gb: 142.8,
  api_requests_24h: 185400,
  system_health_status: 'HEALTHY'
};

export const MOCK_SAAS_PLANS: SaaSPlan[] = [
  {
    id: 'p-1',
    code: 'STARTER',
    name: 'Pack Starter Distribution',
    description: 'Idéal pour petites flottes jusqu\'à 10 agents.',
    price_monthly: 150000,
    price_yearly: 1500000,
    currency: 'XOF',
    max_users: 5,
    max_agents: 10,
    storage_limit_gb: 20,
    is_active: true
  },
  {
    id: 'p-2',
    code: 'PROFESSIONAL',
    name: 'Pack Pro Messagerie & COD',
    description: 'Idéal pour entreprises moyennes avec suivi cartographique live et COD.',
    price_monthly: 450000,
    price_yearly: 4500000,
    currency: 'XOF',
    max_users: 25,
    max_agents: 50,
    storage_limit_gb: 100,
    is_active: true
  },
  {
    id: 'p-3',
    code: 'ENTERPRISE',
    name: 'Pack Enterprise Full SaaS',
    description: 'Solution illimitée avec Business Intelligence, API REST B2B et support dédié 24/7.',
    price_monthly: 950000,
    price_yearly: 9500000,
    currency: 'XOF',
    max_users: 100,
    max_agents: 250,
    storage_limit_gb: 500,
    is_active: true
  }
];

export const MOCK_SAAS_TENANTS: SaaSTenant[] = [
  {
    id: 'tenant-101',
    name: 'Logistics West Africa (Siège Abidjan)',
    domain: 'lwa-logistics.ci',
    country: 'Côte d\'Ivoire',
    currency: 'XOF',
    timezone: 'Africa/Abidjan',
    plan_code: 'ENTERPRISE',
    status: 'ACTIVE',
    created_at: '2026-01-10'
  },
  {
    id: 'tenant-102',
    name: 'Bamako Express Distribution',
    domain: 'bamako-express.ml',
    country: 'Mali',
    currency: 'XOF',
    timezone: 'Africa/Bamako',
    plan_code: 'PROFESSIONAL',
    status: 'ACTIVE',
    created_at: '2026-02-15'
  }
];

export const MOCK_SAAS_LICENSES: SaaSLicense[] = [
  {
    id: 'lic-1',
    tenant_id: 'tenant-101',
    tenant_name: 'Logistics West Africa',
    license_key: 'LGT-2026-ENT-9921-XOF',
    status: 'ACTIVE',
    start_date: '2026-01-01',
    expires_at: '2027-01-01',
    auto_renew: true
  }
];

export const MOCK_SAAS_INVOICES: SaaSInvoice[] = [
  {
    id: 'inv-101',
    invoice_number: 'FAC-SAAS-2026-001',
    tenant_id: 'tenant-101',
    tenant_name: 'Logistics West Africa',
    amount: 950000,
    currency: 'XOF',
    billing_period: 'Août 2026',
    status: 'PAID',
    paid_at: '2026-08-01',
    created_at: '2026-08-01'
  }
];

export const MOCK_SAAS_AUDITS: PlatformAuditLog[] = [
  {
    id: 'aud-1',
    action_type: 'TENANT_UPGRADE',
    performed_by: 'Super Admin (Yves)',
    target_tenant_name: 'Logistics West Africa',
    details: 'Passage du plan Professional au plan Enterprise.',
    created_at: '2026-08-06 10:15'
  }
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 't-1',
    ticket_number: 'TCK-2026-042',
    tenant_id: 'tenant-101',
    tenant_name: 'Logistics West Africa',
    subject: 'Demande d\'augmentation de la limite de stockage Supabase',
    category: 'TECHNICAL',
    priority: 'HIGH',
    status: 'OPEN',
    created_at: '09:40'
  }
];

export async function fetchPlatformMonitoringKpis(): Promise<PlatformMonitoringKpis> {
  try {
    const { data } = await supabase.rpc('get_platform_monitoring_kpis');
    if (data) return data as PlatformMonitoringKpis;
  } catch (e) {}
  return MOCK_SAAS_MONITORING;
}

export async function fetchSaaSTenants(): Promise<SaaSTenant[]> {
  return MOCK_SAAS_TENANTS;
}

export async function fetchSaaSPlans(): Promise<SaaSPlan[]> {
  return MOCK_SAAS_PLANS;
}

export async function fetchSaaSLicenses(): Promise<SaaSLicense[]> {
  return MOCK_SAAS_LICENSES;
}

export async function fetchSaaSInvoices(): Promise<SaaSInvoice[]> {
  return MOCK_SAAS_INVOICES;
}

export async function fetchPlatformAudits(): Promise<PlatformAuditLog[]> {
  return MOCK_SAAS_AUDITS;
}

export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  return MOCK_SUPPORT_TICKETS;
}
