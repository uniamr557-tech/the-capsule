/**
 * Session Domain Models
 * Source of Truth: Product Specification Section 4.2 & ADR-001/002
 */

export interface SeniorSession {
  id: string;
  capsuleId: string;
  sessionHash: string;
  codeVersionId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  ipHash: string;
  userAgentHash: string;
  createdAt: Date;
}

export interface AdminSession {
  id: string;
  adminId: string;
  capsuleId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  lastReauthenticatedAt: Date;
  ipHash: string;
  userAgentHash: string;
  createdAt: Date;
}

export class SessionValidator {
  static isSeniorSessionValid(session: SeniorSession, activeCodeVersionId: string): boolean {
    if (session.revokedAt !== null) {
      return false;
    }
    if (new Date() > session.expiresAt) {
      return false;
    }
    // Code rotation revokes sessions tied to earlier code versions
    return session.codeVersionId === activeCodeVersionId;
  }

  static isAdminSessionValid(session: AdminSession): boolean {
    if (session.revokedAt !== null) {
      return false;
    }
    return new Date() <= session.expiresAt;
  }

  static requiresReauthentication(session: AdminSession, maxAgeMs = 15 * 60 * 1000): boolean {
    const elapsed = Date.now() - session.lastReauthenticatedAt.getTime();
    return elapsed > maxAgeMs;
  }
}
