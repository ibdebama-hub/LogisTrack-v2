import { ApiGatewayService } from '@/lib/services/apiGatewayService';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await ApiGatewayService.authenticateRequest(req);
  if (!auth.authenticated) return auth.errorResponse!;

  if (!ApiGatewayService.verifyScope(auth.apiKey!, 'missions:read')) {
    return ApiGatewayService.jsonResponse(
      { success: false, error: { code: 'FORBIDDEN', message: 'Scope missions:read manquant.' } },
      403
    );
  }

  return ApiGatewayService.jsonResponse({
    success: true,
    data: {
      id: params.id,
      tracking_number: 'TRK-2026-9921',
      recipient_name: 'Moussa Diallo',
      address_raw: 'Immeuble Kouléwondi, Kaloum, Conakry',
      status: 'delivered',
      pod_certified: true,
      has_cod: false
    }
  });
}
