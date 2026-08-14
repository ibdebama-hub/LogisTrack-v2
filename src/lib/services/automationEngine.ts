import { AutomationRule } from '../../types/automation';
import { WebhookEventType } from '../../types/webhooks';
import { WebhookService } from './webhookService';

export class AutomationEngine {
  private static rules: AutomationRule[] = [
    {
      id: 'rule-1',
      tenant_id: 'tenant-101',
      name: 'Génération automatique de POD sur livraison certifiée',
      trigger_event: 'mission.delivered',
      action_type: 'GENERATE_POD',
      is_active: true,
      execution_count: 1420,
      last_triggered_at: 'Il y a 3 min',
      created_at: '2026-02-01'
    },
    {
      id: 'rule-2',
      tenant_id: 'tenant-101',
      name: 'Notification SMS Destinataire lors de l\'affectation de la tournée',
      trigger_event: 'mission.assigned',
      action_type: 'NOTIFY_CLIENT_SMS',
      is_active: true,
      execution_count: 850,
      last_triggered_at: 'Il y a 10 min',
      created_at: '2026-03-05'
    },
    {
      id: 'rule-3',
      tenant_id: 'tenant-101',
      name: 'Génération automatique du rapport global en fin de campagne',
      trigger_event: 'campaign.completed',
      action_type: 'GENERATE_REPORT',
      is_active: true,
      execution_count: 45,
      last_triggered_at: 'Hier',
      created_at: '2026-03-12'
    }
  ];

  public static async fetchRules(): Promise<AutomationRule[]> {
    return this.rules;
  }

  public static async processTrigger<T>(event: WebhookEventType, tenantId: string, payload: T): Promise<void> {
    const matchingRules = this.rules.filter((r) => r.tenant_id === tenantId && r.is_active && r.trigger_event === event);

    for (const rule of matchingRules) {
      rule.execution_count += 1;
      rule.last_triggered_at = new Date().toISOString();

      // Dispatch rule execution event via Webhook engine
      await WebhookService.dispatchEvent(event, tenantId, {
        automation_rule_id: rule.id,
        rule_name: rule.name,
        action_executed: rule.action_type,
        payload
      });
    }
  }

  public static async createRule(data: Omit<AutomationRule, 'id' | 'execution_count' | 'created_at'>): Promise<AutomationRule> {
    const newRule: AutomationRule = {
      ...data,
      id: `rule-${Date.now()}`,
      execution_count: 0,
      created_at: new Date().toISOString()
    };
    this.rules.unshift(newRule);
    return newRule;
  }
}
