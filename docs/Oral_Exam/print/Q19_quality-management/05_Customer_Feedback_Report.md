# Customer Feedback Report

**Project:** Interview Practice Platform
**Phase:** User Acceptance Testing (UAT)
**Customer representative:** Lecturer

## 1. Points the customer was satisfied with
- The JD upload and automatic keyword extraction feature works smoothly.
- The Mentor booking interface is visual and the availability view (similar to Google Calendar) is easy to understand.

## 2. Problems reported by the customer

**Defects (logic errors):**
- When a student selects "Filter mentors by ReactJS skill", the returned list is empty even though ReactJS mentors exist.
- **Action required:** Fix the mentor search API query as a priority.

**Usability issues:**
- After a student finishes a mock test, the "Submit" button sits at the very bottom of the screen and requires a long scroll to reach.
- **Action required:** Move the "Submit" button to the top-right as a sticky banner so it is easier to tap.

**Performance:**
- Every time a ~5MB JD PDF is uploaded, the app spins for over 15 seconds before showing the result.
- **Action required:** Optimise the OCR API, or show a progress bar so the user knows the system is working instead of assuming the app is frozen and reloading the page.

## 3. Decision
- **Conclusion:** The customer has **not accepted** Sprint 3 because of the "Filter mentors" bug, a severe issue that blocks the core flow.
- **Team action:** Log all the above issues in Jira. Focus resources on fixing them within the next two days so the customer can test again.
