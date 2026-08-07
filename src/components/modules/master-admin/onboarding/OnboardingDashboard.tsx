'use client';

import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  Users,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserPlus,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import OnboardingWizardModal from './OnboardingWizardModal';
import { useTenantOnboarding } from '@/hooks/useTenantOnboarding';

export default function OnboardingDashboard() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { invitations, userProfiles, submitOnboardingWizard } = useTenantOnboarding();

  const totalTenants = userProfiles.length + 20;
  const pendingInvs = invitations.filter((i) => i.status === 'PENDING').length;
  const acceptedInvs = invitations.filter((i) => i.status === 'ACCEPTED').length;
  const expiredInvs = invitations.filter((i) => i.status === 'EXPIRED').length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Launch Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            SAAS MASTER ADMIN • ONBOARDING & IDENTITY CENTER
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Centre d&apos;Onboarding Client & Provisionnement</h1>
          <p className="text-xs text-slate-400">
            Assistant de création d&apos;organisations clientes, génération automatique des accès et suivi des invitations.
          </p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-600/30 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Nouvelle Organisation Cliente (Wizard 4 Étapes)
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Organisations Actives</span>
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalTenants}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +4 ce mois-ci
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Invitations en Attente</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{pendingInvs}</div>
          <div className="text-xs text-slate-400 mt-1 font-semibold">En attente de 1ère connexion</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Invitations Acceptées</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{acceptedInvs}</div>
          <div className="text-xs text-emerald-400 mt-1 font-semibold">Accès activés avec succès</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Invitations Expirées</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{expiredInvs}</div>
          <div className="text-xs text-rose-400 mt-1 font-semibold">Nécessite un renvoi d&apos;accès</div>
        </div>
      </div>

      {/* Recent Onboarding Activity Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Flux Chronologique de Provisionnement SaaS</h3>
            <p className="text-xs text-slate-400">Historique récent des créations d&apos;organisations et envoi des accès.</p>
          </div>
        </div>

        <div className="space-y-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{inv.tenant_name}</h4>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                    <span>Admin: <strong className="text-slate-200">{inv.first_name} {inv.last_name}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-indigo-400">{inv.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    inv.status === 'ACCEPTED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : inv.status === 'PENDING'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {inv.status}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Modal Component */}
      <OnboardingWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={submitOnboardingWizard}
      />
    </div>
  );
}
