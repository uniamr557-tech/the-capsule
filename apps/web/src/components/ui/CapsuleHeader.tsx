'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CapsuleHeaderProps {
  slug: string;
  capsuleName: string;
  schoolName: string;
}

export const CapsuleHeader: React.FC<CapsuleHeaderProps> = ({ slug, capsuleName, schoolName }) => {
  const router = useRouter();

  const handleExitSession = () => {
    localStorage.removeItem('senior_session');
    router.push('/');
  };

  return (
    <header className="w-full bg-[#F7F4EE] border-b border-[#DCD6CB] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand & Class Title */}
        <Link href={`/capsules/${slug}`} className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-full bg-[#1D1C1A] text-[#F7F4EE] flex items-center justify-center transition-transform group-hover:scale-105">
            <svg className="w-4 h-4 text-[#D89B3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m12.707-4.707l-11.414 11.414m0-11.414l11.414 11.414" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-lg text-[#1D1C1A] block leading-none">{capsuleName}</span>
            <span className="text-[11px] text-[#5D5A54] block leading-tight mt-0.5">{schoolName}</span>
          </div>
        </Link>

        {/* Session Status & Exit Action */}
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline-block text-xs font-mono text-[#315A4A] bg-[#D8E8E0] px-2.5 py-1 rounded-full">
            ● Session Active
          </span>
          <button
            onClick={handleExitSession}
            className="text-xs font-medium text-[#5D5A54] hover:text-[#B95B5B] transition-colors py-1.5 px-3 rounded-lg border border-[#DCD6CB] hover:bg-[#EEE9E0]"
            title="End session and return to code entry threshold"
          >
            Exit Class
          </button>
        </div>
      </div>
    </header>
  );
};
