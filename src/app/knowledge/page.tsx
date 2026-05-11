"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Send,
  FileText,
  ShieldCheck,
  Upload,
  File,
  FileSpreadsheet,
  Globe,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Bot,
  User,
  AlertTriangle,
  MessageSquare,
  Database,
  Settings2,
  MessagesSquare,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiTile } from "@/components/kpi-tile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  aiPersonas,
  kbDocuments,
  recentQa,
  roleplayPrompts,
  sampleChat,
  sops,
  suggestedQuestions,
  type ChatMessage,
  type KbDocument,
} from "@/lib/mock-data";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ---------- Canned AI answers ----------

const CANNED_ANSWERS: Record<string, { answer: string; sources: string[] }> = {
  default: {
    answer: "I can answer that. The relevant policy is in your handbook (last updated January 2026). In short: the AI reads your own documents, finds the right paragraph, and quotes it — it never makes things up.",
    sources: ["KB-06"],
  },
  safety: {
    answer: "No. Your safety SOP sets the hard wind-speed limit at 22 knots. If conditions are borderline, double-check with the operations lead before proceeding.",
    sources: ["KB-02"],
  },
  renewal: {
    answer: "If the renewal is worth more than S$25,000 a year AND the customer hasn't replied to 2 AI reminders, hand it to the account owner. The threshold was raised from S$20K in January 2026.",
    sources: ["KB-01"],
  },
  data: {
    answer: "Yes — as long as the deletion happens within 30 days of the request, and the deletion is logged in the audit trail.",
    sources: ["KB-06"],
  },
  hiring: {
    answer: "Engineer roles need a valid certificate at application. Candidates missing it are auto-rejected with a clear reason. HR can override in one click if context warrants.",
    sources: ["KB-05"],
  },
  welcome: {
    answer: "Our team is Mon–Fri 9am–6pm SG. New installations typically take 5–7 working days from signed quote.",
    sources: ["KB-04"],
  },
};

function getCannedAnswer(q: string) {
  const lower = q.toLowerCase();
  if (lower.includes("knot") || lower.includes("wind") || lower.includes("safe") || lower.includes("site")) return CANNED_ANSWERS.safety;
  if (lower.includes("renewal") || lower.includes("escalat")) return CANNED_ANSWERS.renewal;
  if (lower.includes("delete") || lower.includes("retention") || lower.includes("pdpa") || lower.includes("data")) return CANNED_ANSWERS.data;
  if (lower.includes("cv") || lower.includes("hire") || lower.includes("candidate") || lower.includes("cert")) return CANNED_ANSWERS.hiring;
  if (lower.includes("install") || lower.includes("lead time") || lower.includes("hours") || lower.includes("welcome") || lower.includes("new customer")) return CANNED_ANSWERS.welcome;
  return CANNED_ANSWERS.default;
}

// Customer-facing replies are shared with the WhatsApp webhook so the same
// canned answers fire whether the message arrives via the in-browser chat or
// via the live Twilio sandbox.
import { getCustomerReply } from "@/lib/customer-replies";

// ---------- File-type helpers ----------

function FileIcon({ type, className }: { type: KbDocument["type"]; className?: string }) {
  if (type === "xlsx") return <FileSpreadsheet className={className} />;
  if (type === "url") return <Globe className={className} />;
  return <File className={className} />;
}

