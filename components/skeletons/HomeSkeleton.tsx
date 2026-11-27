import React from 'react';

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] animate-fadeIn">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center justify-center px-6 py-14 md:py-20 overflow-hidden">
        <div className="mx-auto max-w-5xl w-full text-center space-y-4 sm:space-y-6">
          {/* Badge */}
          <div className="h-3.5 sm:h-4 w-32 sm:w-44 rounded-full skeleton-box mx-auto" />
          {/* Main Headline */}
          <div className="space-y-2 sm:space-y-3">
            <div className="h-9 sm:h-12 md:h-16 w-11/12 sm:w-3/4 md:w-2/3 rounded-sm skeleton-box mx-auto" />
            <div className="h-9 sm:h-12 md:h-16 w-4/5 sm:w-1/2 rounded-sm skeleton-box mx-auto" />
          </div>
          {/* Subtitle */}
          <div className="space-y-2 max-w-xs sm:max-w-md md:max-w-lg mx-auto pt-1 sm:pt-2">
            <div className="h-3.5 sm:h-4 w-full rounded-sm skeleton-box" />
            <div className="h-3.5 sm:h-4 w-4/5 rounded-sm skeleton-box mx-auto" />
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4">
            <div className="h-10 sm:h-11 w-44 sm:w-36 rounded skeleton-box" />
            <div className="h-10 sm:h-11 w-44 sm:w-36 rounded skeleton-box" />
          </div>
        </div>
      </section>

      {/* Strip Section Skeleton */}
      <section className="border-y border-paper-muted bg-paper-dim/40 py-8 sm:py-12 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5 sm:space-y-2 text-center sm:text-left">
              <div className="h-6 sm:h-7 w-16 sm:w-20 rounded-sm skeleton-box mx-auto sm:mx-0" />
              <div className="h-3.5 sm:h-4 w-24 sm:w-32 rounded-sm skeleton-box mx-auto sm:mx-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
