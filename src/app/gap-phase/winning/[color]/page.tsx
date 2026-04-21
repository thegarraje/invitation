import { ScenePage } from "@/components/layout/ScenePage";
import { WINNING_COLOR_KEYS } from "@/content/route-paths";

export const dynamicParams = false;

export function generateStaticParams() {
  return WINNING_COLOR_KEYS.map((color) => ({ color }));
}

export default async function GapWinningPage({
  params
}: {
  params: Promise<{ color: string }>;
}) {
  const { color } = await params;
  return <ScenePage path={`/gap-phase/winning/${color}`} />;
}
