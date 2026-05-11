"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Send,
  CheckCircle2,
  PartyPopper,
  Bot,
  User,
  Users,
  AlertTriangle,
  ChevronRight,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiTile } from "@/components/kpi-tile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DealSheet } from "@/components/deal-sheet";
import { ChaseChip } from "@/components/chase";
import {
  campaigns,
  campaignEvents,
  contracts,
  customerLabel,
  quotes,
  DEAL_STAGE_ORDER,
  DEAL_STAGE_LABEL,
  EVENT_CATEGORY_META,
  OWNER_META,
  type ActionOwner,
  type DealStage,
  type RenewalStage,
} from "@/lib/mock-data";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STAGE_META: Record<RenewalStage, { label: string; sub: string; bg: string; text: string; ring: string; emoji: string }> = {
  urgent: { label: "Act This Week", sub: "Customer has not replied", emoji: "🔴", bg: "bg-destructive/5", text: "text-destructive", ring: "ring-destructive/40" },
  soon: { label: "Coming Up Soon", sub: "Within the next 30 days", emoji: "🟠", bg: "bg-[color:var(--warn-bg)]", text: "text-[color:var(--warn)]", ring: "ring-[color:var(--warn)]/40" },
  warming: { label: "On the Radar", sub: "One to two months out", emoji: "🟡", bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-300/50" },
  quiet: { label: "All Quiet", sub: "AI is checking in", emoji: "🟢", bg: "bg-[color:var(--good-bg)]", text: "text-[color:var(--good)]", ring: "ring-[color:var(--good)]/30" },
};

const STAGE_ORDER: RenewalStage[] = ["urgent", "soon", "warming", "quiet"];

const OWNER_ICON: Record<ActionOwner, typeof Bot> = {
  ai: Bot,
  you: User,
  customer: Users,
  manager: Users,
};

function OwnerBadge({ owner, withSub = false }: { owner: ActionOwner; withSub?: boolean }) {
  const meta = OWNER_META[owner];
  const Icon = OWNER_ICON[owner];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]",
        meta.tone === "warn" && "border-[color:var(--warn)]/40 bg-[color:var(--warn-bg)] text-[color:var(--warn)]",
        meta.tone === "info" && "border-[color:var(--info)]/40 bg-[color:var(--info-bg)] text-[color:var(--info)]",
        meta.tone === "good" && "border-[color:var(--good)]/40 bg-[color:var(--good-bg)] text-[color:var(--good)]",
        meta.tone === "neutral" && "border-muted-foreground/30 bg-muted/40 text-muted-foreground"
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="font-medium">{meta.label}</span>
      {withSub ? <span className="opacity-70">· {meta.sub}</span> : null}
    </div>
  );
}

