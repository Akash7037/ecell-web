'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
    }, 3000);

    return () => {
      clearTimeout(timer);
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
            transition: { duration: 0.5, ease: 'easeInOut' },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FFEEDB] select-none pointer-events-auto"
        >
          <div className="w-full text-center">
            {LETTERS.map((letter, i) => (
              <span
                key={i}
                className="font-quattrocento text-2xl sm:text-3xl font-normal text-[#121316] inline-block mx-[5px]"
                style={{
                  filter: 'blur(0px)',
                  animation: `blur-text 1.5s linear ${i / 5}s infinite alternate`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
