import { getRouteScene } from "@/content/routes";
import { PhaseLayout } from "@/components/layout/PhaseLayout";
import { LegacyMirror } from "@/components/layout/LegacyMirror";
import { getLegacyMirrorPath } from "@/lib/legacy-mirror";

interface ScenePageProps {
  path: string;
  rawPath?: string;
}

export function ScenePage({ path, rawPath }: ScenePageProps) {
  const scene = getRouteScene(path);
  const legacyMirrorPath = getLegacyMirrorPath(path);

  if (!scene) {
    const convertedRawPath = rawPath?.endsWith(".htm")
      ? rawPath.replace(/\.htm$/, ".html")
      : rawPath;

    const directLegacyPath =
      convertedRawPath && convertedRawPath.endsWith(".html")
        ? `/legacy-site${convertedRawPath}`
        : path === "/"
          ? "/legacy-site/old-home.html"
          : `/legacy-site${path}.html`;

    return <LegacyMirror src={directLegacyPath} title={`Legacy mirror for ${rawPath ?? path}`} />;
  }

  if (legacyMirrorPath) {
    return <LegacyMirror src={legacyMirrorPath} title={`Legacy mirror for ${path}`} />;
  }

  return <PhaseLayout scene={scene} />;
}
