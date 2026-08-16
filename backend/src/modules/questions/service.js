import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { writeAudit } from "../../platform/audit.js";

function questionDto(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    answerCriteria: row.answer_criteria ?? [],
    difficulty: row.difficulty,
    lifecycleStatus: row.lifecycle_status,
    source: { name: row.source_name, url: row.source_url, note: row.provenance_note },
    topics: row.topics ?? [],
    positions: row.positions ?? [],
    bookmarked: row.bookmarked ?? false,
    practiceStatus: row.practice_status ?? "NOT_STARTED",
    version: row.version,
  };
}

const questionProjection = `
  SELECT q.*,
    coalesce(array_agg(DISTINCT t.name) FILTER (WHERE t.id IS NOT NULL), '{}') AS topics,
    coalesce(array_agg(DISTINCT p.name) FILTER (WHERE p.id IS NOT NULL), '{}') AS positions,
    coalesce(bool_or(pp.bookmarked), false) AS bookmarked,
    max(pp.status) AS practice_status
  FROM questions q
  LEFT JOIN question_topics qt ON qt.question_id = q.id
  LEFT JOIN topics t ON t.id = qt.topic_id
  LEFT JOIN question_positions qp ON qp.question_id = q.id
  LEFT JOIN positions p ON p.id = qp.position_id
  LEFT JOIN practice_progress pp ON pp.question_id = q.id AND pp.student_id = $1
`;

