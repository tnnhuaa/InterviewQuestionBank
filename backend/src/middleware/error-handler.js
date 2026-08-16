import { AppError } from "../shared/errors.js";

export function errorHandler(error, request, response, next) {
  void next;

  if (response.headersSent) return;

  let appError;
  if (error instanceof AppError) {
    appError = error;
  } else if (error?.name === "MulterError") {
    appError = new AppError({
      status: error.code === "LIMIT_FILE_SIZE" ? 413 : 422,
      code: error.code === "LIMIT_FILE_SIZE" ? "FILE_TOO_LARGE" : "INVALID_UPLOAD",
      message: error.code === "LIMIT_FILE_SIZE"
        ? "Tệp vượt quá giới hạn 10 MB. Hãy chọn tệp nhỏ hơn."
        : "Không thể nhận tệp đã chọn. Hãy chọn lại một tệp hợp lệ.",
      recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
      cause: error,
    });
  } else {
    appError = new AppError({ cause: error });
  }

  if (process.env.NODE_ENV !== "test" && appError.status >= 500) {
    console.error(JSON.stringify({
      event: "http.error",
      correlationId: request.correlationId,
      code: appError.code,
      errorClass: error.name,
    }));
  }

  response.status(appError.status).json({
    code: appError.code,
    message: appError.message,
    correlationId: request.correlationId,
    fieldErrors: appError.fieldErrors,
    recovery: appError.recovery,
  });
}
