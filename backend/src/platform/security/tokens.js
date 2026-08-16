import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

export function createOpaqueToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function createOneTimeToken({ purpose, expiresAt, secret, id = randomUUID() }) {
  if (!secret) throw new Error("SESSION_SECRET is required for one-time tokens");
  const expiresEpoch = Math.floor(new Date(expiresAt).getTime() / 1000);
  const body = `${id}.${expiresEpoch}`;
  const signature = createHmac("sha256", secret).update(`${purpose}.${body}`).digest("base64url");
  return { id, token: `${body}.${signature}` };
}

export function verifyOneTimeToken({ token, purpose, secret }) {
  if (!secret) return null;
  const [id, expiresValue, signature] = String(token).split(".");
  if (!id || !expiresValue || !signature) return null;
  const expiresEpoch = Number(expiresValue);
  if (!Number.isSafeInteger(expiresEpoch) || expiresEpoch * 1000 <= Date.now()) return null;
  const expected = createHmac("sha256", secret)
    .update(`${purpose}.${id}.${expiresEpoch}`)
    .digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }
  return { id, expiresAt: new Date(expiresEpoch * 1000) };
}
