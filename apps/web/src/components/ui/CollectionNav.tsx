'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CollectionNavProps {
  slug: string;
}

export const CollectionNav: React.FC<CollectionNavProps> = ({ slug }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', path: `/capsules/${slug}` },
    { label: 'Timeline', path: `/capsules/${slug}/timeline` },
    { label: 'Gallery', path: `/capsules/${slug}/gallery` },
    { label: 'Memories', path: `/capsules/${slug}/memories` },
    { label: 'Messages', path: `/capsules/${slug}/messages` },
    { label: 'Search', path: `/capsules/${slug}/search` },
  ];

  return (
    <nav className="w-full bg-[#F7F4EE] border-b border-[#DCD6CB]/60 py-3 overflow-x-auto no-scrollbar">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center space-x-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#1D1C1A] text-[#F7F4EE] shadow-sm'
                  : 'bg-[#EEE9E0] text-[#5D5A54] hover:text-[#1D1C1A] hover:bg-[#DCD6CB]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
