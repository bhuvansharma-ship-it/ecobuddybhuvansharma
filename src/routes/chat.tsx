import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { createAuthedChatTransport } from "@/lib/chat-transport";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Leaf, Trash2 } from "lucide-react";

import ecobotAvatar from "@/assets/ecobot-avatar.png";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { suggestedPrompts } from "@/lib/ecobot-prompts";

const STORAGE_KEY = "ecobot:messages:v1";

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function renderMessageText(message: UIMessage): string {
  return message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat with EcoBot" },
      { name: "description", content: "Chat with EcoBot, your AI sustainability coach." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [initialMessages] = useState<UIMessage[]>(() => loadMessages());
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "ecobot-main",
    messages: initialMessages,
    transport: createAuthedChatTransport("/api/chat"),
    onError: (err) => {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) toast.error("EcoBot is busy — try again in a moment.");
      else if (msg.includes("402")) toast.error("AI credits exhausted.");
      else toast.error("EcoBot hit a snag. Please try again.");
    },
  });

  // Persist messages
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Focus textarea on mount
  useEffect(() => {
    const t = setTimeout(() => textareaRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text || isLoading) return;
    void sendMessage({ text });
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    void sendMessage({ text: prompt });
  };

  const handleClear = () => {
    setMessages([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/40 bg-white/60 px-4 py-3 backdrop-blur">
        <Link
          to="/"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 transition hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </Link>
        <div className="relative">
          <img
            src={ecobotAvatar}
            alt="EcoBot"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-leaf"
            aria-hidden
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight text-foreground truncate">EcoBot</p>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            {isLoading ? "Thinking…" : "Your sustainability coach"}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear conversation"
            className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <Conversation className="flex-1">
        <ConversationContent className="space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
              <img
                src={ecobotAvatar}
                alt=""
                width={80}
                height={80}
                className="ecobot-float h-20 w-20 object-contain"
              />
              <div>
                <p className="text-lg font-semibold text-foreground">Hey, I'm EcoBot 🌱</p>
                <p className="mt-1 text-sm text-muted-foreground max-w-[260px]">
                  Ask me about your footprint, get a daily challenge, or estimate the carbon cost of just about anything.
                </p>
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = renderMessageText(m);
            return (
              <Message key={m.id} from={m.role}>
                <MessageContent>
                  {m.role === "assistant" ? (
                    <MessageResponse>{text}</MessageResponse>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">{text}</div>
                  )}
                </MessageContent>
              </Message>
            );
          })}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>EcoBot is thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}

          {error && (
            <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive mx-4">
              Couldn't reach EcoBot. Try again in a moment.
            </p>
          )}
        </ConversationContent>
      </Conversation>

      {/* Suggested prompts */}
      {messages.length === 0 && (
        <div className="border-t border-border/30 bg-white/40 px-3 pt-3 backdrop-blur">
          <div className="mb-2 flex items-center gap-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Leaf className="h-3 w-3 text-leaf" />
            Try asking
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickPrompt(p)}
                className="glass-subtle shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="border-t border-border/40 bg-white/60 p-3 backdrop-blur">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            ref={textareaRef}
            placeholder="Ask EcoBot anything about your footprint…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={isLoading} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
