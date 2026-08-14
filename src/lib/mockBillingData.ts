import { ClientRateConfig, B2BInvoice } from '../types/b2bBilling';

export const MOCK_CLIENT_RATES: ClientRateConfig[] = [
  {
    id: 'rate-ogn',
    client_id: 'cli-orange',
    client_name: 'Orange Guinée',
    client_code: 'OGN',
    pricing_model: 'VOLUME_TIERED',
    base_unit_price: 2500,
    volume_tiers: [
      { min_qty: 1, max_qty: 1000, unit_price: 3000 },
      { min_qty: 1001, max_qty: 5000, unit_price: 2500 },
      { min_qty: 5001, max_qty: 999999, unit_price: 2000 }
    ],
    options: {
      hand_delivery_signature_extra: 500,
      npai_return_fee: 300,
      cod_commission_percentage: 1.5
    },
    currency: 'GNF'
  },
  {
    id: 'rate-bat',
    client_id: 'cli-ba',
    client_name: 'Banque Atlantique',
    client_code: 'BAT',
    pricing_model: 'ZONE_BASED',
    base_unit_price: 3500,
    zone_prices: [
      { zone_code: 'Z-KAL', zone_name: 'Kaloum Centre-Ville', unit_price: 3000 },
      { zone_code: 'Z-DIX', zone_name: 'Dixinn & Landréah', unit_price: 3500 },
      { zone_code: 'Z-RAT', zone_name: 'Ratoma & Kipé', unit_price: 4500 }
    ],
    options: {
      hand_delivery_signature_extra: 1000,
      npai_return_fee: 500,
      cod_commission_percentage: 2.0
    },
    currency: 'GNF'
  },
  {
    id: 'rate-edg',
    client_id: 'cli-edm',
    client_name: 'Électricité De Guinée (EDG)',
    client_code: 'EDG',
    pricing_model: 'FLAT_PER_UNIT',
    base_unit_price: 2200,
    options: {
      hand_delivery_signature_extra: 400,
      npai_return_fee: 250,
      cod_commission_percentage: 1.0
    },
    currency: 'GNF'
  },
  {
    id: 'rate-sdc',
    client_id: 'cli-sodeci',
    client_name: 'SODECI Côte d\'Ivoire',
    client_code: 'SDC',
    pricing_model: 'VOLUME_TIERED',
    base_unit_price: 250,
    volume_tiers: [
      { min_qty: 1, max_qty: 2000, unit_price: 300 },
      { min_qty: 2001, max_qty: 10000, unit_price: 250 },
      { min_qty: 10001, max_qty: 999999, unit_price: 200 }
    ],
    options: {
      hand_delivery_signature_extra: 100,
      npai_return_fee: 50,
      cod_commission_percentage: 1.2
    },
    currency: 'FCFA'
  }
];

