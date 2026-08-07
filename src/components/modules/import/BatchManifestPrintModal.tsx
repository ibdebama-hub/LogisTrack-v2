'use client';

import React from 'react';
import {
  Printer,
  X,
  FileCheck,
  Building2,
  Users,
  MapPin,
  Barcode,
  Download,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { BatchAssignmentSummary, ImportedRow } from '../../../types/logistrack';

interface BatchManifestPrintModalProps {
  batch: BatchAssignmentSummary;
  items: ImportedRow[];
  campaignTitle: string;
  onClose: () => void;
}

export default function BatchManifestPrintModal({
  batch,
  items,
  campaignTitle,
  onClose
}: BatchManifestPrintModalProps) {
  const batchItems = items.filter(i => i.zone_code === batch.zone_code);
  const now = new Date().toLocaleString('fr-FR');
  const manifestId = `BDL-${batch.zone_code}-${Date.now().toString().slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-700 p-6 space-y-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header Action Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              LOGISTRACK V2 • BORDEREAU DE LIVRAISON
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">Bordereau de sortie du Lot {batch.zone_code}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Imprimer Bordereau (PDF)
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Manifest Sheet Layout */}
        <div className="bg-white text-slate-950 p-8 rounded-xl space-y-6 font-sans border border-slate-300 shadow-inner">
          {/* Manifest Top Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">LOGISTRACK V2</h1>
              <p className="text-xs text-slate-600 font-medium">BORDEREAU DE SORTIE & FEUILLE DE ROUTE AGENT</p>
              <p className="text-xs text-slate-500 font-mono mt-1">Généré le: {now}</p>
            </div>

            <div className="text-right">
              <div className="text-lg font-mono font-extrabold text-slate-900">{manifestId}</div>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-xs font-mono font-bold border border-slate-300 rounded">
                ZONE : {batch.zone_code}
              </span>
            </div>
          </div>

          {/* Campaign & Agent Summary Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Campagne / Donneur d&apos;Ordre :</span>
              <strong className="text-slate-900 text-sm font-semibold">{campaignTitle}</strong>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Chef d&apos;Équipe / Agent Affecté :</span>
              <strong className="text-slate-900 text-sm font-semibold">
                {batch.assigned_agent?.full_name || 'Chef de Zone Cocody'}
              </strong>
              <span className="text-slate-500 font-mono block text-[11px]">
                {batch.assigned_agent?.phone || '+225 07 00 00 00 00'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Nombre d&apos;Articles dans ce Lot :</span>
              <strong className="text-slate-900 text-sm font-bold">{batchItems.length} factures / courriers</strong>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Total Caisse COD à Encaisser :</span>
              <strong className="text-amber-700 text-sm font-bold">{batch.total_cod.toLocaleString()} FCFA</strong>
            </div>
          </div>

          {/* Articles Table with Barcodes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-mono uppercase text-[10px]">
                  <th className="p-2 border border-slate-900">#</th>
                  <th className="p-2 border border-slate-900">Référence & Code-Barres</th>
                  <th className="p-2 border border-slate-900">Type</th>
                  <th className="p-2 border border-slate-900">Destinataire & Contact</th>
                  <th className="p-2 border border-slate-900">Adresse & Repère Visuel</th>
                  <th className="p-2 border border-slate-900">COD (FCFA)</th>
                  <th className="p-2 border border-slate-900 text-center">Émargement / PoD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {batchItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-100">
                    <td className="p-2 border font-mono text-center font-bold text-slate-700">{idx + 1}</td>
                    <td className="p-2 border font-mono">
                      <div className="font-bold text-slate-900">{item.tracking_number}</div>
                      <div className="text-[9px] text-slate-500 font-mono tracking-widest">||||| ||| |||||||</div>
                    </td>
                    <td className="p-2 border uppercase font-mono text-[10px] text-slate-700">{item.item_type}</td>
                    <td className="p-2 border">
                      <div className="font-semibold text-slate-900">{item.recipient_name}</div>
                      <div className="text-slate-600 font-mono text-[11px]">{item.recipient_phone}</div>
                    </td>
                    <td className="p-2 border">
                      <div className="text-slate-800">{item.address_raw}</div>
                      {item.landmark_description && (
                        <div className="text-[10px] text-indigo-700 italic">📍 Repère : {item.landmark_description}</div>
                      )}
                    </td>
                    <td className="p-2 border font-mono font-bold">
                      {item.cod_amount > 0 ? `${item.cod_amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-2 border text-center w-28">
                      <div className="h-8 border border-dashed border-slate-400 rounded bg-slate-50 flex items-center justify-center text-[9px] text-slate-400">
                        Signature / Emargement
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Discharge Signoff Footer */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-900 text-xs">
            <div className="space-y-8">
              <span className="font-bold text-slate-900 block">Signature Dispatcher / Magasinier :</span>
              <div className="text-[10px] text-slate-500 italic">Date & Heure de remise des plis</div>
            </div>

            <div className="space-y-8 text-right">
              <span className="font-bold text-slate-900 block">Signature Agent de Distribution :</span>
              <div className="text-[10px] text-slate-500 italic">Reçu conforme pour distribution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
