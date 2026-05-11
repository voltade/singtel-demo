"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Send, Trophy, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiTile } from "@/components/kpi-tile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CandidateSheet } from "@/components/candidate-sheet";
import { candidateDetails, candidates, type Candidate } from "@/lib/mock-data";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "new" | "screening" | "shortlist" | "auto-replied" | "rejected";

const STATUS_META: Record<Candidate["status"], { label: string; text: string; ring: string; bg: string }> = {
  new: { label: "New", text: "text-muted-foreground", ring: "border-muted-foreground/30", bg: "bg-muted/40" },
  screening: { label: "Under Review", text: "text-[color:var(--info)]", ring: "border-[color:var(--info)]/40", bg: "bg-[color:var(--info-bg)]" },
  shortlist: { label: "Shortlisted", text: "text-[color:var(--good)]", ring: "border-[color:var(--good)]/40", bg: "bg-[color:var(--good-bg)]" },
  "auto-replied": { label: "Acknowledged", text: "text-amber-700", ring: "border-amber-300/60", bg: "bg-amber-50" },
  rejected: { label: "Rejected", text: "text-destructive", ring: "border-destructive/40", bg: "bg-destructive/5" },
};

const FILTER_LABEL: Record<FilterKey, string> = {
  all: "All Applicants",
  new: "New",
  screening: "Under Review",
  shortlist: "Shortlisted",
  "auto-replied": "Acknowledged",
  rejected: "Rejected",
};

export default function HrPage() {
  const shortlistedIds = useDemoStore((s) => s.shortlistedCandidateIds);
  const shortlist = useDemoStore((s) => s.shortlistCandidate);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  const candidateStatus = (c: Candidate): Candidate["status"] =>
    c.status === "shortlist" || shortlistedIds.includes(c.id) ? "shortlist" : c.status;

  const filtered = useMemo(() => {
    if (filter === "all") return candidates;
    return candidates.filter((c) => candidateStatus(c) === filter);
  }, [filter, shortlistedIds]);

  const shortlistedCount = candidates.filter((c) => candidateStatus(c) === "shortlist").length;
  const rejectedCount = candidates.filter((c) => c.status === "rejected").length;
  const avgScore = Math.round(candidates.reduce((s, c) => s + c.aiScore, 0) / candidates.length);

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Hiring Agent · Time Saved"
        title="CV Screening, Shortlisting & First-Touch Communication"
        subtitle="The AI hiring agent reads every CV, validates against role requirements, and shortlists the strongest candidates. Click any row to open the full screening profile."
      />

      <div className="grid grid-cols-1 gap-3 px-8 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Applications Received" value={`${candidates.length}`} sub="LinkedIn, Indeed, referrals, careers page" tone="info" />
        <KpiTile label="Shortlisted" value={`${shortlistedCount}`} sub="Match score 80 and above" tone="good" />
        <KpiTile label="Rejected" value={`${rejectedCount}`} sub="Rationale logged for each" tone="warn" />
        <KpiTile label="Average Match Score" value={`${avgScore}/100`} sub="Weighted per role" tone="info" />
      </div>

      <div className="mt-6 px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(FILTER_LABEL) as FilterKey[]).map((f) => {
              const count =
                f === "all"
                  ? candidates.length
                  : candidates.filter((c) => candidateStatus(c) === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                    filter === f
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted/60"
                  )}
                >
                  {FILTER_LABEL[f]}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-mono tabular-nums",
                      filter === f ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Cycle Time · 6 Days → Under 3 Days
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Applying For</TableHead>
                <TableHead className="text-right">Experience</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Match Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const status = candidateStatus(c);
                const meta = STATUS_META[status];
                const detail = candidateDetails[c.id];
                const isShortlisted = status === "shortlist";
                return (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => setOpenId(c.id)}
                  >
                    <TableCell>
                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                          {c.initials}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">Candidate {c.initials}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{c.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{c.role}</div>
                      {detail ? (
                        <div className="text-[10px] text-muted-foreground">{detail.appliedFor}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm tabular-nums">
                        {c.yearsExp} yr{c.yearsExp === 1 ? "" : "s"}
                      </div>
                      {detail ? (
                        <div className="text-[10px] text-muted-foreground">{detail.noticePeriod} notice</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-xs">{c.source}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2 py-0.5">
                        <Trophy
                          className={cn(
                            "h-3 w-3",
                            c.aiScore >= 80
                              ? "text-[color:var(--good)]"
                              : c.aiScore >= 60
                              ? "text-amber-600"
                              : "text-muted-foreground"
                          )}
                        />
                        <span className="font-mono text-xs font-semibold tabular-nums">{c.aiScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("rounded-full text-[10px]", meta.text, meta.ring)}>
                        {meta.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!isShortlisted && c.status !== "rejected" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              shortlist(c.id);
                              toast.success("Shortlisted — interview email sent", {
                                description: `${c.initials} · 4 time slots offered`,
                              });
                            }}
                          >
                            <Send className="mr-1 h-3 w-3" /> Shortlist
                          </Button>
                        ) : null}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              No applicants match this filter.
            </div>
          ) : null}
        </Card>

        <div className="mt-4 rounded-xl border border-[color:var(--good)]/30 bg-[color:var(--good-bg)] p-4 text-xs">
          <div className="font-semibold text-[color:var(--good)]">The Change for HR</div>
          <p className="mt-1 leading-relaxed text-foreground">
            Previously, two HR staff were limited to roughly 20 CVs per day. The AI hiring agent now reads every CV, validates certifications, scores against role requirements, and drafts the first reply. Final hiring decisions remain with the human team, but their time is now spent only on candidates worth interviewing.
          </p>
        </div>
      </div>

      <CandidateSheet openId={openId} onOpenChange={(open) => setOpenId(open ? openId : null)} />
    </div>
  );
}
