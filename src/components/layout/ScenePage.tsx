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
    const convertedRawPath = rawPath?.endsWith(".html")
      ? rawPath.replace(/\.html$/, ".htm")
      : rawPath;

    const directLegacyPath =
      convertedRawPath && convertedRawPath.endsWith(".htm")
        ? `/legacy-site${convertedRawPath}`
        : path === "/"
          ? "/legacy-site/old-home.htm"
          : `/legacy-site${path}.htm`;

    return <LegacyMirror src={directLegacyPath} title={`Legacy mirror for ${rawPath ?? path}`} />;
  }

  if (legacyMirrorPath) {
    return <LegacyMirror src={legacyMirrorPath} title={`Legacy mirror for ${path}`} />;
  }

  return <PhaseLayout scene={scene} />;
}
