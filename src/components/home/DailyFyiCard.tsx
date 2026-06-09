import { Lightbulb } from "lucide-react";
import { dailyFyi } from "@/lib/user-data";

export function DailyFyiCard() {
  return (
    <section
      aria-label="Daily carbon fact"
      className="relative overflow-hidden rounded-3xl border border-sun/30 bg-gradient-to-br from-sun/25 via-card to-card p-5 shadow-[var(--shadow-soft)] sm:p-6"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sun text-sun-foreground">
          <Lightbulb className="h-5 w-5" />
        </span>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-sun-foreground/80">
            Daily FYI
          </p>
          <p className="text-base leading-relaxed text-foreground sm:text-lg">{dailyFyi.fact}</p>
        </div>
      </div>
    </section>
  );
}
