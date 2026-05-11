// Canned AI replies for customer messages. Shared between the live WhatsApp
// webhook and the in-browser customer chat panel so both behave identically.
//
// Categories:
//   - 7 escalation flows (account owner, sales, senior therapist, manager,
//     corporate sales, compliance, senior support)
//   - 8 factual answers (hours, location, services, pricing, membership,
//     loyalty, vouchers, bookings, home spa)
//   - 2 light-touch (greeting, sandbox join)
//   - 1 default catchall

export type CustomerReply = {
  answer: string;
  sources?: string[];
  escalateReason?: string;
  escalateTo?: string;
};

export function getCustomerReply(message: string): CustomerReply {
  const lower = message.toLowerCase();

  // ─── Escalations ──────────────────────────────────────────────

  // 1. Cancellation / refund → account owner
  if (
    lower.includes("cancel") ||
    lower.includes("refund") ||
    lower.includes("terminate") ||
    lower.includes("end my")
  ) {
    return {
      answer:
        "I'm sorry to hear that — I want to make sure you're getting what you need. Cancellations need a quick chat with your account owner. I've notified Sarah from our team — she'll reach out within the hour. Would 3pm today work?",
      sources: ["KB-01", "KB-04"],
      escalateReason: "Cancellation or refund request — routed to account owner",
      escalateTo: "Account Owner · Sarah Lim",
    };
  }

  // 2. Discount above 3% → sales rep
  if (
    lower.includes("discount") ||
    lower.includes("cheaper") ||
    lower.includes("price down") ||
    lower.includes("negotiate") ||
    /\b([5-9]|[1-9]\d)\s*%/.test(lower)
  ) {
    return {
      answer:
        "Totally understandable. The best I can confirm right now is a 3% loyalty discount if you stay another year — that's the most I'm allowed to offer without checking. For a bigger discount, I'll connect you with Sarah from our sales team. Would 3pm today work for a quick call?",
      sources: ["KB-03"],
      escalateReason: "Discount above auto-approval limit (3%) — routed to sales rep",
      escalateTo: "Sales Rep · Sarah Lim",
    };
  }

  // 3. Frustrated tone → senior customer success
  if (
    lower.includes("frustrated") ||
    lower.includes("upset") ||
    lower.includes("third time") ||
    lower.includes("no one") ||
    lower.includes("angry") ||
    lower.includes("disappoint") ||
    lower.includes("terrible") ||
    lower.includes("worst") ||
    lower.includes("furious") ||
    lower.includes("ridiculous")
  ) {
    return {
      answer:
        "I'm really sorry — that's not the experience we want for you. I'm connecting you to a senior team member right now so we can get this sorted properly. Stay on the line, you'll hear from someone within 5 minutes.",
      escalateReason: "Customer frustration detected — immediate escalation to senior team",
      escalateTo: "Senior Customer Success · J. Lee",
    };
  }

  // 4. Allergy / health concern → senior therapist
  if (
    lower.includes("allergic") ||
    lower.includes("allergy") ||
    lower.includes("pregnant") ||
    lower.includes("pregnancy") ||
    lower.includes("sensitive skin") ||
    lower.includes("medication") ||
    lower.includes("medical") ||
    lower.includes("condition") ||
    lower.includes("rash") ||
    lower.includes("eczema") ||
    lower.includes("asthma") ||
    lower.includes("nut") ||
    lower.includes("essential oil")
  ) {
    return {
      answer:
        "Thank you for flagging this — we take health concerns seriously. I'm passing your details to our senior therapist who'll review and recommend the safest treatment options. She'll be in touch within an hour with personalised guidance.",
      sources: ["KB-02"],
      escalateReason: "Medical or allergy concern — needs senior therapist review",
      escalateTo: "Senior Therapist · M. Sharma",
    };
  }

  // 5. Manager request / complaint → spa manager
  if (
    lower.includes("manager") ||
    lower.includes("speak to") ||
    lower.includes("complain") ||
    lower.includes("complaint") ||
    lower.includes("rude") ||
    lower.includes("unprofessional") ||
    lower.includes("supervisor")
  ) {
    return {
      answer:
        "Of course — I'm escalating this to our spa manager right now. She'll be in touch within 30 minutes to hear you out and make things right.",
      escalateReason: "Customer requested manager / formal complaint",
      escalateTo: "Spa Manager · A. Lim",
    };
  }

  // 6. Corporate / bulk booking → corporate sales
  if (
    lower.includes("corporate") ||
    lower.includes("company") ||
    lower.includes("bulk") ||
    lower.includes("group of") ||
    lower.includes("team of") ||
    lower.includes("employee") ||
    lower.includes("wellness program") ||
    lower.includes("office event")
  ) {
    return {
      answer:
        "Wonderful — corporate wellness is one of our specialities. I'm connecting you with our corporate sales lead who'll send a tailored proposal within 2 hours. We've designed programmes for groups from 5 to 200.",
      sources: ["KB-03", "KB-04"],
      escalateReason: "Corporate or bulk booking enquiry — routed to corporate sales",
      escalateTo: "Corporate Sales Lead · V. Rao",
    };
  }

  // 7. Data / legal / PDPA → compliance
  if (
    lower.includes("pdpa") ||
    lower.includes("data privacy") ||
    lower.includes("delete my") ||
    lower.includes("personal data") ||
    lower.includes("legal") ||
    lower.includes("lawyer") ||
    lower.includes("court") ||
    lower.includes("data retention")
  ) {
    return {
      answer:
        "Thanks for raising this — privacy questions go through our compliance team. They'll respond within one business day with the full picture: the data we hold, retention period, and your rights under PDPA.",
      sources: ["KB-06"],
      escalateReason: "Data privacy or legal enquiry — routed to compliance",
      escalateTo: "Compliance Officer · S. M.",
    };
  }

  // ─── Factual answers (no escalation) ─────────────────────────

  // Hours
  if (
    lower.includes("hour") ||
    lower.includes("when do you open") ||
    lower.includes("when are you open") ||
    lower.includes("close") ||
    lower.includes("opening")
  ) {
    return {
      answer:
        "We're open every day, 9am to 9pm Singapore time. The last booking slot is 8pm. Would you like me to check availability for a specific time?",
      sources: ["KB-04"],
    };
  }

  // Location / branches
  if (
    lower.includes("location") ||
    lower.includes("where are you") ||
    lower.includes("address") ||
    lower.includes("branch") ||
    lower.includes("near me") ||
    lower.includes("which outlet")
  ) {
    return {
      answer:
        "We have four branches: Orchard (main), Tampines, Marina Bay, and East Coast. Which is most convenient for you? I can share the exact address and parking information.",
      sources: ["KB-04"],
    };
  }

  // Services (massage, facial, etc.)
  if (
    lower.includes("massage") ||
    lower.includes("couples") ||
    lower.includes("therapy") ||
    lower.includes("facial") ||
    lower.includes("body wrap") ||
    lower.includes("scrub") ||
    lower.includes("treatment") ||
    lower.includes("manicure") ||
    lower.includes("pedicure")
  ) {
    return {
      answer:
        "Couples massages are 90 minutes from S$280. Single facials from S$140 (60 minutes). Body wraps from S$180 (75 minutes). Would you like me to suggest available time slots today or tomorrow?",
      sources: ["KB-03", "KB-04"],
    };
  }

  // Home spa / events
  if (
    lower.includes("home spa") ||
    lower.includes("in-home") ||
    lower.includes("at home") ||
    lower.includes("birthday") ||
    lower.includes("hen party") ||
    lower.includes("bridal shower") ||
    lower.includes("party")
  ) {
    return {
      answer:
        "Yes — we offer in-home spa packages from S$480 (2 therapists, 90 minutes). Birthdays, hen parties, and bridal showers are popular. I can send the brochure now — would you like me to connect you with our events coordinator for a custom quote?",
      sources: ["KB-04"],
    };
  }

  // Pricing
  if (
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("how much") ||
    lower.includes("rate") ||
    lower.includes("fee")
  ) {
    return {
      answer:
        "Prices start at S$140 for a 60-minute facial, S$180 for a single massage, and S$280 for couples. Members enjoy 15 to 25% off, plus a complimentary treatment in their birthday month. Want me to send the full price list?",
      sources: ["KB-03"],
    };
  }

  // Membership
  if (
    lower.includes("member") ||
    lower.includes("membership") ||
    lower.includes("gold") ||
    lower.includes("silver") ||
    lower.includes("benefits") ||
    lower.includes("perk")
  ) {
    return {
      answer:
        "We have two tiers: Silver (S$1,200/yr · 15% off all treatments · priority booking) and Gold (S$2,400/yr · 25% off · one free monthly treatment · complimentary upgrades). Would you like me to send the comparison or book a 15-minute consultation?",
      sources: ["KB-01"],
    };
  }

  // Loyalty points / rewards
  if (
    lower.includes("point") ||
    lower.includes("loyalty") ||
    lower.includes("reward")
  ) {
    return {
      answer:
        "Members earn 1 point per S$1 spent. 500 points equals a complimentary 60-minute massage. You can check your current balance any time — just reply 'BALANCE' and I'll send it instantly.",
      sources: ["KB-04"],
    };
  }

  // Gift vouchers
  if (lower.includes("gift") || lower.includes("voucher") || lower.includes("present for")) {
    return {
      answer:
        "We sell digital and physical gift vouchers from S$50 to S$500. They're valid for 12 months and work across all four branches and every treatment. Want me to send the purchase link?",
      sources: ["KB-04"],
    };
  }

  // Booking / availability
  if (
    lower.includes("book") ||
    lower.includes("appointment") ||
    lower.includes("slot") ||
    lower.includes("available") ||
    lower.includes("availability") ||
    lower.includes("schedule") ||
    lower.includes("reserve")
  ) {
    return {
      answer:
        "Today we have 2:30pm, 4:00pm, and 7:00pm available at the Orchard branch. Tomorrow has more options. Which suits you, and which treatment did you have in mind?",
      sources: ["KB-04"],
    };
  }

  // Lead time / install
  if (lower.includes("how long") || lower.includes("lead time")) {
    return {
      answer:
        "Most treatments take 60 to 90 minutes, and same-day bookings are usually available during off-peak slots. For larger packages (4+ guests, custom events), we typically need 48 hours' notice.",
      sources: ["KB-04", "KB-02"],
    };
  }

  // ─── Light touch ──────────────────────────────────────────────

  // Greeting
  if (
    lower.startsWith("hi") ||
    lower.startsWith("hello") ||
    lower.startsWith("hey") ||
    lower.includes("good morning") ||
    lower.includes("good afternoon") ||
    lower.includes("good evening")
  ) {
    return {
      answer:
        "Hi there 👋 Welcome — I'm the spa concierge. Ask me anything: appointment times, package prices, in-home spa sessions, or whatever's on your mind.",
    };
  }

  // Twilio sandbox join confirmation
  if (lower.includes("join")) {
    return {
      answer:
        "You're now connected to our spa 👋. Try asking me anything: appointment times, package prices, or even special requests for an in-home spa session.",
    };
  }

  // Default
  return {
    answer:
      "Thanks for reaching out! I want to make sure I answer this accurately — could you give me one more line of detail? Or if you'd prefer, I'll connect you with a teammate.",
  };
}
