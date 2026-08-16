import { apiFetch, createIdempotencyKey } from "./client";
import type { SessionUser } from "@/app/AppContext";

export interface Page<T> { items: T[]; pageInfo: { page: number; pageSize: number; total: number } }
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type PracticeStatus = "NOT_STARTED" | "PRACTICING" | "COMPLETED" | "REVISIT";

export interface Question {
  id: string; slug: string; title: string; content: string; answerCriteria: string[];
  difficulty: Difficulty; lifecycleStatus: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  source: { name?: string; url?: string; note?: string }; topics: string[]; positions: string[];
  bookmarked: boolean; practiceStatus: PracticeStatus; version: number;
}

export interface JobDescription {
  id: string; sourceType: "PASTED_TEXT" | "PDF" | "IMAGE";
  status: "DRAFT" | "EXTRACTING" | "READY_FOR_REVIEW" | "CONFIRMED" | "ANALYZED" | "FAILED";
  extractedText?: string; correctedText?: string; correctedVersion: number; confirmedAt?: string;
  extractionMethod?: string; extractionConfidence?: number;
  processing?: { id: string; status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED"; attemptCount: number; errorCode?: string };
  version: number;
}

export interface Requirement { id: string; raw_text: string; requirement_type: string; normalized_topic_id?: string; confidence?: number }
export interface Match { id: string; requirementId: string; requirement: string; topic?: string; question: { id: string; title: string; difficulty: Difficulty }; score: number; reason: string; rank: number }
export interface PreparationPlan { id: string; jobDescriptionId: string; matchingVersion: string; status: string; version: number; items: Array<{ id: string; priority: "MUST" | "SHOULD" | "OPTIONAL"; requirement?: string; topic?: string; score?: number; reason?: string; practiceStatus: PracticeStatus; mentorNextAction?: string; question: { id?: string; title?: string; difficulty?: Difficulty } }> }

  export interface Mentor {
    id: string; userId: string; displayName: string; headline: string; bio: string; timezone: string;
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED"; publicRating: number; expertise: string[];
    nextSlots: Array<{ id: string; startsAt: string; endsAt: string; timezone: string }>; version: number;
    reviews?: Array<{ id: string; rating: number; comment?: string; studentName: string; createdAt: string }>;
  }

export type BookingStatus = "PENDING" | "CONFIRMED" | "RESCHEDULE_PROPOSED" | "REJECTED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
export interface Booking {
  id: string; studentId: string; studentName?: string; mentorId: string; mentorName?: string; slotId: string;
  jobDescriptionId?: string; preparationPlanId?: string; goal: string; interviewType: string; status: BookingStatus;
  startsAt: string; endsAt: string; timezone: string; rescheduleCount: number; correctedText?: string;
  topicNames: string[]; meetingLink?: string; meetingLinkVersion?: number; version: number;
  operationCase?: { id: string; status: string; version: number };
  pendingProposal?: { id: string; proposed_slot_id: string; proposed_by: string; reason: string; starts_at: string; ends_at: string; source_timezone: string };
}
export interface OperationCase { id: string; type: string; targetType: string; targetId: string; status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED"; summary: string; assignedTo?: string; createdAt: string; updatedAt: string; version: number; allowedActions: string[] }
export interface AuditEntry { id: string; actorId?: string; action: string; targetType: string; targetId?: string; reason?: string; metadata: Record<string, unknown>; correlationId?: string; occurredAt: string }
export interface MentorVerification { verification_id: string; status: string; created_at: string; version: number; mentor_id: string; headline: string; bio: string; display_name: string; email: string }

function toQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== "") query.set(key, String(value)); });
  return query.size ? `?${query}` : "";
}

