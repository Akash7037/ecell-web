'use client';

import { Suspense } from 'react';
import { Shell } from '@/components/layout/Shell';
import { AboutPage } from '@/components/pages/AboutPage';

export default function About() {
  return (
    <Shell>
      <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
        <AboutPage />
      </Suspense>
    </Shell>
  );
}
