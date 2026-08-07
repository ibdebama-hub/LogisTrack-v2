import { TrialTelemetry } from '@/types/crm';

export class TrialManagementService {
  private static trials: TrialTelemetry[] = [
    {
      tenant_id: 'tenant-101',
      company_name: 'Sahel Express Trial',
      plan_code: 'PROFESSIONAL',
      days_remaining: 3,
      logins_count: 42,
      campaigns_created: 8,
      missions_executed: 450,
      feature_usage_score: 88,
      churn_risk: 'LOW',
      alert_level: 'D-3'
    },
    {
      tenant_id: 'tenant-102',
      company_name: 'Bamako Logistics Trial',
      plan_code: 'STARTER',
      days_remaining: 1,
      logins_count: 5,
      campaigns_created: 1,
      missions_executed: 15,
      feature_usage_score: 25,
      churn_risk: 'HIGH',
      alert_level: 'D-0'
    }
  ];

  public static async fetchTrialTelemetry(): Promise<TrialTelemetry[]> {
    return this.trials;
  }
}
