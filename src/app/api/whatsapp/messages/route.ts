// Client polling endpoint — returns messages received since the given timestamp.

import { getMessages, clearMessages } from "@/lib/whatsapp-store";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const sinceParam = url.searchParams.get("since");
  const sinceMs = sinceParam ? parseInt(sinceParam, 10) : 0;
  const messages = getMessages(isNaN(sinceMs) ? 0 : sinceMs);
  return Response.json({ messages, serverTime: new Date().toISOString() });
}

export async function DELETE(): Promise<Response> {
  clearMessages();
  return Response.json({ ok: true });
}
