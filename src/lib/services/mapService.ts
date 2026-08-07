import { supabase } from '@/lib/supabase/queries';
import {
  SupervisionAgent,
  SupervisionMission,
  SupervisionZone,
  SupervisionIncident,
  GpsTrailPoint
} from '@/types/mapSupervision';

export const MOCK_SUPERVISION_AGENTS: SupervisionAgent[] = [
  {
    id: 'a1',
    name: 'Kouassi Jean-Marc',
    phone: '+225 07 08 12 34 56',
    avatar_initials: 'KJ',
    zone_code: 'ABJ-COC-RIV',
    zone_name: 'Cocody Riviera',
    current_lat: 5.3599,
    current_lng: -3.9723,
    speed_kmh: 24,
    battery_level: 88,
    status: 'ON_MISSION',
    active_mission_number: 'MIS-2026-0089',
    active_mission_recipient: 'Société Ivoirienne de Banque (SIB)',
    delivered_today: 34,
    total_assigned_today: 40,
    last_sync_time: 'À l\'instant'
  },
  {
    id: 'a2',
    name: 'Diallo Mamadou',
    phone: '+225 05 04 99 88 77',
    avatar_initials: 'DM',
    zone_code: 'ABJ-YOP-SEL',
    zone_name: 'Yopougon Selmer',
    current_lat: 5.3341,
    current_lng: -4.0621,
    speed_kmh: 0,
    battery_level: 94,
    status: 'ONLINE_AVAILABLE',
    active_mission_number: undefined,
    delivered_today: 45,
    total_assigned_today: 65,
    last_sync_time: 'Il y a 2 min'
  },
  {
    id: 'a3',
    name: 'Traoré Bakary',
    phone: '+223 70 12 34 56',
    avatar_initials: 'TB',
    zone_code: 'BMK-COU-01',
    zone_name: 'Bamako Coura',
    current_lat: 12.6392,
    current_lng: -8.0029,
    speed_kmh: 18,
    battery_level: 72,
    status: 'ON_MISSION',
    active_mission_number: 'MIS-2026-0091',
    active_mission_recipient: 'Cabinet Médical de l\'Union',
    delivered_today: 28,
    total_assigned_today: 35,
    last_sync_time: 'Il y a 1 min'
  },
  {
    id: 'a4',
    name: 'Ndiaye Cheikh',
    phone: '+221 77 654 32 10',
    avatar_initials: 'NC',
    zone_code: 'DKR-PLT-SAN',
    zone_name: 'Dakar Plateau',
    current_lat: 14.6928,
    current_lng: -17.4467,
    speed_kmh: 0,
    battery_level: 45,
    status: 'INCIDENT',
    active_mission_number: 'MIS-2026-0092',
    active_mission_recipient: 'Pharmacie de la Cathédrale',
    delivered_today: 12,
    total_assigned_today: 30,
    last_sync_time: 'Il y a 5 min'
  }
];

export const MOCK_SUPERVISION_MISSIONS: SupervisionMission[] = [
  {
    id: 'mis-001',
    mission_number: 'MIS-2026-0089',
    recipient_name: 'Société Ivoirienne de Banque (SIB)',
    recipient_phone: '+225 07 08 12 34 56',
    address_raw: 'Boulevard Latrille Villa 14',
    landmark_description: 'En face de la pharmacie St-Jean',
    lat: 5.3610,
    lng: -3.9740,
    status: 'EN_COURS',
    priority: 'URGENTE',
    cod_amount: 0,
    assigned_agent_id: 'a1',
    assigned_agent_name: 'Kouassi Jean-Marc'
  },
  {
    id: 'mis-002',
    mission_number: 'MIS-2026-0090',
    recipient_name: 'Sylla Fatoumata',
    recipient_phone: '+225 05 04 99 88 77',
    address_raw: 'Angré Djibi Villa 88',
    landmark_description: 'Près du château d\'eau',
    lat: 5.3580,
    lng: -3.9710,
    status: 'ECHOUEE',
    priority: 'HAUTE',
    cod_amount: 12500,
    assigned_agent_id: 'a2',
    assigned_agent_name: 'Diallo Mamadou'
  },
  {
    id: 'mis-003',
    mission_number: 'MIS-2026-0091',
    recipient_name: 'Cabinet Médical de l\'Union',
    recipient_phone: '+223 70 12 34 56',
    address_raw: 'Bamako Coura Rue 114',
    landmark_description: 'A côté de la pharmacie Populaire',
    lat: 12.6365,
    lng: -8.0010,
    status: 'VALIDEE',
    priority: 'NORMALE',
    cod_amount: 0,
    assigned_agent_id: 'a3',
    assigned_agent_name: 'Traoré Bakary'
  }
];

