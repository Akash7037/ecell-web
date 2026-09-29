'use client';

import { Suspense } from 'react';
import { Shell } from '@/components/layout/Shell';
import { EventsPage } from '@/components/pages/EventsPage';

export default function Events() {
  return (
    <Shell>
      <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
        <EventsPage />
      </Suspense>
    </Shell>
  );
}
