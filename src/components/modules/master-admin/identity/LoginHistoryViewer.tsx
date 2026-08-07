'use client';

import React, { useState } from 'react';
import {
  Shield,
  Search,
  Globe,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react';
import { useTenantOnboarding } from '@/hooks/useTenantOnboarding';

export default function LoginHistoryViewer() {
  const { loginLogs } = useTenantOnboarding();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = loginLogs.filter((log) => {
    const matchesSearch =
      log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.tenant_name && log.tenant_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.ip_address.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            SAAS MASTER ADMIN • AUDIT DE SÉCURITÉ
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Journal des Connexions & Tentatives d&apos;Accès</h1>
          <p className="text-xs text-slate-400">
            Historique temps réel des accès utilisateurs avec traçabilité IP, navigateur, appareil et géolocalisation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Tous les Statuts</option>
            <option value="SUCCESS">Succès (SUCCESS)</option>
            <option value="FAILED_PASSWORD">Échecs Mdp (FAILED_PASSWORD)</option>
            <option value="EXPIRED_TEMP_PASSWORD">Mdp Expiré (EXPIRED)</option>
          </select>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher par IP, e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Horodatage</th>
                <th className="py-4 px-6">Utilisateur & Organisation</th>
                <th className="py-4 px-6">Adresse IP & Pays</th>
                <th className="py-4 px-6">Appareil & Navigateur</th>
                <th className="py-4 px-6">Résultat & Motif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono text-slate-400">
                    {new Date(log.created_at).toLocaleString('fr-FR')}
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-bold text-white">{log.email}</div>
                    <div className="text-[11px] text-slate-400">{log.tenant_name || 'System / Direct'}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-mono text-indigo-400 font-bold">{log.ip_address}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3 text-slate-500" /> {log.country}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="text-slate-300 font-semibold">{log.device_type}</div>
                    <div className="text-[11px] text-slate-500">{log.browser}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] border ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {log.status === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {log.status}
                    </span>
                    {log.failure_reason && (
                      <div className="text-[11px] text-rose-400 mt-1">{log.failure_reason}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
