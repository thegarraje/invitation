import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0c607e] px-6 text-[#ebf9fa]">
      <div className="w-full max-w-xl rounded-[1.5rem] border border-white/20 bg-black/25 p-8 text-center backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c8eff2]">Not Found</p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Route Not Found</h1>
        <p className="mt-4 text-sm text-[#ebf9fa]/80 md:text-base">
          This path is outside the native static route map.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border border-white/30 bg-[#f16e2a] px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
