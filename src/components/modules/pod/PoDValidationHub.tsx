'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  FileCheck,
  Building,
  MapPin,
  Navigation,
  Phone,
  Layers,
  RotateCcw,
  ShieldCheck,
  FileText,
  BadgeCheck,
  Grid,
  List
} from 'lucide-react';
import { PoDItem, PoDVerificationStatus } from '@/types/podValidation';

interface PoDValidationHubProps {
  items: PoDItem[];
  onInspectItem: (item: PoDItem) => void;
  onResolveAnomaly: (item: PoDItem) => void;
  onQuickApprove: (itemId: string) => void;
}

export default function PoDValidationHub({
  items,
  onInspectItem,
  onResolveAnomaly,
  onQuickApprove
}: PoDValidationHubProps) {
  const [activeTab, setActiveTab] = useState<'proofs' | 'anomalies'>('proofs');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [clientFilter, setClientFilter] = useState<string>('ALL');

  // Filter items
  const filteredItems = items.filter(item => {
    // Tab filtering
    if (activeTab === 'anomalies' && item.status !== 'ANOMALY') return false;

    // Search filter
    const matchesSearch =
      item.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient_address.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'PENDING') matchesStatus = item.status === 'PENDING';
    if (statusFilter === 'APPROVED') matchesStatus = item.status === 'APPROVED';
    if (statusFilter === 'REJECTED') matchesStatus = item.status === 'REJECTED';
    if (statusFilter === 'ANOMALY') matchesStatus = item.status === 'ANOMALY';

    // Client filter
    let matchesClient = true;
    if (clientFilter !== 'ALL') matchesClient = item.client_name === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  // KPI counters
  const totalCount = items.length;
  const pendingCount = items.filter(i => i.status === 'PENDING').length;
  const approvedCount = items.filter(i => i.status === 'APPROVED').length;
  const anomalyCount = items.filter(i => i.status === 'ANOMALY').length;

  const clientsList = Array.from(new Set(items.map(i => i.client_name)));

  const getStatusBadge = (status: PoDVerificationStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> À VÉRIFIER
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> VALIDÉ & CERTIFIÉ
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> REJETÉ
          </span>
        );
      case 'ANOMALY':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> ANOMALIE TERRAIN
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* TABS & MAIN HUB CONTROLS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
        {/* TOP TAB SWITCHER */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('proofs')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'proofs'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Galerie de Modération PoD</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500 text-slate-950 font-black">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('anomalies')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'anomalies'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Anomalies Terrain & Échecs</span>
              {anomalyCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-500 text-white font-black animate-pulse">
                  {anomalyCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Total Preuves: <strong className="text-white">{totalCount}</strong></span>
            <span className="text-emerald-400">Validées: <strong>{approvedCount}</strong></span>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher n° suivi, destinataire, agent, adresse..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Client Filter */}
            <select
              value={clientFilter}
              onChange={e => setClientFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Tous les Clients</option>
              {clientsList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter Pills (Only on proofs tab) */}
          {activeTab === 'proofs' && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'PENDING', label: 'À Vérifier' },
                { id: 'APPROVED', label: 'Validés' },
                { id: 'ANOMALY', label: 'Anomalies' }
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
          )}
        </div>

        {/* PROOFS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {filteredItems.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800">
              <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <span>Aucune preuve ou anomalie ne correspond aux filtres actifs.</span>
            </div>
          ) : (
            filteredItems.map(item => {
              const isGpsWarning = item.gps_distance_diff_meters > 100;

              return (
                <div
                  key={item.id}
                  className={`bg-slate-950 border rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700 transition-all ${
                    item.status === 'ANOMALY'
                      ? 'border-rose-500/50 bg-rose-950/10'
                      : item.status === 'PENDING'
                      ? 'border-amber-500/30'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Top card header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-white text-sm">{item.tracking_number}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {item.client_code}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">{item.recipient_name}</span>
                    </div>

                    {getStatusBadge(item.status)}
                  </div>

                  {/* PROOF VISUAL PREVIEW BOX */}
                  <div className="bg-slate-900 rounded-xl p-2 border border-slate-800 flex items-center justify-center min-h-[120px] relative overflow-hidden group">
                    {item.status === 'ANOMALY' && item.anomaly_photo_url ? (
                      <img
                        src={item.anomaly_photo_url}
                        alt="Anomalie terrain"
                        className="max-h-[110px] w-auto object-contain rounded"
                      />
                    ) : item.proof_image_url ? (
                      <img
                        src={item.proof_image_url}
                        alt="Preuve visuelle"
                        className="max-h-[110px] w-auto object-contain rounded"
                      />
                    ) : (
                      <div className="text-center p-3">
                        <BadgeCheck className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                        <span className="text-xs font-mono text-emerald-400 font-bold">OTP VERIFIÉ</span>
                      </div>
                    )}

                    {/* Overlay Inspect Button */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => item.status === 'ANOMALY' ? onResolveAnomaly(item) : onInspectItem(item)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspecter HD</span>
                      </button>
                    </div>
                  </div>

                  {/* METADATA SUMMARY */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Livreur:</span>
                      <span className="font-semibold text-slate-200">{item.agent_name}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Remise & Heure:</span>
                      <span className="font-mono text-[11px] text-indigo-300">{item.delivery_method} ({item.delivery_timestamp.split('à')[1] || item.delivery_timestamp})</span>
                    </div>

                    {/* GPS Delta Metric */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                      <span className="text-slate-500">Précision GPS:</span>
                      <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isGpsWarning
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        Δ {item.gps_distance_diff_meters}m
                      </span>
                    </div>
                  </div>

                  {/* CARD FOOTER ACTIONS */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    {item.status === 'ANOMALY' ? (
                      <button
                        onClick={() => onResolveAnomaly(item)}
                        className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Traiter l'Anomalie</span>
                      </button>
                    ) : item.status === 'PENDING' ? (
                      <div className="flex items-center justify-between w-full gap-2">
                        <button
                          onClick={() => onInspectItem(item)}
                          className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspecter
                        </button>
                        <button
                          onClick={() => onQuickApprove(item.id)}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valider
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full text-xs font-mono text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Certifiée
                        </span>
                        <button
                          onClick={() => onInspectItem(item)}
                          className="text-slate-400 hover:text-white underline text-[11px]"
                        >
                          Revoir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
