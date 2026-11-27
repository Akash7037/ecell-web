import React from 'react';

export default function EventsSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px]">
      {/* Header Skeleton - Matches app/events/page.tsx */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
        <div className="cascade-item cascade-delay-0 max-w-lg mx-auto md:mx-0">
          {/* E-Cell VSBCETC uppercase tag */}
          <div className="h-3.5 w-24 rounded-xs skeleton-box mx-auto md:mx-0 mb-3" />
          {/* Events & Summits headline */}
          <div className="h-9 md:h-12 w-60 sm:w-72 md:w-80 rounded-sm skeleton-box mx-auto md:mx-0 mb-3" />
          {/* Subtitle paragraph */}
          <div className="space-y-2 pt-1 max-w-lg mx-auto md:mx-0">
            <div className="h-4 w-full rounded-xs skeleton-box" />
            <div className="h-4 w-4/5 mx-auto md:mx-0 rounded-xs skeleton-box" />
          </div>
        </div>

        {/* Suggest Event Button */}
        <div className="cascade-item cascade-delay-1 flex justify-center md:justify-end shrink-0">
          <div className="h-10 w-32 rounded-full border border-stone-800/40 skeleton-box" />
        </div>
      </div>

      {/* Upcoming Section Skeleton - Matches EventsPageClient.tsx */}
      <section className="bg-paper-dim py-16 md:py-24 border-t border-paper-muted">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <div className="cascade-item cascade-delay-2 mb-6 text-center md:text-left">
            <div className="h-3 w-16 rounded-xs skeleton-box mx-auto md:mx-0 mb-1.5" />
            <div className="h-7 md:h-8 w-44 md:w-52 rounded-sm skeleton-box mx-auto md:mx-0" />
          </div>

          {/* Event Cards Skeleton */}
          <div>
            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className={`cascade-item cascade-delay-${i + 2} border-t border-[#E7E5E4] py-6 px-1 md:py-7 md:px-3 md:-mx-3 md:rounded-sm select-none`}
              >
                {/* Desktop View (hidden md:flex) - Matches EventCard desktop */}
                <div className="hidden md:flex md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-6 w-80 rounded-sm skeleton-box" />
                    <div className="h-4 w-full max-w-2xl rounded-xs skeleton-box" />
                    <div className="mt-3 flex flex-wrap items-center gap-4 pt-1">
                      <div className="h-3.5 w-24 rounded-xs skeleton-box" />
                      <div className="h-3.5 w-16 rounded-xs skeleton-box" />
                      <div className="h-3.5 w-28 rounded-xs skeleton-box ml-auto sm:ml-0" />
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <div className="h-3.5 w-16 rounded-xs skeleton-box" />
                    <div className="h-7 w-20 rounded border border-[#FED7AA]/60 skeleton-box" />
                  </div>
                </div>

                {/* Mobile View (flex md:hidden) - Matches EventCard mobile */}
                <div className="flex md:hidden flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-16 rounded-xs skeleton-box" />
                    <div className="h-3 w-24 rounded-xs skeleton-box" />
                  </div>
                  <div className="h-6 w-4/5 rounded-sm skeleton-box" />
                  <div className="space-y-1.5 pt-0.5">
                    <div className="h-3.5 w-full rounded-xs skeleton-box" />
                    <div className="h-3.5 w-5/6 rounded-xs skeleton-box" />
                  </div>
                  <div className="mt-1 pt-2 flex items-center justify-between border-t border-paper-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-3.5 w-24 rounded-xs skeleton-box" />
                      <div className="h-3.5 w-14 rounded-xs skeleton-box" />
                    </div>
                    <div className="h-3.5 w-16 rounded-xs skeleton-box" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
