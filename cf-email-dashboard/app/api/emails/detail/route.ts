import { NextRequest, NextResponse } from "next/server";
import { getEmail } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    const email = await getEmail(id);
    return NextResponse.json({ success: true, email });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
