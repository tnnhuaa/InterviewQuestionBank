import { apiFetch, createIdempotencyKey } from "./client";
import type { SessionUser } from "@/app/AppContext";

export interface Page<T> {
  items: T[];
  pageInfo: { page: number; pageSize: number; total: number };
}

export interface PublicAvailabilitySlot {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
}

export type MentorSearchEmptyReason =
  | "NO_MATCHING_MENTOR"
  | "NO_AVAILABLE_SLOT"
  | null;

export interface MentorSearchContext {
  matchingMentorCount: number;
  availabilityFiltered: boolean;
  emptyReason: MentorSearchEmptyReason;
}

export interface MentorSearchResponse extends Page<Mentor> {
  searchContext: MentorSearchContext;
}

export interface PlanMentorCandidateResponse
  extends Page<Mentor & {
    topicOverlap: number;
    positionFit: number;
    matchReasons: string[];
    aiExplanation?: string | null;
  }> {
  planId: string;
  planVersion: number;
  searchContext: MentorSearchContext;
}

export interface MentorSearchFilters {
  topic?: string;
  availableFrom?: string;
  availableTo?: string;
  page?: number;
  pageSize?: number;
}

export interface PlanMentorCandidateFilters {
  availableFrom?: string;
  availableTo?: string;
  page?: number;
  pageSize?: number;
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type PracticeStatus =
  "NOT_STARTED" | "PRACTICING" | "COMPLETED" | "REVISIT";

export interface StudentProfile {
  targetPosition: string | null;
  interviewType: string | null;
  interviewGoal: string | null;
  interviewDate: string | null;
  timezone: string;
  version: number;
}

export interface Question {
  id: string;
  slug: string;
  title: string;
  content: string;
  answerCriteria: string[];
  difficulty: Difficulty;
  lifecycleStatus: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  source: { name?: string; url?: string; note?: string };
  topics: string[];
  positions: string[];
  topicIds?: string[];
  positionIds?: string[];
  bookmarked: boolean;
  practiceStatus: PracticeStatus;
  version: number;
}

export interface JobDescription {
  id: string;
  sourceType: "PASTED_TEXT" | "PDF" | "IMAGE";
  status:
    | "DRAFT"
    | "EXTRACTING"
    | "READY_FOR_REVIEW"
    | "CONFIRMED"
    | "ANALYZED"
    | "FAILED";
  extractedText?: string;
  correctedText?: string;
  correctedVersion: number;
  confirmedAt?: string;
  extractionMethod?: string;
  extractionConfidence?: number;
  processing?: {
    id: string;
    status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";
    attemptCount: number;
    errorCode?: string;
  };
  version: number;
}

export interface Requirement {
  id: string;
  raw_text: string;
  source_start?: number;
  source_end?: number;
  requirement_type: string;
  normalized_topic_id?: string;
  effective_topic_id?: string;
  topic_name?: string;
  confidence?: number;
  source?: "GEMINI";
  decision?: "ACCEPTED" | "EDITED" | "UNMAPPED";
  decision_topic_id?: string;
}
export interface AiJob {
  id: string;
  kind:
    | "JD_ANALYSIS"
    | "RECOMMENDATION_EXPLANATION"
    | "INTERVIEW_AGENDA"
    | "FEEDBACK_DRAFT";
  resourceType: "JOB_DESCRIPTION" | "PREPARATION_PLAN" | "BOOKING";
  resourceId: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SUCCEEDED"
    | "SUCCEEDED_WITH_FALLBACK"
    | "FAILED"
    | "CANCELLED";
  provider: string;
  model: string;
  promptVersion: string;
  schemaVersion: string;
  attemptCount: number;
  maxAttempts: number;
  fallbackUsed: boolean;
  result?: Record<string, unknown>;
  errorCode?: string;
  correlationId?: string;
  operationCaseId?: string;
  createdAt: string;
  updatedAt: string;
}
export interface Match {
  id: string;
  requirementId: string;
  requirement: string;
  topic?: string;
  question: { id: string; title: string; difficulty: Difficulty };
  score: number;
  reason: string;
  rank: number;
}
export interface PreparationPlan {
  id: string;
  jobDescriptionId: string;
  matchingVersion: string;
  status: string;
  version: number;
  items: Array<{
    id: string;
    priority: "MUST" | "SHOULD" | "OPTIONAL";
    requirement?: string;
    topic?: string;
    topicId?: string;
    score?: number;
    reason?: string;
    aiExplanation?: string;
    practiceStatus: PracticeStatus;
    mentorNextAction?: string;
    version: number;
    question: { id?: string; title?: string; difficulty?: Difficulty };
  }>;
}

export interface Mentor {
  id: string;
  userId: string;
  displayName: string;
  headline: string;
  bio: string;
  timezone: string;
  verificationStatus: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  publicRating: number;
  expertise: string[];
  positionExpertise?: string[];
  topicIds?: string[];
  positionIds?: string[];
  nextSlots: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    timezone: string;
  }>;
  version: number;
  latestVerification?: {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    submittedAt: string;
    decidedAt?: string | null;
    decisionReason?: string | null;
    version: number;
  } | null;
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string;
    studentName: string;
    createdAt: string;
  }>;
  topicOverlap?: number;
  positionFit?: number;
  matchReasons?: string[];
  aiExplanation?: string;
}

