import { ApiAuditLogEntry } from '../../types/publicApi';

export class ApiAuditService {
  private static auditLogs: ApiAuditLogEntry[] = [
    {
      id: 'log-1',
      tenant_id: 'tenant-101',
      api_key_id: 'key-101',
      endpoint: '/api/v1/missions',
      http_method: 'GET',
      status_code: 200,
      response_time_ms: 24,
      ip_address: '197.234.221.12',
      user_agent: 'LogisTrack-Python-SDK/2.0.0',
      payload_size_bytes: 4096,
      created_at: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: 'log-2',
      tenant_id: 'tenant-101',
      api_key_id: 'key-101',
      endpoint: '/api/v1/pod/pod-9921',
      http_method: 'GET',
      status_code: 200,
      response_time_ms: 18,
      ip_address: '197.234.221.12',
      user_agent: 'LogisTrack-Python-SDK/2.0.0',
      payload_size_bytes: 2048,
      created_at: new Date(Date.now() - 15 * 60000).toISOString()
    }
  ];

  public static async recordApiCall(entry: Omit<ApiAuditLogEntry, 'id' | 'created_at'>): Promise<void> {
    const newEntry: ApiAuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.auditLogs.unshift(newEntry);
  }

  public static async fetchAuditLogs(): Promise<ApiAuditLogEntry[]> {
    return this.auditLogs;
  }
}

export const apiAuditService = ApiAuditService;
