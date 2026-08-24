# Definition of Done (DoD)

**Project:** Interview Practice Platform

For a User Story (Task) on the Kanban board to move into the **DONE** column, every condition below must be met:

## 1. Code and Technical
- [ ] Code has been pushed to its own branch on GitHub.
- [ ] Code does not violate any lint rules (`npm run lint` runs with no errors).
- [ ] No leftover `console.log`, junk comments, or hard-coded data.

## 2. Testing
- [ ] Unit tests have been written for the new logic or feature.
- [ ] All existing and new unit tests pass 100% when run locally.
- [ ] The feature has been manually tested by a QA/tester and confirmed to work against the original Acceptance Criteria.

## 3. Review and Process
- [ ] A valid Pull Request (PR) has been opened to the `develop` branch.
- [ ] At least one other team member has performed a code review and **Approve**d the PR.
- [ ] Any source-control conflicts have been fully resolved.

## 4. Documentation
- [ ] If the database changed, the migration scripts are attached.
