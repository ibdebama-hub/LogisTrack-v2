import { Lead } from '@/types/crm';
import { CrmService } from './crmService';
import { ContractService } from './contractService';

export class SalesAutomationEngine {
  /**
   * Automatically processes sales automation rules
   */
  public static async onNewLeadCreated(lead: Lead): Promise<void> {
    // 1. Auto-assign sales rep based on territory or size
    if (lead.company_size === 'ENTERPRISE') {
      lead.assigned_sales_rep = 'Yves (Directeur Commercial)';
    } else {
      lead.assigned_sales_rep = 'Mariam (Ingénieure Vente)';
    }

    // 2. Log initial system note
    await CrmService.addInteraction(
      lead.id,
      'NOTE',
      `[Automatisation Commerciale] Lead attribué automatiquement à ${lead.assigned_sales_rep}. Qualification en cours.`
    );
  }

  /**
   * Triggers automatic onboarding when contract is signed
   */
  public static async onContractSigned(contractId: string, lead: Lead): Promise<void> {
    await ContractService.signContractAndTriggerOnboarding(contractId, lead);
    await CrmService.addInteraction(
      lead.id,
      'NOTE',
      `[Automatisation Commerciale] Contrat signé. Provisionnement automatique du Tenant Supabase exécuté avec succès.`
    );
  }
}
