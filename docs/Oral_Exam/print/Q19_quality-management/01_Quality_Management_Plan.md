# Software Quality Management Plan (SQMP)

**Project:** Interview Practice Platform
**Version:** 1.0

## 1. Quality Requirements and Metrics

*This plan covers quality across the four core dimensions of the project.*

### 1.1. Product Quality
- **Performance:** The JD Upload and OCR feature responds in under 5 seconds. The Mentor search API responds in under 2 seconds.
- **Usability:** The interface works on both mobile and desktop. The Mentor booking flow is straightforward and easy to use.
- **Maintainability:** Code follows the team's convention, is readable, and is easy to extend.

### 1.2. Process Quality
- **Kanban process compliance:** Every task on the Kanban board moves through the correct status flow (Ready -> In Progress -> Review -> Done).
- **Source control process:** Any change pushed to the `develop` branch must open a pull request and be approved by at least one person.

### 1.3. Project Quality
- **Schedule:** The share of tasks completed on time.
- **Cost and productivity:** The project must not exceed the budget already reserved for server and cloud costs.
- **Customer satisfaction:** Acceptance is achieved at the end of each phase.

### 1.4. Person Quality
- **Satisfaction and engagement:** Team members feel comfortable, are not overloaded, and stay motivated to code.
- **Skill:** The quality of the developers' workmanship is maintained.

## 2. Quality Assurance Activities
- A shared `.eslintrc` and `.prettierrc` must be installed by every developer so code is consistently formatted before it is committed.
- Run the first team meeting so everyone agrees to and commits to the Definition of Done.

## 3. Quality Control Activities
- **Product focus:**
  - A Pull Request (PR) is required on GitHub, and at least one reviewer must approve before a change is merged to `develop`.
  - Unit tests run automatically on GitHub Actions. A failing test blocks the merge.
