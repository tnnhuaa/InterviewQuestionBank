import createClient from "openapi-fetch";
import type { paths } from "./generated";

const API_BASE_URL = typeof window === "undefined"
  ? "http://localhost/api/v1"
  : "/api/v1";
let csrfToken: string | null = null;
let csrfRequest: Promise<string | null> | null = null;

export interface Recovery {
  kind: "RETRY_SAFE" | "EDIT_INPUT" | "REUPLOAD" | "PASTE_TEXT" | "SELECT_ANOTHER_SLOT" | "WAIT" | "CONTACT_SUPPORT" | "NONE";
  retryable: boolean;
  retryAfterSeconds: number | null;
}

export class ApiError extends Error {
  status: number;
  code: string;
  correlationId: string | null;
  fieldErrors: Record<string, string>;
  recovery: Recovery;

  constructor(message: string, status: number, details: Partial<ApiError> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = details.code || "REQUEST_FAILED";
    this.correlationId = details.correlationId || null;
    this.fieldErrors = details.fieldErrors || {};
    this.recovery = details.recovery || { kind: "NONE", retryable: false, retryAfterSeconds: null };
  }
}

export const openapi = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: "include",
  fetch: (...args) => fetch(...args),
});

export function setCsrfToken(value: string | null) {
  csrfToken = value;
}

async function refreshCsrf() {
  if (csrfRequest) return csrfRequest;
  csrfRequest = (async () => {
    const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (response.status === 401) return null;
    const payload = await response.json().catch(() => null) as Partial<ApiError> & { csrfToken?: string } | null;
    if (!response.ok) {
      throw new ApiError(
        payload?.message || `API request failed with status ${response.status}`,
        response.status,
        payload || {},
      );
    }
    csrfToken = payload?.csrfToken ?? null;
    return csrfToken;
  })();
  try {
    return await csrfRequest;
  } finally {
    csrfRequest = null;
  }
}

async function ensureCsrf(method: string) {
  if (["GET", "HEAD", "OPTIONS"].includes(method) || csrfToken) return;
  const refreshedToken = await refreshCsrf();
  if (!refreshedToken) {
    throw new ApiError("Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.", 401, {
      code: "SESSION_REQUIRED",
      recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
    });
  }
}

interface FetchOptions extends RequestInit { json?: unknown }

type OpenApiFetchResult = {
  data?: unknown;
  error?: unknown;
  response: Response;
};

const requestFromContract = openapi.request as unknown as (
  method: string,
  path: string,
  options: Record<string, unknown>,
) => Promise<OpenApiFetchResult>;

async function request<T>(path: string, options: FetchOptions, retriedCsrf: boolean): Promise<T> {
  const { json, body, method: methodOption, headers, ...requestInit } = options;
  const method = (methodOption || "GET").toUpperCase();
  await ensureCsrf(method);
  const requestCsrfToken = csrfToken;
  const hasJsonBody = json !== undefined;
  const result = await requestFromContract(method.toLowerCase(), path, {
    ...requestInit,
    ...(hasJsonBody || body ? { body: hasJsonBody ? json : body } : {}),
    ...(body ? { bodySerializer: () => body } : {}),
    headers: {
      Accept: "application/json",
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(requestCsrfToken && !["GET", "HEAD", "OPTIONS"].includes(method) ? { "X-CSRF-Token": requestCsrfToken } : {}),
      ...headers,
    },
  });
  if (!result.response.ok) {
    const payload = result.error as Partial<ApiError> | undefined;
    if (result.response.status === 403 && payload?.code === "CSRF_INVALID" && !retriedCsrf) {
      if (csrfToken === requestCsrfToken) {
        csrfToken = null;
        await refreshCsrf();
      }
      return request<T>(path, options, true);
    }
    if (result.response.status === 401) csrfToken = null;
    throw new ApiError(
      payload?.message || `API request failed with status ${result.response.status}`,
      result.response.status,
      payload || {},
    );
  }
  return (result.response.status === 204 ? null : result.data) as T;
}

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  return request<T>(path, options, false);
}

export function createIdempotencyKey() {
  return crypto.randomUUID();
}
