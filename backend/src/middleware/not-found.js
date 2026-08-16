export function notFoundHandler(request, response) {
  response.status(404).json({
    code: "ROUTE_NOT_FOUND",
    message: "Không tìm thấy chức năng được yêu cầu.",
    correlationId: request.correlationId,
    fieldErrors: {},
    recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
  });
}
