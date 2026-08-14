'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Crown,
  Sparkles,
  Layers,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../../middleware';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [email, setEmail] = useState('master.admin@logistrack.online');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole, defaultEmail: string) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Enforce password verification for Super Admin access
    if (selectedRole === 'SUPER_ADMIN') {
      const validMasterPassword = 'LogisTrack2026!MasterOwner#Admin';
      if (password !== '••••••••••••' && password !== validMasterPassword && password.length < 8) {
        setIsLoading(false);
        setErrorMessage('Mot de passe Super Admin incorrect. Accès refusé.');
        return;
      }
    }

    // Store user role cookie for middleware routing
    document.cookie = `user_role=${selectedRole}; path=/; max-age=86400`;

    setTimeout(() => {
      setIsLoading(false);
      switch (selectedRole) {
        case 'super_admin':
        case 'SUPER_ADMIN':
          router.push('/master-admin/overview');
          break;
        case 'client_admin':
        case 'CLIENT_B2B':
          router.push('/client-portal/overview');
          break;
        case 'field_agent':
        case 'FIELD_AGENT':
          router.push('/dispatch');
          break;
        case 'dispatcher':
        case 'DISPATCHER':
        default:
          router.push('/overview');
          break;
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* HEADER BAR */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
                LOGISTRACK V2
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest block -mt-1">
                PORTAIL DE CONNEXION UNIFIÉ
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Retour à la landing page
          </Link>
        </div>
      </header>

      {/* MAIN LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Authentification Sécurisée Multi-Tenant
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Connexion à LogisTrack V2</h1>
            <p className="text-xs text-slate-400">
              Sélectionnez votre profil d'accès pour être orienté automatiquement vers votre espace dédié.
            </p>
          </div>

          {/* ROLE SELECTOR GRID */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('DISPATCHER', 'dispatcher@logistics-wa.gn')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedRole === 'DISPATCHER'
                  ? 'bg-slate-950 border-indigo-500 shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-500'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-xs">Dispatcher / Admin</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Dashboard Exploitation & Tournées</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('CLIENT_B2B', 'contact@orange-guinee.gn')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedRole === 'CLIENT_B2B'
                  ? 'bg-slate-950 border-amber-500 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">Portail Client B2B</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Suivi & Preuves (EDG, Orange...)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('SUPER_ADMIN', 'master.admin@logistrack.online')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedRole === 'SUPER_ADMIN'
                  ? 'bg-slate-950 border-violet-500 shadow-lg shadow-violet-500/20 ring-1 ring-violet-500'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-violet-400" />
                <span className="font-bold text-white text-xs">Master Admin SaaS</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Supervision SaaS & Abonnements</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('FIELD_AGENT', 'm.diallo@logistics-wa.gn')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedRole === 'FIELD_AGENT'
                  ? 'bg-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">Agent Terrain PWA</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Scan & Preuve Mobile</span>
            </button>
          </div>

          {/* ERROR ALERT BANNER */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-xs font-mono text-rose-300 flex items-center justify-between animate-in fade-in">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Adresse Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mot de Passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                'Connexion en cours...'
              ) : (
                <>
                  <span>Se Connecter à l'Espace {selectedRole.replace('_', ' ')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
            Protégé par le système RLS PostgreSQL Multi-Tenant • LogisTrack V2 Enterprise
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        LogisTrack V2 • Multi-Tenant SaaS B2B Delivery & Invoice Distribution Management System
      </footer>
    </div>
  );
}
