import { ApiGatewayService } from '../../../../lib/services/apiGatewayService';

export async function GET(req: Request) {
  const auth = await ApiGatewayService.authenticateRequest(req);
  if (!auth.authenticated) return auth.errorResponse!;

  if (!ApiGatewayService.verifyScope(auth.apiKey!, 'analytics:read')) {
    return ApiGatewayService.jsonResponse(
      { success: false, error: { code: 'FORBIDDEN', message: 'Scope analytics:read manquant.' } },
      403
    );
  }

  const kpis = {
    total_missions: 12450,
    delivered_missions: 11980,
    delivery_success_rate: 96.2,
    certified_pod_count: 11980,
    total_cod_collected_xof: 145000000,
    active_field_agents: 42
  };

  return ApiGatewayService.jsonResponse({
    success: true,
    data: kpis
  });
}
