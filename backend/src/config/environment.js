import "dotenv/config";

function toPositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

export function getEnvironment(source = process.env) {
  return {
    nodeEnv: source.NODE_ENV ?? "development",
    port: toPositiveInteger(source.PORT, 3000),
    frontendOrigin: source.FRONTEND_ORIGIN ?? "http://localhost:5173",
  };
}
