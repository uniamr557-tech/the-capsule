'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  capsuleId: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ capsuleId }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview Dashboard', path: `/admin/studio/${capsuleId}` },
    { label: 'Content Manager', path: `/admin/studio/${capsuleId}/content` },
    { label: 'Access Code Studio', path: `/admin/studio/${capsuleId}/access` },
    { label: 'Appearance & Cover', path: `/admin/studio/${capsuleId}/appearance` },
    { label: 'Archive Controls', path: `/admin/studio/${capsuleId}/archive` },
    { label: 'Audit Log', path: `/admin/studio/${capsuleId}/audit` },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#EEE9E0] p-4 rounded-2xl border border-[#DCD6CB] space-y-2 h-fit">
      <div className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-[#5D5A54] border-b border-[#DCD6CB]">
        Studio Navigation
      </div>
      <nav className="space-y-1 pt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#1D1C1A] text-[#F7F4EE] shadow-sm'
                  : 'text-[#5D5A54] hover:text-[#1D1C1A] hover:bg-[#DCD6CB]/60'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
