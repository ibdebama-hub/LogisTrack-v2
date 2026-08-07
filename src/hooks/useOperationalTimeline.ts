'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchOperationalTimeline, recordOperationalEvent } from '@/lib/services/timelineService';
import { OperationalTimelineEvent } from '@/types/missionControl';
import { supabase } from '@/lib/supabase/queries';

export function useOperationalTimeline(organizationId: string = 'tenant-101') {
  const [timelineEvents, setTimelineEvents] = useState<OperationalTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTimeline = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchOperationalTimeline(organizationId);
    setTimelineEvents(data);
    setIsLoading(false);
  }, [organizationId]);

  useEffect(() => {
    loadTimeline();

    // Supabase Realtime Subscription for Live Operation Events
    const channel = supabase
      .channel('realtime_operation_events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'operation_events' },
        (payload) => {
          const newEvt = payload.new as any;
          setTimelineEvents((prev) => [
            {
              id: newEvt.id,
              timestamp: new Date(newEvt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              title: newEvt.title,
              description: newEvt.description,
              category: newEvt.category,
              severity: newEvt.severity || 'info',
              actor: newEvt.actor_name,
              reference_id: newEvt.reference_id
            },
            ...prev
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTimeline, organizationId]);

  const addEvent = async (evt: Partial<OperationalTimelineEvent>) => {
    // Local optimistic add
    const newLocal: OperationalTimelineEvent = {
      id: `tl-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: evt.title || 'Événement',
      description: evt.description || '',
      category: evt.category || 'DISPATCH',
      severity: evt.severity || 'info',
      actor: evt.actor || 'Yves Touré (Dispatcher)',
      reference_id: evt.reference_id
    };

    setTimelineEvents((prev) => [newLocal, ...prev]);
    await recordOperationalEvent(evt, organizationId);
  };

  return { timelineEvents, isLoading, refreshTimeline: loadTimeline, addEvent };
}
