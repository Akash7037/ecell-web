import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'E-Cell VSBCETC | Entrepreneurship Cell',
    template: '%s | E-Cell VSBCETC',
  },
  description:
    'The Entrepreneurship Cell of VSB College of Engineering & Technical Campus, Coimbatore, Tamil Nadu. Building student innovators and venture founders.',
  keywords: ['VSB E-Cell', 'VSBCETC', 'Coimbatore', 'Entrepreneurship', 'Project Expo'],
  authors: [{ name: 'E-Cell VSBCETC' }],
  creator: 'E-Cell VSBCETC',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ecell.vsb.ac.in',
    title: 'E-Cell VSBCETC',
    description:
      'Entrepreneurship Cell at VSB College of Engineering & Technical Campus, Coimbatore.',
    siteName: 'E-Cell VSBCETC',
    images: [{ url: '/logo.png', width: 600, height: 600, alt: 'E-Cell VSBCETC Logo' }],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
