'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { ImportedRow } from '../../../types/logistrack';

interface PaginatedInvoiceTableProps {
  initialItems?: ImportedRow[];
  totalServerCount?: number;
  onPageChange?: (page: number, pageSize: number, search: string, status?: string) => void;
}

export default function PaginatedInvoiceTable({
  initialItems = [],
  totalServerCount = 0,
  onPageChange
}: PaginatedInvoiceTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'warning' | 'error'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  // Simulated large dataset generator if no server data passed
  const displayItems = useMemo(() => {
    let list = initialItems;
    if (list.length === 0) {
      list = Array.from({ length: 2500 }).map((_, idx) => ({
        id: `inv-${idx + 1}`,
        tracking_number: `FAC-2026-${String(idx + 1001).padStart(5, '0')}`,
        item_type: idx % 4 === 0 ? 'package' : idx % 3 === 0 ? 'registered_mail' : 'invoice',
        payment_status: idx % 3 === 0 ? 'PENDING_COD' : 'NO_PAYMENT_REQUIRED',
        recipient_name: [
          'Société Ivoirienne de Banque',
          'Kouame Yao Bernard',
          'Cabinet Avocats & Associes',
          'Pharmacie de la Renaissance',
          'Sylla Fatoumata',
          'Orange Côte d\'Ivoire',
          'CIE Distribution'
        ][idx % 7],
        recipient_phone: `+225 07 ${String(idx % 99).padStart(2, '0')} ${String(idx % 88).padStart(2, '0')} 12`,
        address_raw: `Boulevard Latrille Villa ${idx + 1}`,
        landmark_description: idx % 2 === 0 ? `En face du repère ${idx + 1}` : undefined,
        zone_code: ['ABJ-COC-RIV', 'ABJ-YOP-SEL', 'ABJ-MAR-Z4', 'ABJ-KOU-REM', 'DKR-PLT-SAN'][idx % 5],
        cod_amount: idx % 3 === 0 ? (idx + 1) * 1500 : 0,
        due_date: '2026-08-20',
        status: (idx % 9 === 0 ? 'error' : idx % 5 === 0 ? 'warning' : 'valid') as 'valid' | 'warning' | 'error',
        validation_errors: idx % 9 === 0 ? ['Numéro injoignable'] : []
      }));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        i =>
          i.tracking_number.toLowerCase().includes(q) ||
          i.recipient_name.toLowerCase().includes(q) ||
          i.recipient_phone.toLowerCase().includes(q) ||
          i.zone_code.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter(i => i.status === statusFilter);
    }

    return list;
  }, [initialItems, searchQuery, statusFilter]);

  const totalCount = totalServerCount || displayItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const currentPageItems = useMemo(() => {
    const from = (page - 1) * pageSize;
    return displayItems.slice(from, from + pageSize);
  }, [displayItems, page, pageSize]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(currentPageItems.map(i => i.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSearchChange = (val: string) => {
    startTransition(() => {
      setSearchQuery(val);
      setPage(1);
    });
  };

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4 overflow-hidden p-6 shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            Registre Général des Factures & Courriers ({totalCount.toLocaleString()} entrées)
          </h2>
          <p className="text-xs text-slate-400">
            Chargement optimisé par pagination serveur & requêtes groupées Supabase
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par réf, nom..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Par page :</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Segmented Control & Batch Action Indicator */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Filtrer par statut :</span>
          {(['all', 'valid', 'warning', 'error'] as const).map(st => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-950/60 text-indigo-300 rounded-lg border border-indigo-800/40">
            <span>{selectedIds.size} sélections</span>
            <button className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold">
              Affecter Agent en Masse
            </button>
          </div>
        )}
      </div>

      {/* Main Paginated Data Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
            <tr>
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  onChange={e => handleSelectAll(e.target.checked)}
                  checked={
                    currentPageItems.length > 0 &&
                    currentPageItems.every(i => selectedIds.has(i.id))
                  }
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                />
              </th>
              <th className="p-3">N° Référence</th>
              <th className="p-3">Type</th>
              <th className="p-3">Destinataire</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Adresse & Repère</th>
              <th className="p-3">Zone</th>
              <th className="p-3">COD (FCFA)</th>
              <th className="p-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {isPending ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-indigo-400" />
                  <span className="mt-2 block">Chargement de la page...</span>
                </td>
              </tr>
            ) : currentPageItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500">
                  Aucun résultat trouvé pour vos critères de recherche.
                </td>
              </tr>
            ) : (
              currentPageItems.map(item => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    selectedIds.has(item.id) ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelectOne(item.id)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                    />
                  </td>
                  <td className="p-3 font-mono font-medium text-slate-200">
                    {item.tracking_number}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] uppercase font-semibold">
                      {item.item_type}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-white">{item.recipient_name}</td>
                  <td className="p-3 font-mono">{item.recipient_phone}</td>
                  <td className="p-3 max-w-xs">
                    <div className="truncate text-slate-200">{item.address_raw}</div>
                    {item.landmark_description && (
                      <div className="text-[11px] text-indigo-400 truncate">
                        📍 {item.landmark_description}
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-mono text-indigo-300">{item.zone_code}</td>
                  <td className="p-3 font-mono font-medium">
                    {item.cod_amount > 0 ? `${item.cod_amount.toLocaleString()}` : '-'}
                  </td>
                  <td className="p-3">
                    {item.status === 'valid' && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                      </span>
                    )}
                    {item.status === 'warning' && (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> À vérifier
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                        <XCircle className="w-3.5 h-3.5" /> Incomplet
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-400">
        <div>
          Affichage des résultats <strong className="text-white">{(page - 1) * pageSize + 1}</strong> à{' '}
          <strong className="text-white">
            {Math.min(page * pageSize, totalCount)}
          </strong>{' '}
          sur <strong className="text-white">{totalCount.toLocaleString()}</strong> factures
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-mono font-medium text-slate-200">
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