export function createQuestionsService({ pool }) {
  async function list({ actorId = null, search, topic, difficulty, page, pageSize, includeAll = false }) {
    const values = [actorId];
    const countValues = [];
    const clauses = includeAll ? [] : ["q.lifecycle_status = 'PUBLISHED'"];
    if (search) {
      values.push(`%${search}%`);
      countValues.push(`%${search}%`);
      clauses.push(`(q.title ILIKE $${values.length} OR q.content ILIKE $${values.length})`);
    }
    if (topic) {
      values.push(topic);
      countValues.push(topic);
      clauses.push(`(t.slug = $${values.length} OR lower(t.name) = lower($${values.length}))`);
    }
    if (difficulty) {
      values.push(difficulty);
      countValues.push(difficulty);
      clauses.push(`q.difficulty = $${values.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const countWhere = where.replaceAll(/\$(\d+)/g, (_, index) => `$${Number(index) - 1}`);
    values.push(pageSize, (page - 1) * pageSize);
    const items = await pool.query(
      `${questionProjection}
       ${where}
       GROUP BY q.id
       ORDER BY q.published_at DESC NULLS LAST, q.id
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await pool.query(
      `SELECT count(DISTINCT q.id)::int AS total
       FROM questions q
       LEFT JOIN question_topics qt ON qt.question_id = q.id
       LEFT JOIN topics t ON t.id = qt.topic_id
       ${countWhere}`,
      countValues,
    );
    return {
      items: items.rows.map(questionDto),
      pageInfo: { page, pageSize, total: count.rows[0].total },
    };
  }

  async function get({ id, actorId = null, includeAll = false }) {
    const result = await pool.query(
      `${questionProjection}
       WHERE (q.id::text = $2 OR q.slug = $2)
         ${includeAll ? "" : "AND q.lifecycle_status = 'PUBLISHED'"}
       GROUP BY q.id`,
      [actorId, id],
    );
    if (!result.rowCount) throw notFoundError();
    return questionDto(result.rows[0]);
  }

  async function listTaxonomy() {
    const [topics, positions] = await Promise.all([
      pool.query("SELECT id, slug, name, priority FROM topics WHERE status = 'ACTIVE' ORDER BY priority, name"),
      pool.query("SELECT id, slug, name, priority FROM positions WHERE status = 'ACTIVE' ORDER BY priority, name"),
    ]);
    return { topics: topics.rows, positions: positions.rows };
  }

  async function updateProgress(studentId, questionId, input) {
    const exists = await pool.query(
      "SELECT 1 FROM questions WHERE id = $1 AND lifecycle_status = 'PUBLISHED'",
      [questionId],
    );
    if (!exists.rowCount) throw notFoundError();
    const result = await pool.query(
      `INSERT INTO practice_progress (student_id, question_id, bookmarked, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, question_id) DO UPDATE SET
         bookmarked = EXCLUDED.bookmarked,
         status = EXCLUDED.status,
         updated_at = now(),
         version = practice_progress.version + 1
       RETURNING bookmarked, status, version, updated_at`,
      [studentId, questionId, input.bookmarked, input.status],
    );
    return { questionId, ...result.rows[0] };
  }

  async function createQuestion(actorId, input, correlationId) {
    if (input.lifecycleStatus === "PUBLISHED" && (!input.topicIds.length || !input.positionIds.length || !input.provenanceNote)) {
      throw new AppError({
        status: 422,
        code: "QUESTION_NOT_PUBLISHABLE",
        message: "Câu hỏi cần taxonomy và nguồn gốc hợp lệ trước khi công bố.",
        fieldErrors: { lifecycleStatus: "Thiếu taxonomy hoặc nguồn gốc" },
        recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      });
    }
    const questionId = await withTransaction(pool, async (client) => {
      const result = await client.query(
        `INSERT INTO questions (
           slug, title, content, answer_criteria, difficulty, lifecycle_status,
           source_name, source_url, provenance_note, created_by, published_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
           CASE WHEN $6 = 'PUBLISHED' THEN now() ELSE NULL END)
         RETURNING id`,
        [input.slug, input.title, input.content, input.answerCriteria, input.difficulty,
          input.lifecycleStatus, input.sourceName, input.sourceUrl, input.provenanceNote, actorId],
      );
      const questionId = result.rows[0].id;
      for (const topicId of input.topicIds) {
        await client.query("INSERT INTO question_topics (question_id, topic_id) VALUES ($1, $2)", [questionId, topicId]);
      }
      for (const positionId of input.positionIds) {
        await client.query("INSERT INTO question_positions (question_id, position_id) VALUES ($1, $2)", [questionId, positionId]);
      }
      await writeAudit(client, {
        actorId,
        action: "QUESTION_CREATED",
        targetType: "QUESTION",
        targetId: questionId,
        reason: input.moderationReason,
        correlationId,
      });
      return questionId;
    });
    return get({ id: questionId, actorId, includeAll: true });
  }

  async function changeLifecycle(actorId, questionId, input, correlationId) {
    await withTransaction(pool, async (client) => {
      const current = await client.query(
        `SELECT q.version, q.source_name, q.provenance_note,
          EXISTS (SELECT 1 FROM question_topics qt WHERE qt.question_id = q.id) AS has_topic,
          EXISTS (SELECT 1 FROM question_positions qp WHERE qp.question_id = q.id) AS has_position
         FROM questions q WHERE q.id = $1 FOR UPDATE`,
        [questionId],
      );
      if (!current.rowCount) throw notFoundError();
      const row = current.rows[0];
      if (row.version !== input.version) {
        throw new AppError({
          status: 409,
          code: "VERSION_CONFLICT",
          message: "Câu hỏi đã được cập nhật. Hãy tải lại trước khi quyết định.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      if (input.lifecycleStatus === "PUBLISHED" && (!row.has_topic || !row.has_position || !row.source_name || !row.provenance_note)) {
        throw new AppError({
          status: 422,
          code: "QUESTION_NOT_PUBLISHABLE",
          message: "Câu hỏi chưa đủ taxonomy hoặc nguồn gốc để công bố.",
          recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
        });
      }
      await client.query(
        `UPDATE questions SET lifecycle_status = $2, version = version + 1,
           updated_at = now(), published_at = CASE WHEN $2 = 'PUBLISHED' THEN coalesce(published_at, now()) ELSE published_at END
         WHERE id = $1`,
        [questionId, input.lifecycleStatus],
      );
      await writeAudit(client, {
        actorId,
        action: `QUESTION_${input.lifecycleStatus}`,
        targetType: "QUESTION",
        targetId: questionId,
        reason: input.reason,
        correlationId,
      });
    });
    return get({ id: questionId, actorId, includeAll: true });
  }

  return { list, get, listTaxonomy, updateProgress, createQuestion, changeLifecycle };
}
