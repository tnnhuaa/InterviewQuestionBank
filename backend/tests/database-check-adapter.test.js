import { describe, expect, it } from "vitest";
import { loadDatabaseCheck } from "../src/config/database-check.js";

describe("loadDatabaseCheck", () => {
  it("returns a valid check function when the adapter is present", async () => {
    const checkDatabase = await loadDatabaseCheck();

    expect(typeof checkDatabase).toBe("function");
  });
});
