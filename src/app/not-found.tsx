export default function NotFound() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0c607e]">
      <iframe
        src="/legacy-site/index.htm"
        title="Legacy mirror fallback"
        className="h-full w-full border-0"
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </main>
  );
}
