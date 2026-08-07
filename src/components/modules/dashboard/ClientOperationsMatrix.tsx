'use client';

import React from 'react';
import {
  Building2,
  FileCheck,
  Printer,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Client, OperationType } from '../../../types/logistrack';

export interface ClientCampaignSummary {
  clientId: string;
  clientName: string;
  clientCode: string;
  clientColor: string;
  campaignTitle: string;
  operationType: OperationType;
  totalVolume: number;
  deliveredVolume: number;
  failedVolume: number;
  pendingVolume: number;
  codCollectedTotal: number;
  assignedAgentsCount: number;
  deadlineDate: string;
}

const MOCK_CAMPAIGNS: ClientCampaignSummary[] = [
  {
    clientId: 'cli-cie',
    clientName: 'EDM / CIE Électricité',
    clientCode: 'EDM-CIE',
    clientColor: '#10B981',
    campaignTitle: 'Factures Électricité Mensuelles - Zone Abidjan Nord',
    operationType: 'MASS_INVOICE_DISTRIBUTION',
    totalVolume: 45000,
    deliveredVolume: 38200,
    failedVolume: 2100,
    pendingVolume: 4700,
    codCollectedTotal: 0,
    assignedAgentsCount: 14,
    deadlineDate: '15/08/2026'
  },
  {
    clientId: 'cli-orange',
    clientName: 'Orange Mali / CI',
    clientCode: 'ORA-B2B',
    clientColor: '#FF7900',
    campaignTitle: 'Factures Télécom B2B Grands Comptes - Bamako & Sikasso',
    operationType: 'MASS_INVOICE_DISTRIBUTION',
    totalVolume: 18500,
    deliveredVolume: 16400,
    failedVolume: 650,
    pendingVolume: 1450,
    codCollectedTotal: 0,
    assignedAgentsCount: 8,
    deadlineDate: '12/08/2026'
  },
  {
    clientId: 'cli-sib',
    clientName: 'Société Ivoirienne de Banque (SIB)',
    clientCode: 'SIB-BANK',
    clientColor: '#4F46E5',
    campaignTitle: 'Relevés Bancaires Confidentiels & Chéquiers',
    operationType: 'CONFIDENTIAL_MAIL',
    totalVolume: 3400,
    deliveredVolume: 3100,
    failedVolume: 120,
    pendingVolume: 180,
    codCollectedTotal: 0,
    assignedAgentsCount: 5,
    deadlineDate: '10/08/2026'
  },
  {
    clientId: 'cli-ecom',
    clientName: 'Jumia / E-Commerce Merchants',
    clientCode: 'ECOM-COD',
    clientColor: '#F59E0B',
    campaignTitle: 'Livraisons Colis Express Cash on Delivery',
    operationType: 'PARCEL_DELIVERY_COD',
    totalVolume: 2800,
    deliveredVolume: 2450,
    failedVolume: 150,
    pendingVolume: 200,
    codCollectedTotal: 68500000,
    assignedAgentsCount: 9,
    deadlineDate: '08/08/2026'
  }
];

interface ClientOperationsMatrixProps {
  selectedClientId: string;
  selectedOperationType: OperationType | 'ALL';
}

export default function ClientOperationsMatrix({
  selectedClientId,
  selectedOperationType
}: ClientOperationsMatrixProps) {
  const filteredCampaigns = MOCK_CAMPAIGNS.filter(c => {
    const matchesClient = selectedClientId === 'ALL' || c.clientId === selectedClientId;
    const matchesOp = selectedOperationType === 'ALL' || c.operationType === selectedOperationType;
    return matchesClient && matchesOp;
  });

  return (
    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            Matrice d&apos;Avancement des Opérations par Donneur d&apos;Ordre
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Suivi consolidé des taux de couverture, encaissements COD et décharges par client
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-indigo-300 font-bold">
          <span>{filteredCampaigns.length} Campagnes actives</span>
        </div>
      </div>

      {/* Grid of Client Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map(camp => {
          const successPct = Math.round((camp.deliveredVolume / camp.totalVolume) * 100);

          return (
            <div
              key={camp.campaignTitle}
              className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden shadow-lg"
            >
              {/* Color Stripe Header */}
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: camp.clientColor }} />

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-white px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                      {camp.clientCode}
                    </span>
                    <span className="text-xs font-bold text-white">{camp.clientName}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 mt-1">{camp.campaignTitle}</h4>
                </div>

                <span className="px-2.5 py-1 bg-slate-900 text-indigo-300 text-[10px] font-bold rounded-lg border border-slate-800 uppercase font-mono">
                  {camp.operationType.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Progress Bar (3 Colors: Delivered 🟢, Failed 🔴, Pending 🟠) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Progression globale</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {camp.deliveredVolume.toLocaleString()} / {camp.totalVolume.toLocaleString()} ({successPct}%)
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(camp.deliveredVolume / camp.totalVolume) * 100}%` }}
                  />
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${(camp.pendingVolume / camp.totalVolume) * 100}%` }}
                  />
                  <div
                    className="bg-rose-500 h-full"
                    style={{ width: `${(camp.failedVolume / camp.totalVolume) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span className="text-emerald-400">🟢 Distribués : {camp.deliveredVolume.toLocaleString()}</span>
                  <span className="text-amber-400">🟠 En cours : {camp.pendingVolume.toLocaleString()}</span>
                  <span className="text-rose-400">🔴 Échoués : {camp.failedVolume.toLocaleString()}</span>
                </div>
              </div>

              {/* Stats Footer & Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Users className="w-3.5 h-3.5 text-indigo-400" /> {camp.assignedAgentsCount} Agents
                  </span>

                  {camp.codCollectedTotal > 0 && (
                    <span className="font-mono font-bold text-amber-400">
                      COD : {camp.codCollectedTotal.toLocaleString()} F
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 text-xs font-bold rounded-lg border border-slate-800 flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Bordereau
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Rapport
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
