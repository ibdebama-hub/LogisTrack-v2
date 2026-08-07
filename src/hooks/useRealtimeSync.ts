'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  portalEventEmitter,
  setupSupabaseRealtimeSubscriptions,
  InterPortalEvent,
  broadcastCampaignCreated,
  broadcastPoDCertified,
  broadcastInvoiceIssued,
} from '@/lib/supabase/realtime';
import { CampaignItem } from '@/types/campaigns';
import { ClientPoDProof, ClientInvoiceSummary } from '@/types/b2bClientPortal';

export function useRealtimeSync() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [newCampaignAlertsCount, setNewCampaignAlertsCount] = useState<number>(0);
  const [latestCampaign, setLatestCampaign] = useState<CampaignItem | null>(null);
  const [latestCertifiedPoD, setLatestCertifiedPoD] = useState<ClientPoDProof | null>(null);
  const [latestInvoice, setLatestInvoice] = useState<ClientInvoiceSummary | null>(null);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; timestamp: string; type: string }[]
  >([]);

  // Add notification item
  const addNotification = useCallback((title: string, message: string, type: string) => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  }, []);

  const handlePortalEvent = useCallback(
    (event: InterPortalEvent) => {
      if (event.type === 'CAMPAIGN_CREATED') {
        const campaign = event.payload as CampaignItem;
        setLatestCampaign(campaign);
        setNewCampaignAlertsCount((prev) => prev + 1);
        addNotification(
          '+1 Nouvelle Campagne Client',
          `Campagne "${campaign.name}" soumise par ${campaign.client_name || 'Client B2B'}.`,
          'CAMPAIGN'
        );
      } else if (event.type === 'POD_CERTIFIED') {
        const pod = event.payload as ClientPoDProof;
        setLatestCertifiedPoD(pod);
        addNotification(
          'Preuve Certifiée par le Transporteur',
          `La décharge N° ${pod.tracking_number || pod.id} a été validée (CERTIFIED).`,
          'POD'
        );
      } else if (event.type === 'BILLING_ISSUED') {
        const inv = event.payload as ClientInvoiceSummary;
        setLatestInvoice(inv);
        addNotification(
          'Nouvelle Facture d\'Honoraires Disponible',
          `Facture N° ${inv.invoice_number} d'un montant de ${inv.total_ttc?.toLocaleString('fr-FR')} ${inv.currency || 'FCFA'}.`,
          'BILLING'
        );
      }
    },
    [addNotification]
  );

  useEffect(() => {
    // 1. Listen to in-memory portalEventEmitter
    const listener = (e: Event) => {
      const customEvent = e as CustomEvent<InterPortalEvent>;
      if (customEvent.detail) {
        handlePortalEvent(customEvent.detail);
      }
    };
    portalEventEmitter.addEventListener('portal_sync', listener);

    // 2. Listen to BroadcastChannel for multi-tab sync
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('logistrack_realtime_channel');
      bc.onmessage = (event) => {
        if (event.data) {
          handlePortalEvent(event.data);
        }
      };
    }

    // 3. Setup live Supabase WebSocket subscriptions
    const unsubscribeSupabase = setupSupabaseRealtimeSubscriptions(
      (campaign) => handlePortalEvent({ type: 'CAMPAIGN_CREATED', timestamp: new Date().toISOString(), payload: campaign }),
      (pod) => handlePortalEvent({ type: 'POD_CERTIFIED', timestamp: new Date().toISOString(), payload: pod }),
      (inv) => handlePortalEvent({ type: 'BILLING_ISSUED', timestamp: new Date().toISOString(), payload: inv })
    );

    return () => {
      portalEventEmitter.removeEventListener('portal_sync', listener);
      if (bc) bc.close();
      unsubscribeSupabase();
    };
  }, [handlePortalEvent]);

  const clearCampaignAlerts = useCallback(() => {
    setNewCampaignAlertsCount(0);
  }, []);

  return {
    isConnected,
    newCampaignAlertsCount,
    latestCampaign,
    latestCertifiedPoD,
    latestInvoice,
    notifications,
    clearCampaignAlerts,
    broadcastCampaignCreated,
    broadcastPoDCertified,
    broadcastInvoiceIssued,
  };
}
