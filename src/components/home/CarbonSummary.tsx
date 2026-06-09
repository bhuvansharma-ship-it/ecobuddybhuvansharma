import { TrendingDown, Leaf, CalendarDays, CalendarRange } from "lucide-react";
import { userContext } from "@/lib/user-data";
import { cn } from "@/lib/utils";

const tiles = [
  { key: "today", label: "Today", icon: Leaf, accent: "bg-leaf/15 text-leaf" },
  { key: "week", label: "This week", icon: CalendarDays, accent: "bg-sky/20 text-sky-foreground" },
  { key: "month", label: "This month", icon: CalendarRange, accent: "bg-sun/25 text-sun-foreground" },
] as const;

export function CarbonSummary() {
  const { saved, trend } = userContext;
  return (
    <section
      aria-label="Carbon saved summary"
      className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6"
    >
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Carbon Saved
          </p>
          <h2 className="text-xl font-semibold text-foreground">Your impact so far</h2>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-leaf/15 px-3 py-1 text-xs font-semibold text-leaf">
          <TrendingDown className="h-3.5 w-3.5" />
          {Math.abs(trend.weekVsLastWeek)}% vs last week
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tiles.map(({ key, label, icon: Icon, accent }) => (
          <div
            key={key}
            className="rounded-2xl border border-border/50 bg-background/60 p-4 transition hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", accent)}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-foreground">
              {saved[key]}
              <span className="ml-1 text-base font-normal text-muted-foreground">kg CO₂</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
