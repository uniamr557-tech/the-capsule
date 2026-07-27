/**
 * Content Entities & Domain Definitions
 * Source of Truth: Product Specification Sections 4.3, 9 & ADR-0004
 */

import { ContentStatus } from './lifecycle';
export { ContentStatus };

export type ContentType = 'photo' | 'video' | 'memory' | 'message';

export interface ParticipantHandle {
  id: string;
  capsuleId: string;
  sessionId: string | null;
  displayNameRaw: string;
  displayNameNormalized: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  capsuleId: string;
  labelNormalized: string;
  labelDisplay: string;
}

export interface MediaAssetRef {
  id: string;
  kind: 'image' | 'video';
  originalFilename: string;
  detectedMime: string;
  bytes: number;
  width?: number;
  height?: number;
  durationMs?: number;
  altText?: string;
  processingStatus: 'pending' | 'ready' | 'failed';
}

export interface ContentItem {
  id: string;
  capsuleId: string;
  authorHandleId: string;
  type: ContentType;
  title: string | null;
  body: string | null;       // Long-form for 'memory', text for 'message'
  caption: string | null;    // Caption for 'photo' / 'video'
  mediaAssetId: string | null; // Attached photo/video asset ID
  momentAt: Date | null;     // Senior-year moment date
  status: ContentStatus;
  submittedAt: Date;
  hiddenAt: Date | null;
  deletedAt: Date | null;
  statusReason: string | null;
  tags: Tag[];
}

export class ContentItemValidator {
  /** Normalizes author display name (trims whitespace, compresses spaces) */
  static normalizeDisplayName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  /** Normalizes tag labels (lowercase, trimmed) */
  static normalizeTagLabel(label: string): string {
    return label.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  /** Validates content payload constraints based on ContentType */
  static validatePayload(type: ContentType, body: string | null, mediaAssetId: string | null): { valid: boolean; error?: string } {
    if (type === 'memory' || type === 'message') {
      if (!body || body.trim().length === 0) {
        return { valid: false, error: 'Text content body cannot be empty.' };
      }
      if (type === 'message' && body.length > 500) {
        return { valid: false, error: 'Class message cannot exceed 500 characters.' };
      }
      if (type === 'memory' && body.length > 10000) {
        return { valid: false, error: 'Written memory cannot exceed 10,000 characters.' };
      }
    }

    if (type === 'photo' || type === 'video') {
      if (!mediaAssetId) {
        return { valid: false, error: 'Media content items require an attached media asset ID.' };
      }
    }

    return { valid: true };
  }
}
