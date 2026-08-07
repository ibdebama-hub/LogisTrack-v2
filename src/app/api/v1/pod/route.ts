import { ApiGatewayService } from '@/lib/services/apiGatewayService';

export async function GET(req: Request) {
  const auth = await ApiGatewayService.authenticateRequest(req);
  if (!auth.authenticated) return auth.errorResponse!;

  if (!ApiGatewayService.verifyScope(auth.apiKey!, 'pod:read')) {
    return ApiGatewayService.jsonResponse(
      { success: false, error: { code: 'FORBIDDEN', message: 'Scope pod:read manquant.' } },
      403
    );
  }

  const mockPods = [
    {
      id: 'pod-9921',
      mission_id: 'm-101',
      recipient_name: 'Moussa Diallo',
      signature_url: 'https://logistrack.app/storage/pod/sig_9921.png',
      photo_url: 'https://logistrack.app/storage/pod/photo_9921.jpg',
      latitude: 9.537,
      longitude: -13.678,
      certified_at: new Date().toISOString(),
      pdf_download_url: 'https://logistrack.app/api/v1/pod/pod-9921/pdf'
    }
  ];

  return ApiGatewayService.jsonResponse({
    success: true,
    data: mockPods
  });
}
