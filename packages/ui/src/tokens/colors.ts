/**
 * Design Token Foundation — Color Palette
 * Source of Truth: Experience & Visual Identity Specification Section 2.2
 */

export const colors = {
  paper: '#F7F4EE',        // Primary warm canvas
  paperDeep: '#EEE9E0',    // Section separation & skeleton base
  ink: '#1D1C1A',          // Primary text & UI contrast
  inkSoft: '#5D5A54',      // Secondary text, metadata
  hairline: '#DCD6CB',     // Dividers, restrained borders
  night: '#16191C',        // Dark media/theater surfaces
  nightSoft: '#272B2F',    // Dark elevated controls
  marigold: '#D89B3C',     // Default signature accent
  marigoldWash: '#F4E6CD', // Accent background
  evergreen: '#315A4A',    // Secondary accent, confirmation/permanence
  rose: '#B95B5B',         // Error/destructive state
  focusBlue: '#245CBA',    // High-contrast focus indicator (WCAG AA)
} as const;

export type ColorToken = keyof typeof colors;
