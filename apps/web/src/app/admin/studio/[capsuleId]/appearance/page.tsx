'use client';

import React, { useState } from 'react';
import { themeAccents, ThemeAccentKey } from '@capsule/ui';
import { DEMO_CAPSULE } from '@/lib/session';

export default function AppearanceStudioPage() {
  const [welcomeText, setWelcomeText] = useState(DEMO_CAPSULE.welcomeText);
  const [selectedTheme, setSelectedTheme] = useState<ThemeAccentKey>('marigold');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Appearance & Theme settings updated successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-[#DCD6CB] pb-4">
        <h1 className="font-serif text-3xl text-[#1D1C1A]">Appearance & Cover Studio</h1>
        <p className="text-xs text-[#5D5A54] mt-1">Customize your class capsule welcome message, cover imagery, and visual accent theme.</p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#315A4A] text-[#F7F4EE] text-xs font-medium animate-fadeIn">
          ✓ {toastMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        {/* Welcome Message */}
        <div className="space-y-2">
          <label htmlFor="welcome-msg" className="block text-sm font-medium text-[#1D1C1A]">
            Welcome Message
          </label>
          <textarea
            id="welcome-msg"
            rows={3}
            value={welcomeText}
            onChange={(e) => setWelcomeText(e.target.value)}
            className="w-full p-4 rounded-xl border border-[#DCD6CB] bg-[#F7F4EE] text-[#1D1C1A] text-sm focus:border-[#D89B3C]"
          />
          <p className="text-xs text-[#5D5A54]">
            Displays prominently on the capsule cover hero.
          </p>
        </div>

        {/* Accent Theme Picker */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[#1D1C1A]">Curated Accent Theme</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(Object.keys(themeAccents) as ThemeAccentKey[]).map((key) => {
              const theme = themeAccents[key];
              const isSelected = selectedTheme === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`p-4 rounded-xl border flex items-center space-x-3 transition-all ${
                    isSelected ? 'border-[#1D1C1A] bg-white shadow-md' : 'border-[#DCD6CB] bg-[#EEE9E0]'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full shadow-inner border border-black/10"
                    style={{ backgroundColor: theme.hex }}
                  />
                  <span className="text-xs font-medium text-[#1D1C1A]">{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[#DCD6CB]">
          <button
            type="submit"
            className="py-3 px-8 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-xs font-semibold hover:bg-[#315A4A] transition-colors shadow-sm"
          >
            Save Appearance Changes
          </button>
        </div>
      </form>
    </div>
  );
}
