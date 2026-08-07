'use client';

import React, { useState } from 'react';
import {
  Building2,
  X,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Tag,
  Palette,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { Client, OperationType } from '../../../types/logistrack';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: Client) => void;
}

export default function CreateClientModal({
  isOpen,
  onClose,
  onClientCreated
}: CreateClientModalProps) {
  // Section 1: General Info
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sector, setSector] = useState<'finance' | 'telecom' | 'energy' | 'government' | 'ecommerce' | 'other'>('finance');
  const [color, setColor] = useState('#4F46E5');

  // Section 2: Contact Details
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');

  // Section 3: Default Operations Configuration
  const [defaultOpType, setDefaultOpType] = useState<OperationType>('MASS_INVOICE_DISTRIBUTION');
  const [defaultDeadlineDays, setDefaultDeadlineDays] = useState<number>(7);

  if (!isOpen) return null;

  // Auto-generate code when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    if (!code || code === name.substring(0, 3).toUpperCase()) {
      setCode(val.replaceAll(/\s+/g, '').substring(0, 4).toUpperCase());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      organization_id: 'org-1',
      name,
      code: code.toUpperCase(),
      contact_email: contactEmail || 'contact@client.com',
      contact_phone: contactPhone || '+225 00 00 00 00',
      contract_type: sector === 'ecommerce' ? 'ecommerce_merchant' : 'corporate_key_account',
      color: color || '#4F46E5',
      active_campaigns_count: 1
    };

    onClientCreated(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-800 p-6 space-y-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Créer un Nouveau Client Donneur d&apos;Ordre</h2>
              <p className="text-xs text-slate-400">Ajout instantané de banques, télécoms, sociétés d&apos;énergie ou commerçants</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* SECTION 1: INFORMATIONS GÉNÉRALES */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> 1. Informations Générales du Client
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-slate-300 font-medium block mb-1">Raison Sociale / Nom du Client *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Banque Atlantique, EDM SA, Orange Mali"
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Code Client / Sigle *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: BDA, EDM, OMA"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Secteur d&apos;Activité :</label>
                <select
                  value={sector}
                  onChange={e => setSector(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="finance">Banque, Assurance & Finance</option>
                  <option value="telecom">Télécommunications & Fournisseur Internet</option>
                  <option value="energy">Énergie & Eau (EDM, CIE, SODECI)</option>
                  <option value="government">État, Administration & Justice</option>
                  <option value="ecommerce">E-Commerce & Distribution Fret</option>
                  <option value="other">Autre Entreprise Privée</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Couleur Distinctive (Dashboard / Cartes) :</label>
                <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-xl border border-slate-700">
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-8 h-7 bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-slate-200 font-bold">{color}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACTS & FACTURATION */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4" /> 2. Contacts & Reporting PoD Automatique
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Nom du Contact Référent :</label>
                <input
                  type="text"
                  placeholder="ex: M. Diallo Ibrahim (Directeur Ops)"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Email (Rapports Décharge Automatiques) :</label>
                <input
                  type="email"
                  placeholder="ex: direction.ops@client.com"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Téléphone Direct :</label>
                <input
                  type="text"
                  placeholder="ex: +225 07 08 09 10 11"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: CONFIGURATION OPÉRATIONNELLE */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" /> 3. Configuration Opérationnelle par Défaut
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Type d&apos;Opération Principal :</label>
                <select
                  value={defaultOpType}
                  onChange={e => setDefaultOpType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="MASS_INVOICE_DISTRIBUTION">Factures Grand Volume (Sans Encaissement)</option>
                  <option value="CONFIDENTIAL_MAIL">Plis Confidentiels / Chéquiers (Signature stricte)</option>
                  <option value="PARCEL_DELIVERY_COD">Colis E-Commerce (Cash on Delivery)</option>
                  <option value="EXPRESS_COURIER">Courriers Simples / Express</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Échéance par Défaut des Campagnes (Jours) :</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={defaultDeadlineDays}
                  onChange={e => setDefaultDeadlineDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Enregistrer le Client Donneur d&apos;Ordre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
