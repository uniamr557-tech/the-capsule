'use client';

import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  accent?: 'default' | 'marigold' | 'evergreen' | 'rose';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  accent = 'default',
  action,
}) => {
  const accentClasses = {
    default: 'border-[#DCD6CB] bg-[#EEE9E0]',
    marigold: 'border-[#D89B3C]/40 bg-[#F4E6CD]/40',
    evergreen: 'border-[#315A4A]/40 bg-[#D8E8E0]/40',
    rose: 'border-[#B95B5B]/40 bg-[#B95B5B]/10',
  };

  return (
    <div className={`p-6 rounded-2xl border ${accentClasses[accent]} space-y-3 shadow-sm flex flex-col justify-between`}>
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-wider text-[#5D5A54]">{label}</span>
        <div className="font-serif text-3xl text-[#1D1C1A]">{value}</div>
        {subtext && <p className="text-xs text-[#5D5A54]">{subtext}</p>}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 w-full py-2 px-4 rounded-xl bg-[#1D1C1A] text-[#F7F4EE] text-xs font-medium hover:bg-[#315A4A] transition-colors focus:ring-2 focus:ring-[#245CBA]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
