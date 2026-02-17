"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedBadge({ children, delay = 0 }: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay }}
    >
      <Badge
        variant="secondary"
        className="font-[family-name:var(--font-geist-mono)] text-xs"
      >
        {children}
      </Badge>
    </motion.div>
  );
}
