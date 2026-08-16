const API_BASE_URL = "/api/v1";

export class ApiError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = details.code || "REQUEST_FAILED";
    this.correlationId = details.correlationId || null;
    this.fieldErrors = details.fieldErrors || {};
  }
}

export async function apiFetch(path, { json, ...options } = {}) {
  const hasJsonBody = json !== undefined;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    body: hasJsonBody ? JSON.stringify(json) : options.body,
    headers: {
      Accept: "application/json",
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const payload =
    response.status === 204 || typeof response.json !== "function"
      ? null
      : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message || `API request failed with status ${response.status}`,
      response.status,
      payload || {},
    );
  }

  return payload;
}
