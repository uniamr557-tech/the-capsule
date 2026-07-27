'use client';

import React from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F7F4EE] text-[#1D1C1A] text-center">
      <div className="max-w-md space-y-6 bg-[#EEE9E0] p-8 rounded-2xl border border-[#DCD6CB] shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#B95B5B]/10 text-[#B95B5B] flex items-center justify-center mx-auto">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-[#1D1C1A]">Something went wrong</h2>
          <p className="text-xs text-[#5D5A54] leading-relaxed">
            {error.message || 'We could not complete your request. Please try again.'}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full py-3 px-6 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] font-medium hover:bg-[#315A4A] transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
