'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Shield, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { B2BClientUser, B2BClientRole } from '../../../types/b2bClientPortal';

interface ClientUserManagerProps {
  users: B2BClientUser[];
}

export default function ClientUserManager({ users: initialUsers }: ClientUserManagerProps) {
  const [users, setUsers] = useState<B2BClientUser[]>(initialUsers);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<B2BClientRole>('CLIENT_OPS_MANAGER');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    const newUser: B2BClientUser = {
      id: `u-${Date.now()}`,
      client_id: 'cli-cie',
      email,
      full_name: fullName,
      role,
      is_active: true,
      created_at: '2026-08-06'
    };

    setUsers((prev) => [...prev, newUser]);
    setEmail('');
    setFullName('');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: !u.is_active } : u))
    );
  };

  return (
    <div className="space-y-6 text-slate-100 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-400" />
            <span>Gestion des Utilisateurs & Rôles B2B</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administration des comptes d'accès à l'espace donneur d'ordres et attribution des permissions RLS.
          </p>
        </div>
      </div>

      {/* CREATE NEW B2B USER FORM */}
      <form onSubmit={handleCreateUser} className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 text-xs shadow-xl">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>Inviter un Nouveau Collaborateur B2B</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Nom complet du collaborateur..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <input
            type="email"
            placeholder="Adresse e-mail professionnelle..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as B2BClientRole)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium"
          >
            <option value="CLIENT_ADMIN">Administrateur (Complet)</option>
            <option value="CLIENT_OPS_MANAGER">Responsable Opérations</option>
            <option value="CLIENT_SUPERVISOR">Superviseur Terrain</option>
            <option value="CLIENT_ANALYST">Analyste & Rapports</option>
            <option value="CLIENT_READONLY">Consultation Seule</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all ml-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Créer l'Accès B2B</span>
        </button>
      </form>

      {/* B2B USERS TABLE */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th className="p-4">Collaborateur</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rôle RLS</th>
              <th className="p-4">Dernière Connexion</th>
              <th className="p-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-all">
                <td className="p-4 font-bold text-white">{u.full_name}</td>
                <td className="p-4 font-mono text-slate-300">{u.email}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-slate-400 font-mono">{u.last_login_at || 'Jamais connecté'}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-3 py-1 rounded-xl font-bold border flex items-center gap-1.5 ml-auto transition-all ${
                      u.is_active
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border-rose-800'
                    }`}
                  >
                    {u.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{u.is_active ? 'Actif' : 'Désactivé'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
