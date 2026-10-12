import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SubscribeSection from '@/components/ui/SubscribeSection';
import { getStoredBlogs, getStoredBlogBySlug } from '@/lib/dataStoreServer';
import { CalendarIcon, ClockIcon, ArrowLeftIcon, UserIcon, ExternalLinkIcon } from 'lucide-react';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getStoredBlogBySlug(params.slug);
  if (!post) {
    return {
      title: 'Article Not Found | E-Cell VSBCETC',
    };
  }

  return {
    title: `${post.title} | E-Cell VSBCETC Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getStoredBlogBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Format date e.g. "September 28, 2026"
  const formattedDate = (() => {
    try {
      const d = new Date(post.publishedAt);
      if (isNaN(d.getTime())) return post.publishedAt;
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return post.publishedAt;
    }
  })();

  const portfolioTargetUrl = post.authorPortfolioUrl || '/team';
  const isExternalPortfolio = Boolean(post.authorPortfolioUrl && post.authorPortfolioUrl.startsWith('http'));

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 md:pt-[72px]">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-paper-muted bg-paper/60 backdrop-blur-xs">
          <div className="mx-auto max-w-4xl px-7 sm:px-8 md:px-6 py-3.5 md:py-4 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-mono text-ink-muted hover:text-vermilion transition-colors focus:outline-none"
            >
              <ArrowLeftIcon size={14} />
              <span>Back to Articles</span>
            </Link>

            <span className="font-mono text-[10px] md:text-[11px] text-ink-light tracking-widest uppercase">
              Field Dispatch
            </span>
          </div>
        </div>

        {/* Article Header */}
        <header className="mx-auto max-w-4xl px-7 sm:px-8 md:px-6 pt-10 md:pt-16 text-center md:text-left">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 md:gap-2 mb-3.5 md:mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] md:text-[11px] tracking-wider uppercase text-rust px-2 py-0.5 rounded bg-rust/5 border border-rust/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Article Title: Slightly reduced font size on mobile, untouched on desktop */}
          <h1 className="font-headline text-[1.4rem] sm:text-2xl md:text-5xl font-bold text-ink leading-snug md:leading-tight tracking-tight mb-4 md:mb-6">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt: Slightly reduced font size on mobile, untouched on desktop */}
          {post.excerpt && (
            <p className="text-[14px] sm:text-base md:text-xl text-ink-muted leading-relaxed mb-5 md:mb-6 font-normal">
              {post.excerpt}
            </p>
          )}

          {/* Metadata Bar with Interactive Author Portfolio Link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 md:gap-4 py-3.5 md:py-4 border-y border-paper-muted text-[11px] md:text-xs font-mono text-ink-light">
            {/* Interactive Author Portfolio Card / Avatar: Touching leads directly to portfolio */}
            {isExternalPortfolio ? (
              <a
                href={portfolioTargetUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${post.author}'s Portfolio`}
                className="group/author flex items-center gap-2.5 md:gap-3 p-1 -m-1 rounded hover:bg-paper-light transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-vermilion"
              >
                <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full bg-paper-light border border-paper-muted overflow-hidden shrink-0 flex items-center justify-center text-ink shadow-2xs group-hover/author:border-vermilion transition-colors">
                  {post.authorAvatarUrl ? (
                    <img
                      src={post.authorAvatarUrl}
                      alt={post.author}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={16} />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 font-semibold text-ink text-[13px] md:text-sm leading-none mb-1 group-hover/author:text-vermilion transition-colors">
                    <span>{post.author}</span>
                    <ExternalLinkIcon size={10} className="text-ink-light group-hover/author:text-vermilion" />
                  </div>
                  {post.authorRole && (
                    <p className="text-[10px] md:text-[11px] text-ink-muted leading-none">
                      {post.authorRole}
                    </p>
                  )}
                </div>
              </a>
            ) : (
              <Link
                href="/team"
                title={`View team members at E-Cell`}
                className="group/author flex items-center gap-2.5 md:gap-3 p-1 -m-1 rounded hover:bg-paper-light transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-vermilion"
              >
                <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full bg-paper-light border border-paper-muted overflow-hidden shrink-0 flex items-center justify-center text-ink shadow-2xs group-hover/author:border-vermilion transition-colors">
                  {post.authorAvatarUrl ? (
                    <img
                      src={post.authorAvatarUrl}
                      alt={post.author}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={16} />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-ink text-[13px] md:text-sm leading-none mb-1 group-hover/author:text-vermilion transition-colors">
                    {post.author}
                  </p>
                  {post.authorRole && (
                    <p className="text-[10px] md:text-[11px] text-ink-muted leading-none">
                      {post.authorRole}
                    </p>
                  )}
                </div>
              </Link>
            )}

            <div className="flex items-center gap-3 md:gap-4 text-ink-muted">
              <span className="inline-flex items-center gap-1.5 text-rust font-semibold">
                <CalendarIcon size={13} className="shrink-0" />
                <time dateTime={post.publishedAt}>{formattedDate}</time>
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon size={13} className="shrink-0" />
                <span>{post.readTime || '4 min read'}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image (Responsive & strictly non-stretched) */}
        {post.coverImageUrl && (
          <div className="mx-auto max-w-4xl px-7 sm:px-8 md:px-6 my-6 md:my-10">
            <div className="relative w-full max-h-[480px] overflow-hidden rounded-lg border border-paper-muted bg-paper-light">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-auto max-h-[480px] object-cover mx-auto"
                priority-hint="high"
              />
            </div>
          </div>
        )}

        {/* Article Body formatted with HTML (.blog-prose) */}
        <article className="mx-auto max-w-4xl px-7 sm:px-8 md:px-6 pb-16">
          <div
            className="blog-prose mx-auto"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Clean Article Footer: Just back button, bottom portfolio link removed */}
          <div className="mt-12 md:mt-14 pt-6 md:pt-8 border-t border-paper-muted flex items-center justify-start">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-mono text-rust hover:text-vermilion transition-colors"
            >
              <ArrowLeftIcon size={14} />
              <span>Back to all articles</span>
            </Link>
          </div>
        </article>

        {/* Subscribe Section */}
        <SubscribeSection />
      </main>
      <Footer />
    </>
  );
}
