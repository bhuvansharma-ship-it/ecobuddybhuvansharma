import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { createAuthedChatTransport } from "@/lib/chat-transport";

const STORAGE_KEY = "ecobot:messages:v1";
const CHAT_ID = "ecobot-main";
const API_ENDPOINT = "/api/chat";

function loadStoredMessages(): UIMessage[] {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function renderMessageText(message: UIMessage): string {
  return message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

/**
 * Shared EcoBot chat state: messages persisted to localStorage,
 * authed transport, consistent error toasts, and a stable chat id so
 * the inline page and the floating widget share the same conversation.
 */
export function useEcoBotChat() {
  const [initialMessages] = useState<UIMessage[]>(() => loadStoredMessages());

  const chat = useChat({
    id: CHAT_ID,
    messages: initialMessages,
    transport: createAuthedChatTransport(API_ENDPOINT),
    onError: (err) => {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) {
        toast.error("EcoBot is busy — try again in a moment.");
      } else if (msg.includes("402")) {
        toast.error("AI credits exhausted. Add credits in Workspace settings.");
      } else {
        toast.error("EcoBot hit a snag. Please try again.");
      }
    },
  });

  const { messages, sendMessage, status, setMessages } = chat;

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore quota errors */
    }
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      void sendMessage({ text: trimmed });
    },
    [isLoading, sendMessage],
  );

  const clear = useCallback(() => {
    setMessages([]);
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  }, [setMessages]);

  return {
    ...chat,
    isLoading,
    send,
    clear,
  };
}
