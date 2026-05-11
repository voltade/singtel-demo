"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  MessageCircle,
  Globe,
  Radio,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiTile } from "@/components/kpi-tile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConnectWhatsAppDialog } from "@/components/connect-whatsapp-dialog";
import { useDemoStore, type ConnectedChannel } from "@/lib/store";
import { cn } from "@/lib/utils";

function ChannelIcon({ kind, className }: { kind: ConnectedChannel["kind"]; className?: string }) {
  if (kind === "web") return <Globe className={className} />;
  return <MessageCircle className={className} />;
}

function channelLabel(kind: ConnectedChannel["kind"]): string {
  if (kind === "web") return "Web Chat";
  if (kind === "whatsapp-sandbox") return "WhatsApp · Sandbox";
  return "WhatsApp · Business";
}

export default function ChannelsPage() {
  const channels = useDemoStore((s) => s.channels);
  const removeChannel = useDemoStore((s) => s.removeChannel);

  const [connectMode, setConnectMode] = useState<"closed" | "coexistence" | "cloud" | "sandbox">("closed");
  const dialogOpen = connectMode !== "closed";

  const activeCount = channels.filter((c) => c.status === "active").length;
  const whatsappCount = channels.filter((c) => c.kind === "whatsapp" || c.kind === "whatsapp-sandbox").length;
  const webCount = channels.filter((c) => c.kind === "web").length;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Channels · Connect Customers"
        title="Channels"
        subtitle="Transport adapters connecting your customers to this organisation's AI agents. Add WhatsApp, web chat, or a sandbox number — and your AI agents respond automatically."
        right={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Channel
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setConnectMode("coexistence")}>
                <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" />
                WhatsApp Business
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConnectMode("sandbox")}>
                <Radio className="mr-2 h-4 w-4 text-amber-600" />
                Platform Sandbox (WhatsApp)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.info("Web chat widget", {
                    description: "Embed code generation coming next sprint.",
                  });
                }}
              >
                <Globe className="mr-2 h-4 w-4" />
                Web Chat Widget
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  window.open("https://business.facebook.com/wa/manage/phone-numbers/", "_blank");
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Meta WABA Manager
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid grid-cols-1 gap-3 px-8 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Total Channels" value={`${channels.length}`} sub="Across all platforms" tone="info" />
        <KpiTile label="Active" value={`${activeCount}`} sub="Receiving messages" tone="good" />
        <KpiTile label="WhatsApp Channels" value={`${whatsappCount}`} sub="Business & sandbox numbers" tone="info" />
        <KpiTile label="Web Channels" value={`${webCount}`} sub="Embedded chat widgets" tone="info" />
      </div>

      <div className="mt-6 px-8">
        {channels.length === 0 ? (
          // ─── Empty state ───
          <Card className="border-dashed py-16">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-base font-semibold">No Channels Yet</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Connect WhatsApp to start receiving and sending messages from a single inbox.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <Button size="lg" onClick={() => setConnectMode("coexistence")}>
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  Connect Existing WhatsApp Business App
                </Button>
                <p className="text-xs text-muted-foreground">
                  Already chatting on WhatsApp? Keep using your phone — we'll mirror messages here.
                </p>
                <Button variant="outline" size="sm" onClick={() => setConnectMode("cloud")}>
                  Use a New Number (Cloud API) Instead
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Or{" "}
                  <button
                    type="button"
                    className="underline underline-offset-4 hover:text-foreground"
                    onClick={() => setConnectMode("sandbox")}
                  >
                    claim a sandbox number for testing
                  </button>
                  .
                </p>
              </div>
            </div>
          </Card>
        ) : (
          // ─── Channels table ───
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Default Assignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Connected</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className={cn(
                        "grid h-8 w-8 place-items-center rounded-md",
                        c.kind === "web" ? "bg-primary/10 text-primary" : "bg-[#25D366]/10 text-[#25D366]"
                      )}>
                        <ChannelIcon kind={c.kind} className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{c.displayName}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{c.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        {channelLabel(c.kind)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {c.phoneNumber ? (
                        <span className="font-mono tabular-nums">{c.phoneNumber}</span>
                      ) : c.origin ? (
                        <span className="font-mono">{c.origin}</span>
                      ) : (
                        <span className="italic text-muted-foreground">—</span>
                      )}
                      {c.wabaId ? (
                        <div className="font-mono text-[10px] text-muted-foreground">{c.wabaId}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-xs">{c.defaultAssignee}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full text-[10px]",
                          c.status === "active" && "border-[color:var(--good)]/40 text-[color:var(--good)]",
                          c.status === "connecting" && "border-amber-300/60 text-amber-700",
                          c.status === "failed" && "border-destructive/40 text-destructive"
                        )}
                      >
                        <span
                          className={cn(
                            "mr-1 inline-block h-1.5 w-1.5 rounded-full",
                            c.status === "active" && "bg-[color:var(--good)]",
                            c.status === "connecting" && "bg-amber-500",
                            c.status === "failed" && "bg-destructive"
                          )}
                        />
                        {c.status === "active" ? "Active" : c.status === "connecting" ? "Connecting" : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              toast.info("Channel details", {
                                description: "Settings panel coming next sprint.",
                              });
                            }}
                          >
                            Edit channel
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              removeChannel(c.id);
                              toast.success("Channel disconnected");
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <div className="mt-4 rounded-xl border border-[color:var(--good)]/30 bg-[color:var(--good-bg)] p-4 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[color:var(--good)]">
            <ShieldCheck className="h-3.5 w-3.5" /> How Channels Work
          </div>
          <p className="mt-1 leading-relaxed text-foreground">
            Each channel is an inbound transport for customer messages. When a customer messages your WhatsApp number or web chat, it routes to the assigned AI agent — which responds in your tone, cites sources from your knowledge base, and escalates to a human when needed. Disconnecting a channel preserves existing conversations.
          </p>
        </div>
      </div>

      <ConnectWhatsAppDialog
        open={dialogOpen}
        onOpenChange={(open) => setConnectMode(open ? connectMode : "closed")}
        mode={connectMode === "closed" ? "coexistence" : connectMode}
      />
    </div>
  );
}
