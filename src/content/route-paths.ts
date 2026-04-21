import paths from "../../config/route-paths.json";
import type { ColorKey } from "@/types/content";

export const COLOR_KEYS = paths.colors as ColorKey[];

export const WINNING_COLOR_KEYS = paths.winningColors as ColorKey[];

export const ROUTE_PATHS = paths.routes as string[];
