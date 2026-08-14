'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Download,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Info,
  Layers,
  Crown
} from 'lucide-react';
import { OperationType } from '../../../types/logistrack';
import { downloadCsvTemplate, downloadXlsxTemplate } from '../../../utils/clientImportTemplates';
import { checkOrganizationQuota, QuotaCheckResult } from '../../../lib/quotaService';
import { broadcastCampaignCreated } from '../../../lib/supabase/realtime';
import { CampaignItem } from '../../../types/campaigns';

export default function ClientFileUpload() {
  const [operationType, setOperationType] = useState<OperationType>('MASS_INVOICE_DISTRIBUTION');
  const [targetDueDate, setTargetDueDate] = useState('2026-08-30');
  const [campaignName, setCampaignName] = useState('Distribution Factures Électricité & Eau - Août 2026');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [itemCount, setItemCount] = useState<number>(4500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [quotaError, setQuotaError] = useState<QuotaCheckResult | null>(null);

  const handleSimulateDrop = () => {
    // Simulate drop of a CSV file
    const fakeFile = new File(['tracking_number,recipient_name,address,amount\nLT-INV-9901,Sory Camara,Kaloum,0'], 'factures_aout_orange.csv', { type: 'text/csv' });
    setUploadedFile(fakeFile);
    setItemCount(4500);
    setQuotaError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setIsSubmitting(true);
    setQuotaError(null);

    // 1. Enforce SaaS Subscription Quota Check
    const quotaResult = await checkOrganizationQuota('tenant-101', itemCount);
    if (!quotaResult.allowed) {
      setQuotaError(quotaResult);
      setIsSubmitting(false);
      return;
    }

    // 2. Simulate database save & Realtime Event Broadcasting
    setTimeout(() => {
      const newCampaign: CampaignItem = {
        id: `camp-${Date.now()}`,
        reference: `CAMP-2026-CLI-${Math.floor(100 + Math.random() * 900)}`,
        name: campaignName,
        client_id: 'cli-orange',
        client_name: 'Orange Guinée B2B',
        client_code: 'OGN',
        operation_type: operationType,
        total_items: itemCount,
        delivered_items: 0,
        failed_items: 0,
        in_progress_items: itemCount,
        unassigned_items: itemCount,
        start_date: new Date().toISOString().split('T')[0],
        due_date: targetDueDate,
        is_urgent: false,
        status: 'EN_COURS',
        batches_count: 3,
        agents_assigned_count: 5,
        zones_progress: [
          { zone_name: 'Kaloum Centre', total: 2000, delivered: 0, failed: 0, in_progress: 2000 },
          { zone_name: 'Dixinn & Landréah', total: 2500, delivered: 0, failed: 0, in_progress: 2500 }
        ],
        assigned_agents: [],
        incidents: []
      };

      // Broadcast event to Dispatcher Dashboard in real-time
      broadcastCampaignCreated(newCampaign);

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-amber-400" />
          Dépôt de Fichiers de Distribution en Libre-Service
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Soumettez vos listings CSV/Excel de factures, courriers ou colis pour intégration immédiate dans les tournées LogisTrack.
        </p>
      </div>

      {/* SECTION TÉLÉCHARGEMENT DES MODÈLES */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-4 h-4" /> 📥 Préparez votre fichier de distribution
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Téléchargez nos gabarits d'exemple (.CSV / .XLSX) pré-formatés avec les 10 colonnes requises.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={downloadCsvTemplate}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 font-bold text-xs border border-indigo-500/30 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Modèle CSV</span>
            </button>

            <button
              type="button"
              onClick={downloadXlsxTemplate}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/40 transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Modèle Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* ACCORDION FIELD GUIDE */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center justify-between w-full text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Guide des 10 colonnes requises & Adressage informel
            </span>
            {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showGuide && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 animate-in fade-in">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">1. reference_client *</span>
                <span className="text-[10px] text-slate-400">N° de facture ou pli unique (ex: FAC-2026-0801)</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">2. type_item *</span>
                <span className="text-[10px] text-slate-400">FACTURE, COURRIER_SIMPLE, PLI_CONFIDENTIEL, COLIS</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">3 & 4. nom & telephone_destinataire *</span>
                <span className="text-[10px] text-slate-400">Nom du récepteur et N° mobile pour SMS d'avis</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">5 & 6. ville & quartier_secteur *</span>
                <span className="text-[10px] text-slate-400">Ex: Bamako / Hamdallaye ACI, Abidjan / Cocody</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SAAS QUOTA OVERLAP BLOCKING ALERT */}
      {quotaError && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 space-y-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-200">Blocage SaaS - Quota d'Abonnement Dépassé</h4>
              <p className="text-xs text-rose-300/90">{quotaError.message}</p>
              <div className="text-[11px] font-mono text-rose-300 pt-1 flex flex-wrap gap-3">
                <span>Plan actuel: <strong>{quotaError.planType}</strong></span>
                <span>Utilisé: <strong>{quotaError.currentUsage.toLocaleString()} / {quotaError.maxAllowed.toLocaleString()}</strong></span>
                <span>Demandé: <strong>+{quotaError.requestedCount.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-rose-800/40 flex items-center justify-between">
            <span className="text-[11px] text-rose-300 italic">Veuillez contacter le Master Admin pour débloquer votre quota.</span>
            <a
              href="/master-admin/overview"
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" /> Upgrade Plan Master Admin
            </a>
          </div>
        </div>
      )}

      {isSuccess ? (
        <div className="p-8 text-center space-y-4 bg-slate-950 rounded-2xl border border-emerald-500/40">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-lg font-bold text-white">Campagne Créée & Notifications Émises en Realtime !</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Votre fichier <strong className="text-amber-400 font-mono">{uploadedFile?.name}</strong> a été validé. <strong>{itemCount.toLocaleString()} enregistrements</strong> sont directement transmis au Dashboard Dispatcher.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => { setIsSuccess(false); setUploadedFile(null); setQuotaError(null); }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
            >
              Autre Dépôt
            </button>
            <a
              href="/client-portal/campaigns"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              Voir la Campagne dans l'Espace Client
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Intitulé de la Campagne</label>
            <input
              type="text"
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* OPTIONS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Type d'Opération Confiée</label>
              <select
                value={operationType}
                onChange={e => setOperationType(e.target.value as OperationType)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="MASS_INVOICE_DISTRIBUTION">Distribution Factures d'Eau / Électricité / Télécom</option>
                <option value="CONFIDENTIAL_MAIL">Plis Confidentiels / Cartes SIM B2B (Signature PoD)</option>
                <option value="PARCEL_DELIVERY_COD">Livraison Colis E-commerce (Avec Encaissement COD)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Date Échéance de Distribution Souhaitée</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="date"
                  value={targetDueDate}
                  onChange={e => setTargetDueDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* UPLOAD DROPZONE */}
          <div
            onClick={handleSimulateDrop}
            className="border-2 border-dashed border-slate-800 hover:border-amber-500/60 rounded-2xl p-8 text-center bg-slate-950/60 cursor-pointer transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>

            {uploadedFile ? (
              <div className="space-y-1">
                <span className="font-bold text-white text-sm block font-mono">{uploadedFile.name}</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Fichier chargé (CSV UTF-8) • {itemCount.toLocaleString()} lignes détectées</span>
              </div>
            ) : (
              <div>
                <span className="font-bold text-white block">Cliquez ou glissez votre fichier CSV / Excel ici</span>
                <span className="text-[11px] text-slate-500 font-mono mt-1 block">Formats acceptés : .csv, .xlsx, .xls (Max 25 MB)</span>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={!uploadedFile || isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isSubmitting ? 'Vérification Quota & Soumission...' : 'Valider & Lancer la Campagne'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
