'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CodeInput } from '../components/ui/CodeInput';
import { SessionGuardService, DEMO_CAPSULE } from '../lib/session';

export default function LandingPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeSubmit = (code: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate verification response delay
    setTimeout(() => {
      const result = SessionGuardService.validateCodeAndCreateSession(code);

      if (result.success && result.session) {
        // Store session in localStorage for demo client state
        localStorage.setItem('senior_session', JSON.stringify(result.session));
        router.push(`/capsules/${DEMO_CAPSULE.slug}`);
      } else {
        setErrorMessage(result.error || "That code isn't active. Ask your Senior Admin for the current one.");
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between p-6 md:p-12 bg-[#F7F4EE] text-[#1D1C1A]">
      {/* Top Header & Aperture Capsule Mark */}
      <header className="w-full flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#1D1C1A] text-[#F7F4EE] flex items-center justify-center shadow-sm">
            {/* Custom Aperture / Capsule Container Mark */}
            <svg className="w-5 h-5 text-[#D89B3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m12.707-4.707l-11.414 11.414m0-11.414l11.414 11.414" />
            </svg>
          </div>
          <span className="font-serif text-xl tracking-tight text-[#1D1C1A]">The Capsule</span>
        </div>

        <a
          href="/admin/login"
          className="text-xs font-medium text-[#5D5A54] hover:text-[#1D1C1A] transition-colors py-2 px-3 rounded-lg border border-[#DCD6CB] hover:bg-[#EEE9E0]"
        >
          Senior Admin Studio →
        </a>
      </header>

      {/* Main Ceremonial Threshold */}
      <section className="my-auto py-12 max-w-2xl mx-auto w-full text-center space-y-8 animate-fadeIn">
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F4E6CD] text-[#D89B3C] text-xs font-semibold uppercase tracking-wider">
            Private Class Archive
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#1D1C1A] tracking-tight leading-tight">
            A place for the year that changed everything.
          </h1>
          <p className="text-base md:text-lg text-[#5D5A54] max-w-lg mx-auto leading-relaxed">
            Enter your class access code to view the photos, videos, stories, and messages of your senior year.
          </p>
        </div>

        {/* Code Input Form */}
        <CodeInput onSuccess={handleCodeSubmit} errorMessage={errorMessage} isLoading={isLoading} />

        {/* Demo Helper Tip */}
        <div className="pt-4 border-t border-[#DCD6CB]/60 max-w-xs mx-auto">
          <p className="text-xs text-[#5D5A54]">
            Testing Demo Access Code: <code className="bg-[#EEE9E0] px-2 py-1 rounded text-[#1D1C1A] font-mono">SENIOR26</code>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-[#5D5A54] max-w-5xl mx-auto pt-8 border-t border-[#DCD6CB]/40">
        <p>The Capsule &copy; {new Date().getFullYear()} — Private Class Memory Archive. No ads. No public feeds.</p>
      </footer>
    </main>
  );
}
