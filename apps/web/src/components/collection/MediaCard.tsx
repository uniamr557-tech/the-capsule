'use client';

import React from 'react';
import { ContentItemDto } from '@capsule/api-contracts';

interface MediaCardProps {
  item: ContentItemDto;
  onSelect: (item: ContentItemDto) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onSelect }) => {
  const sampleImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop';

  return (
    <div
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${item.type}: ${item.title || item.authorDisplayName}`}
      className="group relative rounded-2xl overflow-hidden bg-[#EEE9E0] border border-[#DCD6CB] hover:border-[#D89B3C] transition-all duration-300 shadow-sm cursor-pointer focus:ring-2 focus:ring-[#245CBA]"
    >
      {/* Aspect ratio box */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
        <img
          src={sampleImage}
          alt={item.caption || item.title || 'Senior media'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Video Icon Indicator */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#1D1C1A]/80 text-[#F7F4EE] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[#D89B3C] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Hover overlay caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16191C]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-[#F7F4EE]">
          {item.title && <h4 className="font-serif text-lg leading-tight">{item.title}</h4>}
          <p className="text-xs text-[#DCD6CB] font-medium mt-1">By {item.authorDisplayName}</p>
        </div>
      </div>

      <div className="p-4 bg-[#F7F4EE]">
        {item.title && <h4 className="font-serif text-base text-[#1D1C1A] truncate">{item.title}</h4>}
        <p className="text-xs text-[#5D5A54] mt-1 line-clamp-2">{item.caption || 'Shared memory'}</p>
      </div>
    </div>
  );
};