export const MOCK_SUPERVISION_ZONES: SupervisionZone[] = [
  {
    id: 'z1',
    code: 'ABJ-COC-RIV',
    name: 'Cocody Riviera',
    city_name: 'Abidjan',
    center_lat: 5.3600,
    center_lng: -3.9730,
    radius_meters: 2500,
    total_missions: 450,
    delivered_missions: 395,
    success_rate: 87.7,
    assigned_agents_count: 8
  },
  {
    id: 'z2',
    code: 'ABJ-YOP-SEL',
    name: 'Yopougon Selmer',
    city_name: 'Abidjan',
    center_lat: 5.3350,
    center_lng: -4.0630,
    radius_meters: 3000,
    total_missions: 680,
    delivered_missions: 590,
    success_rate: 86.7,
    assigned_agents_count: 12
  },
  {
    id: 'z3',
    code: 'BMK-COU-01',
    name: 'Bamako Coura',
    city_name: 'Bamako',
    center_lat: 12.6380,
    center_lng: -8.0020,
    radius_meters: 2000,
    total_missions: 310,
    delivered_missions: 288,
    success_rate: 92.9,
    assigned_agents_count: 5
  }
];

export const MOCK_SUPERVISION_INCIDENTS: SupervisionIncident[] = [
  {
    id: 'inc-01',
    mission_id: 'mis-002',
    mission_number: 'MIS-2026-0090',
    incident_type: 'PHONE_UNREACHABLE',
    severity: 'MEDIUM',
    lat: 5.3580,
    lng: -3.9710,
    reported_by_name: 'Diallo Mamadou',
    description: 'Le destinataire ne décroche pas après 3 tentatives d\'appel.',
    created_at: '09:45'
  }
];

export async function fetchSupervisionData(organizationId: string = 'tenant-101') {
  try {
    const { data: rpcData } = await supabase.rpc('get_map_supervision_data', { p_org_id: organizationId });
  } catch (e) {
    console.warn('[Map Service] RPC fallback to mock dataset');
  }

  return {
    agents: MOCK_SUPERVISION_AGENTS,
    missions: MOCK_SUPERVISION_MISSIONS,
    zones: MOCK_SUPERVISION_ZONES,
    incidents: MOCK_SUPERVISION_INCIDENTS
  };
}

export async function fetchAgentReplayTrail(
  agentId: string,
  date: string = '2026-08-06'
): Promise<GpsTrailPoint[]> {
  try {
    const { data } = await supabase.rpc('get_agent_replay_trail', {
      p_agent_id: agentId,
      p_date: date
    });
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (e) {}

  // Mock Trail
  return [
    { id: 't1', lat: 5.3550, lng: -3.9780, speed: 30, battery: 95, timestamp: '08:00' },
    { id: 't2', lat: 5.3580, lng: -3.9760, speed: 25, battery: 92, timestamp: '08:15' },
    { id: 't3', lat: 5.3599, lng: -3.9723, speed: 18, battery: 88, timestamp: '08:30' },
    { id: 't4', lat: 5.3610, lng: -3.9740, speed: 0, battery: 85, timestamp: '08:45' }
  ];
}
