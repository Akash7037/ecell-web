import type { Metadata, Viewport } from 'next';
import LoadingScreen from '@/components/ui/LoadingScreen';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecell-vsbcetc.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'E-Cell VSBCETC | Entrepreneurship Cell, Coimbatore',
    template: '%s | E-Cell VSBCETC',
  },
  description:
    'Official Entrepreneurship Cell of VSB College of Engineering & Technical Campus (VSBCETC), Coimbatore. Empowering student innovators, hosting Project Expo, startup summits, and nurturing student founders across Tamil Nadu.',
  keywords: [
    'E-Cell VSBCETC',
    'VSBCETC E-Cell',
    'VSB E-Cell',
    'VSB College of Engineering and Technical Campus',
    'VSB Coimbatore Entrepreneurship',
    'Entrepreneurship Cell Coimbatore',
    'Project Expo 2026',
    'Student Startups Tamil Nadu',
    'College Incubator Coimbatore',
    'VSBCETC Innovation',
    'Anna University E-Cell',
  ],
  authors: [{ name: 'E-Cell VSBCETC', url: SITE_URL }],
  creator: 'E-Cell VSBCETC',
  publisher: 'VSB College of Engineering & Technical Campus',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    title: 'E-Cell VSBCETC | Entrepreneurship Cell, Coimbatore',
    description:
      'Official Entrepreneurship Cell of VSB College of Engineering & Technical Campus. Empowering student innovators, Project Expo 2026, and startup initiatives.',
    siteName: 'E-Cell VSBCETC',
    images: [
      {
        url: '/logo.png',
        width: 600,
        height: 600,
        alt: 'E-Cell VSBCETC Official Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Cell VSBCETC | Entrepreneurship Cell',
    description:
      'Official Entrepreneurship Cell of VSB College of Engineering & Technical Campus, Coimbatore.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '5151aacb9502f194',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF9F6',
};

// JSON-LD Structured Data for Google Knowledge Graph & Rich Results
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: 'E-Cell VSBCETC',
      alternateName: [
        'Entrepreneurship Cell VSB CETC',
        'VSB E-Cell',
        'VSBCETC E-Cell',
        'VSB College Entrepreneurship Cell',
      ],
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        'Official Entrepreneurship Cell of VSB College of Engineering & Technical Campus, Coimbatore, Tamil Nadu.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Pollachi Main Road',
        addressLocality: 'Coimbatore',
        addressRegion: 'Tamil Nadu',
        postalCode: '642109',
        addressCountry: 'IN',
      },
      parentOrganization: {
        '@type': 'CollegeOrUniversity',
        name: 'VSB College of Engineering & Technical Campus',
        url: 'https://vsbcetc.ac.in',
      },
      sameAs: [
        'https://instagram.com/ecell_vsbcetc',
        'https://linkedin.com/company/ecell-vsbcetc',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'E-Cell VSBCETC',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Quattrocento+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LoadingScreen />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
