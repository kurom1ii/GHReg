import { NextResponse } from "next/server";
import { listDestinations } from "@/lib/cloudflare";

export async function GET() {
  try {
    const destinations = await listDestinations();
    return NextResponse.json({ destinations });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
