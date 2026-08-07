'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Printer,
  Download,
  Search,
  Filter,
  Users,
  Wallet,
  ArrowUpRight,
  Sparkles,
  Lock,
  ChevronRight,
  Clock,
  ArrowDownLeft,
  X,
  FileSpreadsheet,
  Building2
} from 'lucide-react';

interface AgentCashClosure {
  agentId: string;
  agentName: string;
  agentPhone: string;
  zoneCode: string;
  campaignTitle: string;
  theoreticalCod: number; // Theoretical COD calculated from field scans
  paidCash: number; // Actual physical cash handed over
  paidMobileMoney: number; // Actual Mobile Money transfer (Wave/Orange/MTN)
  paidPos: number; // Actual POS card payment
  status: 'pending' | 'reconciled' | 'discrepancy';
  intermediateDepositRequested: boolean;
  notes?: string;
  reconciledAt?: string;
  cashierName?: string;
}

const CASH_SECURITY_CEILING = 500000;

const INITIAL_CLOSURES: AgentCashClosure[] = [
  {
    agentId: 'a1',
    agentName: 'Diallo Mamadou',
    agentPhone: '+225 05 04 99 88 77',
    zoneCode: 'ABJ-YOP-SEL',
    campaignTitle: 'Campagne Factures CIE Électricité - Août 2026',
    theoreticalCod: 685000,
    paidCash: 500000,
    paidMobileMoney: 185000,
    paidPos: 0,
    status: 'pending',
    intermediateDepositRequested: true,
  },
  {
    agentId: 'a2',
    agentName: 'Kouassi Jean-Marc',
    agentPhone: '+225 07 08 12 34 56',
    zoneCode: 'ABJ-COC-RIV',
    campaignTitle: 'Société Ivoirienne de Banque (SIB) Relevés',
    theoreticalCod: 245000,
    paidCash: 200000,
    paidMobileMoney: 45000,
    paidPos: 0,
    status: 'reconciled',
    reconciledAt: '2026-08-05 15:30',
    cashierName: 'Finance Admin - Yves Toure',
    intermediateDepositRequested: false,
  },
  {
    agentId: 'a3',
    agentName: 'Koffi Marie-Noëlle',
    agentPhone: '+225 01 02 33 44 55',
    zoneCode: 'ABJ-MAR-Z4',
    campaignTitle: 'Orange Côte d\'Ivoire Factures B2B',
    theoreticalCod: 420000,
    paidCash: 400000,
    paidMobileMoney: 0,
    paidPos: 0,
    status: 'discrepancy',
    notes: 'Manquant de 20,000 FCFA en attente de justification',
    intermediateDepositRequested: false,
  },
  {
    agentId: 'a4',
    agentName: 'Ndiaye Cheikh',
    agentPhone: '+221 77 123 45 67',
    zoneCode: 'DKR-PLT-SAN',
    campaignTitle: 'Distribution Relevés SENELEC Dakar',
    theoreticalCod: 150000,
    paidCash: 150000,
    paidMobileMoney: 0,
    paidPos: 0,
    status: 'reconciled',
    reconciledAt: '2026-08-05 14:15',
    cashierName: 'Finance Admin - Yves Toure',
    intermediateDepositRequested: false,
  }
];