export const authApi = {
  login: (input: { email: string; password: string }) => apiFetch<{ user: SessionUser; csrfToken: string }>("/auth/login", { method: "POST", json: input }),
  register: (input: { email: string; password: string; displayName: string }) => apiFetch("/auth/register", { method: "POST", json: input }),
  forgotPassword: (email: string) => apiFetch("/auth/forgot-password", { method: "POST", json: { email } }),
  resetPassword: (token: string, password: string) => apiFetch("/auth/reset-password", { method: "POST", json: { token, password } }),
  verifyEmail: (token: string) => apiFetch("/auth/verify-email", { method: "POST", json: { token } }),
  acceptAdminInvite: (input: { token: string; password: string; displayName: string }) => apiFetch("/auth/accept-admin-invite", { method: "POST", json: input }),
};

export const questionsApi = {
  list: (filters: Record<string, string | number | undefined> = {}) => apiFetch<Page<Question>>(`/questions${toQuery(filters)}`),
  get: (questionId: string) => apiFetch<Question>(`/questions/${questionId}`),
  taxonomy: () => apiFetch<{ topics: Array<{ id: string; slug: string; name: string }>; positions: Array<{ id: string; slug: string; name: string }> }>("/taxonomy"),
  progress: (questionId: string, input: { bookmarked: boolean; status: PracticeStatus }) => apiFetch(`/practice-progress/${questionId}`, { method: "PUT", json: input }),
};

export const jobDescriptionsApi = {
  list: () => apiFetch<Page<JobDescription>>("/job-descriptions"),
  createFromText: (text: string) => apiFetch<JobDescription>("/job-descriptions", { method: "POST", json: { text } }),
  upload: (file: File) => { const body = new FormData(); body.append("file", file); return apiFetch<JobDescription>("/job-descriptions", { method: "POST", body }); },
  get: (id: string) => apiFetch<JobDescription>(`/job-descriptions/${id}`),
  startExtraction: (id: string) => apiFetch<JobDescription>(`/job-descriptions/${id}/extract`, { method: "POST", headers: { "Idempotency-Key": createIdempotencyKey() } }),
  retryExtraction: (id: string) => apiFetch<JobDescription>(`/job-descriptions/${id}/extraction-retries`, { method: "POST", headers: { "Idempotency-Key": createIdempotencyKey() } }),
  saveCorrectedText: (id: string, correctedText: string, version: number) => apiFetch<JobDescription>(`/job-descriptions/${id}/text`, { method: "PATCH", json: { correctedText, version } }),
  confirm: (id: string, version: number) => apiFetch<JobDescription>(`/job-descriptions/${id}/confirm`, { method: "POST", json: { version } }),
  analyze: (id: string, correctedTextVersion: number) => apiFetch<{ jobDescriptionId: string; analysisVersion: number; requirements: Requirement[] }>(`/job-descriptions/${id}/analyze`, { method: "POST", json: { correctedTextVersion }, headers: { "Idempotency-Key": createIdempotencyKey() } }),
  getAnalysis: (id: string, analysisVersion?: number) => apiFetch<{ jobDescriptionId: string; analysisVersion: number; requirements: Array<Requirement & { effective_topic_id?: string; topic_name?: string }> }>(`/job-descriptions/${id}/analysis${toQuery({ analysisVersion })}`),
  normalizations: (id: string, input: { analysisVersion: number; mappingInputVersion: number; items: Array<{ requirementId: string; topicId: string | null; reason: string }> }) => apiFetch(`/job-descriptions/${id}/requirement-normalizations`, { method: "PUT", json: input }),
  match: (id: string, analysisVersion: number) => apiFetch<{ matches: Match[]; matchingVersion: string }>(`/job-descriptions/${id}/matches`, { method: "POST", json: { analysisVersion }, headers: { "Idempotency-Key": createIdempotencyKey() } }),
  getMatches: (id: string, analysisVersion?: number) => apiFetch<{ matches: Match[]; matchingVersion: string }>(`/job-descriptions/${id}/matches${toQuery({ analysisVersion })}`),
};

export const preparationPlansApi = {
  list: () => apiFetch<Page<Pick<PreparationPlan, "id" | "jobDescriptionId" | "matchingVersion" | "status" | "version">>>("/preparation-plans"),
  create: (input: { jobDescriptionId: string; matchingVersion: string; matchIds: string[] }) => apiFetch<PreparationPlan>("/preparation-plans", { method: "POST", json: input }),
  get: (id: string) => apiFetch<PreparationPlan>(`/preparation-plans/${id}`),
};

