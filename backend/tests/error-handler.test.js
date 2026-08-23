import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "../src/middleware/error-handler.js";

function createErrorApp(error) {
  const app = express();
  app.use((currentRequest, response, next) => {
    void response;
    currentRequest.correlationId = "test-correlation-id";
    next(error);
  });
  app.use(errorHandler);
  return app;
}

describe("errorHandler dependency errors", () => {
  it("maps a nested PostgreSQL connection error to a recoverable 503", async () => {
    const connectionError = Object.assign(new Error("connection failed"), {
      code: "ECONNRESET",
      syscall: "connect",
    });
    const aggregateError = new AggregateError(
      [connectionError],
      "database connection failed",
    );

    const response = await request(createErrorApp(aggregateError)).get("/");

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({
      code: "DATABASE_UNAVAILABLE",
      correlationId: "test-correlation-id",
      recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: 10 },
    });
  });

  it("treats connect EACCES inside AggregateError as database rather than storage", async () => {
    const connectionError = Object.assign(new Error("connect not permitted"), {
      code: "EACCES",
      syscall: "connect",
    });

    const response = await request(
      createErrorApp(
        new AggregateError([connectionError], "connection attempts failed"),
      ),
    ).get("/");

    expect(response.status).toBe(503);
    expect(response.body.code).toBe("DATABASE_UNAVAILABLE");
  });

  it("continues to classify a file EACCES error as private storage unavailable", async () => {
    const fileError = Object.assign(new Error("file access denied"), {
      code: "EACCES",
      syscall: "open",
    });

    const response = await request(createErrorApp(fileError)).get("/");

    expect(response.status).toBe(503);
    expect(response.body.code).toBe("STORAGE_UNAVAILABLE");
  });
});
