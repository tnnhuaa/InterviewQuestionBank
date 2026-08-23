import "../src/config/load-dotenv.js";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import argon2 from "argon2";
import pg from "pg";

const { Client } = pg;
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const databaseRoot = path.join(repositoryRoot, "database");

function checksum(value) {
  // Git may check SQL files out as CRLF on Windows. Migration identity must not
  // change solely because of the developer operating system.
  const normalizedValue = value.replace(/\r\n/g, "\n");
  return createHash("sha256").update(normalizedValue).digest("hex");
}

function nodeEnvironment() {
  const value = process.env.NODE_ENV ?? "development";
  if (!["development", "test", "production"].includes(value)) {
    throw new Error("NODE_ENV must be development, test, or production");
  }
  return value;
}

function createClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const databaseUrl = new URL(process.env.DATABASE_URL);
  const host = databaseUrl.hostname.toLowerCase();
  const isLocalHost = ["localhost", "127.0.0.1", "::1", "postgres"].includes(host);
  const sslMode = databaseUrl.searchParams.get("sslmode");
  const sslRequested = process.env.DATABASE_SSL === "true"
    || (sslMode !== null && !["disable", "allow"].includes(sslMode));
  if (isLocalHost && sslRequested) {
    throw new Error(
      `PostgreSQL local (${host}) không hỗ trợ cấu hình SSL hiện tại. `
      + "Hãy đặt DATABASE_SSL=false và xóa sslmode khỏi DATABASE_URL.",
    );
  }
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : false,
  });
}

async function listSqlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

async function ensureTrackingTables(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS seed_runs (
      dataset text NOT NULL,
      version text NOT NULL,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (dataset, version)
    );
  `);
}

function migrationBody(sql) {
  return sql
    .replace(/^\s*BEGIN\s*;\s*/i, "")
    .replace(/\s*COMMIT\s*;\s*$/i, "");
}

async function assertMigrationBaselineAvailable(client) {
  const applied = await client.query("SELECT count(*)::int AS count FROM schema_migrations");
  if (applied.rows[0].count > 0) return;

  const collisions = await client.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = current_schema()
       AND table_name = ANY($1::text[])
     ORDER BY table_name`,
    [["users", "questions", "bookings", "student_profiles", "mentor_profiles"]],
  );
  if (!collisions.rowCount) return;

  const userId = await client.query(
    `SELECT data_type
     FROM information_schema.columns
     WHERE table_schema = current_schema()
       AND table_name = 'users'
       AND column_name = 'id'`,
  );
  const userIdDescription = userId.rowCount
    ? ` Existing users.id type: ${userId.rows[0].data_type}.`
    : "";
  const tableNames = collisions.rows.map((row) => row.table_name).join(", ");
  throw new Error(
    `MIGRATION_BASELINE_CONFLICT: This database has application tables but no recorded R1 migration. `
    + `Conflicting tables: ${tableNames}.${userIdDescription}\n`
    + "Use a new empty local/test database (recommended), or create and review an explicit legacy-data migration. "
    + "Do not insert a schema_migrations record manually and do not reset a shared/pilot database.",
  );
}

