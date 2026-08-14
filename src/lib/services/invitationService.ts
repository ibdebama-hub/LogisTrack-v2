import { TenantInvitation, InvitationStatus } from '../../types/saasOnboarding';
import { CredentialService } from './credentialService';
import { auditLogService } from './auditLogService';

const MOCK_INVITATIONS: TenantInvitation[] = [
  {
    id: 'inv-101',
    tenant_id: 'tenant-101',
    tenant_name: 'Logistics West Africa (Siège Abidjan)',
    email: 'k.toure@lwa-logistics.ci',
    first_name: 'Kouassi',
    last_name: 'Touré',
    role: 'Dispatcher Administrator',
    invitation_token: 'tok-lwa-88492019',
    status: 'ACCEPTED',
    expires_at: '2026-08-10T12:00:00Z',
    created_at: '2026-08-01T09:00:00Z',
    accepted_at: '2026-08-01T10:15:00Z'
  },
  {
    id: 'inv-102',
    tenant_id: 'tenant-102',
    tenant_name: 'Bamako Express Distribution',
    email: 'm.keita@bamako-express.ml',
    first_name: 'Moussa',
    last_name: 'Keïta',
    role: 'Dispatcher Administrator',
    invitation_token: 'tok-bmk-44910283',
    status: 'PENDING',
    expires_at: '2026-08-12T18:00:00Z',
    created_at: '2026-08-05T14:30:00Z'
  },
  {
    id: 'inv-103',
    tenant_id: 'tenant-103',
    tenant_name: 'Sahel Telecoms & Distribution',
    email: 'a.diallo@sahel-telecom.ne',
    first_name: 'Amadou',
    last_name: 'Diallo',
    role: 'Dispatcher Administrator',
    invitation_token: 'tok-shl-11029384',
    status: 'EXPIRED',
    expires_at: '2026-08-04T12:00:00Z',
    created_at: '2026-08-01T12:00:00Z'
  }
];

export class InvitationService {
  private static invitationsStore: TenantInvitation[] = [...MOCK_INVITATIONS];

  public static async fetchAllInvitations(): Promise<TenantInvitation[]> {
    return this.invitationsStore;
  }

  public static async createInvitation(data: {
    tenant_id: string;
    tenant_name: string;
    email: string;
    first_name: string;
    last_name: string;
  }): Promise<{ invitation: TenantInvitation; temp_password: string }> {
    const tempPassword = CredentialService.generateStrongTemporaryPassword(18);
    const token = `inv-tok-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newInvitation: TenantInvitation = {
      id: `inv-${Date.now()}`,
      tenant_id: data.tenant_id,
      tenant_name: data.tenant_name,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: 'Dispatcher Administrator',
      invitation_token: token,
      temp_password: tempPassword,
      status: 'PENDING',
      expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };

    this.invitationsStore.unshift(newInvitation);

    await auditLogService.logEvent({
      actor_id: 'super-admin-01',
      actor_name: 'Super Admin System',
      actor_role: 'super_admin',
      action_type: 'USER_LOGIN',
      entity_type: 'TENANT',
      entity_id: data.tenant_id,
      details: {
        email: data.email,
        token,
        event: 'INVITATION_CREATED'
      }
    });

    return { invitation: newInvitation, temp_password: tempPassword };
  }

  public static async resendInvitation(invitationId: string): Promise<TenantInvitation> {
    const inv = this.invitationsStore.find(i => i.id === invitationId);
    if (!inv) throw new Error('Invitation non trouvée.');

    inv.status = 'PENDING';
    inv.expires_at = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

    await auditLogService.logEvent({
      actor_id: 'super-admin-01',
      actor_name: 'Super Admin System',
      actor_role: 'super_admin',
      action_type: 'USER_LOGIN',
      entity_type: 'TENANT',
      entity_id: inv.tenant_id,
      details: { email: inv.email, event: 'INVITATION_RESENT' }
    });

    return inv;
  }

  public static async cancelInvitation(invitationId: string): Promise<TenantInvitation> {
    const inv = this.invitationsStore.find(i => i.id === invitationId);
    if (!inv) throw new Error('Invitation non trouvée.');

    inv.status = 'CANCELLED';

    await auditLogService.logEvent({
      actor_id: 'super-admin-01',
      actor_name: 'Super Admin System',
      actor_role: 'super_admin',
      action_type: 'USER_LOGIN',
      entity_type: 'TENANT',
      entity_id: inv.tenant_id,
      details: { email: inv.email, event: 'INVITATION_CANCELLED' }
    });

    return inv;
  }

  public static async extendInvitation(invitationId: string, additionalHours: number = 48): Promise<TenantInvitation> {
    const inv = this.invitationsStore.find(i => i.id === invitationId);
    if (!inv) throw new Error('Invitation non trouvée.');

    const currentExpires = new Date(inv.expires_at).getTime();
    inv.expires_at = new Date(currentExpires + additionalHours * 3600 * 1000).toISOString();
    inv.status = 'PENDING';

    return inv;
  }

  /**
   * Generates a fully formatted HTML Email preview string
   */
  public static generateInvitationEmailHtml(data: {
    client_name: string;
    admin_name: string;
    email: string;
    temp_password?: string;
    activation_url: string;
    expires_at: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
          .card { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 32px; }
          .logo { font-size: 24px; font-weight: bold; color: #6366f1; text-transform: uppercase; letter-spacing: 2px; }
          .title { font-size: 20px; font-weight: bold; color: #ffffff; margin-top: 16px; }
          .badge { display: inline-block; background-color: #312e81; color: #a5b4fc; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-top: 8px; }
          .box { background-color: #0f172a; border: 1px solid #475569; border-radius: 12px; padding: 16px; margin: 24px 0; font-family: monospace; }
          .btn { display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; margin-top: 16px; text-align: center; }
          .footer { font-size: 12px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #334155; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">LOGISTRACK V2</div>
          <div class="badge">SaaS Enterprise Delivery Platform</div>
          <div class="title">Bienvenue sur LOGISTRACK V2, ${data.admin_name} !</div>
          <p>Votre organisation <strong>${data.client_name}</strong> a été provisionnée avec succès sur la plateforme LOGISTRACK V2.</p>
          <p>Voici vos identifiants d'accès d'administrateur principal :</p>
          
          <div class="box">
            <div><strong>Identifiant (Email) :</strong> ${data.email}</div>
            ${data.temp_password ? `<div style="margin-top: 8px;"><strong>Mot de passe temporaire :</strong> <span style="color: #38bdf8;">${data.temp_password}</span></div>` : ''}
            <div style="margin-top: 8px; font-size: 11px; color: #f43f5e;">⚠️ Ce mot de passe temporaire expire le : ${new Date(data.expires_at).toLocaleString('fr-FR')}</div>
          </div>

          <p>Pour des raisons de sécurité, votre première connexion vous imposera de définir immédiatement un nouveau mot de passe personnalisé.</p>

          <a href="${data.activation_url}" class="btn">Activer Mon Compte Administrateur</a>

          <div class="footer">
            Cet e-mail est strictement confidentiel. Si vous n'êtes pas le destinataire désigné, veuillez ne pas cliquer sur le lien.<br>
            © 2026 LOGISTRACK V2 Engineering — Tous droits réservés.
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
