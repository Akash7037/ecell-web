'use client';

import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { CustomCursor } from '@/components/animations/CustomCursor';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-vermilion selection:text-white flex flex-col justify-between">
      <CustomCursor />
      <Navigation />
      <main id="main-content" className="flex-1 w-full pt-16">{children}</main>
      <Footer />
    </div>
  );
}
