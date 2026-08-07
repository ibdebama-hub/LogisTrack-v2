export type ConnectorCategory =
  | 'ERP'
  | 'CRM'
  | 'ECOMMERCE'
  | 'ACCOUNTING'
  | 'MOBILE_MONEY'
  | 'SMS_GATEWAY'
  | 'EMAIL_PROVIDER';

export type ConnectorType =
  | 'SAP'
  | 'ORACLE'
  | 'ODOO'
  | 'SALESFORCE'
  | 'HUBSPOT'
  | 'SHOPIFY'
  | 'WOOCOMMERCE'
  | 'ORANGE_MONEY'
  | 'WAVE'
  | 'MTN_MOMO'
  | 'TWILIO'
  | 'SENDGRID'
  | 'CUSTOM_REST';

export interface IntegrationConnector {
  id: string;
  tenant_id: string;
  name: string;
  category: ConnectorCategory;
  type: ConnectorType;
  base_url: string;
  auth_type: 'API_KEY' | 'OAUTH2' | 'BASIC' | 'BEARER';
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  sync_frequency_minutes: number;
  last_synced_at?: string;
  config_settings: Record<string, string>;
  created_at: string;
}
