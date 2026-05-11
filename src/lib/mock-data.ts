// Demo data for a multi-branch spa & wellness business.
// Plain language · no jargon · abstract IDs and initials only.

export type IndustryTag =
  | "gold-member"
  | "silver-member"
  | "corporate-wellness"
  | "hotel-partner"
  | "gym-partner"
  | "event-booking";

export const INDUSTRY_LABEL: Record<IndustryTag, string> = {
  "gold-member": "Gold member",
  "silver-member": "Silver member",
  "corporate-wellness": "Corporate wellness",
  "hotel-partner": "Hotel partner",
  "gym-partner": "Gym partner",
  "event-booking": "Event booking",
};

// ---------- Theme 1: Customer Engagement ----------

export type RenewalStage = "urgent" | "soon" | "warming" | "quiet";

export type DealStage = "reached-out" | "in-conversation" | "quote-sent" | "negotiating" | "signed";

export const DEAL_STAGE_ORDER: DealStage[] = ["reached-out", "in-conversation", "quote-sent", "negotiating", "signed"];

export const DEAL_STAGE_LABEL: Record<DealStage, string> = {
  "reached-out": "Reached out",
  "in-conversation": "In conversation",
  "quote-sent": "Quote sent",
  negotiating: "Negotiating",
  signed: "Signed",
};

export type ActionOwner = "ai" | "you" | "customer" | "manager";

export const OWNER_META: Record<ActionOwner, { label: string; sub: string; initials: string; tone: "info" | "warn" | "good" | "neutral" }> = {
  ai: { label: "AI Agent", sub: "Handling automatically", initials: "AI", tone: "info" },
  you: { label: "You", sub: "Action required", initials: "YOU", tone: "warn" },
  customer: { label: "Customer", sub: "Awaiting response", initials: "CX", tone: "neutral" },
  manager: { label: "Spa Manager", sub: "Escalated to human", initials: "MGR", tone: "warn" },
};

export type ChaseChannel = "email" | "whatsapp" | "sms" | "phone";
export type ChaseOutcome = "sent" | "opened" | "replied" | "no-response" | "escalated";

export type ChaseEvent = {
  at: string;
  channel: ChaseChannel;
  outcome: ChaseOutcome;
  note?: string;
};

export type Contract = {
  id: string;
  customerId: string;
  product: string;
  annualValueSgd: number;
  endsOn: string;
  stage: RenewalStage;
  pipelineStage: DealStage;
  daysInStage: number;
  aiAction: string;
  aiNeedsYou: boolean;
  nextActionOwner: ActionOwner;
  nextActionDetail: string;
  chaseHistory: ChaseEvent[];
  nextChaseAt: string;
  escalation?: { to: string; reason: string; at: string };
};

export const contracts: Contract[] = [
  {
    id: "R-01",
    customerId: "C-1042",
    product: "Annual Gold membership",
    annualValueSgd: 2400,
    endsOn: "12 Jun",
    stage: "soon",
    pipelineStage: "quote-sent",
    daysInStage: 1,
    aiAction: "AI drafted the renewal quote — your approval needed",
    aiNeedsYou: true,
    nextActionOwner: "you",
    nextActionDetail: "Approve & send the drafted renewal",
    chaseHistory: [
      { at: "3 days ago", channel: "email", outcome: "opened", note: "Renewal heads-up email" },
      { at: "Yesterday", channel: "whatsapp", outcome: "replied", note: "Member asked for the quote" },
      { at: "Today 9:14am", channel: "email", outcome: "sent", note: "Quote drafted by AI · awaiting your approval" },
    ],
    nextChaseAt: "Tomorrow 10am if no reply once sent",
  },
  {
    id: "R-02",
    customerId: "C-1108",
    product: "Couples retreat add-on (4 sessions)",
    annualValueSgd: 1200,
    endsOn: "20 Jun",
    stage: "soon",
    pipelineStage: "negotiating",
    daysInStage: 2,
    aiAction: "Customer asked for 5% off — outside AI's auto-approve band",
    aiNeedsYou: true,
    nextActionOwner: "you",
    nextActionDetail: "Decide on the 5% discount request",
    chaseHistory: [
      { at: "4 days ago", channel: "whatsapp", outcome: "opened", note: "Sent 2 renewal options" },
      { at: "2 days ago", channel: "whatsapp", outcome: "replied", note: "Asked for 5% off" },
    ],
    nextChaseAt: "Waiting on your decision · AI replies within 5 min once you decide",
    escalation: {
      to: "You · Sales rep",
      reason: "Customer asked for 5% — AI can auto-approve up to 3% only",
      at: "Today 11:42am",
    },
  },
  {
    id: "R-03",
    customerId: "C-1115",
    product: "Corporate wellness package (hotel)",
    annualValueSgd: 42000,
    endsOn: "8 Jul",
    stage: "warming",
    pipelineStage: "reached-out",
    daysInStage: 3,
    aiAction: "AI will send the renewal pack on Monday 9am",
    aiNeedsYou: false,
    nextActionOwner: "ai",
    nextActionDetail: "AI to send renewal pack on Monday 9am",
    chaseHistory: [],
    nextChaseAt: "Monday 9am · renewal pack to GM",
  },
  {
    id: "R-04",
    customerId: "C-1133",
    product: "Sports recovery bundle",
    annualValueSgd: 9600,
    endsOn: "15 Jul",
    stage: "warming",
    pipelineStage: "in-conversation",
    daysInStage: 4,
    aiAction: "AI spotted an upsell — premium bundle?",
    aiNeedsYou: false,
    nextActionOwner: "ai",
    nextActionDetail: "AI to test upsell pitch in next email",
    chaseHistory: [
      { at: "5 days ago", channel: "email", outcome: "opened", note: "Renewal heads-up · 2 months ahead" },
      { at: "2 days ago", channel: "whatsapp", outcome: "replied", note: "Member said usage growing" },
    ],
    nextChaseAt: "Tomorrow · AI to pitch premium bundle",
  },
  {
    id: "R-05",
    customerId: "C-1156",
    product: "Office wellness · monthly visits",
    annualValueSgd: 26400,
    endsOn: "29 Jul",
    stage: "quiet",
    pipelineStage: "reached-out",
    daysInStage: 8,
    aiAction: "Quarterly check-in sent — all healthy",
    aiNeedsYou: false,
    nextActionOwner: "customer",
    nextActionDetail: "Waiting for customer's casual reply",
    chaseHistory: [
      { at: "8 days ago", channel: "email", outcome: "opened", note: "Quarterly check-in" },
    ],
    nextChaseAt: "Next chaser in 6 weeks if no reply",
  },
  {
    id: "R-06",
    customerId: "C-1171",
    product: "Hotel spa-in-residence agreement",
    annualValueSgd: 12000,
    endsOn: "2 Jun",
    stage: "urgent",
    pipelineStage: "in-conversation",
    daysInStage: 9,
    aiAction: "URGENT — customer hasn't replied in 9 days, escalated",
    aiNeedsYou: true,
    nextActionOwner: "manager",
    nextActionDetail: "Call customer directly — 9 days, no reply after 3 AI nudges",
    chaseHistory: [
      { at: "9 days ago", channel: "email", outcome: "opened", note: "Renewal pack sent" },
      { at: "6 days ago", channel: "whatsapp", outcome: "no-response", note: "Friendly nudge" },
      { at: "3 days ago", channel: "email", outcome: "no-response", note: "Firmer nudge with deadline" },
      { at: "Yesterday", channel: "sms", outcome: "no-response", note: "Final automated reminder" },
      { at: "Today 7:30am", channel: "phone", outcome: "escalated", note: "Auto-escalated to spa manager" },
    ],
    nextChaseAt: "Spa manager to call directly today",
    escalation: {
      to: "Spa manager · A. Lim",
      reason: "Auto-escalated after 3 unanswered AI reminders (policy: G-04)",
      at: "Today 7:30am",
    },
  },
];

