import React from 'react';

export default function ContactSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] animate-fadeIn flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-6 py-16 md:py-24 flex-1">
        {/* Header Skeleton */}
        <div className="text-center md:text-left space-y-3 mb-16">
          <div className="h-3 w-28 rounded-sm skeleton-box mx-auto md:mx-0" />
          <div className="h-10 md:h-12 w-48 rounded-sm skeleton-box mx-auto md:mx-0" />
          <div className="h-4 w-full md:w-96 rounded-sm skeleton-box mx-auto md:mx-0 pt-1" />
        </div>

        {/* Contact Tiles Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded border border-paper-muted bg-paper/50 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded skeleton-box shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded-sm skeleton-box" />
                <div className="h-5 w-48 rounded-sm skeleton-box" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
