import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { email: "ada@example.com", user_metadata: { full_name: "Ada Lovelace" } },
    session: null,
    loading: false,
    signOut: vi.fn(),
  }),
}));

import { WelcomeSection } from "./WelcomeSection";

describe("WelcomeSection", () => {
  beforeEach(() => cleanup());

  it("renders a greeting with the user's full name", () => {
    render(<WelcomeSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ada Lovelace");
  });

  it("uses one of the time-based greetings", () => {
    render(<WelcomeSection />);
    const heading = screen.getByRole("heading", { level: 1 }).textContent ?? "";
    expect(heading).toMatch(/Good (morning|afternoon|evening)/);
  });
});
