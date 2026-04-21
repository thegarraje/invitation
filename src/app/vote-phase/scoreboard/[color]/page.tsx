import { ScenePage } from "@/components/layout/ScenePage";
import { COLOR_KEYS } from "@/content/route-paths";

export const dynamicParams = false;

export function generateStaticParams() {
  return COLOR_KEYS.map((color) => ({ color }));
}

export default async function VoteScoreboardPage({
  params
}: {
  params: Promise<{ color: string }>;
}) {
  const { color } = await params;
  return <ScenePage path={`/vote-phase/scoreboard/${color}`} />;
}