export const MOCK_B2B_INVOICES: B2BInvoice[] = [
  {
    id: 'fac-2026-001',
    invoice_number: 'FAC-2026-0042',
    client_id: 'cli-orange',
    client_name: 'Orange Guinée',
    client_code: 'OGN',
    client_email: 'facturation@orange-guinee.com',
    client_phone: '+224 622 00 00 00',
    client_address: 'Immeuble Boulbinet, Kaloum, Conakry',
    client_nif: 'NIF-98420-GN',
    issue_date: '2026-07-30',
    due_date: '2026-08-30',
    campaign_name: 'Distribution Factures Mobile Juillet 2026',
    status: 'ÉMISE',
    line_items: [
      {
        id: 'li-1',
        description: 'Distribution Factures Intramuros (Remises directes)',
        quantity: 4500,
        unit_price: 2500,
        total_ht: 11250000
      },
      {
        id: 'li-2',
        description: 'Supplément Preuve Tactile avec Signature (PoD)',
        quantity: 3200,
        unit_price: 500,
        total_ht: 1600000
      },
      {
        id: 'li-3',
        description: 'Frais de Traitement et Traçabilité NPAI / Échecs',
        quantity: 120,
        unit_price: 300,
        total_ht: 36000
      }
    ],
    subtotal_ht: 12886000,
    tax_rate_percent: 18,
    tax_amount: 2319480,
    total_ttc: 15205480,
    currency: 'GNF',
    notes: 'Règlement à 30 jours par virement bancaire sur le compte BCI Kaloum.'
  },
  {
    id: 'fac-2026-002',
    invoice_number: 'FAC-2026-0039',
    client_id: 'cli-ba',
    client_name: 'Banque Atlantique',
    client_code: 'BAT',
    client_email: 'comptabilite@banqueatlantique.gn',
    client_phone: '+224 628 11 22 33',
    client_address: 'Avenue de la République, Almamya, Kaloum',
    client_nif: 'NIF-10928-GN',
    issue_date: '2026-07-15',
    due_date: '2026-08-15',
    campaign_name: 'Envoi Chéquiers & Relevés de Compte T2',
    status: 'PAYÉE',
    payment_date: '2026-07-28',
    payment_method: 'Virement bancaire (Ref: VIR-884102)',
    line_items: [
      {
        id: 'li-10',
        description: 'Distribution Plis Confidentiels / Relevés Sécurisés',
        quantity: 1200,
        unit_price: 3500,
        total_ht: 4200000
      },
      {
        id: 'li-11',
        description: 'Option Verification CNI Tiers Mandataire',
        quantity: 850,
        unit_price: 1000,
        total_ht: 850000
      }
    ],
    subtotal_ht: 5050000,
    tax_rate_percent: 18,
    tax_amount: 909000,
    total_ttc: 5959000,
    currency: 'GNF'
  },
  {
    id: 'fac-2026-003',
    invoice_number: 'FAC-2026-0031',
    client_id: 'cli-edm',
    client_name: 'Électricité De Guinée (EDG)',
    client_code: 'EDG',
    client_email: 'recouvrement@edg.gov.gn',
    client_phone: '+224 620 44 55 66',
    client_address: 'Cité Chemin de Fer, Kaloum, Conakry',
    client_nif: 'NIF-00129-EDG',
    issue_date: '2026-06-30',
    due_date: '2026-07-30',
    campaign_name: 'Distribution Massive Relevés d\'Électricité Juin 2026',
    status: 'EN_RETARD', // ÉCHÉANCE DÉPASSÉE
    line_items: [
      {
        id: 'li-20',
        description: 'Distribution Factures Électricité Grand Conakry',
        quantity: 12500,
        unit_price: 2200,
        total_ht: 27500000
      }
    ],
    subtotal_ht: 27500000,
    tax_rate_percent: 0, // Exonéré
    tax_amount: 0,
    total_ttc: 27500000,
    currency: 'GNF',
    notes: 'Alerte relance envoyée le 01/08/2026. En attente d\'ordonnancement du Trésor.'
  },
  {
    id: 'fac-2026-004',
    invoice_number: 'FAC-2026-0045',
    client_id: 'cli-sodeci',
    client_name: 'SODECI Côte d\'Ivoire',
    client_code: 'SDC',
    client_email: 'facturation@sodeci.ci',
    client_phone: '+225 07 00 11 22',
    client_address: 'Boulevard Clozel, Plateau, Abidjan',
    client_nif: 'NIF-30491-CI',
    issue_date: '2026-08-01',
    due_date: '2026-08-31',
    campaign_name: 'Factures d\'Eau Abidjan Sud Août 2026',
    status: 'BROUILLON',
    line_items: [
      {
        id: 'li-30',
        description: 'Distribution Factures Eau Tranche 1 (10 000 unités)',
        quantity: 10000,
        unit_price: 250,
        total_ht: 2500000
      }
    ],
    subtotal_ht: 2500000,
    tax_rate_percent: 18,
    tax_amount: 450000,
    total_ttc: 2950000,
    currency: 'FCFA'
  }
];
