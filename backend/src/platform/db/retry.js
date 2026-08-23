import { isTransientDatabaseError } from "./error-classification.js";

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function retryTransientDatabaseOperation(
  operation,
  { maxAttempts = 2, retryDelayMs = 100 } = {},
) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxAttempts || !isTransientDatabaseError(error))
        throw error;
      if (retryDelayMs > 0) await wait(retryDelayMs);
    }
  }

  throw new Error("Database retry loop ended unexpectedly");
}

export function queryWithTransientRetry(pool, text, values, options) {
  return retryTransientDatabaseOperation(
    () => pool.query(text, values),
    options,
  );
}

export function connectWithTransientRetry(pool, options) {
  return retryTransientDatabaseOperation(() => pool.connect(), options);
}
