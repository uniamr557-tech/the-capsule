/**
 * Access Code Entity & Generation Logic
 * Source of Truth: ADR-002 & Product Specification Section 4.2
 */

import { createHmac, randomBytes } from 'crypto';

/** Non-ambiguous character set for mobile usability (excludes 0, O, 1, I, l) */
export const NON_AMBIGUOUS_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export interface AccessCodeVersion {
  id: string;
  capsuleId: string;
  verifierHash: string;
  generation: number;
  activatedAt: Date;
  expiresAt: Date | null;
  revokedAt: Date | null;
  rotationReason: 'manual' | 'scheduled' | 'security_revocation';
}

export class AccessCodeManager {
  /**
   * Generates a cryptographically random human-readable access code (default 8 chars)
   */
  static generateCode(length = 8): string {
    const chars: string[] = [];
    const charsetLen = NON_AMBIGUOUS_CHARSET.length;
    const randomBuffer = randomBytes(length);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBuffer[i] % charsetLen;
      chars.push(NON_AMBIGUOUS_CHARSET[randomIndex]);
    }

    return chars.join('');
  }

  /**
   * Normalizes input code (uppercase, trim spaces)
   */
  static normalizeCode(rawCode: string): string {
    return rawCode.trim().toUpperCase();
  }

  /**
   * Computes salted HMAC hash of access code for storage at rest
   */
  static hashAccessCode(code: string, salt: string): string {
    const normalized = this.normalizeCode(code);
    return createHmac('sha256', salt).update(normalized).digest('hex');
  }

  /**
   * Verifies an input code against a stored verifier hash using constant-time comparison
   */
  static verifyCode(inputCode: string, storedHash: string, salt: string): boolean {
    const computedHash = this.hashAccessCode(inputCode, salt);
    if (computedHash.length !== storedHash.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return result === 0;
  }
}
