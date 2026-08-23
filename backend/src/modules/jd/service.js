import { createHash } from "node:crypto";
import { fileTypeFromBuffer } from "file-type";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { findIdempotentResult, saveIdempotentResult } from "../../platform/idempotency.js";
import { writeAudit } from "../../platform/audit.js";
import { createAiJob } from "../ai/jobs.js";
import { scoreQuestionMatch } from "./matcher.js";

const allowedTypes = new Map([
  ["application/pdf", "PDF"],
  ["image/png", "IMAGE"],
  ["image/jpeg", "IMAGE"],
]);

function invalidDocumentError(cause) {
  return new AppError({
    status: 422,
    code: "INVALID_DOCUMENT_BYTES",
    message: "Không thể đọc cấu trúc tệp đã chọn. Hãy xuất lại PNG/JPEG/PDF rồi tải lên lần nữa.",
    recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
    cause,
  });
}

async function detectDocumentType(buffer) {
  try {
    return await fileTypeFromBuffer(buffer);
  } catch (error) {
    throw invalidDocumentError(error);
  }
}

function storageUnavailableError(cause) {
  return new AppError({
    status: 503,
    code: "STORAGE_UNAVAILABLE",
    message: "Không thể lưu tệp vào private storage. Hãy kiểm tra cấu hình storage rồi thử lại an toàn.",
    recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: 10 },
    cause,
  });
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function nullableNumber(value) {
  return value === null || value === undefined ? null : Number(value);
}

function nullableIsoDate(value) {
  return value === null || value === undefined ? null : new Date(value).toISOString();
}

function normalize(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function validatePdf(buffer) {
  let loadingTask;
  let document;
  try {
    loadingTask = getDocument({ data: new Uint8Array(buffer), isEvalSupported: false });
    document = await loadingTask.promise;
    if (document.numPages > 5) {
      throw new AppError({ status: 422, code: "PDF_PAGE_LIMIT", message: "PDF chỉ được có tối đa 5 trang.", recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null } });
    }
    const attachments = await document.getAttachments();
    if (attachments && Object.keys(attachments).length) {
      throw new AppError({ status: 422, code: "PDF_EMBEDDED_FILES", message: "PDF có tệp đính kèm nhúng nên không thể xử lý an toàn.", recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null } });
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    const encrypted = error?.name === "PasswordException" || /password/i.test(error?.message ?? "");
    throw new AppError({
      status: 422,
      code: encrypted ? "PDF_ENCRYPTED" : "PDF_MALFORMED",
      message: encrypted ? "PDF có mật khẩu hoặc bị mã hóa. Hãy tải bản không mã hóa." : "PDF bị hỏng hoặc không đúng định dạng.",
      recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
    });
  } finally {
    await loadingTask?.destroy();
  }
}

function jdDto(row) {
  return {
    id: row.id,
    title: row.title,
    sourceType: row.source_type,
    status: row.status,
    extractedText: row.extracted_text,
    correctedText: row.corrected_text,
    correctedVersion: row.corrected_version,
    confirmedAt: nullableIsoDate(row.confirmed_at),
    extractionMethod: row.extraction_method,
    extractionConfidence: nullableNumber(row.confidence),
    processing: row.job_status ? {
      id: row.job_id,
      status: row.job_status,
      attemptCount: row.attempt_count,
      errorCode: row.error_code,
    } : null,
    createdAt: nullableIsoDate(row.created_at),
    updatedAt: nullableIsoDate(row.updated_at),
    version: row.version,
  };
}

function defaultJdTitle(sourceType) {
  const sourceLabel = sourceType === "PDF"
    ? "JD từ tệp PDF"
    : sourceType === "IMAGE"
      ? "JD từ hình ảnh"
      : "JD dạng văn bản";
  return `${sourceLabel} · ${new Date().toISOString().slice(0, 10)}`;
}

