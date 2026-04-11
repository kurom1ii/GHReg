import { NextResponse } from "next/server";
import { purgeInbox } from "@/lib/gmail";

export async function POST() {
  try {
    const { deleted, failed, logs } = await purgeInbox();
    return NextResponse.json({ success: true, deleted, failed, logs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
