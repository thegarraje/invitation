import Link from "next/link";
import Image from "next/image";
import type { RouteScene } from "@/types/content";
import { NAVIGATION_COPY } from "@/content/navigation";

interface BottomNavProps {
  scene: RouteScene;
}

export function BottomNav({ scene }: BottomNavProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(90vw,540px)] -translate-x-1/2 rounded-[1.25rem] border border-black/10 bg-[#e9f2f4] px-3 py-2 text-[#3a001a] shadow-xl backdrop-blur">
      <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2">
        <NavArrow href={scene.nav.prev} label={NAVIGATION_COPY.previousLabel} direction="left" />

        <div className="grid grid-cols-3 items-center gap-2 text-center">
          <AnchorChip href="#hero" label={NAVIGATION_COPY.tabs.intro} />
          <AnchorChip href="#timeline" label={NAVIGATION_COPY.tabs.about} />
          <AnchorChip href="#colors" label={NAVIGATION_COPY.tabs.colours} />
        </div>

        <NavArrow href={scene.nav.next} label={NAVIGATION_COPY.nextLabel} direction="right" />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <Link
          href={scene.hero.ctaHref || "/"}
          target={scene.hero.ctaHref?.startsWith("http") ? "_blank" : undefined}
          rel={scene.hero.ctaHref?.startsWith("http") ? "noreferrer" : undefined}
          className="rounded-full bg-[#f16e2a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:brightness-95"
        >
          {scene.hero.ctaLabel || NAVIGATION_COPY.ctaFallback}
        </Link>

        <Link
          href={NAVIGATION_COPY.links.home}
          aria-label={NAVIGATION_COPY.brandLabel}
          className="inline-flex h-[27px] w-[82px] items-center justify-center"
        >
          <Image
            src={NAVIGATION_COPY.brandLogoSrc}
            alt={NAVIGATION_COPY.brandLabel}
            width={82}
            height={27}
            className="h-full w-full object-contain"
            priority
            draggable={false}
          />
        </Link>

        <Link
          href={NAVIGATION_COPY.links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={NAVIGATION_COPY.whatsappLabel}
          className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#3a001a]/25"
        >
          <Image
            src="/assets/icons/whatsapp.svg"
            alt={NAVIGATION_COPY.whatsappLabel}
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
            draggable={false}
          />
        </Link>
      </div>
    </div>
  );
}

function NavArrow({
  href,
  label,
  direction
}: {
  href?: string;
  label: string;
  direction: "left" | "right";
}) {
  if (!href) {
    return <span className="h-10 w-10 rounded-full border border-black/10 bg-white/70" aria-hidden="true" />;
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-lg font-bold transition hover:scale-105"
    >
      {direction === "left" ? "\u2190" : "\u2192"}
    </Link>
  );
}

function AnchorChip({ href, label, disabled = false }: { href?: string; label: string; disabled?: boolean }) {
  const className =
    "rounded-full border border-transparent px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3a001a]/75 transition";

  if (disabled || !href) {
    return (
      <span
        aria-disabled="true"
        className={`${className} cursor-default`}
      >
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`${className} hover:border-[#3a001a]/20`}
    >
      {label}
    </a>
  );
}
