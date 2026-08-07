import { MissionTemplate, MissionWorkflowStep } from '@/types/missionTemplate';

export function resolveMissionWorkflowSteps(template: MissionTemplate): MissionWorkflowStep[] {
  const steps: MissionWorkflowStep[] = [
    { id: 'step_start', name: 'Prise en Charge', type: 'START', description: 'Agent valide le démarrage de la mission' }
  ];

  // Add Proof Capture Step if any proof is MANDATORY or OPTIONAL
  const hasProofRequirements = Object.values(template.proof_config).some(
    (lvl) => lvl === 'MANDATORY' || lvl === 'OPTIONAL'
  );

  if (hasProofRequirements) {
    steps.push({
      id: 'step_proof',
      name: 'Collecte des Preuves',
      type: 'PROOF_CAPTURE',
      description: 'Capture des signatures, photos et contrôles requis'
    });
  }

  // Add COD Collection Step ONLY if has_cod is true
  if (template.has_cod) {
    steps.push({
      id: 'step_cod',
      name: 'Encaissement COD',
      type: 'COD_COLLECTION',
      description: 'Saisie du montant encaissé et du moyen de paiement'
    });
  }

  steps.push({
    id: 'step_complete',
    name: 'Validation & Clôture',
    type: 'COMPLETE',
    description: 'Mission terminée et transmise au serveur'
  });

  return steps;
}
