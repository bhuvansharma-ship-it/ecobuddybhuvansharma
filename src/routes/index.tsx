import { createFileRoute } from "@tanstack/react-router";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { CarbonSummary } from "@/components/home/CarbonSummary";
import { DailyFyiCard } from "@/components/home/DailyFyiCard";
import { EcoBotInlineCard } from "@/components/ecobot/EcoBotInlineCard";
import { QuickActions } from "@/components/home/QuickActions";
import { InsightCard } from "@/components/home/InsightCard";
import { ChallengeTracker } from "@/components/home/ChallengeTracker";

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
      <WelcomeSection />
      <CarbonSummary />
      <DailyFyiCard />
      <EcoBotInlineCard />
      <ChallengeTracker />
      <QuickActions />
      <InsightCard />
    </main>
  );
}
