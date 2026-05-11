"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  Users,
  Bot,
  GitPullRequest,
  HardDrive,
  UsersRound,
  Radio,
  Settings,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/lib/store";

const PRODUCT_NAV = [
  { href: "/", label: "Inbox", icon: Inbox },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/agents", label: "Agents", icon: Bot, isAgents: true },
  { href: "/changes", label: "Changes", icon: GitPullRequest },
  { href: "/drive", label: "Drive", icon: HardDrive },
  { href: "/team", label: "Team", icon: UsersRound },
  { href: "/channels", label: "Channels", icon: Radio },
  { href: "/settings", label: "Settings", icon: Settings },
];

const AGENT_SUBNAV = [
  { href: "/hr", label: "Hiring", hint: "Shortlists candidates" },
  { href: "/engagement", label: "Sales & Customers", hint: "Drafts emails and chases renewals" },
  { href: "/operations", label: "Operations", hint: "Chases jobs and fills forms" },
  { href: "/knowledge", label: "Internal Q&A", hint: "Answers from your SOPs" },
];

const AGENT_ROUTES = AGENT_SUBNAV.map((a) => a.href);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activityExtra = useDemoStore((s) => s.extraActivityCount);
  const onAgentRoute = AGENT_ROUTES.some((r) => pathname?.startsWith(r));

  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Voltade</div>
            <div className="text-[11px] text-muted-foreground">AI for Your Business</div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {PRODUCT_NAV.map((item) => {
            const Icon = item.icon;
            const active = item.isAgents
              ? onAgentRoute
              : item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
            const isAgentParent = item.isAgents;
            return (
              <div key={item.href}>
                {isAgentParent ? (
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/80"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                )}

                {isAgentParent ? (
                  <div className="ml-3 mt-0.5 mb-1 space-y-0.5 border-l pl-3">
                    {AGENT_SUBNAV.map((sub) => {
                      const subActive = pathname?.startsWith(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "group flex flex-col gap-0 rounded-md px-2.5 py-1.5 text-[12.5px] transition-colors",
                            subActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                          )}
                        >
                          <span>{sub.label}</span>
                          <span className={cn("text-[10px]", subActive ? "text-primary/70" : "text-muted-foreground/70")}>
                            {sub.hint}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="rounded-lg border bg-card p-3 text-xs">
            <div className="mb-1 flex items-center gap-1.5 font-medium text-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              AI Assistant
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Operates alongside your existing systems. Drafts, sends, and follows up — but never finalises financial decisions without your approval.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Demo</span>
            <span className="text-sm font-medium">Voltade · AI for Your Business</span>
            <Badge variant="secondary" className="rounded-full text-[10px]">
              Four AI Agents
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--good)] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--good)]" />
              </span>
              <span className="font-medium">AI Active</span>
              <span className="tabular-nums text-muted-foreground">{12 + activityExtra} actions today</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">YOU</AvatarFallback>
              </Avatar>
              <div className="hidden text-right leading-tight md:block">
                <div className="text-xs font-medium">Demo Presenter</div>
                <div className="text-[10px] text-muted-foreground">voltade.com</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[oklch(0.985_0.005_248)]/40">
          {children}
        </main>
      </div>
    </div>
  );
}
