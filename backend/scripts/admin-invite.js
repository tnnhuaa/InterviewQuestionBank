import argon2 from "argon2";
import { randomBytes } from "node:crypto";
import { getEnvironment } from "../src/config/environment.js";
import { pool } from "../src/platform/db/pool.js";
import { withTransaction } from "../src/platform/db/transaction.js";
import { createOneTimeToken, hashToken } from "../src/platform/security/tokens.js";
import { enqueueNotification } from "../src/platform/outbox.js";
import { writeAudit } from "../src/platform/audit.js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: npm run admin:invite -- admin@example.com");
  process.exitCode = 1;
} else {
  const environment = getEnvironment();
  if (!environment.sessionSecret) throw new Error("SESSION_SECRET is required");
  const unusablePassword = await argon2.hash(randomBytes(48).toString("base64url"), { type: argon2.argon2id });
  await withTransaction(pool, async (client) => {
    const existingAdmin = await client.query(
      `SELECT 1 FROM users u JOIN user_roles ur ON ur.user_id = u.id
       WHERE ur.role_code = 'ADMIN' LIMIT 1`,
    );
    if (existingAdmin.rowCount) throw new Error("Admin bootstrap is already complete; use the audited Admin UI for later role grants");
    const inserted = await client.query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, 'PrepVI Admin') RETURNING id`,
      [email, unusablePassword],
    );
    const userId = inserted.rows[0].id;
    await client.query("INSERT INTO user_roles (user_id, role_code) VALUES ($1, 'ADMIN')", [userId]);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const generated = createOneTimeToken({ purpose: "ADMIN_INVITE", expiresAt, secret: environment.sessionSecret });
    await client.query(
      `INSERT INTO one_time_tokens (id, user_id, purpose, token_hash, expires_at)
       VALUES ($1, $2, 'ADMIN_INVITE', $3, $4)`,
      [generated.id, userId, hashToken(generated.token), expiresAt],
    );
    await enqueueNotification(client, {
      eventType: "identity.admin_invite_requested",
      aggregateType: "USER",
      aggregateId: userId,
      recipientUserId: userId,
      payload: { tokenId: generated.id, purpose: "ADMIN_INVITE" },
      deduplicationKey: `identity.admin_invite_requested:${generated.id}:email`,
    });
    await writeAudit(client, { action: "ADMIN_BOOTSTRAP_INVITED", targetType: "USER", targetId: userId, reason: "Initial administrator bootstrap" });
  });
  console.log(`Admin invitation queued for ${email}. Run the worker to deliver it.`);
}

await pool.end();