export type Quote = {
  id: string;
  customerId: string;
  product: string;
  amountSgd: number;
  status: "drafting" | "pending-approval" | "sent" | "accepted";
  aiNote: string;
  nextActionOwner: ActionOwner;
  escalation?: { to: string; reason: string; at: string };
};

export const quotes: Quote[] = [
  { id: "Q-01", customerId: "C-1042", product: "Renewal · Gold membership", amountSgd: 2500, status: "pending-approval", aiNote: "Priced from last year + small inflation bump", nextActionOwner: "you" },
  { id: "Q-02", customerId: "C-1071", product: "Mother's Day · 90-min special", amountSgd: 280, status: "sent", aiNote: "Sent on WhatsApp — opened twice, no reply yet", nextActionOwner: "customer" },
  { id: "Q-03", customerId: "C-1098", product: "Add-on · Hot stone series (6 sessions)", amountSgd: 720, status: "drafting", aiNote: "AI pulling member's past treatment history…", nextActionOwner: "ai" },
  { id: "Q-04", customerId: "C-1115", product: "Renewal · Corporate wellness (hotel)", amountSgd: 43200, status: "accepted", aiNote: "Customer signed at 10:42 today 🎉", nextActionOwner: "ai" },
  { id: "Q-05", customerId: "C-1133", product: "Upgrade · Premium recovery bundle", amountSgd: 32000, status: "pending-approval", aiNote: "Above S$25K threshold — needs spa manager review", nextActionOwner: "manager", escalation: { to: "Spa manager · A. Lim", reason: "Value > S$25K · requires spa manager review per policy", at: "Today 9:08am" } },
];

export type Campaign = {
  id: string;
  name: string;
  audience: number;
  sent: number;
  opened: number;
  replied: number;
  status: "scheduled" | "sending" | "complete";
};

export const campaigns: Campaign[] = [
  { id: "CM-01", name: "Mother's Day · 90-min special + spa voucher", audience: 312, sent: 312, opened: 198, replied: 24, status: "complete" },
  { id: "CM-02", name: "Mid-year wellness check-in", audience: 187, sent: 142, opened: 89, replied: 11, status: "sending" },
  { id: "CM-03", name: "August promo · 10% off package renewals", audience: 264, sent: 0, opened: 0, replied: 0, status: "scheduled" },
];

export type CampaignEvent = {
  id: string;
  occasion: string;
  emoji: string;
  scheduledDate: string;
  audienceLabel: string;
  audienceCount: number;
  category: "festive" | "lifecycle" | "promo" | "national";
  draft: string;
};

export const campaignEvents: CampaignEvent[] = [
  {
    id: "EV-01",
    occasion: "Mother's Day · 90-min special",
    emoji: "💐",
    scheduledDate: "Today · ready to send",
    audienceLabel: "All members · personalised",
    audienceCount: 312,
    category: "festive",
    draft: "Subject: A little 'thank you, Mum' from us 💐\n\nHi there,\n\nThis Mother's Day, treat the woman who carried it all to a 90-minute restorative massage on us — or pass it on to her with our compliments.\n\nReply 'CLAIM' and we'll book her in at any of our 4 branches.\n\nWith love,\nThe spa team",
  },
  {
    id: "EV-02",
    occasion: "Mid-year wellness check-in",
    emoji: "🌿",
    scheduledDate: "1 Jun · in 3 weeks",
    audienceLabel: "Active members (no recent visit)",
    audienceCount: 187,
    category: "lifecycle",
    draft: "Subject: Quick check-in — when did you last take an hour for yourself?\n\nHi there,\n\nWe're halfway through the year — a good time for a quick pulse-check. Would you like to come in for a complimentary 20-minute neck & shoulders session, on us?\n\nReply with a date that suits you.\n\nWarm regards,\nThe spa team",
  },
  {
    id: "EV-03",
    occasion: "Mid-year renewal promo",
    emoji: "🏷️",
    scheduledDate: "15 Jun · scheduled",
    audienceLabel: "Memberships expiring in Q3",
    audienceCount: 264,
    category: "promo",
    draft: "Subject: Lock in your membership early · save 10%\n\nHi there,\n\nYour membership renews in Q3. To make it painless, we're offering 10% off if you renew before 30 June. Reply 'YES' and we'll send the renewal pack today.\n\nWarm regards,\nThe spa team",
  },
  {
    id: "EV-04",
    occasion: "National Day · SG61",
    emoji: "🇸🇬",
    scheduledDate: "9 Aug · scheduled",
    audienceLabel: "All Singapore members",
    audienceCount: 284,
    category: "national",
    draft: "Subject: Happy National Day · 61 reasons to relax\n\nHi there,\n\nFrom all of us at the spa, Happy National Day. Wishing you a long weekend filled with rest, family, and a little me-time.\n\nWarm regards,\nThe spa team",
  },
  {
    id: "EV-05",
    occasion: "F1 weekend · corporate hospitality",
    emoji: "🏎️",
    scheduledDate: "19 Sep · draft (VIP)",
    audienceLabel: "Corporate accounts (over S$50K/yr)",
    audienceCount: 28,
    category: "lifecycle",
    draft: "Subject: F1 weekend · we'd love to host your team\n\nHi there,\n\nWe're offering a Friday evening 'pre-race recovery' package at our Orchard branch for your team — head and shoulders, prosecco, terrace views.\n\nLet us know how many seats and we'll send the details.\n\nWarm regards,\nThe spa team",
  },
  {
    id: "EV-06",
    occasion: "Deepavali",
    emoji: "🪔",
    scheduledDate: "20 Oct · draft",
    audienceLabel: "All members",
    audienceCount: 312,
    category: "festive",
    draft: "Subject: Happy Deepavali · the festival of lights\n\nHi there,\n\nWishing you, your family, and your team a Deepavali full of light and warmth. May the year ahead be glowing.\n\nWarm regards,\nThe spa team",
  },
  {
    id: "EV-07",
    occasion: "Year-end thank-you + 2027 packages",
    emoji: "🎁",
    scheduledDate: "20 Dec · draft",
    audienceLabel: "All members",
    audienceCount: 312,
    category: "festive",
    draft: "Subject: A quick thank-you · and what 2027 looks like at the spa\n\nHi there,\n\nAs 2026 winds down, thank you for being part of our year. Here's a sneak peek at the new treatments coming in Q1 2027 — plus a 10% voucher to use any time before March.\n\nWarm regards,\nThe spa team",
  },
  {
    id: "EV-08",
    occasion: "Onboarding pulse · day 30",
    emoji: "🌱",
    scheduledDate: "Ongoing · weekly cohort",
    audienceLabel: "New members · 30 days in",
    audienceCount: 24,
    category: "lifecycle",
    draft: "Subject: 30 days in — how's it been?\n\nHi there,\n\nYou've been a member for a month. A quick question: is everything to your liking? If there's a therapist you really click with, or anything we can tune up, just reply.\n\nWarm regards,\nThe spa team",
  },
];