export const mentorsApi = {
  list: (filters: Record<string, string | number | undefined> = {}) => apiFetch<Page<Mentor>>(`/mentors${toQuery(filters)}`),
  get: (id: string) => apiFetch<Mentor>(`/mentors/${id}`),
  ownProfile: () => apiFetch<Mentor>("/mentor-profile"),
  saveProfile: (input: Record<string, unknown>) => apiFetch<Mentor>("/mentor-profile", { method: "PUT", json: input }),
  submitVerification: (body: FormData) => apiFetch("/mentor-verifications", { method: "POST", body }),
  slots: () => apiFetch<{ items: Mentor["nextSlots"] }>("/availability-slots"),
  createSlot: (input: { startsAt: string; endsAt: string; timezone: string }) => apiFetch("/availability-slots", { method: "POST", json: input }),
  cancelSlot: (id: string, version: number) => apiFetch(`/availability-slots/${id}?version=${version}`, { method: "DELETE" }),
};

export const bookingsApi = {
  list: (filters: Record<string, string | number | undefined> = {}) => apiFetch<Page<Booking>>(`/bookings${toQuery(filters)}`),
  create: (input: Record<string, unknown>) => apiFetch<Booking>("/bookings", { method: "POST", json: input, headers: { "Idempotency-Key": createIdempotencyKey() } }),
  get: (id: string) => apiFetch<Booking>(`/bookings/${id}`),
  transition: (id: string, input: Record<string, unknown>) => apiFetch<Booking>(`/bookings/${id}/transitions`, { method: "POST", json: input, headers: { "Idempotency-Key": createIdempotencyKey() } }),
  meetingLink: (id: string, input: { url: string; version?: number }) => apiFetch(`/bookings/${id}/meeting-link`, { method: "PUT", json: input }),
  reportLink: (id: string, reason: string) => apiFetch(`/bookings/${id}/meeting-link-failures`, { method: "POST", json: { reason } }),
  feedback: (id: string) => apiFetch<Record<string, unknown>>(`/bookings/${id}/feedback`),
  createFeedback: (id: string, input: Record<string, unknown>) => apiFetch(`/bookings/${id}/feedback`, { method: "POST", json: input }),
  applyFeedback: (id: string, actions: string[]) => apiFetch(`/bookings/${id}/feedback/apply`, { method: "POST", json: { actions } }),
  review: (id: string, input: { rating: number; comment?: string }) => apiFetch(`/bookings/${id}/review`, { method: "POST", json: input }),
};

export const adminApi = {
  cases: (filters: Record<string, string | number | undefined> = {}) => apiFetch<Page<OperationCase>>(`/admin/operation-cases${toQuery(filters)}`),
  case: (id: string) => apiFetch<OperationCase>(`/admin/operation-cases/${id}`),
  impact: (id: string) => apiFetch<{ caseId: string; version: number; caseType: string; effects: string[] }>(`/admin/operation-cases/${id}/impact`),
  act: (id: string, input: Record<string, unknown>) => apiFetch(`/admin/operation-cases/${id}/actions`, { method: "POST", json: input, headers: { "Idempotency-Key": createIdempotencyKey() } }),
  audit: (filters: Record<string, string | number | undefined> = {}) => apiFetch<Page<AuditEntry>>(`/admin/audit${toQuery(filters)}`),
  verifications: () => apiFetch<Page<MentorVerification>>("/admin/mentor-verifications"),
  decideVerification: (id: string, input: Record<string, unknown>) => apiFetch(`/admin/mentor-verifications/${id}/decision`, { method: "POST", json: input }),
  questions: () => apiFetch<Page<Question>>("/admin/questions"),
};

export const notificationsApi = {
  list: () => apiFetch<{ items: Array<{ id: string; title: string; body: string; readAt?: string; createdAt: string }>; unread: number }>("/notifications"),
  read: (id: string) => apiFetch(`/notifications/${id}/read`, { method: "POST" }),
};
