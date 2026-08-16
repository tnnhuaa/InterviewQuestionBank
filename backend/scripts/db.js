import "dotenv/config";
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
  return createHash("sha256").update(value).digest("hex");
}

function createClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
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
        throw new Error(`Applied migration ${version} was modified`);
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
  const appEnvironment = process.env.APP_ENV ?? "local";
  if (["production", "pilot"].includes(appEnvironment)) {
    throw new Error(`${dataset} seed is forbidden in ${appEnvironment}`);
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
    await client.query(
      `INSERT INTO users (id, email, password_hash, display_name, status, email_verified_at)
       VALUES ($1, $2, $3, $4, 'ACTIVE', now())
       ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name`,
      [id, email, passwordHash, displayName],
    );
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

async function seed(client, dataset) {
  if (!["reference", "demo", "load"].includes(dataset)) {
    throw new Error("Seed dataset must be reference, demo, or load");
  }
  assertNonProductionSeedAllowed(dataset);
  const files = await listSqlFiles(path.join(databaseRoot, "seeds", dataset));
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
        throw new Error(`Applied ${dataset} seed ${version} was modified`);
      }
      console.log(`skip ${dataset} seed ${version}`);
      continue;
    }
    console.log(`apply ${dataset} seed ${version}`);
    await client.query("BEGIN");
    try {
      if (dataset === "demo") {
        await seedDemoUsers(client);
        await seedDemoEvidence();
      }
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
      (SELECT count(*)::int FROM (
         SELECT taxonomy_version_id, normalized_alias
         FROM topic_aliases GROUP BY taxonomy_version_id, normalized_alias HAVING count(*) > 1
       ) duplicates) AS duplicate_aliases
  `);
  const rows = await client.query(
    "SELECT dataset, version, checksum, applied_at FROM seed_runs ORDER BY applied_at",
  );
  console.table(result.rows);
  console.table(rows.rows);
  if (result.rows[0].invalid_published_questions || result.rows[0].duplicate_aliases
      || result.rows[0].orphan_question_topics || result.rows[0].orphan_question_positions) {
    process.exitCode = 2;
  }
}

function assertResetAllowed() {
  const appEnvironment = process.env.APP_ENV ?? "local";
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const isLocalUrl = /localhost|127\.0\.0\.1|postgres:5432/.test(databaseUrl);
  if (!["local", "test"].includes(appEnvironment) || !isLocalUrl) {
    throw new Error("db:reset is restricted to an explicitly local/test database");
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
  const client = createClient();
  await client.connect();
  try {
    await ensureTrackingTables(client);
    if (command === "migrate") await migrate(client);
    else if (command === "seed") await seed(client, option);
    else if (command === "verify") await verify(client);
    else if (command === "status") await status(client);
    else if (command === "reset") {
      assertResetAllowed();
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
