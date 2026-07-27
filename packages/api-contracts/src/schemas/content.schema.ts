/**
 * Content API Contracts & Request/Response DTOs
 * Source of Truth: Product Specification Section 10
 */

export interface CreateContentItemRequest {
  type: 'photo' | 'video' | 'memory' | 'message';
  authorDisplayName: string;
  title?: string | null;
  body?: string | null;       // Long-form for memory, short text for message
  caption?: string | null;    // Caption for photo/video
  mediaAssetId?: string | null; // Attached photo/video ID
  momentAt?: string | null;   // ISO date string
  tagLabels?: string[];
}

export interface ContentItemDto {
  id: string;
  type: 'photo' | 'video' | 'memory' | 'message';
  authorDisplayName: string;
  title: string | null;
  body: string | null;
  caption: string | null;
  mediaAssetId: string | null;
  momentAt: string | null;
  status: 'visible' | 'hidden' | 'deleted';
  submittedAt: string;
  tags: { id: string; labelDisplay: string }[];
}

export interface ContentListQueryDto {
  type?: 'photo' | 'video' | 'memory' | 'message';
  tagId?: string;
  limit?: number;
  cursor?: string;
  sort?: 'newest' | 'oldest' | 'moment_date';
}

export interface ContentListResponseDto {
  items: ContentItemDto[];
  nextCursor: string | null;
  totalVisibleCount?: number;
}
