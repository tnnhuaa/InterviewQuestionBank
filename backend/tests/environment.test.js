import { describe, expect, it } from "vitest";
import { getEnvironment, validateEnvironment } from "../src/config/environment.js";

describe("getEnvironment", () => {
  it("normalizes environment values", () => {
    expect(
      getEnvironment({
        NODE_ENV: "production",
        PORT: "8080",
        FRONTEND_ORIGIN: "https://example.test",
        DATABASE_URL: "postgres://user:pass@host:5432/db",
        DATABASE_SSL: "true",
        DB_POOL_MAX: "10",
      }),
    ).toMatchObject({
      nodeEnv: "production",
      port: 8080,
      frontendOrigin: "https://example.test",
      databaseUrl: "postgres://user:pass@host:5432/db",
      databaseSsl: true,
      dbPoolMax: 10,
      notifications: { remindersEnabled: false },
    });
  });

  it("uses safe defaults for invalid input", () => {
    expect(getEnvironment({ PORT: "invalid" })).toMatchObject({
      nodeEnv: "development",
      port: 3000,
      frontendOrigin: "http://localhost:5173",
      databaseUrl: undefined,
      databaseSsl: false,
      dbPoolMax: 5,
      notifications: { remindersEnabled: false },
    });
  });

  it("enables Gemini features by default only in development with an API key", () => {
    const enabled = getEnvironment({ NODE_ENV: "development", GEMINI_API_KEY: "  test-key  " });
    const production = getEnvironment({ NODE_ENV: "production", GEMINI_API_KEY: "test-key" });

    expect(enabled.ai).toMatchObject({ enabled: true, apiKey: "test-key" });
    expect(Object.values(enabled.ai.features).every(Boolean)).toBe(true);
    expect(production.ai.enabled).toBe(false);
  });

  it("accepts a complete production configuration", () => {
    const environment = getEnvironment({
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://example.test/prepvi",
      DATABASE_SSL: "true",
      FRONTEND_ORIGIN: "https://prepvi.example.test",
      SESSION_SECRET: "a".repeat(32),
      AI_ENABLED: "true",
      AI_PROVIDER: "gemini",
      GEMINI_API_KEY: "test-key",
      GEMINI_TEMPERATURE: "0.2",
    });

    expect(() => validateEnvironment(environment)).not.toThrow();
  });

  it.each([
    [{ NODE_ENV: "preview" }, "NODE_ENV must be development, test, or production"],
    [{ NODE_ENV: "test", GEMINI_TEMPERATURE: "1.1" }, "GEMINI_TEMPERATURE must be between 0 and 1"],
  ])("rejects invalid environment constraints", (source, message) => {
    expect(() => validateEnvironment(getEnvironment(source))).toThrow(message);
  });

  it("reports every missing dependency required by an enabled AI deployment", () => {
    const environment = getEnvironment({
      NODE_ENV: "production",
      AI_ENABLED: "true",
      AI_PROVIDER: "other",
    });

    expect(() => validateEnvironment(environment)).toThrow(/DATABASE_URL.*SESSION_SECRET.*AI_PROVIDER=gemini.*GEMINI_API_KEY/);
  });
});
