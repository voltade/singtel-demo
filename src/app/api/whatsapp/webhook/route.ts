// Twilio WhatsApp webhook receiver.
//
// Twilio POSTs application/x-www-form-urlencoded with fields including:
//   From, To, Body, MessageSid, ProfileName
//
// We:
//   1. Parse the incoming form
//   2. Append the message to the in-memory store so the demo's customer-chat
//      panel can render it on the next poll
//   3. Generate a canned AI reply from the same logic the in-browser chat uses
//   4. Append the AI reply to the same store entry
//   5. Return TwiML so Twilio echoes the AI reply back to the participant's
//      WhatsApp thread — the participant sees the AI response on their phone

import { appendMessage, maskPhoneNumber, type IncomingMessage } from "@/lib/whatsapp-store";
import { getCustomerReply } from "@/lib/customer-replies";

export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const from = (form.get("From") as string) ?? "unknown";
  const body = ((form.get("Body") as string) ?? "").trim();
  const messageSid = (form.get("MessageSid") as string) ?? `manual-${Date.now()}`;

  const reply = getCustomerReply(body);

  const msg: IncomingMessage = {
    id: messageSid,
    from,
    fromMasked: maskPhoneNumber(from),
    body,
    receivedAt: new Date().toISOString(),
    aiReply: reply.answer,
    aiSources: reply.sources,
  };

  appendMessage(msg);

  // Build TwiML to send AI reply back to the participant
  const safeReply = reply.answer
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&apos;")
    .replaceAll('"', "&quot;");

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${safeReply}</Message>
</Response>`;

  return new Response(twiml, {
    status: 200,
    headers: { "content-type": "application/xml" },
  });
}

// Twilio sometimes sends GET to verify endpoints — respond OK.
export async function GET(): Promise<Response> {
  return new Response("WhatsApp webhook live", { status: 200 });
}
