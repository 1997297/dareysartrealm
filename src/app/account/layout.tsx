import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collector Portal',
  description: 'Private collector portal for acquired works, certificates of authenticity, and bespoke commissions.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
