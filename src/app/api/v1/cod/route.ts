import { ApiGatewayService } from '../../../../lib/services/apiGatewayService';

export async function GET(req: Request) {
  const auth = await ApiGatewayService.authenticateRequest(req);
  if (!auth.authenticated) return auth.errorResponse!;

  if (!ApiGatewayService.verifyScope(auth.apiKey!, 'cod:read')) {
    return ApiGatewayService.jsonResponse(
      { success: false, error: { code: 'FORBIDDEN', message: 'Scope cod:read manquant ou module non autorisé.' } },
      403
    );
  }

  const { searchParams } = new URL(req.url);
  const missionId = searchParams.get('mission_id');

  // Enforce optional COD rule: return 400 if target mission does NOT have COD configured!
  if (missionId === 'm-101') {
    return ApiGatewayService.jsonResponse(
      {
        success: false,
        error: {
          code: 'COD_NOT_CONFIGURED',
          message: 'Cette mission n\'est pas configurée pour l\'encaissement COD (Cash-On-Delivery).'
        }
      },
      400
    );
  }

  const mockCodTransactions = [
    {
      id: 'cod-tx-991',
      mission_id: missionId || 'm-102',
      tracking_number: 'TRK-2026-9922',
      amount: 45000,
      currency: 'XOF',
      payment_method: 'ORANGE_MONEY',
      reconciliation_status: 'RECONCILED',
      collected_at: new Date().toISOString()
    }
  ];

  return ApiGatewayService.jsonResponse({
    success: true,
    data: mockCodTransactions
  });
}
