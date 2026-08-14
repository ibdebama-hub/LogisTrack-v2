'use client';

import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  FileCheck,
  Package,
  Wrench,
  Banknote,
  ShieldCheck,
  Plus,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MissionTemplate, ProofRequirementLevel } from '../../../types/missionTemplate';
import { resolveMissionWorkflowSteps } from '../../../lib/services/missionWorkflowEngine';

interface MissionTemplateEditorProps {
  template: MissionTemplate;
  onSave: (template: Partial<MissionTemplate>) => void;
}

export default function MissionTemplateEditor({ template, onSave }: MissionTemplateEditorProps) {
  const [formData, setFormData] = useState<MissionTemplate>(template);

  const proofItems: Array<{ key: keyof MissionTemplate['proof_config']; label: string }> = [
    { key: 'recipient_signature', label: 'Signature du Destinataire' },
    { key: 'agent_signature', label: 'Signature de l\'Agent' },
    { key: 'single_photo', label: 'Photo Unique de Preuve' },
    { key: 'multi_photo', label: 'Photos Multiples' },
    { key: 'qr_scan', label: 'Scan de QR Code' },
    { key: 'barcode_scan', label: 'Scan de Code-Barres' },
    { key: 'attachment', label: 'Pièce Jointe PDF / Document' },
    { key: 'comment', label: 'Commentaire d\'Exécution' },
    { key: 'gps_coordinates', label: 'Coordonnées GPS Réelles' },
    { key: 'timestamp', label: 'Horodatage Certifié' }
  ];

  const updateProofLevel = (proofKey: keyof MissionTemplate['proof_config'], level: ProofRequirementLevel) => {
    setFormData((prev) => ({
      ...prev,
      proof_config: {
        ...prev.proof_config,
        [proofKey]: level
      }
    }));
  };

  const dynamicWorkflow = resolveMissionWorkflowSteps(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-100 text-xs">
      {/* 1. GENERAL INFORMATION & COD TOGGLE */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Paramètres Généraux du Modèle de Mission</span>
          </h2>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le Modèle</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Nom du Type de Mission
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Code Identifiant
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-indigo-400 font-mono font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Catégorie Métier
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="DISTRIBUTION">Distribution de Plis & Factures</option>
              <option value="ECOMMERCE">Livraison E-Commerce & Colis</option>
              <option value="COURIER">Messagerie & Courrier Express</option>
              <option value="TECHNICAL">Intervention Technique Terrain</option>
              <option value="COLLECTION">Collecte de Documents</option>
            </select>
          </div>
        </div>

        {/* COD ACTIVATION SWITCH */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-bold text-white block text-sm flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-400" />
              <span>Mission avec Encaissement (COD)</span>
            </span>
            <p className="text-[11px] text-slate-400">
              Si désactivé, le module d'encaissement COD est totalement masqué du workflow et de l'interface agent.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, has_cod: !formData.has_cod })}
            className={`px-4 py-2 rounded-xl font-bold border transition-all ${
              formData.has_cod
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            {formData.has_cod ? '🟢 COD ACTIF' : '⚪ SANS COD'}
          </button>
        </div>
      </div>

      {/* 2. PROOF REQUIREMENTS MATRIX */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Matrice des 10 Preuves d'Exécution Configurables</span>
        </h2>

        <div className="space-y-2">
          {proofItems.map((item) => {
            const currentLevel = formData.proof_config[item.key];

            return (
              <div
                key={item.key}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between"
              >
                <span className="font-bold text-slate-200">{item.label}</span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateProofLevel(item.key, 'MANDATORY')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      currentLevel === 'MANDATORY'
                        ? 'bg-rose-950 text-rose-400 border-rose-800 shadow-md'
                        : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    🔴 Obligatoire
                  </button>

                  <button
                    type="button"
                    onClick={() => updateProofLevel(item.key, 'OPTIONAL')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      currentLevel === 'OPTIONAL'
                        ? 'bg-amber-950 text-amber-400 border-amber-800 shadow-md'
                        : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    🟡 Facultatif
                  </button>

                  <button
                    type="button"
                    onClick={() => updateProofLevel(item.key, 'DISABLED')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      currentLevel === 'DISABLED'
                        ? 'bg-slate-900 text-slate-400 border-slate-700 shadow-md'
                        : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    ⚪ Désactivé
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC WORKFLOW PREVIEW */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Prévisualisation Dynamique du Workflow Agent</span>
        </h2>

        <div className="flex items-center gap-2 overflow-x-auto p-3 bg-slate-950 rounded-xl border border-slate-800">
          {dynamicWorkflow.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 min-w-[140px] text-center space-y-1">
                <span className="font-mono text-[10px] text-indigo-400 font-bold block">Étape {idx + 1}</span>
                <span className="font-bold text-white block">{step.name}</span>
              </div>
              {idx < dynamicWorkflow.length - 1 && <span className="text-slate-600 font-bold">➔</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </form>
  );
}
