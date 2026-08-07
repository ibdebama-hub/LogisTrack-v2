import { SaaSInvoice } from '@/types/saasPlatform';

export function generateSaaSInvoicePdf(invoice: SaaSInvoice): string {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Facture SaaS — ${invoice.invoice_number}</title>
      <style>
        body { font-family: Arial, sans-serif; background: #090d16; color: #fff; padding: 40px; }
        .card { background: #0f172a; border: 1px solid #334155; border-radius: 20px; padding: 30px; max-width: 700px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 22px; font-weight: 900; color: #6366f1; }
        .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; font-size: 13px; }
        .label { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 4px; }
        .val { font-weight: 700; color: #fff; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <div class="logo">LOGISTRACK V2 SAAS PLATFORM</div>
            <div style="font-size:12px; color:#94a3b8; margin-top:4px;">FACTURE D'ABONNEMENT ENTERPRISE</div>
          </div>
          <div style="background:#064e3b; color:#34d399; font-weight:800; padding:6px 12px; border-radius:999px; font-size:12px;">
            ${invoice.status}
          </div>
        </div>

        <div class="grid">
          <div>
            <span class="label">N° de Facture</span>
            <span class="val" style="color:#818cf8; font-family:monospace;">${invoice.invoice_number}</span>
          </div>
          <div>
            <span class="label">Organisation Cliente</span>
            <span class="val">${invoice.tenant_name}</span>
          </div>
          <div>
            <span class="label">Période de Facturation</span>
            <span class="val">${invoice.billing_period}</span>
          </div>
          <div>
            <span class="label">Montant Total TTC</span>
            <span class="val" style="color:#34d399; font-family:monospace; font-size:16px;">${invoice.amount.toLocaleString()} ${invoice.currency}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
}
