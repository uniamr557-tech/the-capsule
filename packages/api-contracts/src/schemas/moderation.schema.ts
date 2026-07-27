/**
 * Admin Moderation API Contracts & Request/Response DTOs
 * Source of Truth: Product Specification Section 10 & ADR-0003/0004
 */

export interface ModerateContentRequest {
  action: 'hide' | 'restore' | 'delete';
  reason?: string;
}

export interface ModerateContentResponse {
  contentId: string;
  status: 'visible' | 'hidden' | 'deleted';
  updatedAt: string;
}

export interface AdminContentListQueryDto {
  status?: 'visible' | 'hidden' | 'deleted';
  type?: 'photo' | 'video' | 'memory' | 'message';
  limit?: number;
  cursor?: string;
}

export interface AuditEventDto {
  id: string;
  actorType: 'senior' | 'admin' | 'system';
  action: string;
  targetType: string;
  targetId: string;
  occurredAt: string;
}
