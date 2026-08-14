'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchAgentMissions,
  agentAcceptOrRefuseMission,
  agentStartMission
} from '../lib/services/agentService';
import { Mission, MissionStatus } from '../types/mission';

export function useAgentMissions(agentId: string = 'a1') {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadMissions = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchAgentMissions(agentId);
    setMissions(data);
    setIsLoading(false);
  }, [agentId]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const acceptMission = async (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: 'ACCEPTEE' } : m))
    );
    await agentAcceptOrRefuseMission(missionId, true, undefined, agentId);
  };

  const refuseMission = async (missionId: string, reason: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== missionId));
    await agentAcceptOrRefuseMission(missionId, false, reason, agentId);
  };

  const startMission = async (missionId: string, lat?: number, lng?: number) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: 'EN_COURS' } : m))
    );
    await agentStartMission(missionId, lat, lng, agentId);
  };

  return {
    missions,
    isLoading,
    refreshMissions: loadMissions,
    acceptMission,
    refuseMission,
    startMission
  };
}
