import { Lead, LeadStage, SalesKpis, InteractionLog } from '@/types/crm';

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-101',
    company_name: 'Sahel Distribution Express',
    logo_url: '',
    industry_sector: 'DISTRIBUTION_COURRIER',
    country: "Côte d'Ivoire",
    city: 'Abidjan',
    company_size: 'ENTERPRISE',
    estimated_agents: 25,
    estimated_monthly_missions: 5000,
    estimated_annual_revenue: 12000000,
    contact_name: 'Ibrahim Traoré',
    contact_job_title: 'Directeur des Opérations',
    contact_phone: '+225 07 11 22 33 44',
    contact_email: 'i.traore@sahel-dist.ci',
    acquisition_channel: 'WEBSITE_DEMO',
    stage: 'DEMO_SCHEDULED',
    qualification_score: 85,
    assigned_sales_rep: 'Yves (Directeur Commercial)',
    notes: 'Besoin urgent de suivi GPS et certification POD avec signature client.',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-06T14:30:00Z'
  },
  {
    id: 'lead-102',
    company_name: 'Dakar Parcel Delivery',
    logo_url: '',
    industry_sector: 'EXPRESS_DELIVERY',
    country: 'Sénégal',
    city: 'Dakar',
    company_size: 'MEDIUM',
    estimated_agents: 12,
    estimated_monthly_missions: 2500,
    estimated_annual_revenue: 5400000,
    contact_name: 'Fatou Ndiaye',
    contact_job_title: 'Gérante Logistique',
    contact_phone: '+221 77 99 88 77',
    contact_email: 'f.ndiaye@dakar-parcel.sn',
    acquisition_channel: 'RECOMMENDATION',
    stage: 'PROPOSAL_SENT',
    qualification_score: 90,
    assigned_sales_rep: 'Mariam (Ingénieure Vente)',
    notes: 'Proposition envoyée pour le Pack Pro avec option COD Mobile Money.',
    created_at: '2026-07-28T09:15:00Z',
    updated_at: '2026-08-05T16:00:00Z'
  },
  {
    id: 'lead-103',
    company_name: 'Guinée Courrier & Banking',
    logo_url: '',
    industry_sector: 'TELECOM_BANKING',
    country: 'Guinée',
    city: 'Conakry',
    company_size: 'ENTERPRISE',
    estimated_agents: 40,
    estimated_monthly_missions: 12000,
    estimated_annual_revenue: 25000000,
    contact_name: 'Mamadou Sow',
    contact_job_title: 'Head of Logistics',
    contact_phone: '+224 620 55 66 77',
    contact_email: 'm.sow@guinee-courrier.gn',
    acquisition_channel: 'PARTNER',
    stage: 'CONTRACT_SIGNED',
    qualification_score: 98,
    assigned_sales_rep: 'Yves (Directeur Commercial)',
    notes: 'Contrat signé pour l\'offre Enterprise. Provisionnement automatique prêt.',
    created_at: '2026-07-15T11:00:00Z',
    updated_at: '2026-08-07T08:00:00Z'
  }
];

export class CrmService {
  private static leads: Lead[] = [...MOCK_LEADS];
  private static interactions: InteractionLog[] = [
    {
      id: 'int-1',
      lead_id: 'lead-101',
      interaction_type: 'CALL',
      summary: 'Premier appel de qualification. Intérêt très fort pour la PWA Agent et le suivi temps réel.',
      author_name: 'Yves (Directeur Commercial)',
      created_at: '2026-08-02T11:00:00Z'
    }
  ];

  public static async fetchLeads(): Promise<Lead[]> {
    return this.leads;
  }

  public static async createLeadFromLandingPage(formData: {
    company_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    estimated_agents?: number;
    notes?: string;
  }): Promise<Lead> {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      company_name: formData.company_name,
      industry_sector: 'DISTRIBUTION_COURRIER',
      country: "Côte d'Ivoire",
      city: 'Abidjan',
      company_size: (formData.estimated_agents || 10) > 20 ? 'ENTERPRISE' : 'MEDIUM',
      estimated_agents: formData.estimated_agents || 10,
      estimated_monthly_missions: (formData.estimated_agents || 10) * 150,
      contact_name: formData.contact_name,
      contact_job_title: 'Responsable Logistique',
      contact_phone: formData.contact_phone,
      contact_email: formData.contact_email,
      acquisition_channel: 'WEBSITE_DEMO',
      stage: 'NEW',
      qualification_score: 65,
      assigned_sales_rep: 'Yves (Directeur Commercial)',
      notes: formData.notes || 'Demande de démo transmise depuis la Landing Page.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.leads.unshift(newLead);
    return newLead;
  }

  public static async updateLeadStage(leadId: string, newStage: LeadStage): Promise<Lead | null> {
    const lead = this.leads.find((l) => l.id === leadId);
    if (lead) {
      lead.stage = newStage;
      lead.updated_at = new Date().toISOString();
      return lead;
    }
    return null;
  }

  public static async fetchInteractions(leadId: string): Promise<InteractionLog[]> {
    return this.interactions.filter((i) => i.lead_id === leadId);
  }

  public static async addInteraction(leadId: string, type: InteractionLog['interaction_type'], summary: string): Promise<InteractionLog> {
    const newLog: InteractionLog = {
      id: `int-${Date.now()}`,
      lead_id: leadId,
      interaction_type: type,
      summary,
      author_name: 'Yves (Directeur Commercial)',
      created_at: new Date().toISOString()
    };
    this.interactions.unshift(newLog);
    return newLog;
  }

  public static async fetchSalesKpis(): Promise<SalesKpis> {
    const total = this.leads.length;
    const qualified = this.leads.filter((l) => l.qualification_score >= 70).length;
    const signed = this.leads.filter((l) => l.stage === 'CONTRACT_SIGNED' || l.stage === 'ACTIVE_CLIENT').length;

    return {
      total_leads: total + 18,
      qualified_leads: qualified + 14,
      demos_scheduled: 12,
      proposals_sent: 8,
      contracts_signed: signed + 5,
      conversion_rate_pct: 32.5,
      mrr_xof: 14800000,
      arr_xof: 177600000,
      pipeline_value_xof: 45000000,
      avg_sales_cycle_days: 14
    };
  }
}
