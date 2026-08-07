import { UserSecurityProfile, UserSecurityStatus } from '@/types/saasOnboarding';
import { CredentialService } from './credentialService';
import { auditLogService } from './auditLogService';

const MOCK_USER_PROFILES: UserSecurityProfile[] = [
  {
    id: 'usr-super-admin-01',
    user_id: 'usr-super-admin-01',
    email: 'master.admin@logistrack.online',
    full_name: 'Ibrahima Kassambara (Platform Owner)',
    tenant_id: 'tenant-master-owner',
    tenant_name: 'LogisTrack SaaS Master System',
    role: 'Super Administrator (Platform Owner)',
    status: 'ACTIVE',
    failed_login_attempts: 0,
    must_change_password: false,
    terms_accepted: true,
    mfa_enabled: true,
    last_password_change_at: '2026-08-01T08:00:00Z',
    created_at: '2026-07-01T00:00:00Z'
  },
  {
    id: 'usr-101',
    user_id: 'usr-101',
    email: 'k.toure@lwa-logistics.ci',
    full_name: 'Kouassi Touré',
    tenant_id: 'tenant-101',
    tenant_name: 'Logistics West Africa (Siège Abidjan)',
    role: 'Dispatcher Administrator',
    status: 'ACTIVE',
    failed_login_attempts: 0,
    must_change_password: false,
    terms_accepted: true,
    mfa_enabled: false,
    last_password_change_at: '2026-08-01T10:20:00Z',
    created_at: '2026-08-01T09:00:00Z'
  },
  {
    id: 'usr-102',
    user_id: 'usr-102',
    email: 'm.keita@bamako-express.ml',
    full_name: 'Moussa Keïta',
    tenant_id: 'tenant-102',
    tenant_name: 'Bamako Express Distribution',
    role: 'Dispatcher Administrator',
    status: 'FORCE_PASSWORD_CHANGE',
    failed_login_attempts: 0,
    must_change_password: true,
    terms_accepted: false,
    mfa_enabled: false,
    created_at: '2026-08-05T14:30:00Z'
  },
  {
    id: 'usr-103',
    user_id: 'usr-103',
    email: 's.camara@banqueatlantique.gn',
    full_name: 'Sory Camara',
    tenant_id: 'tenant-103',
    tenant_name: 'Banque Atlantique Guinée',
    role: 'Client B2B Manager',
    status: 'LOCKED',
    failed_login_attempts: 5,
    must_change_password: false,
    terms_accepted: true,
    mfa_enabled: true,
    created_at: '2026-07-20T11:00:00Z'
  }
];

export class IdentityManagementService {
  private static userProfilesStore: UserSecurityProfile[] = [...MOCK_USER_PROFILES];

  public static async fetchUserSecurityProfiles(searchQuery?: string): Promise<UserSecurityProfile[]> {
    if (!searchQuery) return this.userProfilesStore;
    const query = searchQuery.toLowerCase();
    return this.userProfilesStore.filter(
      u =>
        u.email.toLowerCase().includes(query) ||
        u.full_name.toLowerCase().includes(query) ||
        u.tenant_name.toLowerCase().includes(query)
    );
  }

  public static async setUserStatus(userId: string, newStatus: UserSecurityStatus): Promise<UserSecurityProfile> {
    const profile = this.userProfilesStore.find(u => u.id === userId);
    if (!profile) throw new Error('Utilisateur non trouvé.');

    profile.status = newStatus;
    if (newStatus === 'ACTIVE') {
      profile.failed_login_attempts = 0;
    }

    await auditLogService.logEvent({
      actor_id: 'super-admin-01',
      actor_name: 'Super Admin System',
      actor_role: 'super_admin',
      action_type: 'SETTINGS_UPDATE',
      entity_type: 'USER',
      entity_id: userId,
      details: { email: profile.email, new_status: newStatus }
    });

    return profile;
  }

  public static async forcePasswordReset(userId: string): Promise<{ profile: UserSecurityProfile; temp_password: string }> {
    const profile = this.userProfilesStore.find(u => u.id === userId);
    if (!profile) throw new Error('Utilisateur non trouvé.');

    const tempPassword = CredentialService.generateStrongTemporaryPassword(18);
    profile.status = 'FORCE_PASSWORD_CHANGE';
    profile.must_change_password = true;

    await auditLogService.logEvent({
      actor_id: 'super-admin-01',
      actor_name: 'Super Admin System',
      actor_role: 'super_admin',
      action_type: 'SETTINGS_UPDATE',
      entity_type: 'USER',
      entity_id: userId,
      details: { email: profile.email, action: 'FORCE_PASSWORD_RESET' }
    });

    return { profile, temp_password: tempPassword };
  }

  public static async transferPrimaryAdminRole(tenantId: string, currentAdminId: string, newAdminId: string): Promise<boolean> {
    const currentAdmin = this.userProfilesStore.find(u => u.id === currentAdminId);
    const newAdmin = this.userProfilesStore.find(u => u.id === newAdminId);

    if (currentAdmin) currentAdmin.role = 'Dispatcher Supervisor';
    if (newAdmin) newAdmin.role = 'Dispatcher Administrator';

    await auditLogService.logEvent({
      actor_id: 'super-admin-01',
      actor_name: 'Super Admin System',
      actor_role: 'super_admin',
      action_type: 'SETTINGS_UPDATE',
      entity_type: 'TENANT',
      entity_id: tenantId,
      details: { previous_admin: currentAdminId, new_admin: newAdminId, action: 'TRANSFER_PRIMARY_ADMIN' }
    });

    return true;
  }
}
