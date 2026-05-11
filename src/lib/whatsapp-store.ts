// In-memory store for incoming WhatsApp messages.
// Persists across Next.js HMR via globalThis. Sufficient for a single-laptop
// demo run via ngrok. Not safe for production / multi-instance deploys.

export type IncomingMessage = {
  id: string;
  from: string;
  fromMasked: string;
  body: string;
  receivedAt: string;
  aiReply?: string;
  aiSources?: string[];
};

type Store = {
  messages: IncomingMessage[];
};

const STORE_KEY = "__voltade_whatsapp_store__";

function getStore(): Store {
  const g = globalThis as unknown as Record<string, Store>;
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = { messages: [] };
  }
  return g[STORE_KEY];
}

export function appendMessage(msg: IncomingMessage): void {
  const store = getStore();
  store.messages = [...store.messages, msg].slice(-100); // keep last 100
}

export function getMessages(sinceMs = 0): IncomingMessage[] {
  return getStore().messages.filter((m) => new Date(m.receivedAt).getTime() > sinceMs);
}

export function clearMessages(): void {
  getStore().messages = [];
}

export function maskPhoneNumber(num: string): string {
  // "+6581234567" → "+65 ••• 4567"
  const trimmed = num.replace("whatsapp:", "").replace(/\s+/g, "");
  if (trimmed.length < 6) return trimmed;
  return `${trimmed.slice(0, 3)} ••• ${trimmed.slice(-4)}`;
}
