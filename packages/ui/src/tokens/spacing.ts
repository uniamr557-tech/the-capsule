/**
 * Design Token Foundation — Spacing & Radii Systems
 * Source of Truth: Experience & Visual Identity Specification Section 2.7
 */

export const spacing = {
  base: 4,
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  hero: '64px',
  section: '96px',
  max: '128px',
} as const;

export const radii = {
  xs: '6px',   // Form controls & compact utilities
  m: '12px',   // Panels, cards, media thumbnails
  l: '20px',   // Hero media, modal sheets, major displays
  full: '9999px', // Pills only for status/filters
} as const;
