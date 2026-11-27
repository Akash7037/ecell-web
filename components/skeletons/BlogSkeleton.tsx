import React from 'react';

export default function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px]">
      {/* Editorial Header Skeleton - Matches app/blog/page.tsx */}
      <section className="border-b border-paper-muted bg-paper/60 backdrop-blur-xs">
        <div className="mx-auto max-w-5xl px-7 sm:px-8 md:px-6 py-12 md:py-20 text-center md:text-left">
          <div className="cascade-item cascade-delay-0">
            {/* Tagline */}
            <div className="h-3.5 w-48 rounded-xs skeleton-box mx-auto md:mx-0 mb-2.5 md:mb-3" />
            {/* Title */}
            <div className="h-8 sm:h-10 md:h-12 w-56 sm:w-72 md:w-88 rounded-sm skeleton-box mx-auto md:mx-0 mb-3 md:mb-4" />
            {/* Subtitle */}
            <div className="space-y-2 max-w-2xl mx-auto md:mx-0">
              <div className="h-4 w-full rounded-xs skeleton-box" />
              <div className="h-4 w-4/5 mx-auto md:mx-0 rounded-xs skeleton-box" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Cards List Skeleton */}
      <section className="mx-auto max-w-5xl px-7 sm:px-8 md:px-6 py-8 md:py-16">
        <div className="divide-y divide-paper-muted border-t border-paper-muted">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className={`cascade-item cascade-delay-${i + 1} flex flex-col md:flex-row items-stretch gap-6 md:gap-8 py-8 md:py-10 border-b border-paper-muted`}
            >
              {/* Cover Image Block with Top White Branding Bar - Exact dimensions */}
              <div className="relative w-full md:w-72 lg:w-80 h-56 md:h-52 shrink-0 overflow-hidden rounded bg-paper border border-paper-muted flex flex-col shadow-2xs">
                {/* Top Branding Bar */}
                <div className="h-[34px] bg-white border-b border-paper-muted px-3 py-1.5 flex items-center justify-between shrink-0 z-10">
                  <div className="h-4 w-5 rounded-xs skeleton-box" />
                  <div className="h-3.5 w-16 rounded-xs skeleton-box" />
                  <div className="h-3.5 w-5 rounded-xs skeleton-box" />
                </div>
                {/* Image Area */}
                <div className="relative w-full flex-1 min-h-0 overflow-hidden skeleton-box" />
              </div>

              {/* Content Side - Responsive & Centered on Mobile */}
              <div className="flex flex-col justify-between flex-1 min-w-0 text-center md:text-left">
                <div>
                  {/* Metadata Row: Date & Reading Time */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 md:gap-3 mb-2.5 md:mb-3">
                    <div className="h-3.5 w-24 rounded-xs skeleton-box" />
                    <div className="h-3 w-1.5 rounded-full skeleton-box" />
                    <div className="h-3.5 w-16 rounded-xs skeleton-box" />
                    <div className="h-3 w-1.5 rounded-full skeleton-box hidden sm:block" />
                    <div className="h-3.5 w-20 rounded-xs skeleton-box hidden sm:block" />
                  </div>

                  {/* Title */}
                  <div className="h-6 sm:h-7 md:h-8 w-4/5 sm:w-3/4 md:w-4/5 mx-auto md:mx-0 rounded-sm skeleton-box mb-2 md:mb-3" />

                  {/* Excerpt */}
                  <div className="space-y-2 mb-3.5 md:mb-4 max-w-md md:max-w-none mx-auto md:mx-0">
                    <div className="h-3.5 md:h-4 w-full rounded-xs skeleton-box" />
                    <div className="h-3.5 md:h-4 w-11/12 mx-auto md:mx-0 rounded-xs skeleton-box" />
                    <div className="h-3.5 md:h-4 w-3/4 mx-auto md:mx-0 rounded-xs skeleton-box" />
                  </div>
                </div>

                {/* Footer / Author Row */}
                <div className="flex items-center justify-center md:justify-start pt-2 border-t border-paper-muted/60 text-xs font-mono">
                  <div className="flex items-center justify-center md:justify-start gap-2.5 w-full md:w-auto">
                    <div className="w-5 h-5 rounded-full skeleton-box shrink-0" />
                    <div className="h-3.5 w-24 rounded-xs skeleton-box" />
                    <div className="h-3.5 w-16 rounded-xs skeleton-box hidden sm:inline" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
