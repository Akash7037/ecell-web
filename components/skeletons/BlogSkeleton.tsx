import React from 'react';

export default function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] animate-fadeIn">
      {/* Editorial Header Skeleton */}
      <section className="border-b border-paper-muted bg-paper/60 backdrop-blur-xs">
        <div className="mx-auto max-w-5xl px-7 sm:px-8 md:px-6 py-12 md:py-20 text-center md:text-left space-y-3">
          {/* Pill */}
          <div className="h-3 w-44 rounded-sm skeleton-box mx-auto md:mx-0" />
          {/* Main Title */}
          <div className="h-9 sm:h-11 md:h-12 w-64 sm:w-80 rounded-sm skeleton-box mx-auto md:mx-0" />
          {/* Subtitle */}
          <div className="space-y-2 pt-1 max-w-xl mx-auto md:mx-0">
            <div className="h-4 w-full rounded-sm skeleton-box" />
            <div className="h-4 w-4/5 rounded-sm skeleton-box" />
          </div>
        </div>
      </section>

      {/* Blog Cards List Skeleton */}
      <section className="mx-auto max-w-5xl px-7 sm:px-8 md:px-6 py-8 md:py-16">
        <div className="divide-y divide-paper-muted border-t border-paper-muted">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="flex flex-col md:flex-row items-stretch gap-6 md:gap-8 py-8 md:py-10"
            >
              {/* Image Box Placeholder with top branding notch placeholder */}
              <div className="relative w-full md:w-72 lg:w-80 h-56 md:h-52 shrink-0 overflow-hidden rounded bg-paper border border-paper-muted flex flex-col">
                {/* Top branding bar */}
                <div className="h-7 w-full bg-white border-b border-paper-muted px-3 flex items-center justify-between">
                  <div className="h-3.5 w-6 rounded-xs skeleton-box" />
                  <div className="h-3 w-16 rounded-xs skeleton-box" />
                  <div className="h-3.5 w-6 rounded-xs skeleton-box" />
                </div>
                {/* Image Body */}
                <div className="flex-1 w-full skeleton-box" />
              </div>

              {/* Content Details */}
              <div className="flex flex-col justify-between flex-1 min-w-0 space-y-4">
                <div className="space-y-3">
                  {/* Date & Read time */}
                  <div className="flex items-center gap-3">
                    <div className="h-3.5 w-24 rounded-sm skeleton-box" />
                    <div className="h-3.5 w-16 rounded-sm skeleton-box" />
                  </div>
                  {/* Article Title */}
                  <div className="h-7 md:h-8 w-4/5 rounded-sm skeleton-box" />
                  {/* Excerpt */}
                  <div className="space-y-2 pt-1">
                    <div className="h-4 w-full rounded-sm skeleton-box" />
                    <div className="h-4 w-5/6 rounded-sm skeleton-box" />
                  </div>
                </div>

                {/* Author row */}
                <div className="flex items-center gap-2.5 pt-2">
                  <div className="w-8 h-8 rounded-full skeleton-box shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 rounded-sm skeleton-box" />
                    <div className="h-2.5 w-16 rounded-sm skeleton-box" />
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
