export interface EmailTemplatePayload {
  to: string;
  subject: string;
  template_id: string;
  variables: Record<string, string>;
}

export class EmailProviderService {
  public static async sendEmail(payload: EmailTemplatePayload): Promise<{ success: boolean; messageId: string }> {
    console.log(`[EmailProvider] Sending ${payload.template_id} to ${payload.to}`);
    return {
      success: true,
      messageId: `msg-${Date.now()}`
    };
  }

  public static generateHtmlTemplate(title: string, bodyText: string, ctaText?: string, ctaUrl?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"/><title>${title}</title></head>
        <body style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 24px; border-radius: 16px;">
            <h1 style="color: #818cf8; margin-top: 0;">LOGISTRACK V2</h1>
            <h2 style="color: #ffffff;">${title}</h2>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">${bodyText}</p>
            ${
              ctaText && ctaUrl
                ? `<a href="${ctaUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 16px;">${ctaText}</a>`
                : ''
            }
          </div>
        </body>
      </html>
    `;
  }
}
