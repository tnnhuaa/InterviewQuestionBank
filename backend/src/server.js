import { createApp } from "./app.js";
import { loadDatabaseCheck } from "./config/database-check.js";
import { getEnvironment } from "./config/environment.js";

const environment = getEnvironment();
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
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
