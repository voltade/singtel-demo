"use client";

import { toast } from "sonner";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Eye,
  Reply,
  CircleDashed,
  Bot,
  User,
  Users,
  Clock,
  Building2,
  Banknote,
  Calendar,
  FileText,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  contracts,
  customerLabel,
  findCustomer,
  INDUSTRY_LABEL,
  quotes,
  OWNER_META,
  DEAL_STAGE_ORDER,
  DEAL_STAGE_LABEL,
  type ActionOwner,
  type ChaseChannel,
  type ChaseOutcome,
  type DealStage,
} from "@/lib/mock-data";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const CHANNEL_ICON: Record<ChaseChannel, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: MessageSquare,
  phone: Phone,
};

const CHANNEL_LABEL: Record<ChaseChannel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  sms: "SMS",
  phone: "Phone",
};

const OUTCOME_META: Record<ChaseOutcome, { label: string; icon: typeof Eye; class: string; bg: string }> = {
  sent: { label: "Sent", icon: Send, class: "text-muted-foreground", bg: "bg-muted/40" },
  opened: { label: "Opened", icon: Eye, class: "text-[color:var(--info)]", bg: "bg-[color:var(--info-bg)]" },
  replied: { label: "Replied", icon: Reply, class: "text-[color:var(--good)]", bg: "bg-[color:var(--good-bg)]" },
  "no-response": { label: "No reply", icon: CircleDashed, class: "text-[color:var(--warn)]", bg: "bg-[color:var(--warn-bg)]" },
  escalated: { label: "Escalated", icon: AlertTriangle, class: "text-destructive", bg: "bg-destructive/10" },
};

const OWNER_ICON: Record<ActionOwner, typeof Bot> = {
  ai: Bot,
  you: User,
  customer: Users,
  manager: Users,
};

