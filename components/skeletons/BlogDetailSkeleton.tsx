import React from 'react';

export default function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] animate-fadeIn">
      {/* Article Header Skeleton */}
      <header className="mx-auto max-w-4xl px-7 sm:px-8 md:px-6 pt-10 md:pt-14 pb-6">
        {/* Navigation Breadcrumb & Tag */}
        <div className="flex items-center justify-between pb-6 border-b border-paper-muted">
          <div className="h-4 w-28 rounded-sm skeleton-box" />
          <div className="h-4 w-24 rounded-sm skeleton-box" />
        </div>

        {/* Title & Excerpt */}
        <div className="pt-8 pb-6 space-y-4">
          <div className="space-y-2.5">
            <div className="h-8 sm:h-11 md:h-14 w-full rounded-sm skeleton-box" />
            <div className="h-8 sm:h-11 md:h-14 w-3/4 rounded-sm skeleton-box" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 sm:h-5 w-full rounded-sm skeleton-box" />
            <div className="h-4 sm:h-5 w-4/5 rounded-sm skeleton-box" />
          </div>
        </div>

        {/* Author Meta Row */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-paper-muted/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton-box shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-28 rounded-sm skeleton-box" />
              <div className="h-3 w-20 rounded-sm skeleton-box" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3.5 w-24 rounded-sm skeleton-box" />
            <div className="h-3.5 w-16 rounded-sm skeleton-box" />
          </div>
        </div>
      </header>

      {/* Cover Image Skeleton with Top White Bar */}
      <div className="mx-auto max-w-4xl px-7 sm:px-8 md:px-6 my-6 md:my-10">
        <div className="overflow-hidden rounded-lg border border-paper-muted bg-paper shadow-2xs">
          {/* Top Branding Bar */}
          <div className="bg-white border-b border-paper-muted px-6 py-3 flex items-center justify-between">
            <div className="h-8 w-8 rounded-full skeleton-box" />
            <div className="h-7 w-28 rounded-sm skeleton-box" />
            <div className="h-7 w-8 rounded-sm skeleton-box" />
          </div>
          {/* Image Surface */}
          <div className="w-full h-64 sm:h-80 md:h-[400px] skeleton-box" />
        </div>
      </div>

      {/* Article Body Skeleton Lines */}
      <article className="mx-auto max-w-4xl px-7 sm:px-8 md:px-6 pb-20 space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-full rounded-sm skeleton-box" />
          <div className="h-4 w-full rounded-sm skeleton-box" />
          <div className="h-4 w-11/12 rounded-sm skeleton-box" />
          <div className="h-4 w-4/5 rounded-sm skeleton-box" />
        </div>
        <div className="h-7 w-52 rounded-sm skeleton-box pt-2" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded-sm skeleton-box" />
          <div className="h-4 w-full rounded-sm skeleton-box" />
          <div className="h-4 w-9/12 rounded-sm skeleton-box" />
        </div>
      </article>
    </div>
  );
}
