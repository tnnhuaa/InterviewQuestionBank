# Interview Practice Platform — Product Decision Estimation Notes

## 1. Purpose and status

This document records the chosen planning baseline numbers that complete PD-01–PD-08 and make the backlog concrete enough to refine. These are **assumption-based estimates**, not observed research or measurement results. Each number becomes an empirical baseline only after the verification methods in sections 4–6 are run and evidence is recorded.

Responsibilities follow the Project Charter: Hưng (Product Owner / Business Analyst) owns product decisions and scope assumptions; Gia Thành (Project Planning & Estimation Analyst / Full-stack Developer) produces both estimates and baseline analysis; Hùng (UI/UX Designer / Front-end Developer) supplies experience/research evidence; Trí (PoC / Integration & E2E Developer) supplies verification evidence; Luân (Architecture / Technical Lead) reviews architecture/ADR impact; Tuấn Anh (Project Manager / Team Leader / Timekeeper) handles operations, time, Kanban, configuration, and readiness. Each person approves only within their primary role's authority.

The baseline applies to the narrow trial: **Front-end Intern/Junior developers in Vietnam**, focused on JavaScript, TypeScript, and React; JDs may be Vietnamese or English.

## 2. Chosen numbers

| Code | Planning baseline | Why chosen | Tradeoff / confidence |
|---|---|---|---|
| PD-01 | 20 de-identified JDs: 12 for calibration + 8 for blind validation; 12 Students; 4 volunteer `APPROVED` Mentors with ≥3 slots each; 12 valid booking requests, targets ≥10 `CONFIRMED` and ≥8 `COMPLETED` | Enough for end-to-end checks and a small holdout set, fitting the 8-week trial | Not representative of the whole market; low–medium confidence on product need |
| PD-02 | Cancel/reschedule-propose threshold: 12 hours before; max 2 proposals/booking; no-show wait: 15 minutes; Student has 24 hours to dispute `COMPLETED`; a dispute keeps the review unpublished until an audited Administrator decision | Balances flexibility and Mentor coordination cost; avoids publishing reviews when completion is disputed; no payment yet so no financial penalty needed | May be too strict for student schedules; need actual cancel/no-show measurements |
| PD-03 | Original JD: delete ≤24 hours after extraction ends; text/requirements/mapping/plan: 90 days from last activity; bookings/feedback/reviews/transitions: 180 days; active data deletion ≤7 days, backups ≤30 days | Enough for one application cycle and trial evaluation while reducing sensitive data retention | May change after privacy/legal review; medium confidence for an academic trial |
| PD-04 | Mentor creates/updates the external meeting link; regular edits locked before 2 hours; the link is visible only to both sides from `CONFIRMED` until 24 hours after the session; on provider failure the Mentor has 15 minutes for a replacement link, otherwise an explicit reschedule | Avoids video integration and reduces Student/Administrator authority over the link | Depends on Mentor actions and external tools |
| PD-05 | Instant confirmation belongs to Must; 24-hour and 1-hour reminders belong to US-22 Extended; UTC is the storage source, displayed per person's timezone; send once + retry at minute 1 and 5; in-app status/manual resend as fallback | Keeps the 134-SP Must baseline; two reminders are useful without excessive notification | Needs A/B or larger testing to decide moving reminders into Must |
| PD-06 | Paste ≤50,000 characters; one file/JD; PDF/PNG/JPEG ≤10 MB; PDF ≤5 pages; an image file is one image; no encrypted, embedded-attachment, or multi-file inputs | Covers common JDs and bounds CPU/storage/analyzer risk | Not suitable for CV portfolios or multi-file JD sets; text paste is the fallback |
| PD-07 | Vietnamese + English OCR; 2 concurrent tasks/processes; 60-second timeout; max 2 automatic runs; p95 ≤45 seconds; extraction success ≥90%; direct text accuracy ≥95%; OCR character accuracy ≥85%; confidence <0.80 must be marked for review | Feasible for internal OCR in the trial and a measurable threshold | Bad-quality images may not pass; manual correction always required |
| PD-08 | Score 0–100: exact topic/synonym match 40, requirement keyword coverage 30, role fit 15, seniority/difficulty fit 15; threshold ≥60; max 10 questions/JD and 3/requirement; requirement coverage ≥80%, precision@10 ≥80%, repeatability/explainability 100% | Simple, stable, explainable rules within the no-ML scope | May miss novel synonyms/semantics; taxonomy and synonym quality decide results |

