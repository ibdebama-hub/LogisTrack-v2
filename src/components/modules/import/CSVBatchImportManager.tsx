'use client';

import React, { useState, useMemo } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
  MapPin,
  ArrowRight,
  RefreshCw,
  Zap,
  Filter,
  Check,
  FileText,
  Building2,
  Layers,
  ChevronRight,
  Download,
  Loader2,
  Printer
} from 'lucide-react';
import { ImportedRow, Zone, FieldAgent, BatchAssignmentSummary, ItemType, PaymentStatus } from '../../../types/logistrack';
import { batchInsertInvoices } from '../../../lib/supabase/queries';
import BatchManifestPrintModal from './BatchManifestPrintModal';

const MOCK_ZONES: Zone[] = [
  { id: 'z1', organization_id: 'org1', name: 'Cocody Riviera', region_name: 'Abidjan', city_name: 'Abidjan', sector_name: 'Cocody Riviera', code: 'ABJ-COC-RIV' },
  { id: 'z2', organization_id: 'org1', name: 'Yopougon Selmer', region_name: 'Abidjan', city_name: 'Abidjan', sector_name: 'Yopougon Selmer', code: 'ABJ-YOP-SEL' },
  { id: 'z3', organization_id: 'org1', name: 'Marcory Zone 4', region_name: 'Abidjan', city_name: 'Abidjan', sector_name: 'Marcory Zone 4', code: 'ABJ-MAR-Z4' },
  { id: 'z4', organization_id: 'org1', name: 'Koumassi Remblais', region_name: 'Abidjan', city_name: 'Abidjan', sector_name: 'Koumassi Remblais', code: 'ABJ-KOU-REM' },
  { id: 'z5', organization_id: 'org1', name: 'Plateau Sandaga', region_name: 'Dakar', city_name: 'Dakar', sector_name: 'Plateau - Sandaga', code: 'DKR-PLT-SAN' },
];

const MOCK_AGENTS: FieldAgent[] = [
  { id: 'a1', full_name: 'Kouassi Jean-Marc', email: 'jean.kouassi@logistrack.ci', phone: '+225 07 08 12 34 56', role: 'field_agent', primary_zone_id: 'z1', primary_zone_code: 'ABJ-COC-RIV', assigned_zone_codes: ['ABJ-COC-RIV'], active_workload_count: 12 },
  { id: 'a2', full_name: 'Diallo Mamadou', email: 'mamadou.diallo@logistrack.ci', phone: '+225 05 04 99 88 77', role: 'field_agent', primary_zone_id: 'z2', primary_zone_code: 'ABJ-YOP-SEL', assigned_zone_codes: ['ABJ-YOP-SEL'], active_workload_count: 45 },
  { id: 'a3', full_name: 'Koffi Marie-Noëlle', email: 'marie.koffi@logistrack.ci', phone: '+225 01 02 33 44 55', role: 'field_agent', primary_zone_id: 'z3', primary_zone_code: 'ABJ-MAR-Z4', assigned_zone_codes: ['ABJ-MAR-Z4', 'ABJ-KOU-REM'], active_workload_count: 8 },
  { id: 'a4', full_name: 'Ndiaye Cheikh', email: 'cheikh.ndiaye@logistrack.sn', phone: '+221 77 123 45 67', role: 'field_agent', primary_zone_id: 'z5', primary_zone_code: 'DKR-PLT-SAN', assigned_zone_codes: ['DKR-PLT-SAN'], active_workload_count: 19 },
];

