'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Package,
  FileCheck,
  AlertCircle,
  Clock,
  Download,
  BarChart3,
  PieChart,
  Users,
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Printer
} from 'lucide-react';
import ClientSelectorBar from '../clients/ClientSelectorBar';
import ClientOperationsMatrix from './ClientOperationsMatrix';
import { OperationType } from '../../../types/logistrack';

interface ZoneAnalytics {
  zoneCode: string;
  zoneName: string;
  total: number;
  delivered: number;
  failed: number;
  pending: number;
}

interface AgentPerformance {
  agentName: string;
  zoneCode: string;
  totalAssigned: number;
  delivered: number;
  avgTimeMin: number;
  successRatePct: number;
}

interface ClientReportItem {
  id: string;
  trackingNumber: string;
  clientName: string;
  campaignTitle: string;
  recipientName: string;
  address: string;
  landmark: string;
  status: 'delivered' | 'failed' | 'pending';
  deliveredAt?: string;
  podType?: string;
  gpsCoords?: string;
  signatureUrl?: string;
}

const MOCK_ZONES_ANALYTICS: ZoneAnalytics[] = [
  { zoneCode: 'ABJ-COC-RIV', zoneName: 'Cocody Riviera', total: 12500, delivered: 11200, failed: 800, pending: 500 },
  { zoneCode: 'ABJ-YOP-SEL', zoneName: 'Yopougon Selmer', total: 18500, delivered: 15400, failed: 2100, pending: 1000 },
  { zoneCode: 'ABJ-MAR-Z4', zoneName: 'Marcory Zone 4', total: 5400, delivered: 4800, failed: 350, pending: 250 },
  { zoneCode: 'DKR-PLT-SAN', zoneName: 'Dakar Plateau', total: 8500, delivered: 7800, failed: 420, pending: 280 },
  { zoneCode: 'BMK-COU-01', zoneName: 'Bamako Coura', total: 4200, delivered: 3650, failed: 350, pending: 200 }
];

const MOCK_AGENTS_PERF: AgentPerformance[] = [
  { agentName: 'Kouassi Jean-Marc', zoneCode: 'ABJ-COC-RIV', totalAssigned: 450, delivered: 420, avgTimeMin: 12, successRatePct: 93 },
  { agentName: 'Diallo Mamadou', zoneCode: 'ABJ-YOP-SEL', totalAssigned: 680, delivered: 610, avgTimeMin: 15, successRatePct: 90 },
  { agentName: 'Koffi Marie-Noëlle', zoneCode: 'ABJ-MAR-Z4', totalAssigned: 320, delivered: 305, avgTimeMin: 11, successRatePct: 95 },
  { agentName: 'Ndiaye Cheikh', zoneCode: 'DKR-PLT-SAN', totalAssigned: 400, delivered: 380, avgTimeMin: 14, successRatePct: 95 },
  { agentName: 'Traoré Bakary', zoneCode: 'BMK-COU-01', totalAssigned: 350, delivered: 320, avgTimeMin: 16, successRatePct: 91 }
];

