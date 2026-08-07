import { Contract, Lead } from '@/types/crm';
import { TenantOnboardingService } from './tenantOnboardingService';
import { ProvisioningResult } from '@/types/saasOnboarding';
import { CrmService } from './crmService';

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'ctr-101',
    lead_id: 'lead-103',
    contract_number: 'CTR-2026-001',
    tenant_id: 'tenant-101',
    plan_code: 'ENTERPRISE',
    annual_value: 11400000,
    start_date: '2026-08-01',
    end_date: '2027-08-01',
    status: 'SIGNED',
    auto_onboarded: true,
    created_at: '2026-08-01'
  }
];

export class ContractService {
  private static contracts: Contract[] = [...MOCK_CONTRACTS];

  public static async fetchContracts(): Promise<Contract[]> {
    return this.contracts;
  }

  /**
   * Signs a contract and automatically triggers the existing TenantOnboardingService workflow!
   */
  public static async signContractAndTriggerOnboarding(
    contractId: string,
    leadData: Lead
  ): Promise<{ contract: Contract; provisioningResult: ProvisioningResult }> {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (!contract) {
      throw new Error(`Contrat ${contractId} introuvable.`);
    }

    contract.status = 'SIGNED';

    // Trigger existing single onboarding workflow
    const names = leadData.contact_name.split(' ');
    const firstName = names[0] || 'Admin';
    const lastName = names.slice(1).join(' ') || 'Principal';

    const provisioningResult = await TenantOnboardingService.executeTenantOnboarding({
      orgInfo: {
        name: leadData.company_name,
        country: leadData.country || "Côte d'Ivoire",
        city: leadData.city || 'Abidjan',
        address: leadData.address || '',
        phone: leadData.contact_phone,
        email: leadData.contact_email,
        website: leadData.website || '',
        currency: 'XOF',
        timezone: 'Africa/Abidjan',
        language: 'fr',
        industry_sector: leadData.industry_sector
      },
      planInfo: {
        plan_code: contract.plan_code,
        billing_cycle: 'YEARLY'
      },
      adminInfo: {
        first_name: firstName,
        last_name: lastName,
        job_title: leadData.contact_job_title,
        phone: leadData.contact_phone,
        email: leadData.contact_email
      }
    });

    contract.tenant_id = provisioningResult.tenant_id;
    contract.auto_onboarded = true;

    // Update CRM Lead stage to ACTIVE_CLIENT
    await CrmService.updateLeadStage(leadData.id, 'ACTIVE_CLIENT');

    return { contract, provisioningResult };
  }

  public static async createContract(data: Omit<Contract, 'id' | 'created_at'>): Promise<Contract> {
    const newContract: Contract = {
      ...data,
      id: `ctr-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    this.contracts.unshift(newContract);
    return newContract;
  }
}
