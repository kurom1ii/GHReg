import { cache } from "./cache";

const CF_API_TOKEN = process.env.CF_API_TOKEN!;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID!;
const CF_ZONE_ID = process.env.CF_ZONE_ID!;
export const CF_DOMAIN = process.env.CF_DOMAIN!;
export const CF_DESTINATION_EMAIL = process.env.CF_DESTINATION_EMAIL!;

const RULES_URL = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/email/routing/rules`;
const DEST_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/email/routing/addresses`;
const HEADERS = {
  Authorization: `Bearer ${CF_API_TOKEN}`,
  "Content-Type": "application/json",
};

// ── Types ────────────────────────────────────────────────────────────

export interface EmailRule {
  id: string;
  name: string;
  enabled: boolean;
  from: string;
  to: string;
}

export interface Destination {
  id: string;
  email: string;
  verified: string | null;
  created: string;
}

// ── Rules ────────────────────────────────────────────────────────────

function parseRule(raw: Record<string, unknown>): EmailRule {
  const matchers = raw.matchers as { value: string }[];
  const actions = raw.actions as { value: string[] }[];
  return {
    id: raw.id as string,
    name: raw.name as string,
    enabled: raw.enabled as boolean,
    from: matchers?.[0]?.value ?? "",
    to: actions?.[0]?.value?.[0] ?? "",
  };
}

export async function listRules(): Promise<EmailRule[]> {
  const cached = cache.get<EmailRule[]>("cf_rules");
  if (cached) return cached;

  const all: EmailRule[] = [];
  let page = 1;
  const perPage = 50;

  while (true) {
    const res = await fetch(`${RULES_URL}?page=${page}&per_page=${perPage}`, {
      headers: HEADERS,
      cache: "no-store",
    });
    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data.errors));

    for (const r of data.result ?? []) {
      all.push(parseRule(r));
    }

    const totalCount = data.result_info?.total_count ?? 0;
    const totalPages = Math.ceil(totalCount / perPage) || 1;
    if (page >= totalPages) break;
    page++;
  }

  cache.set("cf_rules", all, 30_000); // cache 30s
  return all;
}

export async function createRule(
  localPart: string,
  domain: string,
  destinationEmail: string
): Promise<{ ok: boolean; message: string }> {
  const email = `${localPart}@${domain}`;
  const res = await fetch(RULES_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      name: `Route ${email}`,
      enabled: true,
      matchers: [{ type: "literal", field: "to", value: email }],
      actions: [{ type: "forward", value: [destinationEmail] }],
    }),
  });
  const data = await res.json();

  if (data.success) {
    cache.del("cf_rules");
    return { ok: true, message: `${email} → ${destinationEmail}` };
  }

  const errors: string = JSON.stringify(data.errors);
  if (errors.toLowerCase().includes("already exists"))
    return { ok: true, message: `${email} already exists` };

  return { ok: false, message: `${email} failed: ${errors}` };
}

export async function deleteRule(
  ruleId: string
): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${RULES_URL}/${ruleId}`, {
    method: "DELETE",
    headers: HEADERS,
  });
  const data = await res.json();

  if (data.success) {
    cache.del("cf_rules");
    return { ok: true, message: `Deleted rule` };
  }
  return { ok: false, message: `Failed: ${JSON.stringify(data.errors)}` };
}

// ── Destinations ─────────────────────────────────────────────────────

export async function listDestinations(): Promise<Destination[]> {
  const cached = cache.get<Destination[]>("cf_destinations");
  if (cached) return cached;

  const all: Destination[] = [];
  let page = 1;
  const perPage = 50;

  while (true) {
    const res = await fetch(`${DEST_URL}?page=${page}&per_page=${perPage}`, {
      headers: HEADERS,
      cache: "no-store",
    });
    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data.errors));

    for (const d of data.result ?? []) {
      all.push({
        id: d.id,
        email: d.email,
        verified: d.verified ?? null,
        created: d.created,
      });
    }

    const totalCount = data.result_info?.total_count ?? 0;
    const totalPages = Math.ceil(totalCount / perPage) || 1;
    if (page >= totalPages) break;
    page++;
  }

  cache.set("cf_destinations", all, 30_000); // cache 30s
  return all;
}

export async function createDestination(
  email: string
): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(DEST_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ email }),
  });
  const data = await res.json();

  if (data.success) {
    cache.del("cf_destinations");
    return { ok: true, message: `Verification email sent to ${email}` };
  }

  const errors = JSON.stringify(data.errors);
  if (errors.toLowerCase().includes("already exists"))
    return { ok: true, message: `${email} already registered` };

  return { ok: false, message: `Failed: ${errors}` };
}

export async function deleteDestination(
  destId: string
): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${DEST_URL}/${destId}`, {
    method: "DELETE",
    headers: HEADERS,
  });
  const data = await res.json();

  if (data.success) {
    cache.del("cf_destinations");
    return { ok: true, message: `Destination removed` };
  }
  return { ok: false, message: `Failed: ${JSON.stringify(data.errors)}` };
}
