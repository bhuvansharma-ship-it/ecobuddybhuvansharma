import { useEffect, useMemo, useState } from "react";
import { Car, UtensilsCrossed, Target, History, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type ActionKey = "trip" | "meal" | "goal" | "history";

type HistoryItem = {
  id: string;
  kind: "trip" | "meal" | "goal";
  title: string;
  detail: string;
  at: number;
};

const STORAGE_KEY = "ecobot:quick-actions:v1";

function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("ecobot:history-updated"));
}

const actions: { key: ActionKey; label: string; icon: typeof Car; hint: string }[] = [
  { key: "trip", label: "Log a trip", icon: Car, hint: "Transport" },
  { key: "meal", label: "Log a meal", icon: UtensilsCrossed, hint: "Food" },
  { key: "goal", label: "Set a goal", icon: Target, hint: "Goals" },
  { key: "history", label: "View history", icon: History, hint: "Activity" },
];

export function QuickActions() {
  const [open, setOpen] = useState<ActionKey | null>(null);
  return (
    <section aria-label="Quick actions" className="space-y-3">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Quick actions
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map(({ key, label, icon: Icon, hint }) => (
          <button
            key={key}
            type="button"
            onClick={() => setOpen(key)}
            className="glass group flex flex-col items-start gap-3 rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary backdrop-blur transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{label}</span>
              <span className="block text-xs text-muted-foreground">{hint}</span>
            </span>
          </button>
        ))}
      </div>

      <TripDialog open={open === "trip"} onOpenChange={(v) => !v && setOpen(null)} />
      <MealDialog open={open === "meal"} onOpenChange={(v) => !v && setOpen(null)} />
      <GoalDialog open={open === "goal"} onOpenChange={(v) => !v && setOpen(null)} />
      <HistoryDialog open={open === "history"} onOpenChange={(v) => !v && setOpen(null)} />
    </section>
  );
}

function addItem(item: Omit<HistoryItem, "id" | "at">) {
  const list = loadHistory();
  list.unshift({ ...item, id: crypto.randomUUID(), at: Date.now() });
  saveHistory(list.slice(0, 100));
}

function TripDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [mode, setMode] = useState("car");
  const [distance, setDistance] = useState("");

  const submit = () => {
    const d = parseFloat(distance);
    if (!d || d <= 0) return toast.error("Enter a valid distance");
    const factors: Record<string, number> = { car: 0.21, bus: 0.1, train: 0.04, bike: 0, walk: 0 };
    const kg = (d * (factors[mode] ?? 0.2)).toFixed(2);
    addItem({ kind: "trip", title: `${d} km by ${mode}`, detail: `${kg} kg CO₂e` });
    toast.success("Trip logged", { description: `${d} km by ${mode} · ${kg} kg CO₂e` });
    setDistance("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a trip</DialogTitle>
          <DialogDescription>Track your transport footprint.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="walk">Walk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input id="distance" type="number" inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g. 12" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MealDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [type, setType] = useState("plant-based");
  const [note, setNote] = useState("");

  const submit = () => {
    const factors: Record<string, number> = { "plant-based": 0.5, vegetarian: 1.2, poultry: 2.5, beef: 6.5, seafood: 1.8 };
    const kg = (factors[type] ?? 1).toFixed(2);
    addItem({ kind: "meal", title: `${type} meal${note ? ` – ${note}` : ""}`, detail: `${kg} kg CO₂e` });
    toast.success("Meal logged", { description: `${type} · ${kg} kg CO₂e` });
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a meal</DialogTitle>
          <DialogDescription>Track what you ate.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="plant-based">Plant-based</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="poultry">Poultry</SelectItem>
                <SelectItem value="seafood">Seafood</SelectItem>
                <SelectItem value="beef">Beef / red meat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. lunch salad" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GoalDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [text, setText] = useState("");
  const submit = () => {
    if (!text.trim()) return toast.error("Describe your goal");
    addItem({ kind: "goal", title: text.trim(), detail: "Goal set" });
    toast.success("Goal set", { description: text.trim() });
    setText("");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set a goal</DialogTitle>
          <DialogDescription>What do you want to achieve this week?</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="goal">Goal</Label>
          <Input id="goal" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Bike 3 days this week" />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HistoryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    if (!open) return;
    setItems(loadHistory());
    const handler = () => setItems(loadHistory());
    window.addEventListener("ecobot:history-updated", handler);
    return () => window.removeEventListener("ecobot:history-updated", handler);
  }, [open]);

  const grouped = useMemo(() => items, [items]);

  const remove = (id: string) => {
    const next = loadHistory().filter((i) => i.id !== id);
    saveHistory(next);
    setItems(next);
  };

  const clear = () => {
    saveHistory([]);
    setItems([]);
    toast.success("History cleared");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Activity history</DialogTitle>
          <DialogDescription>Your recently logged actions.</DialogDescription>
        </DialogHeader>
        {grouped.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ScrollArea className="max-h-[50vh] pr-3">
            <ul className="space-y-2">
              {grouped.map((i) => (
                <li key={i.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium capitalize">{i.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.detail} · {new Date(i.at).toLocaleString()}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remove(i.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
        <DialogFooter>
          {grouped.length > 0 && (
            <Button variant="ghost" onClick={clear}>Clear all</Button>
          )}
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
