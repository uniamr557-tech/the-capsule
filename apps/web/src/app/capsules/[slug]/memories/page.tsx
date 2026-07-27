'use client';

import React from 'react';
import { ContentCollection } from '@/components/collection/ContentCollection';

export default function MemoriesPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-[#DCD6CB] pb-4">
        <span className="text-xs font-mono text-[#315A4A] bg-[#D8E8E0] px-2.5 py-1 rounded-full uppercase">
          Written Stories
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-[#1D1C1A] mt-2">Senior Written Memories</h1>
        <p className="text-xs md:text-sm text-[#5D5A54] mt-1">
          Long-form stories, hallway recollections, and unforgotten moments recorded by classmates.
        </p>
      </div>

      <ContentCollection viewMode="memories" initialType="memory" />
    </div>
  );
}
