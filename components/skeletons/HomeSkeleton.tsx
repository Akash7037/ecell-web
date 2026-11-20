import React from 'react';

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] animate-fadeIn">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        <div className="mx-auto max-w-5xl w-full text-center space-y-6">
          {/* Badge */}
          <div className="h-4 w-44 rounded-full skeleton-box mx-auto" />
          {/* Main Headline */}
          <div className="space-y-3">
            <div className="h-12 md:h-16 w-3/4 md:w-2/3 rounded-sm skeleton-box mx-auto" />
            <div className="h-12 md:h-16 w-1/2 rounded-sm skeleton-box mx-auto" />
          </div>
          {/* Subtitle */}
          <div className="space-y-2 max-w-lg mx-auto pt-2">
            <div className="h-4 w-full rounded-sm skeleton-box" />
            <div className="h-4 w-4/5 rounded-sm skeleton-box mx-auto" />
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="h-11 w-36 rounded skeleton-box" />
            <div className="h-11 w-36 rounded skeleton-box" />
          </div>
        </div>
      </section>

      {/* Strip Section Skeleton */}
      <section className="border-y border-paper-muted bg-paper-dim/40 py-12 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-7 w-20 rounded-sm skeleton-box" />
              <div className="h-4 w-32 rounded-sm skeleton-box" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
