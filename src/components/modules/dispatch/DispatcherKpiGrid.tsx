'use client';

import React from 'react';
import {
  Layers,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Radio,
  Zap,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { MissionControlKpis } from '@/types/missionControl';

interface DispatcherKpiGridProps {
  kpis: MissionControlKpis;
  activeKpiFilter: string | null;
  onSelectKpiFilter: (filterKey: string | null) => void;
}

export default function DispatcherKpiGrid({
  kpis,
  activeKpiFilter,
  onSelectKpiFilter
}: DispatcherKpiGridProps) {
  const toggleFilter = (key: string) => {
    if (activeKpiFilter === key) {
      onSelectKpiFilter(null);
    } else {
      onSelectKpiFilter(key);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1 : CAMPAGNES */}
      <div
        onClick={() => toggleFilter('campaigns')}
        className={`group cursor-pointer p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
          activeKpiFilter === 'campaigns'
            ? 'bg-indigo-950/80 border-indigo-500 shadow-xl shadow-indigo-600/20 ring-2 ring-indigo-500/50'
            : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Campagnes Globales
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white font-mono">{kpis.campaigns.total}</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
            {kpis.campaigns.active} Actives
          </span>
        </div>

        {/* Sub-breakdown badges */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">Actives</span>
            <strong className="text-emerald-400 font-bold">{kpis.campaigns.active}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Terminées</span>
            <strong className="text-slate-300 font-bold">{kpis.campaigns.completed}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Planifiées</span>
            <strong className="text-indigo-300 font-bold">{kpis.campaigns.planned}</strong>
          </div>
        </div>
      </div>

      {/* KPI 2 : MISSIONS */}
      <div
        onClick={() => toggleFilter('delayed')}
        className={`group cursor-pointer p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
          activeKpiFilter === 'delayed'
            ? 'bg-rose-950/80 border-rose-500 shadow-xl shadow-rose-600/20 ring-2 ring-rose-500/50'
            : 'bg-slate-900/60 border-slate-800 hover:border-rose-500/40 hover:bg-slate-900/90'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Missions Total
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 transition-colors" />
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white font-mono">{kpis.missions.total.toLocaleString()}</span>
          {kpis.missions.delayed > 0 && (
            <span className="text-xs font-bold text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-800/40 animate-pulse">
              ⚠️ {kpis.missions.delayed} En Retard
            </span>
          )}
        </div>

        {/* Sub-breakdown badges */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-[10px]">
          <div>
            <span className="text-slate-500 block text-[9px]">Affectées</span>
            <strong className="text-indigo-300">{kpis.missions.assigned.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">En Cours</span>
            <strong className="text-amber-400">{kpis.missions.in_progress.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">Livrées</span>
            <strong className="text-emerald-400">{kpis.missions.completed.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">Retard</span>
            <strong className="text-rose-400">{kpis.missions.delayed}</strong>
          </div>
        </div>
      </div>

      {/* KPI 3 : AGENTS */}
      <div
        onClick={() => toggleFilter('agents')}
        className={`group cursor-pointer p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
          activeKpiFilter === 'agents'
            ? 'bg-emerald-950/80 border-emerald-500 shadow-xl shadow-emerald-600/20 ring-2 ring-emerald-500/50'
            : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/90'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Flotte d'Agents
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white font-mono">{kpis.agents.total}</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800/40 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
            {kpis.agents.online} Connectés
          </span>
        </div>

        {/* Sub-breakdown badges */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">Disponibles</span>
            <strong className="text-emerald-400 font-bold">{kpis.agents.available}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">En Mission</span>
            <strong className="text-indigo-300 font-bold">{kpis.agents.on_mission}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Hors Ligne</span>
            <strong className="text-rose-400 font-bold">{kpis.agents.offline}</strong>
          </div>
        </div>
      </div>

      {/* KPI 4 : PERFORMANCES */}
      <div
        onClick={() => toggleFilter('performance')}
        className={`group cursor-pointer p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
          activeKpiFilter === 'performance'
            ? 'bg-amber-950/80 border-amber-500 shadow-xl shadow-amber-600/20 ring-2 ring-amber-500/50'
            : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/90'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Performance Global
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-black text-emerald-400 font-mono">
            {kpis.performance.global_completion_rate}%
          </span>
          <span className="text-xs font-bold text-slate-300 font-mono">
            ⏱️ {kpis.performance.avg_delivery_time_min} min/pli
          </span>
        </div>

        {/* Sub-breakdown badges */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">Taux Réussite</span>
            <strong className="text-emerald-400 font-bold">{kpis.performance.success_rate}%</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Incidents Signalés</span>
            <strong className="text-rose-400 font-bold">{kpis.performance.incidents_count}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
