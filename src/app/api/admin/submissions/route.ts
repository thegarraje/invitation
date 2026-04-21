import { NextResponse } from "next/server";
import { listConfirmSubmissions } from "@/lib/submission-store";

function isAuthorized(request: Request) {
  const expected = process.env.ADMIN_PANEL_TOKEN;
  if (!expected) {
    return true;
  }

  const url = new URL(request.url);
  const provided = url.searchParams.get("token") || request.headers.get("x-admin-token") || "";
  return provided === expected;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await listConfirmSubmissions();
  return NextResponse.json({ ok: true, submissions });
}
