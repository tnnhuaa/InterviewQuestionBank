import { createApp } from "./app.js";
import { loadDatabaseCheck } from "./config/database-check.js";
import { getEnvironment, validateEnvironment } from "./config/environment.js";
import { safeErrorDiagnostics } from "./platform/db/error-classification.js";

const environment = getEnvironment();
validateEnvironment(environment);
const checkDatabase = await loadDatabaseCheck();
const app = createApp({ checkDatabase, environment });

const server = app.listen(environment.port, () => {
  console.log(
    `Interview Question Bank API listening on port ${environment.port}`,
  );
});

function shutdown(signal) {
  console.log(`${signal} received; closing HTTP server`);
  server.close((error) => {
    if (error) {
      console.error(JSON.stringify({
        event: "server.shutdown_failed",
        ...safeErrorDiagnostics(error),
      }));
      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
