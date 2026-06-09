import { describe, it, expect, afterEach } from "vitest";
import { getServerConfig } from "./config.server";

const original = process.env.NODE_ENV;
afterEach(() => {
  process.env.NODE_ENV = original;
});

describe("getServerConfig", () => {
  it("reads NODE_ENV at call time", () => {
    process.env.NODE_ENV = "production";
    expect(getServerConfig().nodeEnv).toBe("production");
    process.env.NODE_ENV = "test";
    expect(getServerConfig().nodeEnv).toBe("test");
  });
});
