'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LoaderProps {
  isLoading: boolean;
  onComplete: () => void;
}

export function Loader({ isLoading, onComplete }: LoaderProps) {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return p + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [reducedMotion, onComplete]);

  const handleSkip = () => {
    setProgress(100);
    onComplete();
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-surface-950 flex flex-col items-center justify-center"
        >
          {/* Logo assembly animation */}
          <div className="relative w-32 h-32 mb-8">
            <svg viewBox="0 0 120 120" className="w-full h-full" aria-label="E-Cell logo loading">
              {/* Outer circle - draws on */}
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(76, 110, 245, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="314"
                initial={{ strokeDashoffset: 314 }}
                animate={{ strokeDashoffset: 314 - (314 * progress) / 100 }}
                transition={{ duration: 0.1 }}
              />

              {/* E-shape flowing path */}
              <motion.path
                d="M35 48 C45 38, 75 38, 85 48 C75 58, 45 58, 35 68 C45 78, 75 78, 85 68"
                fill="none"
                stroke="#e85d3a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="200"
                initial={{ strokeDashoffset: 200 }}
                animate={{ strokeDashoffset: 200 - (200 * Math.min(progress * 1.5, 100)) / 100 }}
                transition={{ duration: 0.1 }}
              />

              {/* Grad cap */}
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: progress > 60 ? 1 : 0,
                  scale: progress > 60 ? 1 : 0.8,
                }}
                style={{ transformOrigin: '60px 58px' }}
              >
                <path
                  d="M52 56 L60 52 L68 56 L60 60 Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
                <line x1="60" y1="56" x2="60" y2="63" stroke="white" strokeWidth="0.8" />
              </motion.g>
            </svg>
          </div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: progress > 20 ? 1 : 0, y: progress > 20 ? 0 : 10 }}
            className="text-center"
          >
            <h1 className="font-display text-lg font-bold tracking-wider text-white/80">
              E-CELL
            </h1>
            <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/30 mt-1">
              VSB College of Engineering
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="mt-10 w-48 h-px bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="mt-6 text-[10px] font-mono tracking-[0.14em] uppercase text-white/20 hover:text-white/50 transition-colors"
            aria-label="Skip loading animation"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
