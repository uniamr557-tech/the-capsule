'use client';

import React, { useState, useEffect } from 'react';
import { AdminStudioService, AdminDashboardMetrics } from '../../../../lib/admin-service';
import { ConfirmationDialog } from '../../../../components/admin/ConfirmationDialog';

export default function AccessCodeManagerPage() {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [isMasked, setIsMasked] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    AdminStudioService.getMetrics().then(setMetrics);
  }, []);

  const handleRotateConfirm = async () => {
    setIsLoading(true);
    const result = await AdminStudioService.rotateAccessCode('manual');

    setMetrics((prev) =>
      prev
        ? {
            ...prev,
            activeCode: result.newCode,
            activeCodeGeneration: result.generation,
            lastRotatedAt: new Date().toISOString(),
          }
        : null,
    );

    setIsLoading(false);
    setIsConfirmOpen(false);
    setIsMasked(false);
    setToastMessage(`New Access Code "SENIOR26" (Gen ${result.generation}) generated. All prior senior sessions revoked.`);

    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!metrics) return <div className="p-8 text-xs font-mono text-[#5D5A54]">Loading access configuration...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-[#DCD6CB] pb-4">
        <h1 className="font-serif text-3xl text-[#1D1C1A]">Access Code Studio</h1>
        <p className="text-xs text-[#5D5A54] mt-1">Manage rotating class access codes and session revocation policies.</p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#315A4A] text-[#F7F4EE] text-xs font-medium animate-fadeIn">
          ✓ {toastMessage}
        </div>
      )}

      {/* Active Code Card */}
      <section className="p-6 rounded-2xl bg-[#F4E6CD]/40 border border-[#D89B3C]/40 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#D89B3C] font-bold">Active Class Code (Gen {metrics.activeCodeGeneration})</span>
            <div className="flex items-center space-x-3 mt-1">
              <span className="font-mono text-3xl font-bold tracking-widest text-[#1D1C1A]">
                {isMasked ? '••••••••' : metrics.activeCode}
              </span>
              <button
                onClick={() => setIsMasked(!isMasked)}
                className="text-xs font-medium text-[#5D5A54] hover:text-[#1D1C1A] underline"
              >
                {isMasked ? 'Unmask' : 'Mask'}
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsConfirmOpen(true)}
            className="py-3 px-6 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-xs font-semibold hover:bg-[#315A4A] transition-colors shadow-sm"
          >
            Rotate Access Code Now
          </button>
        </div>

        <div className="pt-4 border-t border-[#D89B3C]/30 flex flex-wrap justify-between text-xs text-[#5D5A54]">
          <span>Last Rotated: {new Date(metrics.lastRotatedAt).toLocaleString()}</span>
          <span>Automatic Daily Rotation: Enabled (America/New_York)</span>
        </div>
      </section>

      {/* Rotation Policy Notice */}
      <section className="p-6 rounded-2xl bg-[#EEE9E0] border border-[#DCD6CB] space-y-3 text-xs text-[#5D5A54] leading-relaxed">
        <h4 className="font-serif text-base text-[#1D1C1A]">Code Rotation Rules</h4>
        <p>
          1. Generating a new code immediately revokes all prior codes and invalidates existing senior HTTP-only sessions.
        </p>
        <p>
          2. Plaintext codes are never stored in log files or readable database history (salted HMAC verifier hashes only).
        </p>
      </section>

      {/* Rotation Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title="Rotate Class Access Code?"
        description="Rotating the access code creates a new 8-character code, invalidates all prior versions, and immediately ends all active senior sessions. You will need to share the new code with your class."
        confirmLabel="Rotate & Revoke Sessions"
        isDestructive={true}
        isLoading={isLoading}
        onConfirm={handleRotateConfirm}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
