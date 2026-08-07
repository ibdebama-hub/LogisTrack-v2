export type CodPaymentMethod =
  | 'CASH'
  | 'MOBILE_MONEY'
  | 'BANK_CARD'
  | 'WIRE_TRANSFER'
  | 'CHEQUE';

export type CodConformanceStatus = 'CONFORME' | 'ECART_MINEUR' | 'ECART_IMPORTANT';

export type CodWorkflowStatus = 'PENDING' | 'VALIDATED' | 'RECONCILED' | 'CLOSED';

export interface CodPaymentEnterprise {
  id: string;
  cod_number: string;
  mission_id: string;
  mission_number: string;
  pod_id?: string;
  organization_id: string;
  client_id: string;
  client_name: string;
  campaign_name: string;
  recipient_name: string;
  recipient_phone: string;
  agent_id: string;
  agent_name: string;
  
  // Amounts & Method
  amount_expected: number;
  amount_collected: number;
  discrepancy_amount: number;
  currency: string;
  payment_method: CodPaymentMethod;
  payment_reference?: string;

  // Status & Conformance
  conformance_status: CodConformanceStatus;
  status: CodWorkflowStatus;

  // Audit
  reconciled_by?: string;
  reconciled_at?: string;
  notes?: string;
  agent_commission_amount?: number;

  created_at: string;
}

export interface CodKpisEnterprise {
  total_expected: number;
  total_collected: number;
  remaining_balance: number;
  validated_count: number;
  pending_count: number;
  discrepancies_count: number;
  recovery_rate: number;
}
