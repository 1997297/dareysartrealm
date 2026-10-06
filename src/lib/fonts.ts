import localFont from 'next/font/local';

/**
 * Fraunces — editorial display & heading font
 * Variable serif with distinct optical charm, loaded across 300, 400, 500, 600, 700 weights with true italics.
 */
export const fraunces = localFont({
  src: [
    {
      path: '../assets/fonts/fraunces/fraunces-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fraunces/fraunces-300-italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fraunces/fraunces-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fraunces/fraunces-400-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fraunces/fraunces-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fraunces/fraunces-500-italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fraunces/fraunces-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fraunces/fraunces-600-italic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fraunces/fraunces-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'Palatino Linotype', 'serif'],
});

/**
 * Montserrat — body and interface font
 * Variable font covering the full weight axis (100–900).
 * Load normal + italic for complete coverage without extra requests.
 */
export const montserrat = localFont({
  src: [
    {
      path: '../assets/fonts/montserrat/Montserrat.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../assets/fonts/montserrat/Montserrat-Italic.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});
