export type WebhookEventType =
  | 'organization.created'
  | 'campaign.created'
  | 'campaign.completed'
  | 'mission.created'
  | 'mission.assigned'
  | 'mission.delivered'
  | 'pod.certified'
  | 'cod.confirmed'
  | 'report.generated'
  | 'invitation.accepted'
  | 'user.created';

export interface WebhookEndpoint {
  id: string;
  client_id: string;
  name: string;
  url: string;
  secret: string;
  subscribed_events: WebhookEventType[];
  is_active: boolean;
  retry_count: number;
  failure_count: number;
  created_at: string;
}

export interface WebhookPayload<T = unknown> {
  id: string;
  event: WebhookEventType;
  tenant_id: string;
  timestamp: string;
  signature: string;
  data: T;
}

export interface WebhookDeliveryLog {
  id: string;
  subscription_id: string;
  event_type: WebhookEventType;
  payload: Record<string, unknown>;
  http_status: number;
  response_body: string;
  attempt_number: number;
  success: boolean;
  delivered_at: string;
}
