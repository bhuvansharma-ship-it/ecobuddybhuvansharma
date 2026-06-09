import { createFileRoute, Link } from "@tanstack/react-router";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { CarbonSummary } from "@/components/home/CarbonSummary";
import { DashboardCharts } from "@/components/home/DashboardCharts";
import { DailyFyiCard } from "@/components/home/DailyFyiCard";
import { QuickActions } from "@/components/home/QuickActions";
import { InsightCard } from "@/components/home/InsightCard";
import { ChallengeTracker } from "@/components/home/ChallengeTracker";
import { UserMenu } from "@/components/auth/UserMenu";
import { MessageCircle } from "lucide-react";
import ecobotAvatar from "@/assets/ecobot-avatar.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoBot — Your Sustainability Coach" },
      {
        name: "description",
        content:
          "Track your carbon footprint and chat with EcoBot, your AI sustainability coach, for personalized eco-friendly tips and challenges.",
      },
      { property: "og:title", content: "EcoBot — Your Sustainability Coach" },
      {
        property: "og:description",
        content:
          "Track your carbon footprint and chat with EcoBot, your AI sustainability coach.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main
      className="mx-auto w-full max-w-md space-y-4 px-4 pb-32 pt-[max(env(safe-area-inset-top),1rem)] sm:max-w-3xl sm:space-y-6 sm:px-6 sm:pt-12"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8rem)" }}
    >
      <div className="flex items-center justify-end">
        <UserMenu />
      </div>
      <WelcomeSection />

      {/* Chat CTA — prominent entry to the chat page */}
      <Link
        to="/chat"
        className="glass-tinted-leaf group relative flex items-center gap-4 overflow-hidden rounded-3xl p-5 transition hover:brightness-105 active:scale-[0.98]"
      >
        <div className="absolute -right-12 -bottom-16 h-48 w-48 rounded-full bg-leaf/30 blur-3xl" aria-hidden />
        <div className="relative shrink-0">
          <span className="absolute inset-0 rounded-full bg-leaf/20 blur-md transition group-hover:bg-leaf/30" aria-hidden />
          <img
            src={ecobotAvatar}
            alt="EcoBot"
            width={64}
            height={64}
            className="ecobot-float relative h-16 w-16 object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-foreground">Chat with EcoBot</p>
          <p className="text-sm text-muted-foreground truncate">
            Ask anything about your footprint, get challenges & tips.
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <MessageCircle className="h-5 w-5" />
        </div>
      </Link>

      <CarbonSummary />
      <DashboardCharts />
      <DailyFyiCard />
      <ChallengeTracker />
      <QuickActions />
      <InsightCard />
    </main>
  );
}