## 3. Accepted capacity and cost baseline

| Item | Calculation | Baseline |
|---|---|---:|
| Nominal capacity | 6 members × 16 hours/week × 8 weeks | 768 hours |
| Reserve | 768 × 15% | 115.2 hours |
| Capacity for scope | 768 − 115.2 | about 653 hours |
| R1 Must | Story points of the 27 Mandatory stories | 134 SP |
| Required throughput | 134 SP / 4 reconstructed execution weeks | 33.5 SP/week |
| Direct cash | Domain 300,000 + participant support 600,000 | 900,000 VND |
| Cash reserve | 900,000 × 25% | 225,000 VND |
| Cash ceiling | Direct + reserve | 1,125,000 VND |

Capacity does not by itself prove the backlog is feasible. Story points are relative size, not directly convertible to hours; 33.5 SP/week is only the throughput needed to compare against actual Done data. The 606-hour working estimate and 650-hour guardrail were built from the old 20 Must stories; they must be updated for the 27 stories/134 SP before a release commitment.

## 4. Product-number calibration and trial methods

### 4.1 Discovery and usability-testing sample

1. Use purposive sampling to recruit exactly Front-end Intern/Junior developers holding a real JD; record screening questions, exclusion criteria, and consent.
2. Run 12 task-based usability sessions in two rounds of 6 people; fix the prototype between rounds and exclude development team members from the sample.
3. Record task completion rate, time, errors/recovery, mapping-explanation questions, and self-practice/Mentor selection decisions.
4. Report numerator/denominator and a Wilson confidence interval; the 12-person sample is only for finding errors and trends, not for claiming market rates.
5. After the trial, compute the funnel *submitted JD → confirmed text → created plan → requested booking → confirmed → completed → feedback*, then replace estimated targets with observed baselines.
6. If a market rate estimate is needed, compute the survey sample size with the Cochran formula `n0 = z² × p × (1−p) / e²`. At 95% confidence (`z=1.96`), unknown rate (`p=0.5`), ±10% error (`e=0.10`), about 97 valid responses are needed; apply finite-population correction if the total population is known.

### 4.2 Booking-policy verification

1. Attach measurement events to every cancel/reschedule/no-show, including actor, timing relative to the session, reason, and outcome; do not store JD content.
2. After at least 12 appointments, plot the hours-of-notice distribution and interview Students/Mentors about the 12-hour mark.
3. Keep the mark if ≥80% of valid cases self-serve and create no serious disputes; otherwise compare 6/12/24-hour options in a review with Operations.
4. Check every `COMPLETED` dispute and `NO_SHOW` case; if Administrator workload exceeds 20% of appointments, simplify evidence or add the other side's confirmation.

### 4.3 Reminder verification

1. Log reminder version, scheduled/sent/received/failed times, timezone, and booking outcome.
2. In the small trial, alternate the two options "24h + 1h" and "1h only" to find signal, but do not claim statistical significance.
3. With a large enough sample, run an A/B test on the primary metric `COMPLETED / CONFIRMED`; guardrails are unsubscribe/disputes and send errors.
4. Before the A/B test, run a power analysis using the observed completion rate, the minimum detectable change chosen by the PO, α=0.05, and 0.80 power to compute appointments per variant.
5. Change reminder cadence only after an effect size, confidence interval, sample-size calculation, and PO/Operations review exist.

### 4.4 Privacy, meeting, and data-retention review

