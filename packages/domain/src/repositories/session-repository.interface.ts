/**
 * Session Repositories Interfaces
 */

import { SeniorSession, AdminSession } from '../entities/session';

export interface ISeniorSessionRepository {
  createSession(session: SeniorSession): Promise<SeniorSession>;
  findSessionByHash(sessionHash: string): Promise<SeniorSession | null>;
  revokeAllForCapsule(capsuleId: string): Promise<number>;
  revokeByCodeVersionId(codeVersionId: string): Promise<number>;
}

export interface IAdminSessionRepository {
  createSession(session: AdminSession): Promise<AdminSession>;
  findSessionByTokenHash(tokenHash: string): Promise<AdminSession | null>;
  updateReauthenticatedAt(sessionId: string, timestamp: Date): Promise<void>;
  revokeSession(sessionId: string): Promise<void>;
  revokeAllForAdmin(adminId: string): Promise<number>;
}
