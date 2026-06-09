import { Sparkles, ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import { proactiveInsight } from "@/lib/user-data";
import { openEcoBot, sendToEcoBot } from "@/components/ecobot/ecobot-bus";

export function InsightCard() {
  return (
    <section
      aria-label="EcoBot insight"
      className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary-soft via-card to-card p-5 shadow-[var(--shadow-soft)] sm:p-6"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-leaf/20 blur-3xl" aria-hidden />
      <div className="relative space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          EcoBot Insight
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {proactiveInsight.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {proactiveInsight.body}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => sendToEcoBot(`Tell me more about: ${proactiveInsight.title}`)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <ArrowRight className="h-4 w-4" />
            Start challenge
          </button>
          <button
            type="button"
            onClick={() => sendToEcoBot("Explain this insight in more detail.")}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40"
          >
            <BookOpen className="h-4 w-4" />
            Learn more
          </button>
          <button
            type="button"
            onClick={openEcoBot}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40"
          >
            <MessageCircle className="h-4 w-4" />
            Ask EcoBot
          </button>
        </div>
      </div>
    </section>
  );
}
