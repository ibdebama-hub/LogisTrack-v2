export type SmsProviderType =
  | 'ORANGE_SMS'
  | 'HUB2'
  | 'WAVE'
  | 'TWILIO'
  | 'INFOBIP'
  | 'CUSTOM_WEBHOOK';

export type UserSystemRole =
  | 'ADMINISTRATEUR'
  | 'DISPATCHER'
  | 'CAISSIER'
  | 'CHEF_DE_ZONE'
  | 'AGENT_TERRAIN';

export interface SmsGatewayConfigModel {
  provider: SmsProviderType;
  provider_name: string;
  is_active: boolean;
  api_key: string;
  api_secret?: string;
  sender_id: string; // e.g. "LOGISTRACK"
  webhook_url?: string;
  sms_balance_credits: number;
}

export interface SmsTemplate {
  id: string;
  name: string;
  event_trigger: 'DISPATCH_NOTICE' | 'OTP_VALIDATION' | 'DELIVERY_PROOF_NOTICE' | 'FAILURE_ALERT';
  content: string; // e.g. "Cher {nom}, votre pli {ref} sera distribué par {agent}. Suivi: {lien}"
  is_enabled: boolean;
}

export interface OrganizationProfile {
  company_name: string;
  logo_url: string;
  address: string;
  phone_support: string;
  email_support: string;
  nif_rcm: string;
  default_currency: string; // 'FCFA' | 'GNF' | 'USD' | 'EUR'
  theme_accent_color: string;
  print_footer_note: string;
}

export interface SystemUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserSystemRole;
  status: 'ACTIF' | 'SUSPENDU';
  last_login: string;
  avatar_url?: string;
  zone_assigned?: string;
}
