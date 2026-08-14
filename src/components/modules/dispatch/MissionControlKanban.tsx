'use client';

import React from 'react';
import {
  Layers,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Users,
  MapPin,
  Building2,
  Zap,
  MoreVertical,
  Plus,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { DispatchLot, LotStatus, LotPriority } from '../../../types/missionControl';

interface MissionControlKanbanProps {
  lots: DispatchLot[];
  onMoveLotStatus: (lotId: string, newStatus: LotStatus) => void;
  onOpenAssignModal: (lot: DispatchLot) => void;
  onInspectLot: (lot: DispatchLot) => void;
}

interface KanbanColumnDef {
  id: LotStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

const KANBAN_COLUMNS: KanbanColumnDef[] = [
  { id: 'A_PREPARER', label: 'À préparer', badgeBg: 'bg-slate-800', badgeText: 'text-slate-300', borderColor: 'border-slate-800' },
  { id: 'A_AFFECTER', label: 'À affecter', badgeBg: 'bg-amber-950/80', badgeText: 'text-amber-400', borderColor: 'border-amber-500/30' },
  { id: 'AFFECTE', label: 'Affectées', badgeBg: 'bg-indigo-950/80', badgeText: 'text-indigo-400', borderColor: 'border-indigo-500/30' },
  { id: 'EN_COURS', label: 'En cours', badgeBg: 'bg-blue-950/80', badgeText: 'text-blue-400', borderColor: 'border-blue-500/30' },
  { id: 'TERMINE', label: 'Terminées', badgeBg: 'bg-emerald-950/80', badgeText: 'text-emerald-400', borderColor: 'border-emerald-500/30' },
  { id: 'A_CONTROLER', label: 'À contrôler', badgeBg: 'bg-rose-950/80', badgeText: 'text-rose-400', borderColor: 'border-rose-500/30' },
];

export default function MissionControlKanban({
  lots,
  onMoveLotStatus,
  onOpenAssignModal,
  onInspectLot
}: MissionControlKanbanProps) {
  const getNextStatus = (current: LotStatus): LotStatus | null => {
    switch (current) {
      case 'A_PREPARER': return 'A_AFFECTER';
      case 'A_AFFECTER': return 'AFFECTE';
      case 'AFFECTE': return 'EN_COURS';
      case 'EN_COURS': return 'TERMINE';
      case 'TERMINE': return 'A_CONTROLER';
      case 'A_CONTROLER': return null;
      default: return null;
    }
  };

  const getPrevStatus = (current: LotStatus): LotStatus | null => {
    switch (current) {
      case 'A_CONTROLER': return 'TERMINE';
      case 'TERMINE': return 'EN_COURS';
      case 'EN_COURS': return 'AFFECTE';
      case 'AFFECTE': return 'A_AFFECTER';
      case 'A_AFFECTER': return 'A_PREPARER';
      case 'A_PREPARER': return null;
      default: return null;
    }
  };

  const getPriorityBadge = (p: LotPriority) => {
    switch (p) {
      case 'URGENTE':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-950 text-rose-400 rounded border border-rose-800/60 animate-pulse">🔴 URGENT</span>;
      case 'HAUTE':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-950 text-amber-400 rounded border border-amber-800/60">🟠 HAUTE</span>;
      case 'NORMALE':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-950 text-indigo-300 rounded border border-indigo-800/60">🔵 NORMALE</span>;
      case 'BASSE':
        return <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-900 text-slate-400 rounded border border-slate-800">⚪ BASSE</span>;
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-[1200px]">
        {KANBAN_COLUMNS.map((col) => {
          const colLots = lots.filter((l) => l.status === col.id);

          return (
            <div
              key={col.id}
              className={`bg-slate-950/80 rounded-2xl border ${col.borderColor} p-3 space-y-3 flex flex-col justify-between shadow-xl min-h-[550px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    col.id === 'EN_COURS' ? 'bg-blue-400 animate-ping' :
                    col.id === 'TERMINE' ? 'bg-emerald-400' :
                    col.id === 'A_AFFECTER' ? 'bg-amber-400' :
                    col.id === 'A_CONTROLER' ? 'bg-rose-400' : 'bg-slate-500'
                  }`} />
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {col.label}
                  </h3>
                </div>

                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${col.badgeBg} ${col.badgeText}`}>
                  {colLots.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colLots.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-900 rounded-xl flex items-center justify-center text-[11px] text-slate-600 font-mono">
                    Aucun lot
                  </div>
                ) : (
                  colLots.map((lot) => {
                    const nextSt = getNextStatus(lot.status);
                    const prevSt = getPrevStatus(lot.status);

                    return (
                      <div
                        key={lot.id}
                        className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-3.5 rounded-xl space-y-3 shadow-md hover:shadow-indigo-500/10 transition-all group"
                      >
                        {/* Top Lot Meta */}
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-mono text-[10px] font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                            {lot.lot_number}
                          </span>
                          {getPriorityBadge(lot.priority)}
                        </div>

                        {/* Lot Name & Client */}
                        <div>
                          <h4
                            onClick={() => onInspectLot(lot)}
                            className="text-xs font-bold text-white hover:text-indigo-300 cursor-pointer line-clamp-2"
                          >
                            {lot.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            {lot.client_name}
                          </span>
                        </div>

                        {/* Zone & Missions stats */}
                        <div className="bg-slate-950 p-2.5 rounded-lg space-y-1.5 border border-slate-800 text-[11px]">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1 font-semibold">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              {lot.zone_name}
                            </span>
                            <span className="font-mono font-bold text-emerald-400">
                              {lot.total_missions} missions
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Durée est: <strong>{lot.estimated_hours}h</strong></span>
                            {lot.total_cod_amount > 0 ? (
                              <span className="text-amber-400 font-bold">
                                {lot.total_cod_amount.toLocaleString()} FCFA
                              </span>
                            ) : (
                              <span>Sans COD</span>
                            )}
                          </div>
                        </div>

                        {/* Assigned Agent */}
                        <div className="flex items-center justify-between pt-1">
                          {lot.assigned_agents.length > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                                {lot.assigned_agents[0].avatar_initials || 'AG'}
                              </div>
                              <span className="text-[10px] font-semibold text-slate-200 truncate max-w-[100px]">
                                {lot.assigned_agents[0].name}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => onOpenAssignModal(lot)}
                              className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                            >
                              <UserCheck className="w-3 h-3" /> Affecter agent
                            </button>
                          )}

                          <button
                            onClick={() => onOpenAssignModal(lot)}
                            className="p-1 text-slate-400 hover:text-indigo-300 rounded hover:bg-slate-800"
                            title="Gérer affectation / réaffectation"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Status Transition Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px]">
                          {prevSt ? (
                            <button
                              onClick={() => onMoveLotStatus(lot.id, prevSt)}
                              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 flex items-center gap-1"
                              title="Reculer d'un statut"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          ) : <div />}

                          {nextSt && (
                            <button
                              onClick={() => onMoveLotStatus(lot.id, nextSt)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded flex items-center gap-1 shadow"
                              title="Avancer au statut suivant"
                            >
                              <span>Avancer</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
