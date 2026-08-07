export type PaymentMethod = 'ESPÈCES' | 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'MOOV_MONEY' | 'VIREMENT';

export type ReconciliationStatus = 'RÉCONCILIÉ' | 'EN_ATTENTE_DEPOT';

export interface CodTransactionItem {
  id: string;
  tracking_number: string; // e.g. "LT-COD-90412"
  receipt_number: string; // e.g. "REC-2026-0884"
  client_name: string;
  recipient_name: string;
  agent_name: string;
  amount_collected: number;
  commission_fee: number;
  currency: string; // e.g. "GNF", "FCFA"
  payment_method: PaymentMethod;
  timestamp: string;
  reconciliation_status: ReconciliationStatus;
  notes?: string;
}

export interface FinanceKPIs {
  total_collected: number;
  cash_percentage: number;
  mobile_money_percentage: number;
  validated_transactions_count: number;
  total_commissions: number;
  breakdown_by_method: {
    method: PaymentMethod;
    label: string;
    amount: number;
    count: number;
    percentage: number;
    color: string;
  }[];
}
