"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Email {
  id: string;
  subject: string;
  from: string;
  fromName: string;
  date: string;
  snippet: string;
  isRead: boolean;
  hasAttachments: boolean;
}

interface EmailDetail extends Email {
  to: string;
  body: string;
}

export interface EmailInboxHandle {
  refresh: () => void;
}

export const EmailInbox = forwardRef<EmailInboxHandle>(function EmailInbox(_props, ref) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<EmailDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [purging, setPurging] = useState(false);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/emails");
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setEmails(data.emails);
      setAccount(data.account);
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({ refresh: fetchEmails }), [fetchEmails]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  async function openEmail(id: string) {
    if (selectedId === id) { setSelectedId(null); setDetail(null); return; }
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/emails/detail?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDetail(data.email);
    } catch (e) {
      toast.error(String(e));
      setSelectedId(null);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handlePurge() {
    if (!confirm(`Delete all emails in inbox?`)) return;
    setPurging(true);
    try {
      const res = await fetch("/api/emails/purge", { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(`Deleted ${data.deleted} emails${data.failed ? `, ${data.failed} failed` : ""}`);
      setSelectedId(null);
      setDetail(null);
      fetchEmails();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setPurging(false);
    }
  }

  function formatDate(raw: string) {
    if (!raw) return "";
    const d = new Date(raw);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono text-muted-foreground">{account}</span>
        <div className="flex-1 text-xs text-muted-foreground text-right">
          {loading ? "Loading..." : `${emails.length} emails`}
        </div>
        <Button variant="ghost" size="icon" className="size-8" onClick={fetchEmails} disabled={loading || purging}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? "animate-spin" : ""}>
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
          </svg>
        </Button>
        {emails.length > 0 && (
          <Button variant="ghost" size="icon" className="size-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={handlePurge} disabled={purging || loading} title="Delete all emails">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </Button>
        )}
      </div>

      {/* Email list */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold w-48">From</TableHead>
              <TableHead className="font-semibold">Subject</TableHead>
              <TableHead className="font-semibold w-28 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : emails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">No emails</TableCell>
              </TableRow>
            ) : (
              emails.map((email) => (
                <TableRow
                  key={email.id}
                  className={`cursor-pointer transition-colors ${selectedId === email.id ? "bg-primary/10" : ""} ${!email.isRead ? "font-semibold" : ""}`}
                  onClick={() => openEmail(email.id)}
                >
                  <TableCell className="text-sm truncate max-w-48">
                    <div className="flex items-center gap-2">
                      {!email.isRead && <span className="size-2 rounded-full bg-blue-500 shrink-0" />}
                      <span className="truncate">{email.fromName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{email.subject}</span>
                      {email.hasAttachments && <Badge variant="secondary" className="text-[10px] shrink-0">Attach</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground text-right whitespace-nowrap">
                    {formatDate(email.date)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Email detail */}
      {selectedId && (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          {detailLoading ? (
            <div className="p-6 text-center text-muted-foreground">Loading email...</div>
          ) : detail ? (
            <div className="divide-y divide-border/50">
              <div className="p-4 space-y-1 bg-muted/20">
                <h3 className="font-semibold text-base">{detail.subject}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{detail.fromName} <span className="font-mono">&lt;{detail.from}&gt;</span></span>
                  <span>{formatDate(detail.date)}</span>
                </div>
                {detail.to && <div className="text-xs text-muted-foreground">To: {detail.to}</div>}
              </div>
              <div
                className="p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto max-h-[500px] [&_img]:max-w-full [&_a]:text-blue-400"
                dangerouslySetInnerHTML={{ __html: detail.body }}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
});
