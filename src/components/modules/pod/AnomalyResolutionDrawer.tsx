'use client';

import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  RotateCcw,
  UserPlus,
  FileArchive,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Send,
  Building,
  Info
} from 'lucide-react';
import { PoDItem } from '@/types/podValidation';

interface AnomalyResolutionDrawerProps {
  item: PoDItem | null;
  onClose: () => void;
  onResolveReassign: (itemId: string, newAgentName: string, correctiveNote: string) => void;
  onResolveNpai: (itemId: string, npaiReason: string) => void;
}

export default function AnomalyResolutionDrawer({
  item,
  onClose,
  onResolveReassign,
  onResolveNpai
}: AnomalyResolutionDrawerProps) {
  const [selectedAgent, setSelectedAgent] = useState('Mamadou Diallo (Kaloum)');
  const [correctiveNote, setCorrectiveNote] = useState('');
  const [npaiReason, setNpaiReason] = useState('Client introuvable après 3 tentatives');

  if (!item) return null;

  const handleReassign = (e: React.FormEvent) => {
    e.preventDefault();
    onResolveReassign(item.id, selectedAgent, correctiveNote);
    onClose();
  };

  const handleNpai = () => {
    onResolveNpai(item.id, npaiReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* HEADER */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Traitement d'Anomalie Terrain</h3>
                <span className="text-xs text-slate-400 font-mono">N° Suivi: {item.tracking_number}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BODY SCROLLABLE */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* ANOMALY DETAILS SUMMARY CARD */}
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                  Motif d'Échec Signalé
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.anomaly_reason || 'CLIENT_ABSENT'}
                </span>
              </div>

              <div className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 font-semibold block mb-0.5">Note de l'agent ({item.agent_name}):</span>
                <p className="italic">"{item.anomaly_notes || 'Aucun commentaire supplémentaire'}"</p>
              </div>

              {item.anomaly_photo_url && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Photo de Justification Terrain</span>
                  <div className="bg-slate-900 rounded-xl p-2 border border-slate-800 flex items-center justify-center">
                    <img
                      src={item.anomaly_photo_url}
                      alt="Photo de justification d'échec"
                      className="max-h-[140px] w-auto object-contain rounded-lg shadow"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RECIPIENT & CLIENT CONTEXT */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Client Donneur d'Ordre:</span>
                <span className="font-bold text-white">{item.client_name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Destinataire:</span>
                <span className="font-bold text-white">{item.recipient_name} ({item.recipient_phone})</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Adresse Théorique:</span>
                <span className="font-semibold text-slate-300">{item.recipient_address}</span>
              </div>
            </div>

            {/* RESOLUTION WORKFLOW FORM */}
            <form onSubmit={handleReassign} className="space-y-6 pt-2">
              <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Option 1: Réassigner & Reprogrammer
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Nouveau Livreur Affecté</label>
                  <select
                    value={selectedAgent}
                    onChange={e => setSelectedAgent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Mamadou Diallo (Kaloum)">Mamadou Diallo (Kaloum Centre-Ville)</option>
                    <option value="Koffi Jean-Baptiste (Cocody)">Koffi Jean-Baptiste (Cocody & Riviera)</option>
                    <option value="Fatoumata Binta Camara (Dixinn)">Fatoumata Binta Camara (Dixinn & Landréah)</option>
                    <option value="Ibrahima Keita (Ratoma)">Ibrahima Keita (Ratoma & Kipé)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Note Corrective / Précision d'Adresse</label>
                  <textarea
                    rows={3}
                    value={correctiveNote}
                    onChange={e => setCorrectiveNote(e.target.value)}
                    placeholder="Ex: Numéro de téléphone secondaire vérifié avec le client, repère à côté de la boulangerie..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Réassigner à la Tournée Demain</span>
                </button>
              </div>

              <hr className="border-slate-800/80" />

              {/* OPTION 2: CLASSMENT NPAI */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileArchive className="w-3.5 h-3.5" /> Option 2: Classer en NPAI (Retour Donneur d'Ordre)
                </h4>

                <p className="text-xs text-slate-400">
                  Si le pli/colis ne peut définitivement pas être remis, il est certifié en NPAI (*N'Habite Pas à l'Adresse Indiquée*) et clôturé pour le rapport de bordereau client.
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleNpai}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-rose-800 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <FileArchive className="w-4 h-4" />
                    <span>Valider Clôture NPAI</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
