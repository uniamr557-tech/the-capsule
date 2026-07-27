'use client';

import React from 'react';
import Link from 'next/link';
import { CapsuleHero } from '../../../components/ui/CapsuleHero';
import { DEMO_CAPSULE } from '../../../lib/session';

export default function CapsuleHomePage({ params }: { params: { slug: string } }) {
  const slug = params.slug || DEMO_CAPSULE.slug;

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Editorial Hero Cover */}
      <CapsuleHero
        name={DEMO_CAPSULE.name}
        schoolName={DEMO_CAPSULE.schoolName}
        graduationYear={DEMO_CAPSULE.graduationYear}
        welcomeText={DEMO_CAPSULE.welcomeText}
        accentTheme={DEMO_CAPSULE.accentTheme}
      />

      {/* Collection Exploration Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-baseline border-b border-[#DCD6CB] pb-4">
          <h2 className="font-serif text-2xl md:text-3xl text-[#1D1C1A]">Explore the Archive</h2>
          <span className="text-xs font-mono text-[#5D5A54]">Class of 2026 Collection</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href={`/capsules/${slug}/timeline`}
            className="group p-6 rounded-2xl bg-[#EEE9E0] border border-[#DCD6CB] hover:bg-white hover:border-[#D89B3C] transition-all duration-200 shadow-sm flex flex-col justify-between h-48"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#315A4A] uppercase tracking-wider">Story Narrative</span>
              <h3 className="font-serif text-xl text-[#1D1C1A] group-hover:text-[#D89B3C] transition-colors">
                Class Timeline →
              </h3>
            </div>
            <p className="text-xs text-[#5D5A54] leading-relaxed">
              A chronological journey through senior year milestones, events, and memories.
            </p>
          </Link>

          <Link
            href={`/capsules/${slug}/gallery`}
            className="group p-6 rounded-2xl bg-[#EEE9E0] border border-[#DCD6CB] hover:bg-white hover:border-[#D89B3C] transition-all duration-200 shadow-sm flex flex-col justify-between h-48"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#315A4A] uppercase tracking-wider">Visual Moments</span>
              <h3 className="font-serif text-xl text-[#1D1C1A] group-hover:text-[#D89B3C] transition-colors">
                Photo Gallery →
              </h3>
            </div>
            <p className="text-xs text-[#5D5A54] leading-relaxed">
              Masonry grid of candid photos and shared moments from across the school year.
            </p>
          </Link>

          <Link
            href={`/capsules/${slug}/memories`}
            className="group p-6 rounded-2xl bg-[#EEE9E0] border border-[#DCD6CB] hover:bg-white hover:border-[#D89B3C] transition-all duration-200 shadow-sm flex flex-col justify-between h-48"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#315A4A] uppercase tracking-wider">Written Stories</span>
              <h3 className="font-serif text-xl text-[#1D1C1A] group-hover:text-[#D89B3C] transition-colors">
                Senior Memories →
              </h3>
            </div>
            <p className="text-xs text-[#5D5A54] leading-relaxed">
              Long-form written recollections, hallway quotes, and unforgotten stories.
            </p>
          </Link>

          <Link
            href={`/capsules/${slug}/messages`}
            className="group p-6 rounded-2xl bg-[#EEE9E0] border border-[#DCD6CB] hover:bg-white hover:border-[#D89B3C] transition-all duration-200 shadow-sm flex flex-col justify-between h-48"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#315A4A] uppercase tracking-wider">Class Notes</span>
              <h3 className="font-serif text-xl text-[#1D1C1A] group-hover:text-[#D89B3C] transition-colors">
                Class Messages →
              </h3>
            </div>
            <p className="text-xs text-[#5D5A54] leading-relaxed">
              Short graduation notes, sign-offs, and well wishes for the future.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
