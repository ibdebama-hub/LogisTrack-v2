'use client';

import React from 'react';
import {
  Search,
  PlusCircle,
  Bell,
  SlidersHorizontal,
  Activity,
  Zap,
  RefreshCw,
  Layers,
  Sparkles
} from 'lucide-react';

interface MissionControlHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadNotifsCount: number;
  onToggleNotifications: () => void;
  onOpenCreateCampaign: () => void;
  onToggleFilters: () => void;
  isFiltersVisible: boolean;
  onRefreshData: () => void;
}

export default function MissionControlHeader({
  searchQuery,
  onSearchChange,
  unreadNotifsCount,
  onToggleNotifications,
  onOpenCreateCampaign,
  onToggleFilters,
  isFiltersVisible,
  onRefreshData
}: MissionControlHeaderProps) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Status Branding */}
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-2xl text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                Centre de Commandement des Opérations
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE CONTROL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilotage haute performance des campagnes, lotissement dynamique et dispatching des agents en temps réel
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefreshData}
            className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all"
            title="Rafraîchir les données"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Toggle Filter Bar */}
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              isFiltersVisible
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>Filtres Avancés</span>
          </button>

          {/* Notifications Trigger Bell */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all"
            title="Centre de notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center border-2 border-slate-950 animate-bounce">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* New Campaign Button */}
          <button
            onClick={onOpenCreateCampaign}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouvelle Campagne</span>
          </button>
        </div>
      </div>

      {/* Global Intelligent Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-3.5 text-indigo-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Recherche intelligente par n° de campagne, client, agent, zone, n° de mission, facture ou adresse..."
          className="w-full pl-11 pr-4 py-3 bg-slate-950/90 border border-slate-800 focus:border-indigo-500 rounded-2xl text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-3 text-xs font-mono text-slate-500 hover:text-slate-300"
          >
            Effacer [ESC]
          </button>
        )}
      </div>
    </div>
  );
}
