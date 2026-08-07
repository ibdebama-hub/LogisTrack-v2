import { WebhookEventType } from './webhooks';

export type ActionType =
  | 'GENERATE_POD'
  | 'NOTIFY_CLIENT_SMS'
  | 'NOTIFY_CLIENT_EMAIL'
  | 'GENERATE_REPORT'
  | 'TRIGGER_WEBHOOK'
  | 'ASSIGN_AGENT';

export interface AutomationRule {
  id: string;
  tenant_id: string;
  name: string;
  trigger_event: WebhookEventType;
  condition_field?: string;
  condition_operator?: 'EQUALS' | 'CONTAINS' | 'GREATER_THAN';
  condition_value?: string;
  action_type: ActionType;
  action_params?: Record<string, unknown>;
  is_active: boolean;
  execution_count: number;
  last_triggered_at?: string;
  created_at: string;
}
