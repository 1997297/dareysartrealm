import { Variants } from 'framer-motion';

// Refined easing curve for contemporary art presentations
export const artisticEase = [0.22, 1, 0.36, 1];

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      duration: custom.duration || 0.8,
      delay: custom.delay || 0,
      ease: artisticEase,
    },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration || 0.8,
      delay: custom.delay || 0,
      ease: artisticEase,
    },
  }),
};

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: custom.duration || 1.1,
      delay: custom.delay || 0.1,
      ease: artisticEase,
    },
  }),
};

export const textReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration || 0.7,
      delay: custom.delay || 0,
      ease: artisticEase,
    },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: (custom = {}) => ({
    transition: {
      staggerChildren: custom.stagger || 0.12,
      delayChildren: custom.delayChildren || 0.1,
    },
  }),
};

export const drawerEnter: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: artisticEase,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.3,
      ease: [0.36, 0, 0.66, -0.56],
    },
  },
};
