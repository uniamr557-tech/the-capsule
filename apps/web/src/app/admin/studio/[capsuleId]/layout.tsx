'use client';

import React from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DEMO_CAPSULE } from '@/lib/session';

export default function AdminStudioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { capsuleId: string };
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1D1C1A]">
      {/* Console Top Header */}
      <header className="w-full bg-[#16191C] text-[#F7F4EE] border-b border-[#272B2F] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#D89B3C] text-[#16191C] flex items-center justify-center font-bold">
              ⚙️
            </div>
            <div>
              <span className="font-serif text-lg text-[#F7F4EE] block leading-none">Studio Console</span>
              <span className="text-[11px] text-[#DCD6CB] block leading-tight mt-0.5">{DEMO_CAPSULE.name} — {DEMO_CAPSULE.schoolName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={`/capsules/${DEMO_CAPSULE.slug}`}
              target="_blank"
              className="text-xs text-[#D89B3C] hover:underline flex items-center space-x-1"
            >
              <span>Preview Public Capsule</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <Link
              href="/admin/login"
              className="text-xs font-medium text-[#DCD6CB] hover:text-white transition-colors"
            >
              Log Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8 flex-1">
        <AdminSidebar capsuleId={params.capsuleId} />
        <main className="flex-1 space-y-6">{children}</main>
      </div>
    </div>
  );
}
