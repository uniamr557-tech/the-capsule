'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CapsuleHeader } from '../../../components/ui/CapsuleHeader';
import { CollectionNav } from '../../../components/ui/CollectionNav';
import { DEMO_CAPSULE } from '../../../lib/session';

export default function CapsuleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Route guard check: Verify session from client storage
    const storedSession = localStorage.getItem('senior_session');
    if (!storedSession) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE] text-[#5D5A54] font-mono text-sm">
        Verifying session authorization...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1D1C1A]">
      <CapsuleHeader
        slug={params.slug || DEMO_CAPSULE.slug}
        capsuleName={DEMO_CAPSULE.name}
        schoolName={DEMO_CAPSULE.schoolName}
      />
      <CollectionNav slug={params.slug || DEMO_CAPSULE.slug} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
        {children}
      </main>

      <footer className="w-full text-center text-xs text-[#5D5A54] py-8 border-t border-[#DCD6CB]/60 mt-16">
        <p>The Capsule &copy; {new Date().getFullYear()} — {DEMO_CAPSULE.schoolName}. Preserved for years to come.</p>
      </footer>
    </div>
  );
}
