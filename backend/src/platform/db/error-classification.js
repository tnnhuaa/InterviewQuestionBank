const databaseUnavailableCodes = new Set([
  "08000",
  "08001",
  "08003",
  "08004",
  "08006",
  "08007",
  "08P01",
  "57P01",
  "57P02",
  "57P03",
  "53300",
  "53400",
  "58000",
  "58030",
  "ECONNABORTED",
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "EPIPE",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
]);

const connectOnlyDatabaseCodes = new Set(["EACCES"]);
const schemaErrorCodes = new Set(["42P01", "42703"]);

export function errorChain(error) {
  const pending = [error];
  const visited = new Set();
  const errors = [];

  while (pending.length > 0) {
    const current = pending.shift();
    if (
      !current ||
      (typeof current !== "object" && typeof current !== "function") ||
      visited.has(current)
    ) {
      continue;
    }

    visited.add(current);
    errors.push(current);

    if (Array.isArray(current.errors)) pending.push(...current.errors);
    if (current.cause) pending.push(current.cause);
  }

  return errors;
}

export function hasSchemaError(error) {
  return errorChain(error).some((item) => schemaErrorCodes.has(item.code));
}

export function isTransientDatabaseError(error) {
  return errorChain(error).some(
    (item) =>
      databaseUnavailableCodes.has(item.code) ||
      (item.syscall === "connect" && connectOnlyDatabaseCodes.has(item.code)),
  );
}

export function safeErrorDiagnostics(error) {
  const chain = errorChain(error);
  return {
    errorClasses: [...new Set(chain.map((item) => item.name).filter(Boolean))],
    errorCodes: [...new Set(chain.map((item) => item.code).filter(Boolean))],
    errorSyscalls: [
      ...new Set(chain.map((item) => item.syscall).filter(Boolean)),
    ],
  };
}
