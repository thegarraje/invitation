import Link from "next/link";
import type { FooterSectionData } from "@/types/content";

interface FooterSectionProps {
  footer: FooterSectionData;
}

export function FooterSection({ footer }: FooterSectionProps) {
  return (
    <footer id={footer.id} className="relative flex min-h-screen items-center px-6 pb-44 pt-16">
      <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-black/25 p-8 text-[#ebf9fa] backdrop-blur-sm">
        <h2 className="text-xl font-semibold uppercase tracking-[0.08em]">{footer.title}</h2>
        <p className="mt-3 text-sm text-[#ebf9fa]/80">{footer.body}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {footer.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
