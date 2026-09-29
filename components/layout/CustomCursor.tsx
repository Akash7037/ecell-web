'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useSpring(cursorX, { damping: 25, stiffness: 200 });
  const trailY = useSpring(cursorY, { damping: 25, stiffness: 200 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);

    const interactiveEls = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [tabindex]');
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveEls.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          width: isHovering ? 40 : 8,
          height: isHovering ? 40 : 8,
          backgroundColor: isHovering ? 'rgba(232, 93, 58, 0.15)' : 'rgba(232, 93, 58, 0.9)',
          border: isHovering ? '1.5px solid rgba(232, 93, 58, 0.5)' : 'none',
          translateX: '-50%',
          translateY: '-50%',
          transition: 'width 0.3s, height 0.3s, background-color 0.3s, border 0.3s',
        }}
      />
      {/* Trail ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-brand-400/30"
        style={{
          x: trailX,
          y: trailY,
          width: 32,
          height: 32,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
}
