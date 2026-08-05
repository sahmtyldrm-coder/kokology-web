"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * Sayfanın üstünde ince pirinç ilerleme çizgisi.
 * Tamamen dekoratif — ekran okuyucudan gizlenir.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-brass"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
    />
  );
}
