'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Lock,
  Unlock,
  KeyRound,
  UserX,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  X,
  UserCog
} from 'lucide-react';
import { useTenantOnboarding } from '@/hooks/useTenantOnboarding';
import { UserSecurityProfile } from '@/types/saasOnboarding';

export default function IdentityManagementHub() {
  const { userProfiles, toggleUserLock, forcePasswordReset } = useTenantOnboarding();
  const [searchQuery, setSearchQuery] = useState('');
  const [resetModalData, setResetModalData] = useState<{ user: UserSecurityProfile; temp_password?: string } | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const filteredUsers = userProfiles.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.tenant_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExecutePasswordReset = async (user: UserSecurityProfile) => {
    const tempPassword = await forcePasswordReset(user.id);
    setResetModalData({ user, temp_password: tempPassword });
  };

  const handleCopy = () => {
    if (resetModalData?.temp_password) {
      navigator.clipboard.writeText(resetModalData.temp_password);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            SAAS MASTER ADMIN • IDENTITY & CREDENTIAL MANAGEMENT
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Centre de Gestion des Identités & Comptes</h1>
          <p className="text-xs text-slate-400">
            Contrôlez les statuts de sécurité, verrouillez/déverrouillez les comptes et forcez la réinitialisation des accès.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher utilisateur, e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
          />
        </div>
      </div>

      {/* Users Security Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Utilisateur</th>
                <th className="py-4 px-6">Organisation</th>
                <th className="py-4 px-6">Rôle Attribute</th>
                <th className="py-4 px-6">Statut Sécurité</th>
                <th className="py-4 px-6">Échecs Connexion</th>
                <th className="py-4 px-6 text-right">Actions Sécurité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">{user.full_name}</div>
                    <div className="text-[11px] font-mono text-indigo-400">{user.email}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-300">{user.tenant_name}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-mono text-slate-400">{user.role}</span>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] border ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : user.status === 'FORCE_PASSWORD_CHANGE'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : user.status === 'LOCKED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {user.status === 'ACTIVE' && <UserCheck className="w-3.5 h-3.5" />}
                      {user.status === 'FORCE_PASSWORD_CHANGE' && <KeyRound className="w-3.5 h-3.5" />}
                      {user.status === 'LOCKED' && <Lock className="w-3.5 h-3.5" />}
                      {user.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`font-mono font-bold ${user.failed_login_attempts > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                      {user.failed_login_attempts} / 5
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => toggleUserLock(user.id, user.status)}
                      title={user.status === 'LOCKED' ? 'Déverrouiller le compte' : 'Verrouiller le compte'}
                      className={`p-2 rounded-xl transition-all ${
                        user.status === 'LOCKED'
                          ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                          : 'bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white'
                      }`}
                    >
                      {user.status === 'LOCKED' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleExecutePasswordReset(user)}
                      title="Forcer la réinitialisation du mot de passe"
                      className="p-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Temp Password Generated Modal */}
      {resetModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-400" /> Mot de Passe Temporaire Généré
              </h3>
              <button
                onClick={() => setResetModalData(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                La réinitialisation forcée a été appliquée pour <strong className="text-white">{resetModalData.user.email}</strong>. Le statut du compte est passé à <span className="text-amber-400 font-mono">FORCE_PASSWORD_CHANGE</span>.
              </p>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-500">Nouveau Mot de Passe Temporaire :</span>
                  <div className="text-lg font-mono font-bold text-sky-400 mt-1">{resetModalData.temp_password}</div>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/30"
                >
                  {copiedPassword ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedPassword ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setResetModalData(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
