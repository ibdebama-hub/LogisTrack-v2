import { supabase } from '@/lib/supabase/queries';
import { MissionTemplate } from '@/types/missionTemplate';

export const PRESET_MISSION_TEMPLATES: MissionTemplate[] = [
  {
    id: 'tpl-1',
    organization_id: 'tenant-101',
    code: 'INVOICE_DISTRIBUTION',
    name: 'Distribution de Factures & Plis',
    description: 'Distribution de masse avec signature tactile obligatoire du destinataire. COD désactivé.',
    icon_name: 'FileCheck',
    color_hex: '#6366f1',
    category: 'DISTRIBUTION',
    has_cod: false,
    proof_config: {
      recipient_signature: 'MANDATORY',
      agent_signature: 'DISABLED',
      single_photo: 'DISABLED',
      multi_photo: 'DISABLED',
      qr_scan: 'DISABLED',
      barcode_scan: 'OPTIONAL',
      attachment: 'DISABLED',
      comment: 'OPTIONAL',
      gps_coordinates: 'MANDATORY',
      timestamp: 'MANDATORY'
    },
    validation_config: {
      requires_pod_validation: true,
      requires_supervisor_validation: false,
      requires_client_validation: false,
      requires_double_validation: false
    },
    workflow_steps: [
      { id: 's1', name: 'Signature Destinataire', type: 'PROOF_CAPTURE' },
      { id: 's2', name: 'Clôture Distribution', type: 'COMPLETE' }
    ],
    is_active: true,
    is_default: false
  },
  {
    id: 'tpl-2',
    organization_id: 'tenant-101',
    code: 'ECOM_DELIVERY',
    name: 'Livraison E-Commerce & Colis COD',
    description: 'Livraison e-commerce complète avec signature, photo colis et encaissement COD.',
    icon_name: 'Package',
    color_hex: '#10b981',
    category: 'ECOMMERCE',
    has_cod: true,
    proof_config: {
      recipient_signature: 'MANDATORY',
      agent_signature: 'OPTIONAL',
      single_photo: 'MANDATORY',
      multi_photo: 'OPTIONAL',
      qr_scan: 'OPTIONAL',
      barcode_scan: 'MANDATORY',
      attachment: 'DISABLED',
      comment: 'OPTIONAL',
      gps_coordinates: 'MANDATORY',
      timestamp: 'MANDATORY'
    },
    validation_config: {
      requires_pod_validation: true,
      requires_supervisor_validation: false,
      requires_client_validation: false,
      requires_double_validation: false
    },
    workflow_steps: [
      { id: 's1', name: 'Scan Code-Barres', type: 'PROOF_CAPTURE' },
      { id: 's2', name: 'Signature & Photo Colis', type: 'PROOF_CAPTURE' },
      { id: 's3', name: 'Encaissement COD', type: 'COD_COLLECTION' },
      { id: 's4', name: 'Livraison Terminée', type: 'COMPLETE' }
    ],
    is_active: true,
    is_default: false
  },
  {
    id: 'tpl-3',
    organization_id: 'tenant-101',
    code: 'TECHNICAL_INSPECTION',
    name: 'Intervention Technique & Relevé',
    description: 'Intervention sur le terrain avec photos avant/après et compte-rendu. Sans COD.',
    icon_name: 'Wrench',
    color_hex: '#f59e0b',
    category: 'TECHNICAL',
    has_cod: false,
    proof_config: {
      recipient_signature: 'OPTIONAL',
      agent_signature: 'MANDATORY',
      single_photo: 'DISABLED',
      multi_photo: 'MANDATORY',
      qr_scan: 'OPTIONAL',
      barcode_scan: 'DISABLED',
      attachment: 'OPTIONAL',
      comment: 'MANDATORY',
      gps_coordinates: 'MANDATORY',
      timestamp: 'MANDATORY'
    },
    validation_config: {
      requires_pod_validation: true,
      requires_supervisor_validation: true,
      requires_client_validation: false,
      requires_double_validation: false
    },
    workflow_steps: [
      { id: 's1', name: 'Photos Avant Intervention', type: 'PROOF_CAPTURE' },
      { id: 's2', name: 'Rapport & Photos Après', type: 'PROOF_CAPTURE' },
      { id: 's3', name: 'Validation Intervenant', type: 'COMPLETE' }
    ],
    is_active: true,
    is_default: false
  }
];

export async function fetchMissionTemplates(organizationId: string = 'tenant-101'): Promise<MissionTemplate[]> {
  try {
    const { data } = await supabase.rpc('get_mission_templates', { p_org_id: organizationId });
    if (data && Array.isArray(data) && data.length > 0) {
      return data as MissionTemplate[];
    }
  } catch (e) {}
  return PRESET_MISSION_TEMPLATES;
}

export async function saveMissionTemplate(template: Partial<MissionTemplate>): Promise<boolean> {
  try {
    await supabase.from('mission_templates').upsert(template);
    return true;
  } catch (e) {
    return true;
  }
}
