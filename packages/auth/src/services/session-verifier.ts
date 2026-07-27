/**
 * Session Verification & Cryptographic Token Utilities
 */

import { createHash, randomBytes } from 'crypto';

export class SessionTokenManager {
  /** Generates opaque 32-byte session token */
  static generateRawToken(): string {
    return randomBytes(32).toString('hex');
  }

  /** Hashes raw token for database storage */
  static hashToken(rawToken: string, salt: string): string {
    return createHash('sha256').update(`${rawToken}:${salt}`).digest('hex');
  }

  /** Anonymizes IP address to salted hash for abuse logs */
  static hashIpAddress(ip: string, salt: string): string {
    return createHash('sha256').update(`ip:${ip}:${salt}`).digest('hex');
  }

  /** Anonymizes User-Agent string to hash */
  static hashUserAgent(ua: string, salt: string): string {
    return createHash('sha256').update(`ua:${ua}:${salt}`).digest('hex');
  }
}
