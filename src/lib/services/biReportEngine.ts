import { BiExecutiveKpis, BiScorecardItem } from '../../types/biAnalytics';

export function exportBiReport(
  kpis: BiExecutiveKpis,
  scorecards: BiScorecardItem[],
  format: 'CSV' | 'PDF' | 'EXCEL' = 'CSV'
): void {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `RAPPORT_EXECUTIVE_BI_LOGISTRACK_${dateStr}`;

  if (format === 'CSV') {
    let csv = `Rapport Business Intelligence Enterprise - LogisTrack V2\nDate,${dateStr}\n\n`;
    csv += `Indicateur Executif,Valeur\n`;
    csv += `Campagnes Actives,${kpis.active_campaigns}\n`;
    csv += `Missions Livrees,${kpis.delivered_missions} / ${kpis.total_missions}\n`;
    csv += `Respect SLA %,${kpis.sla_compliance_rate}%\n`;
    csv += `POD Validés,${kpis.pod_validated} / ${kpis.pod_generated}\n`;
    csv += `COD Encaisse,${kpis.cod_collected} XOF / ${kpis.cod_expected} XOF\n`;
    csv += `Taux Recouvrement %,${kpis.cod_recovery_rate}%\n\n`;

    csv += `Scorecard Performance Entites,Type,Score,Note,Succes %,SLA %\n`;
    scorecards.forEach((s) => {
      csv += `${s.entity_name},${s.entity_type},${s.score},${s.rating},${s.success_rate}%,${s.sla_rate}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const htmlContent = `
      <html>
        <head><title>${filename}</title></head>
        <body style="font-family: Arial; padding: 40px; background: #090d16; color: #fff;">
          <h1>Rapport Exécutif Business Intelligence LogisTrack V2</h1>
          <h2>Date : ${dateStr}</h2>
          <hr />
          <h3>Indicateurs Clés</h3>
          <ul>
            <li>Campagnes Actives : ${kpis.active_campaigns}</li>
            <li>Missions Livrées : ${kpis.delivered_missions} / ${kpis.total_missions}</li>
            <li>Taux Respect SLA : ${kpis.sla_compliance_rate}%</li>
            <li>COD Encaissé : ${kpis.cod_collected.toLocaleString()} XOF (${kpis.cod_recovery_rate}%)</li>
          </ul>
        </body>
      </html>
    `;
    const win = window.open();
    if (win) win.document.write(htmlContent);
  }
}
