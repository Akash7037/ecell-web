import React from 'react';

export default function GenericSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-16 md:pt-[72px] animate-fadeIn">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-24 space-y-6 md:space-y-8 text-center md:text-left">
        <div className="space-y-3">
          <div className="h-3 w-24 sm:w-28 rounded-sm skeleton-box mx-auto md:mx-0" />
          <div className="h-8 sm:h-10 md:h-12 w-52 sm:w-64 md:w-80 rounded-sm skeleton-box mx-auto md:mx-0" />
          <div className="h-3.5 sm:h-4 w-full max-w-sm md:max-w-md rounded-sm skeleton-box mx-auto md:mx-0 pt-1" />
        </div>

        <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
          <div className="h-3.5 sm:h-4 w-full rounded-sm skeleton-box" />
          <div className="h-3.5 sm:h-4 w-11/12 mx-auto md:mx-0 rounded-sm skeleton-box" />
          <div className="h-3.5 sm:h-4 w-4/5 mx-auto md:mx-0 rounded-sm skeleton-box" />
        </div>
      </div>
    </div>
  );
}
