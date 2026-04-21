import { notFound } from "next/navigation";
import { getRouteScene } from "@/content/routes";
import { PhaseLayout } from "@/components/layout/PhaseLayout";

interface ScenePageProps {
  path: string;
}

export function ScenePage({ path }: ScenePageProps) {
  const scene = getRouteScene(path);

  if (!scene) {
    notFound();
  }

  return <PhaseLayout scene={scene} />;
}
