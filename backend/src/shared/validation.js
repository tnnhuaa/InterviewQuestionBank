import { validationError } from "./errors.js";

export function parse(schema, value) {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  const fieldErrors = {};
  for (const issue of result.error.issues) {
    fieldErrors[issue.path.join(".") || "form"] = issue.message;
  }
  throw validationError(fieldErrors);
}
