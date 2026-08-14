'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, Sparkles } from 'lucide-react';
import FinancialReportsOverview from '../../../../components/modules/finance/FinancialReportsOverview';
import CodTransactionTable from '../../../../components/modules/finance/CodTransactionTable';
import ExportFinancialReportModal from '../../../../components/modules/finance/ExportFinancialReportModal';
import { MOCK_COD_TRANSACTIONS, MOCK_FINANCE_KPIS } from '../../../../lib/mockFinanceReportsData';
import { CodTransactionItem, FinanceKPIs } from '../../../../types/financeReports';

export default function FinanceReportsPage() {
  const [transactions] = useState<CodTransactionItem[]>(MOCK_COD_TRANSACTIONS);
  const [kpis] = useState<FinanceKPIs>(MOCK_FINANCE_KPIS);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
              <FileSpreadsheet className="w-3 h-3 text-indigo-400" /> FINANCE & CAISSE (COD)
            </span>
            <span className="text-slate-500 text-xs font-mono">• Caissier & Auditeur</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Rapports Financiers & Historique des Encaissements
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Journal consolidé des encaissements terrain, suivi de la répartition Espèces vs Mobile Money et génération du Grand Livre.
          </p>
        </div>
      </div>

      {/* SECTION 1: KPIS OVERVIEW & METHOD BREAKDOWN */}
      <FinancialReportsOverview kpis={kpis} />

      {/* SECTION 2: COD TRANSACTIONS AUDITING TABLE */}
      <CodTransactionTable
        transactions={transactions}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* EXPORT FINANCIAL REPORT MODAL */}
      <ExportFinancialReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
