'use client';

import React from 'react';

interface CapsuleHeroProps {
  name: string;
  schoolName: string;
  graduationYear: number;
  welcomeText: string | null;
  accentTheme: string;
}

export const CapsuleHero: React.FC<CapsuleHeroProps> = ({
  name,
  schoolName,
  graduationYear,
  welcomeText,
}) => {
  return (
    <section className="relative w-full rounded-2xl overflow-hidden bg-[#16191C] text-[#F7F4EE] shadow-lg mb-12">
      {/* Editorial Cover Background Texture / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#16191C] via-[#16191C]/75 to-transparent z-10" />
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center filter saturate-50 contrast-125"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop')`,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-20 p-8 md:p-16 max-w-3xl space-y-6 flex flex-col justify-end min-h-[380px] md:min-h-[460px]">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#D89B3C] text-[#16191C] text-xs font-bold uppercase tracking-wider">
            Class of {graduationYear} Archive
          </span>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-[#F7F4EE] leading-tight">
            {name}
          </h1>
          <p className="text-sm md:text-base text-[#DCD6CB] font-medium tracking-wide">
            {schoolName}
          </p>
        </div>

        {welcomeText && (
          <p className="font-serif italic text-base md:text-xl text-[#F4E6CD] border-l-2 border-[#D89B3C] pl-4 max-w-xl leading-relaxed">
            &ldquo;{welcomeText}&rdquo;
          </p>
        )}
      </div>
    </section>
  );
};
