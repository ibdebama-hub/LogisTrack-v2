import { IntegrationConnector } from '../../types/integrations';

export class IntegrationService {
  private static connectors: IntegrationConnector[] = [
    {
      id: 'conn-1',
      tenant_id: 'tenant-101',
      name: 'Connecteur SAP S/4HANA Enterprise',
      category: 'ERP',
      type: 'SAP',
      base_url: 'https://sap.lwa-logistics.ci:8000/sap/bc/srt/rfc',
      auth_type: 'OAUTH2',
      status: 'ACTIVE',
      sync_frequency_minutes: 15,
      last_synced_at: 'Il y a 5 min',
      config_settings: {
        client_id: 'SAP_CLIENT_800',
        system_number: '01'
      },
      created_at: '2026-02-10'
    },
    {
      id: 'conn-2',
      tenant_id: 'tenant-101',
      name: 'Connecteur Salesforce CRM',
      category: 'CRM',
      type: 'SALESFORCE',
      base_url: 'https://lwa.my.salesforce.com/services/data/v58.0',
      auth_type: 'OAUTH2',
      status: 'ACTIVE',
      sync_frequency_minutes: 30,
      last_synced_at: 'Il y a 12 min',
      config_settings: {
        instance_url: 'https://lwa.my.salesforce.com'
      },
      created_at: '2026-04-15'
    },
    {
      id: 'conn-3',
      tenant_id: 'tenant-101',
      name: 'Passerelle Orange Money B2B API',
      category: 'MOBILE_MONEY',
      type: 'ORANGE_MONEY',
      base_url: 'https://api.orange.com/orange-money-webpay/dev/v1',
      auth_type: 'BEARER',
      status: 'ACTIVE',
      sync_frequency_minutes: 5,
      last_synced_at: 'Il y a 1 min',
      config_settings: {
        merchant_key: 'om_live_key_9981'
      },
      created_at: '2026-01-20'
    }
  ];

  public static async fetchConnectors(): Promise<IntegrationConnector[]> {
    return this.connectors;
  }

  public static async createConnector(data: Omit<IntegrationConnector, 'id' | 'created_at'>): Promise<IntegrationConnector> {
    const newConn: IntegrationConnector = {
      ...data,
      id: `conn-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.connectors.unshift(newConn);
    return newConn;
  }

  public static async toggleConnectorStatus(id: string): Promise<void> {
    const conn = this.connectors.find((c) => c.id === id);
    if (conn) {
      conn.status = conn.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }
  }
}
