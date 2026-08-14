'use client';

import React, { useState } from 'react';
import { DollarSign, FileText, Settings, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import B2BInvoiceList from '../../../../components/modules/finance/B2BInvoiceList';
import RateMatrixConfig from '../../../../components/modules/finance/RateMatrixConfig';
import InvoicePreviewModal from '../../../../components/modules/finance/InvoicePreviewModal';
import { MOCK_B2B_INVOICES, MOCK_CLIENT_RATES } from '../../../../lib/mockBillingData';
import { B2BInvoice, ClientRateConfig } from '../../../../types/b2bBilling';

export default function B2BBillingPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'rates'>('invoices');
  const [invoices, setInvoices] = useState<B2BInvoice[]>(MOCK_B2B_INVOICES);
  const [rates, setRates] = useState<ClientRateConfig[]>(MOCK_CLIENT_RATES);
  const [selectedInvoice, setSelectedInvoice] = useState<B2BInvoice | null>(null);

  // Handle saving modified rate config
  const handleSaveRate = (updatedRate: ClientRateConfig) => {
    setRates(prev => prev.map(r => (r.id === updatedRate.id ? updatedRate : r)));
  };

  // Handle Mark Invoice Paid
  const handleMarkPaid = (invoiceId: string) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'PAYÉE',
              payment_date: 'Aujourd\'hui',
              payment_method: 'Virement bancaire (Confirmé)'
            }
          : inv
      )
    );

    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice(prev => prev ? { ...prev, status: 'PAYÉE' } : null);
    }
  };

  // Handle Send Reminder
  const handleSendReminder = (invoiceId: string) => {
    alert(`Relance automatique envoyée par email au client pour la facture ${invoiceId}`);
  };

  // Handle Generate New Invoice Mock Action
  const handleGenerateNewInvoice = () => {
    const newId = `fac-2026-${Math.floor(Math.random() * 900 + 100)}`;
    const newInvoice: B2BInvoice = {
      id: newId,
      invoice_number: `FAC-2026-00${Math.floor(Math.random() * 80 + 50)}`,
      client_id: 'cli-orange',
      client_name: 'Orange Guinée',
      client_code: 'OGN',
      client_email: 'facturation@orange-guinee.com',
      client_phone: '+224 622 00 00 00',
      client_address: 'Immeuble Boulbinet, Kaloum, Conakry',
      client_nif: 'NIF-98420-GN',
      issue_date: 'Aujourd\'hui',
      due_date: 'Dans 30 jours',
      campaign_name: 'Distribution Factures Télécom Récentes',
      status: 'BROUILLON',
      line_items: [
        {
          id: 'li-new-1',
          description: 'Distribution Factures Intramuros (Remises directes certifiées)',
          quantity: 2800,
          unit_price: 2500,
          total_ht: 7000000
        },
        {
          id: 'li-new-2',
          description: 'Option Preuve Tactile avec Signature (PoD Certifiées)',
          quantity: 2100,
          unit_price: 500,
          total_ht: 1050000
        }
      ],
      subtotal_ht: 8050000,
      tax_rate_percent: 18,
      tax_amount: 1449000,
      total_ttc: 9499000,
      currency: 'GNF',
      notes: 'Facture générée automatiquement à partir des décharges certifiées du Hub PoD.'
    };

    setInvoices([newInvoice, ...invoices]);
    setSelectedInvoice(newInvoice);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> RECOUVREMENT & FACTURATION B2B
            </span>
            <span className="text-slate-500 text-xs font-mono">• Expatriation PDF & TVA 18%</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tarification & Facturation Donneurs d'Ordres
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Calcul automatique des honoraires par campagne, gestion des grilles dégressives/zones et émission des factures certifiées.
          </p>
        </div>

        {/* TAB NAVIGATION SWITCHER */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'invoices'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Factures B2B</span>
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'rates'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Grilles Tarifaires</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INVOICE LIST */}
      {activeTab === 'invoices' && (
        <B2BInvoiceList
          invoices={invoices}
          onInspectInvoice={inv => setSelectedInvoice(inv)}
          onMarkPaid={handleMarkPaid}
          onSendReminder={handleSendReminder}
          onGenerateNewModalOpen={handleGenerateNewInvoice}
        />
      )}

      {/* TAB 2: RATE MATRIX CONFIG */}
      {activeTab === 'rates' && (
        <RateMatrixConfig
          rates={rates}
          onSaveRate={handleSaveRate}
        />
      )}

      {/* INVOICE PREVIEW MODAL */}
      <InvoicePreviewModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onMarkAsPaid={handleMarkPaid}
      />
    </div>
  );
}
