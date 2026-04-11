"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AddDialog } from "./add-dialog";
import { DeleteConfirm } from "./delete-confirm";

interface EmailRule {
  id: string;
  name: string;
  enabled: boolean;
  from: string;
  to: string;
}

type ViewMode = "table" | "grid";

const PAGE_SIZE = 50;

export function RulesTable() {
  const [rules, setRules] = useState<EmailRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [domainFilter, setDomainFilter] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rules");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRules(data.rules);
      setSelected(new Set());
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRules(); }, [fetchRules]);

  const domains = useMemo(() => {
    const set = new Set<string>();
    for (const r of rules) {
      const at = r.from.indexOf("@");
      if (at > 0) set.add(r.from.slice(at + 1));
    }
    return [...set].sort();
  }, [rules]);

  const natSort = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

  const filtered = useMemo(() => {
    let list = rules;
    if (domainFilter !== "all") {
      list = list.filter((r) => r.from.endsWith(`@${domainFilter}`));
    }
    return [...list].sort((a, b) =>
      sortAsc ? natSort(a.from, b.from) : natSort(b.from, a.from)
    );
  }, [rules, domainFilter, sortAsc]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Grid view: group by subdomain
  const gridData = useMemo(() => {
    const map = new Map<string, EmailRule[]>();
    for (const r of filtered) {
      const at = r.from.indexOf("@");
      const domain = at > 0 ? r.from.slice(at + 1) : "unknown";
      if (!map.has(domain)) map.set(domain, []);
      map.get(domain)!.push(r);
    }
    // Sort emails within each domain
    for (const [, list] of map) {
      list.sort((a, b) => natSort(a.from, b.from));
    }
    return map;
  }, [filtered]);

  const allSelected = paged.length > 0 && paged.every((r) => selected.has(r.id));

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(paged.map((r) => r.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function handleDelete() {
    setConfirmOpen(false);
    setDeleting(true);
    try {
      const res = await fetch("/api/rules/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const ok = data.results.filter((r: { ok: boolean }) => r.ok).length;
      toast.success(`Deleted ${ok}/${selected.size} rules`);
      fetchRules();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setDeleting(false);
    }
  }

  // Reset page when filter changes
  useEffect(() => { setPage(0); }, [domainFilter, sortAsc]);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={domainFilter} onValueChange={(v) => setDomainFilter(v ?? "all")}>
          <SelectTrigger className="w-48 h-8 text-xs">
            <SelectValue placeholder="All domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All domains</SelectItem>
            {domains.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => setSortAsc(!sortAsc)}>
          {sortAsc ? "A→Z" : "Z→A"}
        </Button>

        {/* View toggle */}
        <div className="flex border border-border/50 rounded-md overflow-hidden">
          <button
            className={`px-2 py-1 text-xs ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}
            onClick={() => setViewMode("table")}
          >
            Table
          </button>
          <button
            className={`px-2 py-1 text-xs ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
        </div>

        <div className="flex-1 text-xs text-muted-foreground text-right">
          {loading ? "Loading..." : `${filtered.length} rules${domainFilter !== "all" ? ` (${rules.length} total)` : ""}${selected.size > 0 ? ` · ${selected.size} selected` : ""}`}
        </div>

        <Button variant="ghost" size="icon" className="size-8" onClick={fetchRules} disabled={loading}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? "animate-spin" : ""}>
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
          </svg>
        </Button>
        {selected.size > 0 && (
          <Button variant="destructive" size="sm" className="h-8 text-xs gap-1" onClick={() => setConfirmOpen(true)} disabled={deleting}>
            Delete ({selected.size})
          </Button>
        )}
        <AddDialog onDone={fetchRules} />
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                  </TableHead>
                  <TableHead className="font-semibold">From</TableHead>
                  <TableHead className="font-semibold">Forwarding To</TableHead>
                  <TableHead className="font-semibold w-20">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      {rules.length === 0 ? "No rules found" : "No rules match filter"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((rule) => (
                    <TableRow key={rule.id} className={`cursor-pointer ${selected.has(rule.id) ? "bg-primary/5" : ""}`} onClick={() => { navigator.clipboard.writeText(rule.from); toast.success(`Copied ${rule.from}`); }}>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selected.has(rule.id)} onCheckedChange={() => toggleOne(rule.id)} />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{rule.from}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{rule.to}</TableCell>
                      <TableCell>
                        <Badge
                          variant={rule.enabled ? "default" : "secondary"}
                          className={rule.enabled ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/25" : ""}
                        >
                          {rule.enabled ? "Active" : "Off"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={page === i ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 text-xs p-0"
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-8 text-xs" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Grid View — Excel-style: each subdomain = 1 column, emails listed vertically */}
      {viewMode === "grid" && (
        <div className="rounded-xl border border-border/50 overflow-auto">
          {loading ? (
            <div className="h-24 flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : gridData.size === 0 ? (
            <div className="h-24 flex items-center justify-center text-muted-foreground">No rules found</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {[...gridData.entries()].map(([domain, domainRules]) => (
                    <th key={domain} className="bg-muted/30 px-4 py-2.5 text-left border-r border-border/30 last:border-r-0 sticky top-0">
                      <div className="font-mono text-sm font-semibold">{domain}</div>
                      <div className="text-[10px] text-muted-foreground font-normal">{domainRules.length} rules</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.max(...[...gridData.values()].map(v => v.length)) }, (_, rowIdx) => (
                  <tr key={rowIdx}>
                    {[...gridData.entries()].map(([domain, domainRules]) => {
                      const rule = domainRules[rowIdx];
                      if (!rule) return <td key={domain} className="border-r border-border/30 last:border-r-0" />;
                      const local = rule.from.split("@")[0];
                      return (
                        <td
                          key={domain}
                          className={`px-3 py-1.5 border-r border-border/30 last:border-r-0 border-b border-border/10 cursor-pointer hover:bg-muted/30 ${selected.has(rule.id) ? "bg-primary/10" : ""}`}
                          onClick={() => {
                            navigator.clipboard.writeText(rule.from);
                            toast.success(`Copied ${rule.from}`);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selected.has(rule.id)}
                              onCheckedChange={() => toggleOne(rule.id)}
                              className="shrink-0 size-3.5"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="font-mono text-sm truncate">{local}</span>
                            {!rule.enabled && (
                              <span className="size-1.5 rounded-full bg-muted-foreground/40 shrink-0" title="Disabled" />
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <DeleteConfirm count={selected.size} open={confirmOpen} onConfirm={handleDelete} onCancel={() => setConfirmOpen(false)} />
    </div>
  );
}
