import { GlobalSaaSSettings, SystemIntegrationsConfig } from '../types/masterSettings';

export const DEFAULT_GLOBAL_SAAS_SETTINGS: GlobalSaaSSettings = {
  primary_currency: 'XOF',
  supported_currencies: ['XOF', 'EUR', 'USD', 'GNF', 'NGN', 'GHS'],
  number_format: '1 500 000 FCFA',
  default_language: 'fr',
  default_timezone: 'Africa/Abidjan',
  editor_legal_name: 'Logistics West Africa SaaS Inc.',
  editor_tax_id: 'NIF-GN-2024-99812 / RCCM-CKY-2024',
  default_vat_rate: 18,
  invoice_prefix: 'INV-SAAS-2026-'
};

export const DEFAULT_SYSTEM_INTEGRATIONS: SystemIntegrationsConfig = {
  sms_provider: 'Orange SMS API / Hub2 Master Gateway',
  sms_api_key: 'sk_master_live_9981240981240981',
  smtp_host: 'smtp.sendgrid.net',
  smtp_port: 587,
  smtp_user: 'apikey',
  supabase_url: 'https://logistrack-v2.supabase.co',
  supabase_service_role_key: 'eyJhY2Nlc3NfdG9rZW4iOiJzdXBhYmFzZV9tYXN0ZXJfcm9sZSJ9'
};

import { CredentialService } from './services/credentialService';

/**
 * Generate a complex secure temporary password (delegated to CredentialService)
 */
export function generateSecurePassword(length: number = 18): string {
  return CredentialService.generateStrongTemporaryPassword(length);
}

