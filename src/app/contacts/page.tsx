"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiTile } from "@/components/kpi-tile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerSheet } from "@/components/customer-sheet";
import {
  baseActivity,
  contracts,
  customers,
  INDUSTRY_LABEL,
  type IndustryTag,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "members" | "corporate" | "hotel-partner" | "gym-partner";

const FILTER_MATCH: Record<FilterKey, (t: IndustryTag) => boolean> = {
  all: () => true,
  members: (t) => t === "gold-member" || t === "silver-member",
  corporate: (t) => t === "corporate-wellness",
  "hotel-partner": (t) => t === "hotel-partner",
  "gym-partner": (t) => t === "gym-partner",
};

const FILTER_LABEL: Record<FilterKey, string> = {
  all: "All Contacts",
  members: "Members",
  corporate: "Corporate Wellness",
  "hotel-partner": "Hotel Partners",
  "gym-partner": "Gym Partners",
};

export default function ContactsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () => customers.filter((c) => FILTER_MATCH[filter](c.industry)),
    [filter]
  );

  const totalValue = customers.reduce((s, c) => s + c.annualValueSgd, 0);
  const memberCount = customers.filter((c) => c.industry === "gold-member" || c.industry === "silver-member").length;
  const corporateCount = customers.filter((c) => c.industry === "corporate-wellness" || c.industry === "hotel-partner" || c.industry === "gym-partner").length;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Contacts · CRM"
        title="Customer Database"
        subtitle="Every customer, every contract, every conversation in one place. AI agents read from this database to determine who to follow up with, and write back so you maintain a single source of truth."
      />

      <div className="grid grid-cols-1 gap-3 px-8 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Total Contacts" value={`${customers.length}`} sub="Across all tiers and partners" tone="info" />
        <KpiTile label="Member Accounts" value={`${memberCount}`} sub="Gold and Silver tiers" tone="info" />
        <KpiTile label="Corporate Accounts" value={`${corporateCount}`} sub="Hotels, gyms, and offices" tone="info" />
        <KpiTile label="Total Annual Value" value={`S$${(totalValue / 1000).toFixed(0)}K`} sub="Total book of business" tone="good" />
      </div>

      <div className="mt-6 px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(FILTER_LABEL) as FilterKey[]).map((f) => {
              const count = customers.filter((c) => FILTER_MATCH[f](c.industry)).length;
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
          <div className="text-[11px] text-muted-foreground">Click any row to open the contact.</div>
        </div>

        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Annual Value</TableHead>
                <TableHead>Active Contracts</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const contractsForCustomer = contracts.filter((ct) => ct.customerId === c.id);
                const lastActivity = baseActivity.find((a) => a.customerId === c.id);
                return (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => setOpenId(c.id)}
                  >
                    <TableCell>
                      <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                        <Users className="h-3.5 w-3.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{INDUSTRY_LABEL[c.industry]} customer</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{c.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        {INDUSTRY_LABEL[c.industry]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{c.region}</TableCell>
                    <TableCell className="text-right">
                      <div className="font-semibold tabular-nums text-sm">S${c.annualValueSgd.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">per year</div>
                    </TableCell>
                    <TableCell>
                      {contractsForCustomer.length > 0 ? (
                        <span className="font-semibold tabular-nums text-sm">{contractsForCustomer.length}</span>
                      ) : (
                        <span className="text-xs italic text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lastActivity ? (
                        <div>
                          <div className="text-[11px] line-clamp-1 max-w-[14rem]">{lastActivity.text}</div>
                          <div className="text-[10px] text-muted-foreground">{lastActivity.time}</div>
                        </div>
                      ) : (
                        <span className="text-[11px] italic text-muted-foreground">No activity</span>
                      )}
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
              No contacts match this filter.
            </div>
          ) : null}
        </Card>
      </div>

      <CustomerSheet openId={openId} onOpenChange={(open) => setOpenId(open ? openId : null)} />
    </div>
  );
}