export function createJdService({ pool, storage, environment }) {
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

  async function createFromText(studentId, text, key) {
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
    return withTransaction(pool, async (client) => {
      const operation = "CREATE_TEXT_JD";
      const state = await findIdempotentResult(client, {
        actorId: studentId,
        operation,
        key,
        input: { textHash: sha256(cleaned), length: cleaned.length },
      });
      if (state.cached?.response_body) return state.cached.response_body;
      const result = await client.query(
        `INSERT INTO job_descriptions (
           student_id, title, source_type, status, extracted_text, corrected_text,
           corrected_version, extraction_method, extraction_version
         ) VALUES ($1, $2, 'PASTED_TEXT', 'READY_FOR_REVIEW', $3, $3, 1, 'PASTED_TEXT', 'extract-v1')
         RETURNING *`,
        [studentId, defaultJdTitle("PASTED_TEXT"), cleaned],
      );
      await client.query(
        `INSERT INTO jd_text_versions (job_description_id, version, corrected_text, created_by)
         VALUES ($1, 1, $2, $3)`,
        [result.rows[0].id, cleaned, studentId],
      );
      const body = jdDto(result.rows[0]);
      await saveIdempotentResult(client, {
        actorId: studentId,
        operation,
        key,
        digest: state.digest,
        status: 201,
        body,
        resourceId: body.id,
      });
      return body;
    });
  }

  async function createFromFile(studentId, file, key) {
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
    const detected = await detectDocumentType(file.buffer);
    const sourceType = allowedTypes.get(detected?.mime);
    if (!sourceType) {
      throw new AppError({
        status: 415,
        code: "UNSUPPORTED_DOCUMENT",
        message: "Chỉ hỗ trợ PDF, PNG hoặc JPEG hợp lệ.",
        recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
      });
    }
    if (detected.mime === "application/pdf") await validatePdf(file.buffer);
    const contentHash = sha256(file.buffer);
    let objectKey = null;
    try {
      return await withTransaction(pool, async (client) => {
        const operation = "CREATE_FILE_JD";
        const state = await findIdempotentResult(client, {
          actorId: studentId,
          operation,
          key,
          input: { contentHash, size: file.size, mimeType: detected.mime },
        });
        if (state.cached?.response_body) return state.cached.response_body;
        const quota = await client.query(
          `SELECT count(*)::int AS count FROM job_descriptions
           WHERE student_id = $1 AND source_type IN ('PDF','IMAGE')
             AND created_at >= now() - interval '24 hours'`,
          [studentId],
        );
        if (quota.rows[0].count >= 20) {
          throw new AppError({
            status: 429,
            code: "JD_UPLOAD_QUOTA_REACHED",
            message: "Bạn đã dùng hết 20 lượt upload trong 24 giờ. Có thể dán nội dung JD để tiếp tục ngay.",
            recovery: { kind: "PASTE_TEXT", retryable: false, retryAfterSeconds: 3600 },
          });
        }
        try {
          objectKey = await storage.put(file.buffer, { contentType: detected.mime });
        } catch (error) {
          throw storageUnavailableError(error);
        }
        const result = await client.query(
          `INSERT INTO job_descriptions (
             student_id, title, source_type, original_file_ref, original_mime_type,
             original_size_bytes, original_content_hash, original_delete_after, status
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, now() + interval '24 hours', 'DRAFT')
           RETURNING *`,
          [studentId, defaultJdTitle(sourceType), sourceType, objectKey, detected.mime, file.size, contentHash],
        );
        const body = jdDto(result.rows[0]);
        await saveIdempotentResult(client, {
          actorId: studentId,
          operation,
          key,
          digest: state.digest,
          status: 201,
          body,
          resourceId: body.id,
        });
        return body;
      });
    } catch (error) {
      if (objectKey) {
        try {
          await storage.delete(objectKey);
        } catch {
          // Preserve the actionable upload/database error; readiness will surface cleanup storage failures.
        }
      }
      throw error;
    }
  }

  async function extractFromFileWithAi(studentId, file, aiProvider) {
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

    let extractedText = "";

    if (detected.mime === "application/pdf") {
      // PDF: thử trích text trực tiếp trước (pdfjs), nếu không có thì dùng Gemini vision
      if (detected.mime === "application/pdf") await validatePdf(file.buffer);
      const { getDocument: getPdfDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
      const pdfDoc = await getPdfDocument({ data: new Uint8Array(file.buffer), isEvalSupported: false }).promise;
      const pages = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => item.str).join(" ").trim());
      }
      await pdfDoc.destroy().catch(() => {});
      const directText = pages.join("\n\n").trim();
      if (directText.length >= 50) {
        extractedText = directText;
      } else {
        // PDF scan: dùng Gemini để OCR
        extractedText = await aiProvider.extractTextFromFile({ buffer: file.buffer, mimeType: detected.mime });
      }
    } else {
      // Ảnh PNG/JPEG: gửi trực tiếp lên Gemini để OCR
      extractedText = await aiProvider.extractTextFromFile({ buffer: file.buffer, mimeType: detected.mime });
    }

    if (!extractedText.trim()) {
      throw new AppError({
        status: 422,
        code: "EMPTY_EXTRACTION",
        message: "Không thể đọc được nội dung từ tệp này. Hãy thử tệp khác hoặc dán văn bản thủ công.",
        recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
      });
    }

    const result = await pool.query(
      `INSERT INTO job_descriptions (
         student_id, source_type, original_mime_type,
         original_size_bytes, original_content_hash,
         extracted_text, corrected_text, corrected_version,
         extraction_method, extraction_version,
         status, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $6, 1, 'OCR', 'extract-v1', 'READY_FOR_REVIEW', now())
       RETURNING *`,
      [studentId, sourceType, detected.mime, file.size, sha256(file.buffer), extractedText.trim()],
    );
    await pool.query(
      `INSERT INTO jd_text_versions (job_description_id, version, corrected_text, created_by)
       VALUES ($1, 1, $2, $3) ON CONFLICT DO NOTHING`,
      [result.rows[0].id, extractedText.trim(), studentId],
    );
    return jdDto(result.rows[0]);
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

  async function updateJobDescription(studentId, id, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const current = await getOwned(studentId, id, client);
      if (current.version !== input.version) {
        throw new AppError({
          status: 409,
          code: "VERSION_CONFLICT",
          message: "JD đã được cập nhật ở nơi khác. Hãy tải lại danh sách trước khi lưu.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      const result = await client.query(
        `UPDATE job_descriptions
         SET title = $3, updated_at = now(), version = version + 1
         WHERE id = $1 AND student_id = $2
         RETURNING *`,
        [id, studentId, input.title.trim()],
      );
      await writeAudit(client, {
        actorId: studentId,
        action: "JOB_DESCRIPTION_RENAMED",
        targetType: "JOB_DESCRIPTION",
        targetId: id,
        correlationId,
      });
      return jdDto(result.rows[0]);
    });
  }

  async function archiveJobDescription(studentId, id, version, correlationId) {
    return withTransaction(pool, async (client) => {
      const current = await getOwned(studentId, id, client);
      if (current.status === "ARCHIVED") return jdDto(current);
      if (current.version !== version) {
        throw new AppError({
          status: 409,
          code: "VERSION_CONFLICT",
          message: "JD đã được cập nhật ở nơi khác. Hãy tải lại danh sách trước khi xóa.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      const result = await client.query(
        `UPDATE job_descriptions
         SET status = 'ARCHIVED', original_delete_after = CASE
               WHEN original_file_ref IS NULL THEN original_delete_after ELSE now()
             END,
             updated_at = now(), version = version + 1
         WHERE id = $1 AND student_id = $2
         RETURNING *`,
        [id, studentId],
      );
      const plans = await client.query(
        `UPDATE preparation_plans
         SET status = 'ARCHIVED', updated_at = now(), version = version + 1
         WHERE job_description_id = $1 AND student_id = $2 AND status = 'ACTIVE'
         RETURNING id`,
        [id, studentId],
      );
      await writeAudit(client, {
        actorId: studentId,
        action: "JOB_DESCRIPTION_ARCHIVED",
        targetType: "JOB_DESCRIPTION",
        targetId: id,
        correlationId,
        metadata: { archivedPlanIds: plans.rows.map((plan) => plan.id) },
      });
      return jdDto(result.rows[0]);
    });
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
      if (["PENDING", "PROCESSING"].includes(jd.job_status)) {
        const body = jdDto(jd);
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
      }
      if (jd.job_status === "SUCCEEDED" || ["READY_FOR_REVIEW", "CONFIRMED", "ANALYZED"].includes(jd.status)) {
        const body = jdDto(jd);
        await saveIdempotentResult(client, {
          actorId: studentId,
          operation: "START_EXTRACTION",
          key,
          digest: state.digest,
          status: 200,
          body,
          resourceId: id,
        });
        return body;
      }
      if (jd.job_status === "FAILED") {
        throw new AppError({
          status: 409,
          code: "EXTRACTION_RETRY_REQUIRED",
          message: "Lần trích xuất trước đã thất bại. Hãy dùng thao tác thử lại an toàn hoặc dán văn bản thủ công.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      const job = await client.query(
        `INSERT INTO extraction_jobs (job_description_id, input_hash, extraction_version)
         VALUES ($1, $2, 'extract-v1')
         ON CONFLICT (job_description_id, input_hash, extraction_version)
         DO UPDATE SET available_at = least(extraction_jobs.available_at, now())
         RETURNING id, status, attempt_count`,
        [id, jd.original_content_hash],
      );
      const updated = await client.query(
        "UPDATE job_descriptions SET status = 'EXTRACTING', updated_at = now(), version = version + 1 WHERE id = $1 RETURNING *",
        [id],
      );
      const body = jdDto({
        ...updated.rows[0],
        job_id: job.rows[0].id,
        job_status: job.rows[0].status,
        attempt_count: job.rows[0].attempt_count,
        error_code: null,
      });
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
    return withTransaction(pool, async (client) => {
      const current = await getOwned(studentId, id, client);
      const operation = "RETRY_EXTRACTION";
      const state = await findIdempotentResult(client, {
        actorId: studentId,
        operation,
        key,
        input: { id, jobId: current.job_id, attemptCount: current.attempt_count },
      });
      if (state.cached?.response_body) return state.cached.response_body;
      if (current.job_status !== "FAILED") {
        const body = jdDto(current);
        await saveIdempotentResult(client, {
          actorId: studentId,
          operation,
          key,
          digest: state.digest,
          status: 202,
          body,
          resourceId: id,
        });
        return body;
      }
      if (current.attempt_count >= environment.ocr.maxAttempts) {
        throw new AppError({
          status: 409,
          code: "EXTRACTION_RETRY_LIMIT",
          message: "Đã hết lượt xử lý tự động. Bạn có thể dán nội dung JD để tiếp tục.",
          recovery: { kind: "PASTE_TEXT", retryable: false, retryAfterSeconds: null },
        });
      }
      await client.query(
        `UPDATE extraction_jobs SET status = 'PENDING', error_code = NULL, available_at = now()
         WHERE id = $1`,
        [current.job_id],
      );
      const updated = await client.query(
        "UPDATE job_descriptions SET status = 'EXTRACTING', updated_at = now(), version = version + 1 WHERE id = $1 RETURNING *",
        [id],
      );
      const body = jdDto({ ...updated.rows[0], job_id: current.job_id, job_status: "PENDING", attempt_count: current.attempt_count, error_code: null });
      await saveIdempotentResult(client, {
        actorId: studentId,
        operation,
        key,
        digest: state.digest,
        status: 202,
        body,
        resourceId: id,
      });
      return body;
    });
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
           AND status <> 'ARCHIVED'
         RETURNING *`,
        [id, studentId, cleaned, version],
      );
      if (!result.rowCount) {
        const current = await getOwned(studentId, id, client);
        if (current.status === "ARCHIVED") {
          throw new AppError({
            status: 409,
            code: "RESOURCE_ARCHIVED",
            message: "JD này đã được lưu trữ và chỉ còn ở chế độ xem lịch sử.",
            recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
          });
        }
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
         AND corrected_text IS NOT NULL AND status <> 'ARCHIVED'
       RETURNING *`,
      [id, studentId, version],
    );
    if (!result.rowCount) {
      const current = await getOwned(studentId, id);
      if (current.status === "ARCHIVED") {
        throw new AppError({
          status: 409,
          code: "RESOURCE_ARCHIVED",
          message: "JD này đã được lưu trữ và chỉ còn ở chế độ xem lịch sử.",
          recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
        });
      }
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

  async function startAiAnalysis(studentId, id, correctedTextVersion, correlationId, key) {
    return withTransaction(pool, async (client) => {
      const jd = await getOwned(studentId, id, client);
      const idempotency = await findIdempotentResult(client, {
        actorId: studentId,
        operation: "START_AI_JD_ANALYSIS",
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
      const job = await createAiJob(client, {
        actorId: studentId,
        kind: "JD_ANALYSIS",
        resourceType: "JOB_DESCRIPTION",
        resourceId: id,
        input: { correctedText: jd.corrected_text, correctedTextVersion },
        promptVersion: "jd-analysis-v1",
        schemaVersion: "jd-analysis-schema-v1",
        correlationId,
        environment,
      });
      await saveIdempotentResult(client, {
        actorId: studentId,
        operation: "START_AI_JD_ANALYSIS",
        key,
        digest: idempotency.digest,
        status: 202,
        body: job,
        resourceId: job.id,
      });
      return job;
    });
  }

  async function saveAiAnalysis(studentId, id, correctedTextVersion, requirements, aiJob, correlationId) {
    return withTransaction(pool, async (client) => {
      const jd = await getOwned(studentId, id, client);
      if (jd.status !== "CONFIRMED" || jd.corrected_version !== correctedTextVersion) {
        throw Object.assign(new Error("AI_INPUT_VERSION_STALE"), { code: "AI_INPUT_VERSION_STALE", retryable: false });
      }
      const taxonomyVersion = await client.query(
        "SELECT id FROM taxonomy_versions WHERE status = 'ACTIVE' ORDER BY created_at DESC LIMIT 1",
      );
      if (!taxonomyVersion.rowCount) throw new Error("No active taxonomy version");
      const next = await client.query(
        "SELECT coalesce(max(analysis_version), 0)::int + 1 AS version FROM jd_requirements WHERE job_description_id = $1",
        [id],
      );
      const analysisVersion = next.rows[0].version;
      const inserted = [];
      for (const requirement of requirements) {
        const result = await client.query(
          `INSERT INTO jd_requirements (
             job_description_id, analysis_version, raw_text, source_start, source_end,
             requirement_type, normalized_topic_id, confidence, rule_evidence,
             corrected_text_version, taxonomy_version_id
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
          [id, analysisVersion, requirement.rawText, requirement.sourceStart,
            requirement.sourceEnd, requirement.requirementType, requirement.topicId,
            requirement.confidence, { source: "GEMINI", aiJobId: aiJob.id, promptVersion: aiJob.prompt_version },
            correctedTextVersion, taxonomyVersion.rows[0].id],
        );
        inserted.push(result.rows[0]);
      }
      await client.query(
        "UPDATE job_descriptions SET status = 'ANALYZED', updated_at = now(), version = version + 1 WHERE id = $1",
        [id],
      );
      await writeAudit(client, {
        actorId: studentId,
        action: "JD_ANALYZED_WITH_AI",
        targetType: "JOB_DESCRIPTION",
        targetId: id,
        metadata: { analysisVersion, requirementCount: inserted.length, aiJobId: aiJob.id },
        correlationId,
      });
      return { jobDescriptionId: id, analysisVersion, requirements: inserted };
    });
  }

  async function analyze(studentId, id, correctedTextVersion, correlationId, key, provenance = {}) {
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
      const taxonomyVersion = await client.query(
        "SELECT id FROM taxonomy_versions WHERE status = 'ACTIVE' ORDER BY created_at DESC LIMIT 1",
      );
      if (!taxonomyVersion.rowCount) throw new Error("No active taxonomy version");
      const taxonomy = await client.query(
        `SELECT t.id, t.name, t.slug,
          coalesce(array_agg(ta.alias) FILTER (WHERE ta.id IS NOT NULL), '{}') AS aliases
         FROM topics t
         LEFT JOIN topic_aliases ta ON ta.topic_id = t.id AND ta.taxonomy_version_id = $1
         WHERE t.status = 'ACTIVE'
         GROUP BY t.id ORDER BY t.priority, t.id`,
        [taxonomyVersion.rows[0].id],
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
        const sourceStart = jd.corrected_text.toLocaleLowerCase("vi-VN")
          .indexOf(String(item.matchedTerm).toLocaleLowerCase("vi-VN"));
        const result = await client.query(
          `INSERT INTO jd_requirements (
             job_description_id, analysis_version, raw_text, source_start, source_end, requirement_type,
             normalized_topic_id, confidence, rule_evidence, corrected_text_version, taxonomy_version_id
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING id, raw_text, source_start, source_end, requirement_type, normalized_topic_id, confidence`,
          [id, analysisVersion, item.matchedTerm, sourceStart >= 0 ? sourceStart : null,
            sourceStart >= 0 ? sourceStart + String(item.matchedTerm).length : null,
            item.type ?? "SKILL", item.topic?.id ?? null,
            item.topic ? 0.95 : 0.75, {
               source: "RULE_BASED",
               rule: item.topic ? "taxonomy_alias" : "pilot_dictionary",
               fallbackUsed: Boolean(provenance.fallbackUsed),
               ...(provenance.aiJobId ? { aiJobId: provenance.aiJobId } : {}),
               ...(provenance.errorCode ? { fallbackErrorCode: provenance.errorCode } : {}),
             },
            correctedTextVersion, taxonomyVersion.rows[0].id],
        );
        requirements.push({
          ...result.rows[0],
          confidence: nullableNumber(result.rows[0].confidence),
          source: "RULE_BASED",
        });
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
      const body = {
        jobDescriptionId: id,
        analysisVersion,
        analysisSource: "RULE_BASED",
        fallbackUsed: Boolean(provenance.fallbackUsed),
        aiJobId: provenance.aiJobId ?? null,
        fallbackErrorCode: provenance.errorCode ?? null,
        requirements,
      };
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
           ) VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (requirement_id, mapping_input_version)
           DO UPDATE SET topic_id = EXCLUDED.topic_id, actor_id = EXCLUDED.actor_id,
             reason = EXCLUDED.reason, created_at = now()`,
          [item.requirementId, item.topicId, studentId, item.reason, input.mappingInputVersion],
        );
      }
      return { jobDescriptionId: id, ...input };
    });
  }

  async function decideRequirement(studentId, id, requirementId, input, correlationId) {
    await withTransaction(pool, async (client) => {
      await getOwned(studentId, id, client);
      const requirementResult = await client.query(
        `SELECT id, normalized_topic_id FROM jd_requirements
         WHERE id = $1 AND job_description_id = $2 AND analysis_version = $3 FOR UPDATE`,
        [requirementId, id, input.analysisVersion],
      );
      if (!requirementResult.rowCount) throw notFoundError();
      const requirement = requirementResult.rows[0];
      const selectedTopicId = input.decision === "UNMAPPED"
        ? null
        : input.topicId ?? requirement.normalized_topic_id;
      if (input.decision !== "UNMAPPED" && !selectedTopicId) {
        throw new AppError({
          status: 422,
          code: "REQUIREMENT_TOPIC_REQUIRED",
          message: "Hãy chọn một chủ đề hoặc đánh dấu yêu cầu là chưa ánh xạ.",
          fieldErrors: { topicId: "Chọn chủ đề hoặc chọn Chưa ánh xạ" },
          recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
        });
      }
      if (selectedTopicId) {
        const topic = await client.query("SELECT id FROM topics WHERE id = $1 AND status = 'ACTIVE'", [selectedTopicId]);
        if (!topic.rowCount) {
          throw new AppError({
            status: 422,
            code: "TOPIC_NOT_ACTIVE",
            message: "Chủ đề đã chọn không còn hoạt động. Hãy chọn chủ đề khác.",
            fieldErrors: { topicId: "Chọn một chủ đề đang hoạt động" },
            recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
          });
        }
      }
      await client.query(
        `INSERT INTO ai_requirement_decisions (
           requirement_id, student_id, decision, selected_topic_id, reason, analysis_version
         ) VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (requirement_id, student_id)
         DO UPDATE SET decision = EXCLUDED.decision, selected_topic_id = EXCLUDED.selected_topic_id,
           reason = EXCLUDED.reason, analysis_version = EXCLUDED.analysis_version, created_at = now()`,
        [requirementId, studentId, input.decision, selectedTopicId, input.reason ?? null, input.analysisVersion],
      );
      await client.query(
        `INSERT INTO requirement_normalization_overrides (
           requirement_id, topic_id, actor_id, reason, mapping_input_version
         ) VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (requirement_id, mapping_input_version)
         DO UPDATE SET topic_id = EXCLUDED.topic_id, actor_id = EXCLUDED.actor_id,
           reason = EXCLUDED.reason, created_at = now()`,
        [requirementId, selectedTopicId, studentId,
          input.reason ?? `Student ${input.decision.toLowerCase()} AI suggestion`, input.analysisVersion],
      );
      await writeAudit(client, {
        actorId: studentId,
        action: "AI_REQUIREMENT_DECIDED",
        targetType: "JD_REQUIREMENT",
        targetId: requirementId,
        metadata: { jobDescriptionId: id, analysisVersion: input.analysisVersion, decision: input.decision },
        correlationId,
      });
    });
    return getAnalysis(studentId, id, input.analysisVersion);
  }

  async function getAnalysis(studentId, id, analysisVersion) {
    const jd = await getOwned(studentId, id);
    const versionResult = analysisVersion
      ? { rows: [{ version: analysisVersion }] }
      : await pool.query(
        "SELECT max(analysis_version)::int AS version FROM jd_requirements WHERE job_description_id = $1 AND corrected_text_version = $2",
        [id, jd.corrected_version],
      );
    const version = versionResult.rows[0]?.version;
    if (!version) throw notFoundError();
    const result = await pool.query(
      `SELECT r.id, r.raw_text, r.source_start, r.source_end, r.requirement_type,
              r.normalized_topic_id, r.confidence, coalesce(r.rule_evidence->>'source', 'RULE_BASED') AS source,
              coalesce((r.rule_evidence->>'fallbackUsed')::boolean, false) AS fallback_used,
              r.rule_evidence->>'aiJobId' AS ai_job_id,
              r.rule_evidence->>'fallbackErrorCode' AS fallback_error_code,
              coalesce((SELECT o.topic_id FROM requirement_normalization_overrides o
                        WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1), r.normalized_topic_id) AS effective_topic_id,
              t.name AS topic_name, d.decision, d.selected_topic_id AS decision_topic_id
       FROM jd_requirements r
       LEFT JOIN ai_requirement_decisions d ON d.requirement_id = r.id AND d.student_id = $3
       LEFT JOIN topics t ON t.id = coalesce((SELECT o.topic_id FROM requirement_normalization_overrides o
                        WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1), r.normalized_topic_id)
       WHERE r.job_description_id = $1 AND r.analysis_version = $2
         AND r.corrected_text_version = $4 ORDER BY r.id`,
      [id, version, studentId, jd.corrected_version],
    );
    if (!result.rowCount) throw notFoundError();
    const metadata = result.rows[0] ?? {};
    const requirements = result.rows.map((item) => {
      const requirement = { ...item, confidence: nullableNumber(item.confidence) };
      delete requirement.fallback_used;
      delete requirement.ai_job_id;
      delete requirement.fallback_error_code;
      return requirement;
    });
    return {
      jobDescriptionId: id,
      analysisVersion: version,
      analysisSource: requirements.some((item) => item.source === "GEMINI") ? "GEMINI" : "RULE_BASED",
      fallbackUsed: result.rows.some((item) => item.fallback_used),
      aiJobId: metadata.ai_job_id ?? null,
      fallbackErrorCode: metadata.fallback_error_code ?? null,
      requirements,
    };
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
      if (jd.status !== "ANALYZED") {
        throw new AppError({
          status: 409,
          code: "ANALYSIS_NOT_CURRENT",
          message: "Hãy xác nhận và phân tích phiên bản JD hiện tại trước khi tìm câu hỏi.",
          recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
        });
      }
      const pendingReview = await client.query(
        `SELECT count(*)::int AS count FROM jd_requirements r
         WHERE r.job_description_id = $1 AND r.analysis_version = $2
           AND r.corrected_text_version = $4
           AND r.rule_evidence->>'source' = 'GEMINI' AND r.confidence < 0.75
           AND NOT EXISTS (
             SELECT 1 FROM ai_requirement_decisions d
             WHERE d.requirement_id = r.id AND d.student_id = $3
           )`,
        [id, analysisVersion, studentId, jd.corrected_version],
      );
      if (pendingReview.rows[0].count > 0) {
        throw new AppError({
          status: 409,
          code: "AI_REQUIREMENT_CONFIRMATION_REQUIRED",
          message: "Hãy xác nhận hoặc chỉnh các yêu cầu AI có độ tin cậy thấp trước khi tìm câu hỏi.",
          fieldErrors: { requirements: `${pendingReview.rows[0].count} yêu cầu đang chờ xác nhận` },
          recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
        });
      }
      const requirements = await client.query(
        `SELECT r.*,
          coalesce((SELECT o.topic_id FROM requirement_normalization_overrides o
                    WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1), r.normalized_topic_id) AS effective_topic_id,
          t.name AS topic_name
         FROM jd_requirements r
         LEFT JOIN topics t ON t.id = coalesce((SELECT o.topic_id FROM requirement_normalization_overrides o
                    WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1), r.normalized_topic_id)
         WHERE r.job_description_id = $1 AND r.analysis_version = $2
           AND r.corrected_text_version = $3 AND r.taxonomy_version_id IS NOT NULL
         ORDER BY r.id`,
        [id, analysisVersion, jd.corrected_version],
      );
      if (!requirements.rowCount) {
        throw new AppError({
          status: 409,
          code: "ANALYSIS_NOT_CURRENT",
          message: "Kết quả phân tích không thuộc phiên bản JD hiện tại. Hãy phân tích lại.",
          recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
        });
      }
      const taxonomyVersionIds = [...new Set(requirements.rows.map((requirement) => requirement.taxonomy_version_id))];
      if (taxonomyVersionIds.length !== 1) throw new Error("Analysis has inconsistent taxonomy versions");
      const taxonomyVersionId = taxonomyVersionIds[0];
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
           AND m.corrected_text_version = $4 AND m.taxonomy_version_id = $5
         ORDER BY m.rank`,
        [id, analysisVersion, ruleSet.version, jd.corrected_version, taxonomyVersionId],
      );
      if (existing.rowCount) {
        const body = {
          jobDescriptionId: id,
          analysisVersion,
          matchingVersion: ruleSet.version,
          resultHash: existing.rows[0].result_hash,
          matches: existing.rows.map((row) => ({
            id: row.id, requirementId: row.requirement_id, requirement: row.requirement,
            topic: row.topic, score: Number(row.score), reason: row.reason, rank: row.rank,
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
      const roleRequirements = requirements.rows.filter((requirement) => requirement.requirement_type === "ROLE");
      const seniorityRequirements = requirements.rows.filter((requirement) => requirement.requirement_type === "SENIORITY");
      for (const requirement of requirements.rows) {
        if (!requirement.effective_topic_id) continue;
        const candidates = await client.query(
          `SELECT q.id, q.title, q.content, q.difficulty, t.name AS topic_name,
                  t.priority AS topic_priority,
                  coalesce(array_agg(p.slug) FILTER (WHERE p.id IS NOT NULL), '{}') AS positions
           FROM questions q
           JOIN question_topics qt ON qt.question_id = q.id
           JOIN topics t ON t.id = qt.topic_id
           LEFT JOIN question_positions qp ON qp.question_id = q.id
           LEFT JOIN positions p ON p.id = qp.position_id
           WHERE q.lifecycle_status = 'PUBLISHED' AND t.status = 'ACTIVE' AND t.id = $1
           GROUP BY q.id, t.id
           ORDER BY q.id`,
          [requirement.effective_topic_id],
        );
        for (const candidate of candidates.rows) {
          const { keywordScore, roleScore, seniorityScore, score } = scoreQuestionMatch({
            requirementText: requirement.raw_text,
            candidate,
            ruleSet,
            roleRequirements,
            seniorityRequirements,
          });
          if (score >= ruleSet.threshold) {
            scored.push({ requirement, candidate, score, keywordScore, roleScore, seniorityScore });
          }
        }
      }
      scored.sort((left, right) => right.score - left.score
        || left.candidate.topic_priority - right.candidate.topic_priority
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
        `DELETE FROM jd_question_matches WHERE job_description_id = $1 AND analysis_version = $2
         AND matching_version = $3 AND corrected_text_version = $4 AND taxonomy_version_id = $5`,
        [id, analysisVersion, ruleSet.version, jd.corrected_version, taxonomyVersionId],
      );
      const matches = [];
      for (const [index, item] of selected.entries()) {
        const reason = `Phù hợp chủ đề ${item.requirement.topic_name}; điểm chủ đề ${ruleSet.exact_topic_weight}, từ khóa ${item.keywordScore}, vai trò ${item.roleScore}, cấp độ ${item.seniorityScore}.`;
        const result = await client.query(
          `INSERT INTO jd_question_matches (
             job_description_id, requirement_id, question_id, analysis_version,
             matching_version, score, reason, rule_evidence, result_hash, rank,
             corrected_text_version, taxonomy_version_id
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING id`,
          [id, item.requirement.id, item.candidate.id, analysisVersion, ruleSet.version,
            item.score, reason, { keywordScore: item.keywordScore, roleScore: item.roleScore,
              seniorityScore: item.seniorityScore }, resultHash, index + 1,
            jd.corrected_version, taxonomyVersionId],
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
    const jd = await getOwned(studentId, id);
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
         AND m.corrected_text_version = $3
         AND r.corrected_text_version = $3
       ORDER BY m.rank`,
      [id, analysisVersion ?? null, jd.corrected_version],
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
        score: Number(row.score),
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
        `SELECT m.id, m.requirement_id,
                coalesce((SELECT o.topic_id FROM requirement_normalization_overrides o
                          WHERE o.requirement_id = r.id ORDER BY mapping_input_version DESC LIMIT 1),
                         r.normalized_topic_id) AS normalized_topic_id,
                m.question_id, m.matching_version
         FROM jd_question_matches m
         JOIN jd_requirements r ON r.id = m.requirement_id
         JOIN job_descriptions jd ON jd.id = m.job_description_id
         WHERE m.job_description_id = $1 AND m.id = ANY($2::uuid[])
           AND m.matching_version = $3
           AND jd.status = 'ANALYZED'
           AND m.corrected_text_version = jd.corrected_version
           AND r.corrected_text_version = jd.corrected_version`,
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
        `INSERT INTO preparation_plans (student_id, job_description_id, matching_version, title)
         VALUES ($1, $2, $3, $4) RETURNING id, title, status, version, created_at, updated_at`,
        [studentId, input.jobDescriptionId, input.matchingVersion,
          `Kế hoạch luyện tập · ${new Date().toISOString().slice(0, 10)}`],
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
        title: plan.rows[0].title, matchingVersion: input.matchingVersion,
        status: plan.rows[0].status, createdAt: nullableIsoDate(plan.rows[0].created_at),
        updatedAt: nullableIsoDate(plan.rows[0].updated_at), version: plan.rows[0].version };
    });
  }

  async function getPlan(studentId, id) {
    const plan = await pool.query(
      `SELECT id, title, job_description_id, matching_version, status, version, created_at, updated_at
       FROM preparation_plans WHERE id = $1 AND student_id = $2`,
      [id, studentId],
    );
    if (!plan.rowCount) throw notFoundError();
    const items = await pool.query(
      `SELECT pi.id, pi.priority, pi.practice_status, pi.mentor_next_action, pi.version,
              q.id AS question_id, q.title, q.difficulty,
              r.raw_text AS requirement, t.id AS topic_id, t.name AS topic, m.score, m.reason,
              (SELECT e.explanation FROM ai_recommendation_explanations e
               JOIN ai_jobs aj ON aj.id = e.job_id
               WHERE e.preparation_plan_id = pi.plan_id AND e.candidate_type = 'QUESTION'
                 AND e.candidate_id = q.id AND aj.status = 'SUCCEEDED'
               ORDER BY e.created_at DESC LIMIT 1) AS ai_explanation
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
      title: plan.rows[0].title,
      jobDescriptionId: plan.rows[0].job_description_id,
      matchingVersion: plan.rows[0].matching_version,
      status: plan.rows[0].status,
      createdAt: nullableIsoDate(plan.rows[0].created_at),
      updatedAt: nullableIsoDate(plan.rows[0].updated_at),
      version: plan.rows[0].version,
      items: items.rows.map((row) => ({
        id: row.id,
        priority: row.priority,
        practiceStatus: row.practice_status,
        version: row.version,
        mentorNextAction: row.mentor_next_action,
        requirement: row.requirement,
        topic: row.topic,
        topicId: row.topic_id,
        score: nullableNumber(row.score),
        reason: row.reason,
        aiExplanation: row.ai_explanation,
        question: { id: row.question_id, title: row.title, difficulty: row.difficulty },
      })),
    };
  }

  async function updatePlanItem(studentId, planId, itemId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const selected = await client.query(
        `SELECT pi.*, p.version AS plan_version
         FROM preparation_plan_items pi
         JOIN preparation_plans p ON p.id = pi.plan_id
         WHERE pi.id = $1 AND pi.plan_id = $2 AND p.student_id = $3 AND p.status = 'ACTIVE'
         FOR UPDATE OF pi, p`,
        [itemId, planId, studentId],
      );
      if (!selected.rowCount) throw notFoundError();
      if (selected.rows[0].version !== input.version) {
        throw new AppError({
          status: 409,
          code: "VERSION_CONFLICT",
          message: "Mục trong kế hoạch đã thay đổi. Hãy tải lại kế hoạch.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      const updated = await client.query(
        `UPDATE preparation_plan_items SET
           priority = coalesce($2, priority),
           practice_status = coalesce($3, practice_status),
           updated_at = now(), version = version + 1
         WHERE id = $1
         RETURNING id, plan_id AS "planId", priority, practice_status AS "practiceStatus", version, question_id`,
        [itemId, input.priority ?? null, input.practiceStatus ?? null],
      );
      if (input.practiceStatus && updated.rows[0].question_id) {
        await client.query(
          `INSERT INTO practice_progress(student_id, question_id, status)
           VALUES ($1, $2, $3)
           ON CONFLICT (student_id, question_id) DO UPDATE SET
             status = EXCLUDED.status, updated_at = now(), version = practice_progress.version + 1`,
          [studentId, updated.rows[0].question_id, input.practiceStatus],
        );
      }
      await client.query(
        "UPDATE preparation_plans SET updated_at = now(), version = version + 1 WHERE id = $1",
        [planId],
      );
      await writeAudit(client, {
        actorId: studentId,
        action: "PREPARATION_PLAN_ITEM_UPDATED",
        targetType: "PREPARATION_PLAN",
        targetId: planId,
        correlationId,
        metadata: { itemId, priority: input.priority, practiceStatus: input.practiceStatus },
      });
      const { question_id: ignored, ...body } = updated.rows[0];
      void ignored;
      return body;
    });
  }

  async function updatePlan(studentId, id, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const selected = await client.query(
        `SELECT * FROM preparation_plans
         WHERE id = $1 AND student_id = $2 FOR UPDATE`,
        [id, studentId],
      );
      if (!selected.rowCount) throw notFoundError();
      if (selected.rows[0].version !== input.version) {
        throw new AppError({
          status: 409,
          code: "VERSION_CONFLICT",
          message: "Kế hoạch đã được cập nhật ở nơi khác. Hãy tải lại trước khi lưu.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      const result = await client.query(
        `UPDATE preparation_plans
         SET title = $3, updated_at = now(), version = version + 1
         WHERE id = $1 AND student_id = $2
         RETURNING *`,
        [id, studentId, input.title.trim()],
      );
      await writeAudit(client, {
        actorId: studentId,
        action: "PREPARATION_PLAN_RENAMED",
        targetType: "PREPARATION_PLAN",
        targetId: id,
        correlationId,
      });
      return {
        id: result.rows[0].id,
        title: result.rows[0].title,
        jobDescriptionId: result.rows[0].job_description_id,
        matchingVersion: result.rows[0].matching_version,
        status: result.rows[0].status,
        createdAt: nullableIsoDate(result.rows[0].created_at),
        updatedAt: nullableIsoDate(result.rows[0].updated_at),
        version: result.rows[0].version,
      };
    });
  }

  async function archivePlan(studentId, id, version, correlationId) {
    return withTransaction(pool, async (client) => {
      const selected = await client.query(
        `SELECT * FROM preparation_plans
         WHERE id = $1 AND student_id = $2 FOR UPDATE`,
        [id, studentId],
      );
      if (!selected.rowCount) throw notFoundError();
      if (selected.rows[0].status === "ARCHIVED") {
        return { id, status: "ARCHIVED" };
      }
      if (selected.rows[0].version !== version) {
        throw new AppError({
          status: 409,
          code: "VERSION_CONFLICT",
          message: "Kế hoạch đã được cập nhật ở nơi khác. Hãy tải lại trước khi xóa.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      await client.query(
        `UPDATE preparation_plans
         SET status = 'ARCHIVED', updated_at = now(), version = version + 1
         WHERE id = $1`,
        [id],
      );
      await writeAudit(client, {
        actorId: studentId,
        action: "PREPARATION_PLAN_ARCHIVED",
        targetType: "PREPARATION_PLAN",
        targetId: id,
        correlationId,
      });
      return { id, status: "ARCHIVED" };
    });
  }

  async function listMentorCandidates(studentId, planId, { availableFrom, availableTo, page, pageSize }) {
    const plan = await pool.query(
      `SELECT id, version FROM preparation_plans
       WHERE id = $1 AND student_id = $2 AND status = 'ACTIVE'`,
      [planId, studentId],
    );
    if (!plan.rowCount) throw notFoundError();

    const requestNow = new Date();
    const effectiveFrom = availableFrom
      ? new Date(Math.max(requestNow.getTime(), new Date(availableFrom).getTime()))
      : requestNow;
    const effectiveTo = availableTo ? new Date(availableTo) : null;

    if (effectiveTo && effectiveTo <= effectiveFrom) {
      throw new AppError({
        status: 422,
        code: "VALIDATION_ERROR",
        message: "Khoảng thời gian không hợp lệ",
        fieldErrors: { availableTo: "Thời gian kết thúc phải sau thời gian bắt đầu" },
        recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      });
    }

    const hasAvailabilityFilter = Boolean(availableFrom || availableTo);
    const values = [planId, effectiveFrom.toISOString(), effectiveTo ? effectiveTo.toISOString() : null];

    const expertiseOnlyBase = `
      FROM mentor_profiles mp
      JOIN users u ON u.id = mp.user_id
      WHERE mp.verification_status = 'APPROVED'
        AND EXISTS (
          SELECT 1 FROM mentor_expertise me
          JOIN preparation_plan_items pi ON pi.topic_id = me.topic_id
          WHERE pi.plan_id = $1 AND me.mentor_id = mp.id AND me.status = 'APPROVED'
        )`;

    const base = `
      ${expertiseOnlyBase}
        AND EXISTS (
          SELECT 1 FROM availability_slots sx
          WHERE sx.mentor_id = mp.id AND sx.status = 'AVAILABLE'
            AND sx.starts_at >= $2::timestamptz
            AND ($3::timestamptz IS NULL OR sx.starts_at < $3::timestamptz)
        )`;

    const matchingCountResult = await pool.query(
      `SELECT count(*)::int AS total ${expertiseOnlyBase}`,
      values.slice(0, 1),
    );
    const matchingMentorCount = matchingCountResult.rows[0].total;

    const [items, count] = await Promise.all([
      pool.query(
        `SELECT mp.*, u.display_name,
           (SELECT count(DISTINCT me.topic_id)::int
            FROM mentor_expertise me JOIN preparation_plan_items pi ON pi.topic_id = me.topic_id
            WHERE pi.plan_id = $1 AND me.mentor_id = mp.id AND me.status = 'APPROVED') AS topic_overlap,
           (SELECT count(DISTINCT me.position_id)::int
            FROM mentor_expertise me
            JOIN question_positions qp ON qp.position_id = me.position_id
            JOIN preparation_plan_items pi ON pi.question_id = qp.question_id
            WHERE pi.plan_id = $1 AND me.mentor_id = mp.id AND me.status = 'APPROVED') AS position_fit,
           coalesce((SELECT array_agg(DISTINCT t.name ORDER BY t.name)
            FROM mentor_expertise me JOIN preparation_plan_items pi ON pi.topic_id = me.topic_id
            JOIN topics t ON t.id = me.topic_id
            WHERE pi.plan_id = $1 AND me.mentor_id = mp.id AND me.status = 'APPROVED'), '{}') AS expertise,
           coalesce((SELECT jsonb_agg(slot ORDER BY slot->>'startsAt') FROM (
             SELECT jsonb_build_object('id', s.id, 'startsAt', s.starts_at, 'endsAt', s.ends_at,
               'timezone', s.source_timezone) AS slot
             FROM availability_slots s WHERE s.mentor_id = mp.id AND s.status = 'AVAILABLE'
               AND s.starts_at >= $2::timestamptz
               AND ($3::timestamptz IS NULL OR s.starts_at < $3::timestamptz)
             ORDER BY s.starts_at LIMIT 3
           ) candidate_slots), '[]'::jsonb) AS next_slots,
           (SELECT min(s.starts_at) FROM availability_slots s WHERE s.mentor_id = mp.id
             AND s.status = 'AVAILABLE' AND s.starts_at >= $2::timestamptz
             AND ($3::timestamptz IS NULL OR s.starts_at < $3::timestamptz)) AS first_slot,
           (SELECT e.explanation FROM ai_recommendation_explanations e
            JOIN ai_jobs aj ON aj.id = e.job_id
            WHERE e.preparation_plan_id = $1 AND e.candidate_type = 'MENTOR'
              AND e.candidate_id = mp.id AND aj.status = 'SUCCEEDED'
            ORDER BY e.created_at DESC LIMIT 1) AS ai_explanation
         ${base}
         ORDER BY topic_overlap DESC, position_fit DESC, first_slot, mp.public_rating DESC NULLS LAST, mp.id
         LIMIT $4 OFFSET $5`,
        [...values, pageSize, (page - 1) * pageSize],
      ),
      pool.query(`SELECT count(*)::int AS total ${base}`, values),
    ]);

    const total = count.rows[0].total;
    const availabilityFiltered = hasAvailabilityFilter && total === 0 && matchingMentorCount > 0;
    let emptyReason = null;
    if (total === 0) {
      emptyReason = matchingMentorCount === 0 ? "NO_MATCHING_MENTOR" : "NO_AVAILABLE_SLOT";
    }

    return {
      planId,
      planVersion: plan.rows[0].version,
      items: items.rows.map((row) => ({
        id: row.id,
        displayName: row.display_name,
        headline: row.headline,
        bio: row.bio,
        timezone: row.timezone,
        publicRating: nullableNumber(row.public_rating),
        expertise: row.expertise,
        positionExpertise: [],
        nextSlots: row.next_slots,
        version: row.version,
        topicOverlap: row.topic_overlap,
        positionFit: row.position_fit,
        matchReasons: [
          `Khớp ${row.topic_overlap} chủ đề trong kế hoạch`,
          `Khớp ${row.position_fit} vị trí của nhóm câu hỏi`,
          "Mentor đã được duyệt",
          "Có lịch trống phù hợp",
        ],
        aiExplanation: row.ai_explanation,
      })),
      pageInfo: { page, pageSize, total },
      searchContext: {
        matchingMentorCount,
        availabilityFiltered,
        emptyReason,
      },
    };
  }

  async function startRecommendationExplanations(studentId, planId, correlationId, key) {
    return withTransaction(pool, async (client) => {
      const plan = await client.query(
        `SELECT id, version FROM preparation_plans
         WHERE id = $1 AND student_id = $2 AND status = 'ACTIVE' FOR UPDATE`,
        [planId, studentId],
      );
      if (!plan.rowCount) throw notFoundError();
      const [questions, mentors] = await Promise.all([
        client.query(
          `SELECT q.id FROM preparation_plan_items pi JOIN questions q ON q.id = pi.question_id
           WHERE pi.plan_id = $1 AND q.lifecycle_status = 'PUBLISHED' ORDER BY q.id`,
          [planId],
        ),
        client.query(
          `SELECT mp.id,
             (SELECT count(DISTINCT me.topic_id)::int FROM mentor_expertise me
              JOIN preparation_plan_items pi ON pi.topic_id = me.topic_id
              WHERE pi.plan_id = $1 AND me.mentor_id = mp.id AND me.status = 'APPROVED') AS topic_overlap,
             (SELECT min(s.starts_at) FROM availability_slots s
              WHERE s.mentor_id = mp.id AND s.status = 'AVAILABLE' AND s.starts_at >= now()) AS first_slot
           FROM mentor_profiles mp
           WHERE mp.verification_status = 'APPROVED'
             AND EXISTS (SELECT 1 FROM mentor_expertise me JOIN preparation_plan_items pi ON pi.topic_id = me.topic_id
                         WHERE pi.plan_id = $1 AND me.mentor_id = mp.id AND me.status = 'APPROVED')
             AND EXISTS (SELECT 1 FROM availability_slots s WHERE s.mentor_id = mp.id
                         AND s.status = 'AVAILABLE' AND s.starts_at >= now())
           ORDER BY topic_overlap DESC, first_slot, mp.public_rating DESC NULLS LAST, mp.id LIMIT 20`,
          [planId],
        ),
      ]);
      const input = {
        planVersion: plan.rows[0].version,
        questionIds: questions.rows.map((row) => row.id),
        mentorIds: mentors.rows.map((row) => row.id),
      };
      const idempotency = await findIdempotentResult(client, {
        actorId: studentId,
        operation: "START_RECOMMENDATION_EXPLANATIONS",
        key,
        input: { planId, ...input },
      });
      if (idempotency.cached?.response_body) return idempotency.cached.response_body;
      if (!input.questionIds.length && !input.mentorIds.length) {
        throw new AppError({
          status: 409,
          code: "NO_RECOMMENDATION_CANDIDATES",
          message: "Chưa có câu hỏi hoặc Mentor hợp lệ để tạo giải thích.",
          recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
        });
      }
      const job = await createAiJob(client, {
        actorId: studentId,
        kind: "RECOMMENDATION_EXPLANATION",
        resourceType: "PREPARATION_PLAN",
        resourceId: planId,
        input,
        promptVersion: "recommendation-explanation-v1",
        schemaVersion: "recommendation-explanation-schema-v1",
        correlationId,
        environment,
      });
      await saveIdempotentResult(client, {
        actorId: studentId,
        operation: "START_RECOMMENDATION_EXPLANATIONS",
        key,
        digest: idempotency.digest,
        status: 202,
        body: job,
        resourceId: job.id,
      });
      return job;
    });
  }

  async function listPlans(studentId) {
    const result = await pool.query(
      `SELECT p.id, p.title, p.job_description_id, p.matching_version, p.status,
              p.version, p.created_at, p.updated_at, jd.title AS job_description_title,
              array_remove(array_agg(DISTINCT t.name), NULL) AS topics
       FROM preparation_plans p
       JOIN job_descriptions jd ON jd.id = p.job_description_id
       LEFT JOIN preparation_plan_items pi ON pi.plan_id = p.id
       LEFT JOIN topics t ON t.id = pi.topic_id
       WHERE p.student_id = $1
       GROUP BY p.id, jd.title
       ORDER BY p.updated_at DESC, p.id`,
      [studentId],
    );
    return {
      items: result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        jobDescriptionId: row.job_description_id,
        jobDescriptionTitle: row.job_description_title,
        matchingVersion: row.matching_version,
        status: row.status,
        topics: row.topics,
        createdAt: nullableIsoDate(row.created_at),
        updatedAt: nullableIsoDate(row.updated_at),
        version: row.version,
      })),
      pageInfo: { page: 1, pageSize: result.rowCount, total: result.rowCount },
    };
  }

  return {
    createFromText,
    createFromFile,
    extractFromFileWithAi,
    get,
    list,
    updateJobDescription,
    archiveJobDescription,
    startExtraction,
    retryExtraction,
    saveCorrectedText,
    confirmText,
    startAiAnalysis,
    saveAiAnalysis,
    analyze,
    saveNormalizations,
    decideRequirement,
    getAnalysis,
    match,
    getMatches,
    createPlan,
    getPlan,
    updatePlan,
    archivePlan,
    updatePlanItem,
    listMentorCandidates,
    startRecommendationExplanations,
    listPlans,
  };
}
