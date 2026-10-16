import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { StoredBlogPost } from '@/lib/dataStoreServer';

interface BlogCardProps {
  post: StoredBlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  // Format readable date e.g. "Sep 28, 2026"
  const formattedDate = (() => {
    try {
      const d = new Date(post.publishedAt);
      if (isNaN(d.getTime())) return post.publishedAt;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return post.publishedAt;
    }
  })();

  return (
    <article className="group relative flex flex-col md:flex-row items-stretch gap-6 md:gap-8 py-8 md:py-10 border-b border-paper-muted transition-colors">
      {/* Cover Image (if available) - Enforced non-stretch aspect ratio */}
      {post.coverImageUrl && (
        <div className="relative w-full md:w-72 lg:w-80 h-52 md:h-48 shrink-0 overflow-hidden rounded bg-paper-light border border-paper-muted">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Top-Center Rectangle Notch */}
          {post.showLogoOverlay !== false && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-[#FAF9F6] border-b border-x border-t-0 border-stone-300/80 shadow-2xs rounded-t-none rounded-b-xl flex items-center justify-center">
              <img
                src="/images/blog-header-badge.png"
                alt="E-Cell Badge"
                className="h-5 sm:h-5.5 w-auto max-w-[160px] sm:max-w-[180px] object-contain select-none pointer-events-none"
              />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0 text-center md:text-left">
        <div>
          {/* Metadata Row: Date & Reading Time */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 md:gap-3 text-[11px] md:text-xs font-mono text-ink-light mb-2.5 md:mb-3">
            <span className="inline-flex items-center gap-1.5 text-vermilion font-semibold">
              <CalendarIcon size={12} className="shrink-0" />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </span>
            <span className="text-paper-muted">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon size={12} className="shrink-0" />
              <span>{post.readTime || '4 min read'}</span>
            </span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="text-paper-muted">·</span>
                <span className="text-ink-muted uppercase tracking-wider text-[10px] md:text-[11px]">
                  {post.tags.slice(0, 2).join(' / ')}
                </span>
              </>
            )}
          </div>

          {/* Title: Slightly reduced font size on mobile, untouched on desktop */}
          <h2 className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-ink leading-snug group-hover:text-vermilion transition-colors duration-200 mb-2 md:mb-3">
            <Link href={`/blog/${post.slug}`} className="focus:outline-none">
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {post.title}
            </Link>
          </h2>

          {/* Excerpt: Slightly reduced font size on mobile, untouched on desktop */}
          <p className="text-[13px] md:text-base text-ink-muted leading-relaxed line-clamp-3 mb-3.5 md:mb-4">
            {post.excerpt}
          </p>
        </div>

        {/* Footer / Author Row */}
        <div className="flex items-center justify-between pt-2 border-t border-paper-muted/60 text-xs font-mono">
          <div className="flex items-center justify-center md:justify-start gap-2.5 w-full md:w-auto text-ink-light">
            {post.authorAvatarUrl && (
              <img
                src={post.authorAvatarUrl}
                alt={post.author}
                className="w-5 h-5 rounded-full object-cover border border-paper-muted shrink-0"
              />
            )}
            <span>By <strong className="font-semibold text-ink">{post.author}</strong></span>
            {post.authorRole && (
              <>
                <span className="text-paper-muted hidden sm:inline">·</span>
                <span className="text-ink-muted hidden sm:inline">{post.authorRole}</span>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono font-semibold text-vermilion group-hover:translate-x-1 transition-transform duration-200">
            <span>Read Article</span>
            <ArrowRightIcon size={14} />
          </div>
        </div>
      </div>
    </article>
  );
}
