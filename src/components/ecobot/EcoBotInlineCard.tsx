import ecobotAvatar from "@/assets/ecobot-avatar.png";
import { Sparkles, MessageCircle } from "lucide-react";
import { openEcoBot, sendToEcoBot } from "./ecobot-bus";
import { suggestedPrompts } from "@/lib/ecobot-prompts";

export function EcoBotInlineCard() {
  return (
    <section
      aria-label="EcoBot assistant"
      className="glass-tinted-leaf relative overflow-hidden rounded-3xl p-5 sm:p-6"
    >
      <div className="absolute -right-12 -bottom-16 h-48 w-48 rounded-full bg-leaf/30 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <button
          type="button"
          onClick={openEcoBot}
          className="group relative mx-auto h-20 w-20 shrink-0 sm:mx-0"
          aria-label="Open EcoBot"
        >
          <span className="absolute inset-0 rounded-full bg-leaf/20 blur-md transition group-hover:bg-leaf/30" aria-hidden />
          <img
            src={ecobotAvatar}
            alt="EcoBot"
            width={80}
            height={80}
            loading="lazy"
            className="ecobot-float relative h-20 w-20 object-contain"
          />
        </button>
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-leaf backdrop-blur">
              <Sparkles className="h-3 w-3" />
              AI Coach
            </div>
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              Hi, I'm EcoBot — ask me anything about your footprint.
            </h2>
            <p className="text-sm text-muted-foreground">
              Carbon questions, daily challenges, and tips based on your data.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {suggestedPrompts.slice(0, 3).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => sendToEcoBot(p)}
                className="glass-subtle rounded-full px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40"
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={openEcoBot}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-leaf/30 transition hover:brightness-110"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Open chat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
