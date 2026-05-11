"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  MessageCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Copy,
  Smartphone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoStore, type ConnectedChannel } from "@/lib/store";
import { cn } from "@/lib/utils";

type Step = "intro" | "connecting" | "select-number" | "confirming" | "success";

const SAMPLE_NUMBERS = [
  { id: "+65 8123 4567", waba: "WABA-201", verified: true },
  { id: "+65 8987 6543", waba: "WABA-201", verified: true },
];

export function ConnectWhatsAppDialog({
  open,
  onOpenChange,
  mode = "coexistence",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "coexistence" | "cloud" | "sandbox";
}) {
  const [step, setStep] = useState<Step>("intro");
  const [selectedNumber, setSelectedNumber] = useState<string>(SAMPLE_NUMBERS[0].id);
  const addChannel = useDemoStore((s) => s.addChannel);

  useEffect(() => {
    if (!open) {
      setTimeout(() => setStep("intro"), 200);
    }
  }, [open]);

  const isSandbox = mode === "sandbox";
  const startLabel = isSandbox
    ? "Claim sandbox number"
    : mode === "cloud"
    ? "Use a new number (Cloud API)"
    : "Connect existing WhatsApp Business App";

  const handleStart = () => {
    if (isSandbox) {
      // Sandbox: skip the Meta steps, go straight to confirming
      setStep("confirming");
      setTimeout(() => setStep("success"), 1200);
    } else {
      setStep("connecting");
      setTimeout(() => setStep("select-number"), 1500);
    }
  };

  const handleSelectNumber = () => {
    setStep("confirming");
    setTimeout(() => setStep("success"), 1200);
  };

  // Real Twilio sandbox credentials, pulled from env. Falls back to placeholders
  // so the dialog still renders before the .env.local file is filled in.
  const sandboxNumber = process.env.NEXT_PUBLIC_TWILIO_SANDBOX_NUMBER || "14155238886";
  const sandboxJoinCode = process.env.NEXT_PUBLIC_TWILIO_SANDBOX_JOIN_CODE || "YOUR-JOIN-CODE";
  const joinPhrase = `join ${sandboxJoinCode}`;
  const waMeUrl = `https://wa.me/${sandboxNumber}?text=${encodeURIComponent(joinPhrase)}`;
  const displaySandboxNumber = `+${sandboxNumber.slice(0, sandboxNumber.length - 10)} ${sandboxNumber.slice(-10, -7)} ${sandboxNumber.slice(-7, -4)} ${sandboxNumber.slice(-4)}`;

  const handleFinish = () => {
    const number = isSandbox ? displaySandboxNumber : selectedNumber;
    const newChannel: ConnectedChannel = {
      id: `CH-wa-${Date.now()}`,
      kind: isSandbox ? "whatsapp-sandbox" : "whatsapp",
      displayName: isSandbox ? "WhatsApp Sandbox" : "WhatsApp · Main",
      status: "active",
      phoneNumber: number,
      wabaId: isSandbox ? "WABA-SANDBOX" : SAMPLE_NUMBERS.find((n) => n.id === selectedNumber)?.waba,
      defaultAssignee: "AI Agent · Aria",
      createdAt: "Just now",
    };
    addChannel(newChannel);
    toast.success("WhatsApp connected", {
      description: `${newChannel.displayName} · ${number}`,
    });
    onOpenChange(false);
  };

  const copyJoinPhrase = () => {
    navigator.clipboard.writeText(joinPhrase);
    toast.success("Copied join phrase");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            {isSandbox ? "Connect Platform Sandbox" : "Connect WhatsApp Business"}
          </DialogTitle>
          <DialogDescription>
            {isSandbox
              ? "Use a shared sandbox number for testing. Participants opt in by sending a join code first."
              : "Link your existing WhatsApp Business number through Meta's Embedded Signup."}
          </DialogDescription>
        </DialogHeader>

        {/* INTRO */}
        {step === "intro" ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#25D366]/10">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">What happens next</div>
                  <ol className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                    {isSandbox ? (
                      <>
                        <li>1. We claim a sandbox number for your workspace.</li>
                        <li>2. Participants message "join voltade" to opt in.</li>
                        <li>3. The AI agent starts replying immediately.</li>
                      </>
                    ) : (
                      <>
                        <li>1. A Facebook popup opens for Meta authentication.</li>
                        <li>2. You select your business and WhatsApp number.</li>
                        <li>3. Meta confirms permissions and returns to this page.</li>
                        <li>4. The AI agent is connected and ready to respond.</li>
                      </>
                    )}
                  </ol>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-md border border-[color:var(--good)]/30 bg-[color:var(--good-bg)] p-3 text-xs">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--good)]" />
              <p className="text-foreground">
                Voltade never stores your Meta password. Access tokens are envelope-encrypted with rotation every 60 days.
              </p>
            </div>
          </div>
        ) : null}

        {/* CONNECTING */}
        {step === "connecting" ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <div className="text-sm font-semibold">Authenticating with Meta…</div>
              <div className="mt-1 text-xs text-muted-foreground">Verifying your WhatsApp Business account.</div>
            </div>
          </div>
        ) : null}

        {/* SELECT NUMBER */}
        {step === "select-number" ? (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">Choose a WhatsApp Business number to connect:</div>
            <div className="space-y-2">
              {SAMPLE_NUMBERS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNumber(n.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors",
                    selectedNumber === n.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    <div>
                      <div className="text-sm font-medium">{n.id}</div>
                      <div className="text-[11px] text-muted-foreground">WABA ID: {n.waba}</div>
                    </div>
                  </div>
                  {n.verified ? (
                    <Badge variant="outline" className="rounded-full border-[color:var(--good)]/40 text-[10px] text-[color:var(--good)]">
                      <CheckCircle2 className="mr-1 h-2.5 w-2.5" /> Verified
                    </Badge>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* CONFIRMING */}
        {step === "confirming" ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <div className="text-sm font-semibold">Confirming permissions…</div>
              <div className="mt-1 text-xs text-muted-foreground">Setting up webhook and message routing.</div>
            </div>
          </div>
        ) : null}

        {/* SUCCESS */}
        {step === "success" ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--good-bg)]">
                <CheckCircle2 className="h-5 w-5 text-[color:var(--good)]" />
              </div>
              <div className="text-center">
                <div className="text-base font-semibold">{isSandbox ? "Sandbox Number Claimed" : "WhatsApp Connected"}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {isSandbox
                    ? "Have participants scan the QR code below to opt in."
                    : "Your AI agent will start responding to customer messages immediately."}
                </div>
              </div>
            </div>

            {isSandbox ? (
              <>
                <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-4">
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <QRCodeSVG
                      value={waMeUrl}
                      size={180}
                      level="M"
                      marginSize={0}
                      bgColor="#ffffff"
                      fgColor="#0a0a0a"
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-sm font-medium">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      Scan with phone camera
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Opens WhatsApp with the join code pre-filled. Participant just taps send.
                    </p>
                  </div>
                </div>

                <a
                  href={waMeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#25D366]/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Open in WhatsApp
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>

                <div className="rounded-md border bg-muted/30 p-3 text-xs">
                  <div className="text-muted-foreground">Or send manually:</div>
                  <div className="mt-1.5 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-muted-foreground">Number:</span>
                      <span className="font-mono font-medium tabular-nums">{displaySandboxNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-muted-foreground">Message:</span>
                      <code className="rounded bg-background px-1.5 py-0.5 font-mono font-medium">{joinPhrase}</code>
                      <button
                        type="button"
                        onClick={copyJoinPhrase}
                        className="ml-auto rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Copy join phrase"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {sandboxJoinCode === "YOUR-JOIN-CODE" ? (
                  <div className="flex items-start gap-2 rounded-md border border-amber-300/60 bg-amber-50 p-3 text-xs">
                    <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                    <p className="text-foreground">
                      <span className="font-semibold">Setup needed.</span> Fill in <code className="rounded bg-background px-1">NEXT_PUBLIC_TWILIO_SANDBOX_JOIN_CODE</code> in <code className="rounded bg-background px-1">.env.local</code> with your real Twilio sandbox join code, then restart the dev server.
                    </p>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Phone number</div>
                    <div className="font-medium tabular-nums">{selectedNumber}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">WABA ID</div>
                    <div className="font-medium">{SAMPLE_NUMBERS.find((n) => n.id === selectedNumber)?.waba}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Default assignee</div>
                    <div className="font-medium">AI Agent · Aria</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--good)]" />
                      <span className="font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter className="gap-2">
          {step === "intro" ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleStart}>
                <MessageCircle className="mr-1.5 h-4 w-4" />
                {startLabel}
              </Button>
            </>
          ) : null}
          {step === "select-number" ? (
            <>
              <Button variant="outline" onClick={() => setStep("intro")}>Back</Button>
              <Button onClick={handleSelectNumber}>Continue</Button>
            </>
          ) : null}
          {step === "success" ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button onClick={handleFinish}>
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Open Channel
              </Button>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
