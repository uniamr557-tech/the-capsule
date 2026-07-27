'use client';

import React from 'react';
import { ContentCollection } from '../../../../components/collection/ContentCollection';

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-[#DCD6CB] pb-4">
        <span className="text-xs font-mono text-[#315A4A] bg-[#D8E8E0] px-2.5 py-1 rounded-full uppercase">
          Class Notes
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-[#1D1C1A] mt-2">Class Messages Stream</h1>
        <p className="text-xs md:text-sm text-[#5D5A54] mt-1">
          Short graduation sign-offs, well wishes, and notes left for classmates.
        </p>
      </div>

      <ContentCollection viewMode="messages" initialType="message" />
    </div>
  );
}
