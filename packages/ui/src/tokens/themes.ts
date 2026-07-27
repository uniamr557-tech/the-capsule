/**
 * Curated Theme Accents
 * Source of Truth: Experience & Visual Identity Specification Section 2.2
 */

export const themeAccents = {
  marigold: { hex: '#D89B3C', wash: '#F4E6CD', name: 'Marigold' },
  lakeBlue: { hex: '#3B7A9E', wash: '#D8E8F0', name: 'Lake Blue' },
  lilac: { hex: '#8B6B9E', wash: '#EADCF2', name: 'Lilac' },
  poppy: { hex: '#C25946', wash: '#F7E2DD', name: 'Poppy' },
  evergreen: { hex: '#315A4A', wash: '#D8E8E0', name: 'Evergreen' },
} as const;

export type ThemeAccentKey = keyof typeof themeAccents;
