'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CrmService } from '@/lib/services/crmService';

import {
  Package,
  Truck,
  FileText,
  MapPin,
  ShieldCheck,
  Zap,
  ArrowRight,
  Smartphone,
  BarChart3,
  Layers,
  CheckCircle2,
  Building2,
  Globe,
  Check,
  Crown,
  Sparkles,
  PhoneCall,
  Clock,
  Send,
  X,
  Lock,
  ChevronRight,
  Users
} from 'lucide-react';

import UseCasesGrid from '@/components/landing/UseCasesGrid';
import ValueBenefitsSection from '@/components/landing/ValueBenefitsSection';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: 'Guinée',
    monthlyVolume: '25000'
  });

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);

    try {
      await CrmService.createLeadFromLandingPage({
        company_name: formData.companyName || 'Prospect sans nom',
        contact_name: formData.fullName || 'Contact prospect',
        contact_email: formData.email,
        contact_phone: formData.phone,
        notes: `Volume estimé: ${formData.monthlyVolume} plis/mois - Pays: ${formData.country}`
      });
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setDemoSubmitted(false);
      setIsDemoModalOpen(false);
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        country: 'Guinée',
        monthlyVolume: '25000'
      });
    }, 2000);
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      {/* NAVIGATION HEADER */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md fixed top-0 w-full z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* BRAND LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent tracking-wider">
                LOGISTRACK V2
              </span>
              <span className="text-[9px] font-mono text-indigo-400 font-bold tracking-widest block -mt-1">
                ENTERPRISE SAAS
              </span>
            </div>
          </Link>

          {/* CENTER NAVIGATION LINKS */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#use-cases" className="hover:text-white transition-colors">Cas d'Usage</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs & Offres</a>
            <Link href="/client-portal/overview" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Espace Client B2B
            </Link>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-all"
            >
              Se Connecter
            </Link>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Demander une Démo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-36 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center space-y-8 relative overflow-hidden">
        {/* Glowing background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* UNIVERSAL TOP BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold animate-in fade-in tracking-wide font-mono">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>🚀 ENTERPRISE FIELD OPERATIONS SAAS PLATFORM</span>
        </div>

        {/* HIGH-IMPACT HERO TITLE */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Digitalisez, Pilotez et Automatisez TOUTES vos Opérations Terrain.
        </h1>

        {/* BENEFIT-ORIENTED SUBTITLE */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          De la distribution de factures à la livraison e-commerce avec encaissement COD, en passant par les interventions techniques : pilotez vos équipes terrain en temps réel, certifiez chaque preuve d'exécution avec sécurité SHA-256 et configurez vos workflows sur-mesure sans coder.
        </p>

        {/* KEY COMPETITIVE ADVANTAGE BANNER */}
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Des workflows qui s'adaptent à votre métier, pas l'inverse. Modèles de missions configurables en quelques clics.</span>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="px-7 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-sm rounded-2xl shadow-2xl shadow-indigo-600/40 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <PhoneCall className="w-4 h-4 text-amber-300" />
            <span>Demander une Démo Personnalisée</span>
          </button>

          <Link
            href="/login"
            className="px-7 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-800 flex items-center gap-2 transition-all shadow-xl"
          >
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Accéder à l'Espace de Démonstration</span>
          </Link>
        </div>

        {/* METRICS / STATS BAR */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl sm:text-3xl font-black text-white block">+500K</span>
            <span className="text-xs text-slate-400 font-mono">Missions & Items / Mois</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">99.8%</span>
            <span className="text-xs text-slate-400 font-mono">Taux de Remise Certifié</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block">100%</span>
            <span className="text-xs text-slate-400 font-mono">Workflows Configurables</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">100%</span>
            <span className="text-xs text-slate-400 font-mono">Traçabilité GPS & POD</span>
          </div>
        </div>
      </section>

      {/* NEW SECTION: UNE PLATEFORME, PLUSIEURS MÉTIERS */}
      <div id="use-cases">
        <UseCasesGrid />
      </div>

      {/* NEW SECTION: STRATEGIC BENEFITS */}
      <ValueBenefitsSection />

      {/* FEATURE HIGHLIGHTS GRID */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block">
            FONCTIONNALITÉS CLÉS DU SAAS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Une Suite Complète pour la Logistique Moderne</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Adressage Informel & Repères Visuels</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dépassez l'absence de numéros de rue ! LogisTrack intègre des descriptions de repères visuels (ex: <em>"Face à la pharmacie, porte 12"</em>) combinées aux coordonnées GPS enregistrées sur le terrain.
            </p>
          </div>

          <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">App Mobile Agent PWA (Offline-First)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              L'application mobile des agents terrain fonctionne même en zone sans réseau. Prise de preuve par signature tactile manuscrite, photo décharge sous porte, code OTP SMS et synchronisation automatique.
            </p>
          </div>

          <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Portail Client B2B en Libre-Service</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Offrez à vos grands comptes donneurs d'ordres un portail dédié pour déposer leurs listings CSV/Excel, suivre leurs campagnes en temps réel et télécharger les preuves de livraison certifiées.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
            GRILLE TARIFAIRE TRANSPARENTE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Des Forfaits Adaptés à Votre Volume</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Sélectionnez la formule d'abonnement SaaS correspondant à votre flotte d'agents terrain et votre volume mensuel.
          </p>

          {/* HIGHLY VISIBLE SEGMENTED CONTROL TAB FOR MONTHLY / ANNUAL SWITCH */}
          <div className="pt-6 flex justify-center">
            <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('MONTHLY')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>Facturation Mensuelle</span>
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('ANNUAL')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'ANNUAL'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>Facturation Annuelle</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/30">
                  -20% Réduction
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* STARTER PLAN */}
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">STARTER</span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'ANNUAL' ? '120 000' : '150 000'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">FCFA / mois</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 block mt-1">
                  {billingCycle === 'ANNUAL'
                    ? 'Facturé 1 440 000 FCFA / an (-360 000 FCFA d\'économie)'
                    : 'Facturation mensuelle sans engagement'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Idéal pour les petites agences logistiques locales démarrant la numérisation.</p>

              <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800 font-mono">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Jusqu'à <strong>5 000 items</strong> / mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>5 Agents Terrain</strong> max</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Importation Fichiers CSV</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Support standard par email</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              Souscrire Starter ({billingCycle === 'ANNUAL' ? 'Annuel' : 'Mensuel'})
            </button>
          </div>

          {/* PRO PLAN (POPULAR) */}
          <div className="bg-slate-900/90 rounded-3xl border-2 border-indigo-500 p-8 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-indigo-600/20 transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
              LE PLUS POPULAIRE
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block">PRO ENTERPRISE</span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'ANNUAL' ? '280 000' : '350 000'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">FCFA / mois</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 block mt-1">
                  {billingCycle === 'ANNUAL'
                    ? 'Facturé 3 360 000 FCFA / an (-840 000 FCFA d\'économie)'
                    : 'Facturation mensuelle sans engagement'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Pour les opérateurs gérant des tournées régulières de distribution de factures.</p>

              <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-slate-800 font-mono">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Jusqu'à <strong>25 000 items</strong> / mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>25 Agents Terrain</strong> max</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Portail Client B2B</strong> inclus</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Suivi GPS Carte Live & Realtime</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Quota 5 000 SMS d'Avis</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Demander un Essai Pro ({billingCycle === 'ANNUAL' ? 'Annuel' : 'Mensuel'})
            </button>
          </div>

          {/* ENTERPRISE PLAN */}
          <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">ENTERPRISE</span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'ANNUAL' ? '680 000' : '850 000'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">FCFA / mois</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 block mt-1">
                  {billingCycle === 'ANNUAL'
                    ? 'Facturé 8 160 000 FCFA / an (-2 040 000 FCFA d\'économie)'
                    : 'Facturation mensuelle sans engagement'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Pour les grands groupes logistiques nationaux et opérateurs télécoms/énergie.</p>

              <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800 font-mono">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Jusqu'à <strong>200 000 items</strong> / mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>100 Agents Terrain</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>API REST & Realtime Supabase dédiée</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Support Dédié 24/7 & SLA 99.9%</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              Contacter l'Équipe Commerciale
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
              <Package className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-sm">LOGISTRACK V2</span>
          </div>

          <div className="flex flex-wrap gap-6 text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">Connexion Unifiée</Link>
            <Link href="/overview" className="hover:text-white transition-colors">Dashboard Dispatcher</Link>
            <Link href="/client-portal/overview" className="hover:text-white transition-colors">Portail Client B2B</Link>
            <Link href="/master-admin/overview" className="hover:text-white transition-colors">Master Admin</Link>
          </div>

          <p className="text-[11px] text-slate-500 font-mono">
            © 2026 LogisTrack V2 Enterprise • Multi-Tenant SaaS B2B Logistics System
          </p>
        </div>
      </footer>

      {/* DEMO REQUEST MODAL */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Demande Transmise avec Succès !</h3>
                <p className="text-xs text-slate-400">
                  Un ingénieur avant-vente de LogisTrack vous recontactera sous 24 heures pour planifier votre démonstration personnalisée.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> DÉMONSTRATION EN DIRECT
                  </div>
                  <h3 className="text-2xl font-black text-white">Demander une Démo de LogisTrack V2</h3>
                  <p className="text-xs text-slate-400">
                    Découvrez comment automatiser la distribution de vos factures et optimiser la traçabilité terrain.
                  </p>
                </div>

                <form onSubmit={handleDemoSubmit} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Nom Complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Mamadou Diallo"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Entreprise Logistique</label>
                      <input
                        type="text"
                        required
                        placeholder="Logistics West Africa"
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Téléphone Mobile</label>
                      <input
                        type="tel"
                        required
                        placeholder="+224 620 45 88 12"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Email Professionnel</label>
                    <input
                      type="email"
                      required
                      placeholder="m.diallo@logistics-wa.gn"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Volume Mensuel Estimé (Items)</label>
                    <select
                      value={formData.monthlyVolume}
                      onChange={e => setFormData({ ...formData, monthlyVolume: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="5000">Jusqu'à 5 000 items / mois</option>
                      <option value="25000">De 5 000 à 25 000 items / mois</option>
                      <option value="100000">De 25 000 à 100 000 items / mois</option>
                      <option value="200000">+100 000 items / mois (Grand Compte)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>Envoyer la Demande de Démo</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
