import { redirect } from "next/navigation";
import { COLOR_KEYS } from "@/content/route-paths";

export const dynamicParams = false;

export function generateStaticParams() {
  return COLOR_KEYS.map((color) => ({ color }));
}

export default async function VoteEndColorPage() {
  redirect("/legacy-site/old-home.html#colors");
}
