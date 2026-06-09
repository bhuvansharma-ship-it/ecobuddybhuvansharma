import { describe, it, expect, vi, afterEach } from "vitest";
import { reportLovableError } from "./lovable-error-reporting";

afterEach(() => {
  delete (window as unknown as { __lovableEvents?: unknown }).__lovableEvents;
});

describe("reportLovableError", () => {
  it("no-ops when global hook missing", () => {
    expect(() => reportLovableError(new Error("x"))).not.toThrow();
  });

  it("forwards error + context with react_error_boundary mechanism", () => {
    const captureException = vi.fn();
    window.__lovableEvents = { captureException };
    const err = new Error("oops");
    reportLovableError(err, { extra: 1 });
    expect(captureException).toHaveBeenCalledTimes(1);
    const [e, ctx, opts] = captureException.mock.calls[0];
    expect(e).toBe(err);
    expect(ctx).toMatchObject({ source: "react_error_boundary", extra: 1 });
    expect(ctx.route).toBe(window.location.pathname);
    expect(opts).toEqual({
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    });
  });
});
