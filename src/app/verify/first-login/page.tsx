'use client';

import React, { useState } from 'react';
import FirstLoginPasswordResetModal from '../../../components/modules/master-admin/identity/FirstLoginPasswordResetModal';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FirstLoginPage() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSuccess = () => {
    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {!isCompleted ? (
        <FirstLoginPasswordResetModal
          userEmail="m.keita@bamako-express.ml"
          onSuccess={handleSuccess}
        />
      ) : (
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Mot de passe Mis à Jour avec Succès !</h2>
            <p className="text-xs text-slate-400 mt-2">
              Votre compte administrateur a été activé. Vous pouvez désormais accéder au tableau de bord opérationnel.
            </p>
          </div>

          <button
            onClick={() => router.push('/overview')}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Accéder au Control Tower Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
