'use client';

import React, { useState } from 'react';
import { ContentCollectionService } from '@/lib/content-service';

interface UploadWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadWizard: React.FC<UploadWizardProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [contentType, setContentType] = useState<'photo' | 'video' | 'memory' | 'message'>('photo');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [tags, setTags] = useState('Senior Year, Memories');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    await ContentCollectionService.submitContent({
      type: contentType,
      title: title || undefined,
      body: body || undefined,
      caption: body || undefined,
      authorDisplayName: authorName || 'Anonymous Senior',
      tagLabels: tags.split(',').map((t) => t.trim()),
    });

    setIsSubmitting(false);
    setStep(4);
  };

  const handleFinish = () => {
    setStep(1);
    onSuccess();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#16191C]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="max-w-xl w-full bg-[#F7F4EE] rounded-2xl border border-[#DCD6CB] shadow-2xl p-6 md:p-8 space-y-6 text-[#1D1C1A]">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-[#DCD6CB] pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-[#D89B3C] text-[#16191C] px-2.5 py-0.5 rounded-full">
              Step {step} of 4
            </span>
            <h3 className="font-serif text-xl text-[#1D1C1A]">
              {step === 1 && 'Select Content Type'}
              {step === 2 && 'Upload or Write Content'}
              {step === 3 && 'Details & Author Name'}
              {step === 4 && 'Memory Saved!'}
            </h3>
          </div>
          <button onClick={onClose} className="text-xs text-[#5D5A54] hover:text-[#1D1C1A]">
            ✕
          </button>
        </div>

        {/* STEP 1: Type Selection */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4 py-4">
            {[
              { type: 'photo', title: '📷 Photo', desc: 'Candid senior photos' },
              { type: 'video', title: '🎬 Video', desc: 'Short video clips' },
              { type: 'memory', title: '✍️ Written Story', desc: 'Longer recollections' },
              { type: 'message', title: '💬 Class Message', desc: 'Short sign-offs' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  setContentType(item.type as any);
                  setStep(2);
                }}
                className={`p-5 rounded-2xl border text-left space-y-2 transition-all ${
                  contentType === item.type
                    ? 'border-[#1D1C1A] bg-[#EEE9E0]'
                    : 'border-[#DCD6CB] bg-[#F7F4EE] hover:border-[#D89B3C]'
                }`}
              >
                <div className="font-serif text-lg font-medium">{item.title}</div>
                <p className="text-xs text-[#5D5A54]">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: File or Text Entry */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            {contentType === 'photo' || contentType === 'video' ? (
              <div className="border-2 border-dashed border-[#DCD6CB] rounded-2xl p-8 text-center space-y-3 bg-[#EEE9E0]/50">
                <div className="w-12 h-12 rounded-full bg-[#D8E8E0] text-[#315A4A] flex items-center justify-center mx-auto text-xl">
                  📁
                </div>
                <p className="text-sm font-medium text-[#1D1C1A]">Drop your file here or click to browse</p>
                <p className="text-xs text-[#5D5A54]">
                  Supports JPG, PNG, WebP (up to 15MB) and MP4, MOV (up to 100MB). EXIF location metadata is automatically stripped.
                </p>
              </div>
            ) : (
              <textarea
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your story or message for your classmates..."
                className="w-full p-4 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A] text-sm focus:border-[#D89B3C]"
              />
            )}

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-xs text-[#5D5A54]">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-2.5 px-6 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-xs font-medium hover:bg-[#315A4A]"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Details & Name */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-[#1D1C1A] mb-1">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Prank Day 2026"
                className="w-full p-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1D1C1A] mb-1">Your Display Name *</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Maya L."
                className="w-full p-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1D1C1A] mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Senior Year, Graduation, Sports"
                className="w-full p-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-sm"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#F4E6CD]/60 border border-[#D89B3C]/40 text-xs text-[#5D5A54]">
              ℹ️ Submissions are shared directly with your class and cannot be edited after posting.
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="text-xs text-[#5D5A54]">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded-xl bg-[#315A4A] text-[#F7F4EE] text-xs font-medium hover:bg-[#1D1C1A]"
              >
                {isSubmitting ? 'Posting to Class...' : 'Post to Class Capsule ✨'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 rounded-full bg-[#D8E8E0] text-[#315A4A] flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h4 className="font-serif text-2xl text-[#1D1C1A]">Memory Successfully Added!</h4>
            <p className="text-xs text-[#5D5A54] max-w-sm mx-auto">
              Your memory is now preserved in your graduating class capsule.
            </p>
            <button
              onClick={handleFinish}
              className="py-3 px-8 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-xs font-medium hover:bg-[#315A4A]"
            >
              View in Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
