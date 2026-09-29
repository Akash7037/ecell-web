'use client';

import { Suspense } from 'react';
import { Shell } from '@/components/layout/Shell';
import { TeamPage } from '@/components/pages/TeamPage';

export default function Team() {
  return (
    <Shell>
      <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
        <TeamPage />
      </Suspense>
    </Shell>
  );
}
