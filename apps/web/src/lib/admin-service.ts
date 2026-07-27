/**
 * Admin Studio Service & Mock Repository Adapter
 * Source of Truth: Product Specification Section 4.6 & ADR-0001/0002/0003/0004
 */

import { ContentItemDto, AuditEventDto } from '@capsule/api-contracts';
import { AccessCodeManager } from '@capsule/domain';

export interface AdminDashboardMetrics {
  storageBytesUsed: number;
  maxStorageBytes: number;
  totalContributions: number;
  visibleCount: number;
  hiddenCount: number;
  deletedCount: number;
  activeCode: string;
  activeCodeGeneration: number;
  lastRotatedAt: string;
  capsuleState: 'active' | 'archived' | 'draft';
}

let mockMetrics: AdminDashboardMetrics = {
  storageBytesUsed: 1.2 * 1024 * 1024 * 1024, // 1.2 GB
  maxStorageBytes: 10 * 1024 * 1024 * 1024,   // 10 GB Allowance
  totalContributions: 5,
  visibleCount: 5,
  hiddenCount: 0,
  deletedCount: 0,
  activeCode: 'SENIOR26',
  activeCodeGeneration: 1,
  lastRotatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  capsuleState: 'active',
};

let mockAuditEvents: AuditEventDto[] = [
  {
    id: 'evt_1',
    actorType: 'admin',
    action: 'CAPSULE_CREATED',
    targetType: 'capsule',
    targetId: 'cap_2026_oakridge',
    occurredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt_2',
    actorType: 'admin',
    action: 'ACCESS_CODE_GENERATED',
    targetType: 'access_code_version',
    targetId: 'code_v1',
    occurredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export class AdminStudioService {
  /** Gets current admin metrics */
  static async getMetrics(): Promise<AdminDashboardMetrics> {
    await new Promise((res) => setTimeout(res, 200));
    return { ...mockMetrics };
  }

  /** Rotates access code atomically */
  static async rotateAccessCode(reason: 'manual' | 'scheduled' | 'security_revocation'): Promise<{ newCode: string; generation: number }> {
    await new Promise((res) => setTimeout(res, 400));

    const newCode = AccessCodeManager.generateCode(8);
    mockMetrics.activeCode = newCode;
    mockMetrics.activeCodeGeneration += 1;
    mockMetrics.lastRotatedAt = new Date().toISOString();

    this.appendAudit('admin', 'ACCESS_CODE_ROTATED', 'access_code_version', `code_v${mockMetrics.activeCodeGeneration}`, { reason });
    return { newCode, generation: mockMetrics.activeCodeGeneration };
  }

  /** Updates content visibility status (hide / restore / delete) */
  static async updateContentStatus(contentId: string, status: 'visible' | 'hidden' | 'deleted'): Promise<void> {
    await new Promise((res) => setTimeout(res, 300));

    if (status === 'hidden') {
      mockMetrics.visibleCount = Math.max(0, mockMetrics.visibleCount - 1);
      mockMetrics.hiddenCount += 1;
      this.appendAudit('admin', 'CONTENT_HIDDEN', 'content_item', contentId);
    } else if (status === 'visible') {
      mockMetrics.hiddenCount = Math.max(0, mockMetrics.hiddenCount - 1);
      mockMetrics.visibleCount += 1;
      this.appendAudit('admin', 'CONTENT_RESTORED', 'content_item', contentId);
    } else if (status === 'deleted') {
      mockMetrics.deletedCount += 1;
      this.appendAudit('admin', 'CONTENT_PERMANENTLY_DELETED', 'content_item', contentId);
    }
  }

  /** Updates capsule lifecycle state (archive / reopen) */
  static async updateCapsuleState(newState: 'active' | 'archived'): Promise<void> {
    await new Promise((res) => setTimeout(res, 400));

    mockMetrics.capsuleState = newState;
    this.appendAudit('admin', newState === 'archived' ? 'CAPSULE_ARCHIVED' : 'CAPSULE_REOPENED', 'capsule', 'cap_2026_oakridge');
  }

  /** Fetches audit log events */
  static async getAuditLog(): Promise<AuditEventDto[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...mockAuditEvents].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }

  private static appendAudit(actorType: 'admin' | 'senior' | 'system', action: string, targetType: string, targetId: string, _meta?: Record<string, unknown>) {
    mockAuditEvents.unshift({
      id: `evt_${Date.now()}`,
      actorType,
      action,
      targetType,
      targetId,
      occurredAt: new Date().toISOString(),
    });
  }
}
