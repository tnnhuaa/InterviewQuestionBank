export function errorHandler(error, request, response, next) {
  void request;
  void next;

  if (response.headersSent) return;

  if (process.env.NODE_ENV !== "test") console.error(error);

  response.status(500).json({
    error: "internal_server_error",
    message: "An unexpected error occurred",
  });
}
