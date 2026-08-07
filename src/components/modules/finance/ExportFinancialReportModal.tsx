'use client';

import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ExportFinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportFinancialReportModal({
  isOpen,
  onClose
}: ExportFinancialReportModalProps) {
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');
  const [accountingSoftware, setAccountingSoftware] = useState<'SAGE' | 'ODOO' | 'QUICKBOOKS'>('SAGE');
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTriggerExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsSuccess(true);

      // Trigger automatic CSV/Excel file download simulation
      if (exportFormat === 'excel') {
        const csvContent = "data:text/csv;charset=utf-8,No_Recu,Tracking,Date,Client,Mode_Paiement,Montant_FCFA\nREC-2026-0884,LT-COD-90412,2026-08-05,Orange Guinee,ORANGE_MONEY,485000\nREC-2026-0885,LT-COD-90415,2026-08-05,Jumia,ESPECES,750000";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `grand_livre_encaissements_${accountingSoftware.toLowerCase()}_2026.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.print();
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Exportation des Rapports Financiers</h3>
              <p className="text-xs text-slate-400">Génération du Grand Livre et Synthèse Comptable</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="p-6 space-y-6 text-xs">
          {/* FORMAT CHOICE */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold block">Type de Rapport à Générer</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('excel')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  exportFormat === 'excel'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">Grand Livre (Excel/CSV)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Journal complet d'auditing comptable</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  exportFormat === 'pdf'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <FileText className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">Rapport Synthétique PDF</span>
                  <span className="text-[10px] text-slate-400 font-normal">Document certifié pour la direction</span>
                </div>
              </button>
            </div>
          </div>

          {/* ACCOUNTING FORMAT COMPATIBILITY */}
          {exportFormat === 'excel' && (
            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="text-slate-300 font-semibold block">Format de Logiciel Comptable de Destination</label>
              <div className="grid grid-cols-3 gap-2">
                {['SAGE', 'ODOO', 'QUICKBOOKS'].map(sw => (
                  <button
                    key={sw}
                    type="button"
                    onClick={() => setAccountingSoftware(sw as any)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      accountingSoftware === sw
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {sw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Export généré avec succès ! Fichier téléchargé.</span>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleTriggerExport}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Génération...' : 'Télécharger le Rapport'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
