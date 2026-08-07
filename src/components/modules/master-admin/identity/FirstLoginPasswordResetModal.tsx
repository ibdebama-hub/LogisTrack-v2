'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { CredentialService } from '@/lib/services/credentialService';

interface FirstLoginPasswordResetModalProps {
  userEmail: string;
  onSuccess: () => void;
}

export default function FirstLoginPasswordResetModal({
  userEmail,
  onSuccess
}: FirstLoginPasswordResetModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errorList, setErrorList] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorList([]);

    if (newPassword !== confirmPassword) {
      setErrorList(['La confirmation ne correspond pas au nouveau mot de passe.']);
      return;
    }

    const { valid, errors } = CredentialService.validatePasswordComplexity(newPassword);
    if (!valid) {
      setErrorList(errors);
      return;
    }

    if (!acceptTerms) {
      setErrorList(['Vous devez accepter les conditions générales d\'utilisation.']);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              PREMIÈRE CONNEXION SÉCURISÉE OBLIGATOIRE
            </span>
            <h2 className="text-xl font-bold text-white">Changement de Mot de Passe</h2>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Vous utilisez un mot de passe temporaire pour le compte <strong className="text-white">{userEmail}</strong>. Veuillez définir votre mot de passe définitif pour accéder à la plateforme.
        </p>

        {errorList.length > 0 && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl space-y-1">
            {errorList.map((err, idx) => (
              <div key={idx} className="text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Mot de passe temporaire actuel *</label>
            <input
              type="password"
              required
              placeholder="••••••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Nouveau mot de passe personnalisé (min 16 chars) *</label>
            <input
              type="password"
              required
              placeholder="••••••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Confirmer le nouveau mot de passe *</label>
            <input
              type="password"
              required
              placeholder="••••••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="cgu"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500"
            />
            <label htmlFor="cgu" className="text-xs text-slate-400">
              J&apos;accepte les <span className="text-indigo-400 underline">Conditions Générales d&apos;Utilisation</span> et la charte de sécurité SaaS.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Validation et mise à jour en cours...</span>
            ) : (
              <>
                <span>Activer Mon Compte & Accéder</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
