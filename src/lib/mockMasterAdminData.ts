import { TenantCompany, MasterFinancialKPIs } from '../types/masterAdmin';

export const MOCK_TENANTS: TenantCompany[] = [
  {
    id: 'tenant-101',
    company_name: 'Logistics West Africa Conakry',
    country: 'Guinée',
    city: 'Conakry',
    created_at: '2025-11-15',
    owner_name: 'Mamadou Diallo (CEO)',
    owner_email: 'm.diallo@logistics-wa.gn',
    owner_phone: '+224 620 45 88 12',
    plan_type: 'PRO',
    status: 'ACTIVE',
    billing_cycle: 'MONTHLY',
    monthly_price: 350000, // FCFA / GNF equiv
    per_item_rate: 25,
    active_agents_count: 14,
    max_agents_allowed: 25,
    monthly_items_processed: 18500,
    max_items_allowed: 50000,
    sms_quota_used: 4200,
    sms_quota_max: 10000,
    is_pay_as_you_go: true
  },
  {
    id: 'tenant-102',
    company_name: 'Express Mail Abidjan',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    created_at: '2026-01-10',
    owner_name: 'Koffi Jean-Baptiste',
    owner_email: 'k.jean@expressmail.ci',
    owner_phone: '+225 07 58 90 12',
    plan_type: 'ENTERPRISE',
    status: 'ACTIVE',
    billing_cycle: 'ANNUAL',
    monthly_price: 850000,
    per_item_rate: 18,
    active_agents_count: 48,
    max_agents_allowed: 100,
    monthly_items_processed: 125000,
    max_items_allowed: 200000,
    sms_quota_used: 28500,
    sms_quota_max: 50000,
    is_pay_as_you_go: true
  },
  {
    id: 'tenant-103',
    company_name: 'Sahel Messagerie Bamako',
    country: 'Mali',
    city: 'Bamako',
    created_at: '2026-03-20',
    owner_name: 'Amadou Traoré',
    owner_email: 'a.traore@sahel-express.ml',
    owner_phone: '+223 76 11 22 33',
    plan_type: 'STARTER',
    status: 'ACTIVE',
    billing_cycle: 'MONTHLY',
    monthly_price: 150000,
    per_item_rate: 30,
    active_agents_count: 4,
    max_agents_allowed: 5,
    monthly_items_processed: 4200,
    max_items_allowed: 5000,
    sms_quota_used: 980,
    sms_quota_max: 1000,
    is_pay_as_you_go: false
  },
  {
    id: 'tenant-104',
    company_name: 'Teranga Logistics Dakar',
    country: 'Sénégal',
    city: 'Dakar',
    created_at: '2026-06-05',
    owner_name: 'Ousmane Sow',
    owner_email: 'o.sow@terangalogistics.sn',
    owner_phone: '+221 77 412 90 80',
    plan_type: 'TRIAL',
    status: 'ACTIVE',
    billing_cycle: 'MONTHLY',
    monthly_price: 0,
    per_item_rate: 0,
    active_agents_count: 2,
    max_agents_allowed: 5,
    monthly_items_processed: 850,
    max_items_allowed: 1000,
    sms_quota_used: 120,
    sms_quota_max: 500,
    is_pay_as_you_go: false
  }
];

export const MOCK_MASTER_KPIS: MasterFinancialKPIs = {
  mrr: 1350000, // Monthly Recurring Revenue
  arr: 16200000, // Annual Recurring Revenue
  active_tenants_count: 4,
  total_items_processed_month: 148550,
  trial_conversion_rate: 78.5,
  churn_rate: 1.2,
  plan_distribution: [
    { plan: 'ENTERPRISE', count: 1, percentage: 25.0 },
    { plan: 'PRO', count: 1, percentage: 25.0 },
    { plan: 'STARTER', count: 1, percentage: 25.0 },
    { plan: 'TRIAL', count: 1, percentage: 25.0 }
  ]
};
