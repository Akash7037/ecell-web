import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SubscribeSection from '@/components/ui/SubscribeSection';
import BlogCard from '@/components/ui/BlogCard';
import { getStoredBlogs } from '@/lib/dataStoreServer';
import { BookOpenIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Blog & Articles | E-Cell VSBCETC',
  description: 'Chronological articles, laboratory notes, and venture insights from student founders and engineers at E-Cell VSBCETC Coimbatore.',
  openGraph: {
    title: 'Blog & Articles | E-Cell VSBCETC',
    description: 'Chronological articles, laboratory notes, and venture insights from student founders and engineers at E-Cell VSBCETC Coimbatore.',
    type: 'website',
  },
};

export default async function BlogIndexPage() {
  const blogs = await getStoredBlogs();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        {/* Editorial Header */}
        <section className="border-b border-paper-muted bg-paper/60 backdrop-blur-xs">
          <div className="mx-auto max-w-5xl px-7 sm:px-8 md:px-6 py-12 md:py-20 text-center md:text-left">
            <p className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-ink-light mb-2.5 md:mb-3">
              E-Cell VSBCETC · Editorial & Dispatch
            </p>
            <h1 className="font-headline text-2xl sm:text-3xl md:text-5xl font-bold text-ink mb-3 md:mb-4">
              Blog & Field Notes
            </h1>
            <p className="text-[14px] sm:text-base md:text-lg text-ink-muted max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Engineering roadmaps, patent navigation, hardware lab debriefs, and venture dispatches from our student innovators in Coimbatore.
            </p>
          </div>
        </section>

        {/* Blog Post List (Chronological: Newest on Top) */}
        <section className="mx-auto max-w-5xl px-7 sm:px-8 md:px-6 py-8 md:py-16">
          {blogs.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-paper-muted rounded-lg bg-paper-light/30">
              <BookOpenIcon className="mx-auto h-10 w-10 text-ink-light mb-4" />
              <p className="font-headline text-xl font-bold text-ink mb-2">No Articles Published Yet</p>
              <p className="text-sm text-ink-muted max-w-md mx-auto">
                Our editorial council is currently drafting new dispatches. Check back soon or visit our admin panel to publish the first story.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-paper-muted border-t border-paper-muted">
              {blogs.map((post) => (
                <BlogCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Stay Connected / Subscribe */}
        <SubscribeSection />
      </main>
      <Footer />
    </>
  );
}
