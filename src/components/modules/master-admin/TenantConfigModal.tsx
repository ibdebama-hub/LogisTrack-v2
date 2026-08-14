'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Gem, CheckCircle2, ShieldAlert, Key, DollarSign } from 'lucide-react';
import { TenantCompany, SubscriptionPlanType, SubscriptionStatus, BillingCycle } from '../../../types/masterAdmin';

interface TenantConfigModalProps {
  isOpen: boolean;
  tenantToEdit: TenantCompany | null;
  onClose: () => void;
  onSave: (tenantData: Partial<TenantCompany>) => void;
}

export default function TenantConfigModal({
  isOpen,
  tenantToEdit,
  onClose,
  onSave
}: TenantConfigModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [planType, setPlanType] = useState<SubscriptionPlanType>('PRO');
  const [status, setStatus] = useState<SubscriptionStatus>('ACTIVE');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [monthlyPrice, setMonthlyPrice] = useState(350000);
  const [maxAgentsAllowed, setMaxAgentsAllowed] = useState(25);
  const [maxItemsAllowed, setMaxItemsAllowed] = useState(50000);
  const [isPayAsYouGo, setIsPayAsYouGo] = useState(true);

  useEffect(() => {
    if (tenantToEdit) {
      setCompanyName(tenantToEdit.company_name);
      setPlanType(tenantToEdit.plan_type);
      setStatus(tenantToEdit.status);
      setBillingCycle(tenantToEdit.billing_cycle);
      setMonthlyPrice(tenantToEdit.monthly_price);
      setMaxAgentsAllowed(tenantToEdit.max_agents_allowed);
      setMaxItemsAllowed(tenantToEdit.max_items_allowed);
      setIsPayAsYouGo(tenantToEdit.is_pay_as_you_go);
    }
  }, [tenantToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantToEdit) return;

    onSave({
      id: tenantToEdit.id,
      company_name: companyName,
      plan_type: planType,
      status,
      billing_cycle: billingCycle,
      monthly_price: monthlyPrice,
      max_agents_allowed: maxAgentsAllowed,
      max_items_allowed: maxItemsAllowed,
      is_pay_as_you_go: isPayAsYouGo
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-violet-900/40 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Abonnement & Quotas : {companyName}</h3>
              <p className="text-xs text-slate-400">Configuration des limites et conditions tarifaires du tenant</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Plan d'Abonnement</label>
              <select
                value={planType}
                onChange={e => setPlanType(e.target.value as SubscriptionPlanType)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-violet-500"
              >
                <option value="TRIAL">Plan ESSAI / TRIAL (Gratuit 14j)</option>
                <option value="STARTER">Plan STARTER (Petites structures)</option>
                <option value="PRO">Plan PRO (Moyennes entreprises)</option>
                <option value="ENTERPRISE">Plan ENTERPRISE (Sur-mesure)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Statut d'Accès SaaS</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as SubscriptionStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-violet-500"
              >
                <option value="ACTIVE">ACTIF (Accès complet)</option>
                <option value="PAST_DUE">IMPAYÉ / PAST DUE (Relance)</option>
                <option value="SUSPENDED">SUSPENDU (Bloqué)</option>
                <option value="CANCELED">ANNULÉ / CANCELED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Tarif Mensuel (FCFA)</label>
              <input
                type="number"
                value={monthlyPrice}
                onChange={e => setMonthlyPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Quota Max Agents</label>
              <input
                type="number"
                value={maxAgentsAllowed}
                onChange={e => setMaxAgentsAllowed(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Quota Plis/Mois</label>
              <input
                type="number"
                value={maxItemsAllowed}
                onChange={e => setMaxItemsAllowed(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Activer Facturation à la Consommation (Pay-As-You-Go)</span>
              <span className="text-[10px] text-slate-400">Facturation au pli/facture supplémentaire au-delà du quota</span>
            </div>
            <input
              type="checkbox"
              checked={isPayAsYouGo}
              onChange={e => setIsPayAsYouGo(e.target.checked)}
              className="w-4 h-4 rounded text-violet-600 focus:ring-0 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-600/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Enregistrer Quotas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