export default function CODReconciliationManager() {
  const [closures, setClosures] = useState<AgentCashClosure[]>(INITIAL_CLOSURES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reconciled' | 'discrepancy'>('all');
  const [activeTab, setActiveTab] = useState<'agent_closures' | 'financial_journal'>('agent_closures');

  // Modals
  const [selectedForReceipt, setSelectedForReceipt] = useState<AgentCashClosure | null>(null);
  const [activeSettleAgent, setActiveSettleAgent] = useState<AgentCashClosure | null>(null);
  const [inputCash, setInputCash] = useState<number>(0);
  const [inputMomo, setInputMomo] = useState<number>(0);
  const [inputPos, setInputPos] = useState<number>(0);
  const [inputNotes, setInputNotes] = useState<string>('');

  const handleOpenSettleModal = (agent: AgentCashClosure) => {
    setActiveSettleAgent(agent);
    setInputCash(agent.paidCash);
    setInputMomo(agent.paidMobileMoney);
    setInputPos(agent.paidPos);
    setInputNotes(agent.notes || '');
  };

  const handleConfirmReconciliation = () => {
    if (!activeSettleAgent) return;
    const totalPaid = inputCash + inputMomo + inputPos;
    const isExact = totalPaid === activeSettleAgent.theoreticalCod;

    setClosures(prev =>
      prev.map(c =>
        c.agentId === activeSettleAgent.agentId
          ? {
              ...c,
              paidCash: inputCash,
              paidMobileMoney: inputMomo,
              paidPos: inputPos,
              status: isExact ? 'reconciled' : 'discrepancy',
              notes: inputNotes || (isExact ? undefined : `Écart de ${(activeSettleAgent.theoreticalCod - totalPaid).toLocaleString()} FCFA`),
              reconciledAt: new Date().toLocaleString('fr-FR'),
              cashierName: 'Caissier Principal - Yves Toure'
            }
          : c
      )
    );

    const updated = {
      ...activeSettleAgent,
      paidCash: inputCash,
      paidMobileMoney: inputMomo,
      paidPos: inputPos,
      status: isExact ? ('reconciled' as const) : ('discrepancy' as const),
      reconciledAt: new Date().toLocaleString('fr-FR'),
      cashierName: 'Caissier Principal - Yves Toure'
    };

    setActiveSettleAgent(null);
    setSelectedForReceipt(updated);
  };

  // Export Financial Journal to CSV / Excel format
  const handleExportExcel = () => {
    const csvHeader = 'Agent,Zone,Campagne,Theorique_FCFA,Versed_Especes_FCFA,Versed_MobileMoney_FCFA,Ecart_FCFA,Statut,Horodatage\n';
    const csvRows = closures.map(c => {
      const totalPaid = c.paidCash + c.paidMobileMoney + c.paidPos;
      const ecart = c.theoreticalCod - totalPaid;
      return `"${c.agentName}","${c.zoneCode}","${c.campaignTitle}",${c.theoreticalCod},${c.paidCash},${c.paidMobileMoney},${ecart},"${c.status}","${c.reconciledAt || 'En attente'}"`;
    }).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `journal_comptable_cod_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredClosures = useMemo(() => {
    return closures.filter(c => {
      const matchesSearch =
        c.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.zoneCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [closures, searchQuery, statusFilter]);

  const kpis = useMemo(() => {
    const totalTheoretical = closures.reduce((sum, c) => sum + c.theoreticalCod, 0);
    const totalCash = closures.reduce((sum, c) => sum + c.paidCash, 0);
    const totalMomo = closures.reduce((sum, c) => sum + c.paidMobileMoney, 0);
    const totalCollected = totalCash + totalMomo;
    const totalDiscrepancy = totalTheoretical - totalCollected;
    const highRiskAgentsCount = closures.filter(c => c.theoreticalCod >= CASH_SECURITY_CEILING && c.status === 'pending').length;
    return { totalTheoretical, totalCash, totalMomo, totalCollected, totalDiscrepancy, highRiskAgentsCount };
  }, [closures]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
                Clôture de Caisse & Réconciliation Financière COD
              </h1>
              <p className="text-sm text-slate-400">
                Vue Admin/Caissier • Remise de caisse, calcul des écarts & journal comptable
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exporter Journal Comptable (Excel)
          </button>
        </div>
      </div>

      {/* Safety Ceiling Alert Banner */}
      {kpis.highRiskAgentsCount > 0 && (
        <div className="p-4 bg-amber-950/60 border border-amber-800/80 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-amber-300">
                Alerte Sécurité Caisse Terrain ({kpis.highRiskAgentsCount} Agent au-dessus de {CASH_SECURITY_CEILING.toLocaleString()} FCFA)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Versement intermédiaire requis pour sécuriser les fonds physiques de la tournée.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Théorique Encaissé (Scans PoD)</span>
          <p className="text-2xl font-bold text-white">{kpis.totalTheoretical.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-slate-400">Total calculé par le système</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Répartition Espèces physiques</span>
          <p className="text-2xl font-bold text-emerald-400">{kpis.totalCash.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-emerald-300">Espèces déposées au guichet</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Répartition Mobile Money</span>
          <p className="text-2xl font-bold text-sky-400">{kpis.totalMomo.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-sky-300">Transferts Wave / Orange / MTN</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Reliquat / Écart à Solder</span>
          <p className={`text-2xl font-bold ${kpis.totalDiscrepancy > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {kpis.totalDiscrepancy.toLocaleString()} FCFA
          </p>
          <span className="text-[11px] text-slate-400">Manquant global terrain</span>
        </div>
      </div>

      {/* Main Content View Tabs */}
      <div className="bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('agent_closures')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'agent_closures'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Clôtures par Agent
            </button>
            <button
              onClick={() => setActiveTab('financial_journal')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'financial_journal'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Journal Financier par Campagne
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Chercher agent, zone, campagne..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* TAB 1: AGENT CLOSURES TABLE */}
        {activeTab === 'agent_closures' && (
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Agent & Zone</th>
                  <th className="p-3">Campagne</th>
                  <th className="p-3">Théorique (Scans)</th>
                  <th className="p-3">Espèces Versées</th>
                  <th className="p-3">Mobile Money</th>
                  <th className="p-3">Écart de Caisse</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions Caissier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredClosures.map(c => {
                  const totalVersed = c.paidCash + c.paidMobileMoney + c.paidPos;
                  const ecart = c.theoreticalCod - totalVersed;

                  return (
                    <tr key={c.agentId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{c.agentName}</div>
                        <div className="text-[11px] text-indigo-400 font-mono">{c.zoneCode}</div>
                      </td>
                      <td className="p-3 max-w-xs truncate text-slate-300 font-medium">
                        {c.campaignTitle}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-200">
                        {c.theoreticalCod.toLocaleString()} FCFA
                      </td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">
                        {c.paidCash.toLocaleString()} FCFA
                      </td>
                      <td className="p-3 font-mono text-sky-400 font-bold">
                        {c.paidMobileMoney > 0 ? `${c.paidMobileMoney.toLocaleString()} FCFA` : '-'}
                      </td>
                      <td className="p-3 font-mono font-bold">
                        {ecart === 0 ? (
                          <span className="text-emerald-400">0 FCFA</span>
                        ) : ecart > 0 ? (
                          <span className="text-rose-400">-{ecart.toLocaleString()} FCFA</span>
                        ) : (
                          <span className="text-amber-400">+{Math.abs(ecart).toLocaleString()} FCFA</span>
                        )}
                      </td>
                      <td className="p-3">
                        {c.status === 'reconciled' && (
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded border border-emerald-800/40 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Soldé
                          </span>
                        )}
                        {c.status === 'pending' && (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded border border-slate-700 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-400" /> En attente
                          </span>
                        )}
                        {c.status === 'discrepancy' && (
                          <span className="px-2 py-0.5 bg-rose-950 text-rose-400 text-[10px] font-bold rounded border border-rose-800/40 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Écart
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {c.status === 'reconciled' && (
                            <button
                              onClick={() => setSelectedForReceipt(c)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg border border-slate-700 text-xs flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5" /> Reçu
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenSettleModal(c)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow"
                          >
                            Remise Caisse
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: FINANCIAL JOURNAL BY CAMPAIGN */}
        {activeTab === 'financial_journal' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Journal des Encaissements par Campagne
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Campagne Donneur d&apos;Ordre</th>
                      <th className="p-3">Agents Affectés</th>
                      <th className="p-3">Cumul Théorique</th>
                      <th className="p-3">Cumul Espèces</th>
                      <th className="p-3">Cumul Mobile Money</th>
                      <th className="p-3">Statut Réconciliation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredClosures.map(c => (
                      <tr key={c.agentId} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-white">{c.campaignTitle}</td>
                        <td className="p-3 font-mono">{c.agentName} ({c.zoneCode})</td>
                        <td className="p-3 font-mono text-slate-200">{c.theoreticalCod.toLocaleString()} FCFA</td>
                        <td className="p-3 font-mono text-emerald-400">{c.paidCash.toLocaleString()} FCFA</td>
                        <td className="p-3 font-mono text-sky-400">{c.paidMobileMoney.toLocaleString()} FCFA</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded border border-emerald-800/40">
                            Validé Caissier
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

      {/* FORMULAIRE DE REMISE DE CAISSE MODAL */}
      {activeSettleAgent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Formulaire de Remise de Caisse (Cash Handover)</h3>
                <p className="text-xs text-slate-400">Agent : <strong>{activeSettleAgent.agentName}</strong> ({activeSettleAgent.zoneCode})</p>
              </div>
              <button onClick={() => setActiveSettleAgent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Théorique issu des scans COD :</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {activeSettleAgent.theoreticalCod.toLocaleString()} FCFA
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Espèces physiques versées (FCFA) :</label>
                <input
                  type="number"
                  value={inputCash}
                  onChange={e => setInputCash(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Mobile Money (Wave / Orange Money) :</label>
                <input
                  type="number"
                  value={inputMomo}
                  onChange={e => setInputMomo(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-sky-400 font-mono font-bold"
                />
              </div>

              {/* Instant discrepancy calculation */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Calcul Instantané de l&apos;Écart :</span>
                <span className={`font-mono font-bold ${
                  (inputCash + inputMomo) === activeSettleAgent.theoreticalCod
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}>
                  {((inputCash + inputMomo) - activeSettleAgent.theoreticalCod).toLocaleString()} FCFA
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Remarques / Observation Caissier :</label>
                <textarea
                  placeholder="Justification en cas d'écart..."
                  value={inputNotes}
                  onChange={e => setInputNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmReconciliation}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Solder Fiche de Caisse & Émettre Reçu
            </button>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {selectedForReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Reçu Numérique de Décharge de Caisse</h3>
              </div>
              <button onClick={() => setSelectedForReceipt(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 font-mono text-xs text-slate-300">
              <div className="text-center border-b border-slate-800 pb-3">
                <h4 className="font-extrabold text-white text-sm">LOGISTRACK V2 - REÇU DE CAISSE COD</h4>
                <p className="text-[10px] text-slate-400">Date: {selectedForReceipt.reconciledAt || '05/08/2026 16:33'}</p>
                <p className="text-[10px] text-slate-400">N° Reçu: REC-COD-2026-9814</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Agent Terrain:</span>
                  <strong className="text-white">{selectedForReceipt.agentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Zone:</span>
                  <span className="text-indigo-400">{selectedForReceipt.zoneCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Caissier Admin:</span>
                  <span className="text-slate-200">{selectedForReceipt.cashierName || 'Yves Toure'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Théorique Scans:</span>
                  <span>{selectedForReceipt.theoreticalCod.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Versé Espèces:</span>
                  <span>{selectedForReceipt.paidCash.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sky-400">
                  <span>Versé Mobile Money:</span>
                  <span>{selectedForReceipt.paidMobileMoney.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800 text-sm">
                  <span>TOTAL SOLDE ENCAISSÉ:</span>
                  <span className="text-amber-400">{(selectedForReceipt.paidCash + selectedForReceipt.paidMobileMoney).toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Imprimer Reçu (PDF)
              </button>
              <button
                onClick={() => setSelectedForReceipt(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
