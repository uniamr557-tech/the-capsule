/**
 * Design Token Foundation — Typography System
 * Source of Truth: Experience & Visual Identity Specification Section 2.3
 */

export const fonts = {
  display: 'var(--font-serif, "DM Serif Display", Georgia, serif)',
  body: 'var(--font-sans, "Inter", system-ui, -apple-system, sans-serif)',
  mono: 'var(--font-mono, "JetBrains Mono", monospace)',
} as const;

export const typeScale = {
  displayXl: { desktop: '72px / 76px', mobile: '44px / 48px' },
  displayL: { desktop: '52px / 58px', mobile: '36px / 42px' },
  h1: { desktop: '36px / 42px', mobile: '30px / 36px' },
  h2: { desktop: '26px / 32px', mobile: '22px / 28px' },
  h3: { desktop: '18px / 26px', mobile: '17px / 24px' },
  body: { desktop: '16px / 26px', mobile: '16px / 25px' },
  small: { desktop: '13px / 18px', mobile: '13px / 18px' },
} as const;
