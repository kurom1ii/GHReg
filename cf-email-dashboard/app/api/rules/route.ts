import { NextResponse } from "next/server";
import { listRules } from "@/lib/cloudflare";

export async function GET() {
  try {
    const rules = await listRules();
    return NextResponse.json({ rules });
  } catch (e) {
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}
