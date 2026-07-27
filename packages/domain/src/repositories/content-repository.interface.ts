/**
 * Content, Participant & Tag Repository Interfaces
 * Source of Truth: Technical Specification Section 9
 */

import { ContentItem, ParticipantHandle, Tag } from '../entities/content';
import { ContentStatus, ContentType } from '../entities/content';

export interface ContentFilterQuery {
  capsuleId: string;
  status?: ContentStatus;
  type?: ContentType;
  tagId?: string;
  authorHandleId?: string;
  limit?: number;
  cursor?: string;
  sort?: 'newest' | 'oldest' | 'moment_date';
}

export interface IContentRepository {
  findById(id: string): Promise<ContentItem | null>;
  findVisibleByCapsuleId(query: ContentFilterQuery): Promise<{ items: ContentItem[]; nextCursor: string | null }>;
  findAdminByCapsuleId(query: ContentFilterQuery): Promise<{ items: ContentItem[]; nextCursor: string | null }>;
  save(item: ContentItem): Promise<ContentItem>;
  updateStatus(id: string, newStatus: ContentStatus, reason?: string): Promise<ContentItem>;
  searchVisible(capsuleId: string, searchPhrase: string, limit?: number): Promise<ContentItem[]>;
}

export interface IParticipantHandleRepository {
  findById(id: string): Promise<ParticipantHandle | null>;
  findOrCreate(capsuleId: string, rawDisplayName: string, sessionId: string | null): Promise<ParticipantHandle>;
}

export interface ITagRepository {
  findByCapsuleId(capsuleId: string): Promise<Tag[]>;
  findOrCreateTags(capsuleId: string, labels: string[]): Promise<Tag[]>;
}
