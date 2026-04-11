import { NextRequest, NextResponse } from "next/server";
import { createDestination } from "@/lib/cloudflare";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
    const result = await createDestination(email);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
