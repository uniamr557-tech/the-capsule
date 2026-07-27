'use client';

import React, { useState, useRef } from 'react';

interface CodeInputProps {
  onSuccess: (code: string) => void;
  errorMessage?: string | null;
  isLoading?: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ onSuccess, errorMessage, isLoading }) => {
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase();
    // Allow all letters A-Z and digits 0-9
    const filtered = raw
      .split('')
      .filter((char) => /[A-Z0-9]/.test(char))
      .slice(0, 8)
      .join('');

    setCode(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 8 && !isLoading) {
      onSuccess(code);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative flex flex-col items-center">
          <label htmlFor="access-code" className="sr-only">
            Class Access Code
          </label>
          <input
            ref={inputRef}
            id="access-code"
            type="text"
            value={code}
            onChange={handleChange}
            maxLength={8}
            placeholder="SENIOR26"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full text-center tracking-[0.35em] text-2xl md:text-3xl font-mono py-4 px-6 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A] placeholder-[#5D5A54]/40 focus:bg-white focus:border-[#D89B3C] shadow-sm transition-all duration-200 uppercase"
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-[#5D5A54] font-mono">
            Enter 8-character class code (e.g. SENIOR26)
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-lg bg-[#B95B5B]/10 border border-[#B95B5B]/30 text-[#B95B5B] text-sm text-center font-medium animate-fadeIn"
          >
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={code.length !== 8 || isLoading}
          className="w-full py-4 px-8 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] font-medium hover:bg-[#315A4A] focus:ring-2 focus:ring-offset-2 focus:ring-[#245CBA] disabled:opacity-40 disabled:hover:bg-[#1D1C1A] transition-all duration-200 flex items-center justify-center space-x-2 text-base"
        >
          {isLoading ? (
            <span>Verifying code...</span>
          ) : (
            <>
              <span>Enter Capsule</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
