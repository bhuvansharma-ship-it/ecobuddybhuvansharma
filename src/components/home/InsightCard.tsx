import { Sparkles, ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import { proactiveInsight } from "@/lib/user-data";
import { openEcoBot, sendToEcoBot } from "@/components/ecobot/ecobot-bus";

export function InsightCard() {
  return (
    <section
      aria-label="EcoBot insight"
      className="relative overflow-hidden rounded-3xl p-5 sm:p-6"
      style={{
        background: "linear-gradient(135deg, #0d4f3c 0%, #1a7a5f 40%, #2dd4a8 100%)",
      }}
    >
      {/* Decorative colorful blobs */}
      <div
        className="absolute -right-8 -top-8 h-48 w-48 rounded-full blur-3xl"
        style={{ background: "rgba(45, 212, 168, 0.45)" }}
        aria-hidden
      />
      <div
        className="absolute -left-10 bottom-0 h-40 w-40 rounded-full blur-3xl"
        style={{ background: "rgba(251, 191, 36, 0.35)" }}
        aria-hidden
      />
      <div
        className="absolute right-20 bottom-[-2rem] h-32 w-32 rounded-full blur-2xl"
        style={{ background: "rgba(167, 139, 250, 0.35)" }}
        aria-hidden
      />

      <div className="relative space-y-4">
        {/* Colorful badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            color: "#a7f3d0",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(167, 243, 208, 0.3)",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: "#fbbf24" }} />
          EcoBot Insight
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            {proactiveInsight.title}
          </h2>
          <p className="text-sm leading-relaxed text-emerald-50 sm:text-base" style={{ opacity: 0.9 }}>
            {proactiveInsight.body}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => sendToEcoBot(`Tell me more about: ${proactiveInsight.title}`)}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition hover:brightness-110"
            style={{
              background: "#fbbf24",
              color: "#14532d",
              boxShadow: "0 8px 24px rgba(251, 191, 36, 0.35)",
            }}
          >
            <ArrowRight className="h-4 w-4" />
            Start challenge
          </button>
          <button
            type="button"
            onClick={() => sendToEcoBot("Explain this insight in more detail.")}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/25"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ecfdf5",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <BookOpen className="h-4 w-4" />
            Learn more
          </button>
          <button
            type="button"
            onClick={openEcoBot}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/25"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ecfdf5",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Ask EcoBot
          </button>
        </div>
      </div>
    </section>
  );
}
