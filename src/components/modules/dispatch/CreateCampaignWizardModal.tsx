'use client';

import React, { useState } from 'react';
import {
  X,
  Layers,
  Building2,
  Calendar,
  User,
  Target,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { OperationType } from '../../../types/logistrack';
import { LotPriority } from '../../../types/missionControl';

interface CreateCampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCampaign: (campaignData: any) => void;
}

const CLIENT_OPTIONS = [
  { id: 'cli-cie', name: 'CIE Électricité', code: 'CIE' },
  { id: 'cli-sodeci', name: 'SODECI Eau', code: 'SOD' },
  { id: 'cli-orange', name: 'Orange Côte d\'Ivoire', code: 'ORA' },
  { id: 'cli-bdm', name: 'Banque de Développement du Mali (BDM)', code: 'BDM' },
  { id: 'cli-jumia', name: 'Jumia Express', code: 'JUM' },
];

export default function CreateCampaignWizardModal({
  isOpen,
  onClose,
  onCreateCampaign
}: CreateCampaignWizardModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [clientId, setClientId] = useState('cli-cie');
  const [name, setName] = useState('');
  const [operationType, setOperationType] = useState<OperationType>('MASS_INVOICE_DISTRIBUTION');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<LotPriority>('HAUTE');
  const [startDate, setStartDate] = useState('2026-08-10');
  const [dueDate, setDueDate] = useState('2026-08-25');
  const [responsibleName, setResponsibleName] = useState('Yves Touré (Dispatcher)');
  const [targetItemsCount, setTargetItemsCount] = useState<number>(1250);

  if (!isOpen) return null;

  const handleNext = () => {
    if (!name.trim()) {
      alert('Veuillez saisir le nom de la campagne.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedClient = CLIENT_OPTIONS.find((c) => c.id === clientId) || CLIENT_OPTIONS[0];
    const generatedReference = `CAMP-${selectedClient.code}-2026-${Math.floor(Math.random() * 900 + 100)}`;
    const generatedId = `cmp-${Date.now()}`;

    const newCampaign = {
      id: generatedId,
      reference: generatedReference,
      name,
      client_id: selectedClient.id,
      client_name: selectedClient.name,
      client_code: selectedClient.code,
      operation_type: operationType,
      description,
      priority,
      total_items: Number(targetItemsCount) || 1000,
      delivered_items: 0,
      failed_items: 0,
      in_progress_items: 0,
      unassigned_items: Number(targetItemsCount) || 1000,
      start_date: startDate,
      due_date: dueDate,
      responsible_name: responsibleName,
      status: 'PLANIFIÉE',
      created_at: new Date().toISOString(),
      creator: responsibleName
    };

    onCreateCampaign(newCampaign);
    onClose();
    setStep(1);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-600/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Assistant de Création de Campagne</h2>
              <span className="text-xs text-slate-400">Étape {step} sur 2 • Paramétrage de la Mission</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="px-6">
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex border border-slate-800">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 space-y-4">
          {step === 1 ? (
            /* STEP 1: Basic Campaign Info */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold block">Client Donneur d'Ordre *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CLIENT_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold block">Type de Mission *</label>
                  <select
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value as OperationType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="MASS_INVOICE_DISTRIBUTION">Distribution Massive de Factures</option>
                    <option value="CONFIDENTIAL_MAIL">Courriers Confidentiels & Relevés</option>
                    <option value="PARCEL_DELIVERY_COD">Livraison Colis avec Encaissement COD</option>
                    <option value="EXPRESS_COURIER">Courses Express / Plis Urgents</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold block">Nom de la Campagne *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Campagne Factures CIE Abidjan Nord - Août 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold block">Description & Instructions Opérationnelles</label>
                <textarea
                  rows={2}
                  placeholder="Consignes particulières, créneaux horaires, repères visuels recommandés..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold block">Niveau de Priorité</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as LotPriority)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="URGENTE">🔴 Urgente (Traitement prioritaire 24h)</option>
                    <option value="HAUTE">🟠 Haute (Traitement 48h)</option>
                    <option value="NORMALE">🔵 Normale (Standard 5 jours)</option>
                    <option value="BASSE">⚪ Basse</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold block">Objectif (Nombre estimé de plis)</label>
                  <input
                    type="number"
                    value={targetItemsCount}
                    onChange={(e) => setTargetItemsCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: Planning & Responsable */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold block">Date de Début *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold block">Date d'Échéance *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold block">Responsable Opérationnel</label>
                <input
                  type="text"
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Summary Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-indigo-400">Récapitulatif de la Campagne :</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Nom : <strong>{name}</strong></div>
                  <div>Client : <strong>{CLIENT_OPTIONS.find(c => c.id === clientId)?.name}</strong></div>
                  <div>Priorité : <strong>{priority}</strong></div>
                  <div>Objectif : <strong>{targetItemsCount} missions</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800"
              >
                Retour
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800"
              >
                Annuler
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
              >
                <span>Suivant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Créer la Campagne</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
