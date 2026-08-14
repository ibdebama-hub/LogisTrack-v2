'use client';

import React, { useState } from 'react';
import { Building, Save, DollarSign, Palette, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { OrganizationProfile } from '../../../types/settings';

interface OrganizationSettingsProps {
  profile: OrganizationProfile;
  onSaveProfile: (updated: OrganizationProfile) => void;
}

export default function OrganizationSettings({ profile, onSaveProfile }: OrganizationSettingsProps) {
  const [companyName, setCompanyName] = useState(profile.company_name);
  const [address, setAddress] = useState(profile.address);
  const [phoneSupport, setPhoneSupport] = useState(profile.phone_support);
  const [emailSupport, setEmailSupport] = useState(profile.email_support);
  const [nifRcm, setNifRcm] = useState(profile.nif_rcm);
  const [defaultCurrency, setDefaultCurrency] = useState(profile.default_currency);
  const [themeAccent, setThemeAccent] = useState(profile.theme_accent_color);
  const [footerNote, setFooterNote] = useState(profile.print_footer_note);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      company_name: companyName,
      logo_url: profile.logo_url,
      address,
      phone_support: phoneSupport,
      email_support: emailSupport,
      nif_rcm: nifRcm,
      default_currency: defaultCurrency,
      theme_accent_color: themeAccent,
      print_footer_note: footerNote
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" />
            Paramètres de l'Organisation & Personnalisation
          </h3>
          <p className="text-xs text-slate-400">
            Raison sociale, identifiants légaux, devise régionale et personnalisation White-Label de la plateforme.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les Modifs</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Modifications enregistrées avec succès !</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: INFORMATIONS DE L'ENTREPRISE */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h4 className="font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4" /> Identité & Coordonnées Légales
          </h4>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Raison Sociale de la Société</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Numéro NIF / RCCM Légaux</label>
            <input
              type="text"
              value={nifRcm}
              onChange={e => setNifRcm(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Adresse Siège Social</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Téléphone Support</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phoneSupport}
                  onChange={e => setPhoneSupport(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email Support</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={emailSupport}
                  onChange={e => setEmailSupport(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PARAMÈTRES RÉGIONAUX & WHITE-LABEL */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h4 className="font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4" /> Paramètres Régionaux & Marque White-Label
          </h4>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Monnaie / Devise Principale par Défaut</label>
            <select
              value={defaultCurrency}
              onChange={e => setDefaultCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="FCFA">Franc CFA (XOF / XAF - FCFA) [Défaut]</option>
              <option value="GNF">Franc Guinéen (GNF)</option>
              <option value="USD">Dollar Américain (USD $)</option>
              <option value="EUR">Euro (EUR €)</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">S'applique à la facturation B2B et aux décharges COD.</span>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Couleur d'Accentuation de la Marque</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeAccent}
                onChange={e => setThemeAccent(e.target.value)}
                className="w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-slate-300 font-bold">{themeAccent}</span>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Note de Bas de Page (Factures & Exports)</label>
            <textarea
              rows={3}
              value={footerNote}
              onChange={e => setFooterNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
