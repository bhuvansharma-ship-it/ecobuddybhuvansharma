import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "src/test/**",
        "src/components/ui/**",
        "src/components/ai-elements/**",
        "src/routeTree.gen.ts",
        "src/integrations/**",
        "src/routes/__root.tsx",
        "src/router.tsx",
        "src/start.ts",
        "src/styles.css",
        "**/*.d.ts",
        "**/*.config.*",
      ],
    },
  },
});
