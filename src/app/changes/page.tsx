import { StubSection } from "@/components/stub-section";

export default function ChangesPage() {
  return (
    <StubSection
      title="Changes"
      blurb="A full log of every change AI made — emails sent, forms signed, candidates rejected. Auditors love it. Legal sleeps easier."
      features={[
        { label: "Every AI action logged", detail: "What it did, why, what it read first, when." },
        { label: "Filter by team, customer, time", detail: "Find any decision in seconds." },
        { label: "One-click rollback", detail: "Undo an AI action if something looks off." },
        { label: "Export to CSV", detail: "For audits, compliance reviews, internal reporting." },
      ]}
    />
  );
}
