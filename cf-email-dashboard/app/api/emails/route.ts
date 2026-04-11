import { NextResponse } from "next/server";
import { listEmails } from "@/lib/gmail";

export async function GET() {
  try {
    const { emails, account } = await listEmails(20);
    return NextResponse.json({ success: true, account, emails, total: emails.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
