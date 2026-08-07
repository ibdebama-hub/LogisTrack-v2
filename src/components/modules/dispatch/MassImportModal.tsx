'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Layers,
  ArrowRight,
  RefreshCw,
  X,
  FileText,
  Download,
  HelpCircle,
  Info,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import { ImportedRow, ItemType, PaymentStatus } from '../../../types/logistrack';
import { downloadCSVTemplate, downloadExcelTemplate } from '../../../utils/importTemplates';

interface MassImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (rows: ImportedRow[]) => void;
}

const SAMPLE_CSV = `reference,item_type,payment_type,recipient_name,recipient_phone,city,district,landmark,cod_amount,notes
FAC-2026-0801,FACTURE,NO_PAYMENT_REQUIRED,Amadou Diallo,+223 76 00 11 22,Bamako,Bamako Coura,Près du château d'eau porte 12,0,Distribution simple sous porte
CR-8849,COURRIER,NO_PAYMENT_REQUIRED,Société Ivoirienne de Banque,+225 07 08 09 10 11,Abidjan,Plateau,Immeuble Jeceda 4è ét. Porte 402,0,Remise au secrétariat avec décharge
COL-5512,COLIS,PENDING_COD,Pharmacie de la Renaissance,+225 05 99 88 77 66,Abidjan,Koumassi Remblais,Carrefour 3 Ampoules près boulangerie,42500,Encaissement COD obligatoire avant remise
FAC-2026-0802,FACTURE,PENDING_COD,Oumar Cissé,+223 66 55 44 33,Sikasso,Sikasso Centre,Avenue de l'Indépendance face marché,12500,Encaissement espèces ou Mobile Money
CR-9012,COURRIER,NO_PAYMENT_REQUIRED,Cabinet Avocats & Associés,+223 70 12 34 56,Bamako,Hamdallaye ACI,Rue 380 Immeuble SOGEFIH,0,Convocation confidentielle - Appeler avant`;

