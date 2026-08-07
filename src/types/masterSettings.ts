export interface GlobalSaaSSettings {
  primary_currency: string; // e.g. "XOF"
  supported_currencies: string[]; // e.g. ["XOF", "EUR", "USD", "GNF", "NGN"]
  number_format: string; // e.g. "1 500 000 FCFA"
  default_language: 'fr' | 'en';
  default_timezone: string; // e.g. "Africa/Abidjan"
  editor_legal_name: string;
  editor_tax_id: string; // NIF / RCCM
  default_vat_rate: number; // e.g. 18
  invoice_prefix: string; // e.g. "INV-SAAS-2026-"
}


export interface SystemIntegrationsConfig {
  sms_provider: string;
  sms_api_key: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  supabase_url: string;
  supabase_service_role_key: string;
}
