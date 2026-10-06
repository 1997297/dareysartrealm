'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Check if device has fine pointer (desktop mouse)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    setIsTouchDevice(!hasFinePointer);

    if (!hasFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor') || 'VIEW';
        setCursorText(text);
      } else {
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouchDevice || prefersReduced || !isVisible || !cursorText) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center rounded-full bg-charcoal text-canvas px-3.5 py-1.5 shadow-gallery backdrop-blur-sm"
      animate={{
        x: mousePosition.x + 16,
        y: mousePosition.y + 16,
        scale: 1,
      }}
      initial={{ scale: 0 }}
      exit={{ scale: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.5 }}
    >
      <span className="font-sans text-[0.625rem] font-semibold tracking-gallery uppercase text-canvas">
        {cursorText}
      </span>
    </motion.div>
  );
}
