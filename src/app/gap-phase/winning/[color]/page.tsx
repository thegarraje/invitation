import { redirect } from "next/navigation";
import { WINNING_COLOR_KEYS } from "@/content/route-paths";

export const dynamicParams = false;

export function generateStaticParams() {
  return WINNING_COLOR_KEYS.map((color) => ({ color }));
}

export default async function GapWinningPage() {
  redirect("/legacy-site/old-home.html#colors");
}
