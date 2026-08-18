import { randomUUID } from "node:crypto";

export function correlationMiddleware(request, response, next) {
  const incoming = request.get("X-Correlation-ID");
  request.correlationId = /^[0-9a-f-]{36}$/i.test(incoming ?? "") ? incoming : randomUUID();
  response.set("X-Correlation-ID", request.correlationId);
  next();
}
