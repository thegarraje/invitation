"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HeroSectionData } from "@/types/content";
import { motionPresets } from "@/lib/motion";

interface HeroSectionProps {
  hero: HeroSectionData;
}

export function HeroSection({ hero }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const reveal = motionPresets.reveal;

  return (
    <section id={hero.id} className="relative flex min-h-screen items-center justify-center px-6 py-16 text-center">
      <div className="mx-auto w-full max-w-4xl">
        <motion.p
          className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: hero.theme.accent }}
          initial={prefersReducedMotion ? undefined : reveal.initial}
          whileInView={prefersReducedMotion ? undefined : reveal.animate}
          transition={prefersReducedMotion ? undefined : reveal.transition}
          viewport={prefersReducedMotion ? undefined : reveal.viewport}
        >
          {hero.subtitle}
        </motion.p>

        <motion.h1
          className="text-balance text-4xl font-semibold leading-tight md:text-6xl"
          style={{ color: hero.theme.text }}
          initial={prefersReducedMotion ? undefined : reveal.initial}
          whileInView={prefersReducedMotion ? undefined : reveal.animate}
          transition={
            prefersReducedMotion
              ? undefined
              : { ...reveal.transition, delay: (reveal.transition.delay || 0) + 0.06 }
          }
          viewport={prefersReducedMotion ? undefined : reveal.viewport}
        >
          {hero.title}
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-3xl text-balance text-2xl font-medium leading-tight md:text-5xl"
          style={{ color: hero.theme.text }}
          initial={prefersReducedMotion ? undefined : reveal.initial}
          whileInView={prefersReducedMotion ? undefined : reveal.animate}
          transition={
            prefersReducedMotion
              ? undefined
              : { ...reveal.transition, delay: (reveal.transition.delay || 0) + 0.12 }
          }
          viewport={prefersReducedMotion ? undefined : reveal.viewport}
        >
          {hero.description}
        </motion.p>

        <motion.div
          className="mx-auto mt-14 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/15 text-3xl text-[#ebf9fa]/90"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: [0.45, 1, 0.45],
                  y: [0, 8, 0]
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1]
                }
          }
          aria-hidden="true"
        >
          ↓
        </motion.div>
      </div>
    </section>
  );
}
