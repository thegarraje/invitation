import type { MotionPreset } from "@/types/content";

export const motionPresets: Record<string, MotionPreset> = {
  pageEnter: {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1],
      type: "tween"
    }
  },
  bloom: {
    initial: { opacity: 0.001, scale: 0.86, y: 12 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: {
      delay: 0.1,
      duration: 0.9,
      ease: [0, 0, 0, 1],
      type: "tween"
    }
  },
  reveal: {
    initial: { opacity: 0.001, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.45,
      ease: [0.44, 0, 0.56, 1],
      type: "tween"
    },
    viewport: { amount: 0.3, once: true }
  }
};