export interface MentorVerificationSubmission {
  verificationId: string;
  mentorId: string;
  status: "PENDING";
  submittedAt: string;
  version: number;
}

export interface AdminMentorVerificationQueueItem {
  verificationId: string;
  mentorId: string;
  displayName: string;
  headline: string;
  submittedAt: string;
  status: "PENDING";
  version: number;
}

export interface AdminMentorVerificationHistoryItem {
  verificationId: string;
  status: "APPROVED" | "REJECTED";
  submittedAt: string;
  decidedAt: string | null;
  decisionReason: string | null;
  decidedBy: { id: string; displayName: string } | null;
}

export interface AdminMentorVerificationReview {
  verificationId: string;
  mentorId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  version: number;
  submittedAt: string;
  mentor: {
    displayName: string;
    headline: string;
    bio: string;
    timezone: string;
    topics: Array<{ id: string; name: string }>;
    positions: Array<{ id: string; name: string }>;
  };
  evidence: { mimeType: string; sizeBytes: number };
  priorDecisions: AdminMentorVerificationHistoryItem[];
}

export interface MentorVerificationDecisionInput {
  decision: "APPROVED" | "REJECTED";
  reason: string;
  version: number;
}

export interface MentorVerificationDecisionResult {
  verificationId: string;
  mentorId: string;
  status: "APPROVED" | "REJECTED";
  reason: string;
  decidedAt: string;
  decidedBy: string;
  version: number;
}

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "RESCHEDULE_PROPOSED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export interface Booking {
  id: string;
  studentId: string;
  studentName?: string;
  mentorId: string;
  mentorName?: string;
  slotId: string;
  jobDescriptionId?: string;
  preparationPlanId?: string;
  goal: string;
  interviewType: string;
  status: BookingStatus;
  startsAt: string;
  endsAt: string;
  timezone: string;
  rescheduleCount: number;
  correctedText?: string;
  topicNames: string[];
  selectedTopicIds?: string[];
  questionGroups?: Array<{
    id: string;
    title: string;
  }>;
  roleSummary?: string;
  senioritySummary?: string;
  preparationPlanVersion?: number;
  scheduleVersion?: number;
  meetingLink?: string;
  meetingLinkVersion?: number;
  version: number;

  meetingRecovery?: {
    id: string;
    summary: string;
    deadline: string;
    version: number;
  };

  participantCases?: Array<{
    id: string;
    type: "LATE_CHANGE" | "NO_SHOW";
    summary: string;
    version: number;
    requestedBy: string;
  }>;

  transitionHistory?: Array<{
    id: string;
    fromState: string | null;
    toState: string;
    action: string;
    reason: string | null;
    occurredAt: string;
    actorName: string;
  }>;

  operationCase?: {
    id: string;
    status: string;
    version: number;
  };

  pendingProposal?: {
    id: string;
    proposed_slot_id: string;
    proposed_by: string;
    reason: string;
    starts_at: string;
    ends_at: string;
    source_timezone: string;
  };
}

