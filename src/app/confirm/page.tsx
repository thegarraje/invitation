import { CONFIRM_PAGE_COPY } from "@/content/sections/confirm";

export default function ConfirmPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#ebf9fa]">
      <iframe
        title={CONFIRM_PAGE_COPY.title}
        allowTransparency
        allowFullScreen
        allow="geolocation; microphone; camera"
        src={CONFIRM_PAGE_COPY.iframeSrc}
        className="h-full w-full border-0"
      />
    </main>
  );
}