export const EVENT_CATEGORY_META: Record<CampaignEvent["category"], { label: string; text: string }> = {
  festive: { label: "Festive", text: "text-amber-700" },
  lifecycle: { label: "Lifecycle", text: "text-[color:var(--info)]" },
  promo: { label: "Promo", text: "text-[color:var(--warn)]" },
  national: { label: "National", text: "text-[color:var(--good)]" },
};

// ---------- Theme 2: Operations ----------

export type WorkOrder = {
  id: string;
  customerId: string;
  type: string;
  ageDays: number;
  status: "in-progress" | "waiting-on-customer" | "stuck" | "done";
  lastNudge: string;
  aiNudges: number;
  chaseHistory: ChaseEvent[];
  nextChaseAt: string;
};

export const workOrders: WorkOrder[] = [
  {
    id: "J-01",
    customerId: "C-1042",
    type: "Couples massage · room 3 prep",
    ageDays: 2,
    status: "in-progress",
    lastNudge: "Today 9:14am",
    aiNudges: 1,
    chaseHistory: [
      { at: "Today 9:14am", channel: "email", outcome: "sent", note: "Prep checklist sent to therapist team" },
    ],
    nextChaseAt: "Before customer arrives (2:30pm)",
  },
  {
    id: "J-02",
    customerId: "C-1071",
    type: "Consultation booking · bridal package",
    ageDays: 7,
    status: "waiting-on-customer",
    lastNudge: "3rd reminder sent yesterday",
    aiNudges: 3,
    chaseHistory: [
      { at: "7 days ago", channel: "email", outcome: "opened", note: "Bridal consultation invite" },
      { at: "4 days ago", channel: "whatsapp", outcome: "no-response", note: "Friendly reminder" },
      { at: "Yesterday", channel: "sms", outcome: "no-response", note: "Final reminder before slot is released" },
    ],
    nextChaseAt: "Tomorrow · auto-release slot if no reply",
  },
  {
    id: "J-03",
    customerId: "C-1108",
    type: "Set up new corporate account",
    ageDays: 1,
    status: "in-progress",
    lastNudge: "Today 11:02am",
    aiNudges: 0,
    chaseHistory: [
      { at: "Today 11:02am", channel: "email", outcome: "sent", note: "Welcome pack sent to HR admin" },
    ],
    nextChaseAt: "Tomorrow · check that booking links work",
  },
  {
    id: "J-04",
    customerId: "C-1115",
    type: "Mobile spa event · setup for hotel",
    ageDays: 11,
    status: "stuck",
    lastNudge: "Customer asked to delay — escalated to you",
    aiNudges: 2,
    chaseHistory: [
      { at: "11 days ago", channel: "email", outcome: "opened", note: "Event coordination kick-off" },
      { at: "7 days ago", channel: "whatsapp", outcome: "replied", note: "Customer asked to delay 2 weeks" },
      { at: "3 days ago", channel: "email", outcome: "escalated", note: "Auto-escalated · 3rd delay request from customer" },
    ],
    nextChaseAt: "You to call the GM directly · context summarised in your inbox",
  },
  {
    id: "J-05",
    customerId: "C-1133",
    type: "Equipment maintenance · facial bed",
    ageDays: 3,
    status: "in-progress",
    lastNudge: "Today 8:45am",
    aiNudges: 0,
    chaseHistory: [
      { at: "3 days ago", channel: "email", outcome: "sent", note: "Service request placed with vendor" },
      { at: "Today 8:45am", channel: "email", outcome: "replied", note: "Vendor confirmed Thursday slot" },
    ],
    nextChaseAt: "Thursday · confirm work completed",
  },
  {
    id: "J-06",
    customerId: "C-1156",
    type: "Loyalty card upgrade · gold tier",
    ageDays: 9,
    status: "waiting-on-customer",
    lastNudge: "2nd reminder sent this morning",
    aiNudges: 2,
    chaseHistory: [
      { at: "9 days ago", channel: "email", outcome: "opened", note: "Gold tier upgrade options sent" },
      { at: "4 days ago", channel: "whatsapp", outcome: "no-response", note: "Quick check-in" },
      { at: "Today 7:30am", channel: "sms", outcome: "no-response", note: "Final reminder" },
    ],
    nextChaseAt: "Tomorrow · escalate to retention team if no reply",
  },
];

export type Route = {
  id: string;
  vehicle: string;
  from: string;
  to: string;
  etaScheduled: string;
  etaPredicted: string;
  delayMins: number;
  fuelCostSgd: number;
  fuelDeltaPct: number;
  status: "on-track" | "running-late" | "delay-alert";
};

