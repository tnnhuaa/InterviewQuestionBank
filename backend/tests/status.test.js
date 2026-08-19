import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { getEnvironment } from "../src/config/environment.js";

const environment = getEnvironment({
  NODE_ENV: "test",
  FRONTEND_ORIGIN: "http://frontend.test",
  OPENAPI_VALIDATION: "false",
});
const storage = { put: async () => "", get: async () => Buffer.alloc(0), delete: async () => {} };
const aiProvider = {};

function app(options = {}) {
  return createApp({ environment, storage, aiProvider, ...options });
}

describe("status endpoints", () => {
  it("reports API health", async () => {
    const response = await request(app()).get(
      "/api/v1/health",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "interview-question-bank-api",
    });
  });

  it("reports ready when the database check succeeds", async () => {
    const response = await request(app({ checkDatabase: async () => true })).get("/api/v1/ready");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ready", database: "connected" });
  });

  it.each([
    ["returns false", async () => false],
    [
      "throws an error",
      async () => Promise.reject(new Error("database unavailable")),
    ],
  ])(
    "reports not ready when the database check %s",
    async (description, checkDatabase) => {
      void description;
      const response = await request(
        app({ checkDatabase }),
      ).get("/api/v1/ready");

      expect(response.status).toBe(503);
      expect(response.body).toMatchObject({
        code: "DEPENDENCY_UNAVAILABLE",
        recovery: { kind: "WAIT", retryable: true, retryAfterSeconds: 10 },
      });
      expect(response.body.correlationId).toEqual(expect.any(String));
    },
  );

  it("returns a JSON 404 response for unknown routes", async () => {
    const response = await request(app()).get(
      "/api/v1/missing",
    );

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      code: "ROUTE_NOT_FOUND",
      recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
    });
  });
});
