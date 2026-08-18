export const recoveryKinds = Object.freeze([
  "RETRY_SAFE",
  "EDIT_INPUT",
  "REUPLOAD",
  "PASTE_TEXT",
  "SELECT_ANOTHER_SLOT",
  "WAIT",
  "CONTACT_SUPPORT",
  "NONE",
]);

export class AppError extends Error {
  constructor({
    status = 500,
    code = "INTERNAL_ERROR",
    message = "Đã xảy ra lỗi ngoài dự kiến.",
    fieldErrors = {},
    recovery = { kind: "CONTACT_SUPPORT", retryable: false, retryAfterSeconds: null },
    cause,
  } = {}) {
    super(message, { cause });
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.recovery = recovery;
  }
}

export function validationError(fieldErrors, message = "Vui lòng kiểm tra lại thông tin đã nhập.") {
  return new AppError({
    status: 422,
    code: "VALIDATION_ERROR",
    message,
    fieldErrors,
    recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
  });
}

export function notFoundError() {
  return new AppError({
    status: 404,
    code: "RESOURCE_NOT_FOUND",
    message: "Không tìm thấy dữ liệu hoặc bạn không có quyền truy cập.",
    recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
  });
}