export interface OperationCase {
  id: string;
  type: string;
  targetType: string;
  targetId: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
  summary: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  allowedActions: string[];
  aiJob?: {
    id: string;
    kind: string;
    status: string;
    errorCode?: string;
    attemptCount: number;
    maxAttempts: number;
    model: string;
  };
  notificationJob?: {
    id: string;
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    channel: string;
    status: string;
    attemptCount: number;
    lastErrorClass: string | null;
    occurredAt: string;
    scheduledFor: string;
    sentAt: string | null;
  };
}
export interface OperationReport {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  reasonCode: string;
  description: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  resolvedAt?: string;
  version: number;
}
export interface AuditEntry {
  id: string;
  actorId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  reason?: string;
  metadata: Record<string, unknown>;
  correlationId?: string;
  occurredAt: string;
}
export interface FeedbackAction {
  id: string;
  description: string;
  topicId?: string;
  questionId?: string;
  applied: boolean;
}
export interface BookingFeedback {
  id: string;
  bookingId: string;
  rubricScores: { technical: number; communication: number; structure: number };
  strengths: string;
  weaknesses: string;
  actions: FeedbackAction[];
  createdAt: string;
  version: number;
}
export interface AgendaSection {
  title: string;
  durationMinutes: number;
  objective: string;
  questionIds: string[];
  notes: string;
}
export interface AgendaDraft {
  id: string;
  bookingId: string;
  jobId: string;
  agenda: AgendaSection[];
  status: "DRAFT" | "USED" | "DISCARDED";
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface FeedbackDraft {
  id: string;
  bookingId: string;
  jobId: string;
  rubricScores: { technical: number; communication: number; structure: number };
  strengths: string;
  weaknesses: string;
  nextActions: Array<{
    description: string;
    topicId?: string;
    questionId?: string;
  }>;
  status: "DRAFT" | "USED" | "DISCARDED";
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface StudentDashboard {
  summary: {
    practice: {
      notStarted: number;
      practicing: number;
      completed: number;
      revisit: number;
    };
    bookmarked: number;
    activePlans: number;
    jobDescriptions: number;
    upcomingBookings: number;
  };
  nextActions: Array<{
    id: string;
    planId: string;
    priority: string;
    practiceStatus: PracticeStatus;
    mentorNextAction?: string;
    questionId?: string;
    questionTitle?: string;
    topic?: string;
  }>;
  upcomingBooking: null | {
    id: string;
    status: BookingStatus;
    startsAt: string;
    endsAt: string;
    timezone: string;
    mentorName: string;
  };
  recentFeedback: Array<{
    id: string;
    bookingId: string;
    strengths: string;
    weaknesses: string;
    createdAt: string;
    mentorName: string;
  }>;
}
export interface QuestionImportRow {
  id: string;
  rowNumber: number;
  status: "VALID" | "INVALID" | "IMPORTED" | "SKIPPED";
  payload: Record<string, unknown>;
  errors: Array<{ field: string; code: string; message: string }>;
  questionId?: string;
}
export interface QuestionImport {
  id: string;
  fileName: string;
  status: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  importedRows: number;
  version: number;
  rows: QuestionImportRow[];
  pageInfo: Page<QuestionImportRow>["pageInfo"];
}
export interface TaxonomyAdminItem {
  id: string;
  slug: string;
  name: string;
  status: "ACTIVE" | "ARCHIVED";
  priority: number;
  version: number;
}
export interface TaxonomyAdmin {
  versions: Array<{
    id: string;
    name: string;
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
    description?: string;
    version: number;
  }>;
  topics: TaxonomyAdminItem[];
  positions: TaxonomyAdminItem[];
  aliases: Array<{
    id: string;
    taxonomyVersionId: string;
    topicId: string;
    alias: string;
    normalizedAlias: string;
    topicName: string;
  }>;
}

function toQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query.size ? `?${query}` : "";
}

export const authApi = {
  login: (input: { email: string; password: string }) =>
    apiFetch<{ user: SessionUser; csrfToken: string }>("/auth/login", {
      method: "POST",
      json: input,
    }),
  register: (input: { email: string; password: string; displayName: string }) =>
    apiFetch("/auth/register", { method: "POST", json: input }),
  forgotPassword: (email: string) =>
    apiFetch("/auth/forgot-password", { method: "POST", json: { email } }),
  resetPassword: (token: string, password: string) =>
    apiFetch("/auth/reset-password", {
      method: "POST",
      json: { token, password },
    }),
  verifyEmail: (token: string) =>
    apiFetch("/auth/verify-email", { method: "POST", json: { token } }),
  acceptAdminInvite: (input: {
    token: string;
    password: string;
    displayName: string;
  }) => apiFetch("/auth/accept-admin-invite", { method: "POST", json: input }),
};

export const studentProfileApi = {
  get: () => apiFetch<StudentProfile>("/student-profile"),
  update: (input: StudentProfile) =>
    apiFetch<StudentProfile>("/student-profile", {
      method: "PATCH",
      json: input,
    }),
};

export const dashboardApi = {
  get: () => apiFetch<StudentDashboard>("/student-dashboard"),
};

export const questionsApi = {
  list: (filters: Record<string, string | number | undefined> = {}) =>
    apiFetch<Page<Question>>(`/questions${toQuery(filters)}`),
  get: (questionId: string) => apiFetch<Question>(`/questions/${questionId}`),
  taxonomy: () =>
    apiFetch<{
      topics: Array<{ id: string; slug: string; name: string }>;
      positions: Array<{ id: string; slug: string; name: string }>;
    }>("/taxonomy"),
  progress: (
    questionId: string,
    input: { bookmarked: boolean; status: PracticeStatus },
  ) =>
    apiFetch(`/practice-progress/${questionId}`, {
      method: "PUT",
      json: input,
    }),
};

export const jobDescriptionsApi = {
  list: () => apiFetch<Page<JobDescription>>("/job-descriptions"),
  createFromText: (text: string) =>
    apiFetch<JobDescription>("/job-descriptions", {
      method: "POST",
      json: { text },
    }),
  upload: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiFetch<JobDescription>("/job-descriptions", {
      method: "POST",
      body,
    });
  },
  extractFromFile: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiFetch<JobDescription>("/job-descriptions/extract-from-file", {
      method: "POST",
      body,
    });
  },
  get: (id: string) => apiFetch<JobDescription>(`/job-descriptions/${id}`),
  startExtraction: (id: string) =>
    apiFetch<JobDescription>(`/job-descriptions/${id}/extract`, {
      method: "POST",
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
  retryExtraction: (id: string) =>
    apiFetch<JobDescription>(`/job-descriptions/${id}/extraction-retries`, {
      method: "POST",
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
  saveCorrectedText: (id: string, correctedText: string, version: number) =>
    apiFetch<JobDescription>(`/job-descriptions/${id}/text`, {
      method: "PATCH",
      json: { correctedText, version },
    }),
  confirm: (id: string, version: number) =>
    apiFetch<JobDescription>(`/job-descriptions/${id}/confirm`, {
      method: "POST",
      json: { version },
    }),
  analyze: (id: string, correctedTextVersion: number) =>
    apiFetch<{
      jobDescriptionId: string;
      analysisVersion: number;
      requirements: Requirement[];
    }>(`/job-descriptions/${id}/analyze`, {
      method: "POST",
      json: { correctedTextVersion },
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
  startAiAnalysis: (id: string, correctedTextVersion: number) =>
    apiFetch<AiJob>(`/job-descriptions/${id}/analysis-jobs`, {
      method: "POST",
      json: { correctedTextVersion },
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
  getAnalysis: (id: string, analysisVersion?: number) =>
    apiFetch<{
      jobDescriptionId: string;
      analysisVersion: number;
      requirements: Requirement[];
    }>(`/job-descriptions/${id}/analysis${toQuery({ analysisVersion })}`),
  normalizations: (
    id: string,
    input: {
      analysisVersion: number;
      mappingInputVersion: number;
      items: Array<{
        requirementId: string;
        topicId: string | null;
        reason: string;
      }>;
    },
  ) =>
    apiFetch(`/job-descriptions/${id}/requirement-normalizations`, {
      method: "PUT",
      json: input,
    }),
  decideRequirement: (
    id: string,
    requirementId: string,
    input: {
      analysisVersion: number;
      decision: "ACCEPTED" | "EDITED" | "UNMAPPED";
      topicId?: string | null;
      reason?: string;
    },
  ) =>
    apiFetch<{
      jobDescriptionId: string;
      analysisVersion: number;
      requirements: Requirement[];
    }>(`/job-descriptions/${id}/requirements/${requirementId}`, {
      method: "PATCH",
      json: input,
    }),
  match: (id: string, analysisVersion: number) =>
    apiFetch<{ matches: Match[]; matchingVersion: string }>(
      `/job-descriptions/${id}/matches`,
      {
        method: "POST",
        json: { analysisVersion },
        headers: { "Idempotency-Key": createIdempotencyKey() },
      },
    ),
  getMatches: (id: string, analysisVersion?: number) =>
    apiFetch<{ matches: Match[]; matchingVersion: string }>(
      `/job-descriptions/${id}/matches${toQuery({ analysisVersion })}`,
    ),
};

export const preparationPlansApi = {
  list: () =>
    apiFetch<
      Page<
        Pick<
          PreparationPlan,
          "id" | "jobDescriptionId" | "matchingVersion" | "status" | "version"
        >
      >
    >("/preparation-plans"),
  create: (input: {
    jobDescriptionId: string;
    matchingVersion: string;
    matchIds: string[];
  }) =>
    apiFetch<PreparationPlan>("/preparation-plans", {
      method: "POST",
      json: input,
    }),
  get: (id: string) => apiFetch<PreparationPlan>(`/preparation-plans/${id}`),
  updateItem: (
    planId: string,
    itemId: string,
    input: {
      priority?: string;
      practiceStatus?: PracticeStatus;
      version: number;
    },
  ) =>
    apiFetch(`/preparation-plans/${planId}/items/${itemId}`, {
      method: "PATCH",
      json: input,
    }),
  mentorCandidates: (
    planId: string,
    filters: PlanMentorCandidateFilters = {},
  ) =>
    apiFetch<PlanMentorCandidateResponse>(
      `/preparation-plans/${planId}/mentor-candidates${toQuery(filters as Record<string, string | number | undefined>)}`,
    ),
  startRecommendationExplanations: (planId: string) =>
    apiFetch<AiJob>(
      `/preparation-plans/${planId}/recommendation-explanation-jobs`,
      {
        method: "POST",
        headers: { "Idempotency-Key": createIdempotencyKey() },
      },
    ),
};

export const aiApi = {
  capabilities: () =>
    apiFetch<{
      provider: string;
      model: string;
      enabled: boolean;
      available: boolean;
      features: Record<string, boolean>;
    }>("/ai/capabilities"),
  getJob: (id: string) => apiFetch<AiJob>(`/ai-jobs/${id}`),
  retry: (id: string) =>
    apiFetch<AiJob>(`/ai-jobs/${id}/retry`, {
      method: "POST",
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
};

export const mentorsApi = {
  list: (filters: MentorSearchFilters = {}) =>
    apiFetch<MentorSearchResponse>(`/mentors${toQuery(filters as Record<string, string | number | undefined>)}`),
  get: (id: string) => apiFetch<Mentor>(`/mentors/${id}`),
  ownProfile: () => apiFetch<Mentor>("/mentor-profile"),
  saveProfile: (input: Record<string, unknown>) =>
    apiFetch<Mentor>("/mentor-profile", { method: "PUT", json: input }),
  submitVerification: (input: { evidence: File; profileVersion: number }) => {
    const form = new FormData();
    form.append("evidence", input.evidence);
    form.append("consent", "true");
    form.append("profileVersion", String(input.profileVersion));
    return apiFetch<MentorVerificationSubmission>("/mentor-verifications", {
      method: "POST",
      body: form,
    });
  },
  slots: () => apiFetch<{ items: Mentor["nextSlots"] }>("/availability-slots"),
  createSlot: (input: { startsAt: string; endsAt: string; timezone: string }) =>
    apiFetch("/availability-slots", { method: "POST", json: input }),
  cancelSlot: (id: string, version: number) =>
    apiFetch(`/availability-slots/${id}?version=${version}`, {
      method: "DELETE",
    }),
};

export const bookingsApi = {
  list: (
    filters: Record<string, string | number | undefined> = {},
  ) => apiFetch<Page<Booking>>(`/bookings${toQuery(filters)}`),

  create: (
    input: Record<string, unknown>,
    idempotencyKey: string = createIdempotencyKey(),
  ) =>
    apiFetch<Booking>("/bookings", {
      method: "POST",
      json: input,
      headers: { "Idempotency-Key": idempotencyKey },
    }),  
  
  get: (id: string) => apiFetch<Booking>(`/bookings/${id}`),
  transition: (id: string, input: Record<string, unknown>) =>
    apiFetch<Booking>(`/bookings/${id}/transitions`, {
      method: "POST",
      json: input,
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
  meetingLink: (id: string, input: { url: string; version?: number }) =>
    apiFetch(`/bookings/${id}/meeting-link`, { method: "PUT", json: input }),
  reportLink: (id: string, reason: string) =>
    apiFetch(`/bookings/${id}/meeting-link-failures`, {
      method: "POST",
      json: { reason },
    }),
  startAgendaDraft: (id: string) =>
    apiFetch<AiJob>(`/bookings/${id}/agenda-drafts`, {
      method: "POST",
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
  agendaDraft: (id: string) =>
    apiFetch<AgendaDraft>(`/bookings/${id}/agenda-drafts`),
  updateAgendaDraft: (
    bookingId: string,
    draftId: string,
    input: {
      agenda: AgendaSection[];
      status: AgendaDraft["status"];
      version: number;
    },
  ) =>
    apiFetch<AgendaDraft>(`/bookings/${bookingId}/agenda-drafts/${draftId}`, {
      method: "PATCH",
      json: input,
    }),
  startFeedbackDraft: (id: string, sessionNotes: string) =>
    apiFetch<AiJob>(`/bookings/${id}/feedback-drafts`, {
      method: "POST",
      json: { sessionNotes },
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
  feedbackDraft: (id: string) =>
    apiFetch<FeedbackDraft>(`/bookings/${id}/feedback-drafts`),
  updateFeedbackDraft: (
    bookingId: string,
    draftId: string,
    input: Omit<
      FeedbackDraft,
      "id" | "bookingId" | "jobId" | "createdAt" | "updatedAt"
    >,
  ) =>
    apiFetch<FeedbackDraft>(
      `/bookings/${bookingId}/feedback-drafts/${draftId}`,
      { method: "PATCH", json: input },
    ),
  feedback: (id: string) =>
    apiFetch<BookingFeedback>(`/bookings/${id}/feedback`),
  createFeedback: (id: string, input: Record<string, unknown>) =>
    apiFetch(`/bookings/${id}/feedback`, { method: "POST", json: input }),
  applyFeedback: (id: string, actionIds: string[]) =>
    apiFetch(`/bookings/${id}/feedback/apply`, {
      method: "POST",
      json: { actionIds },
    }),
  disputeCompletion: (
    id: string,
    input: { reason: string; evidenceMetadata?: Record<string, string> },
  ) =>
    apiFetch(`/bookings/${id}/completion-disputes`, {
      method: "POST",
      json: input,
    }),
  resolveCase: (
    bookingId: string,
    caseId: string,
    input: { action: "APPROVE" | "DISMISS"; reason: string; version: number },
  ) =>
    apiFetch(`/bookings/${bookingId}/operation-cases/${caseId}/actions`, {
      method: "POST",
      json: input,
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
  review: (id: string, input: { rating: number; comment?: string }) =>
    apiFetch(`/bookings/${id}/review`, { method: "POST", json: input }),
};

export const adminApi = {
  cases: (filters: Record<string, string | number | undefined> = {}) =>
    apiFetch<Page<OperationCase>>(`/admin/operation-cases${toQuery(filters)}`),
  case: (id: string) => apiFetch<OperationCase>(`/admin/operation-cases/${id}`),
  impact: (id: string) =>
    apiFetch<{
      caseId: string;
      version: number;
      caseType: string;
      effects: string[];
    }>(`/admin/operation-cases/${id}/impact`),
  act: (id: string, input: Record<string, unknown>) =>
    apiFetch(`/admin/operation-cases/${id}/actions`, {
      method: "POST",
      json: input,
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
  audit: (filters: Record<string, string | number | undefined> = {}) =>
    apiFetch<Page<AuditEntry>>(`/admin/audit${toQuery(filters)}`),
  verifications: () =>
    apiFetch<{
      items: AdminMentorVerificationQueueItem[];
      pageInfo: { page: number; pageSize: number; total: number };
    }>("/admin/mentor-verifications"),
  verification: (id: string) =>
    apiFetch<AdminMentorVerificationReview>(
      `/admin/mentor-verifications/${id}`,
    ),
  decideVerification: (id: string, input: MentorVerificationDecisionInput) =>
    apiFetch<MentorVerificationDecisionResult>(
      `/admin/mentor-verifications/${id}/decision`,
      { method: "POST", json: input },
    ),
  questions: (filters: Record<string, string | number | undefined> = {}) =>
    apiFetch<Page<Question>>(`/admin/questions${toQuery(filters)}`),
  createQuestion: (input: Record<string, unknown>) =>
    apiFetch<Question>("/admin/questions", { method: "POST", json: input }),
  updateQuestion: (id: string, input: Record<string, unknown>) =>
    apiFetch<Question>(`/admin/questions/${id}`, {
      method: "PUT",
      json: input,
    }),
  changeQuestionLifecycle: (id: string, input: Record<string, unknown>) =>
    apiFetch<Question>(`/admin/questions/${id}/lifecycle`, {
      method: "PATCH",
      json: input,
    }),
  taxonomy: () => apiFetch<TaxonomyAdmin>("/admin/taxonomy"),
  createTopic: (input: Record<string, unknown>) =>
    apiFetch("/admin/topics", { method: "POST", json: input }),
  updateTopic: (id: string, input: Record<string, unknown>) =>
    apiFetch(`/admin/topics/${id}`, { method: "PATCH", json: input }),
  createPosition: (input: Record<string, unknown>) =>
    apiFetch("/admin/positions", { method: "POST", json: input }),
  updatePosition: (id: string, input: Record<string, unknown>) =>
    apiFetch(`/admin/positions/${id}`, { method: "PATCH", json: input }),
  createTaxonomyVersion: (input: Record<string, unknown>) =>
    apiFetch("/admin/taxonomy/versions", { method: "POST", json: input }),
  updateTaxonomyVersion: (id: string, input: Record<string, unknown>) =>
    apiFetch(`/admin/taxonomy/versions/${id}`, {
      method: "PATCH",
      json: input,
    }),
  createTopicAlias: (input: Record<string, unknown>) =>
    apiFetch("/admin/topic-aliases", { method: "POST", json: input }),
  deleteTopicAlias: (id: string, reason: string) =>
    apiFetch(`/admin/topic-aliases/${id}`, {
      method: "DELETE",
      json: { reason },
    }),
  reports: (filters: Record<string, string | number | undefined> = {}) =>
    apiFetch<Page<OperationReport>>(`/admin/reports${toQuery(filters)}`),
  previewImport: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiFetch<QuestionImport>("/admin/question-imports/preview", {
      method: "POST",
      body,
    });
  },
  getImport: (
    id: string,
    filters: Record<string, string | number | undefined> = {},
  ) =>
    apiFetch<QuestionImport>(
      `/admin/question-imports/${id}${toQuery(filters)}`,
    ),
  commitImport: (id: string, version: number, reason: string) =>
    apiFetch(`/admin/question-imports/${id}/commit`, {
      method: "POST",
      json: { version, reason },
      headers: { "Idempotency-Key": createIdempotencyKey() },
    }),
};

export interface InAppNotification {
  id: string;
  eventType: string;
  title: string;
  body: string;
  resourceType: string | null;
  resourceId: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: InAppNotification[];
  unread: number;
}

export const notificationsApi = {
  list: () => apiFetch<NotificationListResponse>("/notifications"),
  read: (id: string) =>
    apiFetch<{ id: string; readAt: string }>(`/notifications/${id}/read`, { method: "POST" }),
};
