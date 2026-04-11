import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardTabs } from "@/components/dashboard-tabs";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold tracking-tight">CF Email Routing</h1>
            <span className="text-xs text-muted-foreground font-mono">{process.env.CF_DOMAIN}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-7xl w-full px-6 py-4 flex-1">
        <DashboardTabs />
      </div>
    </main>
  );
}
