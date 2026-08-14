'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchMissionControlKPIs } from '../lib/services/kpiService';
import { MissionControlKpis } from '../types/missionControl';

export function useDispatcherKPIs(organizationId: string = 'tenant-101') {
  const [kpis, setKpis] = useState<MissionControlKpis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadKPIs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMissionControlKPIs(organizationId);
      setKpis(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement des KPIs.');
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadKPIs();
  }, [loadKPIs]);

  return { kpis, isLoading, error, refreshKPIs: loadKPIs };
}
