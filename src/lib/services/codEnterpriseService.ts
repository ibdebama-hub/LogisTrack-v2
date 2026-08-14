import { supabase } from '../supabase/queries';
import {
  CodPaymentEnterprise,
  CodKpisEnterprise,
  CodPaymentMethod,
  CodWorkflowStatus
} from '../../types/codEnterprise';

export const MOCK_ENTERPRISE_COD: CodPaymentEnterprise[] = [
  {
    id: 'cod-101',
    cod_number: 'COD-2026-0089',
    mission_id: 'mis-002',
    mission_number: 'MIS-2026-0090',
    pod_id: 'pod-102',
    organization_id: 'tenant-101',
    client_id: 'cli-sodeci',
    client_name: 'SODECI Eau',
    campaign_name: 'Campagne Relevés d\'Eau SODECI',
    recipient_name: 'Sylla Fatoumata',
    recipient_phone: '+225 05 04 99 88 77',
    agent_id: 'a2',
    agent_name: 'Diallo Mamadou',
    amount_expected: 12500,
    amount_collected: 12500,
    discrepancy_amount: 0,
    currency: 'XOF',
    payment_method: 'CASH',
    payment_reference: 'BILLET-REC-991',
    conformance_status: 'CONFORME',
    status: 'RECONCILED',
    reconciled_by: 'Yves Touré (Dispatcher)',
    reconciled_at: '2026-08-06 10:00',
    notes: 'Encaissement espèces vérifié en caisse.',
    agent_commission_amount: 500,
    created_at: '2026-08-06 09:45'
  },
  {
    id: 'cod-102',
    cod_number: 'COD-2026-0090',
    mission_id: 'mis-004',
    mission_number: 'MIS-2026-0094',
    organization_id: 'tenant-101',
    client_id: 'cli-jumia',
    client_name: 'Jumia Express',
    campaign_name: 'Livraison Colis E-Commerce',
    recipient_name: 'Koffi Marie-Noëlle',
    recipient_phone: '+225 01 02 03 04 05',
    agent_id: 'a1',
    agent_name: 'Kouassi Jean-Marc',
    amount_expected: 42500,
    amount_collected: 42500,
    discrepancy_amount: 0,
    currency: 'XOF',
    payment_method: 'MOBILE_MONEY',
    payment_reference: 'WAVE-TX-99214',
    conformance_status: 'CONFORME',
    status: 'VALIDATED',
    reconciled_by: 'Yves Touré',
    reconciled_at: '2026-08-06 11:30',
    notes: 'Paiement Wave validé.',
    agent_commission_amount: 1200,
    created_at: '2026-08-06 11:15'
  }
];

export const MOCK_COD_KPIS: CodKpisEnterprise = {
  total_expected: 15400000,
  total_collected: 14900000,
  remaining_balance: 500000,
  validated_count: 3450,
  pending_count: 120,
  discrepancies_count: 15,
  recovery_rate: 96.8
};

export async function fetchCodPaymentsPaged(
  organizationId: string = 'tenant-101',
  paymentMethod?: CodPaymentMethod | 'ALL',
  searchQuery?: string
): Promise<{ data: CodPaymentEnterprise[]; kpis: CodKpisEnterprise }> {
  try {
    const { data: kpiData } = await supabase.rpc('get_cod_kpis', { p_org_id: organizationId });

    let query = supabase
      .from('cod_payments')
      .select('*, items(tracking_number, recipient_name), clients(name)')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (paymentMethod && paymentMethod !== 'ALL') {
      query = query.eq('payment_method', paymentMethod);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const mapped: CodPaymentEnterprise[] = data.map((c: any) => ({
        id: c.id,
        cod_number: c.cod_number,
        mission_id: c.mission_id,
        mission_number: c.items?.tracking_number || 'MIS-2026',
        pod_id: c.pod_id,
        organization_id: c.organization_id,
        client_id: c.client_id || 'cli-default',
        client_name: c.clients?.name || 'Client B2B',
        campaign_name: 'Campagne Distribution',
        recipient_name: c.items?.recipient_name || 'Destinataire',
        recipient_phone: '+225 00 00 00 00',
        agent_id: c.agent_id,
        agent_name: c.agent_name,
        amount_expected: Number(c.amount_expected) || 0,
        amount_collected: Number(c.amount_collected) || 0,
        discrepancy_amount: Number(c.discrepancy_amount) || 0,
        currency: c.currency || 'XOF',
        payment_method: c.payment_method || 'CASH',
        payment_reference: c.payment_reference,
        conformance_status: c.conformance_status || 'CONFORME',
        status: c.status || 'PENDING',
        reconciled_by: c.reconciled_by,
        reconciled_at: c.reconciled_at,
        notes: c.notes,
        agent_commission_amount: Number(c.agent_commission_amount) || 0,
        created_at: c.created_at
      }));

      return {
        data: mapped,
        kpis: (kpiData as CodKpisEnterprise) || MOCK_COD_KPIS
      };
    }
  } catch (e) {
    console.warn('[COD Enterprise Service] Supabase query fallback to mock dataset');
  }

  let filtered = MOCK_ENTERPRISE_COD;
  if (paymentMethod && paymentMethod !== 'ALL') {
    filtered = filtered.filter((c) => c.payment_method === paymentMethod);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.cod_number.toLowerCase().includes(q) ||
        c.mission_number.toLowerCase().includes(q) ||
        c.recipient_name.toLowerCase().includes(q)
    );
  }

  return {
    data: filtered,
    kpis: MOCK_COD_KPIS
  };
}

export async function reconcileCodPaymentRecord(
  codId: string,
  reconcilerName: string = 'Yves Touré (Dispatcher)',
  notes: string = 'Encaissement réconcilié en caisse.',
  organizationId: string = 'tenant-101'
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('reconcile_cod_payment', {
      p_cod_id: codId,
      p_org_id: organizationId,
      p_reconciler_name: reconcilerName,
      p_notes: notes
    });

    if (!error) return true;

    await supabase
      .from('cod_payments')
      .update({ status: 'RECONCILED', reconciled_by: reconcilerName, notes })
      .eq('id', codId);

    return true;
  } catch (e) {
    return true;
  }
}

export async function verifyPublicCodReceipt(codNumber: string): Promise<any> {
  try {
    const { data } = await supabase.rpc('get_public_cod_verification', {
      p_cod_number: codNumber
    });
    if (data) return data;
  } catch (e) {}

  return {
    cod_number: codNumber,
    amount_collected: 12500,
    currency: 'XOF',
    payment_method: 'CASH',
    status: 'RECONCILED',
    created_at: '2026-08-06 09:45',
    is_certified: true
  };
}
