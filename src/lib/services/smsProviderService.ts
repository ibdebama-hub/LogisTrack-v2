export interface SmsPayload {
  to_phone: string;
  message: string;
  sender_name?: string;
}

export class SmsProviderService {
  public static async sendSms(payload: SmsPayload): Promise<{ success: boolean; smsId: string }> {
    console.log(`[SmsProvider] Sending SMS to ${payload.to_phone}: ${payload.message}`);
    return {
      success: true,
      smsId: `sms-${Date.now()}`
    };
  }

  public static async sendOtp(phone: string, otpCode: string): Promise<boolean> {
    const msg = `LOGISTRACK V2: Votre code de vérification sécurisé est [${otpCode}]. Valide 5 minutes.`;
    const res = await this.sendSms({ to_phone: phone, message: msg });
    return res.success;
  }
}
