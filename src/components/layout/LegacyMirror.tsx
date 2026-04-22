"use client";

import { useState } from "react";

interface LegacyMirrorProps {
  src: string;
  title: string;
}

export function LegacyMirror({ src, title }: LegacyMirrorProps) {
  const [iframeError, setIframeError] = useState(false);

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0c607e]">
      {iframeError ? (
        <div className="absolute inset-x-4 top-4 z-10 rounded-xl bg-white/95 px-4 py-3 text-sm text-[#3a001a] shadow-lg">
          Could not load legacy view inline. Open directly:{" "}
          <a className="underline" href={src}>
            {src}
          </a>
        </div>
      ) : null}
      <iframe
        src={src}
        title={title}
        className="h-full w-full border-0"
        loading="eager"
        referrerPolicy="no-referrer"
        onError={() => setIframeError(true)}
      />
    </main>
  );
}
