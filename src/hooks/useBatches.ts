'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchDispatchLots, updateBatchStatus, reassignBatch } from '@/lib/services/batchService';
import { DispatchLot, LotStatus } from '@/types/missionControl';

export function useBatches(organizationId: string = 'tenant-101') {
  const [lots, setLots] = useState<DispatchLot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLots = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchDispatchLots(organizationId);
      setLots(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement des lots.');
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadLots();
  }, [loadLots]);

  const changeBatchStatus = async (batchId: string, newStatus: LotStatus, userName?: string) => {
    // Optimistic UI update
    setLots((prev) =>
      prev.map((l) => (l.id === batchId ? { ...l, status: newStatus } : l))
    );
    await updateBatchStatus(batchId, newStatus, userName, organizationId);
  };

  const reassignBatchAgents = async (
    batchId: string,
    actionType: 'ASSIGN' | 'UNASSIGN' | 'TRANSFER' | 'SPLIT',
    agentIds: string[],
    performedByName?: string,
    notes?: string
  ) => {
    await reassignBatch(batchId, actionType, agentIds, performedByName, notes, organizationId);
    await loadLots();
  };

  return {
    lots,
    setLots,
    isLoading,
    error,
    refreshLots: loadLots,
    changeBatchStatus,
    reassignBatchAgents
  };
}
