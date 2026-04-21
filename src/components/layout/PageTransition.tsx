"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { motionPresets } from "@/lib/motion";

interface PageTransitionProps {
  sceneKey: string;
  children: React.ReactNode;
}

export function PageTransition({ sceneKey, children }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const preset = motionPresets.pageEnter;

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneKey}
        initial={preset.initial}
        animate={preset.animate}
        transition={preset.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