function PipelineFullBar({ stage }: { stage: DealStage }) {
  const currentIdx = DEAL_STAGE_ORDER.indexOf(stage);
  return (
    <div className="flex items-center gap-1.5">
      {DEAL_STAGE_ORDER.map((s, i) => {
        const past = i < currentIdx;
        const current = i === currentIdx;
        return (
          <div key={s} className="flex flex-1 items-center gap-1.5">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "rounded-full transition-all",
                  current ? "h-3 w-3 bg-primary ring-2 ring-primary/20" : past ? "h-2 w-2 bg-primary" : "h-2 w-2 bg-muted-foreground/30"
                )}
              />
              <span className={cn("text-[9px] whitespace-nowrap", current ? "font-semibold text-primary" : past ? "text-muted-foreground" : "text-muted-foreground/60")}>
                {DEAL_STAGE_LABEL[s]}
              </span>
            </div>
            {i < DEAL_STAGE_ORDER.length - 1 ? (
              <div className={cn("mb-3 h-px flex-1", past ? "bg-primary" : "bg-muted-foreground/20")} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function DealSheet({
  openId,
  onOpenChange,
}: {
  openId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const deal = contracts.find((c) => c.id === openId);
  const approveQuote = useDemoStore((s) => s.approveQuote);
  const approvedQuoteIds = useDemoStore((s) => s.approvedQuoteIds);
  const nudgeWo = useDemoStore((s) => s.nudgeWo); // reuse for activity bump

  if (!deal) {
    return (
      <Sheet open={false} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    );
  }

  const customer = findCustomer(deal.customerId);
  const relatedQuotes = quotes.filter((q) => q.customerId === deal.customerId);
  const ownerMeta = OWNER_META[deal.nextActionOwner];
  const OwnerIcon = OWNER_ICON[deal.nextActionOwner];

  return (
    <Sheet open={Boolean(openId)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base">{customerLabel(deal.customerId)}</SheetTitle>
              <SheetDescription className="text-xs">
                {deal.product} · ends {deal.endsOn}
              </SheetDescription>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {deal.escalation ? (
                  <Badge variant="outline" className="rounded-full border-destructive/40 text-[10px] text-destructive">
                    <AlertTriangle className="mr-1 h-2.5 w-2.5" /> Escalated
                  </Badge>
                ) : null}
                {deal.aiNeedsYou ? (
                  <Badge variant="outline" className="rounded-full border-[color:var(--warn)]/40 text-[10px] text-[color:var(--warn)]">
                    Needs you
                  </Badge>
                ) : (
                  <Badge variant="outline" className="rounded-full border-[color:var(--info)]/40 text-[10px] text-[color:var(--info)]">
                    AI handling
                  </Badge>
                )}
                <span className="text-[11px] text-muted-foreground">
                  · {deal.chaseHistory.length} {deal.chaseHistory.length === 1 ? "nudge" : "nudges"} sent · {deal.daysInStage} day{deal.daysInStage === 1 ? "" : "s"} in stage
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Annual value</div>
              <div className="text-lg font-semibold tabular-nums">S${deal.annualValueSgd.toLocaleString()}</div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {/* Pipeline progress */}
          <Card className="p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">Pipeline Progress</div>
            <div className="mt-4">
              <PipelineFullBar stage={deal.pipelineStage} />
            </div>
          </Card>

          {/* Chase timeline */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">Chase Timeline</div>
              <Badge variant="outline" className="rounded-full text-[10px]">
                {deal.chaseHistory.length} Events
              </Badge>
            </div>

            {deal.chaseHistory.length === 0 ? (
              <div className="mt-3 rounded-md border bg-muted/40 p-3 text-xs italic text-muted-foreground">
                No chasers sent yet. {deal.nextChaseAt}
              </div>
            ) : (
              <ol className="mt-3 space-y-3">
                {deal.chaseHistory.map((ev, i) => {
                  const ChIcon = CHANNEL_ICON[ev.channel];
                  const meta = OUTCOME_META[ev.outcome];
                  const OutIcon = meta.icon;
                  return (
                    <li key={i} className="relative pl-6">
                      <div className={cn("absolute left-0 top-1 grid h-4 w-4 place-items-center rounded-full", meta.bg)}>
                        <ChIcon className={cn("h-2.5 w-2.5", meta.class)} />
                      </div>
                      {i < deal.chaseHistory.length - 1 ? (
                        <div className="absolute left-[7px] top-5 h-full w-px bg-muted-foreground/20" />
                      ) : null}
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{ev.at}</span>
                        <span className="text-xs font-medium">{CHANNEL_LABEL[ev.channel]}</span>
                        <Badge variant="outline" className={cn("rounded-full text-[10px]", meta.class)}>
                          <OutIcon className="mr-0.5 h-2.5 w-2.5" /> {meta.label}
                        </Badge>
                      </div>
                      {ev.note ? <p className="mt-0.5 text-xs text-foreground/80">{ev.note}</p> : null}
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="mt-3 flex items-center gap-1.5 rounded-md border bg-muted/30 px-2.5 py-1.5 text-[11px]">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Next chase:</span>
              <span className="font-medium">{deal.nextChaseAt}</span>
            </div>
          </Card>

          {/* Next action + owner */}
          <Card className={cn("p-4", deal.escalation ? "border-destructive/30 bg-destructive/5" : "")}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">Next Steps</div>
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]",
                  ownerMeta.tone === "warn" && "border-[color:var(--warn)]/40 bg-[color:var(--warn-bg)] text-[color:var(--warn)]",
                  ownerMeta.tone === "info" && "border-[color:var(--info)]/40 bg-[color:var(--info-bg)] text-[color:var(--info)]",
                  ownerMeta.tone === "good" && "border-[color:var(--good)]/40 bg-[color:var(--good-bg)] text-[color:var(--good)]",
                  ownerMeta.tone === "neutral" && "border-muted-foreground/30 bg-muted/40 text-muted-foreground"
                )}
              >
                <OwnerIcon className="h-3 w-3" />
                <span className="font-medium">{ownerMeta.label}</span>
              </div>
            </div>
            <p className="mt-2 text-sm">{deal.nextActionDetail}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{deal.aiAction}</p>
            {deal.escalation ? (
              <div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-card p-2 text-[11px]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                <div>
                  <div className="font-semibold text-destructive">
                    Escalated to {deal.escalation.to} · {deal.escalation.at}
                  </div>
                  <div className="text-foreground">Why: {deal.escalation.reason}</div>
                </div>
              </div>
            ) : null}
          </Card>

          {/* Customer card */}
          {customer ? (
            <Card className="p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
                <Building2 className="h-3.5 w-3.5" /> Customer Details
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Industry</div>
                  <div className="font-medium">{INDUSTRY_LABEL[customer.industry]}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Region</div>
                  <div className="font-medium">{customer.region}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Contact role</div>
                  <div className="font-medium">{customer.contactRole}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total annual value</div>
                  <div className="font-medium tabular-nums">S${customer.annualValueSgd.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          ) : null}

          {/* Related quotes */}
          {relatedQuotes.length > 0 ? (
            <Card className="p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
                <FileText className="h-3.5 w-3.5" /> Related Quotes
              </div>
              <ul className="mt-2 space-y-1.5 text-xs">
                {relatedQuotes.map((q) => (
                  <li key={q.id} className="flex items-center justify-between gap-2 rounded-md border bg-muted/20 px-2.5 py-1.5">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{q.product}</div>
                      <div className="text-[11px] text-muted-foreground">{q.aiNote}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold tabular-nums">S${q.amountSgd.toLocaleString()}</div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full text-[10px]",
                          q.status === "accepted" && "border-[color:var(--good)]/40 text-[color:var(--good)]",
                          q.status === "sent" && "border-[color:var(--info)]/40 text-[color:var(--info)]",
                          q.status === "pending-approval" && "border-[color:var(--warn)]/40 text-[color:var(--warn)]",
                          q.status === "drafting" && "border-muted-foreground/30 text-muted-foreground"
                        )}
                      >
                        {q.status === "pending-approval" ? "Awaiting approval" : q.status === "accepted" ? "Signed" : q.status === "sent" ? "Sent" : "AI drafting"}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {/* Action footer */}
          <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t bg-background px-4 py-3">
            {deal.nextActionOwner === "you" && !approvedQuoteIds.includes("Q-01") ? (
              <Button
                className="flex-1"
                onClick={() => {
                  approveQuote("Q-01");
                  toast.success("Quote sent · customer notified on WhatsApp + email");
                  onOpenChange(false);
                }}
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve & Send
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                nudgeWo(deal.id);
                toast.success("Manual reminder sent", { description: "AI knows what's already been said." });
              }}
            >
              <Send className="mr-1.5 h-3.5 w-3.5" /> Send Chaser Now
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
