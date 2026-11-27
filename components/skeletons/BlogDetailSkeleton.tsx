import React from 'react';

export default function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px]">
      {/* Navigation Breadcrumb Skeleton */}
      <div className="border-b border-paper-muted bg-paper/60 backdrop-blur-xs">
        <div className="mx-auto max-w-4xl px-7 sm:px-8 md:px-6 py-3.5 md:py-4 flex items-center justify-between">
          <div className="h-4 w-28 rounded-xs skeleton-box" />
          <div className="h-3.5 w-24 rounded-xs skeleton-box" />
        </div>
      </div>

      {/* Article Header Skeleton - Matches app/blog/[slug]/page.tsx */}
      <header className="mx-auto max-w-4xl px-7 sm:px-8 md:px-6 pt-10 md:pt-16 text-center md:text-left">
        <div className="cascade-item cascade-delay-0">
          {/* Article Title */}
          <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
            <div className="h-7 sm:h-9 md:h-12 w-full max-w-lg md:max-w-none mx-auto md:mx-0 rounded-sm skeleton-box" />
            <div className="h-7 sm:h-9 md:h-12 w-4/5 sm:w-3/4 max-w-md md:max-w-xl mx-auto md:mx-0 rounded-sm skeleton-box" />
          </div>

          {/* Subtitle / Excerpt */}
          <div className="space-y-2 mb-5 md:mb-6 max-w-2xl mx-auto md:mx-0">
            <div className="h-4 sm:h-5 w-full rounded-xs skeleton-box" />
            <div className="h-4 sm:h-5 w-4/5 mx-auto md:mx-0 rounded-xs skeleton-box" />
          </div>

          {/* Metadata Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 md:gap-4 py-3.5 md:py-4 border-y border-paper-muted text-[11px] md:text-xs font-mono">
            {/* Author */}
            <div className="flex items-center justify-center sm:justify-start gap-2.5 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full skeleton-box shrink-0" />
              <div className="space-y-1 text-center sm:text-left">
                <div className="h-3.5 md:h-4 w-28 rounded-xs skeleton-box mx-auto sm:mx-0" />
                <div className="h-2.5 md:h-3 w-16 rounded-xs skeleton-box mx-auto sm:mx-0" />
              </div>
            </div>

            {/* Date & Reading time */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-3.5 w-24 rounded-xs skeleton-box" />
              <div className="h-3 w-1.5 rounded-full skeleton-box" />
              <div className="h-3.5 w-16 rounded-xs skeleton-box" />
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image Skeleton with Top White Bar */}
      <div className="cascade-item cascade-delay-1 mx-auto max-w-4xl px-7 sm:px-8 md:px-6 my-6 md:my-10">
        <div className="overflow-hidden rounded-lg border border-paper-muted bg-paper shadow-2xs">
          {/* Top White Bar with 3 Logos */}
          <div className="bg-white border-b border-paper-muted px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
            <div className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 rounded-full skeleton-box" />
            <div className="h-7 sm:h-9 md:h-11 w-24 sm:w-32 md:w-40 rounded-sm skeleton-box" />
            <div className="h-7 sm:h-9 md:h-11 w-7 sm:w-9 md:w-11 rounded-sm skeleton-box" />
          </div>
          {/* Image Surface */}
          <div className="w-full h-56 sm:h-80 md:h-[440px] skeleton-box" />
        </div>
      </div>

      {/* Article Body Skeleton Lines */}
      <article className="cascade-item cascade-delay-2 mx-auto max-w-4xl px-7 sm:px-8 md:px-6 pb-16 space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-full rounded-xs skeleton-box" />
          <div className="h-4 w-full rounded-xs skeleton-box" />
          <div className="h-4 w-11/12 rounded-xs skeleton-box" />
          <div className="h-4 w-4/5 rounded-xs skeleton-box" />
        </div>
        <div className="h-7 sm:h-8 w-48 sm:w-60 rounded-sm skeleton-box pt-2" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded-xs skeleton-box" />
          <div className="h-4 w-full rounded-xs skeleton-box" />
          <div className="h-4 w-9/12 rounded-xs skeleton-box" />
        </div>
      </article>
    </div>
  );
}
