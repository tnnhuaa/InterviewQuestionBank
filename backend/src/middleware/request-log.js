export function requestLogMiddleware(request, response, next) {
  const startedAt = performance.now();
  response.on("finish", () => {
    if (process.env.NODE_ENV === "test") return;
    console.log(JSON.stringify({
      event: "http.request",
      correlationId: request.correlationId,
      actorId: request.auth?.user?.id ?? null,
      method: request.method,
      route: request.route?.path ?? request.path,
      status: response.statusCode,
      durationMs: Math.round(performance.now() - startedAt),
    }));
  });
  next();
}
