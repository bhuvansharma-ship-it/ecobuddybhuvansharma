import { Sparkles, ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import { proactiveInsight } from "@/lib/user-data";
import { openEcoBot, sendToEcoBot } from "@/components/ecobot/ecobot-bus";

export function InsightCard() {
  return (
    <section
      aria-label="EcoBot insight"
      className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0d4f3c] via-[#1a7a5f] to-[#2dd4a8] dark:from-[#061f17] dark:via-[#0d3a2c] dark:to-[#14503d]"
    >
      {/* Decorative colorful blobs */}
      <div
        className="absolute -right-8 -top-8 h-48 w-48 rounded-full blur-3xl bg-[rgba(45,212,168,0.45)] dark:bg-[rgba(20,150,120,0.25)]"
        aria-hidden
      />
      <div
        className="absolute -left-10 bottom-0 h-40 w-40 rounded-full blur-3xl bg-[rgba(251,191,36,0.35)] dark:bg-[rgba(180,140,20,0.2)]"
        aria-hidden
      />
      <div
        className="absolute right-20 bottom-[-2rem] h-32 w-32 rounded-full blur-2xl bg-[rgba(167,139,250,0.35)] dark:bg-[rgba(120,90,200,0.2)]"
        aria-hidden
      />

      <div className="relative space-y-4">
        {/* Colorful badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/20 text-[#a7f3d0] border border-[rgba(167,243,208,0.3)] backdrop-blur-sm dark:bg-white/10 dark:text-emerald-200 dark:border-emerald-400/20">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          EcoBot Insight
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white sm:text-xl">{proactiveInsight.title}</h2>
          <p className="text-sm leading-relaxed text-emerald-50/90 sm:text-base">
            {proactiveInsight.body}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => sendToEcoBot(`Tell me more about: ${proactiveInsight.title}`)}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition hover:brightness-110 bg-amber-400 text-emerald-900 shadow-amber-400/35 dark:bg-amber-500/85 dark:text-emerald-950 dark:shadow-amber-500/25"
          >
            <ArrowRight className="h-4 w-4" />
            Start challenge
          </button>
          <button
            type="button"
            onClick={() => sendToEcoBot("Explain this insight in more detail.")}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition bg-white/15 text-emerald-50 border border-white/20 hover:bg-white/25 dark:bg-white/10 dark:text-emerald-100 dark:border-white/15 dark:hover:bg-white/20"
          >
            <BookOpen className="h-4 w-4" />
            Learn more
          </button>
          <button
            type="button"
            onClick={openEcoBot}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition bg-white/15 text-emerald-50 border border-white/20 hover:bg-white/25 dark:bg-white/10 dark:text-emerald-100 dark:border-white/15 dark:hover:bg-white/20"
          >
            <MessageCircle className="h-4 w-4" />
            Ask EcoBot
          </button>
        </div>
      </div>
    </section>
  );
}
