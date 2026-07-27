/**
 * Media Domain Entities & Lifecycle Definitions
 * Source of Truth: Milestone M3 Specifications & Product Spec Sections 7.3, 16
 */

/** Media Asset Lifecycle Statuses */
export type MediaLifecycleStatus =
  | 'Requested'
  | 'Uploading'
  | 'Uploaded'
  | 'Quarantined'
  | 'Processing'
  | 'Ready'
  | 'Failed'
  | 'Deleted'
  | 'Purged';

/** Media Variant Types */
export type MediaVariantType =
  | 'thumbnail'    // 320px width
  | 'display'      // 1200px width
  | 'full'         // 2048px width
  | 'video_poster' // Video cover frame
  | 'hls_manifest' // Video HLS adaptive streaming
  | 'mp4_fallback';// Video MP4 fallback

/** Media Kind */
export type MediaKind = 'image' | 'video';

export interface StorageObject {
  bucket: string;
  key: string;       // Opaque UUID path, e.g. "quarantine/capsule-123/uuid.jpg"
  bytes: number;
  etag?: string;
  sha256?: string;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  durationMs?: number;
  bitrate?: number;
  format: string;
  exifStripped: boolean;
  hasAudioTrack?: boolean;
}

export interface MediaVariant {
  id: string;
  mediaAssetId: string;
  variantType: MediaVariantType;
  storageObject: StorageObject;
  mime: string;
  bytes: number;
  width?: number;
  height?: number;
  status: 'pending' | 'ready' | 'failed';
}

export interface MediaAsset {
  id: string;
  capsuleId: string;
  contentItemId: string | null;
  kind: MediaKind;
  originalFilename: string;
  detectedMime: string;
  bytes: number;
  sha256: string | null;
  status: MediaLifecycleStatus;
  storageObject: StorageObject | null;
  metadata: MediaMetadata | null;
  variants: MediaVariant[];
  altText: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadIntent {
  id: string;
  capsuleId: string;
  filename: string;
  mimeType: string;
  expectedBytes: number;
  sha256Checksum?: string;
  expiresAt: Date;
}

export interface UploadSession {
  id: string;
  uploadIntentId: string;
  capsuleId: string;
  storageKey: string;
  uploadUrl: string; // Signed upload URL
  headers: Record<string, string>;
  expiresAt: Date;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  createdAt: Date;
}

export interface ProcessingJob {
  id: string;
  mediaAssetId: string;
  capsuleId: string;
  jobType: 'virus_scan' | 'exif_strip' | 'image_variants' | 'video_transcode';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  errorReason: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

export interface DeletionJob {
  id: string;
  targetType: 'media_asset' | 'media_variant' | 'content_item';
  targetId: string;
  capsuleId: string;
  requestedAt: Date;
  executeAfter: Date; // 30-day purge SLA
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  completedAt: Date | null;
}

export interface MediaProcessingResult {
  mediaAssetId: string;
  success: boolean;
  metadata: MediaMetadata;
  generatedVariants: Omit<MediaVariant, 'id' | 'mediaAssetId'>[];
  errorReason?: string;
}

/** Explicit Media Lifecycle State Machine */
export class MediaLifecycleManager {
  private static readonly VALID_TRANSITIONS: Record<MediaLifecycleStatus, MediaLifecycleStatus[]> = {
    Requested: ['Uploading', 'Failed', 'Cancelled' as unknown as MediaLifecycleStatus],
    Uploading: ['Uploaded', 'Failed'],
    Uploaded: ['Quarantined', 'Failed'],
    Quarantined: ['Processing', 'Failed'],
    Processing: ['Ready', 'Failed'],
    Ready: ['Deleted'],
    Failed: ['Deleted', 'Quarantined'], // Retry processing or cleanup
    Deleted: ['Purged'],
    Purged: [], // Terminal state
  };

  /** Validates if state transition is allowed */
  static canTransition(current: MediaLifecycleStatus, next: MediaLifecycleStatus): boolean {
    const allowed = this.VALID_TRANSITIONS[current] || [];
    return allowed.includes(next);
  }

  /** Asserts transition validity, throwing an error if invalid */
  static assertTransition(current: MediaLifecycleStatus, next: MediaLifecycleStatus): void {
    if (!this.canTransition(current, next)) {
      throw new Error(`Invalid Media Lifecycle transition from '${current}' to '${next}'.`);
    }
  }
}
