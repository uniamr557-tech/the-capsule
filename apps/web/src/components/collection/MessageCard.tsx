'use client';

import React from 'react';
import { ContentItemDto } from '@capsule/api-contracts';

interface MessageCardProps {
  item: ContentItemDto;
}

export const MessageCard: React.FC<MessageCardProps> = ({ item }) => {
  return (
    <div className="p-6 rounded-2xl bg-[#F7F4EE] border border-[#DCD6CB] hover:border-[#315A4A] transition-all duration-200 shadow-sm space-y-3">
      <p className="font-serif text-lg md:text-xl text-[#1D1C1A] leading-relaxed italic">
        &ldquo;{item.body}&rdquo;
      </p>
      <div className="flex items-center justify-between text-xs text-[#5D5A54] pt-2 border-t border-[#DCD6CB]/40">
        <span className="font-semibold text-[#315A4A]">{item.authorDisplayName}</span>
        <span className="font-mono text-[11px]">
          {new Date(item.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
};
