'use client';

import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Sparkles, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { Contract, Lead, CommercialProposal } from '../../../../types/crm';
import { ContractService } from '../../../../lib/services/contractService';
import { ProposalService } from '../../../../lib/services/proposalService';
import { CrmService } from '../../../../lib/services/crmService';
import { ProvisioningResult } from '../../../../types/saasOnboarding';

export default function ProposalsContractsManager() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [proposals, setProposals] = useState<CommercialProposal[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [provisionedInfo, setProvisionedInfo] = useState<ProvisioningResult | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const ctrs = await ContractService.fetchContracts();
    const props = await ProposalService.fetchProposals();
    const lds = await CrmService.fetchLeads();
    setContracts(ctrs);
    setProposals(props);
    setLeads(lds);
  };

  const handleSignContract = async (contract: Contract) => {
    const lead = leads.find((l) => l.id === contract.lead_id) || leads[0];
    const { provisioningResult } = await ContractService.signContractAndTriggerOnboarding(contract.id, lead);
    setProvisionedInfo(provisioningResult);
    await loadData();
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit mb-1">
            <FileText className="w-3 h-3" /> DEVIS, PROPOSITIONS & CONTRATS
          </span>
          <h1 className="text-2xl font-black text-white">Registre des Offres & Conversion des Contrats</h1>
          <p className="text-slate-400">Génération de propositions et déclenchement automatique de l'onboarding multi-tenant lors de la signature.</p>
        </div>
      </div>

      {/* PROVISIONING SUCCESS NOTIFICATION */}
      {provisionedInfo && (
        <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-3xl space-y-3 font-mono">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" /> CONTRAT SIGNÉ — WORKFLOW D'ONBOARDING DÉCLENCHÉ AVEC SUCCÈS
          </div>
          <div className="text-xs text-emerald-200">
            L'organisation <strong>{provisionedInfo.tenant_name}</strong> a été provisionnée dans Supabase Auth.<br />
            Compte admin : <strong>{provisionedInfo.admin_email}</strong> | Mot de passe temporaire généré (18 chars) : <strong className="text-sky-300">{provisionedInfo.temp_password}</strong>
          </div>
        </div>
      )}

      {/* CONTRACTS LIST */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono">
        <h3 className="font-bold text-white text-sm font-sans">Contrats en cours & Signature</h3>

        <div className="space-y-3">
          {contracts.map((ctr) => (
            <div key={ctr.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm font-sans">{ctr.contract_number}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                    {ctr.status}
                  </span>
                </div>
                <div className="text-slate-400 text-xs mt-1">
                  Plan : <strong className="text-white">{ctr.plan_code}</strong> • Valeur : {ctr.annual_value.toLocaleString('fr-FR')} XOF / an
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSignContract(ctr)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all text-xs"
                >
                  <Sparkles className="w-4 h-4" /> Valider Contrat & Déclencher Onboarding
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
