import { apiFetch } from "./client.js";

export function getHealth(options) {
  return apiFetch("/health", options);
}