function StatusBadge({ status }: { status: KbDocument["status"] }) {
  if (status === "indexed") {
    return (
      <Badge variant="outline" className="rounded-full border-[color:var(--good)]/40 text-[10px] text-[color:var(--good)]">
        <CheckCircle2 className="mr-1 h-2.5 w-2.5" /> Indexed
      </Badge>
    );
  }
  if (status === "indexing") {
    return (
      <Badge variant="outline" className="rounded-full border-amber-300/60 text-[10px] text-amber-700">
        <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" /> Indexing
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="rounded-full border-destructive/40 text-[10px] text-destructive">
      <AlertCircle className="mr-1 h-2.5 w-2.5" /> Failed
    </Badge>
  );
}

// ============================================================
// Page
// ============================================================

export default function KnowledgePage() {
  const askAssistant = useDemoStore((s) => s.askAssistant);
  const sessionQuestions = useDemoStore((s) => s.recentQuestions);

  // Team Q&A state
  const [question, setQuestion] = useState("");
  const askTeam = (q: string) => {
    const { answer, sources } = getCannedAnswer(q);
    askAssistant(q, answer, sources);
    setQuestion("");
    toast.success("Answered — with the source quoted", { description: sources.join(" · ") });
  };
  const teamCombined = [
    ...sessionQuestions.map((q) => ({ id: q.id, asker: "You · live demo", question: q.q, answer: q.a, sources: q.sources, time: q.time })),
    ...recentQa,
  ];

  // Customer chat state
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChat);
  const [customerInput, setCustomerInput] = useState("");
  const [liveCount, setLiveCount] = useState(0);
  const sincePollRef = useRef(Date.now());

  // Poll the WhatsApp webhook endpoint for incoming live messages every 2s.
  // When a participant sends a WhatsApp message to the Twilio sandbox, the
  // webhook receiver stores it; this polling renders it into the chat panel.
  useEffect(() => {
    const tick = async () => {
      try {
        const res = await fetch(`/api/whatsapp/messages?since=${sincePollRef.current}`);
        if (!res.ok) return;
        const data = (await res.json()) as {
          messages: {
            id: string;
            from: string;
            fromMasked: string;
            body: string;
            receivedAt: string;
            aiReply?: string;
            aiSources?: string[];
          }[];
        };
        if (!data.messages || data.messages.length === 0) return;

        const newChunks: ChatMessage[] = [];
        for (const m of data.messages) {
          const time = new Date(m.receivedAt).toLocaleTimeString("en-SG", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          newChunks.push({
            id: `wa-c-${m.id}`,
            role: "customer",
            content: `[${m.fromMasked}] ${m.body}`,
            time,
          });
          if (m.aiReply) {
            newChunks.push({
              id: `wa-a-${m.id}`,
              role: "ai",
              content: m.aiReply,
              sources: m.aiSources,
              time,
            });
          }
          sincePollRef.current = Math.max(sincePollRef.current, new Date(m.receivedAt).getTime());
        }
        setMessages((prev) => [...prev, ...newChunks]);
        setLiveCount((c) => c + data.messages.length);
        toast.success(`Live WhatsApp message · from ${data.messages[0].fromMasked}`, {
          description: data.messages[0].body.slice(0, 80),
        });
      } catch {
        // Silently ignore network errors so the demo isn't disrupted by them.
      }
    };
    const intervalId = setInterval(tick, 2000);
    return () => clearInterval(intervalId);
  }, []);
  const customerSend = (text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-SG", { hour: "numeric", minute: "2-digit", hour12: true });
    const customerMsg: ChatMessage = { id: `C-${Date.now()}`, role: "customer", content: text.trim(), time };
    const reply = getCustomerReply(text);
    const aiMsg: ChatMessage = { id: `A-${Date.now() + 1}`, role: "ai", content: reply.answer, sources: reply.sources, time };
    const newMsgs: ChatMessage[] = [...messages, customerMsg, aiMsg];
    if (reply.escalateReason) {
      newMsgs.push({
        id: `S-${Date.now() + 2}`,
        role: "system",
        content: `Escalation · ${reply.escalateReason} · ${reply.escalateTo}`,
        time,
        isEscalation: true,
      });
      toast.warning("AI escalated to a human", { description: reply.escalateTo });
    }
    setMessages(newMsgs);
    setCustomerInput("");
  };
  const resetChat = () => {
    setMessages(sampleChat);
    setCustomerInput("");
    toast.info("Conversation reset");
  };

  // KB state
  const [kbList, setKbList] = useState(kbDocuments);
  const handleMockUpload = () => {
    const newDoc: KbDocument = {
      id: `KB-${Date.now()}`,
      filename: "New Upload · Service Catalog Q2.pdf",
      type: "pdf",
      sizeKb: 410,
      status: "indexing",
      uploadedAt: "Just now",
      category: "Sales",
      excerpt: "Indexing in progress · AI is reading and chunking the document…",
    };
    setKbList([newDoc, ...kbList]);
    toast.success("Uploaded · indexing now", { description: "Ready in ~30 seconds" });
  };

  const persona = aiPersonas[0];

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Knowledge Agent · Time Saved & Risk Reduced"
        title="Unified AI Knowledge Assistant"
        subtitle="Trained on your manuals, contracts, and policies. Answers customer questions on WhatsApp and email, and supports your team's internal queries. Every answer is cited to its source."
      />

      <div className="grid grid-cols-1 gap-3 px-8 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Customer Conversations Today" value="42" sub="WhatsApp · Web Chat · Email" tone="info" />
        <KpiTile label="Internal Questions Today" value={`${recentQa.length + sessionQuestions.length}`} sub="Operations, Sales, HR, Compliance" tone="info" />
        <KpiTile label="Escalated to Humans" value="3" sub="Per policy · with full context" tone="warn" />
        <KpiTile label="Documents in Knowledge Base" value={`${kbList.length}`} sub={`${kbList.filter((d) => d.status === "indexed").length} indexed · ${kbList.filter((d) => d.status === "indexing").length} indexing`} tone="good" />
      </div>

      <div className="mt-6 px-8">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList>
            <TabsTrigger value="chat"><MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Customer Chat</TabsTrigger>
            <TabsTrigger value="team"><MessagesSquare className="mr-1.5 h-3.5 w-3.5" /> Team Q&A</TabsTrigger>
            <TabsTrigger value="kb"><Database className="mr-1.5 h-3.5 w-3.5" /> Knowledge Base</TabsTrigger>
            <TabsTrigger value="persona"><Settings2 className="mr-1.5 h-3.5 w-3.5" /> AI Persona</TabsTrigger>
          </TabsList>

          {/* ================= CUSTOMER CHAT ================= */}
          <TabsContent value="chat" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Chat panel */}
              <Card className="overflow-hidden p-0 lg:col-span-2">
                <div className="flex items-center justify-between border-b px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 border">
                      <AvatarFallback className="bg-amber-100 text-amber-800 text-[10px] font-semibold">CX</AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <div className="text-sm font-medium">
                        {liveCount > 0 ? `Live · ${liveCount} WhatsApp message${liveCount === 1 ? "" : "s"} received` : "Customer · J. Tan (Gold Member)"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">Via WhatsApp · Live</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-[color:var(--good)]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--good)] opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--good)]" />
                      </span>
                      AI Online
                    </span>
                    <Button size="sm" variant="ghost" onClick={resetChat}>Reset</Button>
                  </div>
                </div>

                <div className="max-h-[28rem] overflow-y-auto bg-muted/10 p-4 space-y-3">
                  {messages.map((m) => {
                    if (m.role === "system") {
                      return (
                        <div key={m.id} className="text-center">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                              m.isEscalation
                                ? "border-destructive/40 bg-destructive/5 text-destructive"
                                : "border-muted-foreground/30 bg-muted/40 text-muted-foreground"
                            )}
                          >
                            {m.isEscalation ? <AlertTriangle className="h-2.5 w-2.5" /> : null}
                            {m.content}
                          </span>
                        </div>
                      );
                    }
                    const isCustomer = m.role === "customer";
                    return (
                      <div key={m.id} className={cn("flex items-start gap-2", isCustomer ? "justify-end" : "")}>
                        {!isCustomer ? (
                          <Avatar className="h-7 w-7 border">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">AI</AvatarFallback>
                          </Avatar>
                        ) : null}
                        <div className={cn("max-w-[80%] rounded-2xl px-3 py-2", isCustomer ? "bg-primary text-primary-foreground" : "bg-card border")}>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{m.content}</p>
                          {m.sources && m.sources.length > 0 ? (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {m.sources.map((s) => (
                                <Badge key={s} variant="outline" className="rounded-full bg-card/70 text-[10px]">
                                  <FileText className="mr-0.5 h-2.5 w-2.5" /> {s}
                                </Badge>
                              ))}
                            </div>
                          ) : null}
                          <div className={cn("mt-1 text-[10px]", isCustomer ? "text-primary-foreground/70" : "text-muted-foreground")}>
                            {m.time}
                          </div>
                        </div>
                        {isCustomer ? (
                          <Avatar className="h-7 w-7 border">
                            <AvatarFallback className="bg-amber-100 text-amber-800 text-[10px] font-semibold">CX</AvatarFallback>
                          </Avatar>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <div className="border-t p-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type as a customer… (or click a roleplay prompt on the right)"
                      value={customerInput}
                      onChange={(e) => setCustomerInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") customerSend(customerInput); }}
                    />
                    <Button onClick={() => customerSend(customerInput)} disabled={!customerInput.trim()}>
                      <Send className="mr-1.5 h-3.5 w-3.5" /> Send
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Roleplay prompts */}
              <Card className="overflow-hidden p-0">
                <div className="border-b px-4 py-3">
                  <div className="text-sm font-semibold">Roleplay Prompts</div>
                  <p className="text-[11px] text-muted-foreground">Click any to send as the customer.</p>
                </div>

                {/* Escalation prompts */}
                <div className="border-b bg-[color:var(--warn-bg)]/30 px-4 py-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--warn)]">
                    <AlertTriangle className="h-2.5 w-2.5" /> Escalates to a Human
                  </div>
                </div>
                <div className="divide-y">
                  {roleplayPrompts
                    .filter((p) => p.kind === "escalation")
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => customerSend(p.text)}
                        className="group w-full px-4 py-3 text-left transition-colors hover:bg-[color:var(--warn-bg)]/40"
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--warn)]">
                          {p.label}
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-foreground/80">"{p.text}"</p>
                      </button>
                    ))}
                </div>

                {/* Factual prompts */}
                <div className="border-y bg-[color:var(--good-bg)]/30 px-4 py-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--good)]">
                    <CheckCircle2 className="h-2.5 w-2.5" /> AI Answers Directly
                  </div>
                </div>
                <div className="divide-y">
                  {roleplayPrompts
                    .filter((p) => p.kind === "factual")
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => customerSend(p.text)}
                        className="group w-full px-4 py-3 text-left transition-colors hover:bg-[color:var(--good-bg)]/40"
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--good)]">
                          {p.label}
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-foreground/80">"{p.text}"</p>
                      </button>
                    ))}
                </div>

                <div className="border-t bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground">
                  The escalation prompts route the conversation to a human teammate; the factual ones are answered directly by the AI from the knowledge base.
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ================= TEAM Q&A ================= */}
          <TabsContent value="team" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <section className="lg:col-span-2">
                <Card className="p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Ask the assistant — internal team
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Same AI brain · talking to your team instead of your customers. Same sources, more direct tone.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="e.g. Can we go ahead with the site job at 24 knots wind?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && question.trim()) askTeam(question.trim()); }}
                      className="flex-1"
                    />
                    <Button onClick={() => question.trim() && askTeam(question.trim())} disabled={!question.trim()}>
                      <Send className="mr-1.5 h-3.5 w-3.5" /> Ask
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => askTeam(q)}
                        className="rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </Card>

                <div className="mt-4">
                  <div className="mb-2 flex items-end justify-between">
                    <h2 className="text-base font-semibold">Today's team questions</h2>
                    <Badge variant="outline" className="rounded-full text-[10px]">
                      All saved with source
                    </Badge>
                  </div>
                  <Card className="divide-y overflow-hidden p-0">
                    {teamCombined.map((qa) => (
                      <div key={qa.id} className="px-4 py-3">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[11px] text-muted-foreground">{qa.time}</span>
                          <Badge variant="outline" className="rounded-full text-[10px]">{qa.asker}</Badge>
                        </div>
                        <div className="mt-1 text-sm font-medium">Q: {qa.question}</div>
                        <div className="mt-1 flex items-start gap-1.5 text-sm">
                          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="text-foreground">{qa.answer}</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {qa.sources.map((s) => (
                            <Badge key={s} variant="secondary" className="rounded-full text-[10px]">
                              <FileText className="mr-1 h-2.5 w-2.5" /> {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              </section>

              <aside>
                <div className="mb-2">
                  <h2 className="text-base font-semibold">What it has read</h2>
                  <p className="text-xs text-muted-foreground">Your manuals and policies.</p>
                </div>
                <Card className="divide-y overflow-hidden p-0">
                  {sops.map((s) => (
                    <div key={s.id} className="px-4 py-3">
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="text-[11px] text-muted-foreground">{s.section}</div>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{s.excerpt}</p>
                    </div>
                  ))}
                </Card>
              </aside>
            </div>
          </TabsContent>

          {/* ================= KNOWLEDGE BASE ================= */}
          <TabsContent value="kb" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Upload zone */}
              <Card className="lg:col-span-1 p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Upload className="h-3.5 w-3.5" /> Add to knowledge base
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Drag PDFs, docs, spreadsheets — or paste a URL. AI indexes them in ~30 seconds.
                </p>
                <button
                  type="button"
                  onClick={handleMockUpload}
                  className="mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-8 text-center transition-colors hover:border-primary/60 hover:bg-primary/10"
                >
                  <Upload className="h-6 w-6 text-primary" />
                  <div className="text-sm font-medium text-primary">Click to upload</div>
                  <div className="text-[11px] text-muted-foreground">PDF · DOCX · XLSX · URL</div>
                </button>
                <div className="mt-3 text-[11px] text-muted-foreground space-y-1">
                  <p>• AI chunks each document and builds a search index.</p>
                  <p>• Sensitive docs stay in your workspace — never leak across customers.</p>
                  <p>• Updates roll out instantly — old policy stops being quoted.</p>
                </div>
              </Card>

              {/* Documents list */}
              <Card className="overflow-hidden p-0 lg:col-span-2">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold">Indexed documents</div>
                    <p className="text-[11px] text-muted-foreground">Click any document to see what AI extracted.</p>
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px]">
                    {kbList.length} documents
                  </Badge>
                </div>
                <div className="max-h-[28rem] divide-y overflow-y-auto">
                  {kbList.map((d) => (
                    <div key={d.id} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30">
                      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <FileIcon type={d.type} className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-sm font-medium">{d.filename}</span>
                          <Badge variant="outline" className="rounded-full text-[10px]">{d.category}</Badge>
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          {(d.sizeKb / 1024).toFixed(d.sizeKb >= 100 ? 1 : 2)} MB · uploaded {d.uploadedAt}
                        </div>
                        <p className="mt-1 line-clamp-1 text-[11px] text-foreground/70">{d.excerpt}</p>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ================= AI PERSONA ================= */}
          <TabsContent value="persona" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Persona overview */}
              <Card className="p-5 lg:col-span-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Bot className="h-3.5 w-3.5" /> Active persona
                </div>
                <div className="mt-3 text-base font-semibold">{persona.name}</div>
                <p className="mt-1 text-xs text-muted-foreground">{persona.description}</p>
                <Badge variant="outline" className="mt-3 rounded-full text-[10px]">
                  Used on: {persona.activeFor}
                </Badge>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">Tone</div>
                    <ul className="mt-1 space-y-0.5 text-xs">
                      {persona.toneTraits.map((t) => (
                        <li key={t} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--good)]" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground">What AI can do</div>
                    <ul className="mt-1 space-y-0.5 text-xs">
                      {persona.scopeRules.map((t) => (
                        <li key={t} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--good)]" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Escalation rules + system prompt */}
              <div className="space-y-4 lg:col-span-2">
                <Card className="p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-destructive">
                    <AlertTriangle className="h-3.5 w-3.5" /> Hand-off to humans · escalation rules
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    These trigger an automatic hand-off to a human. The customer never gets a wrong answer — AI knows when to ask for help.
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {persona.escalationRules.map((r) => (
                      <div key={r} className="flex items-start gap-2 rounded-md border border-[color:var(--warn)]/30 bg-[color:var(--warn-bg)]/40 p-2.5">
                        <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--warn)]" />
                        <span className="text-xs">{r}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      <Settings2 className="h-3.5 w-3.5" /> System prompt · what AI is told
                    </div>
                    <Badge variant="outline" className="rounded-full text-[10px]">Editable · with approval</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This is exactly what the AI reads before every conversation. Your team controls it · no prompt engineers needed.
                  </p>
                  <Textarea
                    defaultValue={persona.systemPromptPreview}
                    className="mt-3 h-56 font-mono text-xs"
                  />
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost">Revert</Button>
                    <Button size="sm">Save changes</Button>
                  </div>
                </Card>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[color:var(--good)]/30 bg-[color:var(--good-bg)] p-4 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[color:var(--good)]">
                <ShieldCheck className="h-3.5 w-3.5" /> Why this matters
              </div>
              <p className="mt-1 leading-relaxed text-foreground">
                You control how AI sounds, what it can talk about, and when it must call for a human — all in plain English, no code. Same brain serves customers and your team; only the tone changes.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
