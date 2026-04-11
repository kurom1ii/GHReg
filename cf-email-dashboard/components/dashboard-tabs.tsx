"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RulesTable } from "@/components/rules-table";
import { DestinationsPanel } from "@/components/destinations-panel";
import { EmailInbox } from "@/components/email-inbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardTabs() {
  const [newMailCount, setNewMailCount] = useState(0);
  const [activeTab, setActiveTab] = useState("rules");
  const inboxRef = useRef<{ refresh: () => void }>(null);

  // SSE connection
  useEffect(() => {
    const es = new EventSource("/api/emails/stream");

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_mail") {
          if (activeTab === "inbox") {
            // Auto refresh if viewing inbox
            inboxRef.current?.refresh();
          } else {
            setNewMailCount((prev) => prev + (data.newCount || 1));
          }
        }
      } catch { /* ignore parse errors */ }
    };

    es.onerror = () => {
      // EventSource auto-reconnects
    };

    return () => es.close();
  }, [activeTab]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    if (value === "inbox") {
      setNewMailCount(0);
      inboxRef.current?.refresh();
    }
  }, []);

  return (
    <Tabs defaultValue="rules" onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="rules">Rules</TabsTrigger>
        <TabsTrigger value="destinations">Destinations</TabsTrigger>
        <TabsTrigger value="inbox" className="relative">
          Inbox
          {newMailCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
              {newMailCount > 99 ? "99+" : newMailCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="rules" className="mt-4">
        <RulesTable />
      </TabsContent>
      <TabsContent value="destinations" className="mt-4">
        <DestinationsPanel />
      </TabsContent>
      <TabsContent value="inbox" className="mt-4">
        <EmailInbox ref={inboxRef} />
      </TabsContent>
    </Tabs>
  );
}
