import * as XLSX from 'xlsx';

export interface TemplateRow {
  reference_client: string;
  type_item: 'FACTURE' | 'COURRIER_SIMPLE' | 'PLI_CONFIDENTIEL' | 'COLIS';
  nom_destinataire: string;
  telephone_destinataire: string;
  ville: string;
  quartier_secteur: string;
  point_de_repere: string;
  mode_reglement: 'SANS_ENCAISSEMENT' | 'PAYANT_COD';
  montant_cod: number;
  instructions_agent: string;
}

export const SAMPLE_TEMPLATE_ROWS: TemplateRow[] = [
  {
    reference_client: 'FAC-2026-0801',
    type_item: 'FACTURE',
    nom_destinataire: 'Amadou Diallo',
    telephone_destinataire: '+223 76 00 11 22',
    ville: 'Bamako',
    quartier_secteur: 'Hamdallaye ACI',
    point_de_repere: 'Près du château d\'eau, porte 12',
    mode_reglement: 'SANS_ENCAISSEMENT',
    montant_cod: 0,
    instructions_agent: 'Déposer en boîte aux lettres ou remettre au gardien'
  },
  {
    reference_client: 'CR-8849-B2B',
    type_item: 'PLI_CONFIDENTIEL',
    nom_destinataire: 'Mariama Camara',
    telephone_destinataire: '+224 622 44 55 66',
    ville: 'Conakry',
    quartier_secteur: 'Kaloum Centre-Ville',
    point_de_repere: 'Immeuble BCRG, 3ème étage, Bureau 304',
    mode_reglement: 'SANS_ENCAISSEMENT',
    montant_cod: 0,
    instructions_agent: 'Remise en main propre impérative contre signature tactile PoD'
  },
  {
    reference_client: 'CMD-9921-COD',
    type_item: 'COLIS',
    nom_destinataire: 'Koffi Jean-Marc',
    telephone_destinataire: '+225 07 58 90 12',
    ville: 'Abidjan',
    quartier_secteur: 'Cocody Riviera 3',
    point_de_repere: 'Face à la pharmacie de la Paix, Villa 14',
    mode_reglement: 'PAYANT_COD',
    montant_cod: 15000,
    instructions_agent: 'Encaissement espèces ou Wave avant remise du colis'
  }
];

/**
 * Generate and download CSV template with UTF-8 BOM (\uFEFF) for perfect Excel encoding
 */
export function downloadCsvTemplate() {
  const headers = [
    'reference_client',
    'type_item',
    'nom_destinataire',
    'telephone_destinataire',
    'ville',
    'quartier_secteur',
    'point_de_repere',
    'mode_reglement',
    'montant_cod',
    'instructions_agent'
  ];

  const rows = SAMPLE_TEMPLATE_ROWS.map(r => [
    `"${r.reference_client}"`,
    `"${r.type_item}"`,
    `"${r.nom_destinataire}"`,
    `"${r.telephone_destinataire}"`,
    `"${r.ville}"`,
    `"${r.quartier_secteur}"`,
    `"${r.point_de_repere}"`,
    `"${r.mode_reglement}"`,
    r.montant_cod,
    `"${r.instructions_agent}"`
  ]);

  const csvContent = [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
  const bom = '\uFEFF'; // UTF-8 Byte Order Mark
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'modele_importation_logistrack_v2.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download Excel (.xlsx) template dynamically
 */
export function downloadXlsxTemplate() {
  const worksheet = XLSX.utils.json_to_sheet(SAMPLE_TEMPLATE_ROWS);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Modele_Importation');

  // Auto-fit column widths
  worksheet['!cols'] = [
    { wch: 18 }, // reference_client
    { wch: 18 }, // type_item
    { wch: 22 }, // nom_destinataire
    { wch: 20 }, // telephone_destinataire
    { wch: 15 }, // ville
    { wch: 22 }, // quartier_secteur
    { wch: 35 }, // point_de_repere
    { wch: 20 }, // mode_reglement
    { wch: 14 }, // montant_cod
    { wch: 45 }  // instructions_agent
  ];

  XLSX.writeFile(workbook, 'modele_importation_logistrack_v2.xlsx');
}
