import { describe, expect, it } from "vitest";
import { actionRequiresReason } from "../src/features/booking/reason-action-policy";

describe("actionRequiresReason", () => {
  it("only opens the reason field for actions that require an explanation", () => {
    expect(actionRequiresReason("CANCEL")).toBe(true);
    expect(actionRequiresReason("PROPOSE_RESCHEDULE")).toBe(true);
    expect(actionRequiresReason("REJECT")).toBe(true);
    expect(actionRequiresReason("CONFIRM")).toBe(false);
    expect(actionRequiresReason(null)).toBe(false);
  });
});
