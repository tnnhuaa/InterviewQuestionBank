import pg from "pg";
import { getEnvironment } from "../../config/environment.js";
import { safeErrorDiagnostics } from "./error-classification.js";

const environment = getEnvironment();

export const pool = new pg.Pool({
  connectionString: environment.databaseUrl,
  ssl: environment.databaseSsl ? { rejectUnauthorized: true } : false,
  max: environment.dbPoolMax,
});

// pg emits failures from idle clients through the Pool "error" event. Without
// a listener Node terminates the API/worker process, so a short database restart
// can leave background jobs stopped indefinitely. The pool already discards the
// failed client; keep the process alive and log only redacted diagnostics so the
// next query/tick can reconnect normally.
pool.on("error", (error) => {
  if (process.env.NODE_ENV === "test") return;
  console.error(JSON.stringify({
    event: "database.pool_error",
    ...safeErrorDiagnostics(error),
  }));
});
