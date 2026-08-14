import { OperationType, PoDType } from './logistrack';

export type PoDVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ANOMALY';

export type DeliveryMethodType =
  | 'REMISE_DIRECTE'
  | 'TIERS_MANDATAIRE'
  | 'DEPOT_BOITE_AUX_LETTRES'
  | 'OTP_SMS';

export type AnomalyReason =
  | 'CLIENT_ABSENT'
  | 'ADRESSE_INTROUVABLE'
  | 'CLIENT_DEMENAGE'
  | 'REFUS_PAIEMENT_COD'
  | 'ACCES_REFUSE'
  | 'DESTINATAIRE_INJOIGNABLE';

export interface ProxyReceiverInfo {
  name: string;
  relation: string; // e.g. "Épouse", "Secrétaire", "Vigile", "Frère"
  cni_number?: string;
  phone?: string;
}

export interface PoDItem {
  id: string;
  tracking_number: string;
  client_id: string;
  client_name: string;
  client_code: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  operation_type: OperationType;
  item_type: 'invoice' | 'package' | 'confidential_mail' | 'parcel_cod';
  cod_amount?: number;
  
  // Agent & Delivery Execution
  agent_id: string;
  agent_name: string;
  zone_name: string;
  delivery_timestamp: string;
  
  // PoD & Verification Metadata
  status: PoDVerificationStatus;
  delivery_method: DeliveryMethodType;
  proof_type: 'signature' | 'photo' | 'otp';
  proof_image_url?: string; // Data URL or SVG string for signature / photo
  otp_code_verified?: string;
  
  // GPS Accuracy
  gps_lat: number;
  gps_lng: number;
  expected_lat: number;
  expected_lng: number;
  gps_distance_diff_meters: number; // e.g. 12m or 450m
  
  // Proxy Info
  proxy_info?: ProxyReceiverInfo;
  
  // Anomaly Information (if failed or reported)
  anomaly_reason?: AnomalyReason;
  anomaly_notes?: string;
  anomaly_photo_url?: string;
  
  // Audit Trail
  audit_note?: string;
  audited_by?: string;
  audited_at?: string;
}
