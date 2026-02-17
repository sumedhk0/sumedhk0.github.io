"use client";

import { motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

export function ScrollProgress() {
  const scaleX = useScrollProgress();

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-16 left-0 z-50 h-[2px] w-full origin-left bg-foreground"
    />
  );
}
