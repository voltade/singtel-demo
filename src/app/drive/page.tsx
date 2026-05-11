import { StubSection } from "@/components/stub-section";

export default function DrivePage() {
  return (
    <StubSection
      title="Drive"
      blurb="Your contracts, SOPs, customer files, manuals — all in one place. This is what the Internal Q&A assistant reads to answer your team's questions."
      features={[
        { label: "Drop-in storage", detail: "Drag a PDF in. AI indexes it within 60 seconds." },
        { label: "Version-aware", detail: "Updates to a policy don't break old links." },
        { label: "Permissions by team", detail: "HR docs are HR-only, finance is finance-only." },
        { label: "Source of truth for AI", detail: "When AI answers a question, it quotes from here." },
      ]}
    />
  );
}
