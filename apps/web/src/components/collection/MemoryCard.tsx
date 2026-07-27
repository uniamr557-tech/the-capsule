'use client';

import React from 'react';
import { ContentItemDto } from '@capsule/api-contracts';

interface MemoryCardProps {
  item: ContentItemDto;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ item }) => {
  return (
    <article className="p-8 rounded-2xl bg-[#EEE9E0] border border-[#DCD6CB] hover:border-[#D89B3C] transition-all duration-200 shadow-sm space-y-4 max-w-[68ch] mx-auto">
      {item.title && (
        <h3 className="font-serif text-2xl md:text-3xl text-[#1D1C1A] leading-tight">
          {item.title}
        </h3>
      )}

      {item.body && (
        <p className="text-base md:text-lg text-[#1D1C1A] leading-relaxed font-sans whitespace-pre-line">
          {item.body}
        </p>
      )}

      <div className="pt-4 border-t border-[#DCD6CB]/60 flex items-center justify-between text-xs text-[#5D5A54]">
        <span className="font-medium text-[#1D1C1A]">— {item.authorDisplayName}</span>
        <span>
          {new Date(item.momentAt || item.submittedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </article>
  );
};
