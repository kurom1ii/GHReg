import { NextRequest, NextResponse } from "next/server";
import { createRule, CF_DOMAIN, CF_DESTINATION_EMAIL } from "@/lib/cloudflare";

export async function POST(req: NextRequest) {
  try {
    const { prefix, count, start, domain, destination } = await req.json();

    if (!prefix || !count) {
      return NextResponse.json({ error: "prefix and count required" }, { status: 400 });
    }

    const targetDomain = domain || CF_DOMAIN;
    const targetDest = destination || CF_DESTINATION_EMAIL;

    const tasks = [];
    for (let i = start ?? 1; i < (start ?? 1) + count; i++) {
      tasks.push(createRule(`${prefix}${i}`, targetDomain, targetDest));
    }

    const results = await Promise.all(tasks);

    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
