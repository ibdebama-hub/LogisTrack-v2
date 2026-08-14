import { CommercialProposal } from '../../types/crm';

export const MOCK_PROPOSALS: CommercialProposal[] = [
  {
    id: 'prop-101',
    lead_id: 'lead-102',
    proposal_number: 'PROP-2026-042',
    plan_code: 'PROFESSIONAL',
    billing_cycle: 'ANNUAL',
    monthly_amount: 450000,
    annual_discount_pct: 10,
    terms_conditions: 'Offre valable 30 jours. Inclus support 24/7 et formation 5 dispatchers.',
    status: 'SENT',
    valid_until: '2026-09-01',
    created_at: '2026-08-01'
  }
];

export class ProposalService {
  private static proposals: CommercialProposal[] = [...MOCK_PROPOSALS];

  public static async fetchProposals(): Promise<CommercialProposal[]> {
    return this.proposals;
  }

  public static async createProposal(data: Omit<CommercialProposal, 'id' | 'created_at'>): Promise<CommercialProposal> {
    const newProp: CommercialProposal = {
      ...data,
      id: `prop-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    this.proposals.unshift(newProp);
    return newProp;
  }

  public static generateProposalPdf(proposal: CommercialProposal, companyName: string): string {
    const totalAnnual = proposal.monthly_amount * 12 * (1 - proposal.annual_discount_pct / 100);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Proposition Commerciale ${proposal.proposal_number}</title>
          <style>
            body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; }
            .card { background: #1e293b; padding: 32px; border-radius: 20px; border: 1px solid #334155; }
            h1 { color: #818cf8; }
            .amount { font-size: 24px; color: #34d399; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>LOGISTRACK V2 — PROPOSITION COMMERCIALE</h1>
            <p><strong>N° Offre :</strong> ${proposal.proposal_number}</p>
            <p><strong>Client :</strong> ${companyName}</p>
            <p><strong>Plan sélectionné :</strong> ${proposal.plan_code}</p>
            <hr style="border-color: #334155;" />
            <p className="amount">Total Annuel : ${totalAnnual.toLocaleString('fr-FR')} XOF</p>
            <p><small>${proposal.terms_conditions}</small></p>
          </div>
        </body>
      </html>
    `;
  }
}
