'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  UserCheck,
  UserX,
  Key,
  ShieldAlert
} from 'lucide-react';
import { SystemUser, UserSystemRole } from '@/types/settings';

interface UserRolesManagementProps {
  users: SystemUser[];
  onToggleUserStatus: (userId: string) => void;
  onOpenInviteModal: () => void;
}

export default function UserRolesManagement({
  users,
  onToggleUserStatus,
  onOpenInviteModal
}: UserRolesManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    let matchesRole = true;
    if (roleFilter !== 'ALL') matchesRole = u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserSystemRole) => {
    switch (role) {
      case 'ADMINISTRATEUR':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            ADMINISTRATEUR
          </span>
        );
      case 'DISPATCHER':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            DISPATCHER
          </span>
        );
      case 'CAISSIER':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            CAISSIER
          </span>
        );
      case 'CHEF_DE_ZONE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            CHEF DE ZONE
          </span>
        );
      case 'AGENT_TERRAIN':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            AGENT TERRAIN PWA
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. USERS TABLE & CONTROLS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Gestion des Utilisateurs & Droits d'Accès
            </h3>
            <p className="text-xs text-slate-400">
              Contrôle des comptes employés, rôles RBAC et droits de connexion à la console et à l'application PWA.
            </p>
          </div>

          <button
            onClick={onOpenInviteModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Inviter un Collaborateur</span>
          </button>
        </div>

        {/* SEARCH & ROLE FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher nom, email, téléphone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Tous les Rôles</option>
            <option value="ADMINISTRATEUR">Administrateur</option>
            <option value="DISPATCHER">Dispatcher</option>
            <option value="CAISSIER">Caissier</option>
            <option value="CHEF_DE_ZONE">Chef de Zone</option>
            <option value="AGENT_TERRAIN">Agent Terrain PWA</option>
          </select>
        </div>

        {/* USERS TABLE */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Collaborateur</th>
                <th className="p-3.5">Rôle Système</th>
                <th className="p-3.5">Zone Assignée</th>
                <th className="p-3.5">Dernière Connexion</th>
                <th className="p-3.5">Statut Compte</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* USER INFO */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 font-bold text-indigo-400 text-xs flex items-center justify-center">
                        {u.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{u.full_name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{u.email} ({u.phone})</span>
                      </div>
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="p-3.5">{getRoleBadge(u.role)}</td>

                  {/* ZONE */}
                  <td className="p-3.5 font-mono text-slate-300">{u.zone_assigned || 'Général'}</td>

                  {/* LAST LOGIN */}
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{u.last_login}</td>

                  {/* STATUS */}
                  <td className="p-3.5">
                    {u.status === 'ACTIF' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIF
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        SUSPENDU
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onToggleUserStatus(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                        u.status === 'ACTIF'
                          ? 'bg-rose-950/40 text-rose-400 hover:bg-rose-900 border border-rose-800'
                          : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900 border border-emerald-800'
                      }`}
                    >
                      {u.status === 'ACTIF' ? 'Suspendre' : 'Réactiver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. PERMISSION MATRIX DISPLAY */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Matrice des Droits et Habilitations par Rôle
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-indigo-400 block">ADMINISTRATEUR</span>
            <p className="text-slate-400 text-[11px]">Accès complet : Configuration globale, passerelles SMS, facturation, réconciliation et utilisateurs.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 block">DISPATCHER</span>
            <p className="text-slate-400 text-[11px]">Accès aux opérations : Importations, lotissement, carte GPS live, affectations livreurs et audit PoD.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 block">CAISSIER</span>
            <p className="text-slate-400 text-[11px]">Accès restreint aux modules financiers : Guichet de décharge COD et réconciliation caisse terrain.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
