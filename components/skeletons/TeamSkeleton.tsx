import React from 'react';

export default function TeamSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] animate-fadeIn">
      {/* Header Skeleton */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 text-center md:text-left space-y-3">
        <div className="h-3 w-28 rounded-sm skeleton-box mx-auto md:mx-0" />
        <div className="h-10 md:h-12 w-48 md:w-60 rounded-sm skeleton-box mx-auto md:mx-0" />
        <div className="h-4 w-full md:w-96 rounded-sm skeleton-box mx-auto md:mx-0 pt-1" />
      </div>

      {/* Team Grid Skeleton */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              {/* Photo Box */}
              <div className="w-full aspect-square rounded-sm skeleton-box" />
              {/* Name */}
              <div className="h-4 w-3/4 rounded-sm skeleton-box" />
              {/* Role */}
              <div className="h-3 w-1/2 rounded-sm skeleton-box" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
