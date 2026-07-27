/**
 * Senior Access API Contracts & Request/Response Types
 * Source of Truth: Product Specification Section 10
 */

export interface CreateAccessSessionRequest {
  code: string;
}

export interface CreateAccessSessionResponse {
  sessionId: string;
  capsuleSlug: string;
  capsuleName: string;
  expiresAt: string; // ISO 8601 string
}

export interface CapsulePresentationResponse {
  id: string;
  slug: string;
  name: string;
  schoolName: string;
  graduationYear: number;
  welcomeText: string | null;
  accentTheme: string;
  state: 'draft' | 'active' | 'archived' | 'deleted';
  archivedAt: string | null;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  requestId: string;
  details?: Record<string, unknown>;
}
