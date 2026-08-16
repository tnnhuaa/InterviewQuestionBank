import { createHash } from "node:crypto";
import { fileTypeFromBuffer } from "file-type";
import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { findIdempotentResult, saveIdempotentResult } from "../../platform/idempotency.js";
import { writeAudit } from "../../platform/audit.js";

const allowedTypes = new Map([
  ["application/pdf", "PDF"],
  ["image/png", "IMAGE"],
  ["image/jpeg", "IMAGE"],
]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalize(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function jdDto(row) {
  return {
    id: row.id,
    sourceType: row.source_type,
    status: row.status,
    extractedText: row.extracted_text,
    correctedText: row.corrected_text,
    correctedVersion: row.corrected_version,
    confirmedAt: row.confirmed_at,
    extractionMethod: row.extraction_method,
    extractionConfidence: row.confidence,
    processing: row.job_status ? {
      id: row.job_id,
      status: row.job_status,
      attemptCount: row.attempt_count,
      errorCode: row.error_code,
    } : null,
    version: row.version,
  };
}

export function createJdService({ pool, storage }) {
  async function getOwned(studentId, id, client = pool) {
    const result = await client.query(
      `SELECT jd.*, ej.id AS job_id, ej.status AS job_status, ej.attempt_count,
              ej.error_code, ej.confidence
       FROM job_descriptions jd
       LEFT JOIN LATERAL (
         SELECT * FROM extraction_jobs WHERE job_description_id = jd.id ORDER BY created_at DESC LIMIT 1
       ) ej ON true
       WHERE jd.id = $1 AND jd.student_id = $2`,
      [id, studentId],
    );
    if (!result.rowCount) throw notFoundError();
    return result.rows[0];
  }

  async function createFromText(studentId, text) {
    const cleaned = text.trim();
    if (!cleaned || cleaned.length > 50000) {
      throw new AppError({
        status: 422,
        code: "INVALID_JD_TEXT",
        message: "JD dạng văn bản phải có từ 1 đến 50.000 ký tự.",
        fieldErrors: { text: "Nhập nội dung JD hợp lệ, tối đa 50.000 ký tự" },
        recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      });
    }
    const result = await pool.query(
      `INSERT INTO job_descriptions (
         student_id, source_type, status, extracted_text, corrected_text,
         corrected_version, extraction_method, extraction_version
       ) VALUES ($1, 'PASTED_TEXT', 'READY_FOR_REVIEW', $2, $2, 1, 'PASTED_TEXT', 'extract-v1')
       RETURNING *`,
      [studentId, cleaned],
    );
    await pool.query(
      `INSERT INTO jd_text_versions (job_description_id, version, corrected_text, created_by)
       VALUES ($1, 1, $2, $3)`,
      [result.rows[0].id, cleaned, studentId],
    );
    return jdDto(result.rows[0]);
  }

  async function createFromFile(studentId, file) {
    if (!file?.buffer?.length) {
      throw new AppError({
        status: 422,
        code: "EMPTY_DOCUMENT",
        message: "Tệp không có nội dung để xử lý.",
        recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
      });
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new AppError({
        status: 413,
        code: "FILE_TOO_LARGE",
        message: "Tệp vượt quá giới hạn 10 MB.",
        recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
      });
    }
    const detected = await fileTypeFromBuffer(file.buffer);
    const sourceType = allowedTypes.get(detected?.mime);
    if (!sourceType) {
      throw new AppError({
        status: 415,
        code: "UNSUPPORTED_DOCUMENT",
        message: "Chỉ hỗ trợ PDF, PNG hoặc JPEG hợp lệ.",
        recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
      });
    }
    const objectKey = await storage.put(file.buffer, { contentType: detected.mime });
    try {
      const result = await pool.query(
        `INSERT INTO job_descriptions (
           student_id, source_type, original_file_ref, original_mime_type,
           original_size_bytes, original_content_hash, original_delete_after, status
         ) VALUES ($1, $2, $3, $4, $5, $6, now() + interval '24 hours', 'DRAFT')
         RETURNING *`,
        [studentId, sourceType, objectKey, detected.mime, file.size, sha256(file.buffer)],
      );
      return jdDto(result.rows[0]);
    } catch (error) {
      await storage.delete(objectKey);
      throw error;
    }
  }

  async function get(studentId, id) {
    return jdDto(await getOwned(studentId, id));
  }

  async function list(studentId) {
    const result = await pool.query(
      `SELECT jd.*, ej.id AS job_id, ej.status AS job_status, ej.attempt_count, ej.error_code, ej.confidence
       FROM job_descriptions jd
       LEFT JOIN LATERAL (SELECT * FROM extraction_jobs WHERE job_description_id = jd.id ORDER BY created_at DESC LIMIT 1) ej ON true
       WHERE jd.student_id = $1 ORDER BY jd.updated_at DESC`,
      [studentId],
    );
    return { items: result.rows.map(jdDto), pageInfo: { page: 1, pageSize: result.rowCount, total: result.rowCount } };
  }

  async function startExtraction(studentId, id, key) {
    return withTransaction(pool, async (client) => {
      const jd = await getOwned(studentId, id, client);
      if (!jd.original_file_ref || !jd.original_content_hash) {
        throw new AppError({
          status: 409,
          code: "EXTRACTION_NOT_REQUIRED",
          message: "JD dạng văn bản đã sẵn sàng để kiểm tra.",
          recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
        });
      }
      const input = { jobDescriptionId: id, contentHash: jd.original_content_hash, extractionVersion: "extract-v1" };
      const state = await findIdempotentResult(client, {
        actorId: studentId,
        operation: "START_EXTRACTION",
        key,
        input,
      });
      if (state.cached?.response_body) return state.cached.response_body;
      const job = await client.query(
        `INSERT INTO extraction_jobs (job_description_id, input_hash, extraction_version)
         VALUES ($1, $2, 'extract-v1')
         ON CONFLICT (job_description_id, input_hash, extraction_version)
         DO UPDATE SET available_at = least(extraction_jobs.available_at, now())
         RETURNING id, status, attempt_count`,
        [id, jd.original_content_hash],
      );
      await client.query(
        "UPDATE job_descriptions SET status = 'EXTRACTING', updated_at = now(), version = version + 1 WHERE id = $1",
        [id],
      );
      const body = { id, status: "EXTRACTING", processing: {
        id: job.rows[0].id,
        status: job.rows[0].status,
        attemptCount: job.rows[0].attempt_count,
        errorCode: null,
      } };
      await saveIdempotentResult(client, {
        actorId: studentId,
        operation: "START_EXTRACTION",
        key,
        digest: state.digest,
        status: 202,
        body,
        resourceId: id,
      });
      return body;
    });
  }

  async function retryExtraction(studentId, id, key) {
    const current = await getOwned(studentId, id);
    if (current.job_status !== "FAILED") return startExtraction(studentId, id, key);
    if (current.attempt_count >= 2) {
      throw new AppError({
        status: 409,
        code: "EXTRACTION_RETRY_LIMIT",
        message: "Đã hết lượt xử lý tự động. Bạn có thể dán nội dung JD để tiếp tục.",
        recovery: { kind: "PASTE_TEXT", retryable: false, retryAfterSeconds: null },
      });
    }
    await pool.query(
      `UPDATE extraction_jobs SET status = 'PENDING', error_code = NULL, available_at = now()
       WHERE id = $1`,
      [current.job_id],
    );
    await pool.query("UPDATE job_descriptions SET status = 'EXTRACTING' WHERE id = $1", [id]);
    return get(studentId, id);
  }

  async function saveCorrectedText(studentId, id, { correctedText, version }) {
    const cleaned = correctedText.trim();
    if (!cleaned || cleaned.length > 50000) {
      throw new AppError({
        status: 422,
        code: "INVALID_JD_TEXT",
        message: "Văn bản hiệu chỉnh phải có từ 1 đến 50.000 ký tự.",
        recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      });
    }
    return withTransaction(pool, async (client) => {
      const result = await client.query(
        `UPDATE job_descriptions SET corrected_text = $3,
           corrected_version = corrected_version + 1, confirmed_at = NULL,
           status = 'READY_FOR_REVIEW', updated_at = now(), version = version + 1
         WHERE id = $1 AND student_id = $2 AND corrected_version = $4
         RETURNING *`,
        [id, studentId, cleaned, version],
      );
      if (!result.rowCount) {
        throw new AppError({
          status: 409,
          code: "VERSION_CONFLICT",
          message: "Văn bản JD đã thay đổi. Hãy tải lại trước khi lưu.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      const jd = result.rows[0];
      await client.query(
        `INSERT INTO jd_text_versions (job_description_id, version, corrected_text, created_by)
         VALUES ($1, $2, $3, $4)`,
        [id, jd.corrected_version, cleaned, studentId],
      );
      await client.query(
        `UPDATE preparation_plans SET status = 'INVALIDATED', updated_at = now(), version = version + 1
         WHERE job_description_id = $1 AND status = 'ACTIVE'`,
        [id],
      );
      return jdDto(jd);
    });
  }

  async function confirmText(studentId, id, version) {
    const result = await pool.query(
      `UPDATE job_descriptions SET status = 'CONFIRMED', confirmed_at = now(),
         updated_at = now(), version = version + 1
       WHERE id = $1 AND student_id = $2 AND corrected_version = $3
         AND corrected_text IS NOT NULL
       RETURNING *`,
      [id, studentId, version],
    );
    if (!result.rowCount) {
      throw new AppError({
        status: 409,
        code: "TEXT_VERSION_CONFLICT",
        message: "Hãy lưu và xác nhận phiên bản văn bản mới nhất.",
        recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
      });
    }
    await pool.query(
      "UPDATE jd_text_versions SET confirmed_at = now() WHERE job_description_id = $1 AND version = $2",
      [id, version],
    );
    return jdDto(result.rows[0]);
  }

  async function analyze(studentId, id, correctedTextVersion, correlationId, key) {
    return withTransaction(pool, async (client) => {
      const jd = await getOwned(studentId, id, client);
      const idempotency = await findIdempotentResult(client, {
        actorId: studentId,
        operation: "ANALYZE_JD",
        key,
        input: { id, correctedTextVersion },
      });
      if (idempotency.cached?.response_body) return idempotency.cached.response_body;
      if (jd.status !== "CONFIRMED" || jd.corrected_version !== correctedTextVersion) {
        throw new AppError({
          status: 409,
          code: "TEXT_NOT_CONFIRMED",
          message: "Hãy xác nhận phiên bản văn bản hiện tại trước khi phân tích.",
          recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
        });
      }
      const next = await client.query(
        "SELECT coalesce(max(analysis_version), 0)::int + 1 AS version FROM jd_requirements WHERE job_description_id = $1",
        [id],
      );
      const analysisVersion = next.rows[0].version;
      const taxonomy = await client.query(
        `SELECT t.id, t.name, t.slug,
          coalesce(array_agg(ta.alias) FILTER (WHERE ta.id IS NOT NULL), '{}') AS aliases
         FROM topics t
         LEFT JOIN topic_aliases ta ON ta.topic_id = t.id
         WHERE t.status = 'ACTIVE'
         GROUP BY t.id ORDER BY t.priority, t.id`,
      );
      const normalizedText = normalize(jd.corrected_text);
      const detected = [];
      for (const topic of taxonomy.rows) {
        const terms = [topic.name, topic.slug, ...topic.aliases];
        const matchedTerm = terms.find((term) => normalizedText.includes(normalize(term)));
        if (matchedTerm) detected.push({ topic, matchedTerm });
      }
      if (/frontend|front-end/i.test(jd.corrected_text)) {
        detected.unshift({ topic: null, matchedTerm: "Frontend", type: "ROLE" });
      }
      if (/intern|thực tập/i.test(jd.corrected_text)) {
        detected.unshift({ topic: null, matchedTerm: "Intern", type: "SENIORITY" });
      } else if (/junior|fresher|mới tốt nghiệp/i.test(jd.corrected_text)) {
        detected.unshift({ topic: null, matchedTerm: "Junior", type: "SENIORITY" });
      }
      if (!detected.length) {
        detected.push({ topic: null, matchedTerm: jd.corrected_text.slice(0, 500), type: "REQUIREMENT" });
      }
      const requirements = [];
      for (const item of detected) {
        const result = await client.query(
          `INSERT INTO jd_requirements (
             job_description_id, analysis_version, raw_text, requirement_type,
             normalized_topic_id, confidence, rule_evidence
           ) VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, raw_text, requirement_type, normalized_topic_id, confidence`,
          [id, analysisVersion, item.matchedTerm, item.type ?? "SKILL", item.topic?.id ?? null,
            item.topic ? 0.95 : 0.75, { rule: item.topic ? "taxonomy_alias" : "pilot_dictionary" }],
        );
        requirements.push(result.rows[0]);
      }
      await client.query(
        "UPDATE job_descriptions SET status = 'ANALYZED', updated_at = now(), version = version + 1 WHERE id = $1",
        [id],
      );
      await writeAudit(client, {
        actorId: studentId,
        action: "JD_ANALYZED",
        targetType: "JOB_DESCRIPTION",
        targetId: id,
        metadata: { analysisVersion, requirementCount: requirements.length },
        correlationId,
      });
      const body = { jobDescriptionId: id, analysisVersion, requirements };
      await saveIdempotentResult(client, {
        actorId: studentId,
        operation: "ANALYZE_JD",
        key,
        digest: idempotency.digest,
        status: 200,
        body,
        resourceId: id,
      });
      return body;
    });
  }

  async function saveNormalizations(studentId, id, input) {
    return withTransaction(pool, async (client) => {
      await getOwned(studentId, id, client);
      for (const item of input.items) {
        const requirement = await client.query(
          `SELECT id FROM jd_requirements
           WHERE id = $1 AND job_description_id = $2 AND analysis_version = $3`,
          [item.requirementId, id, input.analysisVersion],
        );
        if (!requirement.rowCount) throw notFoundError();
        await client.query(
          `INSERT INTO requirement_normalization_overrides (
             requirement_id, topic_id, actor_id, reason, mapping_input_version
           ) VALUES ($1, $2, $3, $4, $5)`,
          [item.requirementId, item.topicId, studentId, item.reason, input.mappingInputVersion],
        );
      }
      return { jobDescriptionId: id, ...input };
    });
  }

  async function getAnalysis(studentId, id, analysisVersion) {
    await getOwned(studentId, id);
    const versionResult = analysisVersion
      ? { rows: [{ version: analysisVersion }] }
      : await pool.query("SELECT max(analysis_version)::int AS version FROM jd_requirements WHERE job_description_id = $1", [id]);
    const version = versionResult.rows[0]?.version;
    if (!version) throw notFoundError();
    const result = await pool.query(
      `SELECT r.id, r.raw_text, r.requirement_type, r.normalized_topic_id, r.confidence,
              coalesce((SELECT o.topic_id FROM requirement_normalization_overrides o
                        WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1), r.normalized_topic_id) AS effective_topic_id,
              t.name AS topic_name
       FROM jd_requirements r
       LEFT JOIN topics t ON t.id = coalesce((SELECT o.topic_id FROM requirement_normalization_overrides o
                        WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1), r.normalized_topic_id)
       WHERE r.job_description_id = $1 AND r.analysis_version = $2 ORDER BY r.id`,
      [id, version],
    );
    return { jobDescriptionId: id, analysisVersion: version, requirements: result.rows };
  }

  async function match(studentId, id, analysisVersion, correlationId, key) {
    return withTransaction(pool, async (client) => {
      const jd = await getOwned(studentId, id, client);
      const idempotency = await findIdempotentResult(client, {
        actorId: studentId,
        operation: "MATCH_JD",
        key,
        input: { id, analysisVersion },
      });
      if (idempotency.cached?.response_body) return idempotency.cached.response_body;
      const requirements = await client.query(
        `SELECT r.*,
          coalesce((SELECT o.topic_id FROM requirement_normalization_overrides o
                    WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1), r.normalized_topic_id) AS effective_topic_id,
          t.name AS topic_name
         FROM jd_requirements r
         LEFT JOIN topics t ON t.id = coalesce((SELECT o.topic_id FROM requirement_normalization_overrides o
                    WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1), r.normalized_topic_id)
         WHERE r.job_description_id = $1 AND r.analysis_version = $2
         ORDER BY r.id`,
        [id, analysisVersion],
      );
      const rule = await client.query(
        "SELECT * FROM matching_rule_versions WHERE status = 'ACTIVE' ORDER BY created_at DESC LIMIT 1",
      );
      if (!rule.rowCount) throw new Error("No active matching rule version");
      const ruleSet = rule.rows[0];
      const existing = await client.query(
        `SELECT m.id, m.requirement_id, r.raw_text AS requirement, t.name AS topic,
                m.score, m.reason, m.rank, m.result_hash,
                q.id AS question_id, q.title, q.difficulty
         FROM jd_question_matches m
         JOIN jd_requirements r ON r.id = m.requirement_id
         LEFT JOIN topics t ON t.id = coalesce(
           (SELECT o.topic_id FROM requirement_normalization_overrides o WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1),
           r.normalized_topic_id)
         JOIN questions q ON q.id = m.question_id AND q.lifecycle_status = 'PUBLISHED'
         WHERE m.job_description_id = $1 AND m.analysis_version = $2 AND m.matching_version = $3
         ORDER BY m.rank`,
        [id, analysisVersion, ruleSet.version],
      );
      if (existing.rowCount) {
        const body = {
          jobDescriptionId: id,
          analysisVersion,
          matchingVersion: ruleSet.version,
          resultHash: existing.rows[0].result_hash,
          matches: existing.rows.map((row) => ({
            id: row.id, requirementId: row.requirement_id, requirement: row.requirement,
            topic: row.topic, score: row.score, reason: row.reason, rank: row.rank,
            question: { id: row.question_id, title: row.title, difficulty: row.difficulty },
          })),
        };
        await saveIdempotentResult(client, {
          actorId: studentId, operation: "MATCH_JD", key, digest: idempotency.digest,
          status: 200, body, resourceId: id,
        });
        return body;
      }
      const scored = [];
      for (const requirement of requirements.rows) {
        if (!requirement.effective_topic_id) continue;
        const candidates = await client.query(
          `SELECT q.id, q.title, q.content, q.difficulty, t.name AS topic_name,
                  coalesce(array_agg(p.slug) FILTER (WHERE p.id IS NOT NULL), '{}') AS positions
           FROM questions q
           JOIN question_topics qt ON qt.question_id = q.id
           JOIN topics t ON t.id = qt.topic_id
           LEFT JOIN question_positions qp ON qp.question_id = q.id
           LEFT JOIN positions p ON p.id = qp.position_id
           WHERE q.lifecycle_status = 'PUBLISHED' AND t.status = 'ACTIVE' AND t.id = $1
           GROUP BY q.id, t.name
           ORDER BY q.id`,
          [requirement.effective_topic_id],
        );
        const requirementWords = normalize(requirement.raw_text).split(/\W+/).filter((word) => word.length > 2);
        for (const candidate of candidates.rows) {
          const haystack = normalize(`${candidate.title} ${candidate.content}`);
          const covered = requirementWords.filter((word) => haystack.includes(word)).length;
          const keywordScore = requirementWords.length
            ? Math.round((covered / requirementWords.length) * ruleSet.keyword_weight)
            : ruleSet.keyword_weight;
          const roleScore = /frontend/i.test(jd.corrected_text) && candidate.positions.length
            ? ruleSet.role_weight : 0;
          const junior = /intern|junior|fresher|thực tập/i.test(jd.corrected_text);
          const seniorityScore = junior && ["EASY", "MEDIUM"].includes(candidate.difficulty)
            ? ruleSet.seniority_weight : 0;
          const score = ruleSet.exact_topic_weight + keywordScore + roleScore + seniorityScore;
          if (score >= ruleSet.threshold) {
            scored.push({ requirement, candidate, score, keywordScore, roleScore, seniorityScore });
          }
        }
      }
      scored.sort((left, right) => right.score - left.score
        || String(left.requirement.effective_topic_id).localeCompare(String(right.requirement.effective_topic_id))
        || left.candidate.id.localeCompare(right.candidate.id));
      const perRequirement = new Map();
      const selected = [];
      for (const item of scored) {
        const count = perRequirement.get(item.requirement.id) ?? 0;
        if (count >= ruleSet.max_per_requirement || selected.length >= ruleSet.max_per_jd) continue;
        perRequirement.set(item.requirement.id, count + 1);
        selected.push(item);
      }
      const resultHash = sha256(selected.map((item) => `${item.requirement.id}:${item.candidate.id}:${item.score}`).join("|"));
      await client.query(
        "DELETE FROM jd_question_matches WHERE job_description_id = $1 AND analysis_version = $2 AND matching_version = $3",
        [id, analysisVersion, ruleSet.version],
      );
      const matches = [];
      for (const [index, item] of selected.entries()) {
        const reason = `Phù hợp chủ đề ${item.requirement.topic_name}; điểm chủ đề ${ruleSet.exact_topic_weight}, từ khóa ${item.keywordScore}, vai trò ${item.roleScore}, cấp độ ${item.seniorityScore}.`;
        const result = await client.query(
          `INSERT INTO jd_question_matches (
             job_description_id, requirement_id, question_id, analysis_version,
             matching_version, score, reason, rule_evidence, result_hash, rank
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id`,
          [id, item.requirement.id, item.candidate.id, analysisVersion, ruleSet.version,
            item.score, reason, { keywordScore: item.keywordScore, roleScore: item.roleScore,
              seniorityScore: item.seniorityScore }, resultHash, index + 1],
        );
        matches.push({
          id: result.rows[0].id,
          requirementId: item.requirement.id,
          requirement: item.requirement.raw_text,
          topic: item.requirement.topic_name,
          question: {
            id: item.candidate.id,
            title: item.candidate.title,
            difficulty: item.candidate.difficulty,
          },
          score: item.score,
          reason,
          rank: index + 1,
        });
      }
      await writeAudit(client, {
        actorId: studentId,
        action: "JD_MATCHED",
        targetType: "JOB_DESCRIPTION",
        targetId: id,
        metadata: { analysisVersion, matchingVersion: ruleSet.version, resultHash, matchCount: matches.length },
        correlationId,
      });
      const body = { jobDescriptionId: id, analysisVersion, matchingVersion: ruleSet.version, resultHash, matches };
      await saveIdempotentResult(client, {
        actorId: studentId,
        operation: "MATCH_JD",
        key,
        digest: idempotency.digest,
        status: 200,
        body,
        resourceId: id,
      });
      return body;
    });
  }

  async function getMatches(studentId, id, analysisVersion) {
    await getOwned(studentId, id);
    const result = await pool.query(
      `SELECT m.id, m.requirement_id, r.raw_text AS requirement, t.name AS topic,
              m.score, m.reason, m.rank, m.matching_version, m.result_hash,
              q.id AS question_id, q.title, q.difficulty
       FROM jd_question_matches m
       JOIN jd_requirements r ON r.id = m.requirement_id
       LEFT JOIN topics t ON t.id = coalesce(
         (SELECT o.topic_id FROM requirement_normalization_overrides o WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1),
         r.normalized_topic_id)
       JOIN questions q ON q.id = m.question_id AND q.lifecycle_status = 'PUBLISHED'
       WHERE m.job_description_id = $1 AND ($2::int IS NULL OR m.analysis_version = $2)
       ORDER BY m.rank`,
      [id, analysisVersion ?? null],
    );
    return {
      jobDescriptionId: id,
      analysisVersion: analysisVersion ?? null,
      matchingVersion: result.rows[0]?.matching_version ?? null,
      resultHash: result.rows[0]?.result_hash ?? null,
      matches: result.rows.map((row) => ({
        id: row.id,
        requirementId: row.requirement_id,
        requirement: row.requirement,
        topic: row.topic,
        score: row.score,
        reason: row.reason,
        rank: row.rank,
        question: { id: row.question_id, title: row.title, difficulty: row.difficulty },
      })),
    };
  }

  async function createPlan(studentId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      await getOwned(studentId, input.jobDescriptionId, client);
      const matches = await client.query(
        `SELECT m.id, m.requirement_id, r.normalized_topic_id, m.question_id, m.matching_version
         FROM jd_question_matches m
         JOIN jd_requirements r ON r.id = m.requirement_id
         WHERE m.job_description_id = $1 AND m.id = ANY($2::uuid[])
           AND m.matching_version = $3`,
        [input.jobDescriptionId, input.matchIds, input.matchingVersion],
      );
      if (matches.rowCount !== input.matchIds.length || matches.rowCount > 10) {
        throw new AppError({
          status: 422,
          code: "INVALID_PLAN_SELECTION",
          message: "Một số câu hỏi không còn hợp lệ. Hãy tải lại kết quả gợi ý.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      const plan = await client.query(
        `INSERT INTO preparation_plans (student_id, job_description_id, matching_version)
         VALUES ($1, $2, $3) RETURNING id, status, version, created_at, updated_at`,
        [studentId, input.jobDescriptionId, input.matchingVersion],
      );
      for (const [index, match] of matches.rows.entries()) {
        await client.query(
          `INSERT INTO preparation_plan_items (
             plan_id, match_id, requirement_id, topic_id, question_id, priority
           ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [plan.rows[0].id, match.id, match.requirement_id, match.normalized_topic_id,
            match.question_id, index < 3 ? "MUST" : index < 7 ? "SHOULD" : "OPTIONAL"],
        );
      }
      await writeAudit(client, {
        actorId: studentId,
        action: "PREPARATION_PLAN_CREATED",
        targetType: "PREPARATION_PLAN",
        targetId: plan.rows[0].id,
        metadata: { matchingVersion: input.matchingVersion, itemCount: matches.rowCount },
        correlationId,
      });
      return { id: plan.rows[0].id, jobDescriptionId: input.jobDescriptionId,
        matchingVersion: input.matchingVersion, status: plan.rows[0].status,
        version: plan.rows[0].version };
    });
  }

  async function getPlan(studentId, id) {
    const plan = await pool.query(
      `SELECT id, job_description_id, matching_version, status, version, created_at, updated_at
       FROM preparation_plans WHERE id = $1 AND student_id = $2`,
      [id, studentId],
    );
    if (!plan.rowCount) throw notFoundError();
    const items = await pool.query(
      `SELECT pi.id, pi.priority, pi.practice_status, pi.mentor_next_action,
              q.id AS question_id, q.title, q.difficulty,
              r.raw_text AS requirement, t.name AS topic, m.score, m.reason
       FROM preparation_plan_items pi
       LEFT JOIN questions q ON q.id = pi.question_id
       LEFT JOIN jd_requirements r ON r.id = pi.requirement_id
       LEFT JOIN topics t ON t.id = pi.topic_id
       LEFT JOIN jd_question_matches m ON m.id = pi.match_id
       WHERE pi.plan_id = $1
       ORDER BY CASE pi.priority WHEN 'MUST' THEN 1 WHEN 'SHOULD' THEN 2 ELSE 3 END, pi.created_at`,
      [id],
    );
    return {
      id: plan.rows[0].id,
      jobDescriptionId: plan.rows[0].job_description_id,
      matchingVersion: plan.rows[0].matching_version,
      status: plan.rows[0].status,
      version: plan.rows[0].version,
      items: items.rows.map((row) => ({
        id: row.id,
        priority: row.priority,
        practiceStatus: row.practice_status,
        mentorNextAction: row.mentor_next_action,
        requirement: row.requirement,
        topic: row.topic,
        score: row.score,
        reason: row.reason,
        question: { id: row.question_id, title: row.title, difficulty: row.difficulty },
      })),
    };
  }

  async function listPlans(studentId) {
    const result = await pool.query(
      `SELECT id, job_description_id, matching_version, status, version, created_at
       FROM preparation_plans WHERE student_id = $1 AND status = 'ACTIVE' ORDER BY created_at DESC`,
      [studentId],
    );
    return { items: result.rows.map((row) => ({ id: row.id, jobDescriptionId: row.job_description_id, matchingVersion: row.matching_version, status: row.status, version: row.version })), pageInfo: { page: 1, pageSize: result.rowCount, total: result.rowCount } };
  }

  return {
    createFromText,
    createFromFile,
    get,
    list,
    startExtraction,
    retryExtraction,
    saveCorrectedText,
    confirmText,
    analyze,
    saveNormalizations,
    getAnalysis,
    match,
    getMatches,
    createPlan,
    getPlan,
    listPlans,
  };
}
