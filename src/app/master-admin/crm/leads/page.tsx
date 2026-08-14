'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Eye, Search } from 'lucide-react';
import { Lead } from '../../../../types/crm';
import { CrmService } from '../../../../lib/services/crmService';
import LeadDetailsDrawerModal from '../../../../components/modules/master-admin/crm/LeadDetailsDrawerModal';

export default function MasterCrmLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    CrmService.fetchLeads().then(setLeads);
  }, []);

  const handleOpenDrawer = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 w-fit mb-1">
            <Users className="w-3 h-3" /> REGISTRE DES PROSPECTS & QUALIFICATION
          </span>
          <h1 className="text-2xl font-black text-white">Registre Complet des Prospects Commercial</h1>
          <p className="text-slate-400">Fiches détaillées, score de qualification, estimation de flotte et historique d'échanges.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par entreprise, contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-500 font-mono text-xs"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-white text-sm font-sans">{lead.company_name}</h4>
              <div className="text-slate-400 text-xs mt-0.5">
                Contact: <strong className="text-white">{lead.contact_name}</strong> ({lead.contact_email}) • {lead.country}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full font-bold text-xs">
                Score: {lead.qualification_score}/100
              </span>
              <button
                onClick={() => handleOpenDrawer(lead)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center gap-1 font-sans text-xs"
              >
                <Eye className="w-3.5 h-3.5" /> Fiche Prospect
              </button>
            </div>
          </div>
        ))}
      </div>

      <LeadDetailsDrawerModal
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
}
