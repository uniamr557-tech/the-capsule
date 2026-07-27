/**
 * Media API Contracts & Request/Response DTOs
 * Source of Truth: Product Specification Section 10 & Milestone M3
 */

export interface CreateUploadIntentRequest {
  filename: string;
  mimeType: string;
  expectedBytes: number;
  sha256Checksum?: string;
}

export interface CreateUploadIntentResponse {
  uploadIntentId: string;
  uploadSessionId: string;
  uploadUrl: string; // Direct-to-storage signed upload URL
  headers: Record<string, string>;
  expiresAt: string; // ISO string
}

export interface CompleteUploadRequest {
  uploadIntentId: string;
  uploadSessionId: string;
}

export interface CompleteUploadResponse {
  mediaAssetId: string;
  status: 'Uploaded' | 'Quarantined' | 'Processing';
  message: string;
}

export interface CancelUploadRequest {
  uploadIntentId: string;
  reason?: string;
}

export interface CancelUploadResponse {
  uploadIntentId: string;
  status: 'cancelled';
}

export interface MediaMetadataDto {
  width?: number;
  height?: number;
  durationMs?: number;
  format: string;
  exifStripped: boolean;
}

export interface MediaVariantDto {
  variantType: 'thumbnail' | 'display' | 'full' | 'video_poster' | 'hls_manifest' | 'mp4_fallback';
  url: string; // Signed CDN read URL
  mime: string;
  width?: number;
  height?: number;
}

export interface GetUploadStatusResponse {
  mediaAssetId: string;
  status: 'Requested' | 'Uploading' | 'Uploaded' | 'Quarantined' | 'Processing' | 'Ready' | 'Failed' | 'Deleted' | 'Purged';
  metadata: MediaMetadataDto | null;
  variants: MediaVariantDto[];
  errorReason: string | null;
}

export interface MediaDeletionRequest {
  mediaAssetId: string;
  reason?: string;
}

export interface MediaDeletionResponse {
  mediaAssetId: string;
  status: 'Deleted';
  executeAfter: string; // 30-day purge SLA ISO string
}

export interface MediaFailureDto {
  mediaAssetId: string;
  errorCode: 'INVALID_MIME' | 'EXCEEDED_MAX_SIZE' | 'VIRUS_DETECTED' | 'PROCESSING_FAILED';
  errorMessage: string;
}

export interface MediaProcessingStatusDto {
  jobId: string;
  mediaAssetId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  attempts: number;
}
