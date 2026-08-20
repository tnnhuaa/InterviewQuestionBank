import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const environment = {
  frontendOrigin: "http://frontend.test",
  nodeEnv: "test",
  port: 3000,
};

const appDependencies = {
  environment,
  storage: {},
  aiProvider: {},
};

describe("status endpoints", () => {
  it("reports API health", async () => {
    const response = await request(createApp(appDependencies)).get(
      "/api/v1/health",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "interview-question-bank-api",
    });
  });

  it("reports ready when the database check succeeds", async () => {
    const app = createApp({ ...appDependencies, checkDatabase: async () => true });
    const response = await request(app).get("/api/v1/ready");

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
        createApp({ ...appDependencies, checkDatabase }),
      ).get("/api/v1/ready");

      expect(response.status).toBe(503);
      expect(response.body).toMatchObject({
        code: "DEPENDENCY_UNAVAILABLE",
        fieldErrors: {},
        recovery: {
          kind: "WAIT",
          retryable: true,
          retryAfterSeconds: 10,
        },
      });
      expect(response.body.correlationId).toMatch(/^[0-9a-f-]{36}$/i);
    },
  );

  it("returns a JSON 404 response for unknown routes", async () => {
    const response = await request(createApp(appDependencies)).get(
      "/api/v1/missing",
    );

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      code: "ROUTE_NOT_FOUND",
      recovery: { kind: "NONE", retryable: false },
    });
  });
});
