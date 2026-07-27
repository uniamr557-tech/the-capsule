/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: '#F7F4EE',
          deep: '#EEE9E0',
        },
        ink: {
          DEFAULT: '#1D1C1A',
          soft: '#5D5A54',
        },
        hairline: '#DCD6CB',
        night: {
          DEFAULT: '#16191C',
          soft: '#272B2F',
        },
        marigold: {
          DEFAULT: '#D89B3C',
          wash: '#F4E6CD',
        },
        evergreen: '#315A4A',
        rose: '#B95B5B',
        'focus-blue': '#245CBA',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
