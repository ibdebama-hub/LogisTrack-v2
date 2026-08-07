'use client';

import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  Zap,
  Volume2,
  VolumeX,
  History,
  Check,
  MapPin,
  WifiOff,
  Wifi,
  Keyboard,
  DollarSign,
  ShieldCheck,
  FileText,
  Lock,
  Camera,
  X
} from 'lucide-react';
import { PaymentStatus } from '../../../types/logistrack';
import { useOfflineSync } from '../../../hooks/useOfflineSync';

interface ScannedItem {
  id: string;
  trackingNumber: string;
  recipientName: string;
  address: string;
  landmark?: string;
  scannedAt: string;
  status: 'delivered' | 'pending_sync';
  paymentStatus: PaymentStatus;
  codAmount: number;
  paymentMethod?: 'cash' | 'mobile_money';
}

const DEMO_INVOICE_DB: Record<
  string,
  { recipient: string; address: string; landmark?: string; paymentStatus: PaymentStatus; cod: number }
> = {
  'FAC-2026-001': {
    recipient: 'Société Ivoirienne de Banque',
    address: 'Boulevard Latrille Villa 14',
    landmark: 'En face de la pharmacie St-Jean',
    paymentStatus: 'NO_PAYMENT_REQUIRED',
    cod: 0
  },
  'FAC-2026-002': {
    recipient: 'Kouame Yao Bernard',
    address: 'Quartier Selmer Rue 12',
    landmark: 'A 50m du grand marché',
    paymentStatus: 'PENDING_COD',
    cod: 15000
  },
  'FAC-2026-005': {
    recipient: 'Sylla Fatoumata',
    address: 'Angré Djibi Villa 88',
    landmark: "Près du château d'eau, porte 12",
    paymentStatus: 'NO_PAYMENT_REQUIRED',
    cod: 0
  },
  'COL-2026-441': {
    recipient: 'Pharmacie de la Renaissance',
    address: 'Koumassi Remblais Carrefour 3 Ampoules',
    landmark: 'Boulangerie moderne',
    paymentStatus: 'PENDING_COD',
    cod: 42500
  },
  'REC-2026-089': {
    recipient: 'Cabinet Avocats & Associes',
    address: 'Rue du Commerce Immeuble Jeceda',
    landmark: 'Porte 402 - 4ème étage',
    paymentStatus: 'NO_PAYMENT_REQUIRED',
    cod: 0
  },
};

