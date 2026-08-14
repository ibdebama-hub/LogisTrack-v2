'use client';

import React, { useState } from 'react';
import {
  Search,
  Layers,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Download,
  Eye,
  Plus,
  Grid,
  List,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CampaignItem, CampaignStatus } from '../../../types/campaigns';

interface CampaignsListTableProps {
  campaigns: CampaignItem[];
  onSelectCampaign: (campaign: CampaignItem) => void;
  onTogglePauseCampaign: (id: string) => void;
  onCloseCampaign: (id: string) => void;
  onOpenCreateModal: () => void;
}

export default function CampaignsListTable({
  campaigns,
  onSelectCampaign,
  onTogglePauseCampaign,
  onCloseCampaign,
  onOpenCreateModal
}: CampaignsListTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client_name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      matchesStatus = c.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CampaignStatus, isUrgent?: boolean) => {
    if (isUrgent) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
          ⚡ URGENCE CONTRACTUELLE
        </span>
      );
    }

    switch (status) {
      case 'EN_COURS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> EN COURS
          </span>
        );
      case 'PLANIFIÉE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            PLANIFIÉE
          </span>
        );
      case 'EN_PAUSE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            EN PAUSE
          </span>
        );
      case 'CLÔTURÉE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            CLÔTURÉE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800">
            ARCHIVÉE
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* CONTROL BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom de campagne, référence ou client..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'Toutes' },
              { id: 'EN_COURS', label: 'En Cours' },
              { id: 'PLANIFIÉE', label: 'Planifiées' },
              { id: 'EN_PAUSE', label: 'En Pause' },
              { id: 'CLÔTURÉE', label: 'Clôturées' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === f.id
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              title="Vue Tableau"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              title="Vue Cartes"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouvelle Campagne</span>
          </button>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Campagne / Client</th>
                <th className="p-3.5">Type & Réf</th>
                <th className="p-3.5">Statut</th>
                <th className="p-3.5">Progression Distribution</th>
                <th className="p-3.5">Échéance</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                    Aucune campagne ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map(c => {
                  const pct = Math.round((c.delivered_items / c.total_items) * 100);
                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* CAMPAGNE / CLIENT */}
                      <td className="p-3.5">
                        <div>
                          <span className="font-bold text-white text-xs block">{c.name}</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{c.client_name}</span>
                        </div>
                      </td>

                      {/* TYPE & REF */}
                      <td className="p-3.5 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 font-bold border border-slate-800 block w-fit">
                          {c.reference}
                        </span>
                        <span className="text-slate-400 block mt-1 text-[10px]">{c.operation_type}</span>
                      </td>

                      {/* STATUT */}
                      <td className="p-3.5">
                        {getStatusBadge(c.status, c.is_urgent)}
                      </td>

                      {/* PROGRESSION */}
                      <td className="p-3.5 min-w-[180px]">
                        <div>
                          <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                            <span className="text-white font-bold">{c.delivered_items.toLocaleString('fr-FR')} / {c.total_items.toLocaleString('fr-FR')}</span>
                            <span className="text-emerald-400 font-bold">{pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                            <div style={{ width: `${(c.delivered_items / c.total_items) * 100}%` }} className="bg-emerald-500 h-full" />
                            <div style={{ width: `${(c.failed_items / c.total_items) * 100}%` }} className="bg-rose-500 h-full" />
                            <div style={{ width: `${(c.in_progress_items / c.total_items) * 100}%` }} className="bg-amber-500 h-full" />
                          </div>
                        </div>
                      </td>

                      {/* ÉCHÉANCE */}
                      <td className="p-3.5 font-mono text-[11px] text-slate-300">
                        {c.due_date}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onTogglePauseCampaign(c.id)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 bg-slate-800 rounded-lg"
                            title={c.status === 'EN_PAUSE' ? 'Reprendre' : 'Mettre en Pause'}
                          >
                            {c.status === 'EN_PAUSE' ? <PlayCircle className="w-4 h-4 text-emerald-400" /> : <PauseCircle className="w-4 h-4 text-amber-400" />}
                          </button>

                          <button
                            onClick={() => onSelectCampaign(c)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-[11px] border border-indigo-500/30 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Détails</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCampaigns.map(c => (
            <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-indigo-400 text-xs">{c.reference}</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">{c.name}</h4>
                  <span className="text-xs text-slate-400">{c.client_name}</span>
                </div>
                {getStatusBadge(c.status, c.is_urgent)}
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Total Items:</span>
                  <span className="text-white font-bold">{c.total_items.toLocaleString('fr-FR')}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Échéance:</span>
                  <span className="text-amber-400">{c.due_date}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => onSelectCampaign(c)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Voir Statistiques
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
