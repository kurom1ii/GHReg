"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail, ChevronLeft, ChevronRight, RefreshCw,
  Loader2, Inbox, X, Bell, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/accounts-table";
import { fetchApi } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SK = {
  accounts: "ol_accounts", selected: "ol_selected", display: "ol_display",
  messages: "ol_messages", total: "ol_total", page: "ol_page", acctTotal: "ol_acct_total",
} as const;
const FETCH_SIZE = 1000;
const MAIL_PER_PAGE = 25;
const ROW_H = 35;
const HEADER_H = 41;

interface Account { email: string }
interface AccountsResp { accounts: Account[]; total: number; page: number }
interface MailMsg {
  id: string; subject: string; sender: string; sender_email: string;
  date: string; preview: string; is_read: boolean;
}
interface MailFull {
  subject: string; sender: string; sender_email: string;
  date: string; body_html: string; body_text: string;
}

function ss<T>(k: string): T | null {
  if (typeof window === "undefined") return null;
  try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; }
}
function ssw(k: string, v: unknown) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} }

export default function OutlookPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [acctTotal, setAcctTotal] = useState(0);
  const [selected, setSelected] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [messages, setMessages] = useState<MailMsg[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState<MailFull | null>(null);
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(15);

  const esRef = useRef<EventSource | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridH, setGridH] = useState("calc(100vh - 120px)");

  const totalPages = Math.max(1, Math.ceil(total / MAIL_PER_PAGE));
  const unread = (messages ?? []).filter((m) => !m.is_read).length;

  /* ── data fetching ────────────────────────────────────── */
  const loadAccounts = useCallback(async (cache: boolean) => {
    if (cache) {
      const c = ss<Account[]>(SK.accounts);
      if (c) { setAccounts(c); setAcctTotal(ss<number>(SK.acctTotal) ?? c.length); return; }
    }
    try {
      const raw = await fetchApi<AccountsResp | Account[]>(`/api/outlook/accounts?page=0&size=${FETCH_SIZE}`);
      const r = Array.isArray(raw) ? { accounts: raw, total: raw.length, page: 0 } : raw;
      setAccounts(r.accounts ?? []); setAcctTotal(r.total ?? 0);
      ssw(SK.accounts, r.accounts ?? []); ssw(SK.acctTotal, r.total ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    loadAccounts(true);
    const sel = ss<string>(SK.selected);
    if (sel) {
      setSelected(sel); setDisplayName(ss<string>(SK.display) ?? "");
      setMessages(ss<MailMsg[]>(SK.messages) ?? []);
      setTotal(ss<number>(SK.total) ?? 0); setPage(ss<number>(SK.page) ?? 0);
    }
  }, [loadAccounts]);

  /* SSE: account list updates */
  useEffect(() => {
    const es = new EventSource(`${API}/api/outlook/accounts/stream`);
    es.onmessage = (e) => { try {
      const d = JSON.parse(e.data);
      if (d.accounts) { setAccounts(d.accounts); setAcctTotal(d.total ?? d.accounts.length); ssw(SK.accounts, d.accounts); ssw(SK.acctTotal, d.total ?? d.accounts.length); }
    } catch {} };
    return () => es.close();
  }, []);

  useEffect(() => () => { esRef.current?.close(); if (bannerTimer.current) clearTimeout(bannerTimer.current); }, []);

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

  /* ── SSE mail stream ──────────────────────────────────── */
  const openSSE = useCallback((email: string) => {
    esRef.current?.close();
    const es = new EventSource(`${API}/api/outlook/stream/${email}`);
    esRef.current = es;
    es.onmessage = (e) => { try {
      const d = JSON.parse(e.data);
      if (d.type === "new_mail" && d.total != null) {
        setTotal((prev) => {
          if (d.total > prev) {
            setBanner(`${d.total - prev} new message${d.total - prev > 1 ? "s" : ""}`);
            if (bannerTimer.current) clearTimeout(bannerTimer.current);
            bannerTimer.current = setTimeout(() => setBanner(null), 4000);
            // auto-refresh messages
            setPage(0);
            fetchApi<{ messages: MailMsg[]; total: number }>(`/api/outlook/messages/${email}?page=0&_t=${Date.now()}`)
              .then((inbox) => { setMessages(inbox.messages ?? []); setTotal(inbox.total ?? 0); ssw(SK.messages, inbox.messages ?? []); ssw(SK.total, inbox.total ?? 0); ssw(SK.page, 0); })
              .catch(() => {});
          }
          return d.total;
        });
      }
    } catch {} };
    es.onerror = () => es.close();
  }, []);

  /* ── actions ──────────────────────────────────────────── */
  const connect = useCallback(async (email: string) => {
    if (email === selected && messages.length > 0) return;
    setConnecting(true); setSelected(email); setDetail(null); setSelectedMsgId(null); setPage(0);
    setMessages([]); setTotal(0);
    ssw(SK.selected, email);
    try {
      const r = await fetchApi<{ display_name: string }>(`/api/outlook/connect/${email}`, { method: "POST" });
      setDisplayName(r.display_name); ssw(SK.display, r.display_name);
      const inbox = await fetchApi<{ messages: MailMsg[]; total: number }>(`/api/outlook/messages/${email}?page=0`);
      setMessages(inbox.messages ?? []); setTotal(inbox.total ?? 0);
      ssw(SK.messages, inbox.messages ?? []); ssw(SK.total, inbox.total ?? 0); ssw(SK.page, 0);
      openSSE(email);
    } catch {}
    setConnecting(false);
  }, [openSSE, selected, messages.length]);

  const loadPage = useCallback(async (dir: number) => {
    const np = page + dir;
    if (np < 0 || np >= Math.ceil(total / MAIL_PER_PAGE)) return;
    setPage(np);
    try {
      const inbox = await fetchApi<{ messages: MailMsg[]; total: number }>(`/api/outlook/messages/${selected}?page=${np}`);
      setMessages(inbox.messages ?? []); setTotal(inbox.total ?? 0);
      ssw(SK.messages, inbox.messages ?? []); ssw(SK.total, inbox.total ?? 0); ssw(SK.page, np);
    } catch {}
  }, [page, total, selected]);

  const refresh = useCallback(async () => {
    try {
      const inbox = await fetchApi<{ messages: MailMsg[]; total: number }>(`/api/outlook/messages/${selected}?page=0`);
      setMessages(inbox.messages ?? []); setTotal(inbox.total ?? 0); setPage(0);
      ssw(SK.messages, inbox.messages ?? []); ssw(SK.total, inbox.total ?? 0); ssw(SK.page, 0);
    } catch {}
  }, [selected]);

  const readMail = useCallback(async (id: string) => {
    setSelectedMsgId(id); setLoadingDetail(true);
    try {
      const msg = await fetchApi<MailFull>(`/api/outlook/message/${selected}/${id}`);
      setDetail(msg);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    } catch {}
    setLoadingDetail(false);
  }, [selected]);

  const deleteAccount = useCallback(async (email: string) => {
    try {
      await fetchApi(`/api/outlook/accounts/${encodeURIComponent(email)}`, { method: "DELETE" });
      setAccounts((prev) => prev.filter((a) => a.email !== email));
      setAcctTotal((prev) => Math.max(0, prev - 1));
      if (selected === email) {
        setSelected(""); setMessages([]); setTotal(0); setDetail(null); setSelectedMsgId(null);
        esRef.current?.close();
      }
    } catch {}
  }, [selected]);

  /* ── table columns ────────────────────────────────────── */
  const columns = useMemo<ColumnDef<Account>[]>(() => [
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => {
        const a = row.original;
        const on = selected === a.email;
        return (
          <div className="flex items-center gap-1.5 min-w-0 w-full">
            {on && <span className="h-2 w-2 rounded-full bg-[#27a644] shrink-0" />}
            <span className="truncate text-[13px] min-w-0">{a.email}</span>
            <button
              className="ml-auto p-0.5 rounded text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
              onClick={(e) => { e.stopPropagation(); deleteAccount(a.email); }}
              title="Remove"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </button>
          </div>
        );
      },
    },
  ], [selected, deleteAccount]);

  /* ── render ───────────────────────────────────────────── */
  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] font-semibold text-foreground tracking-tight">
          Outlook Mail
          {selected && (
            <span className="ml-2 text-[13px] font-normal text-muted-foreground">
              — {displayName || selected}
            </span>
          )}
        </h1>
        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
          <span>{acctTotal || accounts.length} accounts</span>
          {selected && (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#27a644]" />
              connected
            </span>
          )}
          {unread > 0 && <span className="text-primary font-medium">{unread} unread</span>}
        </div>
      </div>

      {/* banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-[13px] text-primary"
          >
            <Bell className="h-3.5 w-3.5" />
            {banner}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-col grid */}
      <div
        ref={gridRef}
        className="grid overflow-hidden -mx-6 md:-mx-8 border-t border-border"
        style={{
          height: gridH,
          gridTemplateColumns: selected ? "260px 320px 1fr" : "260px 1fr",
        }}
      >
        {/* ── col 1: accounts DataTable ────────────────── */}
        <div className="flex flex-col" style={{ borderRight: "1px solid var(--border)" }}>
          <DataTable
            columns={columns}
            data={accounts}
            pageSize={pageSize}
            onRowClick={(a) => {
              navigator.clipboard.writeText(a.email.trim().replace(/[\r\n\s]+/g, ""));
              connect(a.email);
            }}
            activeRow={(a) => selected === a.email}
          />
        </div>

        {/* ── col 2: messages ──────────────────────────── */}
        {selected && (
          <div className="flex flex-col" style={{ borderRight: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5 shrink-0">
              <span className="text-[11px] text-muted-foreground/60 tabular-nums font-medium">
                Page {page + 1}/{totalPages}
                <span className="ml-1.5 text-muted-foreground/40">· {total} msgs</span>
                {connecting && <Loader2 className="inline h-3 w-3 animate-spin ml-1.5" />}
              </span>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon-xs" disabled={page === 0} onClick={() => loadPage(-1)}>
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon-xs" disabled={page >= totalPages - 1} onClick={() => loadPage(1)}>
                  <ChevronRight className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon-xs" onClick={refresh}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {messages.length > 0 ? messages.map((msg, i) => {
                const on = selectedMsgId === msg.id;
                const rd = msg.is_read;
                return (
                  <div
                    key={`${msg.id}-${i}`}
                    onClick={() => readMail(msg.id)}
                    className={`flex gap-2 px-3 py-2.5 cursor-pointer border-b border-border/30 transition-colors ${
                      on ? "bg-accent" : "hover:bg-accent/40"
                    }`}
                    style={{ borderLeft: `3px solid ${on ? "#5e6ad2" : "transparent"}` }}
                  >
                    <div className="w-3 pt-1 shrink-0 flex justify-center">
                      {!rd && <span className="block h-1.5 w-1.5 rounded-full bg-primary" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <span className={`text-[13px] truncate ${rd ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                          {msg.sender}
                        </span>
                        <span className="text-[11px] tabular-nums text-muted-foreground/40 shrink-0">
                          {msg.date}
                        </span>
                      </div>
                      <p className={`text-[13px] truncate mt-0.5 ${rd ? "text-muted-foreground/60" : "text-foreground"}`}>
                        {msg.subject}
                      </p>
                      <p className="text-[12px] text-muted-foreground/30 truncate mt-0.5">
                        {msg.preview}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center h-full opacity-25">
                  <Inbox className="h-8 w-8 mb-2" strokeWidth={1} />
                  <span className="text-[12px]">No messages</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── col 3: detail ────────────────────────────── */}
        {loadingDetail && !detail ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/20" />
          </div>
        ) : detail ? (
          <div className="flex flex-col overflow-hidden">
            <div className="shrink-0 border-b border-border px-5 py-4">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-foreground leading-snug mb-2">
                    {detail.subject}
                  </h2>
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {detail.sender?.[0]?.toUpperCase() ?? "?"}
                    </span>
                    <div className="min-w-0">
                      <span className="font-medium text-foreground">{detail.sender}</span>
                      <span className="text-muted-foreground/40 mx-1.5">·</span>
                      <span className="text-muted-foreground/60">{detail.sender_email}</span>
                    </div>
                    <span className="text-[12px] text-muted-foreground/40 ml-auto shrink-0">{detail.date}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="shrink-0"
                  onClick={() => { setDetail(null); setSelectedMsgId(null); }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div
                className="prose prose-sm max-w-none text-[14px] text-secondary-foreground [&_a]:text-primary dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: detail.body_html }}
              />
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
