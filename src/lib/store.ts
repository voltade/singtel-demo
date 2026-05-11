"use client";

import { create } from "zustand";

type DemoState = {
  // Engagement
  approvedQuoteIds: string[];
  approveQuote: (id: string) => void;

  campaignSentIds: string[];
  sendCampaign: (id: string) => void;

  // Operations
  resolvedWoIds: string[];
  nudgeWo: (id: string) => void;
  resolveWo: (id: string) => void;
  nudgeCounts: Record<string, number>;

  signedDocIds: string[];
  signDoc: (id: string) => void;

  // HR
  shortlistedCandidateIds: string[];
  shortlistCandidate: (id: string) => void;

  // Knowledge
  recentQuestions: { id: string; q: string; a: string; sources: string[]; time: string }[];
  askAssistant: (q: string, a: string, sources: string[]) => void;

  // Insights
  actionedInsightIds: string[];
  actionInsight: (id: string) => void;

  // Channels
  channels: ConnectedChannel[];
  addChannel: (channel: ConnectedChannel) => void;
  removeChannel: (id: string) => void;

  // Cross-screen activity badge
  extraActivityCount: number;
  bumpActivity: () => void;
};

export type ConnectedChannel = {
  id: string;
  kind: "whatsapp" | "whatsapp-sandbox" | "web";
  displayName: string;
  status: "active" | "connecting" | "failed";
  phoneNumber?: string;
  wabaId?: string;
  origin?: string;
  defaultAssignee: string;
  createdAt: string;
};

export const useDemoStore = create<DemoState>((set) => ({
  approvedQuoteIds: [],
  approveQuote: (id) =>
    set((s) => ({
      approvedQuoteIds: s.approvedQuoteIds.includes(id) ? s.approvedQuoteIds : [...s.approvedQuoteIds, id],
      extraActivityCount: s.extraActivityCount + 1,
    })),

  campaignSentIds: [],
  sendCampaign: (id) =>
    set((s) => ({
      campaignSentIds: s.campaignSentIds.includes(id) ? s.campaignSentIds : [...s.campaignSentIds, id],
      extraActivityCount: s.extraActivityCount + 1,
    })),

  resolvedWoIds: [],
  nudgeWo: (id) =>
    set((s) => ({
      nudgeCounts: { ...s.nudgeCounts, [id]: (s.nudgeCounts[id] ?? 0) + 1 },
      extraActivityCount: s.extraActivityCount + 1,
    })),
  resolveWo: (id) =>
    set((s) => ({
      resolvedWoIds: s.resolvedWoIds.includes(id) ? s.resolvedWoIds : [...s.resolvedWoIds, id],
      extraActivityCount: s.extraActivityCount + 1,
    })),
  nudgeCounts: {},

  signedDocIds: [],
  signDoc: (id) =>
    set((s) => ({
      signedDocIds: s.signedDocIds.includes(id) ? s.signedDocIds : [...s.signedDocIds, id],
      extraActivityCount: s.extraActivityCount + 1,
    })),

  shortlistedCandidateIds: [],
  shortlistCandidate: (id) =>
    set((s) => ({
      shortlistedCandidateIds: s.shortlistedCandidateIds.includes(id)
        ? s.shortlistedCandidateIds
        : [...s.shortlistedCandidateIds, id],
      extraActivityCount: s.extraActivityCount + 1,
    })),

  recentQuestions: [],
  askAssistant: (q, a, sources) =>
    set((s) => ({
      recentQuestions: [
        { id: `QA-${Date.now()}`, q, a, sources, time: "Just now" },
        ...s.recentQuestions,
      ].slice(0, 5),
      extraActivityCount: s.extraActivityCount + 1,
    })),

  actionedInsightIds: [],
  actionInsight: (id) =>
    set((s) => ({
      actionedInsightIds: s.actionedInsightIds.includes(id) ? s.actionedInsightIds : [...s.actionedInsightIds, id],
      extraActivityCount: s.extraActivityCount + 1,
    })),

  channels: [
    {
      id: "CH-web-01",
      kind: "web",
      displayName: "Website Live Chat",
      status: "active",
      origin: "https://voltade-spa.com",
      defaultAssignee: "AI Agent · Aria",
      createdAt: "12 Apr 2026",
    },
  ],
  addChannel: (channel) =>
    set((s) => ({
      channels: [channel, ...s.channels],
      extraActivityCount: s.extraActivityCount + 1,
    })),
  removeChannel: (id) =>
    set((s) => ({
      channels: s.channels.filter((c) => c.id !== id),
    })),

  extraActivityCount: 0,
  bumpActivity: () => set((s) => ({ extraActivityCount: s.extraActivityCount + 1 })),
}));
