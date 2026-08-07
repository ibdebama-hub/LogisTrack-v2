import { supabase } from '@/lib/supabase/queries';
import { offlineEngine } from './offlineSyncEngine';
import { MOCK_DETAILED_MISSIONS } from '@/lib/mockMissionsData';
import { Mission, MissionStatus } from '@/types/mission';

export async function fetchAgentMissions(
  agentId: string = 'a1',
  organizationId: string = 'tenant-101'
): Promise<Mission[]> {
  if (!offlineEngine.getOnlineStatus()) {
    return offlineEngine.getCachedMissionsLocally();
  }

  try {
    const { data, error } = await supabase
      .from('items')
      .select('*, distribution_campaigns(reference, name, clients(name)), zones(code, sector_name, city_name)')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped: Mission[] = data.map((i: any) => ({
        id: i.id,
        mission_number: i.tracking_number,
        organization_id: i.organization_id,
        client_id: i.client_id || 'cli-default',
        client_name: i.distribution_campaigns?.clients?.name || 'Client B2B',
        client_code: 'CLI',
        campaign_id: i.campaign_id,
        campaign_reference: i.distribution_campaigns?.reference || 'CAMP-2026',
        campaign_name: i.distribution_campaigns?.name || 'Campagne Distribution',
        recipient_name: i.recipient_name,
        recipient_phone: i.recipient_phone,
        address_raw: i.address_raw,
        landmark_description: i.landmark_description,
        city_name: i.zones?.city_name || 'Abidjan',
        sector_name: i.zones?.sector_name || 'Cocody',
        latitude: i.latitude || 5.3600,
        longitude: i.longitude || -3.9700,
        item_type: i.item_type,
        operation_type: i.operation_type,
        description: i.landmark_description,
        priority: 'HAUTE',
        sla_hours: 24,
        due_date: i.due_date || '2026-08-15',
        cod_amount: Number(i.cod_amount) || 0,
        payment_status: i.payment_status || 'NO_PAYMENT_REQUIRED',
        status:
          i.status === 'in_transit' ? 'EN_COURS' :
          i.status === 'delivered' ? 'TERMINEE' :
          i.status === 'failed' ? 'ECHOUEE' : 'ACCEPTEE',
        created_at: i.created_at,
        updated_at: i.updated_at,
        history: [],
        incidents: [],
        documents: [],
        comments: []
      }));

      offlineEngine.cacheMissionsLocally(mapped);
      return mapped;
    }
  } catch (e) {
    console.warn('[Agent Service] Supabase query fallback to cached or mock missions');
  }

  const cached = offlineEngine.getCachedMissionsLocally();
  if (cached && cached.length > 0) return cached;

  offlineEngine.cacheMissionsLocally(MOCK_DETAILED_MISSIONS);
  return MOCK_DETAILED_MISSIONS;
}

export async function updateAgentGpsPosition(
  agentId: string,
  lat: number,
  lng: number,
  speed?: number,
  battery?: number,
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  if (!offlineEngine.getOnlineStatus()) return false;

  try {
    const { error } = await supabase.rpc('update_agent_gps_location', {
      p_agent_id: agentId,
      p_org_id: organizationId,
      p_lat: lat,
      p_lng: lng,
      p_speed: speed || 0,
      p_battery: battery || 85
    });

    return !error;
  } catch (e) {
    return false;
  }
}

export async function agentAcceptOrRefuseMission(
  missionId: string,
  accepted: boolean,
  refusalReason?: string,
  agentId: string = 'a1'
): Promise<boolean> {
  const targetStatus: MissionStatus = accepted ? 'ACCEPTEE' : 'BROUILLON';

  if (!offlineEngine.getOnlineStatus()) {
    offlineEngine.enqueueAction('UPDATE_STATUS', {
      mission_id: missionId,
      status: targetStatus,
      agent_id: agentId,
      refusal_reason: refusalReason
    });
    return true;
  }

  try {
    await supabase.rpc('transition_mission_status', {
      p_mission_id: missionId,
      p_org_id: 'tenant-101',
      p_new_status: targetStatus,
      p_user_name: 'Kouassi Jean-Marc (Agent)',
      p_comment: accepted ? 'Mission acceptée sur PWA Mobile' : `Mission refusée : ${refusalReason}`
    });
    return true;
  } catch (e) {
    offlineEngine.enqueueAction('UPDATE_STATUS', {
      mission_id: missionId,
      status: targetStatus,
      agent_id: agentId
    });
    return true;
  }
}

export async function agentStartMission(
  missionId: string,
  lat?: number,
  lng?: number,
  agentId: string = 'a1'
): Promise<boolean> {
  if (!offlineEngine.getOnlineStatus()) {
    offlineEngine.enqueueAction('UPDATE_STATUS', {
      mission_id: missionId,
      status: 'EN_COURS',
      agent_id: agentId,
      lat,
      lng
    });
    return true;
  }

  try {
    await supabase.rpc('transition_mission_status', {
      p_mission_id: missionId,
      p_org_id: 'tenant-101',
      p_new_status: 'EN_COURS',
      p_user_name: 'Kouassi Jean-Marc (Agent)',
      p_comment: 'Démarrage livraison GPS en direct'
    });
    return true;
  } catch (e) {
    offlineEngine.enqueueAction('UPDATE_STATUS', {
      mission_id: missionId,
      status: 'EN_COURS',
      agent_id: agentId
    });
    return true;
  }
}

export async function uploadProofPhoto(
  missionId: string,
  photoBase64: string
): Promise<{ success: boolean; url?: string }> {
  // Simulated storage upload fallback
  const mockUrl = `https://demo.supabase.co/storage/v1/object/public/pod_photos/${missionId}_${Date.now()}.jpg`;
  return { success: true, url: mockUrl };
}

export async function uploadSignatureCanvas(
  missionId: string,
  signatureDataUrl: string
): Promise<{ success: boolean; url?: string }> {
  const mockUrl = `https://demo.supabase.co/storage/v1/object/public/signatures/${missionId}_sig.png`;
  return { success: true, url: mockUrl };
}
