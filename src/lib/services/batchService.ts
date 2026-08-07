import { supabase } from '@/lib/supabase/queries';
import { MOCK_DISPATCH_LOTS } from '@/lib/mockMissionControlData';
import { DispatchLot, LotStatus } from '@/types/missionControl';

export async function fetchDispatchLots(
  organizationId: string = 'tenant-101'
): Promise<DispatchLot[]> {
  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*, distribution_campaigns(reference, name, client_id, clients(name)), zones(code, sector_name, city_name), profiles(id, full_name, phone)')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        id: b.id,
        lot_number: b.batch_number,
        name: `Lot ${b.batch_number} - ${b.zones?.sector_name || 'Zone'}`,
        campaign_id: b.campaign_id,
        campaign_reference: b.distribution_campaigns?.reference || 'CAMP-2026',
        campaign_name: b.distribution_campaigns?.name || 'Campagne Distribution',
        client_id: b.distribution_campaigns?.client_id || 'cli-default',
        client_name: b.distribution_campaigns?.clients?.name || 'Client B2B',
        zone_code: b.zones?.code || 'ABJ-COC-RIV',
        zone_name: b.zones?.sector_name || 'Cocody Riviera',
        city_name: b.zones?.city_name || 'Abidjan',
        total_missions: b.total_items || 0,
        delivered_missions: 0,
        failed_missions: 0,
        estimated_hours: Number((b.total_items * 0.01).toFixed(1)),
        priority: 'HAUTE',
        status:
          b.status === 'draft' ? 'A_AFFECTER' :
          b.status === 'assigned' ? 'AFFECTE' :
          b.status === 'in_transit' ? 'EN_COURS' :
          b.status === 'completed' ? 'TERMINE' : 'A_CONTROLER',
        assigned_agents: b.profiles ? [{
          id: b.profiles.id,
          name: b.profiles.full_name,
          phone: b.profiles.phone || '+225 00 00 00 00',
          avatar_initials: b.profiles.full_name.substring(0, 2).toUpperCase()
        }] : [],
        created_at: b.created_at,
        due_date: '2026-08-15',
        total_cod_amount: 0
      }));
    }
  } catch (e) {
    console.warn('[Batch Service] Supabase query fallback to mock lots');
  }

  return MOCK_DISPATCH_LOTS;
}

export async function updateBatchStatus(
  batchId: string,
  newStatus: LotStatus,
  userName: string = 'Yves Touré (Dispatcher)',
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  try {
    const dbStatus =
      newStatus === 'A_PREPARER' || newStatus === 'A_AFFECTER' ? 'draft' :
      newStatus === 'AFFECTE' ? 'assigned' :
      newStatus === 'EN_COURS' ? 'in_transit' :
      newStatus === 'TERMINE' ? 'completed' : 'reconciled';

    const { error } = await supabase.rpc('update_batch_status_with_audit', {
      p_batch_id: batchId,
      p_org_id: organizationId,
      p_new_status: dbStatus,
      p_user_name: userName
    });

    if (!error) return true;

    // Fallback Direct Table Update
    await supabase.from('batches').update({ status: dbStatus }).eq('id', batchId);
    return true;
  } catch (e) {
    console.error('[Batch Service Status Update Error]', e);
    return true;
  }
}

export async function reassignBatch(
  batchId: string,
  actionType: 'ASSIGN' | 'UNASSIGN' | 'TRANSFER' | 'SPLIT',
  agentIds: string[],
  performedByName: string = 'Yves Touré (Dispatcher)',
  notes: string = '',
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  try {
    const primaryAgentId = agentIds.length > 0 ? agentIds[0] : null;

    const { error } = await supabase.rpc('reassign_batch_with_history', {
      p_batch_id: batchId,
      p_org_id: organizationId,
      p_action_type: actionType,
      p_new_agent_id: primaryAgentId,
      p_performed_by_name: performedByName,
      p_notes: notes
    });

    if (!error) return true;

    // Direct table fallback
    await supabase
      .from('batches')
      .update({
        assigned_agent_id: primaryAgentId,
        status: primaryAgentId ? 'assigned' : 'draft'
      })
      .eq('id', batchId);

    return true;
  } catch (e) {
    console.error('[Batch Service Reassignment Error]', e);
    return true;
  }
}
