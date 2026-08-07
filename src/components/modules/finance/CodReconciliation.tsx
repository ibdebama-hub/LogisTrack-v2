'use client';

import React, { useState, useMemo } from 'react';
import {
  Wallet,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Printer,
  FileSpreadsheet,
  Search,
  Filter,
  Users,
  Clock,
  ShieldAlert,
  X,
  Building2,
  DollarSign
} from 'lucide-react';

interface AgentClosureRecord {
  agentId: string;
  agentName: string;
  agentPhone: string;
  zoneCode: string;
  campaignTitle: string;
  theoreticalCash: number;
  theoreticalMomo: number;
  theoreticalTotal: number;
  paidCash: number;
  paidMomo: number;
  status: 'pending' | 'reconciled' | 'discrepancy';
  reconciledAt?: string;
  cashierName?: string;
  notes?: string;
}

const INITIAL_RECORDS: AgentClosureRecord[] = [
  {
    agentId: 'a1',
    agentName: 'Diallo Mamadou',
    agentPhone: '+225 05 04 99 88 77',
    zoneCode: 'ABJ-YOP-SEL',
    campaignTitle: 'Campagne Factures CIE Électricité',
    theoreticalCash: 500000,
    theoreticalMomo: 185000,
    theoreticalTotal: 685000,
    paidCash: 500000,
    paidMomo: 185000,
    status: 'pending'
  },
  {
    agentId: 'a2',
    agentName: 'Kouassi Jean-Marc',
    agentPhone: '+225 07 08 12 34 56',
    zoneCode: 'ABJ-COC-RIV',
    campaignTitle: 'Société Ivoirienne de Banque (SIB) Relevés',
    theoreticalCash: 200000,
    theoreticalMomo: 45000,
    theoreticalTotal: 245000,
    paidCash: 200000,
    paidMomo: 45000,
    status: 'reconciled',
    reconciledAt: '05/08/2026 15:30',
    cashierName: 'Caissier Admin - Yves Toure'
  },
  {
    agentId: 'a3',
    agentName: 'Koffi Marie-Noëlle',
    agentPhone: '+225 01 02 33 44 55',
    zoneCode: 'ABJ-MAR-Z4',
    campaignTitle: 'Orange Côte d\'Ivoire Factures B2B',
    theoreticalCash: 420000,
    theoreticalMomo: 0,
    theoreticalTotal: 420000,
    paidCash: 400000,
    paidMomo: 0,
    status: 'discrepancy',
    notes: 'Manquant de 20 000 FCFA à régulariser'
  },
  {
    agentId: 'a4',
    agentName: 'Traoré Bakary',
    agentPhone: '+223 70 12 34 56',
    zoneCode: 'BMK-COU-01',
    campaignTitle: 'Factures Eau - Zone Bamako Coura',
    theoreticalCash: 150000,
    theoreticalMomo: 25000,
    theoreticalTotal: 175000,
    paidCash: 150000,
    paidMomo: 25000,
    status: 'reconciled',
    reconciledAt: '05/08/2026 14:15',
    cashierName: 'Caissier Admin - Yves Toure'
  }
];