1. Build a data inventory per field/object: purpose, owner, viewing actors, storage location, log exposure level, retention period, and deletion propagation path.
2. Run a privacy/threat-model workshop with PO, Architecture, Security, and Sponsor; check data minimization, object permission, analyzer isolation, and backup expiry.
3. Run a deletion drill on one Student dataset: submit a deletion request, verify active database/object store within 7 days, and backup rotation within 30 days.
4. Run a tabletop drill for meeting-provider outage at the 2-hours-before, on-time, and 15-minutes-past marks; confirm replacement link/reschedule, notifications, and audit do not create implicit states.
5. Change the 24-hour/90-day/180-day marks only when a data-purpose review proves longer retention is needed or a privacy/legal review requires shorter.

## 5. Dataset creation and extraction/mapping measurement

### 5.1 Labeled JD set

1. Collect 20 legal JDs, stripping names, email, phone, and unnecessary company information; balance pasted text, text PDFs, PNG/JPEG, and scanned PDFs in Vietnamese/English.
2. Split 12 calibration and 8 blind JDs fixed before tuning rules; never tune weights/synonyms on the blind set.
3. Two independent reviewers label role, seniority, requirements, normalized topics, and related questions; record instructions and disagreement points.
4. Compute Cohen's kappa for classification labels, target ≥0.70; disputes are arbitrated by the PO/content reviewer and a new baseline label version is created.

### 5.2 Extraction measurement

1. Create reference text via two manual transcription passes.
2. Compute `CER = (substitutions + deletions + insertions) / reference characters`; character accuracy is `1 − CER`.
3. Report direct-extraction PDFs and OCR separately by source/language; do not average to hide weak groups.
4. Run each sample at least three times; measure success rate, p50/p95 duration, retries, and memory/CPU; test corrupt, encrypted, spoofed-MIME, and >10 MB files.
5. Pass when supported inputs succeed ≥90%, direct accuracy ≥95%, OCR ≥85%, p95 ≤45 seconds, and every error has a manual paste/edit fallback.

### 5.3 Mapping measurement

1. Two reviewers score each question relevant/irrelevant per JD requirement; labelers must not see system scores.
2. Compute `precision@10 = relevant questions in the top 10 / questions returned in the top 10`.
3. Compute `requirement coverage = expected requirements detected / total expected requirements`.
4. Re-run the same corrected text + taxonomy/synonym/rule version and compare ordered result hashes; repeatability must be 100%.
5. Accept the baseline only when the blind set achieves requirement coverage ≥80%, precision@10 ≥80%, 100% of results have source/topic/reason/version, and no `DRAFT` questions appear.

## 6. Estimation, capacity, and cost calibration method

1. The development team runs Planning Poker per story after the Definition of Ready; use Fibonacci 1/2/3/5/8 and split 8-SP stories if uncertainty remains.
2. After 2–3 weeks of data, compute a throughput range from completed and accepted SP, excluding in-progress work; use low/high throughput to draw the will-have/might-have line.
3. Track actual effort per workstream to sanity-check the ~653-hour capacity, but do not convert hours into story points with a fixed formula; update both independent estimates when scope changes from 20 to 27 Mandatory stories.
4. The cost owner collects price pages/dated formal quotes for domain, hosting/storage, email, and OCR tools if replacing the internal baseline.
5. Forecast weekly or when the flow changes significantly; a change request is mandatory if the forecast exceeds 8 weeks, ~653 hours, or 1,125,000 VND.

## 7. Mandatory evidence before replacing estimates

- Recruitment screening questions, consent, and a de-identified sample list.
- Labeled JD set inventory, labeling instructions, inter-reviewer agreement, and baseline label version.
- Extraction measurement report, sample hashes, environment/configuration, and original aggregate measures.
- Mapping evaluation report with confusion examples, coverage, precision@10, and repeatability hashes.
- Usability scripts, task results, observation notes, and issue severity.
- Booking/reminder event definitions, tracking/export tables, and decision records.
- Planning Poker records, weekly throughput range, actual effort/cost, and reforecasts.
- Corresponding approval records from PO, Architecture, Privacy/Operations, and Sponsor.

## 8. Applied principles

- Business rules need a code, source, and changeability.
- The backlog must be complete and the Product Owner prioritizes value first.
- Story points are relative size and use Fibonacci/Planning Poker.
- Fixed-date plans need a velocity range and a will-have/might-have line.
- Quality needs measures, evaluation methods, and comparison standards.
