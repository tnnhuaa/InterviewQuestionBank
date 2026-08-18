import { pool } from "./pool.js";

export async function checkConnection() {
  let client;
  try {
    client = await pool.connect();
    await client.query("SELECT 1");
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error(JSON.stringify({ event: "database.readiness_failed", errorClass: error.name }));
    }
    return false;
  } finally {
    client?.release();
  }
}