const SAMPLE_RAW_DATA = `Reference,Type,Destinataire,Telephone,Adresse,Repere_Visuel,Zone_Code,Montant_COD,Echeance
FAC-2026-001,invoice,Société Ivoirienne de Banque,0708091011,Boulevard Latrille Villa 14,En face de la pharmacie Saint-Jean,ABJ-COC-RIV,0,2026-08-15
FAC-2026-002,invoice,Kouame Yao Bernard,0501020304,Quartier Selmer Rue 12,A 50m du grand marché,ABJ-YOP-SEL,15000,2026-08-12
REC-2026-089,registered_mail,Cabinet Avocats & Associes,0102030405,Rue du Commerce Immeuble Jeceda,Porte 402 - 4ème étage,ABJ-MAR-Z4,0,2026-08-10
COL-2026-441,package,Pharmacie de la Renaissance,0707070707,Koumassi Remblais Carrefour 3 Ampoules,A côté de la boulangerie moderne,ABJ-KOU-REM,42500,2026-08-08
FAC-2026-005,invoice,Sylla Fatoumata,0599887766,Angré Djibi Villa 88,Près du château d'eau,ABJ-COC-RIV,0,2026-08-20
FAC-2026-006,invoice,Traore Souleymane,,Yopougon Niangon,Derrière l'église Sainte-Rita,ABJ-YOP-SEL,8500,2026-08-14
FAC-2026-007,invoice,Bamba Cheick,0744556677,Sandaga Rue 14 x 18,Magasin 12,DKR-PLT-SAN,0,2026-08-18`;

