'use client';

import React, { useState } from 'react';
import {
  Search,
  Building2,
  Users,
  Layers,
  Edit3,
  UserCheck,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  LogIn
} from 'lucide-react';
import { TenantCompany, SubscriptionPlanType, SubscriptionStatus } from '@/types/masterAdmin';

interface TenantListTableProps {
  tenants: TenantCompany[];
  onEditTenant: (tenant: TenantCompany) => void;
  onImpersonate: (tenant: TenantCompany) => void;
  onToggleStatus: (id: string) => void;
}

export default function TenantListTable({
  tenants,
  onEditTenant,
  onImpersonate,
  onToggleStatus
}: TenantListTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('ALL');

  const filteredTenants = tenants.filter(t => {
    const matchesSearch =
      t.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.city.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPlan = true;
    if (planFilter !== 'ALL') {
      matchesPlan = t.plan_type === planFilter;
    }

    return matchesSearch && matchesPlan;
  });

  const getPlanBadge = (plan: SubscriptionPlanType) => {
    switch (plan) {
      case 'ENTERPRISE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            👑 ENTERPRISE
          </span>
        );
      case 'PRO':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            ⭐ PRO
          </span>
        );
      case 'STARTER':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            🚀 STARTER
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            ⏳ TRIAL (14j)
          </span>
        );
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      maximumFractionDigits: 0
    }).format(val).replace('GNF', 'FCFA');
  };

  return (
    <div className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* CONTROL BAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher une entreprise, dirigeant, ville, pays..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
          />
        </div>

        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none cursor-pointer"
        >
          <option value="ALL">Tous les Plans SaaS</option>
          <option value="ENTERPRISE">Plan ENTERPRISE</option>
          <option value="PRO">Plan PRO</option>
          <option value="STARTER">Plan STARTER</option>
          <option value="TRIAL">Plan TRIAL (Essai)</option>
        </select>
      </div>

      {/* TABLE VIEW */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5">Entreprise / Tenant</th>
              <th className="p-3.5">Plan & Tarif</th>
              <th className="p-3.5">Quota Agents Mobilisés</th>
              <th className="p-3.5">Volume Items ce mois</th>
              <th className="p-3.5">Statut Accès</th>
              <th className="p-3.5 text-right">Actions Master</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {filteredTenants.map(t => {
              const agentUsagePct = Math.round((t.active_agents_count / t.max_agents_allowed) * 100);
              const itemsUsagePct = Math.round((t.monthly_items_processed / t.max_items_allowed) * 100);

              return (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div>
                      <span className="font-extrabold text-white text-xs block">{t.company_name}</span>
                      <span className="text-[11px] text-slate-400 block">{t.city}, {t.country} • Dirigeant: {t.owner_name}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="space-y-1">
                      {getPlanBadge(t.plan_type)}
                      <span className="text-[10px] text-slate-400 font-mono block">{formatCurrency(t.monthly_price)} / mois</span>
                    </div>
                  </td>

                  <td className="p-3.5 min-w-[150px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white font-bold">{t.active_agents_count}/{t.max_agents_allowed} agents</span>
                        <span className="text-indigo-400">{agentUsagePct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${agentUsagePct}%` }} />
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 min-w-[150px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white font-bold">{t.monthly_items_processed.toLocaleString('fr-FR')} items</span>
                        <span className="text-amber-400">{itemsUsagePct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${itemsUsagePct}%` }} />
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    {t.status === 'ACTIVE' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIF
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        SUSPENDU
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditTenant(t)}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-violet-600 rounded-xl transition-all"
                        title="Éditer les quotas et l'abonnement"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onImpersonate(t)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white font-bold text-[11px] border border-violet-500/30 transition-all"
                        title="Se connecter en tant que cette entreprise"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Impersonate</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
