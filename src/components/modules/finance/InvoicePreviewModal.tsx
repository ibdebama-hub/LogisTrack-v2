'use client';

import React from 'react';
import {
  X,
  Printer,
  Download,
  Send,
  CheckCircle2,
  Building,
  FileText,
  DollarSign,
  Package,
  ShieldCheck
} from 'lucide-react';
import { B2BInvoice } from '@/types/b2bBilling';

interface InvoicePreviewModalProps {
  invoice: B2BInvoice | null;
  onClose: () => void;
  onMarkAsPaid?: (invoiceId: string) => void;
}

export default function InvoicePreviewModal({
  invoice,
  onClose,
  onMarkAsPaid
}: InvoicePreviewModalProps) {
  if (!invoice) return null;

  const formatAmount = (val: number, currency: string = 'GNF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : 'GNF',
      maximumFractionDigits: 0
    }).format(val).replace('XOF', 'FCFA');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* MODAL CONTROLS HEADER */}
        <div className="p-4 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-extrabold text-white text-base">{invoice.invoice_number}</span>
              <span className="text-xs text-slate-400 block font-mono">Facture d'Honoraires B2B - {invoice.client_name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE SHEET AREA */}
        <div className="p-8 space-y-8 overflow-y-auto flex-1 bg-white text-slate-900 font-sans print:p-0">
          {/* INVOICE HEADER: SUPPLIER LOGISTTRACK & CLIENT INFO */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            {/* SUPPLIER LOGO & ADRESS */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-lg text-slate-900 tracking-wider block">LOGISTRACK V2</span>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold block -mt-1">ENTERPRISE LOGISTICS SUITE</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5 font-mono">
                <div>Logistics West Africa Siège Social</div>
                <div>Avenue de la République, Kaloum, Conakry</div>
                <div>NIF: 904128-GN | RCCM: GN.KAL.2024.B.1092</div>
                <div>Contact: billing@logistrack.gn | +224 620 00 00 00</div>
              </div>
            </div>

            {/* INVOICE NUMBER & DATES */}
            <div className="text-right space-y-1">
              <h2 className="text-2xl font-black text-indigo-900 font-mono">{invoice.invoice_number}</h2>
              <div className="text-xs text-slate-600 font-mono space-y-0.5">
                <div>Date d'émission: <strong>{invoice.issue_date}</strong></div>
                <div>Échéance de paiement: <strong className="text-rose-600">{invoice.due_date}</strong></div>
                <div>Statut: <span className="uppercase font-bold text-indigo-700">{invoice.status}</span></div>
              </div>
            </div>
          </div>

          {/* CLIENT RECIPIENT INFORMATION BOX */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-start text-xs">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">FACTURÉ À (CLIENT DONNEUR D'ORDRE)</span>
              <h3 className="font-extrabold text-sm text-slate-900">{invoice.client_name} ({invoice.client_code})</h3>
              <p className="text-slate-600">{invoice.client_address}</p>
              <p className="text-slate-600 font-mono">NIF Client: {invoice.client_nif}</p>
            </div>

            <div className="text-right text-slate-600 space-y-1 font-mono">
              <div>Email: {invoice.client_email}</div>
              <div>Tél: {invoice.client_phone}</div>
              <div>Campagne: <span className="font-bold text-slate-800">{invoice.campaign_name}</span></div>
            </div>
          </div>

          {/* LINE ITEMS TABLE */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-mono uppercase text-[10px] tracking-wider border-b border-slate-300">
                  <th className="p-3">Désignation de la Prestation Logistique</th>
                  <th className="p-3 text-center">Quantité</th>
                  <th className="p-3 text-right">Prix Unitaire HT</th>
                  <th className="p-3 text-right">Total HT ({invoice.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {invoice.line_items.map(li => (
                  <tr key={li.id}>
                    <td className="p-3 font-semibold text-slate-900">{li.description}</td>
                    <td className="p-3 text-center font-mono">{li.quantity.toLocaleString('fr-FR')}</td>
                    <td className="p-3 text-right font-mono">{formatAmount(li.unit_price, invoice.currency)}</td>
                    <td className="p-3 text-right font-mono font-bold">{formatAmount(li.total_ht, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS & TAX BREAKDOWN */}
          <div className="flex justify-end pt-4">
            <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Sous-Total HT:</span>
                <span className="font-bold text-slate-900">{formatAmount(invoice.subtotal_ht, invoice.currency)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>TVA ({invoice.tax_rate_percent}%):</span>
                <span className="font-bold text-slate-900">{formatAmount(invoice.tax_amount, invoice.currency)}</span>
              </div>

              <hr className="border-slate-300" />

              <div className="flex justify-between text-sm text-slate-900 font-black">
                <span>TOTAL NET TTC:</span>
                <span className="text-indigo-700">{formatAmount(invoice.total_ttc, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT DETAILS & NOTES */}
          <div className="border-t border-slate-200 pt-6 text-xs text-slate-600 space-y-2 font-mono">
            <div className="font-bold text-slate-900">Modalités de Règlement :</div>
            <p>{invoice.notes || 'Paiement sous 30 jours à réception de facture par virement bancaire.'}</p>
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-indigo-900 font-sans text-[11px]">
              📌 <strong>Coordonnées Bancaires (RIB) :</strong> Banque Centrale BCRG Conakry | IBAN / Clé: GN93-BCRG-00192-8840192-91
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950 flex justify-between items-center print:hidden">
          <div className="text-xs text-slate-400 font-mono">
            Facture certifiée conforme et signée électriquement.
          </div>

          <div className="flex items-center gap-3">
            {invoice.status !== 'PAYÉE' && onMarkAsPaid && (
              <button
                onClick={() => { onMarkAsPaid(invoice.id); onClose(); }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Enregistrer Règlement
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
