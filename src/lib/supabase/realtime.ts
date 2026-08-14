import { supabase } from './queries';
import { CampaignItem } from '../../types/campaigns';
import { ClientPoDProof, ClientInvoiceSummary } from '../../types/b2bClientPortal';

// Event types for inter-portal synchronization
export type RealtimeEventType =
  | 'CAMPAIGN_CREATED'
  | 'POD_CERTIFIED'
  | 'BILLING_ISSUED'
  | 'QUOTA_WARNING';

export interface InterPortalEvent {
  type: RealtimeEventType;
  timestamp: string;
  payload: any;
}

// In-memory & BroadcastChannel fallback emitter for instant tab-to-tab sync in dev/demo
class PortalEventEmitter extends EventTarget {
  emit(event: InterPortalEvent) {
    this.dispatchEvent(new CustomEvent('portal_sync', { detail: event }));
    // Also use BroadcastChannel if supported in browser
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('logistrack_realtime_channel');
        bc.postMessage(event);
        bc.close();
      } catch (e) {
        console.warn('BroadcastChannel sync error:', e);
      }
    }
  }
}

export const portalEventEmitter = new PortalEventEmitter();

/**
 * Subscribes to live Supabase Realtime changes on distribution_campaigns, proof_of_delivery, and billing_invoices.
 */
export function setupSupabaseRealtimeSubscriptions(
  onCampaignCreated?: (campaign: CampaignItem) => void,
  onPoDCertified?: (pod: ClientPoDProof) => void,
  onBillingIssued?: (invoice: ClientInvoiceSummary) => void
) {
  // Listen to Supabase Realtime WebSocket channel if configured
  const channel = supabase
    .channel('public:multi_portal_sync')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'distribution_campaigns' },
      (payload: any) => {
        const campaignData = payload.new as any;
        if (onCampaignCreated) {
          onCampaignCreated(campaignData);
        }
        portalEventEmitter.emit({
          type: 'CAMPAIGN_CREATED',
          timestamp: new Date().toISOString(),
          payload: campaignData,
        });
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'proof_of_delivery' },
      (payload: any) => {
        const podData = payload.new as any;
        if (podData.status === 'CERTIFIED' && onPoDCertified) {
          onPoDCertified(podData);
        }
        portalEventEmitter.emit({
          type: 'POD_CERTIFIED',
          timestamp: new Date().toISOString(),
          payload: podData,
        });
      }
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'billing_invoices' },
      (payload: any) => {
        const invoiceData = payload.new as any;
        if (onBillingIssued) {
          onBillingIssued(invoiceData);
        }
        portalEventEmitter.emit({
          type: 'BILLING_ISSUED',
          timestamp: new Date().toISOString(),
          payload: invoiceData,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Broadcasts a B2B Campaign Creation event from Client Portal -> Dispatcher Dashboard
 */
export function broadcastCampaignCreated(campaign: CampaignItem) {
  portalEventEmitter.emit({
    type: 'CAMPAIGN_CREATED',
    timestamp: new Date().toISOString(),
    payload: campaign,
  });
}

/**
 * Broadcasts a PoD Certification event from Dispatcher -> B2B Client Portal
 */
export function broadcastPoDCertified(podItem: any) {
  portalEventEmitter.emit({
    type: 'POD_CERTIFIED',
    timestamp: new Date().toISOString(),
    payload: podItem,
  });
}

/**
 * Broadcasts a Billing Invoice Issuance event from Dispatcher/Finance -> B2B Client Portal
 */
export function broadcastInvoiceIssued(invoice: ClientInvoiceSummary) {
  portalEventEmitter.emit({
    type: 'BILLING_ISSUED',
    timestamp: new Date().toISOString(),
    payload: invoice,
  });
}
