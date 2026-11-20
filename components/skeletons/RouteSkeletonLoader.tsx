'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import EventsSkeleton from './EventsSkeleton';
import BlogSkeleton from './BlogSkeleton';
import BlogDetailSkeleton from './BlogDetailSkeleton';
import TeamSkeleton from './TeamSkeleton';
import ContactSkeleton from './ContactSkeleton';
import HomeSkeleton from './HomeSkeleton';
import GenericSkeleton from './GenericSkeleton';

export default function RouteSkeletonLoader() {
  const currentPathname = usePathname();
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const startTimeRef = useRef<number>(0);
  const pendingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to pick the appropriate skeleton
  const renderSkeleton = (path: string) => {
    if (path === '/events' || path.startsWith('/events/')) {
      return <EventsSkeleton />;
    }
    if (path.startsWith('/blog/') && path.length > 6) {
      return <BlogDetailSkeleton />;
    }
    if (path === '/blog') {
      return <BlogSkeleton />;
    }
    if (path === '/team' || path.startsWith('/team/')) {
      return <TeamSkeleton />;
    }
    if (path === '/contact' || path.startsWith('/contact/')) {
      return <ContactSkeleton />;
    }
    if (path === '/') {
      return <HomeSkeleton />;
    }
    return <GenericSkeleton />;
  };

  // Intercept click events on internal navigation links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external, hash links, mailto, tel, or same-page hashes
      if (
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if target is an internal route
      try {
        const url = new URL(anchor.href, window.location.origin);
        if (url.origin === window.location.origin) {
          const destinationPath = url.pathname;
          // If navigating to a different pathname, trigger skeleton transition
          if (destinationPath !== currentPathname) {
            startTimeRef.current = Date.now();
            setTargetPath(destinationPath);
            setIsNavigating(true);
            setIsFading(false);
          }
        }
      } catch {
        // Ignore URL parse errors
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, [currentPathname]);

  // When currentPathname changes to the destination, gracefully fade out skeleton
  useEffect(() => {
    if (!isNavigating) return;

    const minDisplayMs = 380; // Minimum time to let skeleton shimmer pleasantly
    const elapsed = Date.now() - startTimeRef.current;
    const remainingTime = Math.max(0, minDisplayMs - elapsed);

    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
    }

    pendingTimerRef.current = setTimeout(() => {
      setIsFading(true);

      const cleanupTimer = setTimeout(() => {
        setIsNavigating(false);
        setIsFading(false);
        setTargetPath(null);
      }, 320); // Matches transition-opacity duration-300

      return () => clearTimeout(cleanupTimer);
    }, remainingTime);

    return () => {
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
      }
    };
  }, [currentPathname, isNavigating]);

  // Safety fallback timeout: remove after 3.5s if router stalls
  useEffect(() => {
    if (!isNavigating) return;

    const safetyTimer = setTimeout(() => {
      setIsNavigating(false);
      setIsFading(false);
      setTargetPath(null);
    }, 3500);

    return () => clearTimeout(safetyTimer);
  }, [isNavigating]);

  if (!isNavigating || !targetPath) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 top-0 left-0 right-0 z-40 bg-[#FAF8F2] overflow-y-auto pointer-events-none select-none transition-opacity duration-300 ease-out ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {renderSkeleton(targetPath)}
    </div>
  );
}
