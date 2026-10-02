'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LETTERS = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Lock scroll briefly during active loading
    document.body.style.overflow = 'hidden';

    // Start graceful fade out after brief display
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      document.body.style.overflow = '';
    }, 650);

    // Completely unmount and clear from DOM after fade completes
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = '';
    }, 1050);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF8F4] select-none preloader-overlay transition-opacity duration-400 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <div className="w-full text-center">
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            animate={{
              filter: ['blur(0px)', 'blur(5px)', 'blur(0px)'],
              opacity: [1, 0.3, 1],
              y: [0, -1.5, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.16,
              ease: 'easeInOut',
            }}
            className="font-quattrocento text-2xl sm:text-3xl font-normal text-[#121316] inline-block mx-[5px]"
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
