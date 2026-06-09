import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

const openEcoBot = vi.fn();
const sendToEcoBot = vi.fn();
vi.mock("@/components/ecobot/ecobot-bus", () => ({
  openEcoBot: () => openEcoBot(),
  sendToEcoBot: (p: string) => sendToEcoBot(p),
}));

import { InsightCard } from "./InsightCard";
import { proactiveInsight } from "@/lib/user-data";

afterEach(() => {
  cleanup();
  openEcoBot.mockClear();
  sendToEcoBot.mockClear();
});

describe("InsightCard", () => {
  it("renders the proactive insight title and body", () => {
    render(<InsightCard />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(proactiveInsight.title);
    expect(screen.getByText(proactiveInsight.body)).toBeInTheDocument();
  });

  it("Start challenge sends a contextual prompt", () => {
    render(<InsightCard />);
    fireEvent.click(screen.getByRole("button", { name: /start challenge/i }));
    expect(sendToEcoBot).toHaveBeenCalledWith(`Tell me more about: ${proactiveInsight.title}`);
  });

  it("Learn more sends a generic explain prompt", () => {
    render(<InsightCard />);
    fireEvent.click(screen.getByRole("button", { name: /learn more/i }));
    expect(sendToEcoBot).toHaveBeenCalledWith("Explain this insight in more detail.");
  });

  it("Ask EcoBot opens the chat without a prompt", () => {
    render(<InsightCard />);
    fireEvent.click(screen.getByRole("button", { name: /ask ecobot/i }));
    expect(openEcoBot).toHaveBeenCalledOnce();
  });
});
