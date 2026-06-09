import { TrendingDown, Leaf, CalendarDays, CalendarRange } from "lucide-react";
import { userContext } from "@/lib/user-data";
import { useActivityTotals } from "@/lib/activity-log";
import { cn } from "@/lib/utils";

const tiles = [
  { key: "today", label: "Today", icon: Leaf, accent: "bg-leaf/15 text-leaf" },
  { key: "week", label: "This week", icon: CalendarDays, accent: "bg-sky/20 text-sky-foreground" },
  { key: "month", label: "This month", icon: CalendarRange, accent: "bg-sun/25 text-sun-foreground" },
] as const;

export function CarbonSummary() {
  const { saved, trend } = userContext;
  const logged = useActivityTotals();
  const totals = {
    today: saved.today + logged.today,
    week: saved.week + logged.week,
    month: saved.month + logged.month,
  };
  const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1));
  return (
    <section
      aria-label="Carbon saved summary"
      className="glass rounded-3xl p-5 sm:p-6"
    >
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Carbon Saved
          </p>
          <h2 className="text-xl font-semibold text-foreground">Your impact so far</h2>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-leaf/20 px-3 py-1 text-xs font-semibold text-leaf backdrop-blur">
          <TrendingDown className="h-3.5 w-3.5" />
          {Math.abs(trend.weekVsLastWeek)}% vs last week
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {tiles.map(({ key, label, icon: Icon, accent }) => (
          <div
            key={key}
            className="glass-subtle rounded-2xl p-3 transition hover:border-primary/40 sm:p-4"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="truncate text-[11px] font-medium text-muted-foreground sm:text-sm">
                {label}
              </span>
              <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full backdrop-blur sm:h-8 sm:w-8", accent)}>
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              </span>
            </div>
            <p className="mt-2 text-xl font-semibold leading-tight text-foreground sm:mt-3 sm:text-3xl">
              {fmt(totals[key])}
              <span className="ml-0.5 text-[10px] font-normal text-muted-foreground sm:ml-1 sm:text-base">
                kg
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground sm:hidden">CO₂</p>
            {logged[key] > 0 && (
              <p className="mt-1 text-[10px] text-leaf sm:text-xs">+{fmt(logged[key])} logged</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
