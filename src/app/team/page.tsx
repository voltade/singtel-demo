import { StubSection } from "@/components/stub-section";

export default function TeamPage() {
  return (
    <StubSection
      title="Team"
      blurb="Who's in your workspace, what each person can do, and which AI actions need their approval."
      features={[
        { label: "Roles & permissions", detail: "Sales lead approves quotes; HR lead approves hiring decisions; etc." },
        { label: "Approval routing", detail: "AI knows who to ask when something needs a human signoff." },
        { label: "Activity per person", detail: "What each person + their AI did this week." },
        { label: "Onboarding flow", detail: "New hires get the right access on day one." },
      ]}
    />
  );
}
