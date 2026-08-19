import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { writeAudit } from "../../platform/audit.js";
import { createOperationCase } from "../../platform/operations.js";
import { createHash } from "node:crypto";

function normalizedContentHash(content) {
  return createHash("sha256").update(content.trim().replace(/\s+/g, " ").toLowerCase()).digest("hex");
}

function mapDuplicateContentError(error) {
  if (error?.code === "23505" && error?.constraint === "ux_questions_normalized_content_hash") {
    return new AppError({
      status: 409,
      code: "DUPLICATE_QUESTION_CONTENT",
      message: "Đã tồn tại câu hỏi có nội dung trùng lặp.",
      fieldErrors: { content: "Nội dung trùng với câu hỏi hiện có" },
      recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
    });
  }
  return error;
}

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
    topicIds: row.topic_ids ?? [],
    positionIds: row.position_ids ?? [],
    bookmarked: row.bookmarked ?? false,
    practiceStatus: row.practice_status ?? "NOT_STARTED",
    version: row.version,
  };
}

const questionProjection = `
  SELECT q.*,
    coalesce(array_agg(DISTINCT t.name) FILTER (WHERE t.id IS NOT NULL), '{}') AS topics,
    coalesce(array_agg(DISTINCT p.name) FILTER (WHERE p.id IS NOT NULL), '{}') AS positions,
    coalesce(array_agg(DISTINCT t.id) FILTER (WHERE t.id IS NOT NULL), '{}') AS topic_ids,
    coalesce(array_agg(DISTINCT p.id) FILTER (WHERE p.id IS NOT NULL), '{}') AS position_ids,
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
    const clauses = includeAll ? [] : [
      "q.lifecycle_status = 'PUBLISHED'",
      "length(trim(q.source_name)) > 0",
      "length(trim(q.provenance_note)) > 0",
      "EXISTS (SELECT 1 FROM question_topics pqt WHERE pqt.question_id = q.id)",
      "EXISTS (SELECT 1 FROM question_positions pqp WHERE pqp.question_id = q.id)",
    ];
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
         ${includeAll ? "" : `AND q.lifecycle_status = 'PUBLISHED'
           AND length(trim(q.source_name)) > 0 AND length(trim(q.provenance_note)) > 0
           AND EXISTS (SELECT 1 FROM question_topics pqt WHERE pqt.question_id = q.id)
           AND EXISTS (SELECT 1 FROM question_positions pqp WHERE pqp.question_id = q.id)`}
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
    return withTransaction(pool, async (client) => {
      const result = await client.query(
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
      await client.query(
        `UPDATE preparation_plan_items pi SET practice_status = $3, updated_at = now(), version = pi.version + 1
         FROM preparation_plans p
         WHERE pi.plan_id = p.id AND p.student_id = $1 AND pi.question_id = $2
           AND pi.practice_status <> $3`,
        [studentId, questionId, input.status],
      );
      return { questionId, ...result.rows[0] };
    });
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
    try {
      const questionId = await withTransaction(pool, async (client) => {
        const result = await client.query(
          `INSERT INTO questions (
             slug, title, content, answer_criteria, difficulty, lifecycle_status,
             source_name, source_url, provenance_note, created_by, published_at, normalized_content_hash
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
             CASE WHEN $6 = 'PUBLISHED' THEN now() ELSE NULL END, $11)
           RETURNING id`,
          [input.slug, input.title, input.content, JSON.stringify(input.answerCriteria), input.difficulty,
            input.lifecycleStatus, input.sourceName, input.sourceUrl, input.provenanceNote, actorId,
            normalizedContentHash(input.content)],
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
    } catch (error) {
      throw mapDuplicateContentError(error);
    }
  }

  async function updateQuestion(actorId, questionId, input, correlationId) {
    try {
      await withTransaction(pool, async (client) => {
      const current = await client.query(
        "SELECT version, lifecycle_status FROM questions WHERE id = $1 FOR UPDATE",
        [questionId],
      );
      if (!current.rowCount) throw notFoundError();
      if (current.rows[0].version !== input.version) {
        throw new AppError({ status: 409, code: "VERSION_CONFLICT", message: "Câu hỏi đã thay đổi. Hãy tải lại.", recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null } });
      }
      await client.query(
        `UPDATE questions SET slug = $2, title = $3, content = $4, answer_criteria = $5,
           difficulty = $6, source_name = $7, source_url = $8, provenance_note = $9,
           normalized_content_hash = $10, updated_at = now(), version = version + 1
         WHERE id = $1`,
        [questionId, input.slug, input.title, input.content, JSON.stringify(input.answerCriteria), input.difficulty,
          input.sourceName, input.sourceUrl ?? null, input.provenanceNote, normalizedContentHash(input.content)],
      );
      await client.query("DELETE FROM question_topics WHERE question_id = $1", [questionId]);
      await client.query("DELETE FROM question_positions WHERE question_id = $1", [questionId]);
      for (const topicId of input.topicIds) {
        await client.query("INSERT INTO question_topics(question_id, topic_id) VALUES ($1,$2)", [questionId, topicId]);
      }
      for (const positionId of input.positionIds) {
        await client.query("INSERT INTO question_positions(question_id, position_id) VALUES ($1,$2)", [questionId, positionId]);
      }
      await writeAudit(client, { actorId, action: "QUESTION_UPDATED", targetType: "QUESTION", targetId: questionId, reason: input.reason, correlationId });
      });
      return get({ id: questionId, actorId, includeAll: true });
    } catch (error) {
      throw mapDuplicateContentError(error);
    }
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
      const transitions = {
        DRAFT: new Set(["IN_REVIEW", "ARCHIVED"]),
        IN_REVIEW: new Set(["DRAFT", "PUBLISHED", "ARCHIVED"]),
        PUBLISHED: new Set(["ARCHIVED"]),
        ARCHIVED: new Set(["DRAFT"]),
      };
      const state = await client.query("SELECT lifecycle_status FROM questions WHERE id = $1", [questionId]);
      if (!transitions[state.rows[0].lifecycle_status]?.has(input.lifecycleStatus)) {
        throw new AppError({ status: 422, code: "INVALID_LIFECYCLE_TRANSITION", message: "Chuyển trạng thái câu hỏi không hợp lệ.", recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null } });
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
      if (input.lifecycleStatus === "IN_REVIEW") {
        await createOperationCase(client, {
          caseType: "QUESTION_MODERATION",
          targetType: "QUESTION",
          targetId: questionId,
          publicSummary: "Câu hỏi đang chờ kiểm duyệt nội dung và nguồn gốc.",
        });
      } else {
        await client.query(
          `UPDATE operation_cases SET status = 'RESOLVED', updated_at = now(), version = version + 1
           WHERE case_type = 'QUESTION_MODERATION' AND target_id = $1 AND status IN ('OPEN','IN_PROGRESS')`,
          [questionId],
        );
      }
    });
    return get({ id: questionId, actorId, includeAll: true });
  }

  async function listAdminTaxonomy() {
    const [versions, topics, positions, aliases] = await Promise.all([
      pool.query("SELECT id, version AS name, status, description, created_at AS \"createdAt\", row_version AS version FROM taxonomy_versions ORDER BY created_at DESC"),
      pool.query("SELECT id, slug, name, status, priority, version FROM topics ORDER BY priority, name"),
      pool.query("SELECT id, slug, name, status, priority, version FROM positions ORDER BY priority, name"),
      pool.query(`SELECT a.id, a.taxonomy_version_id AS "taxonomyVersionId", a.topic_id AS "topicId", a.alias, a.normalized_alias AS "normalizedAlias", t.name AS "topicName"
                  FROM topic_aliases a JOIN topics t ON t.id = a.topic_id ORDER BY a.alias`),
    ]);
    return { versions: versions.rows, topics: topics.rows, positions: positions.rows, aliases: aliases.rows };
  }

  async function createTaxonomyVersion(actorId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      if (input.status === "ACTIVE") await client.query("UPDATE taxonomy_versions SET status = 'ARCHIVED', row_version = row_version + 1 WHERE status = 'ACTIVE'");
      const result = await client.query(
        `INSERT INTO taxonomy_versions(version, status, description, created_by)
         VALUES ($1,$2,$3,$4) RETURNING id, version AS name, status, description, row_version AS version`,
        [input.name, input.status, input.description ?? null, actorId],
      );
      await writeAudit(client, { actorId, action: "TAXONOMY_VERSION_CREATED", targetType: "TAXONOMY_VERSION", targetId: result.rows[0].id, correlationId });
      return result.rows[0];
    });
  }

  async function updateTaxonomyVersion(actorId, id, input, correlationId) {
    return withTransaction(pool, async (client) => {
      if (input.status === "ACTIVE") await client.query("UPDATE taxonomy_versions SET status = 'ARCHIVED', row_version = row_version + 1 WHERE status = 'ACTIVE' AND id <> $1", [id]);
      const result = await client.query(
        `UPDATE taxonomy_versions SET status = $2, description = $3, row_version = row_version + 1
         WHERE id = $1 AND row_version = $4 RETURNING id, version AS name, status, description, row_version AS version`,
        [id, input.status, input.description ?? null, input.version],
      );
      if (!result.rowCount) throw new AppError({ status: 409, code: "VERSION_CONFLICT", message: "Taxonomy version đã thay đổi.", recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null } });
      await writeAudit(client, { actorId, action: "TAXONOMY_VERSION_UPDATED", targetType: "TAXONOMY_VERSION", targetId: id, reason: input.reason, correlationId });
      return result.rows[0];
    });
  }

  async function createTaxonomyItem(table, actorId, input, correlationId) {
    const targetType = table === "topics" ? "TOPIC" : "POSITION";
    return withTransaction(pool, async (client) => {
      const result = await client.query(
        `INSERT INTO ${table}(slug, name, priority) VALUES ($1,$2,$3)
         RETURNING id, slug, name, status, priority, version`,
        [input.slug, input.name, input.priority],
      );
      await writeAudit(client, { actorId, action: `${targetType}_CREATED`, targetType, targetId: result.rows[0].id, correlationId });
      return result.rows[0];
    });
  }

  async function updateTaxonomyItem(table, actorId, id, input, correlationId) {
    const targetType = table === "topics" ? "TOPIC" : "POSITION";
    return withTransaction(pool, async (client) => {
      const result = await client.query(
        `UPDATE ${table} SET name = $2, priority = $3, status = $4, updated_at = now(), version = version + 1
         WHERE id = $1 AND version = $5 RETURNING id, slug, name, status, priority, version`,
        [id, input.name, input.priority, input.status, input.version],
      );
      if (!result.rowCount) throw new AppError({ status: 409, code: "VERSION_CONFLICT", message: "Taxonomy item đã thay đổi.", recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null } });
      await writeAudit(client, { actorId, action: `${targetType}_UPDATED`, targetType, targetId: id, reason: input.reason, correlationId });
      return result.rows[0];
    });
  }

  async function createTopicAlias(actorId, input, correlationId) {
    const normalizedAlias = input.alias.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return withTransaction(pool, async (client) => {
      const result = await client.query(
        `INSERT INTO topic_aliases(taxonomy_version_id, topic_id, alias, normalized_alias)
         VALUES ($1,$2,$3,$4) RETURNING id, taxonomy_version_id AS "taxonomyVersionId", topic_id AS "topicId", alias, normalized_alias AS "normalizedAlias"`,
        [input.taxonomyVersionId, input.topicId, input.alias, normalizedAlias],
      );
      await writeAudit(client, { actorId, action: "TOPIC_ALIAS_CREATED", targetType: "TOPIC_ALIAS", targetId: result.rows[0].id, correlationId });
      return result.rows[0];
    });
  }

  async function deleteTopicAlias(actorId, aliasId, reason, correlationId) {
    await withTransaction(pool, async (client) => {
      const result = await client.query("DELETE FROM topic_aliases WHERE id = $1 RETURNING id", [aliasId]);
      if (!result.rowCount) throw notFoundError();
      await writeAudit(client, { actorId, action: "TOPIC_ALIAS_DELETED", targetType: "TOPIC_ALIAS", targetId: aliasId, reason, correlationId });
    });
  }

  return {
    list, get, listTaxonomy, updateProgress, createQuestion, updateQuestion, changeLifecycle,
    listAdminTaxonomy, createTaxonomyVersion, updateTaxonomyVersion,
    createTaxonomyItem, updateTaxonomyItem, createTopicAlias, deleteTopicAlias,
  };
}
