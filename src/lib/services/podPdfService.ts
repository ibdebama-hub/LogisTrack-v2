import { PoDRecordEnterprise } from '../../types/podEnterprise';

export function generatePoDPdfCertificate(pod: PoDRecordEnterprise): string {
  // Generates an official HTML / Data-URI document representing the PoD Certificate
  const verificationUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://logistrack.app'}/verify/pod/${pod.pod_number}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Certificat de Preuve de Livraison (PoD) — ${pod.pod_number}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #090d16; color: #f8fafc; padding: 40px; }
        .card { background: #0f172a; border: 1px solid #334155; border-radius: 20px; padding: 30px; max-width: 800px; margin: 0 auto; shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 25px; }
        .logo { font-size: 24px; font-weight: 900; color: #6366f1; letter-spacing: -0.05em; }
        .badge { background: #064e3b; color: #34d399; border: 1px solid #059669; font-weight: 800; padding: 6px 14px; border-radius: 9999px; font-size: 12px; }
        .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 25px; font-size: 13px; }
        .label { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 4px; }
        .val { color: #f8fafc; font-weight: 700; }
        .qr-box { background: #020617; border: 1px solid #1e293b; border-radius: 16px; padding: 20px; text-align: center; margin-top: 25px; }
        .media-box { background: #020617; border: 1px solid #1e293b; border-radius: 16px; padding: 15px; margin-top: 15px; text-align: center; }
        .sig-img { max-height: 100px; border-radius: 8px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <div class="logo">LOGISTRACK V2</div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">CERTIFICAT OFFICIEL PROOF OF DELIVERY</div>
          </div>
          <div class="badge">PRODUCED & CERTIFIED BY DISPATCH</div>
        </div>

        <div class="grid">
          <div>
            <span class="label">N° de Preuve PoD</span>
            <span class="val" style="color: #818cf8; font-family: monospace; font-size: 15px;">${pod.pod_number}</span>
          </div>
          <div>
            <span class="label">N° de Mission</span>
            <span class="val" style="font-family: monospace;">${pod.mission_number}</span>
          </div>
          <div>
            <span class="label">Client B2B</span>
            <span class="val">${pod.client_name}</span>
          </div>
          <div>
            <span class="label">Agent Livreur</span>
            <span class="val">${pod.agent_name}</span>
          </div>
          <div>
            <span class="label">Destinataire</span>
            <span class="val">${pod.recipient_name} (${pod.recipient_phone})</span>
          </div>
          <div>
            <span class="label">Horodatage Livraison</span>
            <span class="val">${pod.delivered_at}</span>
          </div>
          <div style="grid-column: span 2;">
            <span class="label">Adresse de Livraison</span>
            <span class="val">${pod.address_raw}</span>
          </div>
          <div>
            <span class="label">Coordonnées GPS Réelles</span>
            <span class="val" style="color: #34d399; font-family: monospace;">${pod.gps_lat.toFixed(4)}, ${pod.gps_lng.toFixed(4)}</span>
          </div>
          <div>
            <span class="label">Écart GPS & Conformité</span>
            <span class="val" style="color: #34d399;">${pod.gps_distance_diff_meters}m (${pod.conformance_status})</span>
          </div>
        </div>

        <div class="media-box">
          <span class="label" style="margin-bottom: 10px;">Signature Électronique Certifiée</span>
          <img src="${pod.signature_url}" class="sig-img" alt="Signature Client" />
          <div style="font-size: 10px; color: #64748b; margin-top: 8px; font-family: monospace;">SHA-256: ${pod.signature_hash}</div>
        </div>

        <div class="qr-box">
          <div style="font-[900]; font-size: 13px; color: #818cf8;">VÉRIFICATION D'AUTHENTICITÉ EN LIGNE</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Scannez ce QR Code ou accédez à l'URL ci-dessous :</div>
          <div style="font-family: monospace; font-size: 11px; color: #38bdf8; margin-top: 8px;">${verificationUrl}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
}
