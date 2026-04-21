"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ColorsSectionData } from "@/types/content";
import { motionPresets } from "@/lib/motion";

interface ColorsSectionProps {
  colors: ColorsSectionData;
}

export function ColorsSection({ colors }: ColorsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const reveal = motionPresets.reveal;

  return (
    <section id={colors.id} className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/15 bg-[#3a001a]/65 p-6 text-[#ebf9fa] md:p-10">
        <h2 className="text-2xl font-semibold uppercase tracking-[0.09em] md:text-3xl">{colors.title}</h2>
        <p className="mt-3 max-w-3xl text-sm text-[#ebf9fa]/80 md:text-base">{colors.body}</p>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {colors.links.map((link, index) => (
            <motion.div
              key={link.key}
              initial={prefersReducedMotion ? undefined : reveal.initial}
              whileInView={prefersReducedMotion ? undefined : reveal.animate}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { ...reveal.transition, delay: (reveal.transition.delay || 0) + index * 0.04 }
              }
              viewport={prefersReducedMotion ? undefined : reveal.viewport}
            >
              <Link
                href={link.href}
                className={`block rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  link.active
                    ? "border-[#f16e2a] bg-[#f16e2a]/20 text-white"
                    : "border-white/25 bg-white/5 text-[#ebf9fa] hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
