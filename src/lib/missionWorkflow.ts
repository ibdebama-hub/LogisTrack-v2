import { MissionStatus } from '../types/mission';

export const ALLOWED_TRANSITIONS: Record<MissionStatus, MissionStatus[]> = {
  BROUILLON: ['CREEE', 'ANNULEE'],
  CREEE: ['AFFECTEE', 'ANNULEE'],
  AFFECTEE: ['ACCEPTEE', 'CREEE', 'ANNULEE'],
  ACCEPTEE: ['EN_COURS', 'SUSPENDUE', 'ANNULEE'],
  EN_COURS: ['TERMINEE', 'ECHOUEE', 'SUSPENDUE'],
  SUSPENDUE: ['EN_COURS', 'ECHOUEE', 'ANNULEE'],
  TERMINEE: ['VALIDEE'],
  ECHOUEE: ['EN_COURS', 'SUSPENDUE', 'VALIDEE'],
  ANNULEE: [], // Terminal state
  VALIDEE: []  // Terminal state
};

export function canTransitionMissionStatus(
  currentStatus: MissionStatus,
  targetStatus: MissionStatus
): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

export function getAllowedNextStatuses(currentStatus: MissionStatus): MissionStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus] || [];
}

export function getMissionStatusLabel(status: MissionStatus): string {
  switch (status) {
    case 'BROUILLON': return 'Brouillon';
    case 'CREEE': return 'Créée';
    case 'AFFECTEE': return 'Affectée';
    case 'ACCEPTEE': return 'Acceptée';
    case 'EN_COURS': return 'En Cours';
    case 'SUSPENDUE': return 'Suspendue';
    case 'TERMINEE': return 'Terminée';
    case 'ECHOUEE': return 'Échouée (NPAI)';
    case 'ANNULEE': return 'Annulée';
    case 'VALIDEE': return 'Validée (Certifiée)';
    default: return status;
  }
}

export function getMissionStatusBadgeStyle(status: MissionStatus): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  switch (status) {
    case 'VALIDEE':
      return { bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-800/60', icon: '🟢' };
    case 'TERMINEE':
      return { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-700/50', icon: '✅' };
    case 'EN_COURS':
      return { bg: 'bg-blue-950', text: 'text-blue-400', border: 'border-blue-800/60', icon: '⚡' };
    case 'ACCEPTEE':
      return { bg: 'bg-indigo-950', text: 'text-indigo-300', border: 'border-indigo-800/60', icon: '👍' };
    case 'AFFECTEE':
      return { bg: 'bg-indigo-950/60', text: 'text-indigo-400', border: 'border-indigo-700/40', icon: '👤' };
    case 'CREEE':
      return { bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-800', icon: '📝' };
    case 'SUSPENDUE':
      return { bg: 'bg-amber-950', text: 'text-amber-400', border: 'border-amber-800/60', icon: '⏸️' };
    case 'ECHOUEE':
      return { bg: 'bg-rose-950', text: 'text-rose-400', border: 'border-rose-800/60', icon: '🔴' };
    case 'ANNULEE':
      return { bg: 'bg-slate-900', text: 'text-slate-500', border: 'border-slate-800', icon: '🚫' };
    case 'BROUILLON':
    default:
      return { bg: 'bg-slate-950', text: 'text-slate-400', border: 'border-slate-800', icon: '⚪' };
  }
}
