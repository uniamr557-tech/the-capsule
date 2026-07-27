'use client';

import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-desc"
      className="fixed inset-0 z-50 bg-[#16191C]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="max-w-md w-full bg-[#F7F4EE] rounded-2xl border border-[#DCD6CB] shadow-2xl p-6 space-y-6 text-[#1D1C1A]">
        <div className="space-y-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-[#B95B5B]/10 text-[#B95B5B]' : 'bg-[#F4E6CD] text-[#D89B3C]'}`}>
            {isDestructive ? '⚠️' : 'ℹ️'}
          </div>
          <h3 id="dialog-title" className="font-serif text-2xl text-[#1D1C1A]">
            {title}
          </h3>
          <p id="dialog-desc" className="text-xs md:text-sm text-[#5D5A54] leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#DCD6CB]">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="py-2.5 px-4 rounded-xl border border-[#DCD6CB] text-xs font-medium text-[#5D5A54] hover:bg-[#EEE9E0] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`py-2.5 px-5 rounded-xl text-xs font-semibold text-[#F7F4EE] transition-colors shadow-sm ${
              isDestructive ? 'bg-[#B95B5B] hover:bg-[#8e3f3f]' : 'bg-[#1D1C1A] hover:bg-[#315A4A]'
            }`}
          >
            {isLoading ? 'Executing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
