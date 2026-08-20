import { pool } from "./pool.js";

export const EXPECTED_SCHEMA_MIGRATION = "009_preparation_context_management";

export async function checkConnection() {
  let client;
  try {
    client = await pool.connect();
    await client.query("SELECT 1");
    const migration = await client.query(
      "SELECT version FROM schema_migrations ORDER BY applied_at DESC, version DESC LIMIT 1",
    );
    const migrationVersion = migration.rows[0]?.version ?? null;
    if (migrationVersion !== EXPECTED_SCHEMA_MIGRATION) {
      return {
        ready: false,
        code: "SCHEMA_NOT_READY",
        migrationVersion,
        expectedMigrationVersion: EXPECTED_SCHEMA_MIGRATION,
      };
    }
    return {
      ready: true,
      database: "connected",
      schema: "current",
      migrationVersion,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error(JSON.stringify({ event: "database.readiness_failed", errorClass: error.name }));
    }
    const schemaMissing = ["42P01", "42703"].includes(error?.code);
    return {
      ready: false,
      code: schemaMissing ? "SCHEMA_NOT_READY" : "DATABASE_UNAVAILABLE",
      expectedMigrationVersion: EXPECTED_SCHEMA_MIGRATION,
    };
  } finally {
    client?.release();
  }
}
