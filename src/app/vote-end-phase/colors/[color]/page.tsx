import { ScenePage } from "@/components/layout/ScenePage";
import { COLOR_KEYS } from "@/content/route-paths";

export const dynamicParams = false;

export function generateStaticParams() {
  return COLOR_KEYS.map((color) => ({ color }));
}

export default async function VoteEndColorPage({
  params
}: {
  params: Promise<{ color: string }>;
}) {
  const { color } = await params;
  return <ScenePage path={`/vote-end-phase/colors/${color}`} />;
}
