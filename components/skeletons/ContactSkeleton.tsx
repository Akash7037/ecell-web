import React from 'react';

export default function ContactSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-6 py-16 md:py-24 flex-1">
        {/* Header Skeleton - Matches app/contact/page.tsx */}
        <div className="cascade-item cascade-delay-0 text-center md:text-left mb-16">
          <div className="h-3.5 w-24 rounded-xs skeleton-box mx-auto md:mx-0 mb-4" />
          <div className="h-9 md:h-12 w-48 rounded-sm skeleton-box mx-auto md:mx-0 mb-6" />
          <div className="h-4 w-full max-w-md mx-auto md:mx-0 rounded-xs skeleton-box" />
        </div>

        {/* Contact Grid - Exact match: grid-cols-1 sm:grid-cols-2 gap-0 border-t border-l border-paper-muted */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-l border-paper-muted">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`cascade-item cascade-delay-${i} p-6 md:p-8 border-b border-r border-paper-muted flex items-start gap-4`}
            >
              {/* Icon box */}
              <div className="w-5 h-5 rounded-xs skeleton-box mt-0.5 shrink-0" />
              {/* Text lines */}
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-16 rounded-xs skeleton-box" />
                <div className="h-5 w-48 rounded-sm skeleton-box" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
