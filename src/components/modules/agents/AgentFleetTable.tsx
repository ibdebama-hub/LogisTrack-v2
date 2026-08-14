'use client';

import React, { useState } from 'react';
import {
  Search,
  Phone,
  MapPin,
  BatteryCharging,
  Eye,
  UserPlus,
  Grid,
  List,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Bike,
  Car,
  Footprints,
  Layers,
  Wallet,
  Edit3,
  Building,
  ShieldCheck
} from 'lucide-react';
import { FleetAgentFull, AgentStatus } from '../../../types/agentFleet';

interface AgentFleetTableProps {
  agents: FleetAgentFull[];
  onSelectAgent: (agent: FleetAgentFull) => void;
  onEditAgent: (agent: FleetAgentFull) => void;
  onOpenCreateModal: () => void;
}

export default function AgentFleetTable({
  agents,
  onSelectAgent,
  onEditAgent,
  onOpenCreateModal
}: AgentFleetTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter logic
  const filteredAgents = agents.filter(agent => {
    const matchesSearch =
      agent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm) ||
      agent.primary_zone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.primary_zone_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.vehicle.license_plate && agent.vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'EN_TOURNÉE') matchesStatus = agent.status === 'EN_TOURNÉE';
    if (statusFilter === 'EN_PAUSE') matchesStatus = agent.status === 'EN_PAUSE';
    if (statusFilter === 'DISPONIBLE') matchesStatus = agent.status === 'DISPONIBLE';
    if (statusFilter === 'HORS_LIGNE') matchesStatus = agent.status === 'HORS_LIGNE';
    if (statusFilter === 'CRITICAL_SIGNAL') matchesStatus = !!agent.telemetry.is_signal_critical || agent.status === 'HORS_LIGNE';

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AgentStatus, isCritical?: boolean) => {
    if (isCritical) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
          <AlertTriangle className="w-3 h-3" /> SIGNAL PERDU (&gt;45m)
        </span>
      );
    }

    switch (status) {
      case 'EN_TOURNÉE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> EN TOURNÉE
          </span>
        );
      case 'EN_PAUSE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            EN PAUSE
          </span>
        );
      case 'DISPONIBLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            DISPONIBLE
          </span>
        );
      case 'HORS_LIGNE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            HORS LIGNE
          </span>
        );
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'MOTO':
        return <Bike className="w-3.5 h-3.5 text-indigo-400" />;
      case 'TRICYCLE':
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      case 'VOITURE':
        return <Car className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Footprints className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      maximumFractionDigits: 0
    }).format(amount).replace('GNF', 'GNF');
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
              placeholder="Rechercher agent, téléphone, zone, véhicule..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'Tous' },
              { id: 'EN_TOURNÉE', label: 'En Tournée' },
              { id: 'EN_PAUSE', label: 'En Pause' },
              { id: 'DISPONIBLE', label: 'Disponibles' },
              { id: 'HORS_LIGNE', label: 'Hors-Ligne' },
              { id: 'CRITICAL_SIGNAL', label: '⚠️ Alerte Signal' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === f.id
                    ? f.id === 'CRITICAL_SIGNAL'
                      ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                      : 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
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
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Tableau"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Grille / Cartes"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Ajouter un Agent</span>
          </button>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Agent / Rôle</th>
                <th className="p-3.5">Statut Live</th>
                <th className="p-3.5">Zones & Quartiers</th>
                <th className="p-3.5">Clients & Plafond COD</th>
                <th className="p-3.5">Progression Tournée</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                    Aucun livreur ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredAgents.map(agent => {
                  const progressPct = agent.workload.total_assigned > 0
                    ? Math.round((agent.workload.delivered / agent.workload.total_assigned) * 100)
                    : 0;

                  const allowedClientsSummary = (agent.allowed_client_names && agent.allowed_client_names.length > 0)
                    ? agent.allowed_client_names.join(', ')
                    : 'Tous (Polyvalent)';

                  return (
                    <tr
                      key={agent.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        agent.telemetry.is_signal_critical ? 'bg-rose-950/20 hover:bg-rose-900/30' : ''
                      }`}
                    >
                      {/* AGENT / ROLE */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-xs shrink-0">
                            {agent.full_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{agent.full_name}</span>
                              {agent.role === 'team_leader' && (
                                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-semibold border border-indigo-500/30">
                                  Chef d'équipe
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span>{agent.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* STATUT LIVE */}
                      <td className="p-3.5">
                        {getStatusBadge(agent.status, agent.telemetry.is_signal_critical)}
                      </td>

                      {/* ZONES & QUARTIERS */}
                      <td className="p-3.5 max-w-[200px]">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-200 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">{agent.primary_zone_name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            Quartiers: {(agent.assigned_district_names || agent.district_names).slice(0, 3).join(', ')}...
                          </div>
                        </div>
                      </td>

                      {/* CLIENTS & PLAFOND COD */}
                      <td className="p-3.5 max-w-[180px]">
                        <div className="space-y-1">
                          <div className="text-[11px] font-semibold text-indigo-300 truncate" title={allowedClientsSummary}>
                            🏢 {allowedClientsSummary}
                          </div>
                          <div className="text-[10px] font-mono text-amber-400">
                            Plafond COD: {formatCurrency(agent.max_cod_cash_ceiling || 1000000)}
                          </div>
                        </div>
                      </td>

                      {/* PROGRESSION TOURNÉE */}
                      <td className="p-3.5 min-w-[150px]">
                        <div>
                          <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                            <span className="text-white font-bold">{agent.workload.delivered}/{agent.workload.total_assigned}</span>
                            <span className="text-emerald-400 font-semibold">{progressPct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditAgent(agent)}
                            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-indigo-600 rounded-xl transition-all"
                            title="Éditer l'agent"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onSelectAgent(agent)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-[11px] border border-indigo-500/30 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Fiche</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map(agent => (
            <div
              key={agent.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{agent.full_name}</h4>
                  <span className="text-xs text-slate-400 block font-mono">{agent.phone}</span>
                </div>
                {getStatusBadge(agent.status, agent.telemetry.is_signal_critical)}
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-300 font-semibold">{agent.primary_zone_name}</div>
                <div className="text-slate-400 text-[11px]">Clients: {(agent.allowed_client_names || ['Tous']).join(', ')}</div>
                <div className="text-amber-400 font-mono text-[11px]">Plafond COD: {formatCurrency(agent.max_cod_cash_ceiling || 1000000)}</div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onEditAgent(agent)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Éditer
                </button>

                <button
                  onClick={() => onSelectAgent(agent)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Fiche Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
