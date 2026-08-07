'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Users,
  Navigation,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Building2,
  Layers,
  Search,
  Eye,
  Zap,
  ChevronRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface DeliveryPoint {
  id: string;
  trackingNumber: string;
  campaignId: string;
  recipientName: string;
  address: string;
  landmark: string;
  lat: number;
  lng: number;
  status: 'delivered' | 'failed' | 'pending';
  assignedAgent: string;
  codAmount: number;
}

interface LiveAgent {
  id: string;
  name: string;
  phone: string;
  zoneCode: string;
  currentLat: number;
  currentLng: number;
  batteryLevel: number;
  itemsDelivered: number;
  itemsTotal: number;
  status: 'online' | 'moving' | 'offline';
}

const CAMPAIGNS = [
  { id: 'c1', title: 'Campagne Factures Eau - Zone Bamako Coura', city: 'Bamako', total: 420 },
  { id: 'c2', title: 'Campagne Factures CIE Électricité - Abidjan Nord', city: 'Abidjan', total: 1250 },
  { id: 'c3', title: 'Distribution Relevés SENELEC - Dakar Plateau', city: 'Dakar', total: 850 },
];

const MOCK_AGENTS: LiveAgent[] = [
  {
    id: 'a1',
    name: 'Kouassi Jean-Marc',
    phone: '+225 07 08 12 34 56',
    zoneCode: 'ABJ-COC-RIV',
    currentLat: 5.3599,
    currentLng: -3.9723,
    batteryLevel: 88,
    itemsDelivered: 34,
    itemsTotal: 40,
    status: 'moving'
  },
  {
    id: 'a2',
    name: 'Diallo Mamadou',
    phone: '+225 05 04 99 88 77',
    zoneCode: 'ABJ-YOP-SEL',
    currentLat: 5.3341,
    currentLng: -4.0621,
    batteryLevel: 94,
    itemsDelivered: 45,
    itemsTotal: 65,
    status: 'online'
  },
  {
    id: 'a3',
    name: 'Traoré Bakary',
    phone: '+223 70 12 34 56',
    zoneCode: 'BMK-COU-01',
    currentLat: 12.6392,
    currentLng: -8.0029,
    batteryLevel: 72,
    itemsDelivered: 28,
    itemsTotal: 35,
    status: 'moving'
  }
];

const MOCK_POINTS: DeliveryPoint[] = [
  {
    id: 'p1',
    trackingNumber: 'FAC-EAU-2026-001',
    campaignId: 'c1',
    recipientName: 'Société Malienne de Textile',
    address: 'Bamako Coura Rue 114',
    landmark: 'En face de la grande mosquée',
    lat: 12.6410,
    lng: -8.0015,
    status: 'delivered',
    assignedAgent: 'Traoré Bakary',
    codAmount: 0
  },
  {
    id: 'p2',
    trackingNumber: 'FAC-EAU-2026-002',
    campaignId: 'c1',
    recipientName: 'Oumar Cissé',
    address: 'Bamako Coura Porte 45',
    landmark: 'Près du grand marché de légumes',
    lat: 12.6380,
    lng: -8.0040,
    status: 'pending',
    assignedAgent: 'Traoré Bakary',
    codAmount: 12500
  },
  {
    id: 'p3',
    trackingNumber: 'FAC-EAU-2026-003',
    campaignId: 'c1',
    recipientName: 'Cabinet Médical de l\'Union',
    address: 'Bamako Coura Immeuble Keita',
    landmark: 'A côté de la pharmacie Populaire',
    lat: 12.6365,
    lng: -8.0010,
    status: 'failed',
    assignedAgent: 'Traoré Bakary',
    codAmount: 0
  },
  {
    id: 'p4',
    trackingNumber: 'FAC-CIE-2026-089',
    campaignId: 'c2',
    recipientName: 'Cabinet Avocats & Associes',
    address: 'Boulevard Latrille Villa 14',
    landmark: 'En face de la pharmacie St-Jean',
    lat: 5.3610,
    lng: -3.9740,
    status: 'delivered',
    assignedAgent: 'Kouassi Jean-Marc',
    codAmount: 0
  },
  {
    id: 'p5',
    trackingNumber: 'FAC-CIE-2026-090',
    campaignId: 'c2',
    recipientName: 'Sylla Fatoumata',
    address: 'Angré Djibi Villa 88',
    landmark: 'Près du château d\'eau, porte 12',
    lat: 5.3580,
    lng: -3.9710,
    status: 'pending',
    assignedAgent: 'Kouassi Jean-Marc',
    codAmount: 0
  }
];

