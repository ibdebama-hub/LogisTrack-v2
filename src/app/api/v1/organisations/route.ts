import { ApiGatewayService } from '../../../../lib/services/apiGatewayService';
import { apiAuditService } from '../../../../lib/services/apiAuditService';

export async function GET(req: Request) {
  const startTime = Date.now();
  const auth = await ApiGatewayService.authenticateRequest(req);
  if (!auth.authenticated) return auth.errorResponse!;

  if (!ApiGatewayService.verifyScope(auth.apiKey!, 'org:read')) {
    return ApiGatewayService.jsonResponse(
      { success: false, error: { code: 'FORBIDDEN', message: 'Scope org:read manquant.' } },
      403
    );
  }

  const rateLimit = ApiGatewayService.checkRateLimit(auth.tenantId!, auth.apiKey!.rate_limit_per_minute);
  if (!rateLimit.allowed) {
    return ApiGatewayService.jsonResponse(
      { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Quota de requêtes dépassé.' } },
      429,
      { 'Retry-After': String(rateLimit.reset_seconds) }
    );
  }

  const mockOrg = {
    id: auth.tenantId,
    name: 'Logistics West Africa (Siège Abidjan)',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    currency: 'XOF',
    status: 'ACTIVE',
    created_at: '2026-01-10'
  };

  await apiAuditService.recordApiCall({
    tenant_id: auth.tenantId!,
    api_key_id: auth.apiKey!.id,
    endpoint: '/api/v1/organisations',
    http_method: 'GET',
    status_code: 200,
    response_time_ms: Date.now() - startTime,
    ip_address: '197.234.221.12',
    user_agent: req.headers.get('user-agent') || 'REST Client',
    payload_size_bytes: 512
  });

  return ApiGatewayService.jsonResponse({
    success: true,
    data: [mockOrg],
    meta: { page: 1, limit: 10, total: 1, timestamp: new Date().toISOString() }
  });
}
