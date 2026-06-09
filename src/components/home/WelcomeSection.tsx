import { userContext } from "@/lib/user-data";

export function WelcomeSection() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{today}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {greeting}, <span className="text-primary">{userContext.name}</span>
      </h1>
      <p className="max-w-xl text-base text-muted-foreground">
        You're on day {userContext.joinedDays} of your sustainability journey. Small swaps,
        big impact — let's keep it going.
      </p>
    </header>
  );
}
