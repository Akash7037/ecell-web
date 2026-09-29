'use client';

import { Suspense } from 'react';
import { Shell } from '@/components/layout/Shell';
import { ContactPage } from '@/components/pages/ContactPage';

export default function Contact() {
  return (
    <Shell>
      <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
        <ContactPage />
      </Suspense>
    </Shell>
  );
}
