/**
 * Authorization Policy Rules & Context Verification
 * Source of Truth: Product Specification Sections 1.6, 4.2 & ADR-001/002
 */

import { SeniorSession, AdminSession, CapsuleState } from '@capsule/domain';

export type AuthRole = 'senior' | 'admin';

export interface SecurityContext {
  role: AuthRole;
  capsuleId: string;
  seniorSession?: SeniorSession;
  adminSession?: AdminSession;
}

export class AuthorizationPolicy {
  /**
   * Evaluates if a security context can read capsule content
   */
  static canReadCapsule(context: SecurityContext, targetCapsuleId: string, capsuleState: CapsuleState): boolean {
    if (context.capsuleId !== targetCapsuleId) {
      return false;
    }
    if (capsuleState === 'deleted') {
      return false;
    }
    // Seniors & Admins can browse active and archived capsules
    return capsuleState === 'active' || capsuleState === 'archived';
  }

  /**
   * Evaluates if a senior session can submit content to the capsule
   */
  static canSubmitContent(context: SecurityContext, targetCapsuleId: string, capsuleState: CapsuleState): boolean {
    if (context.role !== 'senior' && context.role !== 'admin') {
      return false;
    }
    if (context.capsuleId !== targetCapsuleId) {
      return false;
    }
    // Writes are strictly disabled on archived or deleted capsules
    return capsuleState === 'active';
  }

  /**
   * Evaluates if an admin session can execute administrative actions (moderate, rotate code, change settings)
   */
  static canPerformAdminAction(context: SecurityContext, targetCapsuleId: string): boolean {
    if (context.role !== 'admin' || !context.adminSession) {
      return false;
    }
    return context.capsuleId === targetCapsuleId;
  }
}
