'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  XCircle,
  RefreshCw,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Search,
  Copy,
  Check,
  X
} from 'lucide-react';
import { useTenantOnboarding } from '../../../../hooks/useTenantOnboarding';
import { InvitationService } from '../../../../lib/services/invitationService';
import { TenantInvitation } from '../../../../types/saasOnboarding';

export default function InvitationsManager() {
  const { invitations, resendInvitation, cancelInvitation } = useTenantOnboarding();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvitation, setSelectedInvitation] = useState<TenantInvitation | null>(null);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string | null>(null);

  const filteredInvitations = invitations.filter(
    (inv) =>
      inv.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.first_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPreview = (inv: TenantInvitation) => {
    setSelectedInvitation(inv);
    const html = InvitationService.generateInvitationEmailHtml({
      client_name: inv.tenant_name,
      admin_name: `${inv.first_name} ${inv.last_name}`,
      email: inv.email,
      temp_password: inv.temp_password || '••••••••••••••••',
      activation_url: `http://localhost:3000/verify/first-login?token=${inv.invitation_token}`,
      expires_at: inv.expires_at
    });
    setEmailPreviewHtml(html);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            SAAS MASTER ADMIN • GESTION DES ACCÈS
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Registre des Invitations d&apos;Onboarding</h1>
          <p className="text-xs text-slate-400">
            Suivez l&apos;état des invitations transmises, renvoyez les accès expirés ou modifiez les jetons d&apos;activation.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par client, e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
          />
        </div>
      </div>

      {/* Invitations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Organisation</th>
                <th className="py-4 px-6">Administrateur Destinataire</th>
                <th className="py-4 px-6">Statut Invitation</th>
                <th className="py-4 px-6">Jeton / Expiration</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredInvitations.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">{inv.tenant_name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{inv.tenant_id}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-200">{inv.first_name} {inv.last_name}</div>
                    <div className="text-[11px] font-mono text-indigo-400">{inv.email}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] border ${
                        inv.status === 'ACCEPTED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : inv.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : inv.status === 'EXPIRED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {inv.status === 'ACCEPTED' && <CheckCircle2 className="w-3 h-3" />}
                      {inv.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {inv.status === 'EXPIRED' && <AlertTriangle className="w-3 h-3" />}
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-mono text-slate-400 truncate max-w-[140px]">{inv.invitation_token}</div>
                    <div className="text-[10px] text-slate-500">Exp: {new Date(inv.expires_at).toLocaleDateString('fr-FR')}</div>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenPreview(inv)}
                      title="Aperçu E-mail HTML"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {inv.status !== 'ACCEPTED' && (
                      <>
                        <button
                          onClick={() => resendInvitation(inv.id)}
                          title="Renvoyer l'invitation"
                          className="p-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl transition-all"
                        >
                          <Send className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => cancelInvitation(inv.id)}
                          title="Annuler l'invitation"
                          className="p-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HTML Email Preview Modal */}
      {emailPreviewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" /> Prévisualisation du Modèle d&apos;E-mail Transmis
              </h3>
              <button
                onClick={() => setEmailPreviewHtml(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <iframe
                srcDoc={emailPreviewHtml}
                title="Email Preview"
                className="w-full h-[450px] border-0 rounded-2xl bg-slate-950"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
