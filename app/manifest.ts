import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'E-Cell VSBCETC | Entrepreneurship Cell',
    short_name: 'E-Cell VSBCETC',
    description:
      'The official Entrepreneurship Cell of VSB College of Engineering & Technical Campus, Coimbatore.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF9F6',
    theme_color: '#C2410C',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
