import Link from "next/link";
import { ADMIN_PAGE_COPY } from "@/content/sections/admin";

export default function AdminIndexPage() {
  return (
    <main className="min-h-screen bg-[#ebf9fa] px-4 py-8 text-[#3a001a]">
      <div className="mx-auto w-full max-w-3xl rounded-[1.4rem] border border-black/10 bg-white p-6 shadow-xl md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">{ADMIN_PAGE_COPY.eyebrow}</p>
        <h1 className="mt-2 text-2xl font-semibold md:text-3xl">{ADMIN_PAGE_COPY.title}</h1>
        <p className="mt-3 text-sm text-black/70">{ADMIN_PAGE_COPY.subtitle}</p>
        <p className="mt-2 text-sm text-black/70">{ADMIN_PAGE_COPY.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/confirm"
            className="rounded-full border border-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]"
          >
            {ADMIN_PAGE_COPY.openFormButton}
          </Link>
          <Link
            href="/admin/submissions"
            className="rounded-full border border-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]"
          >
            Open Submissions Page
          </Link>
        </div>
      </div>
    </main>
  );
}
