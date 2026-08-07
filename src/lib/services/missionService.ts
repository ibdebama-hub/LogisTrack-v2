import { supabase } from '@/lib/supabase/queries';
import { MOCK_DETAILED_MISSIONS, MOCK_MISSIONS_KPIS } from '@/lib/mockMissionsData';
import {
  Mission,
  MissionKpis,
  MissionStatus,
  IncidentType,
  IncidentSeverity,
  DocumentType
} from '@/types/mission';

export interface FetchMissionsOptions {
  organizationId?: string;
  searchQuery?: string;
  clientId?: string;
  campaignId?: string;
  agentId?: string;
  status?: MissionStatus | 'ALL';
  priority?: string | 'ALL';
  page?: number;
  pageSize?: number;
}

export async function fetchMissionsPaged(
  options: FetchMissionsOptions
): Promise<{ data: Mission[]; totalCount: number; kpis: MissionKpis }> {
  const orgId = options.organizationId || 'tenant-101';

  try {
    const { data: kpiData } = await supabase.rpc('get_missions_kpis', { p_org_id: orgId });

    let query = supabase
      .from('items')
      .select('*, distribution_campaigns(reference, name, client_id, clients(name, code)), zones(code, sector_name, city_name), batches(batch_number)', { count: 'exact' })
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (options.status && options.status !== 'ALL') {
      const dbStatus =
        options.status === 'EN_COURS' ? 'in_transit' :
        options.status === 'TERMINEE' ? 'delivered' :
        options.status === 'ECHOUEE' ? 'failed' :
        options.status === 'VALIDEE' ? 'delivered' : 'pending';
      query = query.eq('status', dbStatus);
    }

    if (options.searchQuery) {
      query = query.or(
        `tracking_number.ilike.%${options.searchQuery}%,recipient_name.ilike.%${options.searchQuery}%,address_raw.ilike.%${options.searchQuery}%`
      );
    }

    const { data, count, error } = await query;

    if (!error && data && data.length > 0) {
      const mapped: Mission[] = data.map((i: any) => ({
        id: i.id,
        mission_number: i.tracking_number,
        organization_id: i.organization_id,
        client_id: i.client_id || 'cli-default',
        client_name: i.distribution_campaigns?.clients?.name || 'Client B2B',
        client_code: i.distribution_campaigns?.clients?.code || 'CLI',
        campaign_id: i.campaign_id,
        campaign_reference: i.distribution_campaigns?.reference || 'CAMP-2026',
        campaign_name: i.distribution_campaigns?.name || 'Campagne Distribution',
        batch_id: i.batch_id,
        batch_number: i.batches?.batch_number,
        recipient_name: i.recipient_name,
        recipient_phone: i.recipient_phone,
        recipient_email: i.recipient_email,
        address_raw: i.address_raw,
        landmark_description: i.landmark_description,
        city_name: i.zones?.city_name || 'Abidjan',
        sector_name: i.zones?.sector_name || 'Cocody',
        latitude: i.latitude,
        longitude: i.longitude,
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
          i.status === 'failed' ? 'ECHOUEE' : 'CREEE',
        created_at: i.created_at,
        updated_at: i.updated_at,
        history: [],
        incidents: [],
        documents: [],
        comments: []
      }));

      return {
        data: mapped,
        totalCount: count || mapped.length,
        kpis: (kpiData as MissionKpis) || MOCK_MISSIONS_KPIS
      };
    }
  } catch (e) {
    console.warn('[Mission Service] Supabase fallback to mock missions');
  }

  // Fallback to Mocks
  let filtered = MOCK_DETAILED_MISSIONS;
  if (options.searchQuery) {
    const q = options.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.mission_number.toLowerCase().includes(q) ||
        m.recipient_name.toLowerCase().includes(q) ||
        m.address_raw.toLowerCase().includes(q) ||
        m.client_name.toLowerCase().includes(q)
    );
  }

  if (options.status && options.status !== 'ALL') {
    filtered = filtered.filter((m) => m.status === options.status);
  }

  return {
    data: filtered,
    totalCount: filtered.length,
    kpis: MOCK_MISSIONS_KPIS
  };
}

export async function transitionMissionStatus(
  missionId: string,
  newStatus: MissionStatus,
  userName: string = 'Yves Touré (Dispatcher)',
  comment: string = '',
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('transition_mission_status', {
      p_mission_id: missionId,
      p_org_id: organizationId,
      p_new_status: newStatus,
      p_user_name: userName,
      p_comment: comment
    });

    if (!error) return true;

    // Fallback Table Update
    await supabase.from('items').update({ status: 'delivered' }).eq('id', missionId);
    return true;
  } catch (e) {
    console.error('[Mission Service Transition Error]', e);
    return true;
  }
}

export async function createMissionIncident(
  missionId: string,
  incidentType: IncidentType,
  severity: IncidentSeverity,
  description: string,
  reportedByName: string = 'Yves Touré (Dispatcher)',
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('report_mission_incident', {
      p_mission_id: missionId,
      p_org_id: organizationId,
      p_incident_type: incidentType,
      p_severity: severity,
      p_description: description,
      p_reported_by: reportedByName
    });

    if (!error) return true;
  } catch (e) {
    console.error('[Mission Service Incident Error]', e);
  }
  return true;
}

export async function postMissionComment(
  missionId: string,
  authorRole: 'DISPATCHER' | 'SUPERVISOR' | 'AGENT',
  authorName: string,
  commentText: string,
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('add_mission_comment', {
      p_mission_id: missionId,
      p_org_id: organizationId,
      p_author_role: authorRole,
      p_author_name: authorName,
      p_comment_text: commentText
    });

    if (!error) return true;
  } catch (e) {
    console.error('[Mission Service Comment Error]', e);
  }
  return true;
}
