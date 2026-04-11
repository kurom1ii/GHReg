import { NextResponse } from "next/server";
import { listLabels } from "@/lib/gmail";

export async function GET() {
  try {
    const labels = await listLabels();
    return NextResponse.json({ success: true, labels });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
