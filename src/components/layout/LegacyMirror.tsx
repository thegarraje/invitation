"use client";

import { useEffect, useState } from "react";

interface LegacyMirrorProps {
  src: string;
  title: string;
}

export function LegacyMirror({ src, title }: LegacyMirrorProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!iframeLoaded) {
        window.location.replace(src);
      }
    }, 4500);

    return () => window.clearTimeout(timeout);
  }, [iframeLoaded, src]);

  const handleIframeError = () => {
    window.location.replace(src);
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0c607e]">
      <iframe
        src={src}
        title={title}
        className="h-full w-full border-0"
        loading="eager"
        referrerPolicy="no-referrer"
        onLoad={() => setIframeLoaded(true)}
        onError={handleIframeError}
      />
    </main>
  );
}
