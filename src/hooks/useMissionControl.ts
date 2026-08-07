'use client';

import { useDispatcherKPIs } from './useDispatcherKPIs';
import { useBatches } from './useBatches';
import { useCampaigns } from './useCampaigns';
import { useOperationalTimeline } from './useOperationalTimeline';
import { useNotifications } from './useNotifications';
import { MOCK_MISSION_CONTROL_KPIS } from '@/lib/mockMissionControlData';

export function useMissionControl(organizationId: string = 'tenant-101') {
  const { kpis, isLoading: isKpisLoading, refreshKPIs } = useDispatcherKPIs(organizationId);
  const { lots, setLots, isLoading: isLotsLoading, refreshLots, changeBatchStatus, reassignBatchAgents } = useBatches(organizationId);
  const { campaigns, isLoading: isCampaignsLoading, refreshCampaigns, addCampaign } = useCampaigns(organizationId);
  const { timelineEvents, refreshTimeline, addEvent } = useOperationalTimeline(organizationId);
  const { notifications, setNotifications, refreshNotifications, markAllRead, clearAll } = useNotifications(organizationId);

  const refreshAll = () => {
    refreshKPIs();
    refreshLots();
    refreshCampaigns();
    refreshTimeline();
    refreshNotifications();
  };

  return {
    kpis: kpis || MOCK_MISSION_CONTROL_KPIS,
    lots,
    setLots,
    campaigns,
    timelineEvents,
    notifications,
    setNotifications,
    isLoading: isKpisLoading || isLotsLoading || isCampaignsLoading,
    refreshAll,
    changeBatchStatus,
    reassignBatchAgents,
    addCampaign,
    addEvent,
    markAllRead,
    clearAll
  };
}
