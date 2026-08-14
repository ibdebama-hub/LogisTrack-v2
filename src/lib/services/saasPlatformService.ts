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
    // Try organisations first, then organizations
    let { count: tenantsCount, error: tErr } = await supabase.from('organisations').select('*', { count: 'exact', head: true });
    if (tErr || tenantsCount === null) {
      const res = await supabase.from('organizations').select('*', { count: 'exact', head: true });
      tenantsCount = res.count;
    }

    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: missionsCount } = await supabase.from('missions').select('*', { count: 'exact', head: true });
    const { count: agentsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'field_agent');

    const totalTenants = tenantsCount !== null && tenantsCount !== undefined ? tenantsCount : 1;
    const totalUsers = usersCount !== null && usersCount !== undefined ? usersCount : 1;
    const totalMissions = missionsCount !== null && missionsCount !== undefined ? missionsCount : 0;
    const totalAgents = agentsCount !== null && agentsCount !== undefined ? agentsCount : 0;

    return {
      total_tenants: totalTenants,
      active_tenants: totalTenants,
      total_users: totalUsers,
      active_agents: totalAgents,
      total_missions: totalMissions,
      storage_consumed_gb: 0.05,
      api_requests_24h: 1,
      system_health_status: 'HEALTHY'
    };
  } catch (e) {
    console.error('Error fetching platform monitoring KPIs:', e);
  }
  return MOCK_SAAS_MONITORING;
}

export async function fetchSaaSTenants(): Promise<SaaSTenant[]> {
  try {
    let { data: orgData, error } = await supabase.from('organisations').select('*');
    if (error || !orgData || orgData.length === 0) {
      const res = await supabase.from('organizations').select('*');
      orgData = res.data;
    }
    if (orgData && orgData.length > 0) {
      return orgData.map((t: any) => ({
        id: t.id,
        name: t.name,
        domain: t.slug ? `${t.slug}.logistrack.online` : 'master.logistrack.online',
        country: 'Côte d\'Ivoire',
        currency: 'XOF',
        timezone: 'Africa/Abidjan',
        plan_code: t.plan_tier || t.org_type || 'ENTERPRISE',
        status: 'ACTIVE',
        created_at: t.created_at ? t.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
      }));
    }
  } catch (e) {}
  return [];
}

export async function fetchSaaSPlans(): Promise<SaaSPlan[]> {
  return MOCK_SAAS_PLANS;
}

export async function fetchSaaSLicenses(): Promise<SaaSLicense[]> {
  return MOCK_SAAS_LICENSES;
}

export async function fetchSaaSInvoices(): Promise<SaaSInvoice[]> {
  return [];
}

export async function fetchPlatformAudits(): Promise<PlatformAuditLog[]> {
  try {
    const { data: auditData, error } = await supabase.from('audit_logs').select('*').limit(20);
    if (!error && auditData && auditData.length > 0) {
      return auditData.map((a: any) => ({
        id: a.id,
        action_type: a.action_type || 'SYSTEM_EVENT',
        performed_by: a.performed_by_email || 'Super Admin',
        target_tenant_name: a.organization_name || 'Système Master',
        details: a.action_details || 'Action enregistrée',
        created_at: a.created_at ? new Date(a.created_at).toLocaleString() : ''
      }));
    }
  } catch (e) {}
  return [];
}

export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  return [];
}
