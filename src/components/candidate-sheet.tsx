"use client";

import { toast } from "sonner";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  MapPin,
  Calendar,
  Banknote,
  Send,
  Trophy,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { candidateDetails, candidates, type Candidate } from "@/lib/mock-data";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CandidateSheet({
  openId,
  onOpenChange,
}: {
  openId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const candidate: Candidate | undefined = candidates.find((c) => c.id === openId);
  const detail = openId ? candidateDetails[openId] : undefined;

  const shortlistedIds = useDemoStore((s) => s.shortlistedCandidateIds);
  const shortlist = useDemoStore((s) => s.shortlistCandidate);

  if (!candidate || !detail) {
    return (
      <Sheet open={false} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    );
  }

  const isShortlisted = candidate.status === "shortlist" || shortlistedIds.includes(candidate.id);
  const isRejected = candidate.status === "rejected";

  return (
    <Sheet open={Boolean(openId)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="border-b">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {candidate.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base">Candidate {candidate.initials}</SheetTitle>
              <SheetDescription className="text-xs">
                Applying for {detail.appliedFor} · sourced from {candidate.source}
              </SheetDescription>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full text-[10px]",
                    isShortlisted && "border-[color:var(--good)]/40 text-[color:var(--good)]",
                    isRejected && "border-destructive/40 text-destructive",
                    !isShortlisted && !isRejected && "border-amber-300/60 text-amber-700"
                  )}
                >
                  {isShortlisted ? "Shortlisted" : isRejected ? "Rejected" : "Under review"}
                </Badge>
                <span className="flex items-center gap-1 rounded-full border bg-card px-2 py-0.5 text-[11px]">
                  <Trophy className={cn("h-3 w-3", candidate.aiScore >= 80 ? "text-[color:var(--good)]" : candidate.aiScore >= 60 ? "text-amber-600" : "text-muted-foreground")} />
                  Match score <span className="font-semibold tabular-nums">{candidate.aiScore}/100</span>
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {/* Quick facts */}
          <Card className="p-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Location</div>
                  <div className="font-medium">{detail.location}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Expected salary</div>
                  <div className="font-medium">{detail.expectedSalary}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Notice period</div>
                  <div className="font-medium">{detail.noticePeriod}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Experience</div>
                  <div className="font-medium">{candidate.yearsExp} year{candidate.yearsExp === 1 ? "" : "s"}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* AI verdict */}
          <Card className="border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI Assessment
            </div>
            <p className="mt-2 text-sm leading-relaxed">{detail.aiSummary}</p>
          </Card>

          {/* Strengths & concerns */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="border-[color:var(--good)]/30 bg-[color:var(--good-bg)]/50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--good)]">
                Strengths
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                {candidate.highlights.length > 0 ? (
                  candidate.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--good)]" />
                      <span>{h}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">None notable</li>
                )}
              </ul>
            </Card>

            <Card className="border-[color:var(--warn)]/30 bg-[color:var(--warn-bg)]/50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--warn)]">
                {isRejected ? "Reasons for Rejection" : "Concerns"}
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                {candidate.redFlags.length > 0 ? (
                  candidate.redFlags.map((r) => (
                    <li key={r} className="flex items-start gap-1.5">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--warn)]" />
                      <span>{r}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">None detected</li>
                )}
              </ul>
            </Card>
          </div>

          {/* Score breakdown */}
          <Card className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Match Score Breakdown</div>
            <p className="text-[11px] text-muted-foreground">Weighted average across criteria for this role.</p>
            <div className="mt-3 space-y-2.5">
              {detail.scoreBreakdown.map((s) => (
                <div key={s.criterion}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{s.criterion}</span>
                    <span className="tabular-nums">
                      <span className="font-semibold">{s.score}</span>
                      <span className="text-muted-foreground"> · weight {s.weight}%</span>
                    </span>
                  </div>
                  <Progress
                    value={s.score}
                    className={cn(
                      "mt-1 h-1.5",
                      s.score < 40 && "[&>div]:bg-destructive",
                      s.score >= 40 && s.score < 70 && "[&>div]:bg-amber-500"
                    )}
                  />
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{s.note}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Work history */}
          {detail.experience.length > 0 ? (
            <Card className="p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
                <Briefcase className="h-3.5 w-3.5" /> Work History
              </div>
              <div className="mt-2 space-y-3">
                {detail.experience.map((e, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-3">
                    <div className="text-sm font-medium">{e.role}</div>
                    <div className="text-[11px] text-muted-foreground">{e.org} · {e.period}</div>
                    <ul className="mt-1 space-y-0.5 text-xs text-foreground/80">
                      {e.bullets.map((b) => (
                        <li key={b} className="list-disc list-inside">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {/* Education & certs */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                <GraduationCap className="h-3.5 w-3.5" /> Education
              </div>
              <div className="mt-2 space-y-1.5">
                {detail.education.map((e, i) => (
                  <div key={i} className="text-xs">
                    <div className="font-medium">{e.degree}</div>
                    <div className="text-muted-foreground">{e.school} · {e.year}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                <Award className="h-3.5 w-3.5" /> Certifications
              </div>
              <div className="mt-2 space-y-1">
                {detail.certifications.length > 0 ? (
                  detail.certifications.map((c) => (
                    <div key={c.name} className="flex items-center gap-1.5 text-xs">
                      {c.verified ? (
                        <CheckCircle2 className="h-3 w-3 text-[color:var(--good)]" />
                      ) : (
                        <XCircle className="h-3 w-3 text-destructive" />
                      )}
                      <span>{c.name}</span>
                      {c.verified ? (
                        <Badge variant="outline" className="ml-auto rounded-full border-[color:var(--good)]/40 text-[10px] text-[color:var(--good)]">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="ml-auto rounded-full border-destructive/40 text-[10px] text-destructive">
                          Missing
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground">None on file</div>
                )}
              </div>
            </Card>
          </div>

          {/* Skills */}
          {detail.skills.length > 0 ? (
            <Card className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wider">Skills</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {detail.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="rounded-full text-[10px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>
          ) : null}

          {/* AI-drafted reply */}
          <Card className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Mail className="h-3.5 w-3.5" /> AI-Drafted Reply to Candidate
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {isShortlisted ? "Sent automatically when you shortlist." : isRejected ? "Sent automatically with the rejection." : "Will be sent once you shortlist or reject."}
            </p>
            <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-md border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed">
              {detail.aiDraftReply}
            </pre>
          </Card>

          {/* Actions */}
          {!isShortlisted && !isRejected ? (
            <div className="sticky bottom-0 -mx-4 flex gap-2 border-t bg-background px-4 py-3">
              <Button
                className="flex-1"
                onClick={() => {
                  shortlist(candidate.id);
                  toast.success(`Shortlisted ${candidate.initials} · interview email sent`);
                  onOpenChange(false);
                }}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" /> Shortlist
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  toast.success(`Rejected ${candidate.initials} · polite reply sent`);
                  onOpenChange(false);
                }}
              >
                <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
              </Button>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
