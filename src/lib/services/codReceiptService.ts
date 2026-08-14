import { CodPaymentEnterprise } from '../../types/codEnterprise';

export function generateCodDigitalReceipt(cod: CodPaymentEnterprise): string {
  const verificationUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://logistrack.app'}/verify/cod/${cod.cod_number}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Reçu d'Encaissement COD — ${cod.cod_number}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #090d16; color: #f8fafc; padding: 40px; }
        .card { background: #0f172a; border: 1px solid #334155; border-radius: 20px; padding: 30px; max-width: 700px; margin: 0 auto; shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 25px; }
        .logo { font-size: 22px; font-weight: 900; color: #10b981; letter-spacing: -0.05em; }
        .badge { background: #064e3b; color: #34d399; border: 1px solid #059669; font-weight: 800; padding: 6px 14px; border-radius: 9999px; font-size: 12px; }
        .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 25px; font-size: 13px; }
        .label { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 4px; }
        .val { color: #f8fafc; font-weight: 700; }
        .amount-box { background: #020617; border: 2px border #059669; border-radius: 16px; p: 20px; text-align: center; margin: 20px 0; }
        .amount-val { font-size: 28px; font-weight: 900; color: #34d399; font-family: monospace; }
        .qr-box { background: #020617; border: 1px solid #1e293b; border-radius: 16px; padding: 20px; text-align: center; margin-top: 25px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <div class="logo">LOGISTRACK V2 COD</div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">REÇU OFFICIEL D'ENCAISSEMENT TERRAIN</div>
          </div>
          <div class="badge">PAIEMENT REÇU & CERTIFIÉ</div>
        </div>

        <div class="amount-box">
          <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Montant Total Encaissé</div>
          <div class="amount-val">${cod.amount_collected.toLocaleString()} ${cod.currency}</div>
          <div style="font-size: 12px; color: #818cf8; margin-top: 6px; font-weight: 700;">Mode : ${cod.payment_method}</div>
        </div>

        <div class="grid">
          <div>
            <span class="label">N° de Reçu COD</span>
            <span class="val" style="color: #34d399; font-family: monospace; font-size: 15px;">${cod.cod_number}</span>
          </div>
          <div>
            <span class="label">N° de Mission</span>
            <span class="val" style="font-family: monospace;">${cod.mission_number}</span>
          </div>
          <div>
            <span class="label">Client Donneur d'Ordres</span>
            <span class="val">${cod.client_name}</span>
          </div>
          <div>
            <span class="label">Agent Encaisseur</span>
            <span class="val">${cod.agent_name}</span>
          </div>
          <div>
            <span class="label">Destinataire Payeur</span>
            <span class="val">${cod.recipient_name} (${cod.recipient_phone})</span>
          </div>
          <div>
            <span class="label">Date & Heure Enregistrement</span>
            <span class="val">${cod.created_at}</span>
          </div>
        </div>

        <div class="qr-box">
          <div style="font-weight: 900; font-size: 13px; color: #34d399;">VÉRIFICATION D'AUTHENTICITÉ DU REÇU</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Scannez ce QR Code ou accédez à l'URL ci-dessous :</div>
          <div style="font-family: monospace; font-size: 11px; color: #38bdf8; margin-top: 8px;">${verificationUrl}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
}
