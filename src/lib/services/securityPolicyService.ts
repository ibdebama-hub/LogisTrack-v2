import { UserLoginLog, SecurityPolicy } from '@/types/saasOnboarding';

const MOCK_LOGIN_LOGS: UserLoginLog[] = [
  {
    id: 'log-1',
    user_id: 'usr-101',
    email: 'k.toure@lwa-logistics.ci',
    tenant_name: 'Logistics West Africa (Siège Abidjan)',
    ip_address: '154.120.21.88',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    device_type: 'Desktop',
    browser: 'Chrome 127',
    country: 'Côte d\'Ivoire',
    status: 'SUCCESS',
    created_at: '2026-08-07T08:15:20Z'
  },
  {
    id: 'log-2',
    user_id: 'usr-103',
    email: 's.camara@banqueatlantique.gn',
    tenant_name: 'Banque Atlantique Guinée',
    ip_address: '197.149.200.12',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15',
    device_type: 'Mobile (iOS)',
    browser: 'Safari',
    country: 'Guinée',
    status: 'FAILED_PASSWORD',
    failure_reason: 'Mot de passe incorrect (Tentative 5/5)',
    created_at: '2026-08-07T07:40:11Z'
  },
  {
    id: 'log-3',
    user_id: 'usr-102',
    email: 'm.keita@bamako-express.ml',
    tenant_name: 'Bamako Express Distribution',
    ip_address: '41.73.112.5',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    device_type: 'Desktop',
    browser: 'Firefox 128',
    country: 'Mali',
    status: 'EXPIRED_TEMP_PASSWORD',
    failure_reason: 'Mot de passe temporaire expiré',
    created_at: '2026-08-06T16:20:00Z'
  }
];

export class SecurityPolicyService {
  private static logsStore: UserLoginLog[] = [...MOCK_LOGIN_LOGS];

  public static async fetchLoginLogs(filters?: {
    email?: string;
    status?: string;
    country?: string;
  }): Promise<UserLoginLog[]> {
    let result = [...this.logsStore];
    if (filters?.email) {
      result = result.filter(l => l.email.toLowerCase().includes(filters.email!.toLowerCase()));
    }
    if (filters?.status) {
      result = result.filter(l => l.status === filters.status);
    }
    if (filters?.country) {
      result = result.filter(l => l.country.toLowerCase().includes(filters.country!.toLowerCase()));
    }
    return result;
  }

  public static async getDefaultSecurityPolicy(): Promise<SecurityPolicy> {
    return {
      id: 'pol-global',
      min_password_length: 16,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_special_chars: true,
      temp_password_validity_hours: 48,
      max_login_attempts: 5,
      lockout_duration_minutes: 30
    };
  }
}