async function migrate(client) {
  await assertMigrationBaselineAvailable(client);
  const files = await listSqlFiles(path.join(databaseRoot, "migrations"));
  for (const file of files) {
    const version = path.basename(file, ".sql");
    const sql = await fs.readFile(file, "utf8");
    const digest = checksum(sql);
    const applied = await client.query(
      "SELECT checksum FROM schema_migrations WHERE version = $1",
      [version],
    );
    if (applied.rowCount) {
      if (applied.rows[0].checksum !== digest) {
        throw new Error(
          `Migration ${version} đã được áp dụng nhưng nội dung hiện tại không khớp checksum. `
          + "Không sửa migration history; hãy khôi phục file đã áp dụng hoặc tạo migration forward-only mới.",
        );
      }
      console.log(`skip migration ${version}`);
      continue;
    }
    console.log(`apply migration ${version}`);
    await client.query("BEGIN");
    try {
      await client.query(migrationBody(sql));
      await client.query(
        "INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)",
        [version, digest],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
}

function assertNonProductionSeedAllowed(dataset) {
  if (dataset === "reference") return;
  const environment = nodeEnvironment();
  if (environment !== "development") {
    throw new Error(`${dataset} seed is allowed only when NODE_ENV=development`);
  }
  if (process.env.ALLOW_NON_PRODUCTION_SEED !== "true") {
    throw new Error("Set ALLOW_NON_PRODUCTION_SEED=true for demo/load seed");
  }
}

async function seedDemoUsers(client) {
  const password = process.env.DEMO_SEED_PASSWORD;
  if (!password) throw new Error("DEMO_SEED_PASSWORD is required for demo seed");
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  const users = [
    ["00000000-0000-0000-0000-000000000101", "student.demo@prepvi.local", "Nguyễn An", "STUDENT"],
    ["00000000-0000-0000-0000-000000000201", "mentor.demo@prepvi.local", "Trần Minh Khoa", "MENTOR"],
    ["00000000-0000-0000-0000-000000000202", "mentor.pending@prepvi.local", "Lê Thu Hà", "MENTOR"],
    ["00000000-0000-0000-0000-000000000203", "mentor.rejected@prepvi.local", "Phạm Quốc Nam", "MENTOR"],
    ["00000000-0000-0000-0000-000000000301", "admin.demo@prepvi.local", "Admin PrepVI", "ADMIN"],
  ];
  for (const [id, email, displayName, role] of users) {
    const existing = await client.query(
      "SELECT password_hash FROM users WHERE id = $1 FOR UPDATE",
      [id],
    );
    if (!existing.rowCount) {
      await client.query(
        `INSERT INTO users (id, email, password_hash, display_name, status, email_verified_at)
         VALUES ($1, $2, $3, $4, 'ACTIVE', now())`,
        [id, email, passwordHash, displayName],
      );
    } else {
      let passwordMatches = false;
      try {
        passwordMatches = await argon2.verify(existing.rows[0].password_hash, password);
      } catch {
        passwordMatches = false;
      }
      await client.query(
        `UPDATE users
         SET email = $2,
             display_name = $3,
             status = 'ACTIVE',
             email_verified_at = coalesce(email_verified_at, now()),
             password_hash = CASE WHEN $5 THEN $4 ELSE password_hash END,
             updated_at = CASE WHEN $5 THEN now() ELSE updated_at END
         WHERE id = $1`,
        [id, email, displayName, passwordHash, !passwordMatches],
      );
      if (!passwordMatches) {
        await client.query(
          "UPDATE sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL",
          [id],
        );
      }
    }
    await client.query(
      "INSERT INTO user_roles (user_id, role_code) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [id, role],
    );
  }
  await client.query(
    `INSERT INTO user_roles (user_id, role_code)
     VALUES ('00000000-0000-0000-0000-000000000201', 'STUDENT')
     ON CONFLICT DO NOTHING`,
  );
  await client.query(
    `INSERT INTO student_profiles (user_id, target_position, interview_type, interview_goal)
     VALUES ('00000000-0000-0000-0000-000000000101', 'Frontend Intern', 'Technical', 'Luyện JavaScript, React và giao tiếp')
     ON CONFLICT (user_id) DO NOTHING`,
  );
}

async function seedDemoEvidence() {
  const root = path.resolve(repositoryRoot, process.env.LOCAL_STORAGE_PATH ?? ".local/private-files");
  await fs.mkdir(root, { recursive: true });
  const key = "00000000-0000-0000-0000-000000000499";
  const onePixelPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
  await fs.writeFile(path.join(root, key), onePixelPng, { flag: "w" });
}

async function refreshDemoTemporalFixtures(client) {
  await client.query(`
    UPDATE availability_slots AS slot
    SET starts_at = fixture.starts_at,
        ends_at = fixture.ends_at,
        status = fixture.status,
        updated_at = now(),
        version = slot.version + 1
    FROM (VALUES
      ('00000000-0000-0000-0000-000000000421'::uuid, date_trunc('day', now()) + interval '2 days 09 hours', date_trunc('day', now()) + interval '2 days 10 hours', 'AVAILABLE'::text),
      ('00000000-0000-0000-0000-000000000422'::uuid, date_trunc('day', now()) + interval '3 days 14 hours', date_trunc('day', now()) + interval '3 days 15 hours', 'AVAILABLE'::text),
      ('00000000-0000-0000-0000-000000000423'::uuid, date_trunc('day', now()) + interval '4 days 09 hours', date_trunc('day', now()) + interval '4 days 10 hours', 'BOOKED'::text),
      ('00000000-0000-0000-0000-000000000424'::uuid, date_trunc('day', now()) + interval '5 days 09 hours', date_trunc('day', now()) + interval '5 days 10 hours', 'AVAILABLE'::text),
      ('00000000-0000-0000-0000-000000000425'::uuid, date_trunc('day', now()) - interval '3 days' + interval '09 hours', date_trunc('day', now()) - interval '3 days' + interval '10 hours', 'BOOKED'::text),
      ('00000000-0000-0000-0000-000000000426'::uuid, date_trunc('day', now()) - interval '5 days' + interval '09 hours', date_trunc('day', now()) - interval '5 days' + interval '10 hours', 'BOOKED'::text),
      ('00000000-0000-0000-0000-000000000427'::uuid, date_trunc('day', now()) - interval '7 days' + interval '09 hours', date_trunc('day', now()) - interval '7 days' + interval '10 hours', 'AVAILABLE'::text)
    ) AS fixture(id, starts_at, ends_at, status)
    WHERE slot.id = fixture.id
  `);
  await client.query(`
    UPDATE bookings AS booking
    SET starts_at = slot.starts_at,
        ends_at = slot.ends_at,
        source_timezone = slot.source_timezone,
        updated_at = now(),
        version = booking.version + 1
    FROM availability_slots AS slot
    WHERE booking.slot_id = slot.id
      AND booking.id = ANY(ARRAY[
        '00000000-0000-0000-0000-000000000961'::uuid,
        '00000000-0000-0000-0000-000000000962'::uuid,
        '00000000-0000-0000-0000-000000000963'::uuid,
        '00000000-0000-0000-0000-000000000964'::uuid,
        '00000000-0000-0000-0000-000000000965'::uuid,
        '00000000-0000-0000-0000-000000000966'::uuid,
        '00000000-0000-0000-0000-000000000967'::uuid
      ])
  `);
}

async function seed(client, dataset) {
  if (!["reference", "demo", "load"].includes(dataset)) {
    throw new Error("Seed dataset must be reference, demo, or load");
  }
  assertNonProductionSeedAllowed(dataset);
  const files = await listSqlFiles(path.join(databaseRoot, "seeds", dataset));
  const pendingFiles = [];
  for (const file of files) {
    const version = path.basename(file, ".sql");
    const sql = await fs.readFile(file, "utf8");
    const digest = checksum(sql);
    const applied = await client.query(
      "SELECT checksum FROM seed_runs WHERE dataset = $1 AND version = $2",
      [dataset, version],
    );
    if (applied.rowCount) {
      if (applied.rows[0].checksum !== digest) {
        throw new Error(
          `Seed ${dataset}/${version} đã được áp dụng nhưng nội dung hiện tại không khớp checksum. `
          + "Không sửa seed đã áp dụng; hãy khôi phục file hoặc tạo seed version mới.",
        );
      }
      console.log(`skip ${dataset} seed ${version}`);
      continue;
    }
    pendingFiles.push({ version, sql, digest });
  }

  // Demo credentials are environment-owned fixtures rather than user data.
  // Reconcile only the stable demo IDs on every invocation so a developer who
  // already applied the dataset can still use the password documented for the
  // current checkout. User-created rows are never selected by this operation.
  if (dataset === "demo") {
    await client.query("BEGIN");
    try {
      await seedDemoUsers(client);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
    await seedDemoEvidence();
  }

  for (const { version, sql, digest } of pendingFiles) {
    console.log(`apply ${dataset} seed ${version}`);
    await client.query("BEGIN");
    try {
      await client.query(sql);
      if (dataset === "load") {
        const unusablePassword = await argon2.hash(randomBytes(48).toString("base64url"), { type: argon2.argon2id });
        await client.query("UPDATE users SET password_hash = $1 WHERE email LIKE 'load-%@prepvi.invalid'", [unusablePassword]);
      }
      await client.query(
        "INSERT INTO seed_runs (dataset, version, checksum) VALUES ($1, $2, $3)",
        [dataset, version, digest],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }

  if (dataset === "demo") {
    await client.query("BEGIN");
    try {
      await refreshDemoTemporalFixtures(client);
      await client.query("COMMIT");
      console.log("refresh demo temporal fixtures");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
}

async function verify(client) {
  const result = await client.query(`
    SELECT
      (SELECT count(*)::int FROM positions WHERE status = 'ACTIVE') AS positions,
      (SELECT count(*)::int FROM topics WHERE status = 'ACTIVE') AS topics,
      (SELECT count(*)::int FROM questions WHERE lifecycle_status = 'PUBLISHED') AS published_questions,
      (SELECT count(*)::int FROM questions q
       WHERE q.lifecycle_status = 'PUBLISHED'
       AND (q.source_name = '' OR q.provenance_note = ''
         OR NOT EXISTS (SELECT 1 FROM question_topics qt WHERE qt.question_id = q.id)
         OR NOT EXISTS (SELECT 1 FROM question_positions qp WHERE qp.question_id = q.id))) AS invalid_published_questions,
      (SELECT count(*)::int FROM questions q
       WHERE q.lifecycle_status = 'PUBLISHED' AND q.normalized_content_hash IS NULL) AS missing_published_question_hashes,
      (SELECT count(*)::int FROM (
         SELECT normalized_content_hash FROM questions
         WHERE normalized_content_hash IS NOT NULL
         GROUP BY normalized_content_hash HAVING count(*) > 1
       ) duplicates) AS duplicate_question_content,
      (SELECT count(*)::int FROM question_topics qt
       LEFT JOIN questions q ON q.id = qt.question_id LEFT JOIN topics t ON t.id = qt.topic_id
       WHERE q.id IS NULL OR t.id IS NULL) AS orphan_question_topics,
      (SELECT count(*)::int FROM question_positions qp
       LEFT JOIN questions q ON q.id = qp.question_id LEFT JOIN positions p ON p.id = qp.position_id
       WHERE q.id IS NULL OR p.id IS NULL) AS orphan_question_positions,
      (SELECT count(*)::int FROM questions WHERE slug LIKE 'load-question-%') AS load_questions,
      (SELECT count(*)::int FROM mentor_profiles mp JOIN users u ON u.id = mp.user_id WHERE u.email LIKE 'load-mentor-%@prepvi.invalid') AS load_mentors,
      (SELECT count(*)::int FROM availability_slots s JOIN mentor_profiles mp ON mp.id = s.mentor_id JOIN users u ON u.id = mp.user_id WHERE u.email LIKE 'load-mentor-%@prepvi.invalid') AS load_slots,
      (SELECT count(*)::int FROM bookings b JOIN users u ON u.id = b.student_id WHERE u.email LIKE 'load-student-%@prepvi.invalid') AS load_bookings,
      (SELECT count(*)::int FROM booking_context_snapshots bcs
       CROSS JOIN LATERAL unnest(bcs.topic_ids) AS ids(topic_id)
       LEFT JOIN topics t ON t.id = ids.topic_id WHERE t.id IS NULL) AS invalid_booking_context_topics,
      (SELECT count(*)::int FROM feedback_action_applications faa
       JOIN preparation_plan_items pi ON pi.id = faa.preparation_plan_item_id
       WHERE pi.plan_id <> faa.preparation_plan_id) AS invalid_feedback_applications,
      (SELECT count(*)::int FROM (
         SELECT aggregate_id, schedule_version, recipient_user_id, channel, milestone
         FROM notification_outbox WHERE milestone IN ('24H','1H')
         GROUP BY aggregate_id, schedule_version, recipient_user_id, channel, milestone
         HAVING count(*) > 1
       ) duplicates) AS duplicate_reminders,
      (SELECT count(*)::int FROM question_import_batches b
       WHERE b.total_rows <> (SELECT count(*) FROM question_import_rows r WHERE r.batch_id = b.id)
          OR b.valid_rows <> (SELECT count(*) FROM question_import_rows r WHERE r.batch_id = b.id AND r.status IN ('VALID','IMPORTED','SKIPPED'))
      ) AS invalid_import_summaries,
      (SELECT count(*)::int FROM (
         SELECT taxonomy_version_id, normalized_alias
         FROM topic_aliases GROUP BY taxonomy_version_id, normalized_alias HAVING count(*) > 1
       ) duplicates) AS duplicate_aliases,
      (SELECT count(*)::int FROM (VALUES
         ('jdAnalysis'), ('recommendationExplanation'), ('agendaDraft'), ('feedbackDraft')
       ) expected(feature)
       LEFT JOIN ai_feature_controls c ON c.feature = expected.feature
       WHERE c.feature IS NULL) AS missing_ai_feature_controls,
      (SELECT count(*)::int FROM ai_job_private_inputs WHERE expires_at <= now()) AS expired_ai_private_inputs,
      (SELECT count(*)::int FROM ai_recommendation_explanations e
       WHERE (e.candidate_type = 'QUESTION' AND NOT EXISTS (
                SELECT 1 FROM preparation_plan_items pi
                WHERE pi.plan_id = e.preparation_plan_id AND pi.question_id = e.candidate_id))
          OR (e.candidate_type = 'MENTOR' AND NOT EXISTS (
                SELECT 1 FROM mentor_profiles mp WHERE mp.id = e.candidate_id))) AS invalid_ai_explanations,
      (SELECT count(*)::int FROM interview_agenda_drafts d JOIN ai_jobs j ON j.id = d.job_id
       WHERE j.kind <> 'INTERVIEW_AGENDA' OR j.resource_id <> d.booking_id) +
      (SELECT count(*)::int FROM feedback_drafts d JOIN ai_jobs j ON j.id = d.job_id
       WHERE j.kind <> 'FEEDBACK_DRAFT' OR j.resource_id <> d.booking_id) AS invalid_ai_drafts
  `);
  const rows = await client.query(
    "SELECT dataset, version, checksum, applied_at FROM seed_runs ORDER BY applied_at",
  );
  console.table(result.rows);
  console.table(rows.rows);
  if (result.rows[0].invalid_published_questions || result.rows[0].duplicate_aliases
      || result.rows[0].missing_published_question_hashes || result.rows[0].duplicate_question_content
      || result.rows[0].orphan_question_topics || result.rows[0].orphan_question_positions
      || result.rows[0].invalid_booking_context_topics || result.rows[0].invalid_feedback_applications
      || result.rows[0].duplicate_reminders || result.rows[0].invalid_import_summaries
      || result.rows[0].missing_ai_feature_controls || result.rows[0].expired_ai_private_inputs
      || result.rows[0].invalid_ai_explanations || result.rows[0].invalid_ai_drafts) {
    process.exitCode = 2;
  }
}

function assertResetAllowed() {
  const environment = nodeEnvironment();
  const databaseUrl = process.env.DATABASE_URL ?? "";
  let isLocalUrl = false;
  try {
    const host = new URL(databaseUrl).hostname.toLowerCase();
    isLocalUrl = ["localhost", "127.0.0.1", "::1", "postgres"].includes(host);
  } catch {
    isLocalUrl = false;
  }
  if (environment !== "development" || !isLocalUrl) {
    throw new Error("db:reset requires NODE_ENV=development and an explicitly local database URL");
  }
}

async function status(client) {
  const migrations = await client.query(
    "SELECT version, checksum, applied_at FROM schema_migrations ORDER BY applied_at",
  );
  const seeds = await client.query(
    "SELECT dataset, version, checksum, applied_at FROM seed_runs ORDER BY applied_at",
  );
  const tables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
  );
  console.table(migrations.rows);
  console.table(seeds.rows);
  console.log(`${tables.rowCount} public tables`);
}

async function main() {
  const [command, option] = process.argv.slice(2);
  if (command === "reset") assertResetAllowed();
  const client = createClient();
  await client.connect();
  try {
    await ensureTrackingTables(client);
    if (command === "migrate") await migrate(client);
    else if (command === "seed") await seed(client, option);
    else if (command === "verify") await verify(client);
    else if (command === "status") await status(client);
    else if (command === "reset") {
      await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
      await ensureTrackingTables(client);
      await migrate(client);
    } else {
      throw new Error("Use: migrate | seed <reference|demo|load> | verify | status | reset");
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
