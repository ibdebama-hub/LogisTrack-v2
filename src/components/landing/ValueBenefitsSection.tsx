'use client';

import React from 'react';
import {
  MapPin,
  ShieldCheck,
  Banknote,
  BarChart3,
  Smartphone,
  Building2,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function ValueBenefitsSection() {
  const benefits = [
    {
      icon: MapPin,
      title: 'Cartographie Temps Réel & PostGIS Geofence',
      description: 'Supervisez l\'ensemble des agents sur une carte dynamique Leaflet avec rejeu d\'itinéraires GPS et détection d\'événements géofence.'
    },
    {
      icon: ShieldCheck,
      title: 'Proof of Delivery (POD) Certifié SHA-256',
      description: 'Preuves juridiquement infalsifiables intégrant signature tactile, horodatage certifié et vérification publique QR Code.'
    },
    {
      icon: Banknote,
      title: 'Réconciliation Financière COD Caisse',
      description: 'Module d\'encaissement terrain sécurisé avec comptabilisation des fonds espèces, reçus numériques et rapprochement bancaire.'
    },
    {
      icon: BarChart3,
      title: 'Business Intelligence & Scorecards sur 100',
      description: 'Analyses décisionnelles stratégiques avec scorecards automatiques, comparateur côte-à-côte et moteur d\'alertes IA.'
    },
    {
      icon: Smartphone,
      title: 'App Mobile Agent PWA Offline-First',
      description: 'Application mobile smartphone fluide fonctionnant même en zone réseau nulle avec synchronisation automatique Supabase.'
    },
    {
      icon: Building2,
      title: 'Portail Client B2B en Libre-Service',
      description: 'Interface multi-tenant pour vos donneurs d\'ordres : dépôt autonome des fichiers, messagerie live et téléchargement des certificats.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80 space-y-12 bg-slate-950">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
          AVANTAGES STRATÉGIQUES ENTREPRISE
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Pourquoi Choisir LOGISTRACK V2 ?
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Découvrez les bénéfices concrets qui font de LOGISTRACK V2 la référence des solutions de gestion d'opérations terrain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                {b.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {b.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
