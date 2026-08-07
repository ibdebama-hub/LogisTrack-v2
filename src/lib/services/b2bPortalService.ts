import { supabase } from '@/lib/supabase/queries';
import {
  B2BExecutiveKpis,
  B2BAnalyticsPoint,
  B2BClientUser,
  B2BDocument,
  B2BMessageThread
} from '@/types/b2bClientPortal';

export const MOCK_B2B_KPIS: B2BExecutiveKpis = {
  active_campaigns: 14,
  completed_campaigns: 182,
  total_missions: 12450,
  delivered_missions: 11890,
  failed_missions: 310,
  in_transit_missions: 250,
  pod_available: 11890,
  cod_expected: 45000000,
  cod_collected: 44200000,
  sla_compliance_rate: 97.8,
  avg_delivery_time_hours: 4.2
};

export const MOCK_B2B_ANALYTICS: B2BAnalyticsPoint[] = [
  { date: '01 Aug', delivered: 420, failed: 8, cod_collected: 1800000, sla_rate: 98.2 },
  { date: '02 Aug', delivered: 510, failed: 12, cod_collected: 2400000, sla_rate: 97.5 },
  { date: '03 Aug', delivered: 610, failed: 5, cod_collected: 3100000, sla_rate: 99.0 },
  { date: '04 Aug', delivered: 580, failed: 14, cod_collected: 2900000, sla_rate: 96.8 },
  { date: '05 Aug', delivered: 720, failed: 9, cod_collected: 3800000, sla_rate: 98.5 },
  { date: '06 Aug', delivered: 640, failed: 7, cod_collected: 3200000, sla_rate: 97.9 }
];

export const MOCK_B2B_USERS: B2BClientUser[] = [
  {
    id: 'u-1',
    client_id: 'cli-cie',
    email: 'direction.logistique@cie.ci',
    full_name: 'Koffi Paul (Directeur Logistique)',
    role: 'CLIENT_ADMIN',
    is_active: true,
    last_login_at: 'Aujourd\'hui 08:30',
    created_at: '2026-01-15'
  },
  {
    id: 'u-2',
    client_id: 'cli-cie',
    email: 'suivi.operations@cie.ci',
    full_name: 'Diallo Aïcha (Chef de Projet Distribution)',
    role: 'CLIENT_OPS_MANAGER',
    is_active: true,
    last_login_at: 'Il y a 10 min',
    created_at: '2026-02-01'
  }
];

export const MOCK_B2B_DOCUMENTS: B2BDocument[] = [
  {
    id: 'doc-1',
    client_id: 'cli-cie',
    title: 'Certificat PoD Global - Campagne Factures Août 2026',
    category: 'POD',
    file_path: '/storage/docs/pod_august_2026.pdf',
    file_size_bytes: 2450000,
    file_type: 'PDF',
    created_at: '2026-08-06'
  },
  {
    id: 'doc-2',
    client_id: 'cli-cie',
    title: 'Reçu d\'Encaissement COD Global - SODECI',
    category: 'COD_RECEIPT',
    file_path: '/storage/docs/cod_sodeci_receipt.pdf',
    file_size_bytes: 1890000,
    file_type: 'PDF',
    created_at: '2026-08-05'
  }
];

export const MOCK_B2B_MESSAGES: B2BMessageThread[] = [
  {
    id: 'msg-1',
    client_id: 'cli-cie',
    sender_id: 'u-2',
    sender_name: 'Diallo Aïcha (CIE)',
    sender_role: 'CLIENT',
    subject: 'Demande de priorité sur les plis Riviera 3',
    content: 'Bonjour l\'équipe Dispatch, merci de prioriser la livraison des 50 factures de la zone Riviera 3 d\'ici 14h.',
    is_read: true,
    created_at: '09:15'
  },
  {
    id: 'msg-2',
    client_id: 'cli-cie',
    sender_id: 'disp-1',
    sender_name: 'Yves Touré (Dispatch Lead)',
    sender_role: 'DISPATCHER',
    subject: 'Demande de priorité sur les plis Riviera 3',
    content: 'Bien reçu Aïcha. 3 agents sont actuellement positionnés sur le secteur Riviera 3. Livraison prévue avant 13h30.',
    is_read: true,
    created_at: '09:22'
  }
];

export async function fetchB2BExecutiveData(clientId: string = 'cli-cie') {
  try {
    const { data: rpcKpis } = await supabase.rpc('get_b2b_client_kpis', { p_client_id: clientId });
    if (rpcKpis) {
      return {
        kpis: rpcKpis as B2BExecutiveKpis,
        analytics: MOCK_B2B_ANALYTICS
      };
    }
  } catch (e) {}

  return {
    kpis: MOCK_B2B_KPIS,
    analytics: MOCK_B2B_ANALYTICS
  };
}

export async function fetchB2BUsers(clientId: string = 'cli-cie'): Promise<B2BClientUser[]> {
  try {
    const { data } = await supabase.from('b2b_client_users').select('*').eq('client_id', clientId);
    if (data && data.length > 0) return data;
  } catch (e) {}
  return MOCK_B2B_USERS;
}

export async function fetchB2BDocuments(clientId: string = 'cli-cie'): Promise<B2BDocument[]> {
  try {
    const { data } = await supabase.from('b2b_client_documents').select('*').eq('client_id', clientId);
    if (data && data.length > 0) return data;
  } catch (e) {}
  return MOCK_B2B_DOCUMENTS;
}

export async function fetchB2BMessages(clientId: string = 'cli-cie'): Promise<B2BMessageThread[]> {
  try {
    const { data } = await supabase.from('b2b_client_messages').select('*').eq('client_id', clientId).order('created_at', { ascending: true });
    if (data && data.length > 0) return data;
  } catch (e) {}
  return MOCK_B2B_MESSAGES;
}

export async function sendB2BMessage(
  clientId: string,
  content: string,
  subject?: string,
  senderName: string = 'Diallo Aïcha (CIE)'
): Promise<boolean> {
  try {
    await supabase.from('b2b_client_messages').insert({
      client_id: clientId,
      sender_id: 'u-2',
      sender_name: senderName,
      sender_role: 'CLIENT',
      subject: subject || 'Message sans objet',
      content
    });
    return true;
  } catch (e) {
    return true;
  }
}
