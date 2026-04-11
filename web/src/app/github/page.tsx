"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  LogIn, Key, Building, Terminal, Loader2,
  Radio, GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/accounts-table";
import { fetchApi } from "@/lib/api";
import { OrgPanel } from "@/components/OrgPanel";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SS_GH = "gh_accounts";
const SS_GH_T = "gh_total";
const FETCH_SIZE = 1000;
const ROW_H = 35;
const HEADER_H = 41;

interface GHAccount { email: string; username: string; status: string }
interface AccountsResp { accounts: GHAccount[]; total: number; page: number }
interface OrgMember { username: string; display_name: string }
interface OrgInfo { name: string; members: OrgMember[]; pending: string[] }
interface LogEntry { ts: string; raw: string }

function ss<T>(k: string): T | null {
  if (typeof window === "undefined") return null;
  try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; }
}
function ssw(k: string, v: unknown) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} }

function getBadgeInfo(raw: string) {
  if (raw.startsWith("[ok]"))     return { badge: "OK",    c: "#27a644", bg: "#27a64420", rest: raw.slice(4).trim() };
  if (raw.startsWith("[fail]"))   return { badge: "FAIL",  c: "#ef4444", bg: "#ef444420", rest: raw.slice(6).trim() };
  if (raw.startsWith("[error]"))  return { badge: "ERR",   c: "#ef4444", bg: "#ef444420", rest: raw.slice(7).trim() };
  if (raw.startsWith("[login]"))  return { badge: "LOGIN", c: "#5e6ad2", bg: "#5e6ad220", rest: raw.slice(7).trim() };
  if (raw.startsWith("[pat]"))    return { badge: "PAT",   c: "#a855f7", bg: "#a855f720", rest: raw.slice(5).trim() };
  if (raw.startsWith("[org]"))    return { badge: "ORG",   c: "#06b6d4", bg: "#06b6d420", rest: raw.slice(5).trim() };
  if (raw.startsWith("[invite]")) return { badge: "ORG",   c: "#06b6d4", bg: "#06b6d420", rest: raw.slice(8).trim() };
  return { badge: "···", c: "#9ca3af", bg: "#9ca3af15", rest: raw };
}

function StatusDot({ status }: { status: string }) {
  if (status === "logging_in") return <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />;
  if (status === "logged_in" || status === "online") return <span className="h-2 w-2 rounded-full bg-[#27a644]" />;
  if (status === "pat_created") return <Key className="h-3 w-3 text-primary" />;
  if (status === "failed") return <span className="h-2 w-2 rounded-full bg-destructive" />;
  return <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />;
}

