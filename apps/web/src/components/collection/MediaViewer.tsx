'use client';

import React, { useEffect } from 'react';
import { ContentItemDto } from '@capsule/api-contracts';

interface MediaViewerProps {
  item: ContentItemDto | null;
  onClose: () => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const sampleImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop';
  const sampleVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Media Viewer'}
      className="fixed inset-0 z-50 bg-[#16191C]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#F7F4EE] hover:text-[#D89B3C] p-2.5 rounded-full bg-[#272B2F] border border-[#DCD6CB]/20 transition-colors focus:ring-2 focus:ring-[#245CBA]"
        aria-label="Close media viewer"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-6">
        {/* Media Content */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-black max-h-[70vh] flex items-center justify-center shadow-2xl border border-[#DCD6CB]/10">
          {item.type === 'video' ? (
            <video
              src={sampleVideo}
              controls
              autoPlay
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl"
            />
          ) : (
            <img
              src={sampleImage}
              alt={item.caption || item.title || 'Senior photo'}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl"
            />
          )}
        </div>

        {/* Media Details */}
        <div className="w-full text-center max-w-2xl space-y-2 text-[#F7F4EE]">
          {item.title && <h3 className="font-serif text-2xl md:text-3xl text-[#F7F4EE]">{item.title}</h3>}
          {item.caption && <p className="text-sm md:text-base text-[#DCD6CB] leading-relaxed">{item.caption}</p>}
          <div className="flex items-center justify-center space-x-3 text-xs text-[#5D5A54] pt-2">
            <span>By {item.authorDisplayName}</span>
            <span>•</span>
            <span>{new Date(item.momentAt || item.submittedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
