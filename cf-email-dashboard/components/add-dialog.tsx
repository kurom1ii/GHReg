"use client";

import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_CF_DOMAIN ?? "spxlua.com";

interface Dest {
  id: string;
  email: string;
  verified: string | null;
}

export function AddDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [count, setCount] = useState("");
  const [start, setStart] = useState("1");
  const [subdomain, setSubdomain] = useState("");
  const [destination, setDestination] = useState("");
  const [destinations, setDestinations] = useState<Dest[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch destinations when dialog opens
  useEffect(() => {
    if (!open) return;
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((d) => {
        const verified = (d.destinations ?? []).filter((x: Dest) => x.verified);
        setDestinations(verified);
        if (verified.length > 0 && !destination) {
          setDestination(verified[0].email);
        }
      })
      .catch(() => {});
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const countNum = parseInt(count) || 0;
  const startNum = parseInt(start) || 1;
  const domain = subdomain ? `${subdomain}.${BASE_DOMAIN}` : BASE_DOMAIN;

  const preview =
    prefix && countNum > 0
      ? Array.from({ length: Math.min(countNum, 3) }, (_, i) => `${prefix}${startNum + i}@${domain}`)
          .join(", ") + (countNum > 3 ? ` ... ${prefix}${startNum + countNum - 1}@${domain}` : "")
      : "";

  async function handleCreate() {
    if (!prefix || countNum <= 0 || !destination) return;
    setLoading(true);
    try {
      const res = await fetch("/api/rules/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefix, count: countNum, start: startNum, domain, destination }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      const ok = data.results.filter((r: { ok: boolean }) => r.ok).length;
      toast.success(`Created ${ok}/${countNum} rules`);
      setOpen(false);
      setPrefix(""); setCount(""); setStart("1"); setSubdomain("");
      onDone();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button size="sm" className="h-8 text-xs gap-1.5" />}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Rules
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Email Routing Rules</DialogTitle>
          <DialogDescription>Create batch forwarding rules</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Prefix</Label>
              <Input placeholder="melody" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Subdomain (optional)</Label>
              <Input placeholder="us, uk, worker..." value={subdomain} onChange={(e) => setSubdomain(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Count</Label>
              <Input type="number" min={1} placeholder="10" value={count} onChange={(e) => setCount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Start from</Label>
              <Input type="number" min={0} placeholder="1" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Destination</Label>
            {destinations.length > 0 ? (
              <Select value={destination} onValueChange={(v) => setDestination(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((d) => (
                    <SelectItem key={d.id} value={d.email}>{d.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-xs text-muted-foreground py-1">No verified destinations. Add one in the Destinations tab.</p>
            )}
          </div>
          {preview && (
            <div className="rounded-lg bg-muted/50 p-2.5 text-xs font-mono text-emerald-500 break-all">
              {preview}
              {destination && <span className="text-muted-foreground"> → {destination}</span>}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button size="sm" onClick={handleCreate} disabled={loading || !prefix || countNum <= 0 || !destination}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
