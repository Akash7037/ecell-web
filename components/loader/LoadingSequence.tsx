'use client';

import { useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  const dismiss = useCallback(() => {
    if (reducedMotion) {
      setVisible(false);
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    tl.to('#loader-bar', {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut',
    })
      .to('#loader-text', {
        opacity: 0,
        duration: 0.5,
        y: -20,
      })
      .to('#loader-overlay', {
        opacity: 0,
        duration: 0.8,
        y: '-100%',
        ease: 'power3.inOut',
      });
  }, [reducedMotion, onComplete]);

  useEffect(() => {
    const timer = setTimeout(dismiss, 2500);
    const handleClick = () => {
      clearTimeout(timer);
      dismiss();
    };

    if (reducedMotion) {
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 500);
    }

    window.addEventListener('click', handleClick);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleClick);
    };
  }, [dismiss, onComplete, reducedMotion]);

  if (!visible) return null;

  return (
    <div
      id="loader-overlay"
      className="fixed inset-0 z-[9999] bg-surface-950 flex flex-col items-center justify-center"
      style={{
        transformOrigin: 'top',
      }}
    >
      <div className="mb-8 w-24 h-24 relative">
        <div className="absolute inset-0 rounded-full border-2 border-brand-400/20" />
        <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-spin" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-brand-400 text-xl">E</span>
        </div>
      </div>
      <div id="loader-text" className="text-sm text-gray-400 font-medium tracking-widest uppercase mb-6">
        Building Experience
      </div>
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          id="loader-bar"
          className="h-full bg-gradient-to-r from-brand-500 to-accent rounded-full origin-left scale-x-0"
          style={{ transformOrigin: 'left' }}
        />
      </div>
      <p className="mt-4 text-xs text-gray-600">Click anywhere to skip</p>
    </div>
  );
}
