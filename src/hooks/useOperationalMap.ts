'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchSupervisionData,
  fetchAgentReplayTrail
} from '@/lib/services/mapService';
import {
  SupervisionAgent,
  SupervisionMission,
  SupervisionZone,
  SupervisionIncident,
  LayerToggles,
  GpsTrailPoint
} from '@/types/mapSupervision';
import { useRealtimeLocations } from './useRealtimeLocations';

export function useOperationalMap(organizationId: string = 'tenant-101') {
  const [rawAgents, setRawAgents] = useState<SupervisionAgent[]>([]);
  const [missions, setMissions] = useState<SupervisionMission[]>([]);
  const [zones, setZones] = useState<SupervisionZone[]>([]);
  const [incidents, setIncidents] = useState<SupervisionIncident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Realtime Agents hook
  const { agents } = useRealtimeLocations(rawAgents);

  // Layer Toggles
  const [layers, setLayers] = useState<LayerToggles>({
    agents: true,
    missions: true,
    zones: true,
    heatmap: false,
    incidents: true,
    routes: true,
    replay: false
  });

  // Replay State
  const [selectedAgentForReplay, setSelectedAgentForReplay] = useState<string | null>(null);
  const [replayTrail, setReplayTrail] = useState<GpsTrailPoint[]>([]);
  const [replayIndex, setReplayIndex] = useState<number>(0);
  const [isReplaying, setIsReplaying] = useState<boolean>(false);

  // Map Focus Target (lat, lng, zoom)
  const [focusTarget, setFocusTarget] = useState<{ lat: number; lng: number; zoom: number } | null>({
    lat: 5.3600,
    lng: -3.9730,
    zoom: 13
  });

  // Active Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const res = await fetchSupervisionData(organizationId);
    setRawAgents(res.agents);
    setMissions(res.missions);
    setZones(res.zones);
    setIncidents(res.incidents);
    setIsLoading(false);
  }, [organizationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleLayer = (layerKey: keyof LayerToggles) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const focusEntity = (lat: number, lng: number, zoom: number = 15) => {
    setFocusTarget({ lat, lng, zoom });
  };

  const startAgentReplay = async (agentId: string) => {
    setSelectedAgentForReplay(agentId);
    setLayers((prev) => ({ ...prev, replay: true }));
    const trail = await fetchAgentReplayTrail(agentId);
    setReplayTrail(trail);
    setReplayIndex(0);
    setIsReplaying(true);

    if (trail.length > 0) {
      setFocusTarget({ lat: trail[0].lat, lng: trail[0].lng, zoom: 16 });
    }
  };

  const stopAgentReplay = () => {
    setSelectedAgentForReplay(null);
    setIsReplaying(false);
    setReplayTrail([]);
    setLayers((prev) => ({ ...prev, replay: false }));
  };

  return {
    agents,
    missions,
    zones,
    incidents,
    layers,
    toggleLayer,
    focusTarget,
    focusEntity,
    searchQuery,
    setSearchQuery,
    isLoading,
    refreshMap: loadData,

    // Replay
    selectedAgentForReplay,
    replayTrail,
    replayIndex,
    setReplayIndex,
    isReplaying,
    setIsReplaying,
    startAgentReplay,
    stopAgentReplay
  };
}
