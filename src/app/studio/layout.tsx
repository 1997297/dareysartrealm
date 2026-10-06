import type { Metadata } from 'next';
import { StudioClientShell } from './StudioClientShell';

export const metadata: Metadata = {
  title: 'Artrealm Studio',
  description: 'Private operational workspace and curatorial studio administration.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <StudioClientShell>{children}</StudioClientShell>;
}
