import { supabase } from '@/lib/supabase/queries';
import { MOCK_DISPATCHER_NOTIFICATIONS } from '@/lib/mockMissionControlData';
import { DispatcherNotification } from '@/types/missionControl';

export async function fetchNotifications(
  organizationId: string = 'tenant-101'
): Promise<DispatcherNotification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data && data.length > 0) {
      return data.map((n: any) => ({
        id: n.id,
        timestamp: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: n.title,
        message: n.message,
        severity: n.severity || 'INFO',
        read: !!n.read,
        category: n.category || 'SYSTEM',
        action_url: n.action_url
      }));
    }
  } catch (e) {
    console.warn('[Notification Service] Supabase query fallback to mock notifications');
  }

  return MOCK_DISPATCHER_NOTIFICATIONS;
}

export async function markNotificationsAsRead(
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  try {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('organization_id', organizationId);
    return true;
  } catch (e) {
    return true;
  }
}

export async function clearAllNotifications(
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  try {
    await supabase
      .from('notifications')
      .delete()
      .eq('organization_id', organizationId);
    return true;
  } catch (e) {
    return true;
  }
}