export const routes: Route[] = [
  { id: "T-01", vehicle: "Mobile spa team · 3 therapists", from: "Main spa · Orchard", to: "Corporate event · CBD office", etaScheduled: "2:00pm", etaPredicted: "2:08pm", delayMins: 8, fuelCostSgd: 184, fuelDeltaPct: -3.2, status: "on-track" },
  { id: "T-02", vehicle: "Supplies van", from: "Central warehouse", to: "Branch 3 · East Coast", etaScheduled: "3:30pm", etaPredicted: "4:42pm", delayMins: 72, fuelCostSgd: 221, fuelDeltaPct: 7.1, status: "delay-alert" },
  { id: "T-03", vehicle: "Mobile spa team · 2 therapists", from: "Branch 2 · Tampines", to: "Hotel partner · Marina", etaScheduled: "5:15pm", etaPredicted: "5:24pm", delayMins: 9, fuelCostSgd: 92, fuelDeltaPct: -1.8, status: "on-track" },
  { id: "T-04", vehicle: "Bridal setup van", from: "Main spa · Orchard", to: "Hotel ballroom · Marina South", etaScheduled: "6:45pm", etaPredicted: "7:20pm", delayMins: 35, fuelCostSgd: 198, fuelDeltaPct: 4.6, status: "running-late" },
];

export type DocPack = {
  id: string;
  type: "Customer consultation form" | "Treatment plan & aftercare" | "New member welcome pack" | "Corporate package summary";
  customerId: string;
  status: "drafting" | "review" | "done";
  generatedAt: string;
  fieldsAutofilled: number;
  fieldsTotal: number;
};

export const docPacks: DocPack[] = [
  { id: "D-01", type: "Customer consultation form", customerId: "C-1042", status: "review", generatedAt: "Today 9:02am", fieldsAutofilled: 38, fieldsTotal: 42 },
  { id: "D-02", type: "Treatment plan & aftercare", customerId: "C-1042", status: "drafting", generatedAt: "Today 1:15pm", fieldsAutofilled: 24, fieldsTotal: 31 },
  { id: "D-03", type: "New member welcome pack", customerId: "C-1108", status: "done", generatedAt: "Yesterday 5:20pm", fieldsAutofilled: 18, fieldsTotal: 18 },
  { id: "D-04", type: "Corporate package summary", customerId: "C-1115", status: "review", generatedAt: "Today 11:45am", fieldsAutofilled: 22, fieldsTotal: 26 },
];

// ---------- Theme 3: HR & Talent ----------

export type Candidate = {
  id: string;
  initials: string;
  role: string;
  yearsExp: number;
  aiScore: number;
  status: "new" | "screening" | "shortlist" | "auto-replied" | "rejected";
  highlights: string[];
  redFlags: string[];
  source: string;
};

export const candidates: Candidate[] = [
  { id: "A-01", initials: "J.T.", role: "Senior therapist", yearsExp: 6, aiScore: 92, status: "shortlist", highlights: ["CIDESCO certified", "5 years in luxury hotel spa", "Speaks EN & Bahasa"], redFlags: [], source: "LinkedIn" },
  { id: "A-02", initials: "M.S.", role: "Senior therapist", yearsExp: 9, aiScore: 88, status: "shortlist", highlights: ["Singapore PR", "Led team of 5 at previous spa"], redFlags: ["3-month gap in 2024 — worth asking about"], source: "Referral" },
  { id: "A-03", initials: "R.K.", role: "Receptionist", yearsExp: 3, aiScore: 76, status: "auto-replied", highlights: ["Used spa booking software", "OK with rotating shifts"], redFlags: [], source: "Indeed" },
  { id: "A-04", initials: "A.N.", role: "Therapist", yearsExp: 1, aiScore: 41, status: "rejected", highlights: ["Fresh from beauty school"], redFlags: ["Below our 3-year minimum", "Missing CIDESCO certificate"], source: "Indeed" },
  { id: "A-05", initials: "P.G.", role: "Beauty consultant", yearsExp: 5, aiScore: 84, status: "screening", highlights: ["Sold retail beauty for 5 yrs", "Hit 110% of target last year"], redFlags: [], source: "LinkedIn" },
  { id: "A-06", initials: "H.W.", role: "HR assistant", yearsExp: 2, aiScore: 71, status: "screening", highlights: ["Used HR software (BambooHR)"], redFlags: ["Long notice period (3 months)"], source: "Careers page" },
  { id: "A-07", initials: "L.B.", role: "Receptionist", yearsExp: 4, aiScore: 79, status: "auto-replied", highlights: ["Speaks EN & Chinese", "4 years at city spa"], redFlags: [], source: "Referral" },
  { id: "A-08", initials: "T.C.", role: "Beauty consultant", yearsExp: 0, aiScore: 32, status: "rejected", highlights: [], redFlags: ["No retail beauty experience", "Salary ask is double our range"], source: "Indeed" },
];

// ---------- Theme 4: Knowledge Assistant ----------

export type SOP = {
  id: string;
  title: string;
  section: string;
  excerpt: string;
};

export const sops: SOP[] = [
  { id: "G-01", title: "Hygiene & sanitation before every treatment", section: "Operations", excerpt: "Sanitise the room between every customer. Patch-test new products 48 hours before use. Single-use linens for facials…" },
  { id: "G-02", title: "Post-treatment aftercare & customer notes", section: "Operations", excerpt: "Within 2 hours of completion, fill in the customer record. AI auto-fills 24 of 31 fields from treatment timer + room sensors…" },
  { id: "G-03", title: "New member onboarding", section: "Customer Success", excerpt: "First 90 days: welcome call after 3 days, first-visit follow-up after 7 days, package review at 30 days…" },
  { id: "G-04", title: "When to escalate a refund or complaint", section: "Sales", excerpt: "If refund amount is over S$500 AND the customer hasn't replied to 2 AI reminders, hand it to the spa manager…" },
  { id: "G-05", title: "Minimum requirements for therapist hires", section: "HR", excerpt: "Therapist roles need a CIDESCO or equivalent certificate at application. AI rejects anyone missing it and explains why…" },
  { id: "G-06", title: "Data retention & PDPA", section: "Compliance", excerpt: "Customer health records: 12 months from last visit. Candidate records: 12 months from last application…" },
];

export type AssistantQa = {
  id: string;
  asker: string;
  question: string;
  answer: string;
  sources: string[];
  time: string;
};

