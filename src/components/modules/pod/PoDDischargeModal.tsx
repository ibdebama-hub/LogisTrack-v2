'use client';

import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Camera,
  UserCheck,
  CheckCircle2,
  X,
  Lock,
  Mailbox,
  DollarSign,
  FileText,
  CreditCard
} from 'lucide-react';
import SignatureCanvas from './SignatureCanvas';
import { PaymentStatus } from '../../../types/logistrack';

interface PoDDischargeModalProps {
  item: {
    id: string;
    trackingNumber: string;
    type: 'invoice' | 'package' | 'registered_mail' | 'simple_mail';
    paymentStatus?: PaymentStatus;
    recipientName: string;
    address: string;
    codAmount: number;
  };
  onClose: () => void;
  onSuccess: (podData: {
    podType: 'signature' | 'photo' | 'proxy' | 'mailbox_drop';
    signatureUrl?: string;
    photoProofUrl?: string;
    proxyName?: string;
    proxyRelation?: string;
    idType?: string;
    idNumber?: string;
    paymentCollected?: number;
    paymentMethod?: 'cash' | 'mobile_money';
    gpsLat?: number;
    gpsLng?: number;
  }) => void;
}

export default function PoDDischargeModal({ item, onClose, onSuccess }: PoDDischargeModalProps) {
  const isNoPayment = !item.paymentStatus || item.paymentStatus === 'NO_PAYMENT_REQUIRED' || item.codAmount === 0;

  const [activeTab, setActiveTab] = useState<'signature' | 'photo' | 'proxy' | 'mailbox_drop'>(
    isNoPayment ? 'mailbox_drop' : 'signature'
  );

  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [proxyName, setProxyName] = useState('');
  const [proxyRelation, setProxyRelation] = useState('Conjoint(e)');
  const [idType, setIdType] = useState('CNI');
  const [idNumber, setIdNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile_money'>('cash');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGpsLocation({ lat: 5.3599, lng: -3.9723 })
      );
    }
  }, []);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setPhotoPreview(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulatePhoto = () => {
    const svgPhoto = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="40%" fill="%2338bdf8" font-family="sans-serif" font-size="14" text-anchor="middle">PHOTO PREUVE DE DÉPÔT</text><text x="50%" y="60%" fill="%2394a3b8" font-family="monospace" font-size="11" text-anchor="middle">GPS: ${gpsLocation?.lat || 5.3599}, ${gpsLocation?.lng || -3.9723}</text></svg>`;
    setPhotoPreview(svgPhoto);
  };

  const handleSubmit = () => {
    onSuccess({
      podType: activeTab,
      signatureUrl: signatureData || undefined,
      photoProofUrl: photoPreview || undefined,
      proxyName: proxyName || undefined,
      proxyRelation: proxyRelation || undefined,
      idType: idType || undefined,
      idNumber: idNumber || undefined,
      paymentCollected: isNoPayment ? 0 : item.codAmount,
      paymentMethod: isNoPayment ? undefined : paymentMethod,
      gpsLat: gpsLocation?.lat,
      gpsLng: gpsLocation?.lng
    });
  };

  const isFormValid = () => {
    if (activeTab === 'mailbox_drop') return true; // 1-click deposit allowed for free items
    if (activeTab === 'signature') return !!signatureData;
    if (activeTab === 'photo') return !!photoPreview;
    if (activeTab === 'proxy') return !!proxyName.trim();
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold rounded">
                {item.trackingNumber}
              </span>
              {isNoPayment ? (
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Distribution Simple (Gratuit)
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-amber-400" /> COD: {item.codAmount.toLocaleString()} FCFA
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-white mt-1">Preuve de Remise / Décharge (PoD)</h2>
            <p className="text-xs text-slate-400">{item.recipientName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COD Payment Section if mandatory */}
        {!isNoPayment && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-300 font-semibold">Montant COD à Encaisser :</span>
              <strong className="text-amber-400 font-mono font-bold text-sm">{item.codAmount.toLocaleString()} FCFA</strong>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-1.5 px-2 rounded-lg border font-bold transition-all ${
                  paymentMethod === 'cash' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                💵 Espèces
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile_money')}
                className={`py-1.5 px-2 rounded-lg border font-bold transition-all ${
                  paymentMethod === 'mobile_money' ? 'bg-sky-600 text-white border-sky-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                📱 Mobile Money
              </button>
            </div>
          </div>
        )}

        {/* Mode Tabs Selector */}
        <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
          {isNoPayment && (
            <button
              type="button"
              onClick={() => setActiveTab('mailbox_drop')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'mailbox_drop' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mailbox className="w-3.5 h-3.5" /> Boîte/Porte
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('signature')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'signature' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Signature
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'photo' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Photo Dépôt
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('proxy')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'proxy' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Tiers/Mandat
          </button>
        </div>

        {/* TAB 0: 1-CLICK MAILBOX DROP (For Free Administrative Invoices) */}
        {activeTab === 'mailbox_drop' && (
          <div className="p-4 bg-indigo-950/30 border border-indigo-900/40 rounded-xl space-y-2 text-center">
            <Mailbox className="w-8 h-8 text-indigo-400 mx-auto" />
            <h3 className="text-xs font-bold text-white">Dépôt Boîte aux Lettres / Sous Porte</h3>
            <p className="text-[11px] text-slate-300">
              Autorisé pour les factures d&apos;eau/électricité & avis administratifs sans encaissement.
            </p>
          </div>
        )}

        {/* TAB 1: SIGNATURE TACTILE */}
        {activeTab === 'signature' && (
          <div className="space-y-3">
            <label className="text-xs text-slate-300 font-medium block">
              Signature du destinataire sur l&apos;écran :
            </label>
            <SignatureCanvas onSave={(data) => setSignatureData(data)} />
          </div>
        )}

        {/* TAB 2: PHOTO PREUVE DE DÉPÔT */}
        {activeTab === 'photo' && (
          <div className="space-y-3">
            <label className="text-xs text-slate-300 font-medium block">
              Photo de la facture déposée sur place :
            </label>
            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <img src={photoPreview} alt="Preuve de dépôt" className="w-full h-44 object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-950 space-y-3">
                <Camera className="w-8 h-8 text-indigo-400 mx-auto" />
                <div className="flex justify-center gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg">
                    Prendre Photo
                    <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={handleSimulatePhoto}
                    className="px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700"
                  >
                    Simuler Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TIERS / MANDATAIRE */}
        {activeTab === 'proxy' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Nom complet du récepteur (Tiers) :</label>
              <input
                type="text"
                placeholder="Ex: Kouassi Ama Chantal"
                value={proxyName}
                onChange={(e) => setProxyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Relation :</label>
                <select
                  value={proxyRelation}
                  onChange={(e) => setProxyRelation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                >
                  <option>Conjoint(e)</option>
                  <option>Employé(e) / Secrétaire</option>
                  <option>Voisin(e)</option>
                  <option>Gardien(ne)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Pièce d&apos;identité :</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                >
                  <option>CNI</option>
                  <option>Passeport</option>
                  <option>Permis</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Valider la Remise / Preuve PoD
        </button>
      </div>
    </div>
  );
}
