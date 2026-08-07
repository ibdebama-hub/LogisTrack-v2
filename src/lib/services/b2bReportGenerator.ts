import { B2BExecutiveKpis } from '@/types/b2bClientPortal';

export type ReportFormat = 'PDF' | 'EXCEL' | 'CSV';

export function generateDynamicB2BReport(
  clientName: string,
  kpis: B2BExecutiveKpis,
  format: ReportFormat = 'CSV'
): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `RAPPORT_LOGISTRACK_${clientName.toUpperCase().replace(/\s+/g, '_')}_${dateStr}`;

  if (format === 'CSV') {
    const csvContent = `Rapport d'Execution B2B LogisTrack V2\nClient,${clientName}\nDate,${dateStr}\n\nIndicateur,Valeur\nCampagnes Actives,${kpis.active_campaigns}\nCampagnes Terminees,${kpis.completed_campaigns}\nMissions Totales,${kpis.total_missions}\nMissions Livrees,${kpis.delivered_missions}\nMissions Echouees,${kpis.failed_missions}\nPreuves POD Disponibles,${kpis.pod_available}\nCOD Attendu,${kpis.cod_expected} XOF\nCOD Encaisse,${kpis.cod_collected} XOF\nRespect SLA %,${kpis.sla_compliance_rate}%\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // PDF or EXCEL fallback HTML trigger
    const htmlContent = `
      <html>
        <head><title>${filename}</title></head>
        <body style="font-family: Arial; padding: 40px; background: #090d16; color: #fff;">
          <h1>Rapport Officiel d'Exécution B2B</h1>
          <h2>Client : ${clientName} — Date : ${dateStr}</h2>
          <hr />
          <ul>
            <li>Campagnes Actives : ${kpis.active_campaigns}</li>
            <li>Missions Livrées : ${kpis.delivered_missions} / ${kpis.total_missions}</li>
            <li>Montant COD Encaissé : ${kpis.cod_collected.toLocaleString()} XOF</li>
            <li>Taux de Respect SLA : ${kpis.sla_compliance_rate}%</li>
          </ul>
        </body>
      </html>
    `;
    const win = window.open();
    if (win) {
      win.document.write(htmlContent);
    }
  }
}
