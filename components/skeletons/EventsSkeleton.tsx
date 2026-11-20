import React from 'react';

export default function EventsSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] animate-fadeIn">
      {/* Header Skeleton */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          {/* Category pill */}
          <div className="h-3 w-28 rounded-sm skeleton-box" />
          {/* Page Title */}
          <div className="h-10 md:h-12 w-64 md:w-80 rounded-sm skeleton-box" />
          {/* Subtitle lines */}
          <div className="space-y-2 pt-1">
            <div className="h-4 w-full md:w-[480px] rounded-sm skeleton-box" />
            <div className="h-4 w-3/4 md:w-80 rounded-sm skeleton-box" />
          </div>
        </div>
        {/* Suggest Us Button Skeleton */}
        <div className="h-10 w-32 rounded skeleton-box shrink-0" />
      </div>

      {/* Upcoming Section Skeleton */}
      <section className="bg-paper-dim/60 py-16 md:py-20 border-t border-paper-muted">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 space-y-2">
            <div className="h-3 w-20 rounded-sm skeleton-box" />
            <div className="h-7 w-48 rounded-sm skeleton-box" />
          </div>

          {/* Event Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-t border-[#E7E5E4] py-6 px-3 -mx-3 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-2.5">
                  <div className="h-6 w-3/4 md:w-96 rounded-sm skeleton-box" />
                  <div className="h-4 w-full md:w-3/4 rounded-sm skeleton-box" />
                  <div className="flex items-center gap-4 pt-1">
                    <div className="h-4 w-28 rounded-sm skeleton-box" />
                    <div className="h-4 w-20 rounded-sm skeleton-box" />
                    <div className="h-4 w-24 rounded-sm skeleton-box" />
                  </div>
                </div>
                <div className="h-9 w-28 rounded skeleton-box shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