export const recentQa: AssistantQa[] = [
  { id: "QA-01", asker: "K.L. · Ops", question: "Can we proceed with the lavender body wrap on a customer with sensitive skin?", answer: "No — not without a patch test first. Our hygiene SOP requires a 48-hour patch test for any new product on sensitive skin. Reschedule the wrap and run a patch test today.", sources: ["G-01"], time: "Today 1:22pm" },
  { id: "QA-02", asker: "V.R. · Sales", question: "When do I need to escalate a refund request?", answer: "If the refund is more than S$500 AND the customer hasn't replied to 2 AI reminders. This was updated in January 2026.", sources: ["G-04"], time: "Today 11:08am" },
  { id: "QA-03", asker: "J.O. · HR", question: "Do therapists need their CIDESCO certificate before we shortlist?", answer: "Yes — therapist roles require it at application. Anyone missing it is auto-rejected with a clear reason.", sources: ["G-05"], time: "Today 10:40am" },
  { id: "QA-04", asker: "S.M. · Compliance", question: "How long do we keep customer health records?", answer: "12 months from the customer's last visit.", sources: ["G-06"], time: "Today 9:55am" },
];

export const suggestedQuestions = [
  "How long should a couples massage take?",
  "Can a customer cancel after booking?",
  "What if a customer asks us to delete their health records?",
  "How often do we check in with new members?",
];

// ---------- Knowledge base documents ----------

export type KbDocument = {
  id: string;
  filename: string;
  type: "pdf" | "docx" | "xlsx" | "url";
  sizeKb: number;
  status: "indexed" | "indexing" | "failed";
  uploadedAt: string;
  category: string;
  excerpt: string;
};

export const kbDocuments: KbDocument[] = [
  { id: "KB-01", filename: "Membership Agreement 2026.pdf", type: "pdf", sizeKb: 248, status: "indexed", uploadedAt: "12 Apr 2026", category: "Contracts", excerpt: "Standard terms · 12-month commitment · 30-day notice for cancellation…" },
  { id: "KB-02", filename: "Hygiene & Treatment SOP.pdf", type: "pdf", sizeKb: 1840, status: "indexed", uploadedAt: "3 May 2026", category: "Operations", excerpt: "Sanitation between customers · patch-test protocol · single-use linens for facials…" },
  { id: "KB-03", filename: "Pricing & Discount Authority.xlsx", type: "xlsx", sizeKb: 56, status: "indexed", uploadedAt: "1 May 2026", category: "Sales", excerpt: "Standard discount: 3% (AI auto-approve) · 3–10% (Receptionist) · >10% (Spa manager)…" },
  { id: "KB-04", filename: "Customer FAQ Handbook.docx", type: "docx", sizeKb: 412, status: "indexed", uploadedAt: "8 May 2026", category: "Customer Success", excerpt: "Opening hours, bookings, cancellations, package terms, gift voucher rules…" },
  { id: "KB-05", filename: "Hiring Policies & Therapist Minimums.pdf", type: "pdf", sizeKb: 320, status: "indexed", uploadedAt: "5 May 2026", category: "HR", excerpt: "Therapist roles require CIDESCO certificate · 3-year minimum experience…" },
  { id: "KB-06", filename: "Data Retention & PDPA.pdf", type: "pdf", sizeKb: 184, status: "indexed", uploadedAt: "2 May 2026", category: "Compliance", excerpt: "Customer health records retained per PDPA Schedule A · 12-month retention for applicants…" },
  { id: "KB-07", filename: "Brand & Tone Guidelines.pdf", type: "pdf", sizeKb: 2400, status: "indexing", uploadedAt: "Today 2:14pm", category: "Marketing", excerpt: "Indexing in progress · 78% complete · ready in ~30 seconds." },
  { id: "KB-08", filename: "Treatment & Room Logbook.pdf", type: "pdf", sizeKb: 5200, status: "indexed", uploadedAt: "1 May 2026", category: "Operations", excerpt: "Treatment durations, room turnover times, supply usage baselines per therapy…" },
];

// ---------- AI persona / customisation ----------

export type AiPersona = {
  id: string;
  name: string;
  description: string;
  activeFor: string;
  toneTraits: string[];
  scopeRules: string[];
  escalationRules: string[];
  systemPromptPreview: string;
};

export const aiPersonas: AiPersona[] = [
  {
    id: "PER-01",
    name: "Warm spa concierge",
    description: "Default · talks to members on WhatsApp, email, web chat",
    activeFor: "All customer-facing channels",
    toneTraits: [
      "Warm but unhurried",
      "Concise — 1–2 short paragraphs max",
      "Avoids medical jargon · uses everyday language",
      "Uses the member's name when known",
    ],
    scopeRules: [
      "Answer from your knowledge base only · never invent",
      "Always cite the source document when stating a fact",
      "Quote price & package terms verbatim — never paraphrase",
      "Decline if the question is outside our services",
    ],
    escalationRules: [
      "Customer sounds frustrated or upset → escalate to a human within 30 seconds",
      "Refund or membership cancellation → escalate to spa manager",
      "Discount > 3% requested → escalate to sales rep",
      "Medical or allergy concern → escalate to senior therapist",
    ],
    systemPromptPreview: "You are a warm, unhurried spa concierge for our spa.\n\nRULES:\n• Only answer from the knowledge base. If you don't know, say so.\n• Cite the source document (e.g. 'Per our Membership Agreement, §3.2…').\n• Tone: warm, unhurried, no medical jargon.\n\nHARD LIMITS:\n• Never offer a discount above 3% — escalate to a sales rep.\n• Never make policy decisions on refunds — escalate to the spa manager.\n• If the customer seems upset, escalate to a human within 30 seconds.\n• If they mention a medical or allergy issue, escalate to a senior therapist.\n\nALWAYS:\n• End with one clear next step.\n• Offer to escalate if you can't help.",
  },
];

// ---------- Customer chat (roleplay) ----------

export type ChatMessage = {
  id: string;
  role: "customer" | "ai" | "system";
  content: string;
  sources?: string[];
  time: string;
  isEscalation?: boolean;
};

export const sampleChat: ChatMessage[] = [
  { id: "M-01", role: "system", content: "Conversation started · WhatsApp · 2:01pm", time: "2:01pm" },
  { id: "M-02", role: "customer", content: "Hi, what time are you open today?", time: "2:01pm" },
  { id: "M-03", role: "ai", content: "Hi! We're open today from 9am–9pm at all four branches. The last booking slot is 8pm. Is there anything you'd like me to book for you?", sources: ["KB-04"], time: "2:01pm" },
];

