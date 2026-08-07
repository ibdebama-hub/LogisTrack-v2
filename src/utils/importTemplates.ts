import * as XLSX from 'xlsx';

export interface TemplateRow {
  reference: string;
  item_type: 'FACTURE' | 'COURRIER' | 'COLIS';
  recipient_name: string;
  recipient_phone: string;
  city: string;
  district: string;
  landmark: string;
  payment_type: 'NO_PAYMENT_REQUIRED' | 'PENDING_COD';
  cod_amount: number;
  notes: string;
}

export const SAMPLE_TEMPLATE_DATA: TemplateRow[] = [
  {
    reference: 'FAC-2026-0801',
    item_type: 'FACTURE',
    recipient_name: 'Amadou Diallo',
    recipient_phone: '+223 76 00 11 22',
    city: 'Bamako',
    district: 'Bamako Coura',
    landmark: 'Près du château d\'eau, porte 12',
    payment_type: 'NO_PAYMENT_REQUIRED',
    cod_amount: 0,
    notes: 'Distribution simple en boîte aux lettres ou sous porte'
  },
  {
    reference: 'CR-8849',
    item_type: 'COURRIER',
    recipient_name: 'Société Ivoirienne de Banque (SIB)',
    recipient_phone: '+225 07 08 09 10 11',
    city: 'Abidjan',
    district: 'Plateau',
    landmark: 'Immeuble Jeceda, 4ème étage, Porte 402',
    payment_type: 'NO_PAYMENT_REQUIRED',
    cod_amount: 0,
    notes: 'Remise au secrétariat avec signature de décharge obligatiore'
  },
  {
    reference: 'COL-5512',
    item_type: 'COLIS',
    recipient_name: 'Pharmacie de la Renaissance',
    recipient_phone: '+225 05 99 88 77 66',
    city: 'Abidjan',
    district: 'Koumassi Remblais',
    landmark: 'Carrefour 3 Ampoules, à côté de la boulangerie',
    payment_type: 'PENDING_COD',
    cod_amount: 42500,
    notes: 'Encaissement COD obligatoire avant remise du colis'
  },
  {
    reference: 'FAC-2026-0802',
    item_type: 'FACTURE',
    recipient_name: 'Oumar Cissé',
    recipient_phone: '+223 66 55 44 33',
    city: 'Sikasso',
    district: 'Sikasso Centre',
    landmark: 'Avenue de l\'Indépendance, face marché',
    payment_type: 'PENDING_COD',
    cod_amount: 12500,
    notes: 'Facture soumise à encaissement espèces ou Mobile Money'
  },
  {
    reference: 'CR-9012',
    item_type: 'COURRIER',
    recipient_name: 'Cabinet Avocats & Associés',
    recipient_phone: '+223 70 12 34 56',
    city: 'Bamako',
    district: 'Hamdallaye ACI',
    landmark: 'Rue 380, Immeuble SOGEFIH',
    payment_type: 'NO_PAYMENT_REQUIRED',
    cod_amount: 0,
    notes: 'Convocation confidentielle - Appeler avant le passage'
  }
];

/**
 * Download CSV Template with UTF-8 BOM (\uFEFF) for perfect Excel compatibility
 */
export function downloadCSVTemplate() {
  const headers = [
    'reference',
    'item_type',
    'recipient_name',
    'recipient_phone',
    'city',
    'district',
    'landmark',
    'payment_type',
    'cod_amount',
    'notes'
  ];

  const rows = SAMPLE_TEMPLATE_DATA.map(row => [
    `"${row.reference}"`,
    `"${row.item_type}"`,
    `"${row.recipient_name}"`,
    `"${row.recipient_phone}"`,
    `"${row.city}"`,
    `"${row.district}"`,
    `"${row.landmark.replace(/"/g, '""')}"`,
    `"${row.payment_type}"`,
    row.cod_amount,
    `"${row.notes.replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'modele_importation_logistrack.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download Excel (.xlsx) Template generated dynamically via sheetjs/xlsx
 */
export function downloadExcelTemplate() {
  try {
    const worksheet = XLSX.utils.json_to_sheet(SAMPLE_TEMPLATE_DATA, {
      header: [
        'reference',
        'item_type',
        'recipient_name',
        'recipient_phone',
        'city',
        'district',
        'landmark',
        'payment_type',
        'cod_amount',
        'notes'
      ]
    });

    // Set column widths for comfortable reading
    worksheet['!cols'] = [
      { wch: 16 }, // reference
      { wch: 12 }, // item_type
      { wch: 28 }, // recipient_name
      { wch: 18 }, // recipient_phone
      { wch: 14 }, // city
      { wch: 20 }, // district
      { wch: 35 }, // landmark
      { wch: 22 }, // payment_type
      { wch: 14 }, // cod_amount
      { wch: 45 }  // notes
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Modele_Import_LogisTrack');

    XLSX.writeFile(workbook, 'modele_importation_logistrack.xlsx');
  } catch (err) {
    console.warn('[Excel Download Fallback] Falling back to CSV', err);
    downloadCSVTemplate();
  }
}
