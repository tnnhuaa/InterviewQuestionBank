export function notFoundHandler(request, response) {
  response.status(404).json({
    error: "not_found",
    message: `Route ${request.method} ${request.originalUrl} was not found`,
  });
}
