import { describe, expect, it } from "vitest";
import { loadDatabaseCheck } from "../src/config/database-check.js";

describe("loadDatabaseCheck", () => {
  it("reports disconnected until the database owner adds the adapter", async () => {
    const checkDatabase = await loadDatabaseCheck();

    await expect(checkDatabase()).resolves.toBe(false);
  });
});
