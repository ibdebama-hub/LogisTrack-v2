'use client';

import React from 'react';
import {
  FileText,
  Package,
  Mail,
  Wrench,
  BarChart3,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function UseCasesGrid() {
  const useCases = [
    {
      icon: FileText,
      color: 'indigo',
      title: 'Distribution de Factures & Plis',
      description: 'Distribution de masse avec géolocalisation GPS, repères visuels d\'adressage et signature tactile manuscrite.',
      tags: ['Signature Tactile', 'Geofence GPS', 'Notification SMS']
    },
    {
      icon: Package,
      color: 'emerald',
      title: 'Livraison E-Commerce & Colis COD',
      description: 'Gestion des livraisons du dernier kilomètre avec encaissement Cash On Delivery (espèces / mobile money) et reçu numérique.',
      tags: ['Photos Colis', 'Encaissement COD', 'Reçu PDF QR']
    },
    {
      icon: Mail,
      color: 'violet',
      title: 'Messagerie Express & Courrier B2B',
      description: 'Collecte et remise de courrier d\'entreprise avec décharge certifiée, horodatage immuable et suivi de tournée live.',
      tags: ['Code-Barres Scan', 'Preuve Décharge', 'SLA 24h']
    },
    {
      icon: Wrench,
      color: 'amber',
      title: 'Interventions Techniques & Maintenance',
      description: 'Suivi des équipes d\'intervention terrain avec photos avant/après, compte-rendu technique et rapport d\'audit.',
      tags: ['Photos Avant/Après', 'Rapport Technique', 'Validation Superviseur']
    },
    {
      icon: BarChart3,
      color: 'rose',
      title: 'Collecte de Documents, Relevés & Audit',
      description: 'Relevé de compteurs, collecte de dossiers juridiques et enquêtes terrain avec pièces jointes et horodatage certifié.',
      tags: ['Pièces Jointes PDF', 'Audit Qualité', 'Horodatage SHA-256']
    },
    {
      icon: Building2,
      color: 'teal',
      title: 'Services Publics, Banque & Télécoms',
      description: 'Plateforme multi-agences sécurisée permettant aux donneurs d\'ordres de suivre leurs campagnes nationales.',
      tags: ['Multi-Tenant RLS', 'Portail B2B Dedicated', 'API REST Ready']
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> FERTILITÉ MÉTIER & FLEXIBILITÉ TOTAL
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Une Seule Plateforme, Plusieurs Métiers
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Grâce à notre moteur de <strong>Mission Templates Configurables</strong>, LOGISTRACK V2 s'adapte instantanément à votre activité sans écrire une seule ligne de code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((uc, idx) => {
          const Icon = uc.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all shadow-xl hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {uc.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {uc.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                {uc.tags.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-mono font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
