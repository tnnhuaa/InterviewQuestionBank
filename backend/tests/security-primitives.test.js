import { afterEach, describe, expect, it, vi } from "vitest";
import {
  decryptPrivateValue,
  encryptPrivateValue,
  fingerprintPrivateValue,
} from "../src/platform/security/encryption.js";
import {
  createOneTimeToken,
  createOpaqueToken,
  hashToken,
  verifyOneTimeToken,
} from "../src/platform/security/tokens.js";

const secret = "unit-test-session-secret-that-is-long-enough";
const tokenId = "00000000-0000-0000-0000-000000000001";

describe("security primitives", () => {
  afterEach(() => vi.useRealTimers());

  it("creates opaque tokens with cryptographic entropy", () => {
    const first = createOpaqueToken();
    const second = createOpaqueToken();

    expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(second).not.toBe(first);
    expect(createOpaqueToken(16)).toHaveLength(22);
  });

  it("hashes tokens deterministically without retaining plaintext", () => {
    expect(hashToken("session-token")).toBe(hashToken("session-token"));
    expect(hashToken("session-token")).not.toContain("session-token");
    expect(hashToken("another-token")).not.toBe(hashToken("session-token"));
  });

  it("creates and verifies a purpose-bound, expiring one-time token", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-21T00:00:00.000Z"));
    const expiresAt = new Date("2026-08-21T01:00:00.000Z");
    const generated = createOneTimeToken({ purpose: "VERIFY_EMAIL", expiresAt, secret, id: tokenId });

    expect(verifyOneTimeToken({ token: generated.token, purpose: "VERIFY_EMAIL", secret })).toEqual({
      id: tokenId,
      expiresAt,
    });
    expect(verifyOneTimeToken({ token: generated.token, purpose: "RESET_PASSWORD", secret })).toBeNull();
    expect(verifyOneTimeToken({ token: generated.token, purpose: "VERIFY_EMAIL", secret: "wrong-secret" })).toBeNull();
  });

  it("rejects malformed, tampered and expired one-time tokens", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-21T00:00:00.000Z"));
    const generated = createOneTimeToken({
      purpose: "VERIFY_EMAIL",
      expiresAt: new Date("2026-08-21T00:00:01.000Z"),
      secret,
      id: tokenId,
    });

    expect(verifyOneTimeToken({ token: "invalid", purpose: "VERIFY_EMAIL", secret })).toBeNull();
    expect(verifyOneTimeToken({ token: `${tokenId}.not-a-number.signature`, purpose: "VERIFY_EMAIL", secret })).toBeNull();
    expect(verifyOneTimeToken({ token: `${generated.token}tampered`, purpose: "VERIFY_EMAIL", secret })).toBeNull();
    expect(verifyOneTimeToken({ token: generated.token, purpose: "VERIFY_EMAIL", secret: "" })).toBeNull();

    vi.setSystemTime(new Date("2026-08-21T00:00:02.000Z"));
    expect(verifyOneTimeToken({ token: generated.token, purpose: "VERIFY_EMAIL", secret })).toBeNull();
  });

  it("requires a secret when creating one-time tokens", () => {
    expect(() => createOneTimeToken({
      purpose: "VERIFY_EMAIL",
      expiresAt: new Date(Date.now() + 60_000),
      secret: "",
      id: tokenId,
    })).toThrow("SESSION_SECRET is required for one-time tokens");
  });

  it("encrypts meeting links with authenticated, randomized ciphertext", () => {
    const value = "https://meet.example.test/private-room";
    const first = encryptPrivateValue(value, secret);
    const second = encryptPrivateValue(value, secret);

    expect(first).not.toBe(second);
    expect(first).not.toContain(value);
    expect(decryptPrivateValue(first, secret)).toBe(value);
    expect(() => decryptPrivateValue(first, "wrong-secret")).toThrow();
    expect(() => decryptPrivateValue(`${first.slice(0, -1)}A`, secret)).toThrow();
  });

  it("requires a secret and fingerprints private values deterministically", () => {
    expect(() => encryptPrivateValue("value", "")).toThrow("SESSION_SECRET is required to protect meeting links");
    expect(fingerprintPrivateValue("value")).toBe(fingerprintPrivateValue("value"));
    expect(fingerprintPrivateValue("value")).not.toBe(fingerprintPrivateValue("other"));
  });
});
