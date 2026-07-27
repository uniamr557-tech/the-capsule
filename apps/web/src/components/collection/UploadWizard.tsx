'use client';

import React, { useState } from 'react';
import { CreateContentItemRequest } from '@capsule/api-contracts';
import { MediaPolicyManager, ContentItemValidator } from '@capsule/domain';
import { ContentCollectionService } from '../../lib/content-service';

interface UploadWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type WizardStep = 1 | 2 | 3 | 4;

export const UploadWizard: React.FC<UploadWizardProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<WizardStep>(1);
  const [type, setType] = useState<'photo' | 'video' | 'memory' | 'message'>('photo');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [caption, setCaption] = useState('');
  const [momentDate, setMomentDate] = useState('');
  const [tagInput, setTagInput] = useState('Senior Year');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!MediaPolicyManager.isAllowedMimeType(selected.type)) {
      setError(`File type '${selected.type}' is not supported. Please select a valid photo or video.`);
      return;
    }

    const validation = MediaPolicyManager.validateFileSize(selected.type, selected.size);
    if (!validation.valid) {
      setError(validation.error || 'File exceeds maximum upload size.');
      return;
    }

    setFile(selected);
    // Simulate upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if ((type === 'photo' || type === 'video') && !file) {
        setError('Please select a file to upload.');
        return;
      }
      if ((type === 'memory' || type === 'message') && !body.trim()) {
        setError('Please write your story or message.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!authorName.trim()) {
        setError('Please enter your display name for attribution.');
        return;
      }
      setStep(4);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateContentItemRequest = {
        type,
        authorDisplayName: authorName,
        title: title || undefined,
        body: body || undefined,
        caption: caption || undefined,
        mediaAssetId: file ? `med_uploaded_${Date.now()}` : undefined,
        momentAt: momentDate ? new Date(momentDate).toISOString() : undefined,
        tagLabels: tagInput.split(',').map((t) => t.trim()).filter(Boolean),
      };

      await ContentCollectionService.submitContent(payload);
      setIsSubmitting(false);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit contribution.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add Memory to Capsule"
      className="fixed inset-0 z-50 bg-[#16191C]/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fadeIn"
    >
      <div className="max-w-xl w-full bg-[#F7F4EE] rounded-2xl border border-[#DCD6CB] shadow-2xl p-6 md:p-8 space-y-6 text-[#1D1C1A]">
        {/* Wizard Header */}
        <div className="flex items-center justify-between border-b border-[#DCD6CB] pb-4">
          <div>
            <span className="text-xs font-mono text-[#315A4A] bg-[#D8E8E0] px-2.5 py-0.5 rounded-full">
              Step {step} of 4
            </span>
            <h2 className="font-serif text-2xl text-[#1D1C1A] mt-1">Add to the Class Archive</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#5D5A54] hover:text-[#1D1C1A] p-2 rounded-lg hover:bg-[#EEE9E0]"
            aria-label="Cancel contribution"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#B95B5B]/10 border border-[#B95B5B]/30 text-[#B95B5B] text-xs font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: Choose Content Type */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-[#5D5A54]">Select what type of memory you want to add:</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'photo', label: 'Photo', icon: '📷', desc: 'Single photo with caption' },
                { key: 'video', label: 'Video', icon: '🎬', desc: 'Short video clip' },
                { key: 'memory', label: 'Written Memory', icon: '📖', desc: 'Long-form story or story' },
                { key: 'message', label: 'Class Message', icon: '💬', desc: 'Short note or sign-off' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setType(item.key as any)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    type === item.key
                      ? 'bg-[#1D1C1A] text-[#F7F4EE] border-[#1D1C1A]'
                      : 'bg-[#EEE9E0] text-[#1D1C1A] border-[#DCD6CB] hover:border-[#D89B3C]'
                  }`}
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="font-serif font-medium">{item.label}</div>
                  <div className="text-[11px] opacity-75 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Upload Media / Write Text */}
        {step === 2 && (
          <div className="space-y-4">
            {type === 'photo' || type === 'video' ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#1D1C1A]">Select {type}</label>
                <div className="border-2 border-dashed border-[#DCD6CB] rounded-xl p-6 text-center bg-[#EEE9E0]/50 hover:bg-[#EEE9E0] transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept={type === 'photo' ? 'image/*' : 'video/*'}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <div className="text-3xl">{type === 'photo' ? '🖼️' : '🎥'}</div>
                    <p className="text-xs font-medium text-[#1D1C1A]">
                      {file ? file.name : `Click or drag your ${type} here`}
                    </p>
                    <p className="text-[11px] text-[#5D5A54]">
                      Max {type === 'photo' ? '15MB' : '100MB'}. EXIF metadata is automatically stripped.
                    </p>
                  </div>
                </div>

                {file && uploadProgress > 0 && (
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-xs font-mono text-[#5D5A54]">
                      <span>Uploading & sanitizing EXIF...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#DCD6CB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#315A4A] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <label htmlFor="body-text" className="block text-sm font-medium text-[#1D1C1A]">
                  {type === 'memory' ? 'Written Memory' : 'Class Message'}
                </label>
                <textarea
                  id="body-text"
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={type === 'memory' ? 'Tell the story...' : 'Write your graduation message...'}
                  className="w-full p-4 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A] text-sm focus:border-[#D89B3C]"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Metadata Entry */}
        {step === 3 && (
          <div className="space-y-4 text-sm">
            <div>
              <label htmlFor="author-name" className="block font-medium text-[#1D1C1A] mb-1">
                Your Display Name <span className="text-[#B95B5B]">*</span>
              </label>
              <input
                id="author-name"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Jordan M."
                className="w-full p-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A]"
              />
            </div>

            <div>
              <label htmlFor="item-title" className="block font-medium text-[#1D1C1A] mb-1">
                Title (Optional)
              </label>
              <input
                id="item-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title for this memory"
                className="w-full p-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A]"
              />
            </div>

            {(type === 'photo' || type === 'video') && (
              <div>
                <label htmlFor="item-caption" className="block font-medium text-[#1D1C1A] mb-1">
                  Caption (Optional)
                </label>
                <input
                  id="item-caption"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Short caption"
                  className="w-full p-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A]"
                />
              </div>
            )}

            <div>
              <label htmlFor="moment-date" className="block font-medium text-[#1D1C1A] mb-1">
                Moment Date (Optional)
              </label>
              <input
                id="moment-date"
                type="date"
                value={momentDate}
                onChange={(e) => setMomentDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A]"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Review & Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F4E6CD] text-[#1D1C1A] border border-[#D89B3C]/30 text-xs space-y-1">
              <p className="font-semibold">⚠️ Class Sharing Notice</p>
              <p className="text-[#5D5A54] leading-relaxed">
                Submissions are shared directly with your class and cannot be edited after posting. Please confirm details below:
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EEE9E0] text-xs space-y-2">
              <div><strong className="text-[#5D5A54]">Type:</strong> <span className="capitalize">{type}</span></div>
              <div><strong className="text-[#5D5A54]">Author:</strong> {authorName}</div>
              {title && <div><strong className="text-[#5D5A54]">Title:</strong> {title}</div>}
              {caption && <div><strong className="text-[#5D5A54]">Caption:</strong> {caption}</div>}
            </div>
          </div>
        )}

        {/* Wizard Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#DCD6CB]">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as WizardStep)}
              className="py-2.5 px-5 rounded-xl border border-[#DCD6CB] text-xs font-medium text-[#5D5A54] hover:bg-[#EEE9E0]"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="py-2.5 px-6 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-xs font-medium hover:bg-[#315A4A] transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="py-3 px-8 rounded-xl bg-[#315A4A] text-[#F7F4EE] text-xs font-semibold hover:bg-[#1D1C1A] transition-colors shadow-md"
            >
              {isSubmitting ? 'Finalizing Share...' : 'Confirm & Share with Class'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
