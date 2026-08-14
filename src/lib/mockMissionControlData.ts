import {
  DispatchLot,
  DispatcherNotification,
  MissionControlKpis,
  OperationalTimelineEvent,
  ReassignmentAuditEntry
} from '../types/missionControl';

export const MOCK_MISSION_CONTROL_KPIS: MissionControlKpis = {
  campaigns: {
    active: 8,
    completed: 24,
    planned: 5,
    total: 37
  },
  missions: {
    created: 14500,
    assigned: 11200,
    in_progress: 3800,
    completed: 9850,
    delayed: 142,
    canceled: 35,
    total: 14500
  },
  agents: {
    online: 28,
    available: 8,
    on_mission: 20,
    offline: 4,
    total: 32
  },
  performance: {
    global_completion_rate: 87.5,
    success_rate: 94.2,
    avg_delivery_time_min: 14.8,
    incidents_count: 6
  }
};

export const MOCK_DISPATCH_LOTS: DispatchLot[] = [
  {
    id: 'lot-101',
    lot_number: 'LOT-ABJ-COC-01',
    name: 'Lot Factures CIE Riviera 2 & 3',
    campaign_id: 'camp-1',
    campaign_reference: 'CAMP-CIE-2026-08',
    campaign_name: 'Distribution Factures CIE Électricité Août 2026',
    client_id: 'cli-cie',
    client_name: 'CIE Électricité',
    zone_code: 'ABJ-COC-RIV',
    zone_name: 'Cocody Riviera',
    city_name: 'Abidjan',
    total_missions: 450,
    delivered_missions: 320,
    failed_missions: 15,
    estimated_hours: 4.5,
    priority: 'URGENTE',
    status: 'EN_COURS',
    assigned_agents: [
      { id: 'a1', name: 'Kouassi Jean-Marc', phone: '+225 07 08 12 34 56', avatar_initials: 'JK' }
    ],
    created_at: '2026-08-06 07:30',
    due_date: '2026-08-08',
    total_cod_amount: 0
  },
  {
    id: 'lot-102',
    lot_number: 'LOT-ABJ-YOP-02',
    name: 'Lot Factures SODECI Yopougon Selmer',
    campaign_id: 'camp-2',
    campaign_reference: 'CAMP-SODECI-2026-08',
    campaign_name: 'Campagne Relevés d\'Eau SODECI Abidjan',
    client_id: 'cli-sodeci',
    client_name: 'SODECI Eau',
    zone_code: 'ABJ-YOP-SEL',
    zone_name: 'Yopougon Selmer',
    city_name: 'Abidjan',
    total_missions: 680,
    delivered_missions: 0,
    failed_missions: 0,
    estimated_hours: 6.0,
    priority: 'HAUTE',
    status: 'A_AFFECTER',
    assigned_agents: [],
    created_at: '2026-08-06 08:15',
    due_date: '2026-08-10',
    total_cod_amount: 0
  },
  {
    id: 'lot-103',
    lot_number: 'LOT-BMK-COU-01',
    name: 'Lot Courriers Confidentiels Bamako Coura',
    campaign_id: 'camp-3',
    campaign_reference: 'CAMP-BAM-2026-004',
    campaign_name: 'Distribution Relevés Bancaires BDM Bamako',
    client_id: 'cli-bdm',
    client_name: 'Banque de Développement du Mali (BDM)',
    zone_code: 'BMK-COU-01',
    zone_name: 'Bamako Coura',
    city_name: 'Bamako',
    total_missions: 280,
    delivered_missions: 280,
    failed_missions: 0,
    estimated_hours: 3.0,
    priority: 'NORMALE',
    status: 'TERMINE',
    assigned_agents: [
      { id: 'a3', name: 'Traoré Bakary', phone: '+223 70 12 34 56', avatar_initials: 'BT' }
    ],
    created_at: '2026-08-05 09:00',
    due_date: '2026-08-06',
    total_cod_amount: 0
  },
  {
    id: 'lot-104',
    lot_number: 'LOT-DKR-PLT-03',
    name: 'Colis E-Commerce Dakar Plateau',
    campaign_id: 'camp-4',
    campaign_reference: 'CAMP-JUMIA-2026-12',
    campaign_name: 'Livraisons Colis Express Jumia Senegal',
    client_id: 'cli-jumia',
    client_name: 'Jumia Express',
    zone_code: 'DKR-PLT-SAN',
    zone_name: 'Dakar Plateau Sandaga',
    city_name: 'Dakar',
    total_missions: 120,
    delivered_missions: 95,
    failed_missions: 8,
    estimated_hours: 3.5,
    priority: 'URGENTE',
    status: 'A_CONTROLER',
    assigned_agents: [
      { id: 'a4', name: 'Ndiaye Cheikh', phone: '+221 77 654 32 10', avatar_initials: 'CN' }
    ],
    created_at: '2026-08-06 06:45',
    due_date: '2026-08-06',
    total_cod_amount: 1450000
  },
  {
    id: 'lot-105',
    lot_number: 'LOT-ABJ-MAR-01',
    name: 'Lot Cartes SIM Orange Marcory Zone 4',
    campaign_id: 'camp-5',
    campaign_reference: 'CAMP-ORA-2026-09',
    campaign_name: 'Distribution Cartes SIM & Routeurs Orange B2B',
    client_id: 'cli-orange',
    client_name: 'Orange Côte d\'Ivoire',
    zone_code: 'ABJ-MAR-Z4',
    zone_name: 'Marcory Zone 4',
    city_name: 'Abidjan',
    total_missions: 350,
    delivered_missions: 120,
    failed_missions: 5,
    estimated_hours: 4.0,
    priority: 'HAUTE',
    status: 'AFFECTE',
    assigned_agents: [
      { id: 'a2', name: 'Diallo Mamadou', phone: '+225 05 04 99 88 77', avatar_initials: 'MD' }
    ],
    created_at: '2026-08-06 08:30',
    due_date: '2026-08-09',
    total_cod_amount: 250000
  },
  {
    id: 'lot-106',
    lot_number: 'LOT-SIK-CEN-01',
    name: 'Relevés Télécoms Sikasso Centre',
    campaign_id: 'camp-6',
    campaign_reference: 'CAMP-MALITEL-2026-01',
    campaign_name: 'Factures Entreprises Malitel Sikasso',
    client_id: 'cli-malitel',
    client_name: 'Sotelma Malitel',
    zone_code: 'SIK-CEN-02',
    zone_name: 'Sikasso Centre',
    city_name: 'Sikasso',
    total_missions: 210,
    delivered_missions: 0,
    failed_missions: 0,
    estimated_hours: 2.5,
    priority: 'BASSE',
    status: 'A_PREPARER',
    assigned_agents: [],
    created_at: '2026-08-06 09:10',
    due_date: '2026-08-12',
    total_cod_amount: 0
  }
];

