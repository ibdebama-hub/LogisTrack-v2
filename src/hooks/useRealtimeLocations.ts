'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/queries';
import { SupervisionAgent } from '@/types/mapSupervision';

export function useRealtimeLocations(initialAgents: SupervisionAgent[]) {
  const [agents, setAgents] = useState<SupervisionAgent[]>(initialAgents);

  useEffect(() => {
    setAgents(initialAgents);
  }, [initialAgents]);

  useEffect(() => {
    // Supabase Realtime WebSocket subscription on agent_locations
    const channel = supabase
      .channel('realtime_agent_locations_map')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'agent_locations' },
        (payload) => {
          const newLoc = payload.new as any;
          setAgents((prev) =>
            prev.map((a) =>
              a.id === newLoc.agent_id
                ? {
                    ...a,
                    current_lat: newLoc.latitude,
                    current_lng: newLoc.longitude,
                    speed_kmh: newLoc.speed_kmh || a.speed_kmh,
                    battery_level: newLoc.battery_level || a.battery_level,
                    last_sync_time: 'À l\'instant'
                  }
                : a
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { agents, setAgents };
}
