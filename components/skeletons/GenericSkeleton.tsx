import React from 'react';

export default function GenericSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] animate-fadeIn">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24 space-y-8">
        <div className="space-y-3">
          <div className="h-3 w-28 rounded-sm skeleton-box" />
          <div className="h-10 md:h-12 w-64 md:w-80 rounded-sm skeleton-box" />
          <div className="h-4 w-full md:w-96 rounded-sm skeleton-box pt-1" />
        </div>

        <div className="space-y-4 pt-6">
          <div className="h-4 w-full rounded-sm skeleton-box" />
          <div className="h-4 w-11/12 rounded-sm skeleton-box" />
          <div className="h-4 w-4/5 rounded-sm skeleton-box" />
        </div>
      </div>
    </div>
  );
}
