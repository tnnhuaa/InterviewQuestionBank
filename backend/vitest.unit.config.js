import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
    exclude: [
      "tests/**/*.integration.test.js",
      "tests/**/*regression.test.js",
    ],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage/unit",
      reporter: ["text", "json-summary", "html"],
      include: [
        "src/config/environment.js",
        "src/modules/bookings/validation.js",
        "src/modules/jd/matcher.js",
        "src/platform/idempotency.js",
        "src/platform/security/encryption.js",
        "src/platform/security/tokens.js",
        "src/shared/errors.js",
        "src/shared/validation.js",
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