export default function LiveDispatcherMap() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('c1');
  const [selectedPoint, setSelectedPoint] = useState<DeliveryPoint | null>(MOCK_POINTS[0]);
  const [selectedAgent, setSelectedAgent] = useState<LiveAgent | null>(MOCK_AGENTS[2]);

  const filteredPoints = useMemo(() => {
    return MOCK_POINTS.filter(p => p.campaignId === selectedCampaignId);
  }, [selectedCampaignId]);

  const selectedCampaign = useMemo(() => {
    return CAMPAIGNS.find(c => c.id === selectedCampaignId) || CAMPAIGNS[0];
  }, [selectedCampaignId]);

  const stats = useMemo(() => {
    const total = filteredPoints.length;
    const delivered = filteredPoints.filter(p => p.status === 'delivered').length;
    const failed = filteredPoints.filter(p => p.status === 'failed').length;
    const pending = filteredPoints.filter(p => p.status === 'pending').length;
    const coveragePct = total > 0 ? Math.round((delivered / total) * 100) : 0;
    return { total, delivered, failed, pending, coveragePct };
  }, [filteredPoints]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Top Header & Campaign Selector Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Navigation className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Live Mapping & Progression des Tournées
              </h1>
              <p className="text-sm text-slate-400">
                Suivi GPS en direct des agents et taux de couverture géographique des factures
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Filter Select Dropdown */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-400 font-medium">Campagne :</span>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CAMPAIGNS.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Coverage Progress Bar Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
              {selectedCampaign.title}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Couverture Géographique : <span className="text-emerald-400">{stats.coveragePct}%</span>
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {stats.delivered} Distribués (Vert)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {stats.pending} En cours (Orange)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {stats.failed} Échoués (Rouge)
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(stats.delivered / stats.total) * 100}%` }} />
          <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${(stats.pending / stats.total) * 100}%` }} />
          <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${(stats.failed / stats.total) * 100}%` }} />
        </div>
      </div>

      {/* Main Grid: Interactive Map View + Live Agent List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Box (2 Cols) */}
        <div className="lg:col-span-2 relative h-[500px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
          {/* Map Grid Pattern Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

          {/* Top Map Floating Badge */}
          <div className="z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 w-fit flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>OpenStreetMap Live Vector Map • {selectedCampaign.city}</span>
          </div>

          {/* Interactive Simulated Pin Overlay */}
          <div className="relative z-10 w-full h-full my-4 flex flex-wrap items-center justify-around p-6">
            {/* Live Agent Markers */}
            {MOCK_AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className="group relative p-3 rounded-2xl bg-indigo-950/90 border-2 border-indigo-400 text-white shadow-xl shadow-indigo-600/40 flex items-center gap-2 hover:scale-110 transition-all"
              >
                <div className="relative">
                  <Navigation className="w-5 h-5 text-emerald-400" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold block">{agent.name}</span>
                  <span className="text-[10px] text-indigo-300 font-mono">{agent.zoneCode}</span>
                </div>
              </button>
            ))}

            {/* Delivery Points Pins Color-Coded by Status */}
            {filteredPoints.map((pin) => {
              const statusColor =
                pin.status === 'delivered'
                  ? 'bg-emerald-500 border-emerald-300 shadow-emerald-500/50'
                  : pin.status === 'failed'
                  ? 'bg-rose-500 border-rose-300 shadow-rose-500/50'
                  : 'bg-amber-500 border-amber-300 shadow-amber-500/50';

              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPoint(pin)}
                  className={`p-2.5 rounded-full border-2 text-slate-950 font-bold transition-all shadow-lg hover:scale-125 ${statusColor} ${
                    selectedPoint?.id === pin.id ? 'ring-4 ring-indigo-400 scale-125' : ''
                  }`}
                  title={`${pin.trackingNumber} - ${pin.recipientName}`}
                >
                  <MapPin className="w-4 h-4 text-slate-950" />
                </button>
              );
            })}
          </div>

          {/* Floating Card for Selected Delivery Point */}
          {selectedPoint && (
            <div className="z-10 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400">{selectedPoint.trackingNumber}</span>
                  {selectedPoint.status === 'delivered' && (
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded border border-emerald-800/40">
                      🟢 Distribué
                    </span>
                  )}
                  {selectedPoint.status === 'pending' && (
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-400 text-[10px] font-bold rounded border border-amber-800/40">
                      🟠 En cours
                    </span>
                  )}
                  {selectedPoint.status === 'failed' && (
                    <span className="px-2 py-0.5 bg-rose-950 text-rose-400 text-[10px] font-bold rounded border border-rose-800/40">
                      🔴 Échoué
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">{selectedPoint.recipientName}</h4>
                <p className="text-xs text-slate-300">📍 {selectedPoint.address}</p>
                {selectedPoint.landmark && (
                  <p className="text-[11px] text-indigo-300 font-medium">Repère : {selectedPoint.landmark}</p>
                )}
              </div>

              <div className="text-right text-xs">
                <span className="text-slate-400 block">Agent affecté :</span>
                <strong className="text-slate-200">{selectedPoint.assignedAgent}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Live Active Field Agents Panel (1 Col) */}
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Agents en Tournée Live
            </h3>
            <span className="text-xs text-slate-400">{MOCK_AGENTS.length} Actifs</span>
          </div>

          <div className="space-y-3">
            {MOCK_AGENTS.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedAgent?.id === agent.id
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{agent.phone}</span>
                  </div>

                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded border border-emerald-800/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {agent.zoneCode}
                  </span>
                </div>

                {/* Progress Mini Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Progression zone</span>
                    <span className="font-bold text-indigo-300">{agent.itemsDelivered} / {agent.itemsTotal} livrés</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full"
                      style={{ width: `${(agent.itemsDelivered / agent.itemsTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
