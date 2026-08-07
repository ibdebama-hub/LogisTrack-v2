import { ApiKey, ApiScope, PublicApiResponse } from '@/types/publicApi';
import { apiAuditService } from './apiAuditService';

export interface RateLimitStatus {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset_seconds: number;
}

// In-memory rate limit counter for demonstration & edge validation
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export class ApiGatewayService {
  /**
   * Authenticates an API Key or Bearer Token from request headers
   */
  public static async authenticateRequest(req: Request): Promise<{
    authenticated: boolean;
    tenantId?: string;
    apiKey?: ApiKey;
    errorResponse?: Response;
  }> {
    const authHeader = req.headers.get('Authorization') || req.headers.get('x-api-key');

    if (!authHeader) {
      return {
        authenticated: false,
        errorResponse: this.jsonResponse(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'En-tête d\'authentification manquant (x-api-key ou Authorization Bearer requis).'
            }
          },
          401
        )
      };
    }

    const keyToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    // Mock API key lookup & validation
    if (keyToken.startsWith('lgt_') || keyToken === 'demo_secret_key') {
      const mockKey: ApiKey = {
        id: 'key-101',
        client_id: 'tenant-101',
        name: 'Production Enterprise API Key',
        key_hash: 'hash-9921',
        prefix: 'lgt_live_',
        scopes: [
          'org:read',
          'org:write',
          'users:read',
          'users:write',
          'agents:read',
          'agents:write',
          'campaigns:read',
          'campaigns:write',
          'missions:read',
          'missions:write',
          'pod:read',
          'pod:write',
          'cod:read',
          'cod:write',
          'analytics:read',
          'reports:generate'
        ],
        is_active: true,
        rate_limit_per_minute: 500,
        created_at: new Date().toISOString()
      };

      return {
        authenticated: true,
        tenantId: 'tenant-101',
        apiKey: mockKey
      };
    }

    return {
      authenticated: false,
      errorResponse: this.jsonResponse(
        {
          success: false,
          error: {
            code: 'INVALID_API_KEY',
            message: 'La clé API fournie est invalide, révoquée ou expirée.'
          }
        },
        403
      )
    };
  }

  /**
   * Verifies if the authenticated API key possesses the required scope
   */
  public static verifyScope(apiKey: ApiKey, requiredScope: ApiScope): boolean {
    return apiKey.scopes.includes(requiredScope);
  }

  /**
   * Evaluates Rate Limiting for a client tenant
   */
  public static checkRateLimit(clientId: string, limitPerMinute: number = 300): RateLimitStatus {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const current = rateLimitMap.get(clientId);

    if (!current || now > current.resetAt) {
      rateLimitMap.set(clientId, { count: 1, resetAt: now + windowMs });
      return { allowed: true, limit: limitPerMinute, remaining: limitPerMinute - 1, reset_seconds: 60 };
    }

    if (current.count >= limitPerMinute) {
      const remainingSec = Math.ceil((current.resetAt - now) / 1000);
      return { allowed: false, limit: limitPerMinute, remaining: 0, reset_seconds: remainingSec };
    }

    current.count += 1;
    const remainingSec = Math.ceil((current.resetAt - now) / 1000);
    return {
      allowed: true,
      limit: limitPerMinute,
      remaining: limitPerMinute - current.count,
      reset_seconds: remainingSec
    };
  }

  /**
   * Helper to format standardized JSON responses
   */
  public static jsonResponse<T>(payload: PublicApiResponse<T>, status: number = 200, headers: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(payload), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'X-Powered-By': 'LogisTrack V2 Enterprise API Gateway',
        ...headers
      }
    });
  }
}
