import { userContext } from "@/lib/user-data";
import { useAuth } from "@/hooks/useAuth";

function getISTHour() {
  const istString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(istString).getHours();
}

export function WelcomeSection() {
  const { user } = useAuth();

  const hour = getISTHour();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split("@")[0] ??
    userContext.name;

  return (
    <header className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{today}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {greeting}, <span className="text-primary">{displayName}</span>
      </h1>
      <p className="max-w-xl text-base text-muted-foreground">
        You're on day {userContext.joinedDays} of your sustainability journey. Small swaps, big
        impact — let's keep it going.
      </p>
    </header>
  );
}
