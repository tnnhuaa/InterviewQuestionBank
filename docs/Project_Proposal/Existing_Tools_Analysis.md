# Interview Practice Platform — Existing Tools Analysis

## 1. Executive summary

Candidates can assemble a manual interview-preparation workflow from existing tools, but they must read each job description (JD), infer requirements, transfer context, re-enter data, and assess quality at every handoff. The opportunity is not to replace every tool. It is to connect the JD, explainable question mapping, preparation plan, mentor booking, and structured feedback in one traceable loop.

## 2. Tools currently used separately

| Need                 | Common tools                       | Value                            | Limitation                                                |
| -------------------- | ---------------------------------- | -------------------------------- | --------------------------------------------------------- |
| Find a role          | Recruitment websites, LinkedIn     | Real job descriptions            | Does not turn a JD into a preparation plan                |
| Find questions       | Google, blogs, YouTube, ChatGPT    | Broad and accessible content     | Fragmented, duplicated, and difficult to verify           |
| Practise coding      | LeetCode and exercise repositories | Exercises and automated checking | Focuses on coding and gives little communication feedback |
| Track progress       | Notes, bookmarks, spreadsheets     | Flexible                         | Manually organised and disconnected from bookings         |
| Find support         | Friends, communities, LinkedIn     | May reach relevant expertise     | Network-dependent and inconsistent profiles or quality    |
| Coordinate schedules | Chat, calendars, email             | Familiar                         | Long exchanges, missing context, and conflict risk        |
| Meet online          | Google Meet, Zoom                  | Stable and familiar              | Does not retain the practice goal or rubric               |
| Receive feedback     | Messages and free-form documents   | Easy to start                    | Difficult to compare and turn into follow-up actions      |

## 3. Current combined workflow

```mermaid
flowchart LR
    A["Read a JD and infer requirements"] --> B["Search for questions across sources"]
    B --> C["Compare results and make a plan manually"]
    C --> D["Find help through personal networks"]
    D --> E["Resend the JD and agree on goals and time"]
    E --> F["Meet using an external tool"]
    F --> G["Receive free-form feedback"]
```

Every transition is manual. Role context, weak topics, and practice goals do not travel through the complete workflow.

## 4. Sources of complexity

- Candidates must judge source credibility and remove duplicate content themselves.
- File- or image-based JDs need a separate extraction tool, with no consistent correction gate for OCR errors.
- There is no shared taxonomy across JDs, questions, mentors, and feedback.
- There is no explainable mapping from a requirement to a question or an uncovered gap.
- Mentors often receive incomplete goals, context, and practice scope.
- Availability and booking status remain in private conversations.
- There is no shared control for overlapping slots, no-shows, or invalid reviews.
- Free-form feedback is difficult to convert into the next preparation tasks.

## 5. Comparison with the proposed solution

| Capability                      | Current tool combination                 | Interview Practice Platform MVP                                            |
| ------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| JD intake and extraction        | Manual reading, copying, or separate OCR | Paste/file input, direct extraction, OCR fallback, and correction gate     |
| Requirement-to-question mapping | Candidate inference                      | Versioned rule scores with source, topic, and reason; optional Gemini support behind feature flags and validation |
| Preparation plan                | Separate notes or spreadsheet            | Plan traced to JD, requirement, question, and next action                  |
| Question taxonomy               | Different classification per source      | Shared role, topic, type, and difficulty taxonomy                          |
| Practice tracking               | Manual notes                             | Bookmarks and basic practice status                                        |
| Mentor discovery                | Open search and personal network         | Profile, scope, verification, availability, and reviews                    |
| Booking                         | Messages and private calendars           | Booking lifecycle with slot protection                                     |
| Pre-session context             | Manually resent                          | Goal and topics attached to the booking                                    |
| Feedback                        | Free form                                | Rubric and next action                                                     |
| Online meeting                  | External tool                            | Still external in the MVP                                                  |

## 6. Business-case implication

The MVP has initial value if it reduces friction from JD to preparation plan, even before a mentor booking. The team must measure JD-to-plan task completion, extraction success, blind-set recall and precision@10, plan activation, booking conversion and completion, and feedback quality. Gemini remains an optional support layer; the rule/manual flow must preserve the core value when the provider fails. If plans are useful but candidates do not proceed to mentors, the team should reassess the marketplace value proposition and mentor supply rather than treat the whole product as invalid. The [Project Proposal](Project_Proposal.md) contains the complete business case and investment logic.

## 7. Evidence limitation

This analysis inherits hypotheses from the proposal. The repository contains no customer-interview record, survey dataset, analytics, or willingness-to-pay evidence. Customer discovery with candidates and mentors is still required to validate tool usage frequency, switching cost, and willingness to pay.