export const MOCK_OPERATIONAL_TIMELINE: OperationalTimelineEvent[] = [
  {
    id: 'tl-1',
    timestamp: '09:03',
    title: 'Première mission terminée',
    description: 'Agent Kouassi Jean-Marc a certifié la livraison FAC-EAU-2026-001 avec signature tactile.',
    category: 'DELIVERY',
    severity: 'success',
    actor: 'Kouassi Jean-Marc',
    reference_id: 'FAC-EAU-2026-001'
  },
  {
    id: 'tl-2',
    timestamp: '08:52',
    title: 'Agent connecté à la tournée',
    description: 'Agent Diallo Mamadou a démarré la PWA sur la zone ABJ-MAR-Z4 (Batterie 94%).',
    category: 'AGENT',
    severity: 'info',
    actor: 'Diallo Mamadou'
  },
  {
    id: 'tl-3',
    timestamp: '08:40',
    title: 'Lot ZONE 1 affecté',
    description: 'Le dispatcher Yves Touré a affecté le lot LOT-ABJ-MAR-01 à l\'agent Diallo Mamadou.',
    category: 'DISPATCH',
    severity: 'info',
    actor: 'Yves Touré',
    reference_id: 'LOT-ABJ-MAR-01'
  },
  {
    id: 'tl-4',
    timestamp: '08:28',
    title: '1 450 missions créées',
    description: 'Lotissement automatique exécuté avec succès pour la campagne CAMP-SODECI-2026-08.',
    category: 'IMPORT',
    severity: 'success',
    reference_id: 'CAMP-SODECI-2026-08'
  },
  {
    id: 'tl-5',
    timestamp: '08:22',
    title: 'Import CSV terminé',
    description: 'Fichier SODECI_Factures_Aout.xlsx de 1 450 lignes ingéré sans erreurs d\'adresse.',
    category: 'IMPORT',
    severity: 'info',
    actor: 'Système Auto-Import'
  },
  {
    id: 'tl-6',
    timestamp: '08:15',
    title: 'Nouvelle campagne créée',
    description: 'Campagne SODECI Eau créée par le client B2B (Statut: PLANIFIÉE).',
    category: 'CAMPAIGN',
    severity: 'info',
    actor: 'SODECI Admin'
  }
];

export const MOCK_DISPATCHER_NOTIFICATIONS: DispatcherNotification[] = [
  {
    id: 'notif-1',
    timestamp: 'Il y a 5 min',
    title: 'Retard important détecté',
    message: 'L\'agent Ndiaye Cheikh accumule 35 min de retard sur la zone Dakar Plateau Sandaga.',
    severity: 'CRITICAL',
    read: false,
    category: 'INCIDENT'
  },
  {
    id: 'notif-2',
    timestamp: 'Il y a 18 min',
    title: 'Agent hors ligne',
    message: 'Signal GPS perdu pour Traoré Bakary (Zone Bamako Coura). Batterie au dernier signal: 12%.',
    severity: 'WARNING',
    read: false,
    category: 'AGENT'
  },
  {
    id: 'notif-3',
    timestamp: 'Il y a 42 min',
    title: 'Import de masse validé',
    message: 'Le lot de 680 factures SODECI est prêt pour l\'affectation.',
    severity: 'INFO',
    read: true,
    category: 'CAMPAIGN'
  },
  {
    id: 'notif-4',
    timestamp: 'Il y a 1h 10m',
    title: 'Mission bloquée - Refus COD',
    message: 'Client Orange refusa l\'encaissement COD sur le pli FAC-ORA-2026-88. Demande d\'arbitrage.',
    severity: 'CRITICAL',
    read: false,
    category: 'MISSION'
  }
];

export const MOCK_REASSIGNMENT_AUDIT: ReassignmentAuditEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-06 08:40',
    lot_id: 'lot-105',
    lot_number: 'LOT-ABJ-MAR-01',
    action_type: 'ASSIGNED',
    performed_by: 'Yves Touré (Dispatcher)',
    previous_agents: [],
    new_agents: ['Diallo Mamadou'],
    details: 'Affectation initiale du lot de 350 cartes SIM.'
  }
];
