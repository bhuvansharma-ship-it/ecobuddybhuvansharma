import { useEffect, useRef, useState } from "react";
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
import { useEcoBotChat, renderMessageText } from "@/hooks/useEcoBotChat";
import { subscribeEcoBot } from "./ecobot-bus";

export function EcoBotWidget() {
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { messages, status, error, isLoading, send, clear } = useEcoBotChat();

  // External open/sendMessage requests.
  useEffect(() => {
    return subscribeEcoBot((prompt) => {
      setOpen(true);
      if (prompt && prompt.trim()) {
        // Defer to let the panel mount.
        setTimeout(() => send(prompt), 60);
      }
    });
  }, [send]);

  // Focus textarea when opened.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text) send(message.text);
  };

  const handleQuickPrompt = (prompt: string) => send(prompt);
  const handleClear = () => clear();

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
            "ecobot-pop glass-strong fixed z-50 flex flex-col overflow-hidden",
            // Mobile: full screen-ish; Desktop: floating panel
            "inset-x-3 bottom-3 top-16 rounded-3xl",
            "sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[640px] sm:max-h-[85vh] sm:w-[400px]",
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/15 bg-white/5 px-4 py-3 backdrop-blur">
            <div className="relative">
              <img
                src={ecobotAvatar}
                alt="EcoBot"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-leaf"
                aria-hidden
              />
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
          <Conversation className="flex-1">
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
                      Ask me about your footprint, get a daily challenge, or estimate the carbon
                      cost of just about anything.
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
          <div className="border-t border-white/10 bg-white/5 px-3 pt-3 backdrop-blur">
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
                  className="glass-subtle shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-white/10 bg-white/5 p-3 backdrop-blur">
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
