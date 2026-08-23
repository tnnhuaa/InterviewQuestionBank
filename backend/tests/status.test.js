import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const environment = {
  frontendOrigin: "http://frontend.test",
  nodeEnv: "test",
  port: 3000,
};

describe("status endpoints", () => {
  it("reports API health", async () => {
    const response = await request(createApp({ environment })).get(
      "/api/v1/health",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "interview-question-bank-api",
    });
  });

  it("reports ready when the database check succeeds", async () => {
    const app = createApp({ checkDatabase: async () => true, environment });
    const response = await request(app).get("/api/v1/ready");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ready",
      database: "connected",
      storage: "available",
    });
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
        createApp({ checkDatabase, environment }),
      ).get("/api/v1/ready");

      expect(response.status).toBe(503);
      expect(response.body).toMatchObject({
        code: "DATABASE_UNAVAILABLE",
        recovery: { kind: "WAIT", retryable: true },
      });
    },
  );

  it("returns a JSON 404 response for unknown routes", async () => {
    const response = await request(createApp({ environment })).get(
      "/api/v1/missing",
    );

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      code: "ROUTE_NOT_FOUND",
      recovery: { kind: "NONE", retryable: false },
    });
  });
});
