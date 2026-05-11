"use client";

import { toast } from "sonner";
import {
  Wrench,
  FileSignature,
  Sparkles,
  CheckCircle2,
  Send,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiTile } from "@/components/kpi-tile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChaseChip } from "@/components/chase";
import {
  customerLabel,
  docPacks,
  workOrders,
} from "@/lib/mock-data";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function OperationsPage() {
  const nudgeCounts = useDemoStore((s) => s.nudgeCounts);
  const nudgeWo = useDemoStore((s) => s.nudgeWo);
  const resolveWo = useDemoStore((s) => s.resolveWo);
  const resolvedWoIds = useDemoStore((s) => s.resolvedWoIds);
  const signedDocIds = useDemoStore((s) => s.signedDocIds);
  const signDoc = useDemoStore((s) => s.signDoc);

  const inProgress = workOrders.filter((w) => !resolvedWoIds.includes(w.id) && w.status === "in-progress").length;
  const waitingCount = workOrders.filter(
    (w) => !resolvedWoIds.includes(w.id) && (w.status === "waiting-on-customer" || w.status === "stuck")
  ).length;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Operations Agent · Time Saved"
        title="Automated Customer Follow-Ups"
        subtitle="Two routine operations the AI handles end-to-end, so your team can focus on the customer in front of them: chasing customer replies and completing the paperwork."
      />

      <div className="grid grid-cols-1 gap-3 px-8 sm:grid-cols-3">
        <KpiTile
          label="Jobs in Progress"
          value={`${inProgress}`}
          sub="The AI is keeping things moving"
          tone="info"
        />
        <KpiTile
          label="Waiting on Customer"
          value={`${waitingCount}`}
          sub="The AI is chasing politely"
          tone={waitingCount > 0 ? "warn" : "good"}
        />
        <KpiTile
          label="Forms Auto-Filled Today"
          value={`${docPacks.length}`}
          sub="The AI pre-fills 22 to 38 fields per form"
          tone="good"
        />
      </div>

      <div className="mt-6 px-8">
        <Tabs defaultValue="wos" className="w-full">
          <TabsList>
            <TabsTrigger value="wos">Customer Follow-Ups</TabsTrigger>
            <TabsTrigger value="docs">Paperwork & Forms</TabsTrigger>
          </TabsList>

          {/* CUSTOMER FOLLOW-UPS */}
          <TabsContent value="wos" className="mt-4">
            <Card className="divide-y overflow-hidden p-0">
              {workOrders.map((wo) => {
                const resolved = resolvedWoIds.includes(wo.id);
                const totalNudges = wo.aiNudges + (nudgeCounts[wo.id] ?? 0);
                const status = resolved ? "done" : wo.status;
                return (
                  <div key={wo.id} className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-sm font-medium">{wo.type}</span>
                          <span className="text-xs text-muted-foreground">· for {customerLabel(wo.customerId)}</span>
                        </div>
                        <div className="mt-0.5 text-xs">
                          <span className={cn(wo.ageDays >= 5 && !resolved ? "text-[color:var(--warn)]" : "text-muted-foreground")}>
                            Open {wo.ageDays} day{wo.ageDays === 1 ? "" : "s"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full text-[10px]",
                            status === "done" && "border-[color:var(--good)]/40 text-[color:var(--good)]",
                            status === "in-progress" && "border-[color:var(--info)]/40 text-[color:var(--info)]",
                            status === "waiting-on-customer" && "border-amber-300/60 text-amber-700",
                            status === "stuck" && "border-destructive/40 text-destructive"
                          )}
                        >
                          {status === "in-progress"
                            ? "In Progress"
                            : status === "waiting-on-customer"
                            ? "Waiting on Customer"
                            : status === "stuck"
                            ? "Action Required"
                            : "Done"}
                        </Badge>
                        {!resolved ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                nudgeWo(wo.id);
                                toast.success("Reminder sent", {
                                  description: `AI knows what's already been said.`,
                                });
                              }}
                            >
                              <Send className="mr-1.5 h-3 w-3" /> Remind
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                resolveWo(wo.id);
                                toast.success("Job closed");
                              }}
                            >
                              <CheckCircle2 className="mr-1.5 h-3 w-3" /> Close
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Chase history */}
                    <div className="mt-3 ml-12 border-t pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          AI Follow-Ups · {totalNudges} Sent
                        </div>
                        <div className="flex items-center gap-1 rounded-full border bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Next: <span className="ml-0.5 text-foreground">{wo.nextChaseAt}</span>
                        </div>
                      </div>
                      {wo.chaseHistory.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {wo.chaseHistory.map((ev, idx) => (
                            <ChaseChip key={idx} event={ev} />
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 text-[11px] italic text-muted-foreground">
                          No follow-ups yet — first one scheduled.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Card>
            <div className="mt-4 rounded-xl border border-[color:var(--info)]/30 bg-[color:var(--info-bg)] p-4 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[color:var(--info)]">
                <Sparkles className="h-3.5 w-3.5" /> How the AI Follows Up
              </div>
              <p className="mt-1 leading-relaxed text-foreground">
                The AI nudges politely every two days: email first, then WhatsApp, then SMS. After three unanswered reminders, the case is routed to you with a summary, so nothing falls through the cracks.
              </p>
            </div>
          </TabsContent>

          {/* PAPERWORK */}
          <TabsContent value="docs" className="mt-4">
            <Card className="divide-y overflow-hidden p-0">
              {docPacks.map((d) => {
                const signed = signedDocIds.includes(d.id);
                const status = signed ? "done" : d.status;
                const pct = Math.round((d.fieldsAutofilled / d.fieldsTotal) * 100);
                return (
                  <div key={d.id} className="flex items-start gap-3 px-4 py-3">
                    <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <FileSignature className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm font-medium">{d.type}</span>
                        <span className="text-xs text-muted-foreground">· for {customerLabel(d.customerId)}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">Made {d.generatedAt}</div>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {d.fieldsAutofilled} of {d.fieldsTotal} fields filled by AI
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full text-[10px]",
                          status === "done" && "border-[color:var(--good)]/40 text-[color:var(--good)]",
                          status === "review" && "border-amber-300/60 text-amber-700",
                          status === "drafting" && "border-muted-foreground/30 text-muted-foreground"
                        )}
                      >
                        {status === "drafting" ? "AI Drafting" : status === "review" ? "Needs Review" : "Done"}
                      </Badge>
                      {status === "review" && !signed ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            signDoc(d.id);
                            toast.success("Signed off and sent to customer");
                          }}
                        >
                          <CheckCircle2 className="mr-1.5 h-3 w-3" /> Sign Off
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </Card>
            <div className="mt-4 rounded-xl border border-[color:var(--good)]/30 bg-[color:var(--good-bg)] p-4 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[color:var(--good)]">
                <Sparkles className="h-3.5 w-3.5" /> Why This Saves Time
              </div>
              <p className="mt-1 leading-relaxed text-foreground">
                The AI pulls customer details, booking information, and treatment history from your existing systems and pre-fills the form. Your team reviews only the four to seven fields the AI flagged as uncertain, rather than typing all 31. The average time saved is approximately 40 minutes per form.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