export const roleplayPrompts = [
  // ─── Escalations (5 different routing destinations) ───
  {
    id: "RP-01",
    label: "Cancel Membership · Escalates to Account Owner",
    text: "I'd like to cancel my membership.",
    kind: "escalation" as const,
  },
  {
    id: "RP-02",
    label: "Ask for 10% Discount · Escalates to Sales Rep",
    text: "Can I get a 10% discount on my package?",
    kind: "escalation" as const,
  },
  {
    id: "RP-03",
    label: "Allergy Concern · Escalates to Senior Therapist",
    text: "I'm allergic to lavender and have sensitive skin — is this safe?",
    kind: "escalation" as const,
  },
  {
    id: "RP-04",
    label: "Frustrated Tone · Escalates to Senior Support",
    text: "This is the third time I am asking. Why is no one helping?",
    kind: "escalation" as const,
  },
  {
    id: "RP-05",
    label: "Corporate Booking · Escalates to Corporate Sales",
    text: "We're a team of 30 looking for a corporate wellness day. Can you help?",
    kind: "escalation" as const,
  },
  // ─── Factual answers (no escalation) ───
  {
    id: "RP-06",
    label: "Ask About Opening Hours",
    text: "What are your opening hours today?",
    kind: "factual" as const,
  },
  {
    id: "RP-07",
    label: "Book a Couples Massage",
    text: "Can I book a couples massage for tomorrow evening?",
    kind: "factual" as const,
  },
  {
    id: "RP-08",
    label: "Buy a Gift Voucher",
    text: "I'd like to buy a gift voucher for my mum.",
    kind: "factual" as const,
  },
];

// ---------- Theme 5: Insights ----------

export type Insight = {
  id: string;
  category: "fuel" | "route" | "waste" | "ops" | "people";
  title: string;
  story: string;
  impactSgd: number;
  confidence: number;
  status: "new" | "actioned" | "watching";
};

export const insights: Insight[] = [
  { id: "I-01", category: "fuel", title: "Therapist J. averages 6% less product per treatment", story: "AI noticed this across 38 sessions this month. Likely the new technique she trialled in April. Worth training the whole team.", impactSgd: 4200, confidence: 91, status: "new" },
  { id: "I-02", category: "route", title: "No-shows cluster on Wednesday and Thursday afternoons", story: "11 of the last 14 no-shows fall in this window. A reminder text 4 hours before (instead of 24 hours) cuts no-shows by ~40% in similar cases.", impactSgd: 6800, confidence: 84, status: "watching" },
  { id: "I-03", category: "waste", title: "8 members have barely used their treatment package", story: "Under 30% used. Either downsize their package (keeps them happy) or upsell them on a la carte sessions they actually want.", impactSgd: 12400, confidence: 88, status: "new" },
  { id: "I-04", category: "ops", title: "Customer consultations are taking 28% longer than they should", story: "The cause is paper consultation forms. Switching to AI-filled forms saves about 40 minutes per consultation.", impactSgd: 5600, confidence: 76, status: "actioned" },
  { id: "I-05", category: "people", title: "HR is processing CVs 62% faster now", story: "Days from CV received to shortlist call went from 6.2 → 2.4. Same 2 HR staff, 3× the volume.", impactSgd: 9200, confidence: 95, status: "actioned" },
  { id: "I-06", category: "fuel", title: "Treatment rooms sit idle during peak hours", story: "About 14% of slots in the 6–8pm peak window are unused. Auto-fill from the waitlist could close most of this gap.", impactSgd: 3800, confidence: 82, status: "new" },
];

export const monthlySavings = [
  { month: "Jan", saved: 18 },
  { month: "Feb", saved: 22 },
  { month: "Mar", saved: 31 },
  { month: "Apr", saved: 38 },
  { month: "May", saved: 46 },
];

// ---------- Customers (shared) ----------

export type Customer = {
  id: string;
  industry: IndustryTag;
  region: string;
  contactRole: string;
  annualValueSgd: number;
};

export const customers: Customer[] = [
  { id: "C-1042", industry: "gold-member", region: "Singapore", contactRole: "Gold member", annualValueSgd: 2400 },
  { id: "C-1071", industry: "silver-member", region: "Singapore", contactRole: "Silver member", annualValueSgd: 1200 },
  { id: "C-1098", industry: "gold-member", region: "Singapore", contactRole: "Gold member", annualValueSgd: 1840 },
  { id: "C-1108", industry: "corporate-wellness", region: "Singapore", contactRole: "HR director", annualValueSgd: 22000 },
  { id: "C-1115", industry: "hotel-partner", region: "Singapore", contactRole: "GM, F&B and wellness", annualValueSgd: 86000 },
  { id: "C-1133", industry: "gym-partner", region: "Singapore", contactRole: "Owner", annualValueSgd: 31000 },
  { id: "C-1156", industry: "corporate-wellness", region: "Singapore", contactRole: "Office manager", annualValueSgd: 26400 },
  { id: "C-1171", industry: "hotel-partner", region: "Singapore", contactRole: "Operations manager", annualValueSgd: 12000 },
];

