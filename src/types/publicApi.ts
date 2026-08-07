export type ApiScope =
  | 'org:read'
  | 'org:write'
  | 'users:read'
  | 'users:write'
  | 'agents:read'
  | 'agents:write'
  | 'campaigns:read'
  | 'campaigns:write'
  | 'missions:read'
  | 'missions:write'
  | 'pod:read'
  | 'pod:write'
  | 'cod:read'
  | 'cod:write'
  | 'analytics:read'
  | 'reports:generate';

export interface ApiKey {
  id: string;
  client_id: string;
  name: string;
  key_hash: string;
  prefix: string;
  scopes: ApiScope[];
  is_active: boolean;
  rate_limit_per_minute: number;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface ApiAuditLogEntry {
  id: string;
  tenant_id: string;
  api_key_id?: string;
  endpoint: string;
  http_method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  status_code: number;
  response_time_ms: number;
  ip_address: string;
  user_agent: string;
  payload_size_bytes: number;
  created_at: string;
}

export interface PublicApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}