const MOCK_REPORT_ITEMS: ClientReportItem[] = [
  {
    id: 'rep-1',
    trackingNumber: 'FAC-2026-001',
    clientName: 'EDM / CIE Électricité',
    campaignTitle: 'Campagne Factures CIE Electricité - Août 2026',
    recipientName: 'Société Ivoirienne de Banque',
    address: 'Boulevard Latrille Villa 14',
    landmark: 'En face de la pharmacie St-Jean',
    status: 'delivered',
    deliveredAt: '05/08/2026 14:22',
    podType: 'Signature Tactile',
    gpsCoords: '5.3610, -3.9740',
    signatureUrl: '#'
  },
  {
    id: 'rep-2',
    trackingNumber: 'FAC-2026-005',
    clientName: 'EDM / CIE Électricité',
    campaignTitle: 'Campagne Factures CIE Electricité - Août 2026',
    recipientName: 'Sylla Fatoumata',
    address: 'Angré Djibi Villa 88',
    landmark: "Près du château d'eau, porte 12",
    status: 'delivered',
    deliveredAt: '05/08/2026 15:10',
    podType: 'Photo Boîte aux Lettres',
    gpsCoords: '5.3580, -3.9710',
    signatureUrl: '#'
  },
  {
    id: 'rep-3',
    trackingNumber: 'REC-2026-089',
    clientName: 'Société Ivoirienne de Banque (SIB)',
    campaignTitle: 'Société Ivoirienne de Banque Relevés',
    recipientName: 'Cabinet Avocats & Associes',
    address: 'Rue du Commerce Immeuble Jeceda',
    landmark: 'Porte 402 - 4ème étage',
    status: 'delivered',
    deliveredAt: '05/08/2026 11:45',
    podType: 'Signature Mandataire (Secrétaire)',
    gpsCoords: '5.3021, -3.9856',
    signatureUrl: '#'
  }
];

