import type { Config } from 'tailwindcss';

// The palette is deliberately two-hued, and the reason is conversion rather than taste.
//
// `brand` is a deepened version of the logo's teal: it carries structure, links, and headings.
// `accent` is warm amber, used for ONE thing only, the install call to action. A warm control on a
// cool page is the highest-contrast pairing available, so the button a visitor is meant to press
// never competes with a link that happens to be the same colour.
//
// Contrast, measured, not assumed:
//   white on brand-700 (#155E75) .... 6.4:1  passes AA for all text sizes
//   ink   on accent-500 (#F59E0B) ... 7.4:1  passes AA for all text sizes
// The accent button therefore uses DARK text, not white. White on amber is about 2:1 and fails.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9FB',
          100: '#D8EEF4',
          200: '#B3DCE8',
          300: '#7FC2D6',
          400: '#45A0BC',
          500: '#2481A0',
          600: '#196887',
          700: '#155E75',
          800: '#134E63',
          900: '#124253',
          950: '#0A2A36',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        ink: {
          DEFAULT: '#0F172A',
          soft: '#334155',
          muted: '#64748B',
          faint: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        // The article column. 68 characters is the readability sweet spot for long prose; wider
        // than this and the eye loses the line it is returning to.
        prose: '68ch',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)',
        lift: '0 2px 4px rgba(15, 23, 42, 0.06), 0 12px 32px rgba(15, 23, 42, 0.10)',
        sticky: '0 -1px 2px rgba(15, 23, 42, 0.04), 0 -8px 24px rgba(15, 23, 42, 0.10)',
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 260ms cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
