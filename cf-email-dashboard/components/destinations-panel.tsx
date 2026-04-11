"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Destination {
  id: string;
  email: string;
  verified: string | null;
  created: string;
}

export function DestinationsPanel() {
  const [dests, setDests] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/destinations");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDests(data.destinations);
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDests(); }, [fetchDests]);

  async function handleAdd() {
    if (!newEmail) return;
    setAdding(true);
    try {
      const res = await fetch("/api/destinations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(data.message);
        setNewEmail("");
        fetchDests();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(String(e));
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch("/api/destinations/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(data.message);
        fetchDests();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(String(e));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Add form */}
      <div className="flex gap-2">
        <Input
          placeholder="Add destination email..."
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="max-w-sm"
        />
        <Button onClick={handleAdd} disabled={adding || !newEmail} size="sm">
          {adding ? "Adding..." : "Add"}
        </Button>
        <Button variant="ghost" size="icon" className="size-8 ml-auto" onClick={fetchDests} disabled={loading}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? "animate-spin" : ""}>
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
          </svg>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold w-28">Status</TableHead>
              <TableHead className="font-semibold w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : dests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No destination addresses
                </TableCell>
              </TableRow>
            ) : (
              dests.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-sm">{d.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={d.verified ? "default" : "secondary"}
                      className={
                        d.verified
                          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/25"
                          : "bg-amber-500/15 text-amber-500 border-amber-500/25"
                      }
                    >
                      {d.verified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(d.id)}
                      disabled={deletingId === d.id}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        New destinations require email verification. Check inbox for the verification link.
      </p>
    </div>
  );
}
