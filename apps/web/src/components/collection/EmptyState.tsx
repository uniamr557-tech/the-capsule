'use client';

import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No memories found',
  message = 'Be the first from your class to share a photo, story, or message in this collection.',
  onAction,
  actionLabel = 'Add a Memory',
}) => {
  return (
    <div className="w-full py-16 px-6 text-center border-2 border-dashed border-[#DCD6CB] rounded-2xl bg-[#EEE9E0]/40 space-y-6 my-8 animate-fadeIn">
      {/* Editorial Line-Art Container */}
      <div className="w-16 h-16 rounded-full bg-[#F4E6CD] text-[#D89B3C] flex items-center justify-center mx-auto shadow-sm">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <h3 className="font-serif text-2xl text-[#1D1C1A]">{title}</h3>
        <p className="text-sm text-[#5D5A54] leading-relaxed">{message}</p>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 py-3 px-6 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-sm font-medium hover:bg-[#315A4A] transition-colors focus:ring-2 focus:ring-[#245CBA]"
        >
          <span>{actionLabel}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};
