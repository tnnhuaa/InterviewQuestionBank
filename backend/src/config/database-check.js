import { access } from "node:fs/promises";

const disconnectedCheck = async () => false;
const databaseCheckUrl = new URL(
  "../platform/db/check-connection.js",
  import.meta.url,
);

export async function loadDatabaseCheck() {
  try {
    await access(databaseCheckUrl);
  } catch (error) {
    if (error.code === "ENOENT") return disconnectedCheck;
    throw error;
  }

  const databaseModule = await import(databaseCheckUrl.href);
  const checkConnection =
    databaseModule.checkConnection ?? databaseModule.default;

  if (typeof checkConnection !== "function") {
    throw new TypeError("Database check module must export a function");
  }

  return checkConnection;
}
