import { useState, useEffect, useCallback } from 'react';
import {
  OnboardingWizardData,
  ProvisioningResult,
  TenantInvitation,
  UserSecurityProfile,
  UserLoginLog
} from '@/types/saasOnboarding';
import { TenantOnboardingService } from '@/lib/services/tenantOnboardingService';
import { InvitationService } from '@/lib/services/invitationService';
import { IdentityManagementService } from '@/lib/services/identityManagementService';
import { SecurityPolicyService } from '@/lib/services/securityPolicyService';

export function useTenantOnboarding() {
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserSecurityProfile[]>([]);
  const [loginLogs, setLoginLogs] = useState<UserLoginLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastProvisionedResult, setLastProvisionedResult] = useState<ProvisioningResult | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [invs, users, logs] = await Promise.all([
        InvitationService.fetchAllInvitations(),
        IdentityManagementService.fetchUserSecurityProfiles(),
        SecurityPolicyService.fetchLoginLogs()
      ]);
      setInvitations(invs);
      setUserProfiles(users);
      setLoginLogs(logs);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const submitOnboardingWizard = async (wizardData: OnboardingWizardData): Promise<ProvisioningResult> => {
    setIsLoading(true);
    try {
      const result = await TenantOnboardingService.executeTenantOnboarding(wizardData);
      setLastProvisionedResult(result);
      await loadData();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const resendInvitation = async (invitationId: string) => {
    await InvitationService.resendInvitation(invitationId);
    await loadData();
  };

  const cancelInvitation = async (invitationId: string) => {
    await InvitationService.cancelInvitation(invitationId);
    await loadData();
  };

  const toggleUserLock = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    await IdentityManagementService.setUserStatus(userId, nextStatus);
    await loadData();
  };

  const forcePasswordReset = async (userId: string) => {
    const res = await IdentityManagementService.forcePasswordReset(userId);
    await loadData();
    return res.temp_password;
  };

  return {
    invitations,
    userProfiles,
    loginLogs,
    isLoading,
    lastProvisionedResult,
    submitOnboardingWizard,
    resendInvitation,
    cancelInvitation,
    toggleUserLock,
    forcePasswordReset,
    refresh: loadData
  };
}
