/**
 * Audit Log Repository Interface
 */

export interface AuditEvent {
  id: string;
  capsuleId: string;
  actorType: 'senior' | 'admin' | 'system';
  actorId: string | null;
  action: string;
  targetType: string;
  targetId: string;
  metadataRedacted: Record<string, unknown>;
  occurredAt: Date;
}

export interface IAuditLogRepository {
  appendEvent(event: Omit<AuditEvent, 'id' | 'occurredAt'>): Promise<AuditEvent>;
  findByCapsuleId(capsuleId: string, limit?: number, cursor?: string): Promise<AuditEvent[]>;
}
