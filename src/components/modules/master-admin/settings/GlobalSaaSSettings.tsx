'use client';

import React, { useState } from 'react';
import { DollarSign, Globe, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GlobalSaaSSettings as GlobalSettingsType } from '../../../../types/masterSettings';

interface GlobalSaaSSettingsProps {
  settings: GlobalSettingsType;
  onSave: (updated: GlobalSettingsType) => void;
}

export default function GlobalSaaSSettings({ settings, onSave }: GlobalSaaSSettingsProps) {
  const [primaryCurrency, setPrimaryCurrency] = useState(settings.primary_currency);
  const [defaultLanguage, setDefaultLanguage] = useState<'fr' | 'en'>(settings.default_language);
  const [defaultTimezone, setDefaultTimezone] = useState(settings.default_timezone);
  const [editorLegalName, setEditorLegalName] = useState(settings.editor_legal_name);
  const [editorTaxId, setEditorTaxId] = useState(settings.editor_tax_id);
  const [defaultVatRate, setDefaultVatRate] = useState(settings.default_vat_rate);
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoice_prefix);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      primary_currency: primaryCurrency,
      default_language: defaultLanguage,
      default_timezone: defaultTimezone,
      editor_legal_name: editorLegalName,
      editor_tax_id: editorTaxId,
      default_vat_rate: defaultVatRate,
      invoice_prefix: invoicePrefix
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-4xl mx-auto text-xs">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-violet-400" />
          Paramètres Globaux du SaaS & Déclarations Légales
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configuration des devises maîtres, préfixes de facturation et paramétrages régionaux par défaut du système.
        </p>
      </div>

      {/* CURRENCY & REGIONALISATION */}
      <div className="space-y-4">
        <h3 className="font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" /> 1. Devises & Régionalisation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Devise Maître Principale</label>
            <select
              value={primaryCurrency}
              onChange={e => setPrimaryCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-violet-500"
            >
              <option value="XOF">XOF - Franc CFA (BCEAO / Afrique de l'Ouest)</option>
              <option value="GNF">GNF - Franc Guinéen (Conakry)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="USD">USD - Dollar US ($)</option>
              <option value="NGN">NGN - Naira Nigérian (₦)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Langue Système par Défaut</label>
            <select
              value={defaultLanguage}
              onChange={e => setDefaultLanguage(e.target.value as 'fr' | 'en')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-violet-500"
            >
              <option value="fr">Français (Officiel)</option>
              <option value="en">English (Bilingual)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Fuseau Horaire Régional</label>
            <select
              value={defaultTimezone}
              onChange={e => setDefaultTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
            >
              <option value="Africa/Abidjan">Africa/Abidjan (GMT+0)</option>
              <option value="Africa/Bamako">Africa/Bamako (GMT+0)</option>
              <option value="Africa/Dakar">Africa/Dakar (GMT+0)</option>
              <option value="Africa/Conakry">Africa/Conakry (GMT+0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SAAS EDITOR LEGAL INFORMATIONS */}
      <div className="space-y-4 pt-2">
        <h3 className="font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" /> 2. Mentions Légales & Numérotation Factures SaaS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Raison Sociale de l'Éditeur SaaS</label>
            <input
              type="text"
              value={editorLegalName}
              onChange={e => setEditorLegalName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">NIF / RCCM Éditeur</label>
            <input
              type="text"
              value={editorTaxId}
              onChange={e => setEditorTaxId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Taux de TVA par Défaut (%)</label>
            <input
              type="number"
              value={defaultVatRate}
              onChange={e => setDefaultVatRate(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Préfixe Factures Abonnement SaaS</label>
            <input
              type="text"
              value={invoicePrefix}
              onChange={e => setInvoicePrefix(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Paramètres globaux SaaS enregistrés avec succès !</span>
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Enregistrer les Paramètres
        </button>
      </div>
    </form>
  );
}
