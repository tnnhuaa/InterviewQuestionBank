import createClient from "openapi-fetch";
import type { paths } from "./generated";

const API_BASE_URL = "/api/v1";
const csrfFreeMutations = new Set([
  "/auth/register", "/auth/verify-email", "/auth/login", "/auth/forgot-password",
  "/auth/reset-password", "/auth/accept-admin-invite",
]);
let csrfToken: string | null = null;

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

export const openapi = createClient<paths>({ baseUrl: API_BASE_URL, credentials: "include" });

export function setCsrfToken(value: string | null) {
  csrfToken = value;
}

async function ensureCsrf(path: string, method: string) {
  if (["GET", "HEAD", "OPTIONS"].includes(method) || csrfFreeMutations.has(path) || csrfToken) return;
  const response = await fetch(`${API_BASE_URL}/auth/csrf`, { credentials: "include", headers: { Accept: "application/json" } });
  if (response.ok) csrfToken = (await response.json()).csrfToken;
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

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { json, body, method: methodOption, headers, ...requestInit } = options;
  const method = (methodOption || "GET").toUpperCase();
  await ensureCsrf(path, method);
  const hasJsonBody = json !== undefined;
  const result = await requestFromContract(method.toLowerCase(), path, {
    ...requestInit,
    ...(hasJsonBody || body ? { body: hasJsonBody ? json : body } : {}),
    ...(body ? { bodySerializer: () => body } : {}),
    headers: {
      Accept: "application/json",
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(csrfToken && !["GET", "HEAD", "OPTIONS"].includes(method) ? { "X-CSRF-Token": csrfToken } : {}),
      ...headers,
    },
  });
  if (!result.response.ok) {
    if (result.response.status === 401) csrfToken = null;
    const payload = result.error as Partial<ApiError> | undefined;
    throw new ApiError(
      payload?.message || `API request failed with status ${result.response.status}`,
      result.response.status,
      payload || {},
    );
  }
  return (result.response.status === 204 ? null : result.data) as T;
}

export function createIdempotencyKey() {
  return crypto.randomUUID();
}
