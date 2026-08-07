'use client';

import React from 'react';
import { Gem, CheckCircle2, Zap, Crown, ShieldCheck } from 'lucide-react';

export default function PlanConfigurator() {
  const PLANS = [
    {
      id: 'starter',
      name: 'Plan Starter',
      target: 'Petites agences de distribution locale',
      price: '150 000 FCFA / mois',
      agents: 'Jusqu\'à 5 agents terrain',
      items: '5 000 factures / mois incluses',
      features: [
        'Prise en charge factures simples',
        'Application Mobile PWA Agent',
        'Reçus de livraison standard',
        'Support email 48h'
      ],
      color: 'border-blue-500/40 bg-blue-950/20'
    },
    {
      id: 'pro',
      name: 'Plan Pro',
      target: 'Entreprises de logistique régionales',
      price: '350 000 FCFA / mois',
      agents: 'Jusqu\'à 25 agents terrain',
      items: '50 000 factures / mois incluses',
      features: [
        'Tous les avantages Starter',
        'Carte GPS Live en temps réel',
        'Passerelle SMS & OTP dédiée',
        'Hub de validation PoD avec photos',
        'Support prioritaire 24/7'
      ],
      recommended: true,
      color: 'border-violet-500 bg-violet-950/30'
    },
    {
      id: 'enterprise',
      name: 'Plan Enterprise',
      target: 'Grands groupes & Réseaux nationaux',
      price: '850 000 FCFA / mois',
      agents: 'Agents illimités',
      items: 'Volume sur-mesure (200k+)',
      features: [
        'Tous les avantages Pro',
        'Marque Blanche complète (White-label)',
        'APIs REST d\'intégration Supabase',
        'Serveur & Base de données dédiée',
        'Account Manager dédié'
      ],
      color: 'border-amber-500/40 bg-amber-950/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-6 shadow-xl space-y-2">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Gem className="w-6 h-6 text-amber-400" />
          Grille des Offres & Conditions Tarifaires SaaS
        </h2>
        <p className="text-xs text-slate-400">
          Configuration des limites d'agents, quotas d'items et fonctionnalités incluses par plan d'abonnement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map(p => (
          <div
            key={p.id}
            className={`border rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between relative ${p.color}`}
          >
            {p.recommended && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-600 text-white shadow-lg">
                OFFRE LA PLUS POPULAIRE
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-white text-lg">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{p.target}</p>
              </div>

              <div className="text-2xl font-black text-amber-400 font-mono">{p.price}</div>

              <div className="space-y-1 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-white font-bold">{p.agents}</div>
                <div className="text-indigo-300">{p.items}</div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => alert(`Ajustement du tarif ${p.name} ouvert.`)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              Éditer ce Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
