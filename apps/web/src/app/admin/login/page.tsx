'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'magic_link' | 'recovery_code'>('magic_link');
  const [email, setEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      if (authMode === 'magic_link') {
        setMessage(`✨ Magic link sent to ${email}! Check your inbox to enter Admin Studio.`);
      } else {
        if (recoveryCode.trim().length >= 8) {
          // Direct login for demo verification
          router.push('/admin/studio/cap_2026_oakridge');
        } else {
          setMessage('Invalid recovery secret code.');
        }
      }
    }, 600);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between p-6 md:p-12 bg-[#F7F4EE] text-[#1D1C1A]">
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#1D1C1A] text-[#F7F4EE] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#D89B3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m12.707-4.707l-11.414 11.414m0-11.414l11.414 11.414" />
            </svg>
          </div>
          <span className="font-serif text-xl text-[#1D1C1A]">The Capsule Studio</span>
        </div>
        <a href="/" className="text-xs text-[#5D5A54] hover:text-[#1D1C1A]">← Class Entry Threshold</a>
      </header>

      <section className="my-auto max-w-md w-full mx-auto space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#EEE9E0] text-[#315A4A] text-xs font-mono uppercase">
            Operations Console
          </span>
          <h1 className="font-serif text-4xl text-[#1D1C1A]">Senior Admin Login</h1>
          <p className="text-xs text-[#5D5A54]">
            Passwordless authentication for the Senior Admin.
          </p>
        </div>

        <div className="bg-[#EEE9E0] p-6 rounded-2xl border border-[#DCD6CB] space-y-6 shadow-sm">
          {/* Auth Mode Toggle */}
          <div className="flex rounded-xl bg-[#F7F4EE] p-1 border border-[#DCD6CB]">
            <button
              onClick={() => setAuthMode('magic_link')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                authMode === 'magic_link' ? 'bg-[#1D1C1A] text-[#F7F4EE]' : 'text-[#5D5A54]'
              }`}
            >
              Magic Link
            </button>
            <button
              onClick={() => setAuthMode('recovery_code')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                authMode === 'recovery_code' ? 'bg-[#1D1C1A] text-[#F7F4EE]' : 'text-[#5D5A54]'
              }`}
            >
              Recovery Secret
            </button>
          </div>

          {message && (
            <div className="p-3.5 rounded-xl bg-[#315A4A]/10 border border-[#315A4A]/30 text-[#315A4A] text-xs font-medium text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'magic_link' ? (
              <div>
                <label htmlFor="admin-email" className="block text-xs font-medium text-[#1D1C1A] mb-1">
                  Admin Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@school.edu"
                  className="w-full p-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A] text-sm"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="recovery-code" className="block text-xs font-medium text-[#1D1C1A] mb-1">
                  One-Time Recovery Secret Key
                </label>
                <input
                  id="recovery-code"
                  type="password"
                  required
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="Enter recovery secret"
                  className="w-full p-3 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A] text-sm font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-sm font-medium hover:bg-[#315A4A] transition-colors focus:ring-2 focus:ring-[#245CBA]"
            >
              {isLoading ? 'Processing...' : authMode === 'magic_link' ? 'Send Magic Link' : 'Authenticate with Secret'}
            </button>
          </form>
        </div>
      </section>

      <footer className="w-full text-center text-xs text-[#5D5A54] max-w-5xl mx-auto pt-8">
        <p>The Capsule Studio &copy; {new Date().getFullYear()} — Secure Operations Console</p>
      </footer>
    </main>
  );
}
