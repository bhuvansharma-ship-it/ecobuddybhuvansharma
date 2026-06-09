import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MessageCircle, X, Minimize2, Sparkles, Trash2, Leaf } from "lucide-react";

import ecobotAvatar from "@/assets/ecobot-avatar.png";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";
import { suggestedPrompts } from "@/lib/ecobot-prompts";
import { subscribeEcoBot } from "./ecobot-bus";

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

export function EcoBotWidget() {
  const [open, setOpen] = useState(false);
  const [initialMessages] = useState<UIMessage[]>(() => loadMessages());
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "ecobot-main",
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) toast.error("EcoBot is busy — try again in a moment.");
      else if (msg.includes("402")) toast.error("AI credits exhausted. Add credits in Workspace settings.");
      else toast.error("EcoBot hit a snag. Please try again.");
    },
  });

  // Persist messages.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // External open/sendMessage requests.
  useEffect(() => {
    const unsub = subscribeEcoBot((prompt) => {
      setOpen(true);
      if (prompt && prompt.trim()) {
        // Defer to let the panel mount.
        setTimeout(() => {
          void sendMessage({ text: prompt });
        }, 60);
      }
    });
    return () => {
      unsub();
    };
  }, [sendMessage]);

  // Focus textarea when opened.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

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
    <>
      {/* Floating action button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open EcoBot assistant"
          className="ecobot-pulse fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-leaf to-primary text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-105 sm:bottom-6 sm:right-6"
        >
          <img
            src={ecobotAvatar}
            alt=""
            width={56}
            height={56}
            className="ecobot-float h-14 w-14 object-contain"
          />
          <span className="sr-only">EcoBot</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="EcoBot chat"
          className={cn(
            "ecobot-pop fixed z-50 flex flex-col overflow-hidden border border-border bg-card shadow-[var(--shadow-glow)]",
            // Mobile: full screen-ish; Desktop: floating panel
            "inset-x-3 bottom-3 top-16 rounded-3xl",
            "sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[640px] sm:max-h-[85vh] sm:w-[400px]",
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/70 bg-gradient-to-br from-primary-soft via-card to-card px-4 py-3">
            <div className="relative">
              <img
                src={ecobotAvatar}
                alt="EcoBot"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-leaf" aria-hidden />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight text-foreground">EcoBot</p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                Your sustainability coach
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
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Minimize EcoBot"
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close EcoBot"
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground sm:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <Conversation className="flex-1 bg-gradient-to-b from-card to-background">
            <ConversationContent className="space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                  <img
                    src={ecobotAvatar}
                    alt=""
                    width={72}
                    height={72}
                    className="ecobot-float h-18 w-18 object-contain"
                  />
                  <div>
                    <p className="text-base font-semibold text-foreground">Hey, I'm EcoBot 🌱</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ask me about your footprint, get a daily challenge, or estimate the
                      carbon cost of just about anything.
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
                        <div className="whitespace-pre-wrap leading-relaxed">{text}</div>
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
                <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  Couldn't reach EcoBot. Try again in a moment.
                </p>
              )}
            </ConversationContent>
          </Conversation>

          {/* Suggested prompts */}
          <div className="border-t border-border/60 bg-card/80 px-3 pt-3">
            <div className="mb-2 flex items-center gap-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Leaf className="h-3 w-3 text-leaf" />
              Try asking
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickPrompt(p)}
                  className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-primary-soft disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-border/60 bg-card p-3">
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
      )}
    </>
  );
}
