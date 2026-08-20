function normalize(value) {
  return String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function isRoleFit(candidatePositions, roleRequirements) {
  const positions = candidatePositions.map(normalize);
  return roleRequirements.some((requirement) => {
    const role = normalize(requirement.raw_text).replace(/[^a-z0-9]+/g, "");
    return role.length >= 3 && positions.some((position) => position.includes(role));
  });
}

function isEntryLevel(seniorityRequirements) {
  return seniorityRequirements.some((requirement) => /intern|junior|fresher|thuc tap/.test(normalize(requirement.raw_text)));
}

export function scoreQuestionMatch({ requirementText, candidate, ruleSet, roleRequirements, seniorityRequirements }) {
  const requirementWords = normalize(requirementText).split(/\W+/).filter((word) => word.length > 2);
  const haystack = normalize(`${candidate.title} ${candidate.content}`);
  const covered = requirementWords.filter((word) => haystack.includes(word)).length;
  const keywordScore = requirementWords.length
    ? Math.round((covered / requirementWords.length) * ruleSet.keyword_weight)
    : ruleSet.keyword_weight;
  const roleScore = isRoleFit(candidate.positions, roleRequirements) ? ruleSet.role_weight : 0;
  const seniorityScore = isEntryLevel(seniorityRequirements) && ["EASY", "MEDIUM"].includes(candidate.difficulty)
    ? ruleSet.seniority_weight : 0;
  return {
    keywordScore,
    roleScore,
    seniorityScore,
    score: ruleSet.exact_topic_weight + keywordScore + roleScore + seniorityScore,
  };
}
