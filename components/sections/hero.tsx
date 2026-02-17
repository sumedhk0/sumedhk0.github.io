"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}

export function Hero({ onResumeOpen }: { onResumeOpen: () => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <GridBackground />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4 font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground"
        >
          Georgia Tech &middot; B.S. Chemical &amp; Biomolecular Engineering &middot; 2028
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Sumedh Kothari
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mx-auto mb-4 max-w-xl text-lg text-muted-foreground sm:text-xl"
        >
          Engineer building intelligent systems across software and hardware.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mx-auto mb-10 max-w-lg text-sm text-muted-foreground/80"
        >
          Working at the intersection of AI, robotics, and environmental
          systems. Turning complex problems into engineered solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg">
            <a href="#projects">
              <ArrowDown className="mr-2 h-4 w-4" />
              View Projects
            </a>
          </Button>

          <Button variant="outline" size="lg" onClick={onResumeOpen}>
            <FileText className="mr-2 h-4 w-4" />
            Resume
          </Button>

          <Button variant="outline" size="lg" asChild>
            <a href="#contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
