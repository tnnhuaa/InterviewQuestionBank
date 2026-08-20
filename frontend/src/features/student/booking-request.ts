export interface BookingRequestAttempt {
  payload: string;
  idempotencyKey: string;
}

/**
 * Keeps the retry key stable while the booking payload is unchanged. A change
 * to any submitted field represents a new user intent and receives a new key.
 */
export function prepareBookingRequest(
  previous: BookingRequestAttempt | null,
  input: Record<string, unknown>,
  createKey: () => string,
): BookingRequestAttempt {
  const payload = JSON.stringify(input);
  if (previous?.payload === payload) return previous;
  return { payload, idempotencyKey: createKey() };
}
