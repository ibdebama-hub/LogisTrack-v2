export type ProofRequirementLevel = 'MANDATORY' | 'OPTIONAL' | 'DISABLED';

export interface MissionProofConfig {
  recipient_signature: ProofRequirementLevel;
  agent_signature: ProofRequirementLevel;
  single_photo: ProofRequirementLevel;
  multi_photo: ProofRequirementLevel;
  qr_scan: ProofRequirementLevel;
  barcode_scan: ProofRequirementLevel;
  attachment: ProofRequirementLevel;
  comment: ProofRequirementLevel;
  gps_coordinates: ProofRequirementLevel;
  timestamp: ProofRequirementLevel;
}

export interface MissionValidationConfig {
  requires_pod_validation: boolean;
  requires_supervisor_validation: boolean;
  requires_client_validation: boolean;
  requires_double_validation: boolean;
}

export interface MissionWorkflowStep {
  id: string;
  name: string;
  type: 'START' | 'PROOF_CAPTURE' | 'COD_COLLECTION' | 'INSPECTION' | 'COMPLETE';
  description?: string;
}

export interface MissionTemplate {
  id: string;
  organization_id: string;
  code: string;
  name: string;
  description: string;
  icon_name: string;
  color_hex: string;
  category: 'DISTRIBUTION' | 'COURIER' | 'ECOMMERCE' | 'TECHNICAL' | 'COLLECTION';
  
  has_cod: boolean;
  proof_config: MissionProofConfig;
  validation_config: MissionValidationConfig;
  workflow_steps: MissionWorkflowStep[];
  
  is_active: boolean;
  is_default: boolean;
  created_at?: string;
}
