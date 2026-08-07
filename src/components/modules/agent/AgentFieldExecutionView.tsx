'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  Package,
  Camera,
  CheckCircle2,
  Banknote,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MissionTemplate } from '@/types/missionTemplate';
import { resolveMissionWorkflowSteps } from '@/lib/services/missionWorkflowEngine';
import { validateMissionExecutionProof } from '@/lib/services/missionValidationEngine';

interface AgentFieldExecutionViewProps {
  template: MissionTemplate;
  missionNumber: string;
  recipientName: string;
  addressRaw: string;
  onComplete: () => void;
}

export default function AgentFieldExecutionView({
  template,
  missionNumber,
  recipientName,
  addressRaw,
  onComplete
}: AgentFieldExecutionViewProps) {
  const workflowSteps = resolveMissionWorkflowSteps(template);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Execution state
  const [hasRecipientSig, setHasRecipientSig] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [hasComment, setHasComment] = useState(false);
  const [codCollected, setCodCollected] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentStep = workflowSteps[currentStepIdx];

  const handleNextStep = () => {
    setErrorMessage(null);

    // If current step is PROOF_CAPTURE, validate mandatory proof requirements
    if (currentStep.type === 'PROOF_CAPTURE') {
      const validation = validateMissionExecutionProof(template, {
        has_recipient_signature: hasRecipientSig,
        photo_count: photoCount,
        has_comment: hasComment,
        has_gps: true
      });

      if (!validation.is_valid) {
        setErrorMessage(`Preuve(s) obligatoire(s) manquante(s) : ${validation.missing_proofs.join(', ')}`);
        return;
      }
    }

    if (currentStepIdx < workflowSteps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-950 p-4 space-y-4 text-slate-100 text-xs">
      {/* HEADER CARD WITH TEMPLATE BADGE */}
      <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-2 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="font-mono text-indigo-400 font-bold">{missionNumber}</span>
          <span
            className="px-2.5 py-0.5 rounded-full font-bold text-[10px] text-white border"
            style={{ backgroundColor: `${template.color_hex}20`, borderColor: template.color_hex }}
          >
            {template.name}
          </span>
        </div>
        <h2 className="text-sm font-black text-white">{recipientName}</h2>
        <p className="text-slate-400 text-[11px] truncate">{addressRaw}</p>
      </div>

      {/* WORKFLOW STEP INDICATOR */}
      <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Étape {currentStepIdx + 1} / {workflowSteps.length}</span>
        <span className="font-bold text-emerald-400">{currentStep.name}</span>
      </div>

      {/* ERROR MESSAGE IF MANDATORY PROOF MISSING */}
      {errorMessage && (
        <div className="p-3 bg-rose-950 border border-rose-800 text-rose-300 rounded-xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP CONTENT RENDERER */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl min-h-[220px] flex flex-col justify-center">
        {/* START STEP */}
        {currentStep.type === 'START' && (
          <div className="text-center space-y-2">
            <Package className="w-10 h-10 text-indigo-400 mx-auto" />
            <h3 className="font-bold text-white text-sm">Prise en Charge sur le Terrain</h3>
            <p className="text-slate-400 text-[11px]">
              Vérifiez les informations du destinataire avant d'entamer la collecte des preuves.
            </p>
          </div>
        )}

        {/* PROOF CAPTURE STEP */}
        {currentStep.type === 'PROOF_CAPTURE' && (
          <div className="space-y-3">
            {template.proof_config.recipient_signature !== 'DISABLED' && (
              <button
                onClick={() => setHasRecipientSig(true)}
                className={`w-full p-3 rounded-xl border font-bold flex items-center justify-between ${
                  hasRecipientSig ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <span>Signature Destinataire</span>
                {hasRecipientSig ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span>Capturer</span>}
              </button>
            )}

            {(template.proof_config.single_photo !== 'DISABLED' || template.proof_config.multi_photo !== 'DISABLED') && (
              <button
                onClick={() => setPhotoCount(photoCount + 1)}
                className={`w-full p-3 rounded-xl border font-bold flex items-center justify-between ${
                  photoCount > 0 ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <span>Photos de Preuve ({photoCount})</span>
                <Camera className="w-4 h-4 text-indigo-400" />
              </button>
            )}
          </div>
        )}

        {/* COD COLLECTION STEP (ONLY RENDERED IF HAS_COD = TRUE) */}
        {currentStep.type === 'COD_COLLECTION' && template.has_cod && (
          <div className="space-y-3 text-center">
            <Banknote className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-sm">Encaissement COD Exigé</h3>
            <input
              type="number"
              placeholder="Montant encaissé en XOF..."
              value={codCollected || ''}
              onChange={(e) => setCodCollected(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-center text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* COMPLETE STEP */}
        {currentStep.type === 'COMPLETE' && (
          <div className="text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-sm">Prêt à Clôturer</h3>
            <p className="text-slate-400 text-[11px]">
              Toutes les étapes requises par le modèle <strong className="text-white">{template.name}</strong> sont validées.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER BUTTON */}
      <button
        onClick={handleNextStep}
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 text-xs transition-all"
      >
        <span>{currentStepIdx < workflowSteps.length - 1 ? 'Continuer' : 'Clôturer la Mission'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
