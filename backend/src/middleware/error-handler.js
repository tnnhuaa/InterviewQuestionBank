import { AppError } from "../shared/errors.js";

const databaseUnavailableCodes = new Set([
  "08000", "08001", "08003", "08004", "08006", "08007", "08P01",
  "57P01", "57P02", "57P03", "53300", "53400", "58000", "58030",
  "ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN",
]);
const schemaErrorCodes = new Set(["42P01", "42703"]);
const storageUnavailableCodes = new Set(["EACCES", "ENOSPC", "EROFS"]);

function dependencyError(error) {
  if (schemaErrorCodes.has(error?.code)) {
    return new AppError({
      status: 503,
      code: "SCHEMA_NOT_READY",
      message: "Database chưa có schema hiện tại. Hãy chạy npm run db:migrate rồi khởi động lại dịch vụ.",
      recovery: { kind: "WAIT", retryable: true, retryAfterSeconds: null },
      cause: error,
    });
  }
  if (databaseUnavailableCodes.has(error?.code)) {
    return new AppError({
      status: 503,
      code: "DATABASE_UNAVAILABLE",
      message: "Database đang tạm thời không khả dụng. Hãy chờ ít phút rồi thử lại an toàn.",
      recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: 10 },
      cause: error,
    });
  }
  if (storageUnavailableCodes.has(error?.code) || Number(error?.$metadata?.httpStatusCode) >= 500) {
    return new AppError({
      status: 503,
      code: "STORAGE_UNAVAILABLE",
      message: "Private storage đang tạm thời không khả dụng. Hãy giữ nguyên dữ liệu và thử lại sau.",
      recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: 10 },
      cause: error,
    });
  }
  return null;
}

export function errorHandler(error, request, response, next) {
  void next;

  if (response.headersSent) return;

  let appError;
  const mappedDependencyError = dependencyError(error);
  if (error instanceof AppError) {
    appError = error;
  } else if (mappedDependencyError) {
    appError = mappedDependencyError;
  } else if (Number.isInteger(error?.status) && error.status >= 400 && error.status < 500 && Array.isArray(error.errors)) {
    const fieldErrors = {};
    for (const issue of error.errors) {
      const field = String(issue.path ?? issue.location ?? "form")
        .replace(/^\/?(body|query|path|headers?)\/?/, "")
        .replaceAll("/", ".") || "form";
      fieldErrors[field] = issue.message ?? "Giá trị không hợp lệ";
    }
    appError = new AppError({
      status: error.status,
      code: "API_CONTRACT_VALIDATION_ERROR",
      message: "Yêu cầu không đúng định dạng API. Hãy kiểm tra các trường được chỉ ra rồi thử lại.",
      fieldErrors,
      recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      cause: error,
    });
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
      errorMessage: error.message,
      databaseCode: error.code,
      errorTable: error.table,
      errorConstraint: error.constraint,
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