export default function CodReconciliation() {
  const [records, setRecords] = useState<AgentClosureRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reconciled' | 'discrepancy'>('all');
  const [activeTab, setActiveTab] = useState<'closures' | 'journal'>('closures');

  // Modals
  const [activeHandoverAgent, setActiveHandoverAgent] = useState<AgentClosureRecord | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<AgentClosureRecord | null>(null);

  // Form Inputs
  const [inputCash, setInputCash] = useState<number>(0);
  const [inputMomo, setInputMomo] = useState<number>(0);
  const [inputNotes, setInputNotes] = useState<string>('');

  const handleOpenHandover = (record: AgentClosureRecord) => {
    setActiveHandoverAgent(record);
    setInputCash(record.paidCash);
    setInputMomo(record.paidMomo);
    setInputNotes(record.notes || '');
  };

  const handleConfirmHandover = () => {
    if (!activeHandoverAgent) return;
    const totalHandedOver = inputCash + inputMomo;
    const isExact = totalHandedOver === activeHandoverAgent.theoreticalTotal;

    const updatedRecord: AgentClosureRecord = {
      ...activeHandoverAgent,
      paidCash: inputCash,
      paidMomo: inputMomo,
      status: isExact ? 'reconciled' : 'discrepancy',
      notes: inputNotes || (isExact ? undefined : `Écart de ${(activeHandoverAgent.theoreticalTotal - totalHandedOver).toLocaleString()} FCFA`),
      reconciledAt: new Date().toLocaleString('fr-FR'),
      cashierName: 'Caissier Admin - Yves Toure'
    };

    setRecords(prev => prev.map(r => r.agentId === activeHandoverAgent.agentId ? updatedRecord : r));
    setActiveHandoverAgent(null);
    setSelectedReceipt(updatedRecord);
  };

  const handleExportExcel = () => {
    const csvHeader = 'Agent,Telephone,Zone,Campagne,Theorique_Especes_FCFA,Theorique_MobileMoney_FCFA,Total_Theorique_FCFA,Verse_Especes_FCFA,Verse_MobileMoney_FCFA,Ecart_FCFA,Statut,Horodatage\n';
    const csvRows = records.map(r => {
      const totalVerse = r.paidCash + r.paidMomo;
      const ecart = r.theoreticalTotal - totalVerse;
      return `"${r.agentName}","${r.agentPhone}","${r.zoneCode}","${r.campaignTitle}",${r.theoreticalCash},${r.theoreticalMomo},${r.theoreticalTotal},${r.paidCash},${r.paidMomo},${ecart},"${r.status}","${r.reconciledAt || 'En attente'}"`;
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

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch =
        r.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.zoneCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const kpis = useMemo(() => {
    const totalTheoretical = records.reduce((sum, r) => sum + r.theoreticalTotal, 0);
    const totalCash = records.reduce((sum, r) => sum + r.paidCash, 0);
    const totalMomo = records.reduce((sum, r) => sum + r.paidMomo, 0);
    const totalHanded = totalCash + totalMomo;
    const totalDiscrepancy = totalTheoretical - totalHanded;
    return { totalTheoretical, totalCash, totalMomo, totalHanded, totalDiscrepancy };
  }, [records]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Top Banner Header */}
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
                Interface Caissier/Admin • Remise de caisse (Cash Handover), calcul d&apos;écarts & export journal
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
        >
          <FileSpreadsheet className="w-4 h-4" /> Exporter Journal Comptable (Excel)
        </button>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Théorique Collecté (Scans COD)</span>
          <p className="text-2xl font-extrabold text-white">{kpis.totalTheoretical.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-slate-400">Total calculé depuis les livraisons</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Répartition Espèces physiques</span>
          <p className="text-2xl font-extrabold text-emerald-400">{kpis.totalCash.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-emerald-300">Versés au guichet caisse</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Répartition Mobile Money</span>
          <p className="text-2xl font-extrabold text-sky-400">{kpis.totalMomo.toLocaleString()} FCFA</p>
          <span className="text-[11px] text-sky-300">Wave / Orange Money / MTN</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Écart de Caisse Global</span>
          <p className={`text-2xl font-extrabold ${kpis.totalDiscrepancy > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {kpis.totalDiscrepancy.toLocaleString()} FCFA
          </p>
          <span className="text-[11px] text-slate-400">Manquant à justifier</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-5 space-y-4">
        {/* Navigation Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('closures')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'closures' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Clôtures de Caisse par Agent
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'journal' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Journal Comptable des Transactions
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher par agent, zone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* TAB 1: AGENT CLOSURES TABLE */}
        {activeTab === 'closures' && (
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Livreur / Agent</th>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Théorique Scans COD</th>
                  <th className="p-3">Espèces Physiques</th>
                  <th className="p-3">Mobile Money</th>
                  <th className="p-3">Écart de Caisse</th>
                  <th className="p-3">Statut Clôture</th>
                  <th className="p-3 text-right">Actions Caissier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.map(r => {
                  const totalHanded = r.paidCash + r.paidMomo;
                  const ecart = r.theoreticalTotal - totalHanded;

                  return (
                    <tr key={r.agentId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">
                        {r.agentName}
                        <span className="block text-[11px] font-mono text-slate-400 font-normal">{r.agentPhone}</span>
                      </td>
                      <td className="p-3 font-mono text-indigo-400 font-bold">{r.zoneCode}</td>
                      <td className="p-3 font-mono font-bold text-slate-200">
                        {r.theoreticalTotal.toLocaleString()} FCFA
                        <span className="block text-[10px] text-slate-500 font-normal">
                          Esp: {r.theoreticalCash.toLocaleString()} / MoMo: {r.theoreticalMomo.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{r.paidCash.toLocaleString()} FCFA</td>
                      <td className="p-3 font-mono text-sky-400 font-bold">{r.paidMomo.toLocaleString()} FCFA</td>
                      <td className="p-3 font-mono font-bold">
                        {ecart === 0 ? (
                          <span className="text-emerald-400">0 FCFA</span>
                        ) : ecart > 0 ? (
                          <span className="text-rose-400">-{ecart.toLocaleString()} FCFA (Manquant)</span>
                        ) : (
                          <span className="text-amber-400">+{Math.abs(ecart).toLocaleString()} FCFA (Surplus)</span>
                        )}
                      </td>
                      <td className="p-3">
                        {r.status === 'reconciled' && (
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded border border-emerald-800/40 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Soldé & Réconcilié
                          </span>
                        )}
                        {r.status === 'pending' && (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded border border-slate-700 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-400" /> En attente versement
                          </span>
                        )}
                        {r.status === 'discrepancy' && (
                          <span className="px-2 py-0.5 bg-rose-950 text-rose-400 text-[10px] font-bold rounded border border-rose-800/40 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Écart Signalé
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.status === 'reconciled' && (
                            <button
                              onClick={() => setSelectedReceipt(r)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg border border-slate-700 text-xs flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5" /> Reçu
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenHandover(r)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow"
                          >
                            Formulaire Versement
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

        {/* TAB 2: FINANCIAL JOURNAL */}
        {activeTab === 'journal' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Journal des Encaissés par Campagne Donneur d&apos;Ordre
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Campagne</th>
                      <th className="p-3">Livreur</th>
                      <th className="p-3">Théorique FCFA</th>
                      <th className="p-3">Espèces Versées</th>
                      <th className="p-3">Mobile Money</th>
                      <th className="p-3">Horodatage Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRecords.map(r => (
                      <tr key={r.agentId} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-white">{r.campaignTitle}</td>
                        <td className="p-3 font-mono">{r.agentName} ({r.zoneCode})</td>
                        <td className="p-3 font-mono text-slate-200">{r.theoreticalTotal.toLocaleString()} FCFA</td>
                        <td className="p-3 font-mono text-emerald-400">{r.paidCash.toLocaleString()} FCFA</td>
                        <td className="p-3 font-mono text-sky-400">{r.paidMomo.toLocaleString()} FCFA</td>
                        <td className="p-3 font-mono text-slate-400">{r.reconciledAt || 'Non réconcilié'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FORMULAIRE DE VERSEMENT DE CAISSE MODAL */}
      {activeHandoverAgent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Formulaire de Remise de Caisse (Handover)</h3>
                <p className="text-xs text-slate-400">Livreur : <strong>{activeHandoverAgent.agentName}</strong> ({activeHandoverAgent.zoneCode})</p>
              </div>
              <button onClick={() => setActiveHandoverAgent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Théorique à Encaisser (Scans COD) :</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {activeHandoverAgent.theoreticalTotal.toLocaleString()} FCFA
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Espèces physiques versées au guichet (FCFA) :</label>
                <input
                  type="number"
                  value={inputCash}
                  onChange={e => setInputCash(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Mobile Money (Wave / Orange Money / MTN) :</label>
                <input
                  type="number"
                  value={inputMomo}
                  onChange={e => setInputMomo(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-sky-400 font-mono font-bold"
                />
              </div>

              {/* Automatic Cash Variance Calculation */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Calcul Automatique de l&apos;Écart :</span>
                <span className={`font-mono font-bold ${
                  (inputCash + inputMomo) === activeHandoverAgent.theoreticalTotal
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}>
                  {((inputCash + inputMomo) - activeHandoverAgent.theoreticalTotal).toLocaleString()} FCFA
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Remarques / Observations Caissier :</label>
                <textarea
                  placeholder="Justification en cas de manquant ou surplus..."
                  value={inputNotes}
                  onChange={e => setInputNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmHandover}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Valider la Clôture & Émettre le Reçu Numérique
            </button>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Reçu Numérique de Décharge de Caisse</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 font-mono text-xs text-slate-300">
              <div className="text-center border-b border-slate-800 pb-3">
                <h4 className="font-extrabold text-white text-sm">LOGISTRACK V2 - REÇU DE CAISSE COD</h4>
                <p className="text-[10px] text-slate-400">Horodatage: {selectedReceipt.reconciledAt || '05/08/2026 16:40'}</p>
                <p className="text-[10px] text-slate-400">N° Reçu: REC-COD-2026-9814</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Livreur:</span>
                  <strong className="text-white">{selectedReceipt.agentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Zone:</span>
                  <span className="text-indigo-400">{selectedReceipt.zoneCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Caissier Admin:</span>
                  <span className="text-slate-200">{selectedReceipt.cashierName || 'Yves Toure'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Théorique Scans COD:</span>
                  <span>{selectedReceipt.theoreticalTotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Versé Espèces:</span>
                  <span>{selectedReceipt.paidCash.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sky-400">
                  <span>Versé Mobile Money:</span>
                  <span>{selectedReceipt.paidMomo.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800 text-sm">
                  <span>TOTAL SOLDE REMIS:</span>
                  <span className="text-amber-400">{(selectedReceipt.paidCash + selectedReceipt.paidMomo).toLocaleString()} FCFA</span>
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
                onClick={() => setSelectedReceipt(null)}
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
