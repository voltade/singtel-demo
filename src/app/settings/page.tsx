import { StubSection } from "@/components/stub-section";

export default function SettingsPage() {
  return (
    <StubSection
      title="Settings"
      blurb="Workspace settings, billing, integrations, AI guardrails — the boring (but important) stuff."
      features={[
        { label: "Integrations", detail: "Connect your CRM, HRIS, accounting, GPS, mailbox, WhatsApp." },
        { label: "AI guardrails", detail: "What AI can do without asking, what needs your approval." },
        { label: "Branding & tone", detail: "Logo, signature, tone of voice — AI follows your style." },
        { label: "Billing & usage", detail: "Per-agent pricing, transparent monthly bill." },
      ]}
    />
  );
}
