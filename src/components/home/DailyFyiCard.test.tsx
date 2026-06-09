import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DailyFyiCard } from "./DailyFyiCard";
import { dailyFyi } from "@/lib/user-data";

afterEach(cleanup);

describe("DailyFyiCard", () => {
  it("renders the daily fact text", () => {
    render(<DailyFyiCard />);
    expect(screen.getByText(dailyFyi.fact)).toBeInTheDocument();
  });

  it("is exposed as an accessible region", () => {
    render(<DailyFyiCard />);
    expect(screen.getByRole("region", { name: /daily carbon fact/i })).toBeInTheDocument();
  });
});
