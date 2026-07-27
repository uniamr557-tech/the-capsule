/**
 * Image Processing Service Contract Interface
 * Source of Truth: Milestone M3 Requirement Specifications
 */

import { StorageObject, MediaMetadata, MediaVariant, VariantSpec } from '@capsule/domain';

export interface ProcessImageInput {
  mediaAssetId: string;
  sourceObject: StorageObject;
  variantSpecs: VariantSpec[];
  stripExif: boolean;
}

export interface ProcessImageOutput {
  metadata: MediaMetadata;
  generatedVariants: Array<{
    variantType: MediaVariant['variantType'];
    storageObject: StorageObject;
    mime: string;
    bytes: number;
    width: number;
    height: number;
  }>;
}

export interface IImageProcessorService {
  /** Strips EXIF metadata, extracts width/height/format, and generates web responsive variants */
  processImage(input: ProcessImageInput): Promise<ProcessImageOutput>;
}
