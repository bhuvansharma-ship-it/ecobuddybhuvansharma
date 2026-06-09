import { Flame, CheckCircle2, Target, CalendarCheck, Sparkles, Undo2 } from "lucide-react";
import { useChallenges } from "@/lib/challenges";
import { sendToEcoBot } from "@/components/ecobot/ecobot-bus";

export function ChallengeTracker() {
  const { todaysChallenge, completedToday, streak, stats, complete, undo } = useChallenges();

  return (
    <section
      aria-label="Daily challenge tracker"
      className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Daily Challenge
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-sun/15 px-3 py-1 text-xs font-semibold text-foreground">
          <Flame className="h-3.5 w-3.5 text-sun" />
          {streak}-day streak
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          {todaysChallenge.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          Estimated saving: ~{todaysChallenge.kg} kg CO₂
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {completedToday ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/20 px-4 py-2 text-sm font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-leaf" />
              Completed today
            </span>
            <button
              type="button"
              onClick={undo}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/40"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={complete}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark complete
          </button>
        )}
        <button
          type="button"
          onClick={() =>
            sendToEcoBot(`Give me tips to complete today's challenge: ${todaysChallenge.title}`)
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40"
        >
          Ask EcoBot for tips
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat icon={<Flame className="h-4 w-4 text-sun" />} label="Streak" value={`${streak}d`} />
        <Stat
          icon={<CalendarCheck className="h-4 w-4 text-leaf" />}
          label="This week"
          value={`${stats.last7}/7`}
        />
        <Stat
          icon={<Target className="h-4 w-4 text-primary" />}
          label="All-time"
          value={`${stats.total}`}
        />
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}
