/**
 * Capsule & Admin Identity Domain Entities
 * Source of Truth: Technical Specification Section 9
 */

import { CapsuleState } from './lifecycle';

export interface CapsuleBranding {
  welcomeText: string | null;
  accentTheme: 'marigold' | 'lakeBlue' | 'lilac' | 'poppy' | 'evergreen';
  coverMediaId: string | null;
}

export interface Capsule {
  id: string;
  slug: string;
  name: string;
  schoolName: string;
  graduationYear: number;
  timezone: string;
  branding: CapsuleBranding;
  state: CapsuleState;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminIdentity {
  id: string;
  capsuleId: string;
  credentialProvider: 'magic_link';
  credentialSubject: string; // Admin Email Address
  recoverySecretHash: string;
  lastAuthenticatedAt: Date | null;
  createdAt: Date;
}
