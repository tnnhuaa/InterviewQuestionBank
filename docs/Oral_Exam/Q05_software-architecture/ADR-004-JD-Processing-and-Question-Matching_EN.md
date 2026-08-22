# ADR-004 — JD Processing and Question Matching Strategy

| Attribute | Value |
|---|---|
| Status | Accepted for current PoC; requires MVP review |
| Decision/update date | 16/08/2026 |
| Owner | Luân — Architecture/Technology Stack |
| Evidence | poc_question |
| Related scope | JD upload, topic extraction, Question Bank matching |

## 1. Context

The PoC quickly validates this value flow: a Student uploads a Job Description (JD), the system extracts technical topics, finds related questions in the Question Bank, and then lets the Student review and adjust the question set.

The PoC uses React for the frontend, Node.js/Express for the backend, and PostgreSQL to store the Question Bank and each analysis session. This decision prioritizes the speed of validating the end-to-end flow; it is not yet a design approved for the MVP/pilot.

## 2. Options considered

| Option | Advantages | Disadvantages | Conclusion |
|---|---|---|---|
| Internal rules/dictionary | Deterministic, explainable, and no JD is sent outside | Requires taxonomy and a data corpus first; takes time to build | Deferred to MVP review |
| **Gemini topic extraction + keyword matching** | Quickly creates an end-to-end flow, handles free-form JDs and images, and does not require a complete taxonomy | Provider dependency, non-deterministic results, and privacy risk | **Selected for the current PoC** |
| Embedding/vector search | Can find semantically similar wording | Adds a model, vector index, and operational complexity | Outside PoC scope |

## 3. Decision

### 3.1 JD processing

1. The frontend accepts one JD file and sends it to POST /api/upload-jd.
2. The backend receives the file in memory for the current request.
3. PDF text is extracted directly with pdf-parse. A PDF with no extractable text returns an error.
4. An image is converted to base64 inlineData and sent with the prompt to Gemini.
5. Other files are read as UTF-8 text by the PoC. The UI displays DOCX as supported, but the PoC has no dedicated DOCX parser.
6. Gemini gemini-2.5-flash extracts job_title and topics containing name, description, and keywords. When no API key is configured, the provider fails, or parsing fails, the backend uses mock data to demonstrate the flow.
7. The PoC stores job_title and raw_jd in sessions; for an image, raw_jd stores only the marker [IMAGE_DATA], not the image data.

The PoC has no internal OCR, background job, long-term file storage, pasted-text input, or Student review/edit/confirmation gate before analysis.

### 3.2 Question matching

For each topic returned by Gemini, the backend:

1. Stores the topic in session_topics.
2. Finds at most three questions in question_bank by matching topic/sub_topic with ILIKE.
3. If there is no result, retries with at most three Gemini-extracted keywords against tags or topic.
4. Copies matching questions into session_questions and retains original_bank_id for traceability.
5. Allows the Student to add a question from the Question Bank or edit/delete a question in the generated session.

The current matcher is a heuristic keyword lookup. The PoC has no taxonomy, alias normalization, PUBLISHED status, scoring, match reason, deterministic tie-break, or matching_version.

### 3.3 User flow

~~~mermaid
flowchart LR
    Student["Student"] --> Upload["Upload JD file"]
    Upload --> API["Express API"]
    API --> Parse["PDF text extraction or image inline data"]
    Parse --> Gemini["Gemini topic extraction"]
    Gemini --> Match["Question Bank keyword matching"]
    Match --> DB[("PostgreSQL sessions")]
    DB --> Review["Review, add, edit, or delete questions"]
    Review --> Student
~~~

## 4. Current data and boundaries

| Component | Data stored by the PoC |
|---|---|
| question_bank | Topic, sub-topic, question, answer hint, difficulty, and tags |
| sessions | Job title and raw JD text or image marker |
| session_topics | Topic, description, and display order |
| session_questions | Matched question copy, source, and Question Bank reference |

poc_question is a standalone PoC. It currently has no authentication, ownership policy, private file storage, preparation plan, mentor-booking context, or /api/v1 API version. These boundaries remain required before the MVP/pilot and are described in Software Architecture.

## 5. Consequences and trade-offs

### Positive

- Quickly validates the JD → topic → question value chain.
- Handles text PDFs and images without building internal OCR in the PoC.
- The Question Bank remains the question source; the PoC does not ask AI to generate questions.
- The review screen lets users add, edit, and remove unsuitable questions.

### Limitations and risks accepted for the PoC

- JD text and images may be sent to Gemini when an API key is configured; this does not meet MVP privacy requirements without consent, legal review, and a clear policy.
- Topic results depend on the provider/model; mock fallback does not represent the real JD.
- Keyword matching may miss synonyms or return irrelevant results; there is no score or reason for evaluation.
- Files are processed in memory without size limits, MIME/magic-byte validation, quota, retention, or audit.
- Sessions and question edit/delete endpoints have no authorization and are suitable only for a trusted demo environment.

## 6. PoC acceptance

| Test | Pass condition |
|---|---|
| Text PDF | A PDF with text produces job_title and topics, or a clear error when parsing fails |
| Image JD | The image is sent to Gemini and returns a valid topic structure when the provider is available |
| Topic extraction | The response contains job_title and topics with name, description, and keywords |
| Question matching | Each topic finds at most three questions by topic/sub-topic or keyword; no new question is generated |
| Manual curation | The user can add from the bank and edit/delete session questions |
| Provider fallback | Without an API key, or when the provider fails, the demo flow still works with mock data |

These results validate only the PoC flow. They do not validate precision, repeatability, privacy, authorization, or MVP reliability.

## 7. Review conditions for MVP/pilot

A review or new ADR is required before this flow enters the MVP/pilot if:

- Real JDs may contain PII or company information and third-party data transfer requires a decision.
- Results must be stable, explainable, versioned, and measurable for relevance.
- Student text review/confirmation, scanned-PDF OCR, job retry, or file lifecycle control is required.
- JD/questions must connect to a preparation plan, mentor booking, and object-level authorization.
- Real DOCX support, upload limits, validation, and safe logging are required.

Alternatives to evaluate at MVP review are text confirmation, private storage, an extraction/OCR adapter, taxonomy/aliases, a versioned rule-based scorer, and authorization. These capabilities must not be treated as implemented in the current PoC.

## 8. Related decisions

- [ADR-001 — Technology Stack](ADR-001-Technology-Stack_EN.md): React, Express, and PostgreSQL for the PoC.
- [ADR-002 — Booking Consistency](ADR-002-Booking-Consistency_EN.md): not integrated into poc_question.
- [ADR-003 — Notification Reliability](ADR-003-Notification-Reliability_EN.md): not integrated into poc_question.
- [Software Architecture](Software_Architecture_EN.md): target MVP/pilot architecture that requires evidence updates after the PoC.
