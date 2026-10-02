'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const hide = () => {
      setIsVisible(false);
      document.body.style.overflow = '';
    };

    // If document is already complete, show brief graceful reveal (750ms) then fade out
    if (document.readyState === 'complete') {
      const timer = setTimeout(hide, 750);
      return () => clearTimeout(timer);
    }

    const handleLoad = () => {
      setTimeout(hide, 350);
    };

    window.addEventListener('load', handleLoad);
    // Hard fallback cap at 1.2s so it never holds the user back
    const fallback = setTimeout(hide, 1200);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallback);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF8F4] select-none pointer-events-auto"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
