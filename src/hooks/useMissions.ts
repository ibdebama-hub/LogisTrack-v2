'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchMissionsPaged,
  transitionMissionStatus,
  FetchMissionsOptions
} from '@/lib/services/missionService';
import { Mission, MissionKpis, MissionStatus } from '@/types/mission';
import { MOCK_MISSIONS_KPIS } from '@/lib/mockMissionsData';

export function useMissions(organizationId: string = 'tenant-101') {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [kpis, setKpis] = useState<MissionKpis>(MOCK_MISSIONS_KPIS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<MissionStatus | 'ALL'>('ALL');
  const [selectedClient, setSelectedClient] = useState<string>('ALL');

  const loadMissions = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchMissionsPaged({
      organizationId,
      searchQuery,
      status: selectedStatus,
      clientId: selectedClient
    });

    setMissions(result.data);
    setTotalCount(result.totalCount);
    setKpis(result.kpis);
    setIsLoading(false);
  }, [organizationId, searchQuery, selectedStatus, selectedClient]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const updateStatus = async (missionId: string, newStatus: MissionStatus, comment?: string) => {
    // Optimistic UI Update
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: newStatus } : m))
    );
    await transitionMissionStatus(missionId, newStatus, 'Yves Touré (Dispatcher)', comment, organizationId);
    await loadMissions();
  };

  return {
    missions,
    totalCount,
    kpis,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedClient,
    setSelectedClient,
    refreshMissions: loadMissions,
    updateStatus
  };
}
