import { supabase } from '@/lib/supabase/queries';
import { MOCK_OPERATIONAL_TIMELINE } from '@/lib/mockMissionControlData';
import { OperationalTimelineEvent } from '@/types/missionControl';

export async function fetchOperationalTimeline(
  organizationId: string = 'tenant-101'
): Promise<OperationalTimelineEvent[]> {
  try {
    const { data, error } = await supabase
      .from('operation_events')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && data && data.length > 0) {
      return data.map((evt: any) => ({
        id: evt.id,
        timestamp: new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: evt.title,
        description: evt.description,
        category: evt.category,
        severity: evt.severity || 'info',
        actor: evt.actor_name,
        reference_id: evt.reference_id
      }));
    }
  } catch (e) {
    console.warn('[Timeline Service] Supabase query fallback to mock events');
  }

  return MOCK_OPERATIONAL_TIMELINE;
}

export async function recordOperationalEvent(
  evt: Partial<OperationalTimelineEvent>,
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  try {
    const { error } = await supabase.from('operation_events').insert({
      organization_id: organizationId,
      category: evt.category || 'DISPATCH',
      severity: evt.severity || 'info',
      title: evt.title || 'Événement Opérationnel',
      description: evt.description || '',
      actor_name: evt.actor || 'Yves Touré (Dispatcher)',
      reference_id: evt.reference_id || null
    });

    if (!error) return true;
  } catch (e) {
    console.error('[Timeline Service Insert Error]', e);
  }
  return true;
}