export function findCustomer(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function customerLabel(id: string): string {
  const c = findCustomer(id);
  if (!c) return id;
  return `${INDUSTRY_LABEL[c.industry]} customer`;
}

// ---------- Activity feed (cross-theme) ----------

export type ActivityArea = "engagement" | "operations" | "hr" | "knowledge" | "insights";

export type Activity = {
  id: string;
  time: string;
  area: ActivityArea;
  text: string;
  customerId?: string;
  awaiting?: boolean;
};

export const baseActivity: Activity[] = [
  { id: "A-01", time: "1:42pm", area: "engagement", text: "Drafted a renewal quote — waiting for you to approve", customerId: "C-1042", awaiting: true },
  { id: "A-02", time: "1:22pm", area: "knowledge", text: "Answered an Operations question about lavender wrap on sensitive skin" },
  { id: "A-03", time: "1:15pm", area: "operations", text: "Filled in 24 of 31 fields on a treatment plan & aftercare form", customerId: "C-1042" },
  { id: "A-04", time: "12:48pm", area: "engagement", text: "Sent a Mother's Day promo to 312 members · 198 opens so far" },
  { id: "A-05", time: "11:45am", area: "operations", text: "Generated a consultation form — 22 of 26 fields filled", customerId: "C-1115" },
  { id: "A-06", time: "11:08am", area: "knowledge", text: "Answered a Sales question about refund escalations" },
  { id: "A-07", time: "10:42am", area: "engagement", text: "Customer signed their corporate wellness renewal — S$43.2K retained", customerId: "C-1115" },
  { id: "A-08", time: "10:40am", area: "hr", text: "Auto-rejected 2 candidates missing CIDESCO certification" },
  { id: "A-09", time: "10:14am", area: "operations", text: "Sent a 3rd reminder on a stalled bridal consultation — still no reply", customerId: "C-1071", awaiting: true },
  { id: "A-10", time: "9:30am", area: "hr", text: "Shortlisted 4 senior therapist candidates · interview slots booked" },
  { id: "A-11", time: "8:55am", area: "engagement", text: "Mother's Day campaign results — 198 opens, 24 replies" },
];

export const AREA_LABEL: Record<ActivityArea, string> = {
  engagement: "Sales & customers",
  operations: "Operations",
  hr: "Hiring",
  knowledge: "Internal Q&A",
  insights: "Insights",
};

// ---------- Candidate detail data (for HR drill-in) ----------

export type CandidateDetail = {
  appliedFor: string;
  expectedSalary: string;
  noticePeriod: string;
  location: string;
  education: { degree: string; school: string; year: string }[];
  experience: { role: string; org: string; period: string; bullets: string[] }[];
  skills: string[];
  certifications: { name: string; verified: boolean; note?: string }[];
  scoreBreakdown: { criterion: string; weight: number; score: number; note: string }[];
  aiSummary: string;
  aiDraftReply: string;
};

export const candidateDetails: Record<string, CandidateDetail> = {
  "A-01": {
    appliedFor: "Senior therapist · day shift",
    expectedSalary: "S$3,800/mo",
    noticePeriod: "1 month",
    location: "Singapore",
    education: [{ degree: "Diploma in Beauty & Wellness Therapy", school: "Singapore Polytechnic", year: "2018" }],
    experience: [
      { role: "Senior therapist", org: "Luxury hotel spa (anon)", period: "2022 – present (4 yrs)", bullets: ["Mentored 3 junior therapists", "Specialised in deep-tissue + prenatal massage"] },
      { role: "Therapist", org: "Standalone spa (anon)", period: "2018 – 2022 (4 yrs)", bullets: ["Daily roster of 6–8 customers"] },
    ],
    skills: ["Deep tissue", "Prenatal massage", "Facial treatments", "English", "Bahasa Melayu"],
    certifications: [{ name: "CIDESCO Beauty Therapy", verified: true }, { name: "Prenatal Massage", verified: true }],
    scoreBreakdown: [
      { criterion: "Experience", weight: 35, score: 95, note: "6 yrs · all relevant" },
      { criterion: "Certifications", weight: 25, score: 100, note: "All required tickets verified" },
      { criterion: "Education", weight: 15, score: 85, note: "Diploma from local poly" },
      { criterion: "Languages & comms", weight: 15, score: 90, note: "EN + Bahasa, clear writing in CV" },
      { criterion: "Availability", weight: 10, score: 80, note: "1-month notice" },
    ],
    aiSummary: "Strong match. 6 years of directly relevant therapy work, all certifications verified, multilingual. Currently on a 1-month notice. Recommend shortlisting for first interview.",
    aiDraftReply: "Hi J.,\n\nThank you for applying for the Senior Therapist role. Your background looks like a strong fit and we'd love to chat — please pick a slot here: [calendar link].\n\nWe'll be in touch with confirmation within 24 hours.\n\nBest,\nHR team",
  },
  "A-02": {
    appliedFor: "Senior therapist · evening shift",
    expectedSalary: "S$4,400/mo",
    noticePeriod: "2 months",
    location: "Singapore · PR",
    education: [{ degree: "BSc (Hons) Complementary Therapies", school: "Overseas university", year: "2015" }],
    experience: [
      { role: "Lead therapist", org: "Boutique spa (anon)", period: "2020 – present (5 yrs)", bullets: ["Led team of 5", "Owned customer satisfaction programme"] },
      { role: "Career gap (3 mo)", org: "Personal break", period: "Mar 2024 – May 2024", bullets: ["Family reasons · noted by candidate"] },
      { role: "Therapist", org: "Hotel spa (anon)", period: "2016 – 2020 (4 yrs)", bullets: ["Day-to-day customer roster"] },
    ],
    skills: ["Team leadership", "Aromatherapy", "Hot stone", "English", "Tamil"],
    certifications: [{ name: "CIDESCO Beauty Therapy", verified: true }],
    scoreBreakdown: [
      { criterion: "Experience", weight: 35, score: 90, note: "9 yrs · highly relevant" },
      { criterion: "Certifications", weight: 25, score: 95, note: "All tickets in order" },
      { criterion: "Education", weight: 15, score: 95, note: "Degree in therapies" },
      { criterion: "Languages & comms", weight: 15, score: 85, note: "Excellent EN" },
      { criterion: "Availability", weight: 10, score: 60, note: "2-month notice · slower start" },
    ],
    aiSummary: "Senior candidate with leadership track record. The 3-month gap in 2024 was self-declared (family). 2-month notice may delay start. Recommend shortlisting and asking about the gap on the call.",
    aiDraftReply: "Hi M.,\n\nThank you for applying. Your leadership experience stands out and we'd like to schedule a call. Please pick a time: [calendar link].\n\nIf possible, we'd appreciate hearing a bit about the 2024 break on the call.\n\nBest,\nHR team",
  },
  "A-03": {
    appliedFor: "Receptionist · day shift",
    expectedSalary: "S$2,800/mo",
    noticePeriod: "Immediate",
    location: "Singapore",
    education: [{ degree: "Diploma in Hospitality Management", school: "Republic Polytechnic", year: "2021" }],
    experience: [
      { role: "Front desk receptionist", org: "City spa (anon)", period: "2022 – present (3 yrs)", bullets: ["Booked 50+ appointments daily", "Used Mindbody booking software"] },
    ],
    skills: ["Booking software", "Customer service", "English"],
    certifications: [],
    scoreBreakdown: [
      { criterion: "Experience", weight: 35, score: 75, note: "3 yrs · relevant" },
      { criterion: "Certifications", weight: 25, score: 80, note: "None required for this role" },
      { criterion: "Education", weight: 15, score: 75, note: "Hospitality diploma" },
      { criterion: "Languages & comms", weight: 15, score: 75, note: "Good EN" },
      { criterion: "Availability", weight: 10, score: 100, note: "Can start immediately" },
    ],
    aiSummary: "Solid mid-level receptionist. Immediate availability is a plus. AI already sent acknowledgement; flag if you want to bump to interview.",
    aiDraftReply: "Hi R.,\n\nThanks for your application. We've received it and are reviewing. We'll get back to you within 5 working days.\n\nBest,\nHR team",
  },
  "A-04": {
    appliedFor: "Therapist · day shift",
    expectedSalary: "S$2,400/mo",
    noticePeriod: "Immediate",
    location: "Singapore",
    education: [{ degree: "Certificate in Beauty Therapy", school: "Local academy", year: "2025" }],
    experience: [
      { role: "Trainee · beauty academy", org: "Beauty school (anon)", period: "6 mo trainee", bullets: ["Classroom + supervised practice"] },
    ],
    skills: ["Basic facials", "English"],
    certifications: [],
    scoreBreakdown: [
      { criterion: "Experience", weight: 35, score: 20, note: "Below 3-yr minimum" },
      { criterion: "Certifications", weight: 25, score: 0, note: "Missing CIDESCO certificate" },
      { criterion: "Education", weight: 15, score: 65, note: "Local academy certificate" },
      { criterion: "Languages & comms", weight: 15, score: 80, note: "Good EN" },
      { criterion: "Availability", weight: 10, score: 100, note: "Immediate" },
    ],
    aiSummary: "Recent academy graduate. Does not meet the 3-year experience minimum and lacks the CIDESCO certificate. Auto-rejected with reason. HR can override for a junior-level role.",
    aiDraftReply: "Hi A.,\n\nThank you for applying. After review, your profile doesn't meet two of our must-haves for this role:\n  • 3+ years of therapy experience\n  • CIDESCO certificate at application time\n\nWe wish you the best, and please do keep us in mind once you've built up more experience.\n\nBest,\nHR team",
  },
  "A-05": {
    appliedFor: "Beauty consultant · retail floor",
    expectedSalary: "S$3,200/mo + commission",
    noticePeriod: "1 month",
    location: "Singapore",
    education: [{ degree: "BBA Marketing", school: "SMU", year: "2020" }],
    experience: [
      { role: "Beauty consultant", org: "Department store beauty hall (anon)", period: "2022 – present (3 yrs)", bullets: ["Hit 110% of retail target last FY", "Managed gold-tier loyalty members"] },
      { role: "Sales associate", org: "Cosmetics brand (anon)", period: "2020 – 2022 (2 yrs)", bullets: ["First-time-buyer conversion lead"] },
    ],
    skills: ["Retail beauty sales", "Loyalty programs", "Cross-sell", "English"],
    certifications: [],
    scoreBreakdown: [
      { criterion: "Experience", weight: 35, score: 85, note: "5 yrs · relevant" },
      { criterion: "Certifications", weight: 25, score: 75, note: "None required" },
      { criterion: "Education", weight: 15, score: 85, note: "BBA Marketing" },
      { criterion: "Languages & comms", weight: 15, score: 90, note: "Polished CV, excellent EN" },
      { criterion: "Availability", weight: 10, score: 80, note: "1-month notice" },
    ],
    aiSummary: "Strong retail hire candidate. Hit quota at current role, proven beauty retail background, 1-month notice. Currently in screening — recommend moving to shortlist.",
    aiDraftReply: "Hi P.,\n\nThanks for your application — we're reviewing your CV. You should hear back from us within 5 working days.\n\nBest,\nHR team",
  },
  "A-06": {
    appliedFor: "HR assistant",
    expectedSalary: "S$3,000/mo",
    noticePeriod: "3 months",
    location: "Singapore",
    education: [{ degree: "Diploma in Human Resource Management", school: "Nanyang Polytechnic", year: "2023" }],
    experience: [
      { role: "HR coordinator", org: "Services firm (anon)", period: "2024 – present (2 yrs)", bullets: ["Day-to-day HR ops", "Used BambooHR"] },
    ],
    skills: ["HRIS software", "Payroll basics", "English", "Mandarin"],
    certifications: [],
    scoreBreakdown: [
      { criterion: "Experience", weight: 35, score: 70, note: "2 yrs · relevant" },
      { criterion: "Certifications", weight: 25, score: 80, note: "None required" },
      { criterion: "Education", weight: 15, score: 75, note: "Diploma in HR" },
      { criterion: "Languages & comms", weight: 15, score: 80, note: "Good EN + Mandarin" },
      { criterion: "Availability", weight: 10, score: 40, note: "3-month notice · long wait" },
    ],
    aiSummary: "Decent mid-level candidate. The 3-month notice is the main blocker — if hiring is urgent, this slows you down. Worth a screening call.",
    aiDraftReply: "Hi H.,\n\nThank you for your application. We're reviewing CVs this week and will be in touch within 5 working days.\n\nBest,\nHR team",
  },
  "A-07": {
    appliedFor: "Receptionist · evening shift",
    expectedSalary: "S$2,900/mo",
    noticePeriod: "1 month",
    location: "Singapore",
    education: [{ degree: "Diploma in Hospitality Management", school: "Singapore Polytechnic", year: "2020" }],
    experience: [
      { role: "Front desk · evening shift", org: "Boutique hotel spa (anon)", period: "2021 – present (4 yrs)", bullets: ["Bilingual booking desk for EN + ZH guests", "Handled VIP loyalty enquiries"] },
    ],
    skills: ["Booking software", "Customer comms EN+ZH", "VIP relations"],
    certifications: [],
    scoreBreakdown: [
      { criterion: "Experience", weight: 35, score: 80, note: "4 yrs · relevant" },
      { criterion: "Certifications", weight: 25, score: 80, note: "None required" },
      { criterion: "Education", weight: 15, score: 80, note: "Hospitality diploma" },
      { criterion: "Languages & comms", weight: 15, score: 90, note: "Bilingual EN+ZH" },
      { criterion: "Availability", weight: 10, score: 80, note: "1-month notice" },
    ],
    aiSummary: "Solid candidate with bilingual EN+ZH — useful for our Mandarin-speaking gold members. AI sent acknowledgement; recommend flagging for shortlist.",
    aiDraftReply: "Hi L.,\n\nThanks for your application. We're reviewing CVs this week and you should hear from us within 5 working days.\n\nBest,\nHR team",
  },
  "A-08": {
    appliedFor: "Beauty consultant · retail floor",
    expectedSalary: "S$6,000/mo (double our band)",
    noticePeriod: "Immediate",
    location: "Singapore",
    education: [{ degree: "BBA", school: "Local university", year: "2025" }],
    experience: [],
    skills: ["English"],
    certifications: [],
    scoreBreakdown: [
      { criterion: "Experience", weight: 35, score: 10, note: "0 yrs in retail beauty" },
      { criterion: "Certifications", weight: 25, score: 60, note: "None required" },
      { criterion: "Education", weight: 15, score: 75, note: "BBA fresh grad" },
      { criterion: "Languages & comms", weight: 15, score: 60, note: "Generic cover letter" },
      { criterion: "Availability", weight: 10, score: 100, note: "Immediate" },
    ],
    aiSummary: "Fresh graduate, no retail experience, salary expectation roughly twice our band for this role. Auto-rejected. HR can override if there's a graduate trainee programme.",
    aiDraftReply: "Hi T.,\n\nThank you for your interest. After review, this role requires prior retail experience (3+ years) which you don't yet have. We've also noted your salary expectation is outside our range for this role.\n\nWe wish you well, and would welcome an application for any of our entry-level roles when they open.\n\nBest,\nHR team",
  },
};
