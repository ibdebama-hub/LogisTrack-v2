'use client';

import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Users,
  Clock,
  Zap,
  ArrowRightLeft,
  UserMinus,
  Split,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DispatchLot } from '../../../types/missionControl';

interface AgentOption {
  id: string;
  name: string;
  phone: string;
  zoneCode: string;
  activeWorkload: number;
}

const AVAILABLE_AGENTS: AgentOption[] = [
  { id: 'a1', name: 'Kouassi Jean-Marc', phone: '+225 07 08 12 34 56', zoneCode: 'ABJ-COC-RIV', activeWorkload: 450 },
  { id: 'a2', name: 'Diallo Mamadou', phone: '+225 05 04 99 88 77', zoneCode: 'ABJ-MAR-Z4', activeWorkload: 350 },
  { id: 'a3', name: 'Traoré Bakary', phone: '+223 70 12 34 56', zoneCode: 'BMK-COU-01', activeWorkload: 280 },
  { id: 'a4', name: 'Ndiaye Cheikh', phone: '+221 77 654 32 10', zoneCode: 'DKR-PLT-SAN', activeWorkload: 120 },
  { id: 'a5', name: 'Koffi Marie-Noëlle', phone: '+225 01 02 03 04 05', zoneCode: 'ABJ-YOP-SEL', activeWorkload: 0 }
];

interface BatchAssignmentModalProps {
  lot: DispatchLot | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAssignment: (
    lotId: string,
    action: 'ASSIGN' | 'UNASSIGN' | 'TRANSFER' | 'SPLIT',
    agentIds: string[],
    auditNote: string
  ) => void;
}

export default function BatchAssignmentModal({
  lot,
  isOpen,
  onClose,
  onConfirmAssignment
}: BatchAssignmentModalProps) {
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(
    lot?.assigned_agents.map((a) => a.id) || []
  );
  const [assignmentMode, setAssignmentMode] = useState<'ASSIGN' | 'TRANSFER' | 'SPLIT'>('ASSIGN');

  if (!isOpen || !lot) return null;

  const toggleAgentSelection = (agentId: string) => {
    if (selectedAgentIds.includes(agentId)) {
      setSelectedAgentIds(selectedAgentIds.filter((id) => id !== agentId));
    } else {
      setSelectedAgentIds([...selectedAgentIds, agentId]);
    }
  };

  // Immediate calculations
  const totalAgentsCount = Math.max(1, selectedAgentIds.length);
  const missionsPerAgent = Math.ceil(lot.total_missions / totalAgentsCount);
  const estimatedHoursTotal = (lot.total_missions * 0.01).toFixed(1);
  const estimatedHoursPerAgent = (Number(estimatedHoursTotal) / totalAgentsCount).toFixed(1);

  const handleApply = (action: 'ASSIGN' | 'UNASSIGN' | 'TRANSFER' | 'SPLIT') => {
    if (action !== 'UNASSIGN' && selectedAgentIds.length === 0) {
      alert('Veuillez sélectionner au moins un agent.');
      return;
    }

    const agentNames = selectedAgentIds
      .map((id) => AVAILABLE_AGENTS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const note =
      action === 'UNASSIGN'
        ? `Retrait de l'affectation du lot ${lot.lot_number}`
        : action === 'SPLIT'
        ? `Répartition du lot ${lot.lot_number} entre ${selectedAgentIds.length} agents (${agentNames})`
        : `Affectation/Transfert du lot ${lot.lot_number} à ${agentNames}`;

    onConfirmAssignment(lot.id, action, selectedAgentIds, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Affectation & Réaffectation du Lot
              </h2>
              <span className="font-mono text-xs text-indigo-400 font-semibold">
                {lot.lot_number} • {lot.zone_name} ({lot.total_missions} missions)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Calculation Stats Banner */}
        <div className="px-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Missions / Agent</span>
            <strong className="text-lg font-bold text-emerald-400 font-mono">
              {missionsPerAgent} missions
            </strong>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Charge Estimée</span>
            <strong className="text-lg font-bold text-indigo-300 font-mono">
              {selectedAgentIds.length} Agent(s)
            </strong>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Durée Estimée</span>
            <strong className="text-lg font-bold text-amber-400 font-mono">
              ~{estimatedHoursPerAgent}h / agent
            </strong>
          </div>
        </div>

        {/* Action Modes Tabs */}
        <div className="px-6">
          <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 grid grid-cols-3 gap-2 text-xs font-bold text-center">
            <button
              onClick={() => setAssignmentMode('ASSIGN')}
              className={`py-2 rounded-xl transition-all ${
                assignmentMode === 'ASSIGN'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Affecter / Remplacer
            </button>
            <button
              onClick={() => setAssignmentMode('SPLIT')}
              className={`py-2 rounded-xl transition-all ${
                assignmentMode === 'SPLIT'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Répartir (Multi-Agents)
            </button>
            <button
              onClick={() => handleApply('UNASSIGN')}
              className="py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-all flex items-center justify-center gap-1"
            >
              <UserMinus className="w-3.5 h-3.5" /> Retirer Lot
            </button>
          </div>
        </div>

        {/* Agent Selection List */}
        <div className="px-6 space-y-2 max-h-60 overflow-y-auto">
          <label className="text-xs text-slate-400 font-semibold block">
            Sélectionner les agents de terrain disponibles :
          </label>

          <div className="space-y-2">
            {AVAILABLE_AGENTS.map((agent) => {
              const isSelected = selectedAgentIds.includes(agent.id);

              return (
                <div
                  key={agent.id}
                  onClick={() => toggleAgentSelection(agent.id)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {agent.phone} • Zone: {agent.zoneCode}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-400 block text-[10px]">Charge courante</span>
                    <strong className="text-indigo-300 font-mono">
                      {agent.activeWorkload} items
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800"
          >
            Annuler
          </button>

          <button
            onClick={() => handleApply(assignmentMode)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
          >
            <UserCheck className="w-4 h-4" />
            <span>Valider l'Affectation ({selectedAgentIds.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
