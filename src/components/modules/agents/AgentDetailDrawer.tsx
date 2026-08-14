'use client';

import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Battery,
  BatteryCharging,
  Wifi,
  WifiOff,
  Navigation,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Wallet,
  Calendar,
  Layers,
  Bike,
  Activity,
  AlertTriangle,
  Award,
  FileCheck,
  Map
} from 'lucide-react';
import { FleetAgentFull } from '../../../types/agentFleet';

interface AgentDetailDrawerProps {
  agent: FleetAgentFull | null;
  onClose: () => void;
}

export default function AgentDetailDrawer({
  agent,
  onClose
}: AgentDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'performance' | 'route'>('telemetry');

  if (!agent) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      maximumFractionDigits: 0
    }).format(amount).replace('GNF', 'GNF');
  };

  const progressPct = agent.workload.total_assigned > 0
    ? Math.round((agent.workload.delivered / agent.workload.total_assigned) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* DRAWER HEADER */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
                {agent.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">{agent.full_name}</h2>
                  {agent.role === 'team_leader' && (
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                      Chef d'équipe
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> {agent.phone}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" /> {agent.primary_zone_name}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950 px-6 font-semibold text-xs gap-6">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'telemetry'
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Équipements & Télémétrie</span>
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'performance'
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Performances & Caisse</span>
            </button>

            <button
              onClick={() => setActiveTab('route')}
              className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'route'
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Tracé GPS & Feuille de Route</span>
            </button>
          </div>

          {/* TAB CONTENT SCROLLABLE */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: ÉQUIPEMENTS & TÉLÉMÉTRIE */}
            {activeTab === 'telemetry' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Critical Alert Warning */}
                {agent.telemetry.is_signal_critical && (
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-400 uppercase">Alerte Perte de Signal Prolongée</h4>
                      <p className="text-xs text-rose-200/90 mt-0.5">
                        Aucun heartbeat reçu depuis <strong>{agent.telemetry.last_ping_at}</strong>. L'agent possède actuellement <strong>{agent.workload.remaining} plis en main</strong> et <strong>{formatCurrency(agent.cod.pending_discharge)} d'encaissements COD</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Telemetry Live Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Batterie Appareil PWA</span>
                    <div className="flex items-center gap-2">
                      <BatteryCharging className={`w-5 h-5 ${
                        agent.telemetry.battery_level < 15 ? 'text-rose-400' : 'text-emerald-400'
                      }`} />
                      <span className="text-xl font-black text-white">{agent.telemetry.battery_level}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">Charge saine sur terminal</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Signal GPS & Réseau</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-5 h-5 text-indigo-400" />
                      <span className="text-sm font-bold text-white">{agent.telemetry.gps_status} ({agent.telemetry.network_mode})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">Ping: {agent.telemetry.last_ping_at}</span>
                  </div>
                </div>

                {/* Technical Equipment Card */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Véhicule & Matériel Assigné
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Type de déplacement</span>
                      <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <Bike className="w-4 h-4 text-indigo-400" /> {agent.vehicle.type}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Immatriculation / ID</span>
                      <span className="font-mono font-bold text-amber-400 mt-0.5 block">
                        {agent.vehicle.license_plate || 'Non requis'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Code Équipement</span>
                      <span className="font-mono text-slate-300 mt-0.5 block">{agent.vehicle.equipment_id}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Version PWA Agent</span>
                      <span className="font-mono text-indigo-400 mt-0.5 block">{agent.telemetry.pwa_version}</span>
                    </div>
                  </div>
                </div>

                {/* Coordinates & Zone Coverage */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Position GPS & Quartiers Couverts
                  </h4>
                  <div className="text-xs text-slate-400 flex items-center justify-between font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span>Coordonnées GPS:</span>
                    <span className="text-indigo-300 font-bold">{agent.telemetry.gps_lat.toFixed(4)}, {agent.telemetry.gps_lng.toFixed(4)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {agent.district_names.map(d => (
                      <span key={d} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-medium border border-slate-800">
                        📍 {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PERFORMANCES & CAISSE */}
            {activeTab === 'performance' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* COD Cash Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-950 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      Solde Caisse COD Terrain
                    </span>
                    <Wallet className="w-5 h-5 text-amber-400" />
                  </div>

                  <div className="text-3xl font-black text-white font-mono">
                    {formatCurrency(agent.cod.pending_discharge)}
                  </div>

                  <p className="text-xs text-slate-400">
                    Montant total d'encaissements en espèce perçus sur le terrain en attente de versement au guichet décharge.
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Taux de Réussite</span>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{agent.performance.success_rate}%</div>
                    <span className="text-[10px] text-slate-400">Sur 30 derniers jours</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Temps Moyen / Remise</span>
                    <div className="text-2xl font-black text-indigo-400 font-mono">{agent.performance.avg_time_per_delivery}</div>
                    <span className="text-[10px] text-slate-400">Entre arrivée & PoD</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Taux NPAI / Anomalies</span>
                    <div className="text-2xl font-black text-amber-400 font-mono">{agent.performance.npai_rate}%</div>
                    <span className="text-[10px] text-slate-400">Injoignable / Déplacé</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Réconciliation Caisse</span>
                    <div className="text-xs font-bold text-white mt-1">{agent.performance.reconciliation_score}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Sans écart de caisse</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TRACÉ GPS & FEUILLE DE ROUTE */}
            {activeTab === 'route' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Feuille de Route du jour</span>
                  <span className="font-mono text-emerald-400 font-bold">{progressPct}% complété</span>
                </div>

                {/* Timeline */}
                <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                  {agent.route_history.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      Aucun tracé enregistré pour cette tournée.
                    </div>
                  ) : (
                    agent.route_history.map((pt, idx) => (
                      <div key={pt.id} className="relative pl-9 space-y-1">
                        {/* Status Icon Marker */}
                        <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          pt.status === 'start'
                            ? 'bg-slate-900 border-indigo-500 text-indigo-400'
                            : pt.status === 'delivered'
                            ? 'bg-slate-900 border-emerald-500 text-emerald-400'
                            : 'bg-slate-900 border-amber-500 text-amber-400 animate-pulse'
                        }`}>
                          {idx + 1}
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-white">{pt.timestamp}</span>
                          {pt.pod_type && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              PoD: {pt.pod_type}
                            </span>
                          )}
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                          <div className="font-bold text-slate-200">{pt.location_name}</div>
                          {pt.recipient_name && (
                            <div className="text-[11px] text-slate-400">Destinataire: {pt.recipient_name} ({pt.item_tracking})</div>
                          )}
                          {pt.cod_amount !== undefined && pt.cod_amount > 0 && (
                            <div className="text-xs font-mono text-amber-400 font-bold">
                              Collecté: {formatCurrency(pt.cod_amount)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DRAWER FOOTER ACTIONS */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <a
              href={`tel:${agent.phone}`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Appeler Agent</span>
            </a>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Fermer Fiche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
