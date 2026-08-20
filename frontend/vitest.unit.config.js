import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.{test,spec}.{js,ts}"],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage/unit",
      reporter: ["text", "json-summary", "html"],
      include: [
        "src/app/access.ts",
        "src/app/routePaths.ts",
        "src/features/booking/reason-action-policy.ts",
        "src/features/booking/reschedule-policy.ts",
        "src/features/student/booking-request.ts",
        "src/shared/api/client.ts",
        "src/shared/utils/cn.ts",
      ],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
});
