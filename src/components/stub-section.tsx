import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StubSection({
  title,
  blurb,
  features,
}: {
  title: string;
  blurb: string;
  features: { label: string; detail: string }[];
}) {
  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Part of the Voltade platform · not the focus today"
        title={title}
        subtitle={blurb}
        right={
          <Badge variant="outline" className="rounded-full text-[10px]">
            <Lock className="mr-1 h-2.5 w-2.5" /> Available in your rollout
          </Badge>
        }
      />

      <div className="px-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {features.map((f) => (
            <Card key={f.label} className="p-4">
              <div className="text-sm font-semibold">{f.label}</div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.detail}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-[color:var(--info)]/30 bg-[color:var(--info-bg)] p-4 text-xs">
          <p className="leading-relaxed text-foreground">
            For today's demo we're focusing on what the AI <strong>Agents</strong> do across your business.
            The rest of the platform (Inbox, Contacts, Drive, Team, Channels, Settings) is where the agents read from and write to —
            so they work alongside what your team is already using.
          </p>
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-3")}>
            Back to the inbox <ArrowRight className="ml-1.5 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
