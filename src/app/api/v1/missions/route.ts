import { ApiGatewayService } from '../../../../lib/services/apiGatewayService';
import { apiAuditService } from '../../../../lib/services/apiAuditService';

export async function GET(req: Request) {
  const startTime = Date.now();
  const auth = await ApiGatewayService.authenticateRequest(req);
  if (!auth.authenticated) return auth.errorResponse!;

  if (!ApiGatewayService.verifyScope(auth.apiKey!, 'missions:read')) {
    return ApiGatewayService.jsonResponse(
      { success: false, error: { code: 'FORBIDDEN', message: 'Scope missions:read manquant.' } },
      403
    );
  }

  const mockMissions = [
    {
      id: 'm-101',
      tracking_number: 'TRK-2026-9921',
      recipient_name: 'Moussa Diallo',
      address_raw: 'Immeuble Kouléwondi, Kaloum, Conakry',
      status: 'delivered',
      pod_certified: true,
      has_cod: false,
      cod_amount: 0,
      created_at: new Date().toISOString()
    },
    {
      id: 'm-102',
      tracking_number: 'TRK-2026-9922',
      recipient_name: 'Awa Koné',
      address_raw: 'Rue 12, Treichville, Abidjan',
      status: 'assigned',
      pod_certified: false,
      has_cod: true,
      cod_amount: 45000,
      created_at: new Date().toISOString()
    }
  ];

  await apiAuditService.recordApiCall({
    tenant_id: auth.tenantId!,
    api_key_id: auth.apiKey!.id,
    endpoint: '/api/v1/missions',
    http_method: 'GET',
    status_code: 200,
    response_time_ms: Date.now() - startTime,
    ip_address: '197.234.221.12',
    user_agent: req.headers.get('user-agent') || 'REST Client',
    payload_size_bytes: 1024
  });

  return ApiGatewayService.jsonResponse({
    success: true,
    data: mockMissions,
    meta: { page: 1, limit: 10, total: 2, timestamp: new Date().toISOString() }
  });
}

export async function POST(req: Request) {
  const startTime = Date.now();
  const auth = await ApiGatewayService.authenticateRequest(req);
  if (!auth.authenticated) return auth.errorResponse!;

  if (!ApiGatewayService.verifyScope(auth.apiKey!, 'missions:write')) {
    return ApiGatewayService.jsonResponse(
      { success: false, error: { code: 'FORBIDDEN', message: 'Scope missions:write manquant.' } },
      403
    );
  }

  const body = await req.json().catch(() => ({}));
  const newMission = {
    id: `m-${Date.now()}`,
    tracking_number: `TRK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    recipient_name: body.recipient_name || 'Destinataire Test',
    address_raw: body.address || 'Adresse d\'envoi',
    status: 'created',
    pod_certified: false,
    has_cod: Boolean(body.has_cod),
    cod_amount: Number(body.cod_amount) || 0,
    created_at: new Date().toISOString()
  };

  await apiAuditService.recordApiCall({
    tenant_id: auth.tenantId!,
    api_key_id: auth.apiKey!.id,
    endpoint: '/api/v1/missions',
    http_method: 'POST',
    status_code: 201,
    response_time_ms: Date.now() - startTime,
    ip_address: '197.234.221.12',
    user_agent: req.headers.get('user-agent') || 'REST Client',
    payload_size_bytes: 512
  });

  return ApiGatewayService.jsonResponse({ success: true, data: newMission }, 201);
}
