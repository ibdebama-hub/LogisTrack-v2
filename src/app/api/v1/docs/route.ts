export async function GET() {
  const openApiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'LogisTrack V2 Enterprise REST API',
      version: '1.0.0',
      description: 'API REST multi-tenant sécurisée pour la gestion de la distribution de factures, livraison de colis, certification POD, encaissement COD et rapports Business Intelligence.'
    },
    servers: [
      { url: 'https://logistrack.app/api/v1', description: 'Production Server' },
      { url: 'https://staging.logistrack.app/api/v1', description: 'Staging Sandbox' }
    ],
    paths: {
      '/organisations': {
        get: {
          summary: 'Consulter l\'organisation cliente',
          security: [{ ApiKeyAuth: [] }],
          responses: { 200: { description: 'Succès' }, 401: { description: 'Non authentifié' } }
        }
      },
      '/missions': {
        get: {
          summary: 'Lister les missions de livraison',
          security: [{ ApiKeyAuth: [] }],
          responses: { 200: { description: 'Succès' } }
        },
        post: {
          summary: 'Créer une nouvelle mission de livraison',
          security: [{ ApiKeyAuth: [] }],
          responses: { 201: { description: 'Mission créée' } }
        }
      },
      '/pod': {
        get: {
          summary: 'Consulter et certifier les preuves de livraison (POD)',
          security: [{ ApiKeyAuth: [] }],
          responses: { 200: { description: 'Preuves certifiées' } }
        }
      },
      '/cod': {
        get: {
          summary: 'Consulter les encaissements COD (Optionnel, uniquement si la mission a COD)',
          security: [{ ApiKeyAuth: [] }],
          responses: { 200: { description: 'Transactions COD' }, 400: { description: 'Mission sans COD' } }
        }
      },
      '/analytics': {
        get: {
          summary: 'Obtenir les indicateurs clés (KPIs) Business Intelligence',
          security: [{ ApiKeyAuth: [] }],
          responses: { 200: { description: 'KPIs agrégés' } }
        }
      }
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      }
    }
  };

  return new Response(JSON.stringify(openApiSpec, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
