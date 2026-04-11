import { getInboxState } from "@/lib/gmail";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      let lastId: string | null = null;
      let lastTotal = 0;

      // Initial state
      try {
        const state = await getInboxState();
        lastId = state.latestId;
        lastTotal = state.total;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "init", total: lastTotal, latestId: lastId })}\n\n`));
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: "init failed" })}\n\n`));
      }

      // Poll every 10s
      const interval = setInterval(async () => {
        if (closed) { clearInterval(interval); return; }
        try {
          const state = await getInboxState();
          if (state.latestId !== lastId || state.total !== lastTotal) {
            const newCount = state.total - lastTotal;
            lastId = state.latestId;
            lastTotal = state.total;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "new_mail", total: lastTotal, newCount: Math.max(newCount, 1) })}\n\n`));
          } else {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "ping" })}\n\n`));
          }
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: "poll failed" })}\n\n`));
        }
      }, 10_000);

      // Cleanup on close
      const cleanup = () => { closed = true; clearInterval(interval); };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

      // Keep reference for cancel
      (stream as unknown as Record<string, unknown>).__cleanup = cleanup;
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
