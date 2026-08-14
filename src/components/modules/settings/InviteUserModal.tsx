'use client';

import React, { useState } from 'react';
import { X, UserPlus, Mail, Phone, ShieldCheck, MapPin, Key } from 'lucide-react';
import { SystemUser, UserSystemRole } from '../../../types/settings';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (newUser: Partial<SystemUser>) => void;
}

export default function InviteUserModal({
  isOpen,
  onClose,
  onInvite
}: InviteUserModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserSystemRole>('DISPATCHER');
  const [zone, setZone] = useState('Kaloum Centre-Ville');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    onInvite({
      full_name: fullName,
      email,
      phone: phone || '+224 620 00 00 00',
      role,
      status: 'ACTIF',
      last_login: 'Nouveau',
      zone_assigned: zone
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Inviter un Collaborateur</h3>
              <p className="text-xs text-slate-400">Création de compte et envoi des identifiants d'accès</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nom & Prénom <span className="text-rose-400">*</span></label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Ex: Amadou Diallo"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email professionnel <span className="text-rose-400">*</span></label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="a.diallo@logistrack.gn"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Numéro Téléphone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+224 620 00 00 00"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Rôle Attribué</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserSystemRole)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="ADMINISTRATEUR">ADMINISTRATEUR (Accès total)</option>
                <option value="DISPATCHER">DISPATCHER (Opérations)</option>
                <option value="CAISSIER">CAISSIER (Décharges COD)</option>
                <option value="CHEF_DE_ZONE">CHEF DE ZONE (Supervision)</option>
                <option value="AGENT_TERRAIN">AGENT TERRAIN (PWA Mobile)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Zone d'Affectation</label>
              <input
                type="text"
                value={zone}
                onChange={e => setZone(e.target.value)}
                placeholder="Ex: Kaloum / Siège"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 text-[11px]">
            📌 Un email contenant le lien de première connexion et le mot de passe temporaire sera transmis à l'adresse renseignée.
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Envoyer l'Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
