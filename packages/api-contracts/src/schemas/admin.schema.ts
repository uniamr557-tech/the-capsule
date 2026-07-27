/**
 * Senior Admin API Contracts & Request/Response Types
 * Source of Truth: Product Specification Section 10
 */

export interface RegenerateAccessCodeRequest {
  rotationReason: 'manual' | 'scheduled' | 'security_revocation';
}

export interface RegenerateAccessCodeResponse {
  generation: number;
  newCode: string; // Displayed ONCE to Admin
  activatedAt: string;
  revokedPriorSessionsCount: number;
}

export interface UpdateCapsuleBrandingRequest {
  welcomeText?: string | null;
  accentTheme?: 'marigold' | 'lakeBlue' | 'lilac' | 'poppy' | 'evergreen';
  coverMediaId?: string | null;
}

export interface ArchiveCapsuleRequest {
  confirmArchive: boolean;
}

export interface ArchiveCapsuleResponse {
  capsuleId: string;
  state: 'archived';
  archivedAt: string;
}
