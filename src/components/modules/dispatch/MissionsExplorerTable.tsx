'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Building2,
  SlidersHorizontal,
  Play
} from 'lucide-react';
import { useMissions } from '@/hooks/useMissions';
import { Mission, MissionStatus } from '@/types/mission';
import { getMissionStatusBadgeStyle, getMissionStatusLabel } from '@/lib/missionWorkflow';
import MissionDetailDrawer from './MissionDetailDrawer';

export default function MissionsExplorerTable() {
  const {
    missions,
    totalCount,
    kpis,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedClient,
    setSelectedClient,
    refreshMissions,
    updateStatus
  } = useMissions('tenant-101');

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  return (
    <div className="space-y-6">
      {/* 1. REAL-TIME MISSIONS KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Missions</span>
          <div className="text-xl font-extrabold text-white font-mono">{kpis.total.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Base PostgreSQL</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-blue-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Missions Actives</span>
          <div className="text-xl font-extrabold text-blue-300 font-mono">{kpis.active.toLocaleString()}</div>
          <span className="text-[10px] text-blue-500">En cours / Affectées</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Terminées</span>
          <div className="text-xl font-extrabold text-emerald-300 font-mono">{kpis.completed.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-500">Certifiées / PoD</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-amber-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Retards SLA</span>
          <div className="text-xl font-extrabold text-amber-300 font-mono">{kpis.delayed.toLocaleString()}</div>
          <span className="text-[10px] text-amber-500">Hors délais</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-rose-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Échouées (NPAI)</span>
          <div className="text-xl font-extrabold text-rose-300 font-mono">{kpis.failed.toLocaleString()}</div>
          <span className="text-[10px] text-rose-500">Refus / Injoignable</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-amber-950 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Suspendues</span>
          <div className="text-xl font-extrabold text-amber-400 font-mono">{kpis.suspended.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">En arbitrage</span>
        </div>
      </div>

      {/* 2. SEARCH & COMBINABLE FILTERS BAR */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher n° mission, client, destinataire, agent, adresse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium"
          >
            <option value="ALL">Tous les Statuts</option>
            <option value="BROUILLON">Brouillon</option>
            <option value="CREEE">Créée</option>
            <option value="AFFECTEE">Affectée</option>
            <option value="EN_COURS">En Cours</option>
            <option value="TERMINEE">Terminée</option>
            <option value="ECHOUEE">Échouée</option>
            <option value="VALIDEE">Validée</option>
          </select>

          <button
            onClick={refreshMissions}
            className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all"
            title="Rafraîchir les données"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. MISSIONS TABLE */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Mission</th>
                <th className="py-3.5 px-4">Client B2B</th>
                <th className="py-3.5 px-4">Destinataire & Adresse</th>
                <th className="py-3.5 px-4">Objet / Type</th>
                <th className="py-3.5 px-4">Agent Affecté</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {missions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    Aucune mission trouvée pour ces critères.
                  </td>
                </tr>
              ) : (
                missions.map((m) => {
                  const style = getMissionStatusBadgeStyle(m.status);
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMission(m)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-all group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                        {m.mission_number}
                        <span className="block text-[10px] text-slate-500 font-sans">{m.created_at}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{m.client_name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{m.campaign_reference}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">{m.recipient_name}</span>
                        <span className="text-slate-400 block text-[11px] truncate max-w-xs">{m.address_raw}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold uppercase text-slate-300 block">{m.item_type}</span>
                        {m.cod_amount > 0 ? (
                          <span className="text-amber-400 font-mono font-bold text-[10px]">
                            COD : {m.cod_amount.toLocaleString()} F
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Standard</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200 block">
                          {m.assigned_agent_name || 'Non attribué'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] border ${style.bg} ${style.text} ${style.border}`}
                        >
                          <span>{style.icon}</span>
                          <span>{getMissionStatusLabel(m.status)}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedMission(m)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-300 font-bold text-xs flex items-center gap-1 ml-auto transition-all"
                        >
                          <span>Détails</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MISSION DETAIL DRAWER */}
      <MissionDetailDrawer
        mission={selectedMission}
        isOpen={!!selectedMission}
        onClose={() => setSelectedMission(null)}
        onMissionUpdated={refreshMissions}
      />
    </div>
  );
}
