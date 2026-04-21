"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { TimelineSectionData } from "@/types/content";
import { motionPresets } from "@/lib/motion";

interface TimelineSectionProps {
  timeline: TimelineSectionData;
}

export function TimelineSection({ timeline }: TimelineSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const reveal = motionPresets.reveal;

  return (
    <section id={timeline.id} className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/20 bg-[#ebf9fa]/90 p-8 text-[#3a001a] md:p-12">
        <h2 className="text-2xl font-semibold uppercase tracking-[0.09em] md:text-3xl">{timeline.title}</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {timeline.items.map((item, index) => (
            <motion.article
              key={item.label}
              className="rounded-2xl border border-[#3a001a]/15 bg-white/85 p-5"
              initial={prefersReducedMotion ? undefined : reveal.initial}
              whileInView={prefersReducedMotion ? undefined : reveal.animate}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { ...reveal.transition, delay: (reveal.transition.delay || 0) + index * 0.07 }
              }
              viewport={prefersReducedMotion ? undefined : reveal.viewport}
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-[#3a001a]/60">{item.label}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3a001a]/80">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
