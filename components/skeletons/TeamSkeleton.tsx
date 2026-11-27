import React from 'react';

export default function TeamSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px]">
      {/* Header Skeleton - Matches app/team/page.tsx */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 text-center md:text-left">
        <div className="cascade-item cascade-delay-0">
          <div className="h-3.5 w-24 sm:w-28 rounded-xs skeleton-box mx-auto md:mx-0 mb-4" />
          <div className="h-9 md:h-12 w-48 sm:w-60 rounded-sm skeleton-box mx-auto md:mx-0 mb-2" />
          <div className="h-4 w-full max-w-sm md:max-w-md rounded-xs skeleton-box mx-auto md:mx-0 pt-1" />
        </div>
      </div>

      {/* Team Section Skeleton - Matches TeamSection.tsx */}
      <section className="bg-paper py-16 md:py-24 border-t border-paper-muted">
        <div className="mx-auto max-w-7xl px-6">
          <div className="cascade-item cascade-delay-1 flex flex-col sm:flex-row sm:items-end justify-between items-center sm:items-end text-center sm:text-left gap-3 sm:gap-4 mb-8 sm:mb-10">
            <div>
              <div className="h-3 w-16 rounded-xs skeleton-box mb-1.5 mx-auto sm:mx-0" />
              <div className="h-7 md:h-8 w-36 md:w-44 rounded-sm skeleton-box mx-auto sm:mx-0" />
            </div>
          </div>

          {/* Grid - Exact match: grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className={`cascade-item cascade-delay-${Math.min(6, Math.floor(i / 2) + 1)} flex flex-col`}
              >
                {/* Photo Placeholder */}
                <div className="w-full aspect-square bg-[#EDE8D0]/40 border border-[#EDE8D0] rounded-sm overflow-hidden mb-3 skeleton-box shadow-xs" />
                {/* Name */}
                <div className="h-4 w-4/5 rounded-xs skeleton-box mb-1" />
                {/* Role */}
                <div className="h-3 w-3/5 rounded-xs skeleton-box" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
