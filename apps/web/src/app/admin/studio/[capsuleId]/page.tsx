'use client';

import React, { useEffect, useState } from 'react';
import { MetricCard } from '@/components/admin/MetricCard';
import { AdminStudioService, AdminDashboardMetrics } from '@/lib/admin-service';
import Link from 'next/link';

export default function AdminDashboardPage({ params }: { params: { capsuleId: string } }) {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);

  useEffect(() => {
    AdminStudioService.getMetrics().then(setMetrics);
  }, []);

  if (!metrics) {
    return <div className="p-8 text-xs font-mono text-[#5D5A54]">Loading studio metrics...</div>;
  }

  const storageMbUsed = (metrics.storageBytesUsed / (1024 * 1024)).toFixed(1);
  const storageMbMax = (metrics.maxStorageBytes / (1024 * 1024)).toFixed(0);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-[#DCD6CB] pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="font-serif text-3xl text-[#1D1C1A]">Overview Dashboard</h1>
          <p className="text-xs text-[#5D5A54] mt-1">Real-time capsule operational status and storage consumption.</p>
        </div>
        <span className="text-xs font-mono text-[#315A4A] bg-[#D8E8E0] px-3 py-1 rounded-full uppercase">
          Status: {metrics.capsuleState}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Storage Usage"
          value={`${storageMbUsed} MB`}
          subtext={`Allowance: ${storageMbMax} MB`}
          accent="default"
        />
        <MetricCard
          label="Total Contributions"
          value={metrics.totalContributions}
          subtext={`Visible: ${metrics.visibleCount} | Hidden: ${metrics.hiddenCount}`}
          accent="evergreen"
        />
        <MetricCard
          label="Active Class Code"
          value={metrics.activeCode}
          subtext={`Gen ${metrics.activeCodeGeneration} • Rotated ${new Date(metrics.lastRotatedAt).toLocaleDateString()}`}
          accent="marigold"
        />
        <MetricCard
          label="Capsule Lifecycle"
          value={metrics.capsuleState.toUpperCase()}
          subtext="Senior contribution writes active"
          accent={metrics.capsuleState === 'archived' ? 'rose' : 'evergreen'}
        />
      </div>

      {/* Quick Actions Panel */}
      <section className="p-6 rounded-2xl bg-[#EEE9E0] border border-[#DCD6CB] space-y-4">
        <h3 className="font-serif text-xl text-[#1D1C1A]">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/admin/studio/${params.capsuleId}/content`}
            className="py-3 px-5 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-xs font-medium hover:bg-[#315A4A] transition-colors"
          >
            Moderate Content Queue →
          </Link>
          <Link
            href={`/admin/studio/${params.capsuleId}/access`}
            className="py-3 px-5 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-xs font-medium hover:bg-[#315A4A] transition-colors"
          >
            Rotate Class Code →
          </Link>
          <Link
            href={`/admin/studio/${params.capsuleId}/appearance`}
            className="py-3 px-5 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-xs font-medium hover:bg-[#315A4A] transition-colors"
          >
            Customize Branding →
          </Link>
        </div>
      </section>
    </div>
  );
}
