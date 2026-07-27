/**
 * Media Repository Interfaces
 * Source of Truth: Milestone M3 Requirement Specifications
 */

import {
  MediaAsset,
  MediaVariant,
  UploadIntent,
  UploadSession,
  ProcessingJob,
  DeletionJob,
  StorageObject,
  MediaLifecycleStatus,
} from '../entities/media';

export interface IMediaAssetRepository {
  findById(id: string): Promise<MediaAsset | null>;
  findBySha256(capsuleId: string, sha256: string): Promise<MediaAsset | null>;
  save(asset: MediaAsset): Promise<MediaAsset>;
  updateStatus(id: string, status: MediaLifecycleStatus, errorReason?: string): Promise<MediaAsset>;
  saveVariant(variant: MediaVariant): Promise<MediaVariant>;
}

export interface IUploadSessionRepository {
  createIntent(intent: UploadIntent): Promise<UploadIntent>;
  findIntentById(id: string): Promise<UploadIntent | null>;
  createSession(session: UploadSession): Promise<UploadSession>;
  findSessionById(id: string): Promise<UploadSession | null>;
  updateSessionStatus(id: string, status: UploadSession['status']): Promise<void>;
}

export interface IStorageRepository {
  /** Generates short-lived signed upload URL for direct-to-storage upload */
  getSignedUploadUrl(bucket: string, key: string, mime: string, maxBytes: number, ttlSeconds?: number): Promise<{ uploadUrl: string; headers: Record<string, string> }>;
  /** Generates short-lived signed download/read URL */
  getSignedReadUrl(bucket: string, key: string, ttlSeconds?: number): Promise<string>;
  /** Checks if object exists in storage */
  objectExists(bucket: string, key: string): Promise<boolean>;
  /** Copies object from quarantine to primary storage prefix */
  copyObject(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<StorageObject>;
  /** Deletes object from storage */
  deleteObject(bucket: string, key: string): Promise<boolean>;
}

export interface IMediaProcessingRepository {
  enqueueProcessingJob(job: Omit<ProcessingJob, 'id' | 'createdAt'>): Promise<ProcessingJob>;
  findPendingJobs(limit?: number): Promise<ProcessingJob[]>;
  updateJobStatus(id: string, status: ProcessingJob['status'], errorReason?: string): Promise<void>;
}

export interface IDeletionJobRepository {
  enqueueDeletionJob(job: Omit<DeletionJob, 'id' | 'requestedAt'>): Promise<DeletionJob>;
  findPendingJobsDue(now?: Date, limit?: number): Promise<DeletionJob[]>;
  markJobCompleted(id: string): Promise<void>;
  markJobFailed(id: string, reason: string): Promise<void>;
}
