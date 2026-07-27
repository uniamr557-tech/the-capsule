/**
 * Access Code Repository Interface
 */

import { AccessCodeVersion } from '../entities/access-code';

export interface IAccessCodeRepository {
  findActiveCodeByCapsuleId(capsuleId: string): Promise<AccessCodeVersion | null>;
  saveCodeVersion(codeVersion: AccessCodeVersion): Promise<AccessCodeVersion>;
  rotateCodeAtomically(
    capsuleId: string,
    newCodeVersion: AccessCodeVersion,
    reason: 'manual' | 'scheduled' | 'security_revocation',
  ): Promise<AccessCodeVersion>;
}
