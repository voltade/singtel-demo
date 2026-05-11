"use client";

import {
  Building2,
  Banknote,
  MapPin,
  User,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  baseActivity,
  contracts,
  customers,
  INDUSTRY_LABEL,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CustomerSheet({
  openId,
  onOpenChange,
}: {
  openId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const customer = customers.find((c) => c.id === openId);
  if (!customer) {
    return (
      <Sheet open={false} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    );
  }

  const customerContracts = contracts.filter((c) => c.customerId === customer.id);
  const customerActivity = baseActivity.filter((a) => a.customerId === customer.id);

  return (
    <Sheet open={Boolean(openId)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base">{INDUSTRY_LABEL[customer.industry]} customer</SheetTitle>
              <SheetDescription className="text-xs font-mono">{customer.id}</SheetDescription>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className="rounded-full text-[10px]">
                  {INDUSTRY_LABEL[customer.industry]}
                </Badge>
                <Badge variant="outline" className="rounded-full text-[10px]">
                  <MapPin className="mr-1 h-2.5 w-2.5" /> {customer.region}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {/* Quick facts */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Main Contact</div>
                  <div className="font-medium">{customer.contactRole}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Annual Value</div>
                  <div className="font-medium tabular-nums">S${customer.annualValueSgd.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Active contracts */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">Active Contracts</div>
              <Badge variant="outline" className="rounded-full text-[10px]">
                {customerContracts.length}
              </Badge>
            </div>
            {customerContracts.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {customerContracts.map((c) => (
                  <li key={c.id} className="rounded-md border bg-muted/20 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{c.product}</div>
                        <div className="text-[11px] text-muted-foreground">Ends {c.endsOn} · {c.daysInStage} day{c.daysInStage === 1 ? "" : "s"} in current stage</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold tabular-nums text-sm">S${c.annualValueSgd.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">per year</div>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">{c.aiAction}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 text-xs italic text-muted-foreground">No active contracts on file.</div>
            )}
            {customerContracts.length > 0 ? (
              <Link
                href="/engagement"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-3 w-full")}
              >
                View in Deal Pipeline <ArrowRight className="ml-1.5 h-3 w-3" />
              </Link>
            ) : null}
          </Card>

          {/* Recent activity */}
          <Card className="p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">Recent Activity</div>
            {customerActivity.length > 0 ? (
              <ol className="mt-2 space-y-2">
                {customerActivity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2 text-xs">
                    <span className="font-mono text-[11px] text-muted-foreground shrink-0">{a.time}</span>
                    <span>{a.text}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-2 text-xs italic text-muted-foreground">No recent activity in the last 24 hours.</div>
            )}
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
