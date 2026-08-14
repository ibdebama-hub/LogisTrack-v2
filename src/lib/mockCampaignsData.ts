import { CampaignItem } from '../types/campaigns';

export const MOCK_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'camp-101',
    reference: 'CAMP-2026-EDM-07',
    name: 'Distribution Factures Électricité EDM - Juillet 2026',
    client_id: 'cli-edm',
    client_name: 'Électricité De Guinée (EDG / EDM)',
    client_code: 'EDM',
    operation_type: 'MASS_INVOICE_DISTRIBUTION',
    total_items: 12500,
    delivered_items: 10625,
    failed_items: 375,
    in_progress_items: 1200,
    unassigned_items: 300,
    start_date: '2026-07-20',
    due_date: '2026-08-10',
    is_urgent: false,
    status: 'EN_COURS',
    batches_count: 8,
    agents_assigned_count: 14,
    zones_progress: [
      { zone_name: 'Kaloum Centre-Ville', total: 4500, delivered: 4200, failed: 100, in_progress: 200 },
      { zone_name: 'Dixinn & Landréah', total: 3800, delivered: 3400, failed: 120, in_progress: 280 },
      { zone_name: 'Ratoma & Kipé', total: 4200, delivered: 3025, failed: 155, in_progress: 720 }
    ],
    assigned_agents: [
      { agent_id: 'ag-1', agent_name: 'Mamadou Diallo', agent_phone: '+224 620 45 88 12', total_assigned: 850, delivered: 810, failed: 15, remaining: 25, success_rate: 98.1 },
      { agent_id: 'ag-2', agent_name: 'Fatoumata Binta Camara', agent_phone: '+224 628 90 11 22', total_assigned: 720, delivered: 690, failed: 10, remaining: 20, success_rate: 98.5 }
    ],
    incidents: [
      { id: 'inc-1', tracking_ref: 'LT-EDM-9941', recipient_name: 'Alpha Oumar Sow', recipient_address: 'Almamya Rue KA-042', reason: 'Immeuble démolit / Adresse NPAI', reported_at: '2026-08-04 14:20', agent_name: 'Mamadou Diallo', status: 'CRITICAL' },
      { id: 'inc-2', tracking_ref: 'LT-EDM-9988', recipient_name: 'Kadiatou Bah', recipient_address: 'Dixinn Port Porte 12', reason: 'Destinataire absent répétitif', reported_at: '2026-08-05 09:15', agent_name: 'Fatoumata Camara', status: 'PENDING_ADDRESS' }
    ]
  },
  {
    id: 'camp-102',
    reference: 'CAMP-2026-OGN-08',
    name: 'Cartes SIM B2B & Routeurs Fibre Pro',
    client_id: 'cli-orange',
    client_name: 'Orange Guinée',
    client_code: 'OGN',
    operation_type: 'CONFIDENTIAL_MAIL',
    total_items: 850,
    delivered_items: 850,
    failed_items: 0,
    in_progress_items: 0,
    unassigned_items: 0,
    start_date: '2026-07-01',
    due_date: '2026-07-25',
    is_urgent: false,
    status: 'CLÔTURÉE',
    batches_count: 2,
    agents_assigned_count: 4,
    zones_progress: [
      { zone_name: 'Kaloum Centre-Ville', total: 850, delivered: 850, failed: 0, in_progress: 0 }
    ],
    assigned_agents: [
      { agent_id: 'ag-1', agent_name: 'Mamadou Diallo', agent_phone: '+224 620 45 88 12', total_assigned: 450, delivered: 450, failed: 0, remaining: 0, success_rate: 100 }
    ],
    incidents: []
  },
  {
    id: 'camp-103',
    reference: 'CAMP-2026-BAT-02',
    name: 'Distribution Chéquiers & Cartes Visa Premier BDM / BAT',
    client_id: 'cli-ba',
    client_name: 'Banque Atlantique / BDM',
    client_code: 'BAT',
    operation_type: 'CONFIDENTIAL_MAIL',
    total_items: 1400,
    delivered_items: 980,
    failed_items: 45,
    in_progress_items: 375,
    unassigned_items: 0,
    start_date: '2026-08-01',
    due_date: '2026-08-08',
    is_urgent: true,
    status: 'EN_COURS',
    batches_count: 3,
    agents_assigned_count: 6,
    zones_progress: [
      { zone_name: 'Dakar Plateau & Medina', total: 800, delivered: 600, failed: 20, in_progress: 180 },
      { zone_name: 'Point E & Fann', total: 600, delivered: 380, failed: 25, in_progress: 195 }
    ],
    assigned_agents: [
      { agent_id: 'ag-3', agent_name: 'Ousmane Sow', agent_phone: '+221 77 412 90 80', total_assigned: 500, delivered: 380, failed: 20, remaining: 100, success_rate: 95.0 }
    ],
    incidents: [
      { id: 'inc-3', tracking_ref: 'LT-BAT-4091', recipient_name: 'Cheikh Tidiane Diop', recipient_address: 'Immeuble Fahd, Dakar', reason: 'Refus de signer la décharge', reported_at: '2026-08-05 11:30', agent_name: 'Ousmane Sow', status: 'CRITICAL' }
    ]
  },
  {
    id: 'camp-104',
    reference: 'CAMP-2026-SOD-04',
    name: 'Factures d\'Eau SODECI Côte d\'Ivoire T3',
    client_id: 'cli-sodeci',
    client_name: 'SODECI Côte d\'Ivoire',
    client_code: 'SOD',
    operation_type: 'MASS_INVOICE_DISTRIBUTION',
    total_items: 18500,
    delivered_items: 14200,
    failed_items: 500,
    in_progress_items: 2800,
    unassigned_items: 1000,
    start_date: '2026-07-15',
    due_date: '2026-08-15',
    is_urgent: false,
    status: 'EN_PAUSE',
    batches_count: 12,
    agents_assigned_count: 18,
    zones_progress: [
      { zone_name: 'Cocody & Riviera', total: 9500, delivered: 8000, failed: 200, in_progress: 1300 },
      { zone_name: 'Yopougon Industrial', total: 9000, delivered: 6200, failed: 300, in_progress: 1500 }
    ],
    assigned_agents: [
      { agent_id: 'ag-4', agent_name: 'Koffi Jean-Baptiste', agent_phone: '+225 07 58 90 12 34', total_assigned: 1200, delivered: 980, failed: 40, remaining: 180, success_rate: 96.0 }
    ],
    incidents: []
  }
];