export default function GitHubPage() {
  const [accounts, setAccounts] = useState<GHAccount[]>([]);
  const [ghTotal, setGhTotal] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState<OrgInfo[]>([]);
  const [activeOrgUsername, setActiveOrgUsername] = useState<string | null>(null);
  const [totpCodes, setTotpCodes] = useState<Record<string, string>>({});
  const [totpRemaining, setTotpRemaining] = useState(30);
  const [backendLogs, setBackendLogs] = useState<{ ts: string; level: string; module: string; msg: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(15);

  const gridRef = useRef<HTMLDivElement>(null);
  const [gridH, setGridH] = useState("calc(100vh - 120px)");
  const logEndRef = useRef<HTMLDivElement>(null);
  const backendLogEndRef = useRef<HTMLDivElement>(null);

  /* ── data fetching ────────────────────────────────────── */
  const loadAccounts = useCallback(async (bg: boolean) => {
    if (!bg) setLoading(true);
    try {
      const raw = await fetchApi<AccountsResp | GHAccount[]>(`/api/github/accounts?page=0&size=${FETCH_SIZE}`);
      const res = Array.isArray(raw) ? { accounts: raw, total: raw.length, page: 0 } : raw;
      setAccounts(res.accounts ?? []); setGhTotal(res.total ?? 0);
      ssw(SS_GH, res.accounts ?? []); ssw(SS_GH_T, res.total ?? 0);
    } catch {}
    if (!bg) setLoading(false);
  }, []);

  useEffect(() => {
    const cached = ss<GHAccount[]>(SS_GH);
    if (cached) { setAccounts(cached); setGhTotal(ss<number>(SS_GH_T) ?? cached.length); }
    loadAccounts(!!cached);
  }, [loadAccounts]);

  /* SSE status updates */
  useEffect(() => {
    const es = new EventSource(`${API_BASE}/api/github/stream`);
    es.addEventListener("status_update", (e) => { try {
      const data = JSON.parse(e.data);
      if (data.accounts) {
        const m: Record<string, string> = {};
        for (const a of data.accounts) m[a.username] = a.status;
        setAccounts((prev) => { const u = prev.map((a) => ({ ...a, status: m[a.username] ?? a.status })); ssw(SS_GH, u); return u; });
      }
    } catch {} });
    es.onerror = () => es.close();
    return () => es.close();
  }, []);

  /* SSE account list changes (watches accounts.txt) */
  useEffect(() => {
    const es = new EventSource(`${API_BASE}/api/github/accounts/stream`);
    es.onmessage = (e) => { try {
      const d = JSON.parse(e.data);
      if (d.accounts) {
        setAccounts(d.accounts);
        setGhTotal(d.total ?? d.accounts.length);
        ssw(SS_GH, d.accounts);
        ssw(SS_GH_T, d.total ?? d.accounts.length);
      }
    } catch {} };
    return () => es.close();
  }, []);

  /* TOTP codes */
  useEffect(() => {
    let on = true;
    const f = async () => { try {
      const res = await fetchApi<{ codes: Record<string, string>; remaining: number }>("/api/github/totp");
      if (on) { setTotpCodes(res.codes ?? {}); setTotpRemaining(res.remaining ?? 30); }
    } catch {} };
    f(); const t = setInterval(f, 1000);
    return () => { on = false; clearInterval(t); };
  }, []);

  /* Backend logs SSE */
  useEffect(() => {
    const es = new EventSource(`${API_BASE}/api/logs/stream`);
    es.onmessage = (e) => {
      const p = e.data.split("|", 4);
      if (p.length >= 4) setBackendLogs((prev) => { const n = [...prev, { ts: p[0], level: p[1], module: p[2], msg: p[3] }]; return n.length > 500 ? n.slice(-300) : n; });
    };
    return () => es.close();
  }, []);

  /* measure grid height + compute pageSize */
  useEffect(() => {
    const measure = () => {
      const el = gridRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const h = window.innerHeight - top;
      setGridH(`${h}px`);
      setPageSize(Math.max(5, Math.floor((h - HEADER_H) / ROW_H)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* ── actions ──────────────────────────────────────────── */
  const log = useCallback((msg: string) => {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setLogs((prev) => [...prev, { ts, raw: msg }]);
  }, []);

  const login = useCallback(async (username: string) => {
    setAccounts((p) => p.map((a) => a.username === username ? { ...a, status: "logging_in" } : a));
    log(`[login] ${username}...`);
    try {
      const res = await fetchApi<{ status: string }>(`/api/github/login/${username}`, { method: "POST" });
      setAccounts((p) => { const u = p.map((a) => a.username === username ? { ...a, status: res.status } : a); ssw(SS_GH, u); return u; });
      log(`[${res.status === "logged_in" ? "ok" : "fail"}] ${username}`);
    } catch (e: unknown) {
      setAccounts((p) => { const u = p.map((a) => a.username === username ? { ...a, status: "failed" } : a); ssw(SS_GH, u); return u; });
      log(`[error] ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [log]);

  const loginAll = useCallback(async () => {
    setLoading(true);
    const pending = accounts.filter((a) => a.status === "offline" || a.status === "failed");
    for (let i = 0; i < pending.length; i += 10) {
      await Promise.all(pending.slice(i, i + 10).map((a) => login(a.username)));
    }
    setLoading(false);
  }, [accounts, login]);

  const createPat = useCallback(async (username: string) => {
    log(`[pat] ${username}...`);
    try {
      const res = await fetchApi<{ status: string; token_preview: string }>(`/api/github/pat/${username}`, { method: "POST" });
      setAccounts((p) => { const u = p.map((a) => a.username === username ? { ...a, status: res.status } : a); ssw(SS_GH, u); return u; });
      log(`[ok] PAT: ${res.token_preview}`);
    } catch (e: unknown) { log(`[error] ${e instanceof Error ? e.message : String(e)}`); }
  }, [log]);

  const loadOrgs = useCallback(async (username: string) => {
    log(`[org] Loading orgs for ${username}...`);
    try {
      const data = await fetchApi<OrgInfo[]>(`/api/github/orgs/${username}?fresh=true`);
      setOrgs(data); setActiveOrgUsername(username);
      log(`[ok] ${data.length} orgs loaded`);
    } catch (e: unknown) { log(`[error] ${e instanceof Error ? e.message : String(e)}`); }
  }, [log]);

  const invite = useCallback(async (orgName: string, username: string) => {
    if (!username) return;
    log(`[invite] ${username} -> ${orgName}...`);
    try {
      const res = await fetchApi<{ ok: boolean }>(`/api/github/invite/${orgName}`, { method: "POST", body: JSON.stringify({ username, session_username: activeOrgUsername ?? "" }) });
      log(`[${res.ok ? "ok" : "fail"}] invite ${username}`);
      if (res.ok && activeOrgUsername) { await new Promise((r) => setTimeout(r, 500)); await loadOrgs(activeOrgUsername); }
    } catch (e: unknown) { log(`[error] ${e instanceof Error ? e.message : String(e)}`); }
  }, [activeOrgUsername, log, loadOrgs]);

  const removeMember = useCallback(async (orgName: string, username: string) => {
    log(`[org] Removing ${username} from ${orgName}...`);
    try {
      const res = await fetchApi<{ ok?: boolean; error?: string }>(`/api/github/orgs/${orgName}/remove/${username}`, { method: "POST", body: JSON.stringify({ session: activeOrgUsername ?? "" }) });
      if (res.ok) { log(`[ok] Removed ${username}`); if (activeOrgUsername) { await new Promise((r) => setTimeout(r, 2000)); await loadOrgs(activeOrgUsername); } }
      else log(`[fail] ${res.error || "remove failed"}`);
    } catch (e: unknown) { log(`[error] ${e instanceof Error ? e.message : String(e)}`); }
  }, [activeOrgUsername, log, loadOrgs]);

  const cancelPending = useCallback(async (orgName: string, invitee: string) => {
    log(`[org] Cancelling ${invitee} in ${orgName}...`);
    try {
      const res = await fetchApi<{ ok?: boolean; error?: string }>(`/api/github/orgs/${orgName}/cancel/${invitee}`, { method: "POST", body: JSON.stringify({ session: activeOrgUsername ?? "" }) });
      if (res.ok) { log(`[ok] Cancelled ${invitee}`); if (activeOrgUsername) { await new Promise((r) => setTimeout(r, 2000)); await loadOrgs(activeOrgUsername); } }
      else log(`[fail] ${res.error || "cancel failed"}`);
    } catch (e: unknown) { log(`[error] ${e instanceof Error ? e.message : String(e)}`); }
  }, [activeOrgUsername, log, loadOrgs]);

  /* ── table columns ────────────────────────────────────── */
  const columns = useMemo<ColumnDef<GHAccount>[]>(() => [
    {
      id: "account",
      header: "Account",
      cell: ({ row }) => {
        const acct = row.original;
        const code = totpCodes[acct.username];
        return (
          <div className="flex items-center gap-2 min-w-0 w-full">
            <StatusDot status={acct.status} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-foreground truncate text-[13px]">{acct.username}</span>
                {code && (
                  <span className="flex items-center gap-1 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0">
                      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/10" />
                      <circle cx="8" cy="8" r="6" fill="none" strokeWidth="1.5" strokeLinecap="round"
                        strokeDasharray={`${(totpRemaining / 30) * 37.7} 37.7`} transform="rotate(-90 8 8)"
                        style={{ stroke: totpRemaining <= 5 ? "#ef4444" : totpRemaining <= 10 ? "#f59e0b" : "#27a644", transition: "stroke-dasharray 1s linear" }} />
                    </svg>
                    <span className="text-[10px] tabular-nums text-primary/80 font-mono font-semibold tracking-widest">{code}</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground/50 truncate">{acct.email}</p>
            </div>
            {/* action buttons */}
            <div className="flex gap-0.5 shrink-0 ml-auto">
              <button className="p-0.5 rounded text-muted-foreground/40 hover:text-[#27a644] hover:bg-accent transition-colors" onClick={(e) => { e.stopPropagation(); login(acct.username); }} title="Login">
                <LogIn className="h-3 w-3" />
              </button>
              <button className="p-0.5 rounded text-muted-foreground/40 hover:text-primary hover:bg-accent transition-colors" onClick={(e) => { e.stopPropagation(); createPat(acct.username); }} title="Create PAT">
                <Key className="h-3 w-3" />
              </button>
              <button className="p-0.5 rounded text-muted-foreground/40 hover:text-foreground hover:bg-accent transition-colors" onClick={(e) => { e.stopPropagation(); loadOrgs(acct.username); }} title="Orgs">
                <Building className="h-3 w-3" />
              </button>
            </div>
          </div>
        );
      },
    },
  ], [totpCodes, totpRemaining, login, createPat, loadOrgs]);

  const onlineCount = accounts.filter((a) => a.status === "logged_in" || a.status === "pat_created").length;
  const patCount = accounts.filter((a) => a.status === "pat_created").length;

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] font-semibold text-foreground tracking-tight">GitHub Accounts</h1>
        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
          <span>{ghTotal || accounts.length} accounts</span>
          {onlineCount > 0 && <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#27a644]" />{onlineCount} online</span>}
          {patCount > 0 && <span className="text-primary font-medium">{patCount} PATs</span>}
          <Button onClick={loginAll} disabled={loading} size="xs" variant="ghost" className="gap-1">
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogIn className="h-3 w-3" />}
            Login All
          </Button>
        </div>
      </div>

      {/* 3-col grid: accounts | orgs | logs */}
      <div
        ref={gridRef}
        className="grid overflow-hidden -mx-6 md:-mx-8 border-t border-border"
        style={{ height: gridH, gridTemplateColumns: "340px 1fr 320px" }}
      >
        {/* ── col 1: accounts DataTable ────────────────── */}
        <div className="flex flex-col" style={{ borderRight: "1px solid var(--border)" }}>
          <DataTable
            columns={columns}
            data={accounts}
            pageSize={pageSize}
            onRowClick={(acct) => {
              setSelectedUser(acct.username);
              navigator.clipboard.writeText(acct.username.trim());
            }}
            activeRow={(acct) => selectedUser === acct.username}
          />
        </div>

        {/* ── col 2: org panel (inline) ────────────────── */}
        <div className="flex flex-col overflow-hidden" style={{ borderRight: "1px solid var(--border)" }}>
          {orgs.length > 0 && activeOrgUsername ? (
            <OrgPanel
              orgs={orgs}
              sessionUsername={activeOrgUsername}
              onInvite={invite}
              onRemoveMember={removeMember}
              onCancelPending={cancelPending}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Building className="h-10 w-10 mb-2 text-muted-foreground/10" strokeWidth={1} />
              <p className="text-[12px] text-muted-foreground/25">Click <Building className="inline h-3 w-3" /> on an account</p>
            </div>
          )}
        </div>

        {/* ── col 3: logs ──────────────────────────────── */}
        <div className="flex flex-col">
          {/* activity log */}
          <div className="flex-1 flex flex-col overflow-hidden border-b border-border">
            <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5 shrink-0">
              <Terminal className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">Activity</span>
              {logs.length > 0 && <span className="text-[10px] text-muted-foreground/30">{logs.length}</span>}
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2" style={{ fontFamily: "var(--font-mono, monospace)" }}>
              {logs.length === 0 ? (
                <p className="text-[12px] text-muted-foreground/30 pt-4 text-center">No activity yet</p>
              ) : (
                <div className="space-y-0.5">
                  {logs.map((entry, i) => {
                    const { badge, c, bg, rest } = getBadgeInfo(entry.raw);
                    return (
                      <div key={i} className="flex items-baseline gap-1.5 min-w-0">
                        <span className="shrink-0 text-[10px] text-muted-foreground/40 tabular-nums w-[48px]">{entry.ts}</span>
                        <span className="shrink-0 text-[10px] px-1 py-0.5 leading-none font-semibold" style={{ color: c, background: bg }}>{badge}</span>
                        <span className="text-[12px] text-muted-foreground truncate">{rest}</span>
                      </div>
                    );
                  })}
                  <div ref={logEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* backend log */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5 shrink-0">
              <Radio className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">Backend</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#27a644] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#27a644]" />
              </span>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2" style={{ fontFamily: "var(--font-mono, monospace)" }}>
              {backendLogs.length === 0 ? (
                <p className="text-[12px] text-muted-foreground/30 pt-4 text-center">Waiting for logs…</p>
              ) : (
                <div className="space-y-0.5">
                  {backendLogs.map((entry, i) => {
                    const lc: Record<string, { c: string; bg: string }> = {
                      INFO: { c: "#27a644", bg: "#27a64420" }, WARN: { c: "#f59e0b", bg: "#f59e0b20" },
                      ERROR: { c: "#ef4444", bg: "#ef444420" }, DEBUG: { c: "#9ca3af", bg: "#9ca3af15" },
                    };
                    const s = lc[entry.level] ?? { c: "#9ca3af", bg: "#9ca3af15" };
                    return (
                      <div key={i} className="flex items-baseline gap-1.5 min-w-0">
                        <span className="shrink-0 text-[10px] text-muted-foreground/40 tabular-nums w-[48px]">{entry.ts}</span>
                        <span className="shrink-0 text-[10px] px-1 py-0.5 leading-none font-semibold" style={{ color: s.c, background: s.bg }}>{entry.level}</span>
                        <span className="shrink-0 text-[10px] text-primary/50">{entry.module}</span>
                        <span className="text-[12px] text-muted-foreground truncate">{entry.msg}</span>
                      </div>
                    );
                  })}
                  <div ref={backendLogEndRef} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
