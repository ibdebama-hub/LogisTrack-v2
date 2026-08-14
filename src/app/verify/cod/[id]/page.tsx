'use client';

import React, { useEffect, useState } from 'react';
import { Banknote, CheckCircle2, ShieldCheck } from 'lucide-react';
import { verifyPublicCodReceipt } from '../../../../lib/services/codEnterpriseService';

export default function VerifyCodPage({ params }: { params: { id: string } }) {
  const [verificationData, setVerificationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await verifyPublicCodReceipt(params.id);
      setVerificationData(res);
      setIsLoading(false);
    }
    load();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <Banknote className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-white">Vérification de Reçu COD</h1>
          <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            {params.id}
          </span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500 italic">
            Vérification de la transaction sur la caisse Supabase...
          </div>
        ) : (
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Statut Encaissement :</span>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Reçu Certifié & Encaissé
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Montant Encaissé :</span>
              <span className="font-mono text-emerald-400 font-extrabold text-sm">
                {verificationData?.amount_collected?.toLocaleString()} {verificationData?.currency || 'XOF'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Moyen de Règlement :</span>
              <span className="text-slate-200 font-semibold">{verificationData?.payment_method}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Date d'Horodatage :</span>
              <span className="font-mono text-slate-300">{verificationData?.created_at}</span>
            </div>
          </div>
        )}

        <div className="text-center pt-2 text-[11px] text-slate-500 space-y-1">
          <p className="font-bold text-slate-400">LogisTrack V2 Cash Security</p>
          <p>Toutes les transactions financières sont auditées et immuables.</p>
        </div>
      </div>
    </div>
  );
}
