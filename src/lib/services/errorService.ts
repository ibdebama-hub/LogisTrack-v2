export type ErrorCategory =
  | 'AUTHENTICATION'
  | 'AUTHORIZATION'
  | 'VALIDATION'
  | 'DATABASE'
  | 'NETWORK'
  | 'PAYMENT_COD'
  | 'PROOF_OF_DELIVERY'
  | 'GPS_LOCATION'
  | 'FILE_IMPORT_EXPORT'
  | 'SYSTEM';

export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AppErrorDetails {
  code: string;
  category: ErrorCategory;
  message: string;
  userFacingMessage: string;
  recoveryAction?: string;
  severity: ErrorSeverity;
  originalError?: unknown;
  context?: Record<string, unknown>;
  timestamp: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly userFacingMessage: string;
  public readonly recoveryAction?: string;
  public readonly severity: ErrorSeverity;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(details: Omit<AppErrorDetails, 'timestamp'>) {
    super(details.message);
    this.name = 'AppError';
    this.code = details.code;
    this.category = details.category;
    this.userFacingMessage = details.userFacingMessage;
    this.recoveryAction = details.recoveryAction;
    this.severity = details.severity;
    this.context = details.context;
    this.timestamp = new Date().toISOString();
  }
}

/**
  Formats raw runtime or network errors into human-understandable AppError details.
 */
export function handleError(error: unknown, category: ErrorCategory = 'SYSTEM', contextMessage?: string): AppErrorDetails {
  const timestamp = new Date().toISOString();

  if (error instanceof AppError) {
    return {
      code: error.code,
      category: error.category,
      message: error.message,
      userFacingMessage: error.userFacingMessage,
      recoveryAction: error.recoveryAction,
      severity: error.severity,
      context: error.context,
      timestamp: error.timestamp,
    };
  }

  const rawMessage = error instanceof Error ? error.message : String(error);

  // Map known error patterns to explicit recovery suggestions
  if (rawMessage.includes('JWT') || rawMessage.includes('token') || rawMessage.includes('auth')) {
    return {
      code: 'ERR_AUTH_SESSION_EXPIRED',
      category: 'AUTHENTICATION',
      message: rawMessage,
      userFacingMessage: 'Votre session a expiré ou est invalide.',
      recoveryAction: 'Veuillez vous re-connecter à votre espace.',
      severity: 'HIGH',
      originalError: error,
      timestamp,
    };
  }

  if (rawMessage.includes('RLS') || rawMessage.includes('permission') || rawMessage.includes('denied')) {
    return {
      code: 'ERR_AUTH_FORBIDDEN',
      category: 'AUTHORIZATION',
      message: rawMessage,
      userFacingMessage: "Accès refusé pour cette opération ou organisation.",
      recoveryAction: "Vérifiez vos permissions auprès de l'administrateur de votre compte.",
      severity: 'HIGH',
      originalError: error,
      timestamp,
    };
  }

  if (rawMessage.includes('GPS') || rawMessage.includes('location') || rawMessage.includes('geolocation')) {
    return {
      code: 'ERR_GPS_SIGNAL_LOST',
      category: 'GPS_LOCATION',
      message: rawMessage,
      userFacingMessage: "Signal GPS imprécis ou désactivé sur votre terminal.",
      recoveryAction: "Activez la géolocalisation haute précision et réessayez la capture POD.",
      severity: 'MEDIUM',
      originalError: error,
      timestamp,
    };
  }

  return {
    code: 'ERR_GENERIC_OPERATIONAL',
    category,
    message: rawMessage,
    userFacingMessage: contextMessage || "Une anomalie s'est produite lors du traitement de la requête.",
    recoveryAction: "Veuillez rafraîchir la page ou réessayer ultérieurement.",
    severity: 'MEDIUM',
    originalError: error,
    timestamp,
  };
}
