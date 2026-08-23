import { connectWithTransientRetry } from "./retry.js";

export async function withTransaction(pool, operation) {
  const client = await connectWithTransientRetry(pool);
  let transactionStarted = false;
  try {
    await client.query("BEGIN");
    transactionStarted = true;
    const result = await operation(client);
    await client.query("COMMIT");
    transactionStarted = false;
    return result;
  } catch (error) {
    if (transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original database error; rollback failure is secondary.
      }
    }
    throw error;
  } finally {
    client.release();
  }
}
