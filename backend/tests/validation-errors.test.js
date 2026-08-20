import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  AppError,
  notFoundError,
  recoveryKinds,
  validationError,
} from "../src/shared/errors.js";
import { parse } from "../src/shared/validation.js";

describe("validation and API errors", () => {
  it("returns parsed and normalized input", () => {
    const schema = z.object({ name: z.string().trim().min(2) });

    expect(parse(schema, { name: "  PrepVI  " })).toEqual({ name: "PrepVI" });
  });

  it("maps nested and form-level schema issues to field errors", () => {
    const schema = z.object({ profile: z.object({ name: z.string().min(2) }) })
      .refine(() => false, "Form is invalid");

    expect(() => parse(schema, { profile: { name: "A" } })).toThrow(expect.objectContaining({
      code: "VALIDATION_ERROR",
      status: 422,
      fieldErrors: {
        "profile.name": expect.any(String),
        form: "Form is invalid",
      },
    }));
  });

  it("constructs safe default, validation and private-resource errors", () => {
    expect(new AppError()).toMatchObject({
      status: 500,
      code: "INTERNAL_ERROR",
      recovery: { kind: "CONTACT_SUPPORT", retryable: false, retryAfterSeconds: null },
    });
    expect(validationError({ email: "Invalid" }, "Check input")).toMatchObject({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Check input",
      fieldErrors: { email: "Invalid" },
    });
    expect(notFoundError()).toMatchObject({ status: 404, code: "RESOURCE_NOT_FOUND" });
  });

  it("keeps the recovery contract immutable and exhaustive", () => {
    expect(Object.isFrozen(recoveryKinds)).toBe(true);
    expect(recoveryKinds).toEqual([
      "RETRY_SAFE", "EDIT_INPUT", "REUPLOAD", "PASTE_TEXT", "SELECT_ANOTHER_SLOT",
      "WAIT", "CONTACT_SUPPORT", "NONE",
    ]);
  });
});
