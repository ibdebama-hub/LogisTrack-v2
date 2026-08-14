import { CodTransactionItem, FinanceKPIs } from '../types/financeReports';

export const MOCK_COD_TRANSACTIONS: CodTransactionItem[] = [
  {
    id: 'tx-101',
    tracking_number: 'LT-COD-90412',
    receipt_number: 'REC-2026-0884',
    client_name: 'Orange Guinée',
    recipient_name: 'Sory Camara',
    agent_name: 'Mamadou Diallo',
    amount_collected: 485000,
    commission_fee: 14550,
    currency: 'GNF',
    payment_method: 'ORANGE_MONEY',
    timestamp: '2026-08-05 09:10',
    reconciliation_status: 'RÉCONCILIÉ',
    notes: 'Paiement via USSD Orange Money certifié'
  },
  {
    id: 'tx-102',
    tracking_number: 'LT-COD-90415',
    receipt_number: 'REC-2026-0885',
    client_name: 'Jumia Conakry',
    recipient_name: 'Mariama Sylla',
    agent_name: 'Mamadou Diallo',
    amount_collected: 750000,
    commission_fee: 22500,
    currency: 'GNF',
    payment_method: 'ESPÈCES',
    timestamp: '2026-08-05 10:25',
    reconciliation_status: 'RÉCONCILIÉ',
    notes: 'Caisse déchargée au guichet'
  },
  {
    id: 'tx-103',
    tracking_number: 'LT-COD-90420',
    receipt_number: 'REC-2026-0886',
    client_name: 'SODECI Côte d\'Ivoire',
    recipient_name: 'Koffi Jean-Marc',
    agent_name: 'Koffi Jean-Baptiste',
    amount_collected: 125000,
    commission_fee: 3750,
    currency: 'FCFA',
    payment_method: 'WAVE',
    timestamp: '2026-08-05 11:00',
    reconciliation_status: 'RÉCONCILIÉ'
  },
  {
    id: 'tx-104',
    tracking_number: 'LT-COD-90433',
    receipt_number: 'REC-2026-0887',
    client_name: 'Banque Atlantique',
    recipient_name: 'Fatoumata Binta',
    agent_name: 'Fatoumata Camara',
    amount_collected: 1850000,
    commission_fee: 55500,
    currency: 'GNF',
    payment_method: 'ESPÈCES',
    timestamp: '2026-08-05 11:45',
    reconciliation_status: 'EN_ATTENTE_DEPOT'
  },
  {
    id: 'tx-105',
    tracking_number: 'LT-COD-90440',
    receipt_number: 'REC-2026-0888',
    client_name: 'MTN Business',
    recipient_name: 'Ousmane Sow',
    agent_name: 'Ousmane Sow',
    amount_collected: 345000,
    commission_fee: 10350,
    currency: 'FCFA',
    payment_method: 'MTN_MOMO',
    timestamp: '2026-08-05 12:15',
    reconciliation_status: 'RÉCONCILIÉ'
  }
];

export const MOCK_FINANCE_KPIS: FinanceKPIs = {
  total_collected: 3555000,
  cash_percentage: 58.5,
  mobile_money_percentage: 41.5,
  validated_transactions_count: 5,
  total_commissions: 106650,
  breakdown_by_method: [
    { method: 'ESPÈCES', label: 'Espèces (Cash in Hand)', amount: 2600000, count: 2, percentage: 58.5, color: 'bg-emerald-500' },
    { method: 'ORANGE_MONEY', label: 'Orange Money', amount: 485000, count: 1, percentage: 22.0, color: 'bg-amber-500' },
    { method: 'WAVE', label: 'Wave Digital', amount: 125000, count: 1, percentage: 10.0, color: 'bg-sky-400' },
    { method: 'MTN_MOMO', label: 'MTN MoMo', amount: 345000, count: 1, percentage: 9.5, color: 'bg-yellow-400' }
  ]
};
