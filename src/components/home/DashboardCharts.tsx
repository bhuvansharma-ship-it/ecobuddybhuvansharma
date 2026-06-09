import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useActivityTotals } from "@/lib/activity-log";
import { userContext } from "@/lib/user-data";

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const weekConfig = {
  saved: { label: "kg CO₂", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const CATEGORY_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--sky-foreground, var(--primary)))",
  "hsl(var(--sun-foreground, var(--primary)))",
  "hsl(var(--muted-foreground))",
];

export function DashboardCharts() {
  const { items } = useActivityTotals();

  const weekData = useMemo(() => {
    const days: { day: string; saved: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    for (let i = 0; i < 7; i++) {
      const start = new Date(monday);
      start.setDate(monday.getDate() + i);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      const logged = items
        .filter((it) => it.kind !== "goal" && it.at >= start.getTime() && it.at < end.getTime())
        .reduce((acc, it) => acc + (it.kg ?? 0), 0);
      // Baseline: spread weekly saved across the week so the chart isn't empty
      const baseline = userContext.saved.week / 7;
      days.push({ day: WEEK_LABELS[i], saved: +(baseline + logged).toFixed(2) });
    }
    return days;
  }, [items]);

  const categoryData = userContext.topCategories.map((c, i) => ({
    name: c.name,
    value: c.kgCo2PerMonth,
    fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  const categoryConfig = Object.fromEntries(
    userContext.topCategories.map((c, i) => [
      c.name,
      { label: c.name, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] },
    ])
  ) satisfies ChartConfig;

  return (
    <section aria-label="Dashboard charts" className="space-y-3">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Insights
      </h2>

      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              This week
            </p>
            <h3 className="text-base font-semibold text-foreground">Daily CO₂ saved</h3>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <BarChart3 className="h-4 w-4" />
          </span>
        </div>
        <ChartContainer config={weekConfig} className="h-44 w-full">
          <BarChart data={weekData} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={6} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} width={30} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="saved" fill="var(--color-saved)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              This month
            </p>
            <h3 className="text-base font-semibold text-foreground">Footprint by category</h3>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <PieIcon className="h-4 w-4" />
          </span>
        </div>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ChartContainer config={categoryConfig} className="h-52 w-full sm:w-5/12">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={56}
                outerRadius={84}
                strokeWidth={3}
                stroke="hsl(var(--card))"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="w-full space-y-3 sm:w-7/12">
            {categoryData
              .sort((a, b) => b.value - a.value)
              .map((c) => {
                const total = categoryData.reduce((sum, x) => sum + x.value, 0);
                const pct = total > 0 ? Math.round((c.value / total) * 100) : 0;
                return (
                  <div key={c.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1"
                          style={{
                            backgroundColor: c.fill,
                            ringColor: c.fill,
                            ringOffsetColor: "hsl(var(--card))",
                          }}
                        />
                        <span className="font-medium text-foreground">{c.name}</span>
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {c.value} kg · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: c.fill }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
