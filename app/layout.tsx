import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VSB E-Cell | VSB College of Engineering & Technical Campus',
    template: '%s | VSB E-Cell',
  },
  description: 'The Entrepreneurship Cell of VSB College of Engineering & Technical Campus (VSBCETC), Coimbatore, Tamil Nadu. Converting student engineering hypotheses into enduring enterprises.',
  keywords: ['VSB E-Cell', 'VSBCETC', 'Coimbatore', 'Entrepreneurship', 'Startup Incubator'],
  authors: [{ name: 'VSBCETC E-Cell' }],
  creator: 'VSBCETC E-Cell',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ecell.vsb.ac.in',
    title: 'VSB E-Cell | Entrepreneurship Cell • VSBCETC',
    description: 'Autonomous Student Incubator & Venture Foundry at VSB College of Engineering & Technical Campus, Coimbatore.',
    siteName: 'VSB E-Cell',
    images: [{ url: '/logo.png', width: 600, height: 600, alt: 'VSB E-Cell Official Logo' }],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FBF9F4',
};

import { DynamicCanvas } from '@/components/ui/DynamicCanvas';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-paper">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-paper text-ink font-body selection:bg-vermilion selection:text-white min-h-screen relative">
        <DynamicCanvas />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
