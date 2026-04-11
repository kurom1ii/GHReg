import { cache } from "./cache";

const CLIENT_ID = process.env.GMAIL_CLIENT_ID!;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN!;

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at - 60_000) {
    return cachedToken.access_token;
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token refresh failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.access_token;
}

function decodeBase64Url(str: string): string {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf8");
}

function getHeader(headers: { name: string; value: string }[], name: string): string {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";
}

export interface EmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  fromName: string;
  date: string;
  snippet: string;
  isRead: boolean;
  hasAttachments: boolean;
  labelIds: string[];
}

export interface EmailDetail extends EmailMessage {
  to: string;
  body: string;
}

async function parseMessage(msg: Record<string, unknown>): Promise<EmailMessage> {
  const payload = msg.payload as Record<string, unknown>;
  const headers = (payload?.headers || []) as { name: string; value: string }[];
  const fromRaw = getHeader(headers, "From");
  const nameMatch = fromRaw.match(/^"?([^"<]+)"?\s*</);

  return {
    id: msg.id as string,
    threadId: msg.threadId as string,
    subject: getHeader(headers, "Subject") || "(no subject)",
    from: fromRaw.match(/<(.+)>/)?.[1] || fromRaw,
    fromName: nameMatch?.[1]?.trim() || fromRaw.match(/<(.+)>/)?.[1] || fromRaw,
    date: getHeader(headers, "Date"),
    snippet: msg.snippet as string || "",
    isRead: !((msg.labelIds as string[]) || []).includes("UNREAD"),
    hasAttachments: ((payload?.parts as Record<string, unknown>[]) || []).some(
      (p) => p.filename && (p.filename as string).length > 0
    ),
    labelIds: (msg.labelIds as string[]) || [],
  };
}

function extractBody(payload: Record<string, unknown>): string {
  // Try to find HTML body first, then plain text
  const parts = (payload.parts as Record<string, unknown>[]) || [];

  for (const part of parts) {
    if (part.mimeType === "text/html" && (part.body as Record<string, unknown>)?.data) {
      return decodeBase64Url((part.body as Record<string, unknown>).data as string);
    }
    // Nested multipart
    if ((part.parts as unknown[])?.length) {
      const nested = extractBody(part as Record<string, unknown>);
      if (nested) return nested;
    }
  }

  for (const part of parts) {
    if (part.mimeType === "text/plain" && (part.body as Record<string, unknown>)?.data) {
      const text = decodeBase64Url((part.body as Record<string, unknown>).data as string);
      return `<pre style="white-space:pre-wrap">${text}</pre>`;
    }
  }

  // Single-part message
  const body = payload.body as Record<string, unknown>;
  if (body?.data) {
    const decoded = decodeBase64Url(body.data as string);
    if ((payload.mimeType as string)?.includes("html")) return decoded;
    return `<pre style="white-space:pre-wrap">${decoded}</pre>`;
  }

  return "";
}

export async function listEmails(maxResults = 20): Promise<{ emails: EmailMessage[]; account: string }> {
  const cacheKey = `emails_list_${maxResults}`;
  const cached = cache.get<{ emails: EmailMessage[]; account: string }>(cacheKey);
  if (cached) return cached;

  const token = await getAccessToken();

  const listRes = await fetch(`${GMAIL_BASE}/messages?maxResults=${maxResults}&labelIds=INBOX`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!listRes.ok) {
    const err = await listRes.text();
    throw new Error(`List failed: ${listRes.status} ${err}`);
  }

  const listData = await listRes.json();
  const messageIds: { id: string }[] = listData.messages || [];

  const emails: EmailMessage[] = [];
  for (const { id } of messageIds) {
    const res = await fetch(`${GMAIL_BASE}/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date&metadataHeaders=To`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const msg = await res.json();
      emails.push(await parseMessage(msg));
    }
  }

  // Get account email
  const profRes = await fetch(`${GMAIL_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profile = profRes.ok ? await profRes.json() : { emailAddress: "" };

  const result = { emails, account: profile.emailAddress };
  cache.set(cacheKey, result, 15_000); // cache 15s
  return result;
}

export async function getEmail(id: string): Promise<EmailDetail> {
  const cacheKey = `email_${id}`;
  const cached = cache.get<EmailDetail>(cacheKey);
  if (cached) return cached;

  const token = await getAccessToken();
  const res = await fetch(`${GMAIL_BASE}/messages/${id}?format=full`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Get email failed: ${res.status} ${err}`);
  }

  const msg = await res.json();
  const base = await parseMessage(msg);
  const payload = msg.payload as Record<string, unknown>;
  const headers = (payload?.headers || []) as { name: string; value: string }[];

  return {
    ...base,
    to: getHeader(headers, "To"),
    body: extractBody(payload),
  };
  cache.set(cacheKey, detail, 60_000); // cache 60s
  return detail;
}

