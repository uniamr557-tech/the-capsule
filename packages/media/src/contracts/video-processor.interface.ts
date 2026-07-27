/**
 * Video Processing Service Contract Interface
 * Source of Truth: Milestone M3 Requirement Specifications
 */

import { StorageObject, MediaMetadata, MediaVariant, VariantSpec } from '@capsule/domain';

export interface ProcessVideoInput {
  mediaAssetId: string;
  sourceObject: StorageObject;
  variantSpecs: VariantSpec[];
}

export interface ProcessVideoOutput {
  metadata: MediaMetadata;
  generatedVariants: Array<{
    variantType: MediaVariant['variantType'];
    storageObject: StorageObject;
    mime: string;
    bytes: number;
    width?: number;
    height?: number;
  }>;
}

export interface IVideoProcessorService {
  /** Extracts video duration/dimensions, generates poster frame, and transcodes to HLS / MP4 */
  processVideo(input: ProcessVideoInput): Promise<ProcessVideoOutput>;
}
