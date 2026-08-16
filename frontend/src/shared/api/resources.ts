import { apiFetch } from "./client.js";

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface QuestionSummary {
  id: string;
  title: string;
  topics: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  lifecycleStatus: "PUBLISHED";
}

export interface JobDescriptionRecord {
  id: string;
  sourceType: "PASTED_TEXT" | "PDF" | "IMAGE";
  status: "UPLOADED" | "EXTRACTING" | "READY_FOR_REVIEW" | "CONFIRMED" | "FAILED";
  correctedText?: string;
  version: number;
}

export interface PreparationPlanRecord {
  id: string;
  jobDescriptionId: string;
  matchingVersion: string;
  estimatedMinutes: number;
  groups: Array<{
    priority: "MUST" | "SHOULD" | "OPTIONAL";
    questions: QuestionSummary[];
  }>;
}

export interface BookingRecord {
  id: string;
  status: "PENDING" | "CONFIRMED" | "RESCHEDULE_PROPOSED" | "COMPLETED" | "CANCELLED";
  mentorId: string;
  preparationPlanId?: string;
  startsAt: string;
  timezone: string;
}

function toQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export const questionsApi = {
  list: (filters: Record<string, string | number | undefined> = {}) =>
    apiFetch(`/questions${toQuery(filters)}`) as Promise<Page<QuestionSummary>>,
  get: (questionId: string) => apiFetch(`/questions/${questionId}`) as Promise<QuestionSummary>,
};

export const jobDescriptionsApi = {
  createFromText: (text: string) =>
    apiFetch("/job-descriptions", { method: "POST", json: { sourceType: "PASTED_TEXT", text } }) as Promise<JobDescriptionRecord>,
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch("/job-descriptions", { method: "POST", body: form }) as Promise<JobDescriptionRecord>;
  },
  get: (jobDescriptionId: string) =>
    apiFetch(`/job-descriptions/${jobDescriptionId}`) as Promise<JobDescriptionRecord>,
  saveCorrectedText: (jobDescriptionId: string, correctedText: string, version: number) =>
    apiFetch(`/job-descriptions/${jobDescriptionId}/corrected-text`, {
      method: "PUT",
      json: { correctedText, version },
    }) as Promise<JobDescriptionRecord>,
  confirmText: (jobDescriptionId: string, version: number) =>
    apiFetch(`/job-descriptions/${jobDescriptionId}/confirm`, { method: "POST", json: { version } }) as Promise<JobDescriptionRecord>,
  retryExtraction: (jobDescriptionId: string) =>
    apiFetch(`/job-descriptions/${jobDescriptionId}/extraction-retries`, { method: "POST" }) as Promise<JobDescriptionRecord>,
  analyze: (jobDescriptionId: string, version: number) =>
    apiFetch(`/job-descriptions/${jobDescriptionId}/analysis`, { method: "POST", json: { correctedTextVersion: version } }),
};

export const preparationPlansApi = {
  get: (planId: string) => apiFetch(`/preparation-plans/${planId}`) as Promise<PreparationPlanRecord>,
  updateQuestionSelection: (planId: string, questionIds: string[], version: number) =>
    apiFetch(`/preparation-plans/${planId}`, { method: "PUT", json: { questionIds, version } }) as Promise<PreparationPlanRecord>,
};

export const mentorsApi = {
  list: (filters: Record<string, string | number | undefined> = {}) => apiFetch(`/mentors${toQuery(filters)}`),
  get: (mentorId: string) => apiFetch(`/mentors/${mentorId}`),
};

export const bookingsApi = {
  create: (input: Record<string, unknown>, idempotencyKey: string) =>
    apiFetch("/bookings", { method: "POST", json: input, headers: { "Idempotency-Key": idempotencyKey } }) as Promise<BookingRecord>,
  get: (bookingId: string) => apiFetch(`/bookings/${bookingId}`) as Promise<BookingRecord>,
  transition: (bookingId: string, action: string, version: number, idempotencyKey: string) =>
    apiFetch(`/bookings/${bookingId}/transitions`, {
      method: "POST",
      json: { action, version },
      headers: { "Idempotency-Key": idempotencyKey },
    }) as Promise<BookingRecord>,
};

export const feedbackApi = {
  getForBooking: (bookingId: string) => apiFetch(`/bookings/${bookingId}/feedback`),
  create: (bookingId: string, input: Record<string, unknown>) =>
    apiFetch(`/bookings/${bookingId}/feedback`, { method: "POST", json: input }),
};
