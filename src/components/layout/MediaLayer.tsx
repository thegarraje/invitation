"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ColorTheme } from "@/types/content";
import { motionPresets } from "@/lib/motion";

interface MediaLayerProps {
  theme: ColorTheme;
}

export function MediaLayer({ theme }: MediaLayerProps) {
  const prefersReducedMotion = useReducedMotion();

  const orbAnimation = prefersReducedMotion
    ? {}
    : {
        scale: [1, 1.04, 1],
        transition: {
          duration: 12,
          ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
          repeat: Infinity,
          repeatType: "mirror" as const
        }
      };

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ backgroundColor: theme.outer }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: theme.orb }}
        initial={motionPresets.bloom.initial}
        animate={motionPresets.bloom.animate}
        transition={motionPresets.bloom.transition}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[92vmax] w-[122vmax] -translate-x-1/2 -translate-y-1/2 rounded-[52%]"
        style={{ backgroundColor: theme.base }}
        animate={orbAnimation}
      />

      <div
        className="absolute bottom-[-20vmax] left-1/2 h-[42vmax] w-[42vmax] -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: theme.accent, opacity: 0.36 }}
      />
    </div>
  );
}
