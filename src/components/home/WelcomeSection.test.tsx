import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

const mockUser = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUser(),
}));

import { WelcomeSection } from "./WelcomeSection";
import { userContext } from "@/lib/user-data";

describe("WelcomeSection", () => {
  beforeEach(() => {
    cleanup();
    mockUser.mockReturnValue({
      user: { email: "ada@example.com", user_metadata: { full_name: "Ada Lovelace" } },
      session: null,
      loading: false,
      signOut: vi.fn(),
    });
  });
  afterEach(() => cleanup());

  it("renders a greeting with the user's full name", () => {
    render(<WelcomeSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ada Lovelace");
  });

  it("uses morning greeting before 12 IST", () => {
    vi.setSystemTime(new Date("2024-01-01T06:00:00+05:30"));
    render(<WelcomeSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Good morning");
  });

  it("uses afternoon greeting between 12 and 17 IST", () => {
    vi.setSystemTime(new Date("2024-01-01T14:00:00+05:30"));
    render(<WelcomeSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Good afternoon");
  });

  it("uses evening greeting after 17 IST", () => {
    vi.setSystemTime(new Date("2024-01-01T19:00:00+05:30"));
    render(<WelcomeSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Good evening");
  });

  it("falls back to name when full_name is missing", () => {
    mockUser.mockReturnValue({
      user: { email: "ada@example.com", user_metadata: { name: "Ada Name" } },
      session: null,
      loading: false,
      signOut: vi.fn(),
    });
    render(<WelcomeSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ada Name");
  });

  it("falls back to email prefix when full_name and name are missing", () => {
    mockUser.mockReturnValue({
      user: { email: "grace@example.com", user_metadata: {} },
      session: null,
      loading: false,
      signOut: vi.fn(),
    });
    render(<WelcomeSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("grace");
  });

  it("falls back to userContext.name when user is null", () => {
    mockUser.mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signOut: vi.fn(),
    });
    render(<WelcomeSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(userContext.name);
  });
});
