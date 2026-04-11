import { NextRequest, NextResponse } from "next/server";
import { searchEmails } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  try {
    const q = new URL(req.url).searchParams.get("q");
    if (!q) return NextResponse.json({ success: false, error: "Missing ?q=" }, { status: 400 });

    const emails = await searchEmails(q, 20);
    return NextResponse.json({ success: true, emails, count: emails.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
