export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';

export type UserSecurityStatus = 'FORCE_PASSWORD_CHANGE' | 'ACTIVE' | 'LOCKED' | 'DISABLED';

export type LoginLogStatus = 'SUCCESS' | 'FAILED_PASSWORD' | 'ACCOUNT_LOCKED' | 'EXPIRED_TEMP_PASSWORD';

export interface OnboardingStep1OrgInfo {
  name: string;
  logo_url?: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  currency: string;
  timezone: string;
  language: string;
  industry_sector: string;
}

export interface OnboardingStep2PlanInfo {
  plan_code: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'TRIAL';
  billing_cycle: 'MONTHLY' | 'YEARLY';
  custom_users_limit?: number;
  custom_agents_limit?: number;
}

export interface OnboardingStep3PrimaryAdminInfo {
  first_name: string;
  last_name: string;
  job_title: string;
  phone: string;
  email: string;
}

export interface OnboardingWizardData {
  orgInfo: OnboardingStep1OrgInfo;
  planInfo: OnboardingStep2PlanInfo;
  adminInfo: OnboardingStep3PrimaryAdminInfo;
}

export interface TenantInvitation {
  id: string;
  tenant_id: string;
  tenant_name: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  invitation_token: string;
  temp_password?: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
  accepted_at?: string;
}

export interface UserSecurityProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  tenant_id: string;
  tenant_name: string;
  role: string;
  status: UserSecurityStatus;
  failed_login_attempts: number;
  must_change_password: boolean;
  terms_accepted: boolean;
  mfa_enabled: boolean;
  last_password_change_at?: string;
  created_at: string;
}

export interface UserLoginLog {
  id: string;
  user_id?: string;
  email: string;
  tenant_name?: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser: string;
  country: string;
  status: LoginLogStatus;
  failure_reason?: string;
  created_at: string;
}

export interface SecurityPolicy {
  id: string;
  tenant_id?: string;
  min_password_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_special_chars: boolean;
  temp_password_validity_hours: number;
  max_login_attempts: number;
  lockout_duration_minutes: number;
}

export interface ProvisioningResult {
  success: boolean;
  tenant_id: string;
  tenant_name: string;
  admin_user_id: string;
  admin_email: string;
  temp_password: string;
  invitation_token: string;
  created_at: string;
}
