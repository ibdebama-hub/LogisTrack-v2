import { OrganizationProfile, SmsGatewayConfigModel, SmsTemplate, SystemUser } from '../types/settings';

export const MOCK_ORGANIZATION_PROFILE: OrganizationProfile = {
  company_name: 'Logistics West Africa (LogisTrack V2)',
  logo_url: '',
  address: 'Avenue de la République, Kaloum, Conakry / Plateau, Abidjan',
  phone_support: '+224 620 00 00 00 / +225 07 00 11 22',
  email_support: 'support@logistrack.gn',
  nif_rcm: 'NIF: 904128-GN | RCCM: GN.KAL.2024.B.1092',
  default_currency: 'FCFA',
  theme_accent_color: '#4f46e5',
  print_footer_note: 'LogisTrack V2 Enterprise - Solution certifiée conforme de traçabilité des livraisons et plis.'
};

export const MOCK_SMS_GATEWAYS: SmsGatewayConfigModel[] = [
  {
    provider: 'ORANGE_SMS',
    provider_name: 'Orange SMS API (Afrique)',
    is_active: true,
    api_key: 'ogn_live_key_98420192840192',
    api_secret: 'secret_sec_8849201948102948',
    sender_id: 'LOGISTRACK',
    sms_balance_credits: 48500
  },
  {
    provider: 'HUB2',
    provider_name: 'Hub2 Messaging API',
    is_active: false,
    api_key: 'hub2_live_84920192',
    sender_id: 'LOGISTRACK',
    sms_balance_credits: 12000
  },
  {
    provider: 'TWILIO',
    provider_name: 'Twilio Programmable SMS',
    is_active: false,
    api_key: 'AC_89420192840192840192',
    api_secret: 'tw_sec_99482019284',
    sender_id: 'LOGISTRACK',
    sms_balance_credits: 5400
  },
  {
    provider: 'CUSTOM_WEBHOOK',
    provider_name: 'Passerelle HTTP / Custom Webhook',
    is_active: false,
    api_key: 'wh_bearer_89420',
    sender_id: 'LOGISTRACK',
    webhook_url: 'https://api.sms-partner.com/v1/send',
    sms_balance_credits: 0
  }
];

export const MOCK_SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Avis de Passage / Distribution imminente',
    event_trigger: 'DISPATCH_NOTICE',
    content: 'Bonjour {nom}, votre pli {ref} est pris en charge par notre livreur {agent}. Suivez votre livraison sur {lien}',
    is_enabled: true
  },
  {
    id: 'tmpl-2',
    name: 'Code OTP de Validation de Livraison',
    event_trigger: 'OTP_VALIDATION',
    content: 'Votre code de confirmation de livraison LogisTrack est : {otp_code}. À remettre à l\'agent à la réception de votre pli {ref}.',
    is_enabled: true
  },
  {
    id: 'tmpl-3',
    name: 'Avis de Dépôt / Boîte aux lettres',
    event_trigger: 'DELIVERY_PROOF_NOTICE',
    content: 'Votre pli {ref} a été déposé sous votre porte / boîte aux lettres par {agent}. Preuve et photo disponibles sur {lien}',
    is_enabled: true
  },
  {
    id: 'tmpl-4',
    name: 'Alerte Échec / Tentative de remise',
    event_trigger: 'FAILURE_ALERT',
    content: 'Tentative de remise infructueuse pour votre pli {ref}. Notre agent reprogrammera la livraison. Contact: {support_tel}',
    is_enabled: true
  }
];

export const MOCK_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'user-1',
    full_name: 'Yves Touré',
    email: 'yves.toure@logistrack.gn',
    phone: '+224 620 45 88 12',
    role: 'ADMINISTRATEUR',
    status: 'ACTIF',
    last_login: 'Aujourd\'hui à 19:30',
    zone_assigned: 'Siège (Toutes Zones)'
  },
  {
    id: 'user-2',
    full_name: 'Mamadou Diallo',
    email: 'm.diallo@logistrack.gn',
    phone: '+224 622 90 11 00',
    role: 'DISPATCHER',
    status: 'ACTIF',
    last_login: 'Aujourd\'hui à 18:45',
    zone_assigned: 'Kaloum Centre-Ville'
  },
  {
    id: 'user-3',
    full_name: 'Awa Koné',
    email: 'a.kone@logistrack.ci',
    phone: '+225 05 44 22 11 99',
    role: 'CAISSIER',
    status: 'ACTIF',
    last_login: 'Aujourd\'hui à 17:15',
    zone_assigned: 'Guichet Caisse Principal'
  },
  {
    id: 'user-4',
    full_name: 'Koffi Jean-Baptiste',
    email: 'k.jean@logistrack.ci',
    phone: '+225 07 58 90 12 34',
    role: 'CHEF_DE_ZONE',
    status: 'ACTIF',
    last_login: 'Hier à 14:10',
    zone_assigned: 'Cocody & Riviera'
  },
  {
    id: 'user-5',
    full_name: 'Ousmane Sow',
    email: 'o.sow@logistrack.sn',
    phone: '+221 77 412 90 80',
    role: 'AGENT_TERRAIN',
    status: 'ACTIF',
    last_login: 'Il y a 2 jours',
    zone_assigned: 'Dakar Plateau'
  },
  {
    id: 'user-6',
    full_name: 'Ibrahima Keita',
    email: 'i.keita@logistrack.gn',
    phone: '+224 622 11 44 77',
    role: 'AGENT_TERRAIN',
    status: 'SUSPENDU',
    last_login: 'Il y a 10 jours',
    zone_assigned: 'Ratoma'
  }
];