export default function CSVBatchImportManager() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCampaign, setSelectedCampaign] = useState('Campagne Factures Electricité - Août 2026');
  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);
  const [chunkProgress, setChunkProgress] = useState<{ current: number; total: number } | null>(null);
  const [importedRows, setImportedRows] = useState<ImportedRow[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'warning' | 'error'>('all');
  const [activePrintBatch, setActivePrintBatch] = useState<BatchAssignmentSummary | null>(null);

  const [columnMapping, setColumnMapping] = useState({
    tracking_number: 'Reference',
    item_type: 'Type',
    recipient_name: 'Destinataire',
    recipient_phone: 'Telephone',
    address_raw: 'Adresse',
    landmark_description: 'Repere_Visuel',
    zone_code: 'Zone_Code',
    cod_amount: 'Montant_COD',
    due_date: 'Echeance',
  });

  const handleLoadSample = () => {
    setRawText(SAMPLE_RAW_DATA);
    setFileName('factures_cie_distribution_août2026.csv');
    setCurrentStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setRawText(evt.target?.result as string || '');
        setCurrentStep(2);
      };
      reader.readAsText(file);
    }
  };

  const processAndMatchData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const lines = rawText.trim().split('\n');
      if (lines.length <= 1) {
        setIsProcessing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const getVal = (row: string[], colKey: keyof typeof columnMapping) => {
        const headerName = columnMapping[colKey];
        const idx = headers.indexOf(headerName);
        return idx !== -1 && row[idx] ? row[idx].trim() : '';
      };

      const parsed: ImportedRow[] = lines.slice(1).map((line, index) => {
        const parts = line.split(',');
        const tracking = getVal(parts, 'tracking_number') || `ITEM-${1000 + index}`;
        const rawType = getVal(parts, 'item_type').toLowerCase();
        const itemType: ItemType = ['package', 'invoice', 'simple_mail', 'registered_mail'].includes(rawType) 
          ? (rawType as ItemType) 
          : 'invoice';

        const name = getVal(parts, 'recipient_name');
        const phone = getVal(parts, 'recipient_phone');
        const address = getVal(parts, 'address_raw');
        const landmark = getVal(parts, 'landmark_description');
        const zoneCode = getVal(parts, 'zone_code').toUpperCase();
        const cod = parseFloat(getVal(parts, 'cod_amount')) || 0;
        const dueDate = getVal(parts, 'due_date');
        const paymentStatus: PaymentStatus = cod > 0 ? 'PENDING_COD' : 'NO_PAYMENT_REQUIRED';

        const errors: string[] = [];
        if (!name) errors.push('Nom du destinataire manquant');
        if (!phone) errors.push('Téléphone de contact absent');
        if (!address) errors.push('Adresse de livraison absente');
        
        const matchedZone = MOCK_ZONES.find(z => z.code === zoneCode);
        if (!matchedZone) {
          errors.push(`Zone non reconnue (${zoneCode || 'Vide'})`);
        }

        let suggestedAgent: FieldAgent | undefined;
        if (matchedZone) {
          const eligibleAgents = MOCK_AGENTS.filter(a => a.assigned_zone_codes.includes(matchedZone.code));
          if (eligibleAgents.length > 0) {
            eligibleAgents.sort((a, b) => a.active_workload_count - b.active_workload_count);
            suggestedAgent = eligibleAgents[0];
          }
        }

        let rowStatus: 'valid' | 'warning' | 'error' = 'valid';
        if (errors.length > 0) {
          rowStatus = !phone || !matchedZone ? 'error' : 'warning';
        }

        return {
          id: `row-${index}`,
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
          matched_zone_id: matchedZone?.id,
          suggested_agent_id: suggestedAgent?.id,
          suggested_agent_name: suggestedAgent?.full_name,
          status: rowStatus,
          validation_errors: errors
        };
      });

      setImportedRows(parsed);
      setIsProcessing(false);
      setCurrentStep(3);
    }, 400);
  };

  const handleCommitBatchWithChunks = async () => {
    setIsSubmittingBatch(true);
    setChunkProgress({ current: 0, total: importedRows.length });

    const payload = importedRows.map(r => ({
      organization_id: '00000000-0000-0000-0000-000000000001',
      campaign_id: '00000000-0000-0000-0000-000000000002',
      tracking_number: r.tracking_number,
      item_type: r.item_type,
      payment_status: r.payment_status,
      recipient_name: r.recipient_name,
      recipient_phone: r.recipient_phone,
      address_raw: r.address_raw,
      landmark_description: r.landmark_description,
      zone_id: r.matched_zone_id,
      cod_amount: r.cod_amount,
      due_date: r.due_date,
      status: 'pending'
    }));

    await batchInsertInvoices(payload, 500, (processed, total) => {
      setChunkProgress({ current: processed, total });
    });

    setIsSubmittingBatch(false);
    setCurrentStep(4);
  };

  const zoneSummaries = useMemo(() => {
    const map = new Map<string, BatchAssignmentSummary>();
    importedRows.forEach(row => {
      const zCode = row.zone_code || 'UNASSIGNED';
      const existing = map.get(zCode) || {
        zone_code: zCode,
        zone_name: MOCK_ZONES.find(z => z.code === zCode)?.sector_name || 'Zone Inconnue / A corriger',
        total_items: 0,
        total_cod: 0,
        assigned_agent: MOCK_AGENTS.find(a => a.id === row.suggested_agent_id),
        item_ids: []
      };

      existing.total_items += 1;
      existing.total_cod += row.cod_amount;
      existing.item_ids.push(row.id);
      map.set(zCode, existing);
    });
    return Array.from(map.values());
  }, [importedRows]);

  const filteredRows = useMemo(() => {
    if (filterStatus === 'all') return importedRows;
    return importedRows.filter(r => r.status === filterStatus);
  }, [importedRows, filterStatus]);

  const stats = useMemo(() => {
    const total = importedRows.length;
    const valid = importedRows.filter(r => r.status === 'valid').length;
    const warning = importedRows.filter(r => r.status === 'warning').length;
    const error = importedRows.filter(r => r.status === 'error').length;
    const totalCod = importedRows.reduce((sum, r) => sum + r.cod_amount, 0);
    return { total, valid, warning, error, totalCod };
  }, [importedRows]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Importation Massive & Lotissement par Zone
              </h1>
              <p className="text-sm text-slate-400">
                Support jusqu&apos;à 10 000+ lignes, découpage territorial & bordereaux de sortie
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          {[
            { num: 1, label: 'Fichier' },
            { num: 2, label: 'Mapping' },
            { num: 3, label: 'Lotissement' },
            { num: 4, label: 'Bordereaux' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentStep === s.num
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : currentStep > s.num
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                  : 'text-slate-500'
              }`}
            >
              <span>{s.num}.</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: FILE UPLOAD */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <div>
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Campagne Active</label>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="block mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                >
                  <option>Campagne Factures Electricité - Août 2026</option>
                  <option>Distribution Relevés Bancaires Trimestriels</option>
                  <option>Campagne Chèques & Pli Confidentiel Telecom</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleLoadSample}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold rounded-xl border border-slate-700"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Charger un Fichier Démo (Factures Abidjan / Dakar)
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition-colors rounded-2xl p-12 text-center bg-slate-900/30 flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
              <UploadCloud className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Glissez-déposez votre fichier de distribution ici</h3>
              <p className="text-sm text-slate-400 mt-1">Formats supportés : .CSV, .XLSX (Jusqu&apos;à 10 000 factures)</p>
            </div>
            <label className="cursor-pointer px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30">
              Parcourir les fichiers
              <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* STEP 2: COLUMN MAPPING */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">Fichier chargé : <strong className="text-white">{fileName}</strong></span>
            </div>
            <button onClick={() => setCurrentStep(1)} className="text-xs text-slate-400 hover:text-slate-200 underline">
              Changer de fichier
            </button>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Correspondance Dynamique des Colonnes CSV / Database
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'N° Référence / Facture', key: 'tracking_number' },
                { label: 'Type d\'article', key: 'item_type' },
                { label: 'Nom du Destinataire', key: 'recipient_name' },
                { label: 'Téléphone Destinataire', key: 'recipient_phone' },
                { label: 'Adresse Complète', key: 'address_raw' },
                { label: 'Repère Visuel (Landmark)', key: 'landmark_description' },
                { label: 'Code Zone / Quartier', key: 'zone_code' },
                { label: 'Montant à Encaisser (COD)', key: 'cod_amount' },
                { label: 'Date d\'échéance', key: 'due_date' },
              ].map((col) => (
                <div key={col.key} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <label className="text-xs text-slate-400 block mb-1 font-medium">{col.label}</label>
                  <select
                    value={(columnMapping as Record<string, string>)[col.key]}
                    onChange={(e) => setColumnMapping({ ...columnMapping, [col.key]: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    {['Reference', 'Type', 'Destinataire', 'Telephone', 'Adresse', 'Repere_Visuel', 'Zone_Code', 'Montant_COD', 'Echeance'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={processAndMatchData}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calcul du Lotissement par Zone...
                </>
              ) : (
                <>
                  Lancer le Lotissement & Matching
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BATCHING RESULTS & BORDEREAUX PREVIEW */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Articles</span>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-800/40">
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Conformes
              </span>
              <p className="text-2xl font-bold text-emerald-300 mt-1">{stats.valid}</p>
            </div>
            <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-800/40">
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Avertissements
              </span>
              <p className="text-2xl font-bold text-amber-300 mt-1">{stats.warning}</p>
            </div>
            <div className="bg-rose-950/30 p-4 rounded-xl border border-rose-800/40">
              <span className="text-xs text-rose-400 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Erreurs
              </span>
              <p className="text-2xl font-bold text-rose-300 mt-1">{stats.error}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Cumul COD</span>
              <p className="text-xl font-bold text-indigo-300 mt-1">{stats.totalCod.toLocaleString()} FCFA</p>
            </div>
          </div>

          {/* Batches by Zone Overview Grid */}
          <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Lots de Distribution Générés par Zone ({zoneSummaries.length} Lots)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zoneSummaries.map((b) => (
                <div key={b.zone_code} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
                      {b.zone_code}
                    </span>
                    <span className="text-xs text-slate-400">{b.total_items} articles</span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200">{b.zone_name}</h4>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{b.assigned_agent?.full_name || 'Chef de Zone'}</span>
                    </div>
                    
                    <button
                      onClick={() => setActivePrintBatch(b)}
                      className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" /> Bordereau
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button onClick={() => setCurrentStep(2)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">
              Retour au Mapping
            </button>

            <button
              onClick={handleCommitBatchWithChunks}
              disabled={isSubmittingBatch}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/30"
            >
              {isSubmittingBatch ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Insertion des Lots en cours...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Valider et Générer les Bordereaux de Sortie
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: BORDEREAUX IMPRIMABLES */}
      {currentStep === 4 && (
        <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Importation & Bordereaux Générés !</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Les {stats.total} factures ont été réparties en {zoneSummaries.length} lots géographiques. Vous pouvez désormais imprimer les bordereaux de sortie pour chaque agent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-4">
            {zoneSummaries.map(b => (
              <div key={b.zone_code} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-400">{b.zone_code}</span>
                  <p className="text-xs text-slate-300">{b.total_items} articles</p>
                </div>
                <button
                  onClick={() => setActivePrintBatch(b)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Bordereau
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BATCH MANIFEST PRINT MODAL */}
      {activePrintBatch && (
        <BatchManifestPrintModal
          batch={activePrintBatch}
          items={importedRows}
          campaignTitle={selectedCampaign}
          onClose={() => setActivePrintBatch(null)}
        />
      )}
    </div>
  );
}
