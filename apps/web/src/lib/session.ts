/**
 * Session Verification & Route Guard Helper
 * Source of Truth: Product Specification Section 4.2 & ADR-0002
 */

import { AccessCodeManager, SessionValidator, SeniorSession } from '@capsule/domain';
import { SessionTokenManager } from '@capsule/auth';

// Mock active capsule & access code for M4A presentation verification
export const DEMO_CAPSULE = {
  id: 'cap_2026_oakridge',
  slug: 'oakridge-2026',
  name: 'Class of 2026',
  schoolName: 'Oakridge Senior High School',
  graduationYear: 2026,
  timezone: 'America/New_York',
  welcomeText: 'A place for the moments you will want to remember forever.',
  accentTheme: 'marigold' as const,
  state: 'active' as const,
  archivedAt: null,
};

// Demo Access Code: "SENIOR26"
export const DEMO_CODE_SALT = 'capsule_demo_salt_2026';
export const DEMO_CODE_HASH = AccessCodeManager.hashAccessCode('SENIOR26', DEMO_CODE_SALT);

export class SessionGuardService {
  /**
   * Validates submitted class access code and generates scoped session if correct
   */
  static validateCodeAndCreateSession(inputCode: string): { success: boolean; session?: SeniorSession; error?: string } {
    const isValid = AccessCodeManager.verifyCode(inputCode, DEMO_CODE_HASH, DEMO_CODE_SALT);

    if (!isValid) {
      return {
        success: false,
        error: "That code isn't active. Ask your Senior Admin for the current one.",
      };
    }

    const sessionToken = SessionTokenManager.generateRawToken();
    const sessionHash = SessionTokenManager.hashToken(sessionToken, DEMO_CODE_SALT);

    const session: SeniorSession = {
      id: `sess_${Date.now()}`,
      capsuleId: DEMO_CAPSULE.id,
      sessionHash,
      codeVersionId: 'code_v1',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 Hours TTL
      revokedAt: null,
      ipHash: SessionTokenManager.hashIpAddress('127.0.0.1', DEMO_CODE_SALT),
      userAgentHash: SessionTokenManager.hashUserAgent('DemoBrowser', DEMO_CODE_SALT),
      createdAt: new Date(),
    };

    return { success: true, session };
  }

  /**
   * Verifies if a senior session is valid for a given capsule
   */
  static isSessionValid(session: SeniorSession | null, capsuleId: string): boolean {
    if (!session) return false;
    if (session.capsuleId !== capsuleId) return false;
    return SessionValidator.isSeniorSessionValid(session, 'code_v1');
  }
}
