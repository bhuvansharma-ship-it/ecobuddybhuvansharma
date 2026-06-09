import { describe, it, expect } from "vitest";
import { renderErrorPage } from "./error-page";

describe("renderErrorPage", () => {
  const html = renderErrorPage();
  it("returns a full HTML document", () => {
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("</html>");
  });
  it("includes recovery actions", () => {
    expect(html).toContain("Try again");
    expect(html).toContain('href="/"');
  });
});