export async function searchEmails(query: string, maxResults = 20): Promise<EmailMessage[]> {
  const token = await getAccessToken();
  const params = new URLSearchParams({ q: query, maxResults: String(maxResults) });

  const listRes = await fetch(`${GMAIL_BASE}/messages?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!listRes.ok) {
    const err = await listRes.text();
    throw new Error(`Search failed: ${listRes.status} ${err}`);
  }

  const listData = await listRes.json();
  const emails: EmailMessage[] = [];

  for (const { id } of (listData.messages || []) as { id: string }[]) {
    const res = await fetch(`${GMAIL_BASE}/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) emails.push(await parseMessage(await res.json()));
  }

  return emails;
}

export async function listLabels(): Promise<{ id: string; name: string; messagesTotal: number; messagesUnread: number }[]> {
  const token = await getAccessToken();
  const res = await fetch(`${GMAIL_BASE}/labels`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`List labels failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  return (data.labels || []).map((l: Record<string, unknown>) => ({
    id: l.id,
    name: l.name,
    messagesTotal: l.messagesTotal ?? 0,
    messagesUnread: l.messagesUnread ?? 0,
  }));
}

export async function trashEmail(id: string): Promise<void> {
  const token = await getAccessToken();
  const res = await fetch(`${GMAIL_BASE}/messages/${id}/trash`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Trash failed: ${res.status} ${err}`);
  }
}

export interface PurgeLog {
  id: string;
  subject: string;
  from: string;
  status: number;
  ok: boolean;
  error: string;
}

export async function purgeInbox(): Promise<{ deleted: number; failed: number; logs: PurgeLog[] }> {
  const token = await getAccessToken();
  let deleted = 0;
  let failed = 0;
  const logs: PurgeLog[] = [];

  // List all inbox messages
  let pageToken = "";
  while (true) {
    const url = `${GMAIL_BASE}/messages?labelIds=INBOX&maxResults=100${pageToken ? `&pageToken=${pageToken}` : ""}`;
    const listRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

    if (!listRes.ok) break;
    const listData = await listRes.json();
    const messages: { id: string }[] = listData.messages || [];
    if (messages.length === 0) break;

    // Batch delete using batchDelete endpoint
    const ids = messages.map((m) => m.id);
    const delRes = await fetch(`${GMAIL_BASE}/messages/batchDelete`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    const ok = delRes.ok || delRes.status === 204;
    let errorDetail = "";
    if (!ok) {
      try { const e = await delRes.json(); errorDetail = e?.error?.message || `HTTP ${delRes.status}`; } catch { errorDetail = `HTTP ${delRes.status}`; }
    }

    for (const id of ids) {
      if (ok) deleted++; else failed++;
      logs.push({ id, subject: "", from: "", status: delRes.status, ok, error: errorDetail });
    }

    if (ok) {
      logs[logs.length - ids.length].subject = `Batch deleted ${ids.length} messages`;
    }

    if (!listData.nextPageToken) break;
    pageToken = listData.nextPageToken;

    if (!ok) break;
  }

  cache.del("emails_list_20");
  cache.del("inbox_state");
  return { deleted, failed, logs };
}

export async function getInboxState(): Promise<{ total: number; latestId: string | null }> {
  const cached = cache.get<{ total: number; latestId: string | null }>("inbox_state");
  if (cached) return cached;

  const token = await getAccessToken();
  const res = await fetch(`${GMAIL_BASE}/messages?maxResults=1&labelIds=INBOX`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Inbox state failed: ${res.status}`);
  const data = await res.json();
  const total = data.resultSizeEstimate ?? 0;
  const latestId = data.messages?.[0]?.id ?? null;

  const state = { total, latestId };
  cache.set("inbox_state", state, 8_000); // cache 8s
  return state;
}
