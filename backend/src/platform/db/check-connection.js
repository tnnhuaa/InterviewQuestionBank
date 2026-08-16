import { pool } from "./pool.js";

export async function checkConnection() {
  try {
    const client = await pool.connect();
    // Execute a simple query to verify the connection is alive
    await client.query("SELECT 1");
    client.release();
    console.log("Database is connection")
    return true;
  } catch (error) {
    console.error("Database connection error in checkConnection:", error);
    return false;
  }
}