export default function MassImportModal({ isOpen, onClose, onImportComplete }: MassImportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fileName, setFileName] = useState('');
  const [rawText, setRawText] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [parsedRows, setParsedRows] = useState<ImportedRow[]>([]);
  const [showLegend, setShowLegend] = useState(false);

  const [mapping, setMapping] = useState({
    tracking_number: 'reference',
    item_type: 'item_type',
    payment_status: 'payment_type',
    recipient_name: 'recipient_name',
    recipient_phone: 'recipient_phone',
    address_raw: 'district',
    landmark_description: 'landmark',
    zone_code: 'district',
    cod_amount: 'cod_amount',
    due_date: 'notes',
  });

  if (!isOpen) return null;

  const handleLoadSample = () => {
    setRawText(SAMPLE_CSV);
    setFileName('modele_importation_logistrack.csv');
    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setRawText(evt.target?.result as string || '');
        setStep(2);
      };
      reader.readAsText(file);
    }
  };

  const runValidationEngine = () => {
    setIsValidating(true);
    setTimeout(() => {
      const lines = rawText.trim().split('\n');
      if (lines.length <= 1) {
        setIsValidating(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const getVal = (row: string[], colKey: keyof typeof mapping) => {
        const headerName = mapping[colKey];
        const idx = headers.indexOf(headerName);
        return idx !== -1 && row[idx] ? row[idx].trim().replace(/^"|"$/g, '') : '';
      };

      const seenTracking = new Set<string>();
      const rows: ImportedRow[] = lines.slice(1).map((line, idx) => {
        const parts = line.split(',');
        const tracking = getVal(parts, 'tracking_number') || `ITEM-${1000 + idx}`;
        const rawType = getVal(parts, 'item_type').toUpperCase();
        const itemType: ItemType = rawType.includes('COLIS') || rawType.includes('PACKAGE')
          ? 'package'
          : rawType.includes('COURRIER')
          ? 'registered_mail'
          : 'invoice';

        const rawPayment = getVal(parts, 'payment_status').toUpperCase();
        const paymentStatus: PaymentStatus = rawPayment.includes('COD') || rawPayment.includes('PAYMENT')
          ? 'PENDING_COD'
          : 'NO_PAYMENT_REQUIRED';

        const name = getVal(parts, 'recipient_name');
        const phone = getVal(parts, 'recipient_phone');
        const address = getVal(parts, 'address_raw');
        const landmark = getVal(parts, 'landmark_description');
        const rawZone = getVal(parts, 'zone_code').toUpperCase();
        const zoneCode = rawZone.includes('SIKASSO') ? 'SIK-CEN-02' : rawZone.includes('KOUMASSI') ? 'ABJ-KOU-REM' : 'BMK-COU-01';
        const cod = parseFloat(getVal(parts, 'cod_amount')) || 0;
        const dueDate = getVal(parts, 'due_date') || '2026-08-20';

        const errors: string[] = [];

        // 1. Phone number validation
        if (!phone || phone.length < 8) {
          errors.push('Téléphone invalide ou absent');
        }

        // 2. Incomplete address validation
        if (!address || address.length < 3) {
          errors.push('Adresse incomplète');
        }

        // 3. Duplicate tracking reference detection
        if (seenTracking.has(tracking)) {
          errors.push(`Doublon détecté (${tracking})`);
        } else {
          seenTracking.add(tracking);
        }

        let status: 'valid' | 'warning' | 'error' = 'valid';
        if (errors.length > 0) {
          status = errors.some(e => e.includes('Doublon') || e.includes('invalide')) ? 'error' : 'warning';
        }

        return {
          id: `row-${idx}`,
          tracking_number: tracking,
          item_type: itemType,
          payment_status: paymentStatus,
          recipient_name: name,
          recipient_phone: phone,
          address_raw: address,
          landmark_description: landmark,
          zone_code: zoneCode,
          cod_amount: cod,
          due_date: dueDate,
          status,
          validation_errors: errors
        };
      });

      setParsedRows(rows);
      setIsValidating(false);
      setStep(3);
    }, 400);
  };

  const handleFinish = () => {
    onImportComplete(parsedRows);
    onClose();
  };

  const validCount = parsedRows.filter(r => r.status === 'valid').length;
  const warningCount = parsedRows.filter(r => r.status === 'warning').length;
  const errorCount = parsedRows.filter(r => r.status === 'error').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-800 p-6 space-y-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Importation Massive de Factures & Courriers</h2>
              <p className="text-xs text-slate-400">Jusqu&apos;à 10 000 lignes • Détection des doublons & modèles pré-structurés</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECTION: DOWNLOAD TEMPLATES BANNER */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Download className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Besoin d&apos;un modèle de fichier d&apos;importation ?
                </h4>
                <p className="text-[11px] text-slate-400">
                  Téléchargez un fichier modèle prêt à l&apos;emploi pré-rempli avec des exemples de données
                </p>
              </div>
            </div>

            {/* Template Download Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={downloadCSVTemplate}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all shadow"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" /> Télécharger Modèle CSV (.csv)
              </button>

              <button
                onClick={downloadExcelTemplate}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-600/30 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Télécharger Modèle Excel (.xlsx)
              </button>
            </div>
          </div>

          {/* Explanation Legend Toggle */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Info className="w-3.5 h-3.5" /> Légende des Modes de Paiement (NO_PAYMENT_REQUIRED vs PENDING_COD)
            </button>
          </div>

          {showLegend && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 font-mono font-bold text-[10px] rounded shrink-0">
                  NO_PAYMENT_REQUIRED
                </span>
                <span>
                  <strong>Distribution Simple / Administrative :</strong> Factures d&apos;eau/électricité, avis de paiement, convocations, courriers officiels. Aucun encaissement au scan, validation automatique lors du dépot.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 font-mono font-bold text-[10px] rounded shrink-0">
                  PENDING_COD
                </span>
                <span>
                  <strong>Livraison avec Encaissement (Cash on Delivery) :</strong> Colis, factures soumises à paiement immédiat. Modale d&apos;encaissement obligatoire (Espèces physiques ou Mobile Money) avant validation du PoD.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* STEP 1: UPLOAD */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Charger un fichier de distribution grand volume :</span>
              <button
                onClick={handleLoadSample}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold rounded-xl border border-slate-700"
              >
                <Zap className="w-4 h-4 text-amber-400" /> Charger Données Exemples Démo
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-12 text-center bg-slate-950/40 flex flex-col items-center justify-center space-y-4">
              <UploadCloud className="w-10 h-10 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white">Glissez votre fichier CSV ou XLSX ici</h3>
                <p className="text-xs text-slate-400 mt-1">Détection automatique des doublons & contrôles d&apos;intégrité</p>
              </div>
              <label className="cursor-pointer px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg">
                Parcourir les fichiers
                <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: MAPPING */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
              <span>Fichier chargé : <strong className="text-white">{fileName}</strong></span>
              <button onClick={() => setStep(1)} className="text-slate-400 underline">Changer</button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Correspondance Dynamique des Colonnes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {[
                  { label: 'Référence Facture', key: 'tracking_number' },
                  { label: 'Type d\'item', key: 'item_type' },
                  { label: 'Mode de Paiement', key: 'payment_status' },
                  { label: 'Nom Destinataire', key: 'recipient_name' },
                  { label: 'Téléphone', key: 'recipient_phone' },
                  { label: 'Adresse / Quartier', key: 'address_raw' },
                  { label: 'Repère Visuel', key: 'landmark_description' },
                  { label: 'Code Zone / Quartier', key: 'zone_code' },
                  { label: 'Montant COD', key: 'cod_amount' },
                ].map(col => (
                  <div key={col.key} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <label className="text-[11px] text-slate-400 block mb-1 font-medium">{col.label}</label>
                    <select
                      value={(mapping as Record<string, string>)[col.key]}
                      onChange={e => setMapping({ ...mapping, [col.key]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                    >
                      {['reference', 'item_type', 'payment_type', 'recipient_name', 'recipient_phone', 'city', 'district', 'landmark', 'cod_amount', 'notes'].map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={runValidationEngine}
                disabled={isValidating}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Contrôle des doublons en cours...
                  </>
                ) : (
                  <>
                    Lancer la Validation Dynamique <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VALIDATION RESULTS GRID */}
        {step === 3 && (
          <div className="space-y-5">
            {/* KPI Validation Summary */}
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Total Analysé</span>
                <p className="text-xl font-bold text-white mt-0.5">{parsedRows.length}</p>
              </div>
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40">
                <span className="text-emerald-400 font-medium">Conformes</span>
                <p className="text-xl font-bold text-emerald-300 mt-0.5">{validCount}</p>
              </div>
              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/40">
                <span className="text-amber-400 font-medium">Avertissements</span>
                <p className="text-xl font-bold text-amber-300 mt-0.5">{warningCount}</p>
              </div>
              <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800/40">
                <span className="text-rose-400 font-medium">Doublons / Erreurs</span>
                <p className="text-xl font-bold text-rose-300 mt-0.5">{errorCount}</p>
              </div>
            </div>

            {/* Validation Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 max-h-60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Référence</th>
                    <th className="p-2.5">Paiement</th>
                    <th className="p-2.5">Destinataire</th>
                    <th className="p-2.5">Téléphone</th>
                    <th className="p-2.5">Adresse & Repère</th>
                    <th className="p-2.5">Zone</th>
                    <th className="p-2.5">Résultat Contrôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {parsedRows.map(r => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-mono font-medium text-slate-200">{r.tracking_number}</td>
                      <td className="p-2.5">
                        {r.payment_status === 'NO_PAYMENT_REQUIRED' ? (
                          <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 text-[10px] rounded font-semibold">Gratuit</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-950 text-amber-300 text-[10px] rounded font-semibold">COD {r.cod_amount.toLocaleString()} F</span>
                        )}
                      </td>
                      <td className="p-2.5 font-medium text-white">{r.recipient_name}</td>
                      <td className="p-2.5 font-mono">{r.recipient_phone}</td>
                      <td className="p-2.5">
                        <div>{r.address_raw}</div>
                        {r.landmark_description && <div className="text-[10px] text-indigo-400">📍 {r.landmark_description}</div>}
                      </td>
                      <td className="p-2.5 font-mono text-indigo-300">{r.zone_code}</td>
                      <td className="p-2.5">
                        {r.status === 'valid' && (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                          </span>
                        )}
                        {r.status === 'error' && (
                          <span className="text-rose-400 font-semibold flex items-center gap-1" title={r.validation_errors.join(', ')}>
                            <XCircle className="w-3.5 h-3.5" /> {r.validation_errors[0]}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setStep(2)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl">
                Retour Mapping
              </button>
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Transmettre vers le Lotissement Automatique
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
