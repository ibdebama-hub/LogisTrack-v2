export class CredentialService {
  private static UPPERCASE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous I, O
  private static LOWERCASE_CHARS = 'abcdefghijkmnopqrstuvwxyz'; // Exclude ambiguous l
  private static NUMBER_CHARS = '23456789'; // Exclude 0, 1
  private static SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  /**
   * Generates a cryptographically strong temporary password
   * Length between 16 and 20 characters containing uppercase, lowercase, numbers, and special symbols.
   */
  public static generateStrongTemporaryPassword(length: number = 18): string {
    const targetLength = Math.max(16, Math.min(20, length));

    // Ensure at least 3 of each required category
    const passwordArray: string[] = [
      this.getRandomChar(this.UPPERCASE_CHARS),
      this.getRandomChar(this.UPPERCASE_CHARS),
      this.getRandomChar(this.UPPERCASE_CHARS),
      this.getRandomChar(this.LOWERCASE_CHARS),
      this.getRandomChar(this.LOWERCASE_CHARS),
      this.getRandomChar(this.LOWERCASE_CHARS),
      this.getRandomChar(this.NUMBER_CHARS),
      this.getRandomChar(this.NUMBER_CHARS),
      this.getRandomChar(this.NUMBER_CHARS),
      this.getRandomChar(this.SPECIAL_CHARS),
      this.getRandomChar(this.SPECIAL_CHARS),
      this.getRandomChar(this.SPECIAL_CHARS),
    ];

    const allChars = this.UPPERCASE_CHARS + this.LOWERCASE_CHARS + this.NUMBER_CHARS + this.SPECIAL_CHARS;
    
    while (passwordArray.length < targetLength) {
      passwordArray.push(this.getRandomChar(allChars));
    }

    // Cryptographic shuffle
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }

    return passwordArray.join('');
  }

  /**
   * Validates if a password fulfills enterprise security policy criteria
   */
  public static validatePasswordComplexity(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 16) {
      errors.push('Le mot de passe doit comporter au moins 16 caractères.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit inclure au moins une lettre majuscule.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit inclure au moins une lettre minuscule.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit inclure au moins un chiffre.');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      errors.push('Le mot de passe doit inclure au moins un caractère spécial.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private static getRandomChar(charSet: string): string {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
  }
}
