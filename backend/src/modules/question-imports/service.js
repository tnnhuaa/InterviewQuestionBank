import { createHash } from "node:crypto";
import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { writeAudit } from "../../platform/audit.js";
import { findIdempotentResult, saveIdempotentResult } from "../../platform/idempotency.js";

const expectedHeaders = [
  "slug", "title", "content", "answerCriteria", "difficulty", "topicSlugs",
  "positionSlugs", "sourceName", "sourceUrl", "provenanceNote",
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizedContentHash(content) {
  return sha256(content.trim().replace(/\s+/g, " ").toLowerCase());
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (quoted) throw new AppError({ status: 422, code: "CSV_UNCLOSED_QUOTE", message: "CSV có ô chưa đóng dấu ngoặc kép.", recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null } });
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

function splitList(value) {
  return [...new Set(value.split("|").map((item) => item.trim()).filter(Boolean))];
}

function batchDto(row) {
  return {
    id: row.id,
    fileName: row.file_name,
    status: row.status,
    totalRows: row.total_rows,
    validRows: row.valid_rows,
    invalidRows: row.invalid_rows,
    importedRows: row.imported_rows,
    version: row.version,
    createdAt: row.created_at,
    committedAt: row.committed_at,
  };
}

function rowDto(row) {
  return {
    id: row.id,
    rowNumber: row.row_number,
    status: row.status,
    payload: row.normalized_payload,
    errors: row.errors ?? [],
    questionId: row.question_id,
  };
}

export function createQuestionImportsService({ pool }) {
  async function getOwnedBatch(actorId, batchId, client = pool, lock = false) {
    const result = await client.query(
      `SELECT * FROM question_import_batches WHERE id = $1 AND actor_id = $2 ${lock ? "FOR UPDATE" : ""}`,
      [batchId, actorId],
    );
    if (!result.rowCount) throw notFoundError();
    return result.rows[0];
  }

  async function preview(actorId, file, correlationId) {
    if (!file?.buffer?.length) {
      throw new AppError({ status: 422, code: "CSV_EMPTY", message: "Hãy chọn tệp CSV có dữ liệu.", recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null } });
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new AppError({ status: 413, code: "CSV_TOO_LARGE", message: "CSV không được vượt quá 5 MB.", recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null } });
    }
    const fileHash = sha256(file.buffer);
    const existing = await pool.query(
      "SELECT * FROM question_import_batches WHERE actor_id = $1 AND file_hash = $2",
      [actorId, fileHash],
    );
    if (existing.rowCount) return get(actorId, existing.rows[0].id, { page: 1, pageSize: 100, status: undefined });

    const text = file.buffer.toString("utf8").replace(/^\uFEFF/, "");
    const parsed = parseCsv(text);
    if (parsed.length < 2) {
      throw new AppError({ status: 422, code: "CSV_EMPTY", message: "CSV phải có header và ít nhất một dòng dữ liệu.", recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null } });
    }
    if (parsed.length - 1 > 1000) {
      throw new AppError({ status: 413, code: "CSV_ROW_LIMIT", message: "CSV chỉ hỗ trợ tối đa 1.000 dòng dữ liệu.", recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null } });
    }
    const headers = parsed[0].map((item) => item.trim());
    if (headers.length !== expectedHeaders.length || headers.some((header, index) => header !== expectedHeaders[index])) {
      throw new AppError({
        status: 422,
        code: "CSV_HEADER_INVALID",
        message: `Header phải đúng thứ tự: ${expectedHeaders.join(",")}`,
        recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      });
    }

    const [topics, positions, existingQuestions] = await Promise.all([
      pool.query("SELECT id, slug FROM topics WHERE status = 'ACTIVE'"),
      pool.query("SELECT id, slug FROM positions WHERE status = 'ACTIVE'"),
      pool.query("SELECT slug, normalized_content_hash FROM questions"),
    ]);
    const topicMap = new Map(topics.rows.map((row) => [row.slug, row.id]));
    const positionMap = new Map(positions.rows.map((row) => [row.slug, row.id]));
    const databaseSlugs = new Set(existingQuestions.rows.map((row) => row.slug));
    const databaseHashes = new Set(existingQuestions.rows.map((row) => row.normalized_content_hash).filter(Boolean));
    const fileSlugs = new Set();
    const fileHashes = new Set();
    const normalizedRows = [];

    parsed.slice(1).forEach((columns, rowIndex) => {
      const rowNumber = rowIndex + 2;
      const errors = [];
      if (columns.length !== expectedHeaders.length) {
        errors.push({ field: "row", code: "COLUMN_COUNT", message: `Cần ${expectedHeaders.length} cột, nhận ${columns.length}.` });
      }
      const values = Object.fromEntries(expectedHeaders.map((header, index) => [header, (columns[index] ?? "").trim()]));
      const topicSlugs = splitList(values.topicSlugs);
      const positionSlugs = splitList(values.positionSlugs);
      const answerCriteria = splitList(values.answerCriteria);
      const contentHash = values.content ? normalizedContentHash(values.content) : null;
      for (const field of ["slug", "title", "content", "answerCriteria", "difficulty", "topicSlugs", "positionSlugs", "sourceName", "provenanceNote"]) {
        if (!values[field]) errors.push({ field, code: "REQUIRED", message: "Trường bắt buộc." });
      }
      if (values.slug && !/^[a-z0-9-]+$/.test(values.slug)) errors.push({ field: "slug", code: "FORMAT", message: "Slug chỉ gồm chữ thường, số và dấu gạch ngang." });
      if (values.difficulty && !["EASY", "MEDIUM", "HARD"].includes(values.difficulty)) errors.push({ field: "difficulty", code: "ENUM", message: "Chỉ nhận EASY, MEDIUM hoặc HARD." });
      if (values.sourceUrl) {
        try { new URL(values.sourceUrl); } catch { errors.push({ field: "sourceUrl", code: "URL", message: "URL không hợp lệ." }); }
      }
      topicSlugs.filter((slug) => !topicMap.has(slug)).forEach((slug) => errors.push({ field: "topicSlugs", code: "UNKNOWN_TAXONOMY", message: `Topic '${slug}' không tồn tại.` }));
      positionSlugs.filter((slug) => !positionMap.has(slug)).forEach((slug) => errors.push({ field: "positionSlugs", code: "UNKNOWN_TAXONOMY", message: `Position '${slug}' không tồn tại.` }));
      if (databaseSlugs.has(values.slug) || fileSlugs.has(values.slug)) errors.push({ field: "slug", code: "DUPLICATE", message: "Slug đã tồn tại trong file hoặc Question Bank." });
      if (contentHash && (databaseHashes.has(contentHash) || fileHashes.has(contentHash))) errors.push({ field: "content", code: "DUPLICATE", message: "Nội dung trùng câu hỏi đã có hoặc dòng trước." });
      fileSlugs.add(values.slug);
      if (contentHash) fileHashes.add(contentHash);
      normalizedRows.push({
        rowNumber,
        contentHash,
        status: errors.length ? "INVALID" : "VALID",
        errors,
        payload: {
          slug: values.slug,
          title: values.title,
          content: values.content,
          answerCriteria,
          difficulty: values.difficulty,
          topicSlugs,
          topicIds: topicSlugs.map((slug) => topicMap.get(slug)).filter(Boolean),
          positionSlugs,
          positionIds: positionSlugs.map((slug) => positionMap.get(slug)).filter(Boolean),
          sourceName: values.sourceName,
          sourceUrl: values.sourceUrl || null,
          provenanceNote: values.provenanceNote,
        },
      });
    });

    const batchId = await withTransaction(pool, async (client) => {
      const validRows = normalizedRows.filter((row) => row.status === "VALID").length;
      const batch = await client.query(
        `INSERT INTO question_import_batches(actor_id, file_name, file_hash, total_rows, valid_rows, invalid_rows)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [actorId, file.originalname || "questions.csv", fileHash, normalizedRows.length, validRows, normalizedRows.length - validRows],
      );
      for (const row of normalizedRows) {
        await client.query(
          `INSERT INTO question_import_rows(batch_id, row_number, normalized_payload, content_hash, status, errors)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [batch.rows[0].id, row.rowNumber, row.payload, row.contentHash, row.status, JSON.stringify(row.errors)],
        );
      }
      await writeAudit(client, { actorId, action: "QUESTION_IMPORT_PREVIEWED", targetType: "QUESTION_IMPORT", targetId: batch.rows[0].id, correlationId, metadata: { totalRows: normalizedRows.length, validRows } });
      return batch.rows[0].id;
    });
    return get(actorId, batchId, { page: 1, pageSize: 100, status: undefined });
  }

  async function get(actorId, batchId, { page, pageSize, status }) {
    const batch = await getOwnedBatch(actorId, batchId);
    const values = [batchId];
    let statusClause = "";
    if (status) {
      values.push(status);
      statusClause = `AND status = $${values.length}`;
    }
    values.push(pageSize, (page - 1) * pageSize);
    const [rows, count] = await Promise.all([
      pool.query(`SELECT * FROM question_import_rows WHERE batch_id = $1 ${statusClause} ORDER BY row_number LIMIT $${values.length - 1} OFFSET $${values.length}`, values),
      pool.query(`SELECT count(*)::int AS total FROM question_import_rows WHERE batch_id = $1 ${statusClause}`, values.slice(0, -2)),
    ]);
    return { ...batchDto(batch), rows: rows.rows.map(rowDto), pageInfo: { page, pageSize, total: count.rows[0].total } };
  }

  async function commit(actorId, batchId, input, idempotencyKey, correlationId) {
    return withTransaction(pool, async (client) => {
      const operation = "QUESTION_IMPORT_COMMIT";
      const idempotency = await findIdempotentResult(client, { actorId, operation, key: idempotencyKey, input: { batchId, ...input } });
      if (idempotency.cached) return idempotency.cached.response_body;
      const batch = await getOwnedBatch(actorId, batchId, client, true);
      if (batch.version !== input.version) throw new AppError({ status: 409, code: "VERSION_CONFLICT", message: "Preview đã thay đổi. Hãy tải lại trước khi import.", recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null } });
      if (batch.committed_at) throw new AppError({ status: 409, code: "IMPORT_ALREADY_COMMITTED", message: "Batch này đã được import.", recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null } });
      const rows = await client.query("SELECT * FROM question_import_rows WHERE batch_id = $1 AND status = 'VALID' ORDER BY row_number FOR UPDATE", [batchId]);
      let imported = 0;
      for (const row of rows.rows) {
        const savepoint = `import_row_${row.row_number}`;
        await client.query(`SAVEPOINT ${savepoint}`);
        try {
          const payload = row.normalized_payload;
          const question = await client.query(
            `INSERT INTO questions(slug, title, content, answer_criteria, difficulty, lifecycle_status,
               source_name, source_url, provenance_note, created_by, normalized_content_hash)
             VALUES ($1,$2,$3,$4,$5,'DRAFT',$6,$7,$8,$9,$10) RETURNING id`,
            [payload.slug, payload.title, payload.content, JSON.stringify(payload.answerCriteria), payload.difficulty,
              payload.sourceName, payload.sourceUrl, payload.provenanceNote, actorId, row.content_hash],
          );
          for (const topicId of payload.topicIds) await client.query("INSERT INTO question_topics(question_id, topic_id) VALUES ($1,$2)", [question.rows[0].id, topicId]);
          for (const positionId of payload.positionIds) await client.query("INSERT INTO question_positions(question_id, position_id) VALUES ($1,$2)", [question.rows[0].id, positionId]);
          await client.query("UPDATE question_import_rows SET status = 'IMPORTED', question_id = $2, imported_at = now() WHERE id = $1", [row.id, question.rows[0].id]);
          imported += 1;
          await client.query(`RELEASE SAVEPOINT ${savepoint}`);
        } catch (error) {
          await client.query(`ROLLBACK TO SAVEPOINT ${savepoint}`);
          await client.query(
            `UPDATE question_import_rows SET status = 'SKIPPED', errors = $2 WHERE id = $1`,
            [row.id, JSON.stringify([{ field: "row", code: "COMMIT_CONFLICT", message: "Dữ liệu đã thay đổi sau preview; dòng được bỏ qua an toàn." }])],
          );
          await client.query(`RELEASE SAVEPOINT ${savepoint}`);
          if (!["23505", "23503"].includes(error.code)) throw error;
        }
      }
      const result = await client.query(
        `UPDATE question_import_batches SET imported_rows = $2,
           status = CASE WHEN $2 = valid_rows AND invalid_rows = 0 THEN 'IMPORTED' ELSE 'PARTIALLY_IMPORTED' END,
           committed_at = now(), version = version + 1 WHERE id = $1 RETURNING *`,
        [batchId, imported],
      );
      await writeAudit(client, { actorId, action: "QUESTION_IMPORT_COMMITTED", targetType: "QUESTION_IMPORT", targetId: batchId, reason: input.reason, correlationId, metadata: { importedRows: imported, validRows: batch.valid_rows } });
      const body = batchDto(result.rows[0]);
      await saveIdempotentResult(client, { actorId, operation, key: idempotencyKey, digest: idempotency.digest, status: 200, body, resourceId: batchId });
      return body;
    });
  }

  async function errorCsv(actorId, batchId) {
    await getOwnedBatch(actorId, batchId);
    const rows = await pool.query("SELECT row_number, errors FROM question_import_rows WHERE batch_id = $1 AND status IN ('INVALID','SKIPPED') ORDER BY row_number", [batchId]);
    const lines = ["rowNumber,field,code,message"];
    for (const row of rows.rows) {
      for (const error of row.errors) {
        const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
        lines.push([row.row_number, error.field, error.code, error.message].map(escape).join(","));
      }
    }
    return lines.join("\r\n");
  }

  return { preview, get, commit, errorCsv };
}
