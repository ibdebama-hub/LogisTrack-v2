import { MissionTemplate } from '@/types/missionTemplate';

export interface ProofExecutionPayload {
  has_recipient_signature?: boolean;
  has_agent_signature?: boolean;
  photo_count?: number;
  has_qr_scan?: boolean;
  has_barcode_scan?: boolean;
  has_attachment?: boolean;
  has_comment?: boolean;
  has_gps?: boolean;
}

export interface ValidationEngineResult {
  is_valid: boolean;
  missing_proofs: string[];
}

export function validateMissionExecutionProof(
  template: MissionTemplate,
  payload: ProofExecutionPayload
): ValidationEngineResult {
  const missing_proofs: string[] = [];

  const pConfig = template.proof_config;

  if (pConfig.recipient_signature === 'MANDATORY' && !payload.has_recipient_signature) {
    missing_proofs.push('Signature du Destinataire');
  }

  if (pConfig.agent_signature === 'MANDATORY' && !payload.has_agent_signature) {
    missing_proofs.push('Signature de l\'Agent');
  }

  if (pConfig.single_photo === 'MANDATORY' && (!payload.photo_count || payload.photo_count < 1)) {
    missing_proofs.push('Photo de Preuve (1 photo min)');
  }

  if (pConfig.multi_photo === 'MANDATORY' && (!payload.photo_count || payload.photo_count < 2)) {
    missing_proofs.push('Photos de Preuve (2 photos min)');
  }

  if (pConfig.qr_scan === 'MANDATORY' && !payload.has_qr_scan) {
    missing_proofs.push('Scan du QR Code');
  }

  if (pConfig.barcode_scan === 'MANDATORY' && !payload.has_barcode_scan) {
    missing_proofs.push('Scan du Code-Barres');
  }

  if (pConfig.comment === 'MANDATORY' && !payload.has_comment) {
    missing_proofs.push('Commentaire d\'Exécution');
  }

  if (pConfig.gps_coordinates === 'MANDATORY' && !payload.has_gps) {
    missing_proofs.push('Coordonnées GPS Réelles');
  }

  return {
    is_valid: missing_proofs.length === 0,
    missing_proofs
  };
}
