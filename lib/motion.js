export const motionTokens = {
  duration: { fast: 0.18, normal: 0.3, reveal: 0.65 },
  ease: { standard: [0.2, 0, 0, 1], out: [0.22, 1, 0.36, 1] },
  spring: { soft: { type: 'spring', stiffness: 180, damping: 24 }, snappy: { type: 'spring', stiffness: 360, damping: 28 } },
  stagger: { fast: 0.05, normal: 0.1 },
};

export const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
