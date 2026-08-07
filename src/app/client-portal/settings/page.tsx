'use client';

import React, { useState } from 'react';
import { Settings, Building, Mail, Phone, Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MOCK_CLIENT_PORTAL_USERS } from '@/lib/mockClientPortalData';

export default function ClientSettingsPage() {
  const clientUser = MOCK_CLIENT_PORTAL_USERS['cli-orange'];

  const [companyName, setCompanyName] = useState(clientUser.client_name);
  const [contactName, setContactName] = useState(clientUser.contact_name);
  const [contactEmail, setContactEmail] = useState(clientUser.contact_email);
  const [contactPhone, setContactPhone] = useState(clientUser.contact_phone);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          Mon Compte & Paramètres de Notification
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Gestion des coordonnées référentes de votre entreprise et des alertes de livraison.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* COMPANY PROFILE */}
        <div className="space-y-4">
          <h3 className="font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" /> Informations Entreprise & Contact Referent
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Raison Sociale</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nom du Contact Référent</label>
              <input
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email Réception Rapports</label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Téléphone Alerte SMS</label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="space-y-4 pt-2">
          <h3 className="font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" /> Préférences de Notifications & Rapports
          </h3>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <label className="flex items-center justify-between text-slate-300 cursor-pointer">
              <span>Alertes SMS immédiates en cas d'anomalie / NPAI</span>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={e => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 cursor-pointer">
              <span>Rapport de synthèse quotidien par Email à 18h</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </label>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Paramètres du compte enregistrés avec succès !</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            Enregistrer les Modifications
          </button>
        </div>
      </form>
    </div>
  );
}
