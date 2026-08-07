import { ApiGatewayService } from '@/lib/services/apiGatewayService';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await ApiGatewayService.authenticateRequest(req);
  if (!auth.authenticated) return auth.errorResponse!;

  if (!ApiGatewayService.verifyScope(auth.apiKey!, 'org:read')) {
    return ApiGatewayService.jsonResponse(
      { success: false, error: { code: 'FORBIDDEN', message: 'Scope org:read manquant.' } },
      403
    );
  }

  return ApiGatewayService.jsonResponse({
    success: true,
    data: {
      id: params.id,
      name: 'Logistics West Africa (Siège Abidjan)',
      country: "Côte d'Ivoire",
      status: 'ACTIVE'
    }
  });
}
