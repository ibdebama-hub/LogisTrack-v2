import { WebhookEndpoint, WebhookEventType, WebhookPayload, WebhookDeliveryLog } from '../../types/webhooks';

export class WebhookService {
  private static endpoints: WebhookEndpoint[] = [
    {
      id: 'wh-1',
      client_id: 'tenant-101',
      name: 'ERP SAP Production Webhook',
      url: 'https://sap-gateway.lwa-logistics.ci/api/webhooks/logistrack',
      secret: 'whsec_99281740192834710293847',
      subscribed_events: [
        'mission.created',
        'mission.delivered',
        'pod.certified',
        'cod.confirmed',
        'campaign.completed'
      ],
      is_active: true,
      retry_count: 3,
      failure_count: 0,
      created_at: '2026-03-01'
    }
  ];

  private static deliveryLogs: WebhookDeliveryLog[] = [];

  public static async fetchEndpoints(): Promise<WebhookEndpoint[]> {
    return this.endpoints;
  }

  public static async createEndpoint(data: Omit<WebhookEndpoint, 'id' | 'failure_count' | 'created_at'>): Promise<WebhookEndpoint> {
    const newEndpoint: WebhookEndpoint = {
      ...data,
      id: `wh-${Date.now()}`,
      failure_count: 0,
      created_at: new Date().toISOString()
    };
    this.endpoints.unshift(newEndpoint);
    return newEndpoint;
  }

  public static async dispatchEvent<T>(event: WebhookEventType, tenantId: string, data: T): Promise<void> {
    const targetEndpoints = this.endpoints.filter(
      (e) => e.client_id === tenantId && e.is_active && e.subscribed_events.includes(event)
    );

    for (const ep of targetEndpoints) {
      const payload: WebhookPayload<T> = {
        id: `evt-${Date.now()}`,
        event,
        tenant_id: tenantId,
        timestamp: new Date().toISOString(),
        signature: `sha256=${Math.random().toString(36).slice(2)}`,
        data
      };

      // Mock delivery execution
      const deliveryLog: WebhookDeliveryLog = {
        id: `deliv-${Date.now()}`,
        subscription_id: ep.id,
        event_type: event,
        payload: payload as unknown as Record<string, unknown>,
        http_status: 200,
        response_body: '{"received": true, "status": "processed"}',
        attempt_number: 1,
        success: true,
        delivered_at: new Date().toISOString()
      };

      this.deliveryLogs.unshift(deliveryLog);
    }
  }

  public static async fetchDeliveryLogs(): Promise<WebhookDeliveryLog[]> {
    return this.deliveryLogs;
  }
}
