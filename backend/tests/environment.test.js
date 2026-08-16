import { describe, expect, it } from "vitest";
import { getEnvironment } from "../src/config/environment.js";

describe("getEnvironment", () => {
  it("normalizes environment values", () => {
    expect(
      getEnvironment({
        NODE_ENV: "production",
        PORT: "8080",
        FRONTEND_ORIGIN: "https://example.test",
      }),
    ).toEqual({
      nodeEnv: "production",
      port: 8080,
      frontendOrigin: "https://example.test",
    });
  });

  it("uses safe defaults for invalid input", () => {
    expect(getEnvironment({ PORT: "invalid" })).toEqual({
      nodeEnv: "development",
      port: 3000,
      frontendOrigin: "http://localhost:5173",
    });
  });
});
