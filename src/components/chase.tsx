import {
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Eye,
  Reply,
  CircleDashed,
  AlertTriangle,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChaseChannel, ChaseEvent, ChaseOutcome } from "@/lib/mock-data";

export const CHANNEL_ICON: Record<ChaseChannel, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: MessageSquare,
  phone: Phone,
};

export const CHANNEL_LABEL: Record<ChaseChannel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  sms: "SMS",
  phone: "Phone",
};

export const OUTCOME_META: Record<ChaseOutcome, { label: string; icon: typeof Eye; class: string; bg: string }> = {
  sent: { label: "Sent", icon: Send, class: "text-muted-foreground", bg: "bg-muted/40" },
  opened: { label: "Opened", icon: Eye, class: "text-[color:var(--info)]", bg: "bg-[color:var(--info-bg)]" },
  replied: { label: "Replied", icon: Reply, class: "text-[color:var(--good)]", bg: "bg-[color:var(--good-bg)]" },
  "no-response": { label: "No reply", icon: CircleDashed, class: "text-[color:var(--warn)]", bg: "bg-[color:var(--warn-bg)]" },
  escalated: { label: "Escalated", icon: AlertTriangle, class: "text-destructive", bg: "bg-destructive/10" },
};

export function ChaseChip({ event }: { event: ChaseEvent }) {
  const ChIcon = CHANNEL_ICON[event.channel];
  const meta = OUTCOME_META[event.outcome];
  const OutIcon = meta.icon;
  return (
    <div
      className="group flex items-center gap-1.5 rounded-full border bg-card px-2 py-0.5 text-[10px]"
      title={`${event.at} · ${CHANNEL_LABEL[event.channel]} · ${meta.label}${event.note ? " · " + event.note : ""}`}
    >
      <ChIcon className="h-3 w-3 text-muted-foreground" />
      <span className="text-muted-foreground">{event.at}</span>
      <OutIcon className={cn("h-3 w-3", meta.class)} />
      <span className={meta.class}>{meta.label}</span>
    </div>
  );
}