export default function DistributionAnalytics() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'client_reports'>('analytics');
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [selectedOperationType, setSelectedOperationType] = useState<OperationType | 'ALL'>('ALL');
  const [searchReportQuery, setSearchReportQuery] = useState('');

  // Overall KPI Calculations
  const kpis = useMemo(() => {
    const totalItems = MOCK_ZONES_ANALYTICS.reduce((sum, z) => sum + z.total, 0);
    const totalDelivered = MOCK_ZONES_ANALYTICS.reduce((sum, z) => sum + z.delivered, 0);
    const totalFailed = MOCK_ZONES_ANALYTICS.reduce((sum, z) => sum + z.failed, 0);
    const totalPending = MOCK_ZONES_ANALYTICS.reduce((sum, z) => sum + z.pending, 0);
    const coveragePct = Math.round((totalDelivered / totalItems) * 100);
    const avgDeliveryTimeMin = 13.5;
    const daysToDeadline = 7;

    return { totalItems, totalDelivered, totalFailed, totalPending, coveragePct, avgDeliveryTimeMin, daysToDeadline };
  }, []);

  // Filtered Client Report Items
  const filteredReportItems = useMemo(() => {
    return MOCK_REPORT_ITEMS.filter(r => {
      const matchesSearch =
        r.recipientName.toLowerCase().includes(searchReportQuery.toLowerCase()) ||
        r.trackingNumber.toLowerCase().includes(searchReportQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchReportQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchReportQuery]);

  const handleExportClientPDF = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
                Dashboard Dispatcher & Suivi Multi-Clients
              </h1>
              <p className="text-sm text-slate-400">
                Supervision consolidée par Donneur d&apos;Ordre (Énergie, Télécoms, Banques, E-Commerce) & Preuves PoD
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analytics Global
            </button>
            <button
              onClick={() => setActiveTab('client_reports')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'client_reports' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rapports de Décharge Client
            </button>
          </div>
        </div>
      </div>

      {/* PERSISTENT CLIENT & OPERATION SELECTOR BAR */}
      <ClientSelectorBar
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
        selectedOperationType={selectedOperationType}
        onSelectOperationType={setSelectedOperationType}
      />

      {/* 1. METRIQUES CLÉS (KPI CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative overflow-hidden">
          <span className="text-xs text-slate-400 font-medium">Taux Couverture Global</span>
          <p className="text-3xl font-extrabold text-emerald-400">{kpis.coveragePct}%</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${kpis.coveragePct}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Distribués (Livrés)</span>
          <p className="text-3xl font-extrabold text-white">{kpis.totalDelivered.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Preuves PoD capturées
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Échoués / NPAI</span>
          <p className="text-3xl font-extrabold text-rose-400">{kpis.totalFailed.toLocaleString()}</p>
          <span className="text-[11px] text-rose-300 font-medium">Non distribués avec motif</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Temps Moyen / Pli</span>
          <p className="text-3xl font-extrabold text-indigo-300">{kpis.avgDeliveryTimeMin} min</p>
          <span className="text-[11px] text-slate-400">Entre arrivée et remise</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Restant avant Échéance</span>
          <p className="text-3xl font-extrabold text-amber-400">{kpis.totalPending.toLocaleString()}</p>
          <span className="text-[11px] text-amber-300 font-semibold">{kpis.daysToDeadline} jours restants</span>
        </div>
      </div>

      {/* VIEW 1: ANALYTICS & PROGRESSION CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* CLIENT OPERATIONS MATRIX GRID */}
          <ClientOperationsMatrix
            selectedClientId={selectedClientId}
            selectedOperationType={selectedOperationType}
          />

          {/* Progression by Zone & Agent Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Zone Progression Breakdown */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  Progression de la Distribution par Zone Géographique
                </h3>
              </div>

              <div className="space-y-4">
                {MOCK_ZONES_ANALYTICS.map(z => {
                  const pct = Math.round((z.delivered / z.total) * 100);
                  return (
                    <div key={z.zoneCode} className="space-y-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-white">{z.zoneName} ({z.zoneCode})</span>
                        <span className="font-mono text-emerald-400 font-bold">{z.delivered} / {z.total} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${(z.delivered / z.total) * 100}%` }} />
                        <div className="bg-amber-500 h-full" style={{ width: `${(z.pending / z.total) * 100}%` }} />
                        <div className="bg-rose-500 h-full" style={{ width: `${(z.failed / z.total) * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>Échoués: {z.failed}</span>
                        <span>En cours: {z.pending}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent Performance Leaderboard */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Performance & Rendement des Agents Terrain
                </h3>
              </div>

              <div className="space-y-3">
                {MOCK_AGENTS_PERF.map(a => (
                  <div key={a.agentName} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-white">{a.agentName}</h4>
                      <span className="text-[10px] font-mono text-indigo-400">{a.zoneCode}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-emerald-400">{a.delivered} / {a.totalAssigned}</span>
                        <span className="block text-[10px] text-slate-400">Distribués</span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-indigo-300">{a.avgTimeMin} min</span>
                        <span className="block text-[10px] text-slate-400">Moy. / Pli</span>
                      </div>

                      <span className="px-2 py-1 bg-emerald-950 text-emerald-300 font-bold rounded-lg border border-emerald-800/40">
                        {a.successRatePct}% Succès
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CLIENT DISCHARGE REPORTS EXPORTER */}
      {activeTab === 'client_reports' && (
        <div className="space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  Génération des Rapports de Décharge Donneur d&apos;Ordre
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fichiers de distribution certifiés avec liens directs vers les preuves de remise PoD
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportClientPDF}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  <Printer className="w-4 h-4" /> Exporter Rapport Imprimable (PDF)
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher par référence, destinataire, adresse..."
                value={searchReportQuery}
                onChange={e => setSearchReportQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200"
              />
            </div>

            {/* Client Report Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Référence Facture</th>
                    <th className="p-3">Client Donneur d&apos;Ordre</th>
                    <th className="p-3">Destinataire</th>
                    <th className="p-3">Adresse & Repère Visuel</th>
                    <th className="p-3">Horodatage Remise</th>
                    <th className="p-3">Type Décharge</th>
                    <th className="p-3">Empreinte GPS PoD</th>
                    <th className="p-3 text-center">Preuve PoD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredReportItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-indigo-400">{item.trackingNumber}</td>
                      <td className="p-3 font-semibold text-white">{item.clientName}</td>
                      <td className="p-3 font-semibold text-white">{item.recipientName}</td>
                      <td className="p-3 max-w-xs">
                        <div>{item.address}</div>
                        <div className="text-[11px] text-indigo-300 italic">📍 {item.landmark}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{item.deliveredAt}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-200 text-[10px] font-bold rounded">
                          {item.podType}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{item.gpsCoords}</td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px] hover:underline cursor-pointer">
                          Voir Preuve PoD <ExternalLink className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
