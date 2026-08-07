export type PricingModel = 'FLAT_PER_UNIT' | 'VOLUME_TIERED' | 'ZONE_BASED';

export type InvoiceStatus = 'BROUILLON' | 'ÉMISE' | 'PAYÉE' | 'EN_RETARD' | 'ANNULÉE';

export interface VolumeTierBracket {
  min_qty: number;
  max_qty: number;
  unit_price: number; // e.g. 300 FCFA / GNF
}

export interface ZonePriceBracket {
  zone_code: string;
  zone_name: string;
  unit_price: number; // e.g. 1000 FCFA
}

export interface RateOptionFees {
  hand_delivery_signature_extra: number; // e.g. +100 FCFA
  npai_return_fee: number; // e.g. +50 FCFA
  cod_commission_percentage: number; // e.g. 1.5%
}

export interface ClientRateConfig {
  id: string;
  client_id: string;
  client_name: string;
  client_code: string;
  pricing_model: PricingModel;
  base_unit_price: number; // Default flat price
  volume_tiers?: VolumeTierBracket[];
  zone_prices?: ZonePriceBracket[];
  options: RateOptionFees;
  currency: string; // 'GNF' | 'FCFA' | 'XOF'
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_ht: number;
}

export interface B2BInvoice {
  id: string;
  invoice_number: string; // e.g. FAC-2026-0042
  client_id: string;
  client_name: string;
  client_code: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  client_nif: string;
  issue_date: string;
  due_date: string;
  campaign_name: string;
  status: InvoiceStatus;
  line_items: InvoiceLineItem[];
  subtotal_ht: number;
  tax_rate_percent: number; // e.g. 18% or 0%
  tax_amount: number;
  total_ttc: number;
  currency: string;
  payment_date?: string;
  payment_method?: string;
  notes?: string;
}
