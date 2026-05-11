import { cn } from "@/lib/utils";

export function KpiTile({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "good" | "warn" | "neutral" | "info";
}) {
  const toneClasses = {
    good: "border-[color:var(--good)]/30 bg-[color:var(--good-bg)]",
    warn: "border-[color:var(--warn)]/40 bg-[color:var(--warn-bg)]",
    info: "border-[color:var(--info)]/30 bg-[color:var(--info-bg)]",
    neutral: "border-border bg-card",
  } as const;

  const dotClasses = {
    good: "bg-[color:var(--good)]",
    warn: "bg-[color:var(--warn)]",
    info: "bg-[color:var(--info)]",
    neutral: "bg-muted-foreground/40",
  } as const;

  return (
    <div className={cn("rounded-xl border p-5 transition-shadow hover:shadow-sm", toneClasses[tone])}>
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[tone])} />
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      {sub ? <div className="mt-1 text-xs text-muted-foreground">{sub}</div> : null}
    </div>
  );
}
