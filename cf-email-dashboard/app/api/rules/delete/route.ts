import { NextRequest, NextResponse } from "next/server";
import { deleteRule } from "@/lib/cloudflare";

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }

    const results: { ok: boolean; message: string }[] = [];
    for (const id of ids) {
      const res = await deleteRule(id);
      results.push(res);
      await new Promise((r) => setTimeout(r, 150));
    }

    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
