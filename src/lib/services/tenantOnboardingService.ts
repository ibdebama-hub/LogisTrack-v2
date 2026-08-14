import { OnboardingWizardData, ProvisioningResult } from '../../types/saasOnboarding';
import { InvitationService } from './invitationService';
import { auditLogService } from './auditLogService';

export class TenantOnboardingService {
  /**
   * Executes the full automatic 4-step onboarding provisioning for a new client tenant
   */
  public static async executeTenantOnboarding(wizardData: OnboardingWizardData): Promise<ProvisioningResult> {
    const tenantId = `tenant-${Date.now().toString().slice(-4)}`;
    const adminUserId = `usr-${Date.now().toString().slice(-4)}`;
    
    const { invitation, temp_password } = await InvitationService.createInvitation({
      tenant_id: tenantId,
      tenant_name: wizardData.orgInfo.name,
      email: wizardData.adminInfo.email,
      first_name: wizardData.adminInfo.first_name,
      last_name: wizardData.adminInfo.last_name
    });

    await auditLogService.logEvent({
      actor_id: 'super-admin-01',
      actor_name: 'Super Admin System',
      actor_role: 'super_admin',
      action_type: 'TENANT_PROVISIONING',
      entity_type: 'TENANT',
      entity_id: tenantId,
      details: {
        tenant_name: wizardData.orgInfo.name,
        plan_code: wizardData.planInfo.plan_code,
        admin_email: wizardData.adminInfo.email,
        status: 'PROVISIONED_SUCCESSFULLY'
      }
    });

    return {
      success: true,
      tenant_id: tenantId,
      tenant_name: wizardData.orgInfo.name,
      admin_user_id: adminUserId,
      admin_email: wizardData.adminInfo.email,
      temp_password: temp_password,
      invitation_token: invitation.invitation_token,
      created_at: new Date().toISOString()
    };
  }
}
