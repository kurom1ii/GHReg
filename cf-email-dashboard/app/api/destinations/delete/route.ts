import { NextRequest, NextResponse } from "next/server";
import { deleteDestination } from "@/lib/cloudflare";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const result = await deleteDestination(id);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
