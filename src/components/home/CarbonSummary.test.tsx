import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

const mockTotals = vi.fn(() => ({ today: 0, week: 0, month: 0 }));
vi.mock("@/lib/activity-log", () => ({
  useActivityTotals: () => mockTotals(),
}));

import { CarbonSummary } from "./CarbonSummary";

afterEach(() => {
  cleanup();
  mockTotals.mockReset();
});

describe("CarbonSummary", () => {
  it("renders three time-period tiles labeled today/week/month", () => {
    render(<CarbonSummary />);
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("This week")).toBeInTheDocument();
    expect(screen.getByText("This month")).toBeInTheDocument();
  });

  it("exposes itself as an accessible region", () => {
    render(<CarbonSummary />);
    expect(screen.getByRole("region", { name: /carbon saved summary/i })).toBeInTheDocument();
  });

  it("shows logged bonus when logged values are positive", () => {
    mockTotals.mockReturnValue({ today: 1.5, week: 3, month: 10 });
    render(<CarbonSummary />);
    expect(screen.getByText(/\+1\.5 logged/)).toBeInTheDocument();
  });

  it("does not show logged bonus when logged values are zero", () => {
    mockTotals.mockReturnValue({ today: 0, week: 0, month: 0 });
    render(<CarbonSummary />);
    expect(screen.queryByText(/logged/)).not.toBeInTheDocument();
  });
});

