"use client";

import { useScroll, useSpring, type MotionValue } from "framer-motion";

export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return scaleX;
}
