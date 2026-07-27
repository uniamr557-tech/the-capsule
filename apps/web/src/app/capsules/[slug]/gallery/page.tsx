'use client';

import React from 'react';
import { ContentCollection } from '../../../../components/collection/ContentCollection';

export default function GalleryPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-[#DCD6CB] pb-4">
        <span className="text-xs font-mono text-[#315A4A] bg-[#D8E8E0] px-2.5 py-1 rounded-full uppercase">
          Visual Moments
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-[#1D1C1A] mt-2">Photo & Video Gallery</h1>
        <p className="text-xs md:text-sm text-[#5D5A54] mt-1">
          Candid photos and video moments captured across the senior year. Click any item to view in full resolution.
        </p>
      </div>

      <ContentCollection viewMode="gallery" initialType="photo" />
    </div>
  );
}
