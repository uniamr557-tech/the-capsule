'use client';

import React from 'react';
import { AuditEventDto } from '@capsule/api-contracts';

interface AuditTimelineProps {
  events: AuditEventDto[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ events }) => {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-4 rounded-xl bg-[#EEE9E0] border border-[#DCD6CB] flex flex-col md:flex-row items-start md:items-center justify-between gap-2"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase bg-[#1D1C1A] text-[#F7F4EE] px-2 py-0.5 rounded">
                  {evt.actorType}
                </span>
                <span className="font-mono text-xs font-semibold text-[#315A4A]">{evt.action}</span>
              </div>
              <p className="text-xs text-[#5D5A54] font-mono">
                Target: {evt.targetType} ({evt.targetId})
              </p>
            </div>
            <span className="text-xs font-mono text-[#5D5A54]">
              {new Date(evt.occurredAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
