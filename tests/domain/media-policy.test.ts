/**
 * Unit Tests for Media Policy Rules
 * Milestone M3 Requirement Verification
 */

import { describe, it, expect } from 'vitest';
import { MediaPolicyManager } from '@capsule/domain';

describe('MediaPolicyManager', () => {
  it('validates allowed MIME types', () => {
    expect(MediaPolicyManager.isAllowedMimeType('image/jpeg')).toBe(true);
    expect(MediaPolicyManager.isAllowedMimeType('image/png')).toBe(true);
    expect(MediaPolicyManager.isAllowedMimeType('video/mp4')).toBe(true);
    expect(MediaPolicyManager.isAllowedMimeType('application/exe')).toBe(false);
    expect(MediaPolicyManager.isAllowedMimeType('text/html')).toBe(false);
  });

  it('determines media kind correctly', () => {
    expect(MediaPolicyManager.getMediaKind('image/jpeg')).toBe('image');
    expect(MediaPolicyManager.getMediaKind('video/mp4')).toBe('video');
    expect(() => MediaPolicyManager.getMediaKind('application/pdf')).toThrow();
  });

  it('enforces maximum upload size constraints (15MB photo, 100MB video)', () => {
    const photo14Mb = 14 * 1024 * 1024;
    const photo16Mb = 16 * 1024 * 1024;
    const video90Mb = 90 * 1024 * 1024;
    const video105Mb = 105 * 1024 * 1024;

    expect(MediaPolicyManager.validateFileSize('image/jpeg', photo14Mb).valid).toBe(true);
    expect(MediaPolicyManager.validateFileSize('image/jpeg', photo16Mb).valid).toBe(false);
    expect(MediaPolicyManager.validateFileSize('video/mp4', video90Mb).valid).toBe(true);
    expect(MediaPolicyManager.validateFileSize('video/mp4', video105Mb).valid).toBe(false);
  });

  it('sanitizes filenames accurately', () => {
    expect(MediaPolicyManager.sanitizeFilename('my_senior_photo.jpg')).toBe('my_senior_photo.jpg');
    expect(MediaPolicyManager.sanitizeFilename('C:\\path\\to\\my_photo.png')).toBe('my_photo.png');
    expect(MediaPolicyManager.sanitizeFilename('/home/user/photo.png')).toBe('photo.png');
  });

  it('returns required variant specifications for images and videos', () => {
    const imageSpecs = MediaPolicyManager.getImageVariantSpecs();
    expect(imageSpecs.map((s) => s.type)).toEqual(['thumbnail', 'display', 'full']);

    const videoSpecs = MediaPolicyManager.getVideoVariantSpecs();
    expect(videoSpecs.map((s) => s.type)).toEqual(['video_poster', 'hls_manifest', 'mp4_fallback']);
  });
});
