import { ClientPortalUser, ClientCampaignSummary, ClientPoDProof, ClientInvoiceSummary } from '@/types/b2bClientPortal';

const MOCK_SIGNATURE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="100%" height="100%" fill="%230f172a"/><path d="M 30 90 Q 70 20, 110 80 T 170 60 T 230 100 Q 260 40, 280 70" stroke="%2338bdf8" stroke-width="4" fill="none" stroke-linecap="round"/><text x="20" y="135" fill="%2394a3b8" font-size="12" font-family="monospace">CLIENT PROOF CERTIFIED #OGN-8841</text></svg>`;

export const MOCK_CLIENT_PORTAL_USERS: Record<string, ClientPortalUser> = {
  'cli-orange': {
    client_id: 'cli-orange',
    client_name: 'Orange Guinée',
    client_code: 'OGN',
    contact_name: 'Mariama Diallo (Responsable Facturation)',
    contact_email: 'm.diallo@orange-guinee.com',
    contact_phone: '+224 622 00 11 22'
  },
  'cli-ba': {
    client_id: 'cli-ba',
    client_name: 'Banque Atlantique',
    client_code: 'BAT',
    contact_name: 'Sory Camara (Directeur Opérations)',
    contact_email: 's.camara@banqueatlantique.gn',
    contact_phone: '+224 628 44 55 66'
  }
};

export const MOCK_CLIENT_CAMPAIGNS: ClientCampaignSummary[] = [
  {
    id: 'camp-1',
    name: 'Distribution Factures Mobile Juillet 2026',
    operation_type: 'MASS_INVOICE_DISTRIBUTION',
    start_date: '2026-07-20',
    due_date: '2026-08-10',
    total_items: 4500,
    delivered_items: 4120,
    failed_items: 120,
    pending_items: 260,
    status: 'active',
    zone_coverage: [
      { zone_name: 'Kaloum Centre-Ville', delivered: 1850, total: 1900 },
      { zone_name: 'Dixinn & Landréah', delivered: 1400, total: 1500 },
      { zone_name: 'Ratoma & Kipé', delivered: 870, total: 1100 }
    ]
  },
  {
    id: 'camp-2',
    name: 'Distribution Offres Pro & Cartes SIM B2B',
    operation_type: 'CONFIDENTIAL_MAIL',
    start_date: '2026-07-01',
    due_date: '2026-07-25',
    total_items: 850,
    delivered_items: 850,
    failed_items: 0,
    pending_items: 0,
    status: 'completed',
    zone_coverage: [
      { zone_name: 'Kaloum Centre-Ville', delivered: 850, total: 850 }
    ]
  }
];

export const MOCK_CLIENT_POD_PROOFS: ClientPoDProof[] = [
  {
    id: 'pod-c1',
    tracking_number: 'LT-INV-84920',
    item_type: 'Facture Telecom Fibre Pro',
    recipient_name: 'Sory Camara (Direction BCRG)',
    recipient_address: 'Immeuble BCRG, 3ème Étage, Kaloum, Conakry',
    delivery_timestamp: '2026-08-05 à 09:10',
    agent_name: 'Mamadou Diallo',
    pod_type: 'signature',
    proof_image_url: MOCK_SIGNATURE_SVG,
    gps_lat: 9.5105,
    gps_lng: -13.7118,
    gps_accuracy_meters: 12
  },
  {
    id: 'pod-c2',
    tracking_number: 'LT-PAR-90412',
    item_type: 'Routeur 4G B2B + SIM',
    recipient_name: 'Mariama Sylla',
    recipient_address: 'Villa 14, Almamya Sandervalia, Conakry',
    delivery_timestamp: '2026-08-05 à 10:25',
    agent_name: 'Mamadou Diallo',
    pod_type: 'signature',
    proof_image_url: MOCK_SIGNATURE_SVG,
    gps_lat: 9.5078,
    gps_lng: -13.7145,
    gps_accuracy_meters: 18,
    proxy_info: {
      name: 'Ibrahima Sylla',
      relation: 'Frère (Tiers Mandataire)',
      cni_number: 'CNI-GN-2024-88419'
    }
  }
];

export const MOCK_CLIENT_INVOICES: ClientInvoiceSummary[] = [
  {
    id: 'fac-1',
    invoice_number: 'FAC-2026-0042',
    issue_date: '2026-07-30',
    due_date: '2026-08-30',
    campaign_name: 'Distribution Factures Mobile Juillet 2026',
    total_ttc: 15205480,
    currency: 'GNF',
    status: 'ÉMISE'
  },
  {
    id: 'fac-2',
    invoice_number: 'FAC-2026-0039',
    issue_date: '2026-07-15',
    due_date: '2026-08-15',
    campaign_name: 'Envoi Cartes SIM B2B T2',
    total_ttc: 5959000,
    currency: 'GNF',
    status: 'PAYÉE'
  }
];
