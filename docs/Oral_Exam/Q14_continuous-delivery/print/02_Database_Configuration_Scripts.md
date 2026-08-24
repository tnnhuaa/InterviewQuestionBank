# Q14 — Database Configuration Scripts

## Sources

- Commands: `package.json` and `backend/package.json`
- Migration runner: `backend/scripts/db.js`
- Schema changes: `database/migrations/*.sql`

## Main commands

```text
npm run db:migrate
npm run db:seed:reference
npm run db:seed:verify
npm run db:status
```

## Migration control

The runner reads SQL files in order, calculates a SHA-256 checksum, records each version, and uses a database transaction.

```js
const applied = await client.query(
  "SELECT checksum FROM schema_migrations WHERE version = $1",
  [version],
);

if (applied.rowCount && applied.rows[0].checksum !== digest) {
  throw new Error("An applied migration must not be changed.");
}

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
```

This is a short extract. The complete runner is in `backend/scripts/db.js`.

## Migration groups

The current migrations cover the R1 foundation, main workflows, dashboard and reminders, bulk question import, Gemini support, private AI drafts, AI operations, JD input versions, Mentor verification, and preparation context.

## Safety rules

- Use one migration runner for each environment.
- Record the version, checksum, time, and operator.
- Never run reset, demo seed, or load seed against shared or production data.
- Back up the database before a production schema change.
- Use a reviewed forward fix or restore plan when a migration fails.
