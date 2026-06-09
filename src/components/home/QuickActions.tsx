import { Car, UtensilsCrossed, Target, History } from "lucide-react";

const actions = [
  { label: "Log a trip", icon: Car, hint: "Transport" },
  { label: "Log a meal", icon: UtensilsCrossed, hint: "Food" },
  { label: "Set a goal", icon: Target, hint: "Goals" },
  { label: "View history", icon: History, hint: "Activity" },
];

export function QuickActions() {
  return (
    <section aria-label="Quick actions" className="space-y-3">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Quick actions
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map(({ label, icon: Icon, hint }) => (
          <button
            key={label}
            type="button"
            className="group flex flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{label}</span>
              <span className="block text-xs text-muted-foreground">{hint}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
