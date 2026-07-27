/**
 * Media Domain Policies & Validation Constraints
 * Source of Truth: Product Specification Sections 4.3, 16
 */

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
] as const;

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime', // .mov
  'video/webm',
] as const;

export const ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_MIME_TYPES,
  ...ALLOWED_VIDEO_MIME_TYPES,
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_PHOTO_SIZE_BYTES = 15 * 1024 * 1024;  // 15 MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export interface VariantSpec {
  type: 'thumbnail' | 'display' | 'full' | 'video_poster' | 'hls_manifest' | 'mp4_fallback';
  targetWidth?: number;
  targetHeight?: number;
  format: 'webp' | 'mp4' | 'm3u8' | 'jpg';
  quality: number;
}

export class MediaPolicyManager {
  /** Checks if MIME type is permitted */
  static isAllowedMimeType(mime: string): boolean {
    return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime.toLowerCase());
  }

  /** Determines if MIME type belongs to image or video family */
  static getMediaKind(mime: string): 'image' | 'video' {
    if ((ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mime.toLowerCase())) {
      return 'image';
    }
    if ((ALLOWED_VIDEO_MIME_TYPES as readonly string[]).includes(mime.toLowerCase())) {
      return 'video';
    }
    throw new Error(`Unsupported MIME type '${mime}'.`);
  }

  /** Validates file size based on media kind */
  static validateFileSize(mime: string, bytes: number): { valid: boolean; error?: string } {
    const kind = this.getMediaKind(mime);
    const maxSize = kind === 'image' ? MAX_PHOTO_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;
    const maxMb = maxSize / (1024 * 1024);

    if (bytes <= 0) {
      return { valid: false, error: 'File size must be greater than 0 bytes.' };
    }
    if (bytes > maxSize) {
      return { valid: false, error: `File size (${(bytes / (1024 * 1024)).toFixed(1)}MB) exceeds maximum ${maxMb}MB limit for ${kind}s.` };
    }
    return { valid: true };
  }

  /** Normalizes original filename for safe display and logging */
  static sanitizeFilename(filename: string): string {
    const basename = filename.split(/[/\\]/).pop() || 'unnamed_file';
    // Remove control characters and non-printable ASCII
    return basename.replace(/[\x00-\x1F\x7F]/g, '').trim().substring(0, 255);
  }

  /** Generates opaque storage object key path (`prefix/capsuleId/uuid.ext`) */
  static generateStorageKey(prefix: 'quarantine' | 'original' | 'derived', capsuleId: string, assetId: string, ext: string): string {
    const cleanExt = ext.replace(/^\./, '').toLowerCase();
    return `${prefix}/${capsuleId}/${assetId}.${cleanExt}`;
  }

  /** Returns required variant specs for an image asset */
  static getImageVariantSpecs(): VariantSpec[] {
    return [
      { type: 'thumbnail', targetWidth: 320, format: 'webp', quality: 80 },
      { type: 'display', targetWidth: 1200, format: 'webp', quality: 85 },
      { type: 'full', targetWidth: 2048, format: 'webp', quality: 90 },
    ];
  }

  /** Returns required variant specs for a video asset */
  static getVideoVariantSpecs(): VariantSpec[] {
    return [
      { type: 'video_poster', targetWidth: 1200, format: 'jpg', quality: 85 },
      { type: 'hls_manifest', format: 'm3u8', quality: 80 },
      { type: 'mp4_fallback', targetWidth: 1280, format: 'mp4', quality: 80 },
    ];
  }

  /** Requires EXIF sanitization for all images */
  static requiresExifStripping(): boolean {
    return true;
  }
}
