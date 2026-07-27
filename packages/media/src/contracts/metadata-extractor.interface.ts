/**
 * Metadata Extractor Contract Interface
 * Source of Truth: Milestone M3 Requirement Specifications
 */

import { StorageObject, MediaMetadata } from '@capsule/domain';

export interface IMetadataExtractorService {
  /** Inspects raw binary stream to detect MIME, format, width, height, duration, and compute SHA-256 */
  extractMetadata(storageObject: StorageObject): Promise<{
    detectedMime: string;
    sha256: string;
    metadata: MediaMetadata;
  }>;
}
