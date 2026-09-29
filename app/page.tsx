'use client';

import { useState, useEffect, Suspense } from 'react';
import { HomePage } from '@/components/pages/HomePage';
import { Shell } from '@/components/layout/Shell';
import { Loader } from '@/components/loader/Loader';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Home() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Only show loader on first visit
    const visited = sessionStorage.getItem('ecell-visited');
    if (visited || reducedMotion) {
      setLoading(false);
      setHasVisited(true);
      return;
    }
    const timeout = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('ecell-visited', 'true');
    }, 2500);
    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  const handleComplete = () => {
    setLoading(false);
    sessionStorage.setItem('ecell-visited', 'true');
  };

  return (
    <Shell>
      {loading ? (
        <div className="min-h-screen">
          <Loader isLoading={loading} onComplete={handleComplete} />
        </div>
      ) : (
        <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
          <HomePage />
        </Suspense>
      )}
    </Shell>
  );
}