export default function RapidBatchScanner() {
  const [scannedList, setScannedList] = useState<ScannedItem[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastScannedItem, setLastScannedItem] = useState<ScannedItem | null>(null);
  const [scanFlash, setScanFlash] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  // COD Payment Modal state
  const [pendingCodScan, setPendingCodScan] = useState<ScannedItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile_money'>('cash');

  const { isOnline, saveOfflinePoD } = useOfflineSync();

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio beep');
    }
  };

  const handleBarcodeScanned = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    if (scannedList.some(i => i.trackingNumber === cleanCode)) {
      alert(`⚠️ Code ${cleanCode} déjà scanné dans cette session !`);
      return;
    }

    const demoData = DEMO_INVOICE_DB[cleanCode] || {
      recipient: `Client Facture ${cleanCode}`,
      address: 'Zone Cocody / Yopougon',
      landmark: 'Repère visuel enregistré',
      paymentStatus: 'NO_PAYMENT_REQUIRED' as PaymentStatus,
      cod: 0
    };

    const newItem: ScannedItem = {
      id: `scan-${Date.now()}`,
      trackingNumber: cleanCode,
      recipientName: demoData.recipient,
      address: demoData.address,
      landmark: demoData.landmark,
      scannedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'delivered',
      paymentStatus: demoData.paymentStatus,
      codAmount: demoData.cod
    };

    // If item requires Cash-on-Delivery payment, open Payment Modal first
    if (newItem.paymentStatus === 'PENDING_COD' && newItem.codAmount > 0) {
      setPendingCodScan(newItem);
      setManualCode('');
      return;
    }

    // Process FREE / ADMINISTRATIVE DISTRIBUTION immediately
    playBeep();
    setScanFlash(true);
    setTimeout(() => setScanFlash(false), 300);

    setLastScannedItem(newItem);
    setScannedList(prev => [newItem, ...prev]);

    if (!isOnline) {
      saveOfflinePoD({
        itemId: cleanCode,
        signatureUrl: 'OFFLINE_EXPRESS_SCAN_POD',
        capturedAt: new Date().toISOString()
      });
    }

    setManualCode('');
  };

  // Confirm COD Cash / Mobile Money payment
  const handleConfirmCodPayment = () => {
    if (!pendingCodScan) return;

    const confirmedItem: ScannedItem = {
      ...pendingCodScan,
      paymentStatus: 'COLLECTED_COD',
      paymentMethod
    };

    playBeep();
    setScanFlash(true);
    setTimeout(() => setScanFlash(false), 300);

    setLastScannedItem(confirmedItem);
    setScannedList(prev => [confirmedItem, ...prev]);
    setPendingCodScan(null);
  };

  const handleSimulateScan = () => {
    const availableCodes = Object.keys(DEMO_INVOICE_DB);
    const randomCode = availableCodes[Math.floor(Math.random() * availableCodes.length)];
    handleBarcodeScanned(randomCode);
  };

  // Total COD collected only counts items with payment_status === 'COLLECTED_COD'
  const totalCodCollected = scannedList
    .filter(item => item.paymentStatus === 'COLLECTED_COD')
    .reduce((sum, item) => sum + item.codAmount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto border-x border-slate-800 shadow-2xl pb-24 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Scan Rapide à la Chaîne</h1>
            <p className="text-[11px] text-slate-400">Flux Hybride : Gratuit & COD</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled ? 'bg-indigo-950 text-indigo-300 border-indigo-800/40' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {!isOnline ? (
            <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-semibold rounded-full border border-amber-500/30 flex items-center gap-1">
              <WifiOff className="w-3 h-3" /> Hors-ligne
            </span>
          ) : (
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Wifi className="w-3 h-3" /> En ligne
            </span>
          )}
        </div>
      </header>

      {/* Main Scanner Body */}
      <div className="p-4 space-y-4">
        {/* Scanner Viewfinder Box */}
        <div
          className={`relative w-full h-64 rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-between p-4 transition-all duration-300 ${
            scanFlash
              ? 'border-emerald-400 bg-emerald-950/40 shadow-2xl shadow-emerald-500/50 scale-[1.01]'
              : 'border-indigo-500/40 bg-slate-950'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#fbbf24] animate-pulse" />

          <div className="z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[10px] font-mono text-indigo-300 flex items-center gap-1.5">
            <Camera className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>ALIGNER LE CODE-BARRES DU PLI / FACTURE</span>
          </div>

          <div className="z-10 w-full space-y-2">
            <button
              onClick={handleSimulateScan}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <QrCode className="w-4 h-4" />
              SIMULER SCAN EXPRESS DE FACTURE
            </button>

            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="w-full py-1 text-center text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1"
            >
              <Keyboard className="w-3 h-3" />
              {showManualInput ? 'Masquer la saisie' : 'Saisir le code manuellement'}
            </button>
          </div>
        </div>

        {/* Manual Keyboard Input Box */}
        {showManualInput && (
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: FAC-2026-001"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBarcodeScanned(manualCode)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white"
              />
              <button
                onClick={() => handleBarcodeScanned(manualCode)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
              >
                Valider
              </button>
            </div>
          </div>
        )}

        {/* Last Scanned Item Banner */}
        {lastScannedItem && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-emerald-400 font-bold">{lastScannedItem.trackingNumber}</span>
              
              {/* Distinct Workflow Badge */}
              {lastScannedItem.paymentStatus === 'NO_PAYMENT_REQUIRED' ? (
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded border border-indigo-500/30 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Distribution Simple / Sans Encaissement
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded border border-amber-500/30 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-amber-400" /> COD Encaissé ({lastScannedItem.codAmount.toLocaleString()} FCFA)
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-white">{lastScannedItem.recipientName}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> {lastScannedItem.address}
            </p>
          </div>
        )}

        {/* Scanned Items History List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-400" />
              Historique de Session ({scannedList.length} scannés)
            </h3>
            {totalCodCollected > 0 && (
              <span className="text-xs font-bold text-amber-400">
                Solde COD: {totalCodCollected.toLocaleString()} FCFA
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {scannedList.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-900/40 rounded-xl border border-slate-800">
                Aucune facture scannée dans cette session.
              </div>
            ) : (
              scannedList.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-400">{item.trackingNumber}</span>
                      <span className="text-[10px] text-slate-500">{item.scannedAt}</span>
                    </div>
                    <p className="font-semibold text-white truncate max-w-[180px]">{item.recipientName}</p>
                  </div>

                  <div className="text-right">
                    {item.paymentStatus === 'NO_PAYMENT_REQUIRED' ? (
                      <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 text-[10px] font-bold rounded border border-indigo-800/40">
                        Sans Frais
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-400 text-[10px] font-bold rounded border border-amber-800/40">
                        +{item.codAmount.toLocaleString()} FCFA
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MANDATORY COD PAYMENT CONFIRMATION MODAL */}
      {pendingCodScan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold rounded">
                  {pendingCodScan.trackingNumber}
                </span>
                <h3 className="text-sm font-bold text-amber-400 mt-1">Encaissement COD Obligatoire</h3>
              </div>
              <button onClick={() => setPendingCodScan(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl text-center space-y-1">
              <span className="text-xs text-amber-300">Montant à Encaisser auprès du client :</span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono">
                {pendingCodScan.codAmount.toLocaleString()} FCFA
              </div>
              <p className="text-[11px] text-slate-300 mt-1">{pendingCodScan.recipientName}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Mode de paiement reçu :</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  💵 Espèces physiques
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'mobile_money'
                      ? 'bg-sky-600 text-white border-sky-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  📱 Mobile Money (Wave/OM)
                </button>
              </div>
            </div>

            <button
              onClick={handleConfirmCodPayment}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmer Encaissement & Valider Livraison
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
