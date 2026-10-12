import type { Metadata } from 'next';
import { BloggerGate } from '@/components/blogger/BloggerGate';
import { BloggerDashboard } from '@/components/blogger/BloggerDashboard';

export const metadata: Metadata = {
  title: 'Blogger Studio | E-Cell VSBCETC',
  robots: { index: false, follow: false },
};

export default function BloggerPage() {
  return (
    <BloggerGate>
      <BloggerDashboard />
    </BloggerGate>
  );
}
