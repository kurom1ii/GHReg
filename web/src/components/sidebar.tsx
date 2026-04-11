"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, GitBranch, Sun, Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Outlook Mail", href: "/", icon: Mail },
  { label: "GitHub Accounts", href: "/github", icon: GitBranch },
];

export function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved as "dark" | "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <aside
      className="fixed left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-sidebar-border bg-sidebar"
      style={{ borderRightColor: "var(--sidebar-border)" }}
    >
      {/* Brand mark */}
      <div
        className="flex h-11 shrink-0 items-center gap-2.5 px-4"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        {/* Linear-style diamond logomark */}
        <div className="flex h-5 w-5 shrink-0 items-center justify-center bg-primary">
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 0L9 4.5L4.5 9L0 4.5L4.5 0Z"
              fill="white"
            />
          </svg>
        </div>
        <span
          className="text-[13px] tracking-tight text-sidebar-foreground"
          style={{ fontWeight: 590 }}
        >
          GHReg
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-px px-2 pt-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "relative flex items-center gap-2.5 px-2.5 py-[7px]",
                "text-[13px] transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              ].join(" ")}
              style={{ fontWeight: active ? 500 : 400 }}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-primary" />
              )}
              <item.icon
                className={[
                  "h-[14px] w-[14px] shrink-0",
                  active ? "text-primary" : "text-muted-foreground",
                ].join(" ")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <Separator />

      {/* Footer row */}
      <div className="flex items-center justify-between px-3 py-3">
        <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 400 }}>
          v1.0
        </span>
        <button
          onClick={toggleTheme}
          className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="h-3.5 w-3.5" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
}
