'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCampaigns, createCampaign, CreateCampaignDTO } from '@/lib/services/campaignService';
import { CampaignItem } from '@/types/campaigns';

export function useCampaigns(organizationId: string = 'tenant-101') {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCampaigns(organizationId);
      setCampaigns(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement des campagnes.');
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const addCampaign = async (dto: CreateCampaignDTO) => {
    const res = await createCampaign({ ...dto, organization_id: organizationId });
    if (res.success) {
      await loadCampaigns();
    }
    return res;
  };

  return { campaigns, isLoading, error, refreshCampaigns: loadCampaigns, addCampaign };
}
