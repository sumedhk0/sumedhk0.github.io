"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMousePosition } from "@/hooks/use-mouse-position";

export function CustomCursor() {
  const { x, y } = useMousePosition();
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(isTouchDevice);

    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    if (!isTouchDevice) {
      document.addEventListener("mouseenter", show);
      document.addEventListener("mouseleave", hide);
      setVisible(true);
    }

    return () => {
      document.removeEventListener("mouseenter", show);
      document.removeEventListener("mouseleave", hide);
    };
  }, []);

  if (isTouch) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-5 w-5 rounded-full border border-foreground/30 mix-blend-difference"
      animate={{
        x: x - 10,
        y: y - 10,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
}
