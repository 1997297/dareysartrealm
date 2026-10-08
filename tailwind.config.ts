import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FAF8F5',   // Primary warm white / gallery canvas
          subtle: '#F4F1EA',    // Soft cream / slightly deeper neutral
          paper: '#FBF9F6',     // Lightest paper tint
          muted: '#EFECE4',     // Architectural neutral
          border: '#E5E0D6',    // Soft separator
        },
        charcoal: {
          DEFAULT: '#141413',   // Primary deep text (near-black)
          light: '#2B2A27',     // Secondary dark
          muted: '#57544F',     // Tertiary editorial body
          subtle: '#8C877F',    // Metadata / caption
          line: '#D8D3C8',      // Hairline borders
        },
        accent: {
          cobalt: '#1E40AF',    // Electric / deep cobalt
          vermilion: '#E03E26', // Striking vermilion / orange-red
          sunflower: '#EAB308', // Sunflower gold
          lime: '#65A30D',      // Electric lime
          purple: '#7C3AED',    // Royal artistic purple
          coral: '#F43F5E',     // Radiant coral
        },
      },
      fontFamily: {
        display: [
          'var(--font-display)',
          'Georgia',
          'Palatino Linotype',
          'serif',
        ],
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        brush: [
          'var(--font-brush)',
          'Kaushan Script',
          'Alex Brush',
          'Brush Script MT',
          'cursive',
        ],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.06em' }],
        xs: ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.04em' }],
        sm: ['0.875rem', { lineHeight: '1.375rem', letterSpacing: '0.02em' }],
        base: ['1rem', { lineHeight: '1.625rem', letterSpacing: '0.01em' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.625rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1.02', letterSpacing: '-0.04em' }],
        '8xl': ['6rem', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
        '9xl': ['7.5rem', { lineHeight: '0.94', letterSpacing: '-0.05em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      maxWidth: {
        editorial: '45rem',
        gallery: '92rem',
      },
      aspectRatio: {
        portrait: '3 / 4',
        landscape: '4 / 3',
        tall: '2 / 3',
        wide: '16 / 9',
        panoramic: '21 / 9',
      },
      letterSpacing: {
        gallery: '0.18em',
        caps: '0.12em',
      },
      transitionTimingFunction: {
        artistic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        gallery: '0 20px 40px -15px rgba(20, 20, 19, 0.07)',
        'gallery-lg': '0 30px 60px -20px rgba(20, 20, 19, 0.12)',
        subtle: '0 4px 20px rgba(20, 20, 19, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
