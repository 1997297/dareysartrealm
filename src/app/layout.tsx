import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { AppProviders } from '@/components/providers/AppProviders';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';
import { fraunces, montserrat } from '@/lib/fonts';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Contemporary Artist & Gallery`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_TAGLINE} Contemporary original paintings, bespoke commissions, architectural murals, and fine art by Darey.`,
  keywords: [
    'Contemporary African Art',
    'Darey',
    'Artrealm',
    'Original Paintings',
    'Fine Art Commissions',
    'Contemporary Fine Art',
    'Gold Leaf on Linen',
    'Mixed Media Fine Art',
  ],
  authors: [{ name: 'Darey', url: 'https://dareysartrealm.com' }],
  creator: 'Darey',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dareysartrealm.com',
    title: `${SITE_NAME} | Contemporary Artist & Gallery`,
    description: SITE_TAGLINE,
    siteName: SITE_NAME,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${montserrat.variable} min-h-screen bg-canvas text-charcoal font-sans flex flex-col selection:bg-charcoal selection:text-canvas`}
      >
        <AppProviders>
          <CustomCursor />
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
