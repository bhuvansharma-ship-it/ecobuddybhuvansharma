import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("@/lib/activity-log", () => ({
  useActivityTotals: () => ({ today: 0, week: 0, month: 0 }),
}));

import { CarbonSummary } from "./CarbonSummary";

afterEach(cleanup);

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
});
