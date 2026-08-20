import { describe, expect, it } from "vitest";
import { scoreQuestionMatch } from "../src/modules/jd/matcher.js";

const ruleSet = {
  exact_topic_weight: 40,
  keyword_weight: 30,
  role_weight: 15,
  seniority_weight: 15,
};

const candidate = {
  title: "React component rendering",
  content: "React component state and props rendering lifecycle",
  positions: ["frontend-intern"],
  difficulty: "MEDIUM",
};

describe("scoreQuestionMatch", () => {
  it("uses the approved 40/30/15/15 score components for a matching frontend intern question", () => {
    expect(scoreQuestionMatch({
      requirementText: "React component rendering",
      candidate,
      ruleSet,
      roleRequirements: [{ raw_text: "Frontend" }],
      seniorityRequirements: [{ raw_text: "Intern" }],
    })).toEqual({ keywordScore: 30, roleScore: 15, seniorityScore: 15, score: 100 });
  });

  it("does not award role points merely because the question has an unrelated position", () => {
    expect(scoreQuestionMatch({
      requirementText: "React component rendering",
      candidate: { ...candidate, positions: ["backend-intern"] },
      ruleSet,
      roleRequirements: [{ raw_text: "Frontend" }],
      seniorityRequirements: [{ raw_text: "Intern" }],
    }).roleScore).toBe(0);
  });

  it("normalizes Vietnamese accents and awards entry-level points for an internship", () => {
    const result = scoreQuestionMatch({
      requirementText: "Quản lý trạng thái React",
      candidate: { ...candidate, title: "Quản lý trạng thái React" },
      ruleSet,
      roleRequirements: [{ raw_text: "Frontend" }],
      seniorityRequirements: [{ raw_text: "Thực tập" }],
    });

    expect(result.keywordScore).toBe(30);
    expect(result.seniorityScore).toBe(15);
  });

  it("does not award entry-level points to a hard question", () => {
    expect(scoreQuestionMatch({
      requirementText: "React rendering",
      candidate: { ...candidate, difficulty: "HARD" },
      ruleSet,
      roleRequirements: [],
      seniorityRequirements: [{ raw_text: "Junior" }],
    }).seniorityScore).toBe(0);
  });

  it("uses the full keyword component when requirement text has no searchable words", () => {
    const result = scoreQuestionMatch({
      requirementText: "JS",
      candidate,
      ruleSet,
      roleRequirements: [{ raw_text: "UI" }],
      seniorityRequirements: [],
    });

    expect(result).toMatchObject({ keywordScore: 30, roleScore: 0, seniorityScore: 0, score: 70 });
  });
});
