import { FleetAgentFull } from '@/types/agentFleet';

export const MOCK_FLEET_AGENTS: FleetAgentFull[] = [
  {
    id: 'agent-101',
    full_name: 'Mamadou Diallo',
    email: 'm.diallo@logistrack.gn',
    phone: '+224 620 45 88 12',
    role: 'team_leader',
    avatar_url: '',
    status: 'EN_TOURNÉE',
    account_status: 'ACTIF',
    pwa_pin: '1234',
    primary_zone_id: 'zone-kaloum',
    primary_zone_name: 'Kaloum Centre-Ville',
    primary_zone_code: 'Z-KAL',
    district_names: ['Almamya', 'Sandervalia', 'Boulbinet', 'Manquepas'],
    assigned_zone_names: ['Kaloum Centre-Ville', 'Dixinn & Landréah'],
    assigned_district_names: ['Almamya', 'Sandervalia', 'Boulbinet', 'Manquepas', 'Landréah'],
    allowed_client_names: ['Tous (Polyvalent)'],
    allowed_operation_types: ['Distribution Factures', 'Plis Confidentiels', 'Livraisons Colis COD'],
    max_cod_cash_ceiling: 5000000,
    vehicle: {
      type: 'MOTO',
      license_plate: 'RC-9842-A',
      equipment_id: 'MOT-042',
      brand_model: 'TVS HLX 125'
    },
    telemetry: {
      battery_level: 84,
      gps_status: 'EXCELLENT',
      gps_lat: 9.5092,
      gps_lng: -13.7122,
      network_mode: '4G',
      last_ping_at: 'Il y a 2 min',
      pwa_version: 'v2.4.1'
    },
    workload: {
      total_assigned: 185,
      delivered: 142,
      remaining: 38,
      failed: 5
    },
    cod: {
      collected_today: 4850000,
      pending_discharge: 4850000
    },
    performance: {
      success_rate: 97.2,
      avg_time_per_delivery: '8 min',
      npai_rate: 1.8,
      reconciliation_score: '100% (34/34 sans écart)'
    },
    route_history: [
      {
        id: 'pt-1',
        timestamp: '08:15',
        location_name: 'Dépôt Central Kaloum',
        status: 'start',
        lat: 9.5092,
        lng: -13.7122
      },
      {
        id: 'pt-2',
        timestamp: '09:10',
        location_name: 'Banque Centrale (BCRG) - Almamya',
        status: 'delivered',
        recipient_name: 'Sory Camara',
        item_tracking: 'LT-INV-84920',
        cod_amount: 0,
        pod_type: 'signature',
        lat: 9.5105,
        lng: -13.7118
      }
    ]
  },
  {
    id: 'agent-102',
    full_name: 'Koffi Jean-Baptiste',
    email: 'k.jean@logistrack.ci',
    phone: '+225 07 58 90 12 34',
    role: 'field_agent',
    avatar_url: '',
    status: 'EN_TOURNÉE',
    account_status: 'ACTIF',
    pwa_pin: '5678',
    primary_zone_id: 'zone-cocody',
    primary_zone_name: 'Cocody & Riviera',
    primary_zone_code: 'Z-COC',
    district_names: ['Riviera 3', 'Riviera Faya', 'Angré 8ème Tranche', 'Palmeraie'],
    assigned_zone_names: ['Cocody & Riviera'],
    assigned_district_names: ['Riviera 3', 'Riviera Faya', 'Angré 8ème Tranche'],
    allowed_client_names: ['Orange Guinée', 'SODECI Côte d\'Ivoire'],
    allowed_operation_types: ['Distribution Factures', 'Livraisons Colis COD'],
    max_cod_cash_ceiling: 1000000,
    vehicle: {
      type: 'TRICYCLE',
      license_plate: 'CI-3049-XY',
      equipment_id: 'TRI-008',
      brand_model: 'Haobin Cargo 200cc'
    },
    telemetry: {
      battery_level: 62,
      gps_status: 'EXCELLENT',
      gps_lat: 5.3599,
      gps_lng: -3.9749,
      network_mode: '4G',
      last_ping_at: 'Il y a 5 min',
      pwa_version: 'v2.4.1'
    },
    workload: {
      total_assigned: 210,
      delivered: 168,
      remaining: 35,
      failed: 7
    },
    cod: {
      collected_today: 720000,
      pending_discharge: 720000
    },
    performance: {
      success_rate: 94.8,
      avg_time_per_delivery: '12 min',
      npai_rate: 2.9,
      reconciliation_score: '98.5% (27/28 sans écart)'
    },
    route_history: []
  },
  {
    id: 'agent-103',
    full_name: 'Ousmane Sow',
    email: 'o.sow@logistrack.sn',
    phone: '+221 77 412 90 80',
    role: 'field_agent',
    avatar_url: '',
    status: 'HORS_LIGNE',
    account_status: 'ACTIF',
    pwa_pin: '9012',
    primary_zone_id: 'zone-dakar',
    primary_zone_name: 'Dakar Plateau & Medina',
    primary_zone_code: 'Z-DAK',
    district_names: ['Medina', 'Fann Residence', 'Point E', 'Colobane'],
    assigned_zone_names: ['Dakar Plateau & Medina'],
    assigned_district_names: ['Medina', 'Colobane'],
    allowed_client_names: ['Banque Atlantique', 'MTN Business'],
    allowed_operation_types: ['Plis Confidentiels', 'Livraisons Colis COD'],
    max_cod_cash_ceiling: 500000,
    vehicle: {
      type: 'MOTO',
      license_plate: 'DK-7128-BC',
      equipment_id: 'MOT-019',
      brand_model: 'Yamaha YBR 125'
    },
    telemetry: {
      battery_level: 9,
      gps_status: 'DÉSACTIVÉ',
      gps_lat: 14.6937,
      gps_lng: -17.4441,
      network_mode: 'Offline',
      last_ping_at: 'Il y a 52 min',
      pwa_version: 'v2.3.9',
      is_signal_critical: true
    },
    workload: {
      total_assigned: 160,
      delivered: 85,
      remaining: 70,
      failed: 5
    },
    cod: {
      collected_today: 345000,
      pending_discharge: 345000
    },
    performance: {
      success_rate: 91.2,
      avg_time_per_delivery: '14 min',
      npai_rate: 4.1,
      reconciliation_score: '96.0% (24/25 sans écart)'
    },
    route_history: []
  },
  {
    id: 'agent-104',
    full_name: 'Fatoumata Binta Camara',
    email: 'f.camara@logistrack.gn',
    phone: '+224 628 90 11 22',
    role: 'field_agent',
    avatar_url: '',
    status: 'EN_PAUSE',
    account_status: 'ACTIF',
    pwa_pin: '4321',
    primary_zone_id: 'zone-dixinn',
    primary_zone_name: 'Dixinn & Landréah',
    primary_zone_code: 'Z-DIX',
    district_names: ['Landréah', 'Dixinn Port', 'Hafia', 'Minière'],
    assigned_zone_names: ['Dixinn & Landréah'],
    assigned_district_names: ['Landréah', 'Dixinn Port'],
    allowed_client_names: ['Électricité De Guinée (EDG)'],
    allowed_operation_types: ['Distribution Factures'],
    max_cod_cash_ceiling: 2000000,
    vehicle: {
      type: 'À PIED',
      equipment_id: 'PED-003',
      brand_model: 'Sac de distribution Renforcé'
    },
    telemetry: {
      battery_level: 78,
      gps_status: 'EXCELLENT',
      gps_lat: 9.5412,
      gps_lng: -13.6821,
      network_mode: '4G',
      last_ping_at: 'Il y a 12 min',
      pwa_version: 'v2.4.1'
    },
    workload: {
      total_assigned: 140,
      delivered: 110,
      remaining: 26,
      failed: 4
    },
    cod: {
      collected_today: 1850000,
      pending_discharge: 1850000
    },
    performance: {
      success_rate: 96.8,
      avg_time_per_delivery: '9 min',
      npai_rate: 1.5,
      reconciliation_score: '100% (40/40 sans écart)'
    },
    route_history: []
  }
];
