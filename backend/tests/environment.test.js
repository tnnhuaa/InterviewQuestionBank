import { describe, expect, it } from "vitest";
import { getEnvironment } from "../src/config/environment.js";

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
});
