import { supabase } from '../supabase/queries';

export type AuditActionType =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'MISSION_CREATE'
  | 'MISSION_UPDATE_STATUS'
  | 'BATCH_ASSIGNMENT'
  | 'POD_CAPTURE'
  | 'POD_VERIFY'
  | 'COD_COLLECT'
  | 'COD_RECONCILE'
  | 'DATA_IMPORT'
  | 'DATA_EXPORT'
  | 'SETTINGS_UPDATE'
  | 'TENANT_PROVISIONING';

export interface AuditLogEntry {
  id?: string;
  tenant_id?: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action_type: AuditActionType;
  entity_type: 'MISSION' | 'BATCH' | 'ITEM' | 'POD' | 'COD' | 'CAMPAIGN' | 'CLIENT' | 'TENANT' | 'USER';
  entity_id: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

class AuditLogService {
  private static instance: AuditLogService;
  private logsInMemory: AuditLogEntry[] = [];

  private constructor() {}

  public static getInstance(): AuditLogService {
    if (!AuditLogService.instance) {
      AuditLogService.instance = new AuditLogService();
    }
    return AuditLogService.instance;
  }

  /**
   * Logs a critical audit event to Supabase audit_logs table and in-memory cache
   */
  public async logEvent(entry: Omit<AuditLogEntry, 'id' | 'created_at'>): Promise<AuditLogEntry> {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString()
    };

    this.logsInMemory.unshift(fullEntry);
    if (this.logsInMemory.length > 500) {
      this.logsInMemory.pop();
    }

    try {
      if (supabase) {
        await supabase.from('audit_logs').insert([
          {
            tenant_id: entry.tenant_id || 'tenant-101',
            actor_id: entry.actor_id,
            actor_name: entry.actor_name,
            actor_role: entry.actor_role,
            action_type: entry.action_type,
            entity_type: entry.entity_type,
            entity_id: entry.entity_id,
            details: entry.details || {},
            ip_address: entry.ip_address || '127.0.0.1',
            user_agent: entry.user_agent || 'LogisTrack Client App'
          }
        ]);
      }
    } catch {
      // Fallback silently to memory logs if offline
    }

    return fullEntry;
  }

  /**
   * Returns recent audit logs for administration dashboards
   */
  public getRecentLogs(limit: number = 50): AuditLogEntry[] {
    return this.logsInMemory.slice(0, limit);
  }
}

export const auditLogService = AuditLogService.getInstance();