function PipelineBar({ stage }: { stage: DealStage }) {
  const currentIdx = DEAL_STAGE_ORDER.indexOf(stage);
  return (
    <div className="flex items-center gap-1">
      {DEAL_STAGE_ORDER.map((s, i) => {
        const past = i < currentIdx;
        const current = i === currentIdx;
        return (
          <div key={s} className="flex items-center gap-1">
            <div
              className={cn(
                "rounded-full transition-all",
                current ? "h-2.5 w-2.5 bg-primary ring-2 ring-primary/20" : past ? "h-1.5 w-1.5 bg-primary" : "h-1.5 w-1.5 bg-muted-foreground/30"
              )}
              title={DEAL_STAGE_LABEL[s]}
            />
            {i < DEAL_STAGE_ORDER.length - 1 ? (
              <div className={cn("h-px w-5", past ? "bg-primary" : "bg-muted-foreground/20")} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function EngagementPage() {
  const approvedQuoteIds = useDemoStore((s) => s.approvedQuoteIds);
  const approveQuote = useDemoStore((s) => s.approveQuote);
  const campaignSentIds = useDemoStore((s) => s.campaignSentIds);
  const sendCampaign = useDemoStore((s) => s.sendCampaign);

  // CRM state
  const [openDealId, setOpenDealId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "needs-you" | "ai-handling" | "escalated">("all");

  const filtered = useMemo(() => {
    if (filter === "needs-you") return contracts.filter((c) => c.aiNeedsYou);
    if (filter === "ai-handling") return contracts.filter((c) => !c.aiNeedsYou);
    if (filter === "escalated") return contracts.filter((c) => c.escalation);
    return contracts;
  }, [filter]);

  const [selectedEventId, setSelectedEventId] = useState(campaignEvents[0].id);
  const selectedEvent = campaignEvents.find((e) => e.id === selectedEventId) ?? campaignEvents[0];
  const [draft, setDraft] = useState(selectedEvent.draft);

  const pickEvent = (id: string) => {
    const evt = campaignEvents.find((e) => e.id === id);
    if (!evt) return;
    setSelectedEventId(id);
    setDraft(evt.draft);
  };

  const totalAtStake = contracts.reduce((sum, c) => sum + c.annualValueSgd, 0);
  const needsYouCount = contracts.filter((c) => c.aiNeedsYou).length;
  const escalatedCount = contracts.filter((c) => c.escalation).length + quotes.filter((q) => q.escalation).length;
  const chasersThisWeek = contracts.reduce((sum, c) => sum + c.chaseHistory.length, 0);

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Sales Agent · Revenue Growth"
        title="Renewals, Chasers & Deal Flow"
        subtitle="The AI sales agent chases every renewal across email, WhatsApp, and SMS — with the right tone at the right time. You see every action, and the AI escalates to a human the moment intervention is needed."
        right={<Badge className="rounded-full">S${(totalAtStake / 1000).toFixed(0)}K of Renewals in Flight</Badge>}
      />

      <div className="grid grid-cols-1 gap-3 px-8 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Live Renewals" value={`${contracts.length}`} sub="Tracked end-to-end" tone="info" />
        <KpiTile label="Chasers Sent This Week" value={`${chasersThisWeek}`} sub="Email · WhatsApp · SMS · Phone" tone="info" />
        <KpiTile label="Action Required" value={`${needsYouCount}`} sub="Sales rep or spa manager" tone="warn" />
        <KpiTile label="Escalated to Human" value={`${escalatedCount}`} sub="AI reached a guardrail" tone="warn" />
      </div>

      <div className="mt-6 px-8">
        <Tabs defaultValue="deals" className="w-full">
          <TabsList>
            <TabsTrigger value="deals">Renewals & Chasers</TabsTrigger>
            <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
          </TabsList>

          {/* DEALS PIPELINE · CRM-style — simplified */}
          <TabsContent value="deals" className="mt-4">
            {/* Filter pill row */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: "all", label: "All Renewals", count: contracts.length },
                    { id: "needs-you", label: "Action Required", count: contracts.filter((c) => c.aiNeedsYou).length },
                    { id: "ai-handling", label: "AI Handling", count: contracts.filter((c) => !c.aiNeedsYou).length },
                    { id: "escalated", label: "Escalated", count: contracts.filter((c) => c.escalation).length },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                      filter === f.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted/60"
                    )}
                  >
                    {f.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-mono tabular-nums",
                        filter === f.id ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-muted-foreground">Click any row to view the full chase timeline.</div>
            </div>

            {/* CRM table — slim 6 columns */}
            <Card className="overflow-hidden p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer & Renewal</TableHead>
                    <TableHead className="text-right">Annual Value</TableHead>
                    <TableHead>Pipeline Stage</TableHead>
                    <TableHead>Next Action · Owner</TableHead>
                    <TableHead className="text-right">Urgency</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const urgency = STAGE_META[c.stage];
                    return (
                      <TableRow
                        key={c.id}
                        className="cursor-pointer"
                        onClick={() => setOpenDealId(c.id)}
                      >
                        <TableCell>
                          <div className="font-medium text-sm">{customerLabel(c.customerId)}</div>
                          <div className="text-[11px] text-muted-foreground">{c.product} · ends {c.endsOn}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-semibold tabular-nums text-sm">S${c.annualValueSgd.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground">per year</div>
                        </TableCell>
                        <TableCell>
                          <PipelineBar stage={c.pipelineStage} />
                          <div className="mt-1 text-[11px]">
                            <span className="font-medium">{DEAL_STAGE_LABEL[c.pipelineStage]}</span>
                            <span className="text-muted-foreground"> · day {c.daysInStage}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <OwnerBadge owner={c.nextActionOwner} />
                          {c.escalation ? (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-destructive">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              <span className="line-clamp-1">Escalated · {c.escalation.to}</span>
                            </div>
                          ) : (
                            <div className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                              {c.nextActionDetail}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ring-1",
                              urgency.bg,
                              urgency.text,
                              urgency.ring
                            )}
                          >
                            <span>{urgency.emoji}</span>
                            <span className="hidden md:inline">{urgency.label}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No renewals match this filter.
                </div>
              ) : null}
            </Card>

            <DealSheet openId={openDealId} onOpenChange={(open) => setOpenDealId(open ? openDealId : null)} />
          </TabsContent>

          {/* CAMPAIGNS */}
          <TabsContent value="campaigns" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Composer · left 2/3 */}
              <Card className="p-5 lg:col-span-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <PartyPopper className="h-3.5 w-3.5" />
                    Email composer · drafted by AI
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px]">
                    Personalised per customer
                  </Badge>
                </div>
                <div className="mt-3 rounded-lg border bg-muted/30 px-3 py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{selectedEvent.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{selectedEvent.occasion}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {selectedEvent.scheduledDate} · sending to <span className="font-semibold">{selectedEvent.audienceCount}</span> · {selectedEvent.audienceLabel}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("rounded-full text-[10px]", EVENT_CATEGORY_META[selectedEvent.category].text)}
                    >
                      {EVENT_CATEGORY_META[selectedEvent.category].label}
                    </Badge>
                  </div>
                </div>
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="mt-3 h-56 font-mono text-xs"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[11px] text-muted-foreground">
                    Edit anything · AI re-personalises for each recipient on send
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      sendCampaign(selectedEvent.id);
                      toast.success(`Sending now · ${selectedEvent.audienceCount} personalised emails`, {
                        description: `${selectedEvent.occasion} · ${selectedEvent.audienceLabel}`,
                      });
                    }}
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" /> Send to {selectedEvent.audienceCount} customers
                  </Button>
                </div>
              </Card>

              {/* Events list · right 1/3 */}
              <Card className="overflow-hidden p-0">
                <div className="border-b px-4 py-3">
                  <div className="text-sm font-semibold">Upcoming events</div>
                  <div className="text-xs text-muted-foreground">Click any event to load it into the composer.</div>
                </div>
                <div className="max-h-[28rem] divide-y overflow-y-auto">
                  {campaignEvents.map((ev) => {
                    const isSelected = ev.id === selectedEventId;
                    const isSent = campaignSentIds.includes(ev.id);
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => pickEvent(ev.id)}
                        className={cn(
                          "group w-full px-4 py-3 text-left transition-colors",
                          isSelected ? "bg-primary/8 ring-2 ring-inset ring-primary/30" : "hover:bg-muted/40"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{ev.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className={cn("truncate text-sm", isSelected ? "font-semibold text-primary" : "font-medium")}>
                              {ev.occasion}
                            </div>
                            <div className="text-[11px] text-muted-foreground">{ev.scheduledDate}</div>
                          </div>
                          {isSent ? (
                            <Badge variant="outline" className="rounded-full border-[color:var(--good)]/40 text-[10px] text-[color:var(--good)]">
                              Sent
                            </Badge>
                          ) : null}
                          <ChevronRight className={cn("h-3.5 w-3.5 transition-colors", isSelected ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground")} />
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={cn("rounded-full text-[10px]", EVENT_CATEGORY_META[ev.category].text)}
                          >
                            {EVENT_CATEGORY_META[ev.category].label}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {ev.audienceLabel} · <span className="font-semibold tabular-nums">{ev.audienceCount}</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Live results · full width below */}
            <Card className="mt-4 overflow-hidden p-0">
              <div className="border-b px-5 py-3">
                <div className="text-sm font-semibold">Live campaign results</div>
                <div className="text-xs text-muted-foreground">AI pauses automatically if reply or unsubscribe rates spike.</div>
              </div>
              <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-y-0 md:divide-x">
                {campaigns.map((c) => {
                  const justSent = campaignSentIds.includes(c.id);
                  const sent = justSent && c.status === "scheduled" ? c.audience : c.sent;
                  const openRate = sent > 0 ? Math.round((c.opened / sent) * 100) : 0;
                  return (
                    <div key={c.id} className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground">{c.audience} customers</div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full text-[10px]",
                            c.status === "complete" && "border-[color:var(--good)]/40 text-[color:var(--good)]",
                            c.status === "sending" && "border-amber-300/60 text-amber-700",
                            c.status === "scheduled" && !justSent && "border-muted-foreground/30 text-muted-foreground"
                          )}
                        >
                          {justSent && c.status === "scheduled" ? "Sending now" : c.status === "complete" ? "Done" : c.status === "sending" ? "Sending" : "Scheduled"}
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <div className="text-muted-foreground">Sent</div>
                          <div className="font-semibold tabular-nums">{sent}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Opened</div>
                          <div className="font-semibold tabular-nums">{openRate}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Replied</div>
                          <div className="font-semibold tabular-nums">{c.replied}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
