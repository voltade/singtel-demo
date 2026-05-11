"use client";

import Link from "next/link";
import {
  Megaphone,
  Wrench,
  UserPlus,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiTile } from "@/components/kpi-tile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AREA_LABEL, baseActivity, customerLabel } from "@/lib/mock-data";
import { useDemoStore } from "@/lib/store";

const THEMES = [
  {
    href: "/hr",
    icon: UserPlus,
    label: "Hiring, Streamlined",
    summary: "AI reads every CV, scores it, and writes the rejection notes — so your HR team only reviews candidates worth their time.",
    valueLever: "Time Saved",
    metric: "8 CVs reviewed · 4 shortlisted · 2 rejected",
    color: "from-[color:var(--good-bg)] to-transparent",
  },
  {
    href: "/engagement",
    icon: Megaphone,
    label: "Customer Retention & Revenue Growth",
    summary: "Festive emails, renewal reminders, and draft quotes — all in your tone, all with you in control.",
    valueLever: "Revenue Growth",
    metric: "6 renewals in flight · S$99K of business at stake",
    color: "from-[color:var(--info-bg)] to-transparent",
  },
  {
    href: "/operations",
    icon: Wrench,
    label: "Operations Without the Chasing",
    summary: "AI follows up on stalled jobs and pre-fills repetitive paperwork — so your team focuses on the work that matters.",
    valueLever: "Time Saved",
    metric: "6 jobs in progress · 4 forms pre-filled by AI",
    color: "from-[color:var(--warn-bg)] to-transparent",
  },
  {
    href: "/knowledge",
    icon: BookOpen,
    label: "AI Knowledge Assistant",
    summary: "One assistant trained on your manuals — talks to customers and supports your team. Every answer is cited from your own documents.",
    valueLever: "Risk Reduction",
    metric: "42 customer chats · 4 team questions · all logged",
    color: "from-[color:var(--good-bg)] to-transparent",
  },
];

export default function DashboardPage() {
  const activityExtra = useDemoStore((s) => s.extraActivityCount);
  const approvedQuotes = useDemoStore((s) => s.approvedQuoteIds.length);

  const kpis = [
    {
      label: "AI Actions Today",
      value: `${12 + activityExtra}`,
      sub: "Drafted, sent, followed up, flagged",
      tone: "info" as const,
    },
    {
      label: "Awaiting Your Action",
      value: `${Math.max(0, 3 - approvedQuotes)}`,
      sub: approvedQuotes >= 3 ? "All caught up" : "Quotes and escalations",
      tone: (approvedQuotes >= 3 ? "good" : "warn") as "good" | "warn",
    },
    {
      label: "Hours Saved This Week",
      value: "47",
      sub: "Across all four AI agents",
      tone: "good" as const,
    },
    {
      label: "Customers Assisted Today",
      value: "46",
      sub: "Across all channels",
      tone: "good" as const,
    },
  ];

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Monday, 12 May 2026"
        title="Good Morning"
        subtitle="Your AI assistant has been active across the business this morning. Below is what has been completed, and what requires your attention."
      />

      <div className="grid grid-cols-1 gap-3 px-8 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiTile key={k.label} {...k} />
        ))}
      </div>

      <div className="mt-8 px-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold">Four AI Agents · One Platform</h2>
            <p className="text-xs text-muted-foreground">
              Each agent integrates with your existing tools — email, CRM, HR system, and customer records. No replacement required.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full text-[10px]">
            Targeted Agents · Measurable Impact
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {THEMES.map((t) => {
            const Icon = t.icon;
            return (
              <Link href={t.href} key={t.href} className="group">
                <Card className={cn("relative overflow-hidden p-5 transition-shadow hover:shadow-md")}>
                  <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", t.color)} />
                  <div className="relative flex items-start justify-between">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="rounded-full text-[10px]">
                      {t.valueLever}
                    </Badge>
                  </div>
                  <div className="relative mt-3">
                    <div className="text-sm font-semibold leading-tight">{t.label}</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.summary}</p>
                  </div>
                  <div className="relative mt-3 flex items-center justify-between text-[11px]">
                    <span className="tabular-nums text-muted-foreground">{t.metric}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 px-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-base font-semibold">AI Activity Today</h2>
              <p className="text-xs text-muted-foreground">Plain-English log. Every action is recorded.</p>
            </div>
            <Badge variant="outline" className="rounded-full text-[10px]">
              Since 7:00 AM
            </Badge>
          </div>
          <Card className="divide-y overflow-hidden p-0">
            {baseActivity.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {entry.time}
                    </span>
                    <Badge variant="outline" className="rounded-full text-[10px]">
                      {AREA_LABEL[entry.area]}
                    </Badge>
                    {entry.customerId ? (
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        {customerLabel(entry.customerId)}
                      </Badge>
                    ) : null}
                    {entry.awaiting ? (
                      <Badge className="rounded-full bg-[color:var(--warn-bg)] text-[10px] text-[color:var(--warn)] border-[color:var(--warn)]/30">
                        Action Required
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm">{entry.text}</p>
                </div>
              </div>
            ))}
          </Card>
        </section>

        <aside>
          <div className="mb-3">
            <h2 className="text-base font-semibold">Key Principles</h2>
            <p className="text-xs text-muted-foreground">Three points to remember.</p>
          </div>
          <div className="space-y-3">
            <Card className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Integrates with Existing Systems
              </div>
              <p className="mt-1.5 text-sm leading-relaxed">
                No replacement of your CRM, HR, or accounting tools. The AI connects, reads, and writes back.
              </p>
            </Card>
            <Card className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                AI Drafts. You Approve.
              </div>
              <p className="mt-1.5 text-sm leading-relaxed">
                Any action that involves money or a customer routes to you for approval. The AI does the work; you retain control.
              </p>
            </Card>
            <Card className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Cross-Domain Intelligence
              </div>
              <p className="mt-1.5 text-sm leading-relaxed">
                Hiring data informs operations. Operations data surfaces savings. Savings data feeds sales. The value compounds.
              </p>
            </Card>
            <Link href="/hr" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              Start Demo · Hiring <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
