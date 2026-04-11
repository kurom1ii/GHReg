"use client";

import { useState, useEffect } from "react";
import { Building, X, UserPlus, Loader2, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";

interface OrgMember { username: string; display_name: string }
interface OrgInfo { name: string; members: OrgMember[]; pending: string[] }

interface OrgPanelProps {
  orgs: OrgInfo[];
  sessionUsername: string;
  onInvite: (orgName: string, username: string) => Promise<void>;
  onRemoveMember: (orgName: string, username: string) => Promise<void>;
  onCancelPending: (orgName: string, invitee: string) => Promise<void>;
}

function parseInviteTargets(raw: string): string[] {
  return raw
    .split(/[\s,;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      const at = s.indexOf("@");
      if (at > 0 && s.includes(".")) return s.slice(0, at);
      if (s.startsWith("@")) return s.slice(1);
      return s;
    })
    .filter((s) => s.length > 0);
}

export function OrgPanel({ orgs, sessionUsername, onInvite, onRemoveMember, onCancelPending }: OrgPanelProps) {
  const [selectedOrg, setSelectedOrg] = useState(orgs[0]?.name ?? "");
  const [inviteInput, setInviteInput] = useState("");
  const [busySet, setBusySet] = useState<Set<string>>(new Set());
  const [inviting, setInviting] = useState(false);

  useEffect(() => { setSelectedOrg(orgs[0]?.name ?? ""); }, [orgs]);

  const currentOrg = orgs.find((o) => o.name === selectedOrg) ?? orgs[0];
  if (!currentOrg) return null;

  const addBusy = (k: string) => setBusySet((p) => new Set(p).add(k));
  const rmBusy = (k: string) => setBusySet((p) => { const n = new Set(p); n.delete(k); return n; });

  const handleRemove = async (username: string) => {
    addBusy(`rm:${username}`);
    try { await onRemoveMember(currentOrg.name, username); } finally { rmBusy(`rm:${username}`); }
  };
  const handleCancel = async (invitee: string) => {
    addBusy(`cn:${invitee}`);
    try { await onCancelPending(currentOrg.name, invitee); } finally { rmBusy(`cn:${invitee}`); }
  };
  const handleInvite = async () => {
    const targets = parseInviteTargets(inviteInput);
    if (!targets.length) return;
    setInviting(true);
    try { await Promise.allSettled(targets.map((t) => onInvite(currentOrg.name, t))); setInviteInput(""); }
    finally { setInviting(false); }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* header */}
      <div className="px-4 py-2.5 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Building className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[13px] font-semibold text-foreground">Organizations</span>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Session: @{sessionUsername}</p>
      </div>

      {/* org tabs or single */}
      {orgs.length > 1 ? (
        <Tabs value={selectedOrg} onValueChange={setSelectedOrg} className="flex flex-col flex-1 min-h-0 gap-0">
          <TabsList variant="line" className="px-3 border-b border-border w-full justify-start shrink-0">
            {orgs.map((o) => (
              <TabsTrigger key={o.name} value={o.name} className="text-[12px] px-2">
                {o.name}
                <Badge variant="secondary" className="ml-1 text-[9px] px-1 h-4">{o.members.length}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          {orgs.map((o) => (
            <TabsContent key={o.name} value={o.name} className="flex-1 flex flex-col min-h-0 mt-0">
              <OrgContent org={o} busySet={busySet} onRemove={handleRemove} onCancel={handleCancel} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <OrgContent org={currentOrg} busySet={busySet} onRemove={handleRemove} onCancel={handleCancel} />
        </div>
      )}

      {/* invite — pinned bottom */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-1.5">
          Invite
        </p>
        <div className="flex items-end gap-2">
          <textarea
            placeholder={"user1, user2@email.com\n@user3, user4..."}
            value={inviteInput}
            onChange={(e) => setInviteInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleInvite(); }
            }}
            rows={2}
            className="flex-1 text-[12px] bg-transparent border border-border rounded-sm px-2 py-1.5 resize-none focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/30"
          />
          <Button
            variant="outline"
            size="xs"
            onClick={handleInvite}
            disabled={!inviteInput.trim() || inviting}
            className="gap-1 shrink-0"
          >
            {inviting ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserPlus className="h-3 w-3" />}
            Send
          </Button>
        </div>
        {inviteInput && parseInviteTargets(inviteInput).length > 1 && (
          <p className="mt-1 text-[10px] text-muted-foreground/40">
            {parseInviteTargets(inviteInput).length} users: {parseInviteTargets(inviteInput).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Inner org content ──────────────────────────────────── */
function OrgContent({
  org, busySet, onRemove, onCancel,
}: {
  org: OrgInfo;
  busySet: Set<string>;
  onRemove: (u: string) => void;
  onCancel: (u: string) => void;
}) {
  return (
    <>
      {/* stats */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border text-[12px] text-muted-foreground shrink-0">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {org.members.length} members
        </span>
        {org.pending.length > 0 && (
          <span className="flex items-center gap-1 text-yellow-500">
            <Clock className="h-3 w-3" />
            {org.pending.length} pending
          </span>
        )}
      </div>

      {/* scrollable list area */}
      <ScrollArea className="flex-1 min-h-0">
        {/* members */}
        <div className="px-2 pt-2 pb-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-1 px-2">Members</p>
          {org.members.length === 0 ? (
            <p className="text-[12px] text-muted-foreground/30 py-2 px-2">No members</p>
          ) : (
            <Table>
              <TableBody>
                {org.members.map((m) => {
                  const busy = busySet.has(`rm:${m.username}`);
                  return (
                    <TableRow key={m.username} className="group hover:bg-accent/50 border-border/30">
                      <TableCell className="py-1.5 px-2">
                        <div className="min-w-0">
                          <p className="text-[13px] text-foreground truncate">{m.display_name}</p>
                          {m.display_name !== m.username && (
                            <p className="text-[11px] text-muted-foreground/50 truncate">@{m.username}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5 px-1 w-8">
                        <Button variant="ghost" size="icon-xs" onClick={() => onRemove(m.username)} disabled={busy}
                          className="text-muted-foreground/30 hover:text-destructive transition-colors">
                          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* pending invitations */}
        {org.pending.length > 0 && (
          <>
            <Separator className="mx-4 my-1" />
            <div className="px-2 pt-1 pb-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-1 px-2">
                Pending Invitations
              </p>
              <Table>
                <TableBody>
                  {org.pending.map((invitee) => {
                    const busy = busySet.has(`cn:${invitee}`);
                    return (
                      <TableRow key={invitee} className="group hover:bg-accent/50 border-border/30">
                        <TableCell className="py-1.5 px-2">
                          <span className="flex items-center gap-1.5 text-[12px] text-yellow-500 truncate">
                            <Clock className="h-3 w-3 shrink-0" />
                            @{invitee}
                          </span>
                        </TableCell>
                        <TableCell className="py-1.5 px-1 w-8">
                          <Button variant="ghost" size="icon-xs" onClick={() => onCancel(invitee)} disabled={busy}
                            className="text-muted-foreground/30 hover:text-destructive transition-colors">
                            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </ScrollArea>
    </>
  );
}
