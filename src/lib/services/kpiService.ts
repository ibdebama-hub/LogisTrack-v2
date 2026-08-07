import { supabase } from '@/lib/supabase/queries';
import { MOCK_MISSION_CONTROL_KPIS } from '@/lib/mockMissionControlData';
import { MissionControlKpis } from '@/types/missionControl';

export async function fetchMissionControlKPIs(
  organizationId: string = 'tenant-101'
): Promise<MissionControlKpis> {
  try {
    const { data, error } = await supabase.rpc('get_mission_control_kpis', {
      p_org_id: organizationId
    });

    if (!error && data) {
      return data as MissionControlKpis;
    }
  } catch (e) {
    console.warn('[KPI Service] Supabase RPC get_mission_control_kpis fallback to mock metrics');
  }

  return MOCK_MISSION_CONTROL_KPIS;
}
