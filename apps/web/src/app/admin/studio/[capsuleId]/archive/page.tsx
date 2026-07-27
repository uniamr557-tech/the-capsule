'use client';

import React, { useState, useEffect } from 'react';
import { AdminStudioService, AdminDashboardMetrics } from '../../../../lib/admin-service';
import { ConfirmationDialog } from '../../../../components/admin/ConfirmationDialog';

export default function ArchiveControlsPage() {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    AdminStudioService.getMetrics().then(setMetrics);
  }, []);

  const handleToggleArchive = async () => {
    if (!metrics) return;
    setIsLoading(true);

    const nextState = metrics.capsuleState === 'archived' ? 'active' : 'archived';
    await AdminStudioService.updateCapsuleState(nextState);

    setMetrics((prev) => (prev ? { ...prev, capsuleState: nextState } : null));
    setIsLoading(false);
    setIsConfirmOpen(false);

    setToastMessage(
      nextState === 'archived'
        ? 'Capsule frozen to read-only archive mode. Submissions disabled.'
        : 'Capsule reopened. Senior submissions active.',
    );

    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!metrics) return <div className="p-8 text-xs font-mono text-[#5D5A54]">Loading archive state...</div>;

  const isArchived = metrics.capsuleState === 'archived';

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-[#DCD6CB] pb-4">
        <h1 className="font-serif text-3xl text-[#1D1C1A]">Archive & Retention Controls</h1>
        <p className="text-xs text-[#5D5A54] mt-1">Freeze the capsule for graduation or reopen for submissions.</p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#315A4A] text-[#F7F4EE] text-xs font-medium animate-fadeIn">
          ✓ {toastMessage}
        </div>
      )}

      {/* Archive Card */}
      <section className={`p-6 rounded-2xl border ${isArchived ? 'bg-[#B95B5B]/10 border-[#B95B5B]/40' : 'bg-[#EEE9E0] border-[#DCD6CB]'} space-y-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#5D5A54]">Capsule State</span>
            <h3 className="font-serif text-2xl text-[#1D1C1A] mt-1">
              {isArchived ? 'Archived (Read-Only)' : 'Active (Submissions Allowed)'}
            </h3>
            <p className="text-xs text-[#5D5A54] mt-1">
              {isArchived
                ? 'Senior contributions are disabled server-side. Seniors and alumni can browse existing memories.'
                : 'Seniors can submit photos, videos, written memories, and messages using the active class code.'}
            </p>
          </div>

          <button
            onClick={() => setIsConfirmOpen(true)}
            className={`py-3 px-6 rounded-xl text-xs font-semibold text-[#F7F4EE] transition-colors shadow-sm ${
              isArchived ? 'bg-[#315A4A] hover:bg-[#1D1C1A]' : 'bg-[#B95B5B] hover:bg-[#8e3f3f]'
            }`}
          >
            {isArchived ? 'Reopen Capsule for Submissions' : 'Freeze & Archive Capsule'}
          </button>
        </div>
      </section>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title={isArchived ? 'Reopen Capsule for Submissions?' : 'Archive Capsule at Graduation?'}
        description={
          isArchived
            ? 'Reopening the capsule allows seniors to submit new memories using the active class code.'
            : 'Archiving freezes the capsule into a permanent read-only archive. Seniors can continue browsing memories, but new contributions will be disabled server-side.'
        }
        confirmLabel={isArchived ? 'Reopen Capsule' : 'Freeze & Archive'}
        isDestructive={!isArchived}
        isLoading={isLoading}
        onConfirm={handleToggleArchive}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
