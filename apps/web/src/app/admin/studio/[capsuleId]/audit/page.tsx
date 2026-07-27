'use client';

import React, { useEffect, useState } from 'react';
import { AuditTimeline } from '@/components/admin/AuditTimeline';
import { AdminStudioService } from '@/lib/admin-service';
import { AuditEventDto } from '@capsule/api-contracts';

export default function AuditLogPage() {
  const [events, setEvents] = useState<AuditEventDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AdminStudioService.getAuditLog().then((res) => {
      setEvents(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-[#DCD6CB] pb-4">
        <h1 className="font-serif text-3xl text-[#1D1C1A]">Audit Log Timeline</h1>
        <p className="text-xs text-[#5D5A54] mt-1">Immutable chronological event record of all administrative operations.</p>
      </div>

      {isLoading ? (
        <div className="p-8 text-xs font-mono text-[#5D5A54]">Loading audit event log...</div>
      ) : (
        <AuditTimeline events={events} />
      )}
    </div>
  );
}
